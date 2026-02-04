const fastify = require('fastify')({ logger: false });
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const QuestionGenerator = require('./question-generator');

const RESOURCES_PATH = path.join(__dirname, '../config/resources.json');
const PORT = process.env.PORT || 3000;
const UPDATE_TOKEN = process.env.UPDATE_TOKEN || 'dev-token-change-in-prod';

let resourcesConfig = null;
let generatedSurvey = null;

const db = new sqlite3.Database(path.join(__dirname, '../analytics.db'));

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function initDB() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      referrer TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await dbRun(`
    CREATE TABLE IF NOT EXISTS survey_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      session_id TEXT UNIQUE NOT NULL,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      drop_off_at_question TEXT,
      result_url TEXT
    )
  `);
  
  await dbRun(`
    CREATE TABLE IF NOT EXISTS question_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      answer TEXT NOT NULL,
      answered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await dbRun(`
    CREATE TABLE IF NOT EXISTS link_clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      url TEXT NOT NULL,
      label TEXT,
      clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function loadResources() {
  try {
    const content = fs.readFileSync(RESOURCES_PATH, 'utf8');
    resourcesConfig = JSON.parse(content);
    
    const generator = new QuestionGenerator(resourcesConfig.resources);
    generatedSurvey = generator.generate();
    generatedSurvey.links = resourcesConfig.links || [];
    
    console.log('Resources loaded and survey generated');
    console.log('Questions:', generatedSurvey.questions.length);
    console.log('Rules:', generatedSurvey.rules.length);
    return true;
  } catch (err) {
    console.error('Failed to load resources:', err.message);
    return false;
  }
}

function watchResources() {
  fs.watchFile(RESOURCES_PATH, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      console.log('Resources file changed, regenerating survey...');
      loadResources();
    }
  });
}

