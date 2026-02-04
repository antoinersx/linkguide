// LinkGuide Frontend - Modern Mobile Onboarding Style
// Inspired by Cal AI and similar premium apps

class LinkGuide {
  constructor() {
    this.username = this.extractUsername();
    this.sessionId = null;
    this.config = null;
    this.answers = {};
    this.history = [];
    this.currentQuestion = null;
    this.selectedOption = null;
    this.totalQuestions = 3; // Approximate for progress bar
    
    this.init();
  }
  
  extractUsername() {
    const path = window.location.pathname;
    const match = path.match(/\/@([^\/]+)/);
    return match ? match[1] : 'demo';
  }
  
  async init() {
    try {
      await this.loadSurvey();
    } catch (err) {
      console.error('Failed to initialize:', err);
      this.showError();
    }
  }
  
  async loadSurvey() {
    const res = await fetch(`/api/survey/${this.username}`);
    if (!res.ok) throw new Error('Failed to load survey');
    
    const data = await res.json();
    this.sessionId = data.sessionId;
    this.config = data;
    this.totalQuestions = data.questions?.length || 3;
    
    if (data.firstQuestion) {
      await this.loadQuestion(data.firstQuestion);
    } else {
      this.showNoQuestions();
    }
  }
  
  async loadQuestion(questionId) {
    const res = await fetch(`/api/survey/${this.username}/question/${questionId}`);
    if (!res.ok) throw new Error('Failed to load question');
    
    this.currentQuestion = await res.json();
    this.selectedOption = null;
    this.renderQuestion();
  }
  
  renderQuestion() {
    const app = document.getElementById('app');
    const q = this.currentQuestion;
    const progress = this.calculateProgress();
    const hasIcons = q.options?.some(opt => this.getIcon(opt.label));
    
    app.innerHTML = `
      <header class="header">
        ${this.history.length > 0 ? `
          <button class="back-btn" onclick="guide.goBack()" aria-label="Go back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        ` : '<div style="width: 40px;"></div>'}
        
        <div class="progress-container">
          <div class="progress-fill" style="width: ${progress.percent}%"></div>
        </div>
        
        <div class="header-spacer"></div>
      </header>
      
      <main class="content">
        <div class="question-header">
          <h1 class="question-title">${q.text}</h1>
          ${q.subtitle ? `<p class="question-subtitle">${q.subtitle}</p>` : ''}
        </div>
        
        <div class="options-list">
          ${q.options.map((opt, idx) => this.renderOption(opt, idx, hasIcons)).join('')}
        </div>
      </main>
      
      <div class="bottom-bar">
        <button class="next-btn" id="nextBtn" onclick="guide.handleNext()" disabled>
          Next
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    `;
  }
  
  renderOption(opt, idx, hasIcons) {
    const value = opt.value || opt.label;
    const icon = this.getIcon(opt.label);
    
    if (hasIcons) {
      return `
        <button class="option-card" data-value="${value}" data-next="${opt.next || ''}" onclick="guide.selectOption('${value}', '${opt.next || ''}')">
          <div class="option-icon">${icon}</div>
          <div class="option-content">
            <span class="option-label">${this.stripEmoji(opt.label)}</span>
            ${opt.description ? `<span class="option-description">${opt.description}</span>` : ''}
          </div>
          <div class="option-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </button>
      `;
    } else {
      // Simple text option without icons
      return `
        <button class="option-simple" data-value="${value}" data-next="${opt.next || ''}" onclick="guide.selectOption('${value}', '${opt.next || ''}')">
          ${this.stripEmoji(opt.label)}
        </button>
      `;
    }
  }
  
  selectOption(value, nextQuestionId) {
    this.selectedOption = { value, next: nextQuestionId };
    
    // Update UI
    document.querySelectorAll('.option-card, .option-simple').forEach(el => {
      el.classList.remove('selected');
    });
    
    const selectedEl = document.querySelector(`[data-value="${value}"]`);
    if (selectedEl) {
      selectedEl.classList.add('selected');
    }
    
    // Enable next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }
  
  async handleNext() {
    if (!this.selectedOption) return;
    
    const { value, next } = this.selectedOption;
    
    // Store answer
    this.answers[this.currentQuestion.id] = value;
    this.history.push(this.currentQuestion.id);
    
    // Submit to server
    await fetch(`/api/survey/${this.username}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        questionId: this.currentQuestion.id,
        answer: value
      })
    });
    
    // Next question or result
    if (next) {
      await this.loadQuestion(next);
    } else {
      await this.showResult();
    }
  }
  
  async goBack() {
    if (this.history.length === 0) return;
    
    // Remove last answer
    const lastQuestionId = this.history.pop();
    delete this.answers[lastQuestionId];
    
    // Track drop-off
    await fetch(`/api/survey/${this.username}/dropoff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        questionId: lastQuestionId
      })
    });
    
    // Go to previous question
    if (this.history.length > 0) {
      // Find the question that points to the next one
      const prevQuestionId = this.history[this.history.length - 1];
      // We need to reload from server to get the correct state
      await this.loadQuestion(prevQuestionId);
    } else {
      await this.loadQuestion(this.config.firstQuestion);
    }
  }
  
  async showResult() {
    const res = await fetch(`/api/survey/${this.username}/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        answers: this.answers
      })
    });
    
    if (!res.ok) throw new Error('Failed to get result');
    const result = await res.json();
    
    this.renderResult(result);
  }
  
  renderResult(result) {
    const app = document.getElementById('app');
    
    app.innerHTML = `
      <header class="header">
        <div style="width: 40px;"></div>
        <div class="progress-container">
          <div class="progress-fill" style="width: 100%"></div>
        </div>
        <div class="header-spacer"></div>
      </header>
      
      <main class="content">
        <div class="result-container">
          <div class="result-icon">${result.emoji || '🎯'}</div>
          
          <div class="result-badge">Perfect Match</div>
          
          <h1 class="result-title">${result.label}</h1>
          
          <p class="result-description">${result.description}</p>
          
          <div class="result-cta">
            <a href="${result.url}" 
               class="next-btn" 
               target="_blank" 
               rel="noopener"
               onclick="guide.trackClick('${result.url}', '${result.label}')">
              ${result.cta || 'Get Access'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </a>
          </div>
          
          ${this.config.links && this.config.links.length > 0 ? `
            <div class="secondary-links">
              <p class="secondary-title">Connect with me</p>
              <div class="social-grid">
                ${this.config.links.map(link => `
                  <a href="${link.url}" 
                     class="social-btn" 
                     target="_blank"
                     rel="noopener"
                     title="${link.label}"
                     onclick="guide.trackClick('${link.url}', '${link.label}')">
                    ${this.getSocialIcon(link.icon)}
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <button class="restart-btn" onclick="guide.restart()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Start over
          </button>
        </div>
      </main>
    `;
  }
  
  trackClick(url, label) {
    fetch(`/api/survey/${this.username}/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        url,
        label
      })
    });
  }
  
  restart() {
    this.answers = {};
    this.history = [];
    this.selectedOption = null;
    this.loadQuestion(this.config.firstQuestion);
  }
  
  calculateProgress() {
    const current = this.history.length + 1;
    const total = this.totalQuestions;
    const percent = Math.min((current / total) * 100, 95);
    return { current, total, percent };
  }
  
  getIcon(label) {
    const lower = label.toLowerCase();
    
    // Price tiers
    if (lower.includes('free') || lower.includes('starting') || lower.includes('$0')) return '🆓';
    if (lower.includes('$100') || lower.includes('low') || lower.includes('cheap')) return '💶';
    if (lower.includes('$1k') || lower.includes('$5k') || lower.includes('medium')) return '💵';
    if (lower.includes('$10k') || lower.includes('$50k') || lower.includes('high') || lower.includes('premium')) return '💎';
    
    // Experience levels
    if (lower.includes('beginner') || lower.includes('starting')) return '🌱';
    if (lower.includes('intermediate')) return '⚡';
    if (lower.includes('advanced') || lower.includes('expert')) return '🔥';
    
    // Categories
    if (lower.includes('business')) return '💼';
    if (lower.includes('investing')) return '📈';
    if (lower.includes('trading')) return '📊';
    if (lower.includes('ai') || lower.includes('automation')) return '🤖';
    if (lower.includes('crypto') || lower.includes('web3')) return '₿';
    if (lower.includes('learning') || lower.includes('growth')) return '📚';
    
    // Creator/Solopreneur
    if (lower.includes('creator')) return '🎨';
    if (lower.includes('founder')) return '🚀';
    if (lower.includes('freelancer') || lower.includes('service')) return '🔧';
    
    // Goals
    if (lower.includes('growth') || lower.includes('audience')) return '📈';
    if (lower.includes('monetize') || lower.includes('money')) return '💰';
    if (lower.includes('partnership') || lower.includes('deal')) return '🤝';
    
    // Challenges
    if (lower.includes('lead') || lower.includes('client')) return '📣';
    if (lower.includes('system') || lower.includes('operation')) return '⚙️';
    if (lower.includes('hiring') || lower.includes('team')) return '👥';
    if (lower.includes('pricing')) return '🏷️';
    if (lower.includes('confidence')) return '💪';
    if (lower.includes('portfolio') || lower.includes('case study')) return '💼';
    
    // Format/Style
    if (lower.includes('done for you') || lower.includes('service')) return '🎯';
    if (lower.includes('community')) return '👥';
    if (lower.includes('diy') || lower.includes('template') || lower.includes('checklist')) return '🛠';
    if (lower.includes('tool')) return '🧰';
    if (lower.includes('course')) return '🎓';
    
    // Social/Links
    if (lower.includes('twitter') || lower.includes('x')) return '🐦';
    if (lower.includes('youtube')) return '▶️';
    if (lower.includes('mail') || lower.includes('newsletter')) return '✉️';
    if (lower.includes('instagram')) return '📷';
    if (lower.includes('linkedin')) return '💼';
    if (lower.includes('github')) return '💻';
    
    // Default: first letter as emoji-style character
    const firstChar = label.charAt(0).toUpperCase();
    return firstChar;
  }
  
  getSocialIcon(iconName) {
    const icons = {
      twitter: '🐦',
      x: '𝕏',
      mail: '✉️',
      email: '✉️',
      youtube: '▶️',
      instagram: '📷',
      linkedin: '💼',
      github: '💻',
      website: '🌐',
      default: '🔗'
    };
    return icons[iconName] || icons.default;
  }
  
  stripEmoji(text) {
    return text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
  }
  
  showError() {
    document.getElementById('app').innerHTML = `
      <div class="error-container">
        <div class="error-icon">😕</div>
        <h2 class="error-title">Something went wrong</h2>
        <p class="error-message">Please refresh the page and try again</p>
      </div>
    `;
  }
  
  showNoQuestions() {
    document.getElementById('app').innerHTML = `
      <div class="error-container">
        <div class="error-icon">📋</div>
        <h2 class="error-title">No questions yet</h2>
        <p class="error-message">This survey hasn't been configured</p>
      </div>
    `;
  }
}

// Initialize
guide = new LinkGuide();