async function setupRoutes() {
  await fastify.register(require('@fastify/cors'), { origin: true });
  await fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '../public'),
    prefix: '/'
  });

  fastify.get('/api/health', async () => ({
    status: 'ok',
    resourcesLoaded: !!resourcesConfig,
    questionsCount: generatedSurvey && generatedSurvey.questions ? generatedSurvey.questions.length : 0,
    resourcesCount: resourcesConfig && resourcesConfig.resources ? resourcesConfig.resources.length : 0
  }));

  fastify.get('/api/survey/:username', async (request, reply) => {
    const { username } = request.params;
    const ip = request.ip;
    const userAgent = request.headers['user-agent'];
    const referrer = request.headers.referer || '';
    
    await dbRun(
      'INSERT INTO page_views (username, ip, user_agent, referrer) VALUES (?, ?, ?, ?)',
      [username, ip, userAgent, referrer]
    );
    
    const sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    await dbRun(
      'INSERT INTO survey_sessions (username, session_id) VALUES (?, ?)',
      [username, sessionId]
    );
    
    if (!generatedSurvey) {
      return reply.status(500).send({ error: 'Survey not generated' });
    }
    
    return {
      sessionId,
      theme: { primary: '#000000', background: '#ffffff', accent: '#007AFF' },
      firstQuestion: generatedSurvey.questions[0] ? generatedSurvey.questions[0].id : null,
      questions: generatedSurvey.questions.map(q => ({
        id: q.id,
        text: q.text,
        subtitle: q.subtitle,
        type: q.type,
        options: q.options ? q.options.map(o => ({ 
          label: o.label, 
          value: o.value,
          description: o.description
        })) : []
      })),
      links: generatedSurvey.links
    };
  });

  fastify.get('/api/survey/:username/question/:questionId', async (request, reply) => {
    const { questionId } = request.params;
    const question = generatedSurvey && generatedSurvey.questions ? 
      generatedSurvey.questions.find(q => q.id === questionId) : null;
    
    if (!question) {
      return reply.status(404).send({ error: 'Question not found' });
    }
    
    return {
      id: question.id,
      text: question.text,
      subtitle: question.subtitle,
      type: question.type,
      options: question.options ? question.options.map(o => ({
        label: o.label,
        value: o.value,
        description: o.description,
        next: o.next || null
      })) : []
    };
  });

  fastify.post('/api/survey/:username/answer', async (request, reply) => {
    const { sessionId, questionId, answer } = request.body;
    
    if (!sessionId || !questionId || !answer) {
      return reply.status(400).send({ error: 'Missing required fields' });
    }
    
    await dbRun(
      'INSERT INTO question_answers (session_id, question_id, answer) VALUES (?, ?, ?)',
      [sessionId, questionId, JSON.stringify(answer)]
    );
    
    return { success: true };
  });

  fastify.post('/api/survey/:username/result', async (request, reply) => {
    const { sessionId, answers } = request.body;
    
    if (!generatedSurvey) {
      return reply.status(500).send({ error: 'Survey not configured' });
    }
    
    let matchedRule = null;
    
    for (const rule of generatedSurvey.rules) {
      const matches = Object.entries(rule.if).every(([key, value]) => {
        return answers[key] === value;
      });
      
      if (matches) {
        matchedRule = rule;
        break;
      }
    }
    
    const result = matchedRule ? matchedRule.then : generatedSurvey.default;
    
    await dbRun(
      'UPDATE survey_sessions SET completed_at = CURRENT_TIMESTAMP, result_url = ? WHERE session_id = ?',
      [result.url, sessionId]
    );
    
    return {
      url: result.url,
      label: result.label,
      description: result.description,
      cta: result.cta,
      emoji: result.emoji,
      matched: !!matchedRule
    };
  });

  fastify.post('/api/survey/:username/click', async (request, reply) => {
    const { sessionId, url, label } = request.body;
    await dbRun(
      'INSERT INTO link_clicks (session_id, url, label) VALUES (?, ?, ?)',
      [sessionId, url, label]
    );
    return { success: true };
  });

  fastify.post('/api/survey/:username/dropoff', async (request, reply) => {
    const { sessionId, questionId } = request.body;
    await dbRun(
      'UPDATE survey_sessions SET drop_off_at_question = ? WHERE session_id = ?',
      [questionId, sessionId]
    );
    return { success: true };
  });

  fastify.get('/api/admin/resources', async (request, reply) => {
    const token = request.headers['x-token'];
    if (token !== UPDATE_TOKEN) return reply.status(401).send({ error: 'Unauthorized' });
    return resourcesConfig;
  });

  fastify.post('/api/admin/resources', async (request, reply) => {
    const token = request.headers['x-token'];
    if (token !== UPDATE_TOKEN) return reply.status(401).send({ error: 'Unauthorized' });
    
    const newConfig = request.body;
    if (!newConfig.resources || !Array.isArray(newConfig.resources)) {
      return reply.status(400).send({ error: 'Invalid: resources array required' });
    }
    
    try {
      fs.writeFileSync(RESOURCES_PATH, JSON.stringify(newConfig, null, 2));
      resourcesConfig = newConfig;
      
      const generator = new QuestionGenerator(newConfig.resources);
      generatedSurvey = generator.generate();
      generatedSurvey.links = newConfig.links || [];
      
      return { 
        success: true, 
        message: 'Resources updated and survey regenerated',
        stats: {
          resources: newConfig.resources.length,
          questions: generatedSurvey.questions.length,
          rules: generatedSurvey.rules.length
        }
      };
    } catch (err) {
      return reply.status(500).send({ error: err.message });
    }
  });

  fastify.get('/api/admin/survey', async (request, reply) => {
    const token = request.headers['x-token'];
    if (token !== UPDATE_TOKEN) return reply.status(401).send({ error: 'Unauthorized' });
    return generatedSurvey;
  });

  fastify.post('/api/admin/regenerate', async (request, reply) => {
    const token = request.headers['x-token'];
    if (token !== UPDATE_TOKEN) return reply.status(401).send({ error: 'Unauthorized' });
    
    loadResources();
    return { 
      success: true, 
      message: 'Survey regenerated',
      questions: generatedSurvey.questions.length,
      rules: generatedSurvey.rules.length
    };
  });

  fastify.get('/api/admin/analytics', async (request, reply) => {
    const token = request.headers['x-token'];
    if (token !== UPDATE_TOKEN) return reply.status(401).send({ error: 'Unauthorized' });
    
    const pageViews = (await dbGet('SELECT COUNT(*) as count FROM page_views')).count;
    const sessions = (await dbGet('SELECT COUNT(*) as count FROM survey_sessions')).count;
    const completions = (await dbGet('SELECT COUNT(*) as count FROM survey_sessions WHERE completed_at IS NOT NULL')).count;
    const linkClicks = (await dbGet('SELECT COUNT(*) as count FROM link_clicks')).count;
    
    const topLinks = await dbAll(`
      SELECT url, label, COUNT(*) as clicks 
      FROM link_clicks 
      GROUP BY url 
      ORDER BY clicks DESC 
      LIMIT 10
    `);
    
    const dropOffs = await dbAll(`
      SELECT drop_off_at_question, COUNT(*) as count 
      FROM survey_sessions 
      WHERE drop_off_at_question IS NOT NULL 
      GROUP BY drop_off_at_question
    `);

    return {
      pageViews,
      sessions,
      completions,
      linkClicks,
      completionRate: sessions > 0 ? Math.round((completions / sessions) * 100) : 0,
      topLinks,
      dropOffs
    };
  });

  fastify.get('/admin', async (request, reply) => reply.sendFile('admin.html'));
  fastify.get('/flow', async (request, reply) => reply.sendFile('flow-builder.html'));
  fastify.get('/', async (request, reply) => reply.redirect('/@demo'));
  fastify.get('/@:username', async (request, reply) => reply.sendFile('index.html'));
}

async function start() {
  await initDB();
  
  if (!loadResources()) {
    console.log('Creating sample resources...');
    const sampleResources = {
      owner: 'demo',
      resources: [
        {
          id: 'starter',
          name: 'Getting Started Guide',
          description: 'Free guide to get you started',
          url: 'https://example.com/guide',
          price: 'free',
          format: 'checklist',
          category: 'learning',
          requirements: {},
          tags: ['free', 'starter']
        }
      ],
      links: []
    };
    fs.writeFileSync(RESOURCES_PATH, JSON.stringify(sampleResources, null, 2));
    loadResources();
  }
  
  watchResources();
  await setupRoutes();
  
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log('LinkGuide (Resource-First) running!');
    console.log('Public survey: http://localhost:' + PORT + '/@demo');
    console.log('Admin: http://localhost:' + PORT + '/admin');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
