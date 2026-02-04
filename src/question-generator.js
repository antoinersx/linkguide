// AI Question Generator v2
// Creates optimal survey flow with max 5 options per screen

class QuestionGenerator {
  constructor(resources) {
    this.resources = resources;
    this.questions = [];
    this.rules = [];
    this.MAX_OPTIONS = 5;
  }

  generate() {
    // Group resources by differentiating factors
    const analysis = this.analyzeResources();
    
    // Build question tree with max 5 options per level
    this.buildQuestionTree(analysis);
    
    // Build routing rules
    this.buildRules();
    
    return {
      title: "Let's find the right resource for you",
      subtitle: "Answer a few quick questions",
      questions: this.questions,
      rules: this.rules,
      default: this.getDefaultResource()
    };
  }

  analyzeResources() {
    // Group resources by category
    const byCategory = {};
    const byPrice = {};
    const byFormat = {};
    
    this.resources.forEach(r => {
      // By category
      if (!byCategory[r.category]) byCategory[r.category] = [];
      byCategory[r.category].push(r);
      
      // By price
      if (!byPrice[r.price]) byPrice[r.price] = [];
      byPrice[r.price].push(r);
      
      // By format
      if (!byFormat[r.format]) byFormat[r.format] = [];
      byFormat[r.format].push(r);
    });

    return {
      categories: Object.keys(byCategory),
      byCategory,
      prices: Object.keys(byPrice),
      byPrice,
      formats: Object.keys(byFormat),
      byFormat
    };
  }

  buildQuestionTree(analysis) {
    let questionId = 1;
    const categoryToQuestionId = {};

    // Q1: Category (if > 5 categories, group them)
    if (analysis.categories.length > 0) {
      const categoryOptions = this.buildCategoryOptions(analysis.categories);
      
      this.questions.push({
        id: `q${questionId}`,
        text: "What are you most interested in?",
        subtitle: "Pick what resonates with your current focus",
        type: "single",
        options: categoryOptions.map(opt => {
          categoryToQuestionId[opt.value] = `q${questionId + 1}`;
          return {
            label: opt.label,
            value: opt.value,
            description: opt.description,
            next: `q${questionId + 1}`
          };
        })
      });
      questionId++;
    }

    // Q2: Price/Budget (always ask this)
    const priceOptions = this.buildPriceOptions();
    this.questions.push({
      id: `q${questionId}`,
      text: "What's your budget?",
      subtitle: "This helps me recommend the right fit",
      type: "single",
      options: priceOptions.map(opt => ({
        label: opt.label,
        value: opt.value,
        description: opt.description,
        next: `q${questionId + 1}`
      }))
    });
    questionId++;

    // Q3: Format preference (if we have different formats)
    if (analysis.formats.length > 1) {
      const formatOptions = this.buildFormatOptions(analysis.formats);
      
      this.questions.push({
        id: `q${questionId}`,
        text: "How do you prefer to work?",
        subtitle: "Choose your style",
        type: "single",
        options: formatOptions.map(opt => ({
          label: opt.label,
          value: opt.value,
          description: opt.description,
          next: `q${questionId + 1}`
        }))
      });
      questionId++;
    }

    // Q4: Experience level (only for certain categories)
    const needsExperience = analysis.categories.some(c => 
      ['investing', 'trading', 'crypto'].includes(c)
    );
    
    if (needsExperience) {
      this.questions.push({
        id: `q${questionId}`,
        text: "What's your experience level?",
        subtitle: "In your primary area of interest",
        type: "single",
        options: [
          { label: "🌱 Beginner", value: "beginner", description: "Just getting started" },
          { label: "⚡ Intermediate", value: "intermediate", description: "Some experience" },
          { label: "🔥 Advanced", value: "advanced", description: "Looking for edge" }
        ]
      });
      questionId++;
    }

    // Remove 'next' from last question
    this.questions[this.questions.length - 1].options.forEach(opt => delete opt.next);
  }

  buildCategoryOptions(categories) {
    const categoryMap = {
      'business': { label: '💼 Business', desc: 'Growth, systems, scaling' },
      'learning': { label: '📚 Learning', desc: 'Skills, community' },
      'investing': { label: '📈 Investing', desc: 'Deals, portfolio' },
      'trading': { label: '📊 Trading', desc: 'Active trading' },
      'ai': { label: '🤖 AI & Tech', desc: 'Automation, tools' },
      'crypto': { label: '₿ Crypto', desc: 'Web3, DeFi' }
    };

    // If more than 5 categories, group the less common ones
    if (categories.length > this.MAX_OPTIONS) {
      const mainCats = categories.slice(0, 4);
      const otherCats = categories.slice(4);
      
      const options = mainCats.map(cat => ({
        label: categoryMap[cat]?.label || cat,
        value: cat,
        description: categoryMap[cat]?.desc || ''
      }));
      
      options.push({
        label: '📦 Other',
        value: 'other',
        description: 'More options'
      });
      
      return options;
    }

    return categories.map(cat => ({
      label: categoryMap[cat]?.label || cat,
      value: cat,
      description: categoryMap[cat]?.desc || ''
    }));
  }

  buildPriceOptions() {
    return [
      { label: "🆓 Just starting", value: "starting", description: "$0 - figuring things out" },
      { label: "💶 $1K - $10K/mo", value: "1k_10k", description: "Making money, inconsistent" },
      { label: "💵 $10K - $50K/mo", value: "10k_50k", description: "Stable, want to scale" },
      { label: "💎 $50K+/mo", value: "50k_plus", description: "Scaling & systematizing" }
    ];
  }

  buildFormatOptions(formats) {
    const formatMap = {
      'done_for_you': { label: '🎯 Done For You', desc: 'You implement for me' },
      'community': { label: '👥 Community', desc: 'Learn with others' },
      'tools': { label: '🧰 Tools', desc: 'Software & dashboards' },
      'checklist': { label: '📋 Templates', desc: 'DIY with guides' },
      'course': { label: '🎓 Course', desc: 'Learn at my pace' }
    };

    // If more than 5 formats, group similar ones
    let processed = formats.map(f => ({
      label: formatMap[f]?.label || f,
      value: f,
      description: formatMap[f]?.desc || ''
    }));

    if (processed.length > this.MAX_OPTIONS) {
      // Group tools and checklists as "DIY Resources"
      const diyFormats = ['tools', 'checklist', 'course'];
      const hasDiy = formats.some(f => diyFormats.includes(f));
      
      processed = processed.filter(p => !diyFormats.includes(p.value));
      
      if (hasDiy) {
        processed.push({
          label: '🛠 DIY Resources',
          value: 'diy',
          description: 'Tools, templates & courses'
        });
      }
    }

    return processed.slice(0, this.MAX_OPTIONS);
  }

  buildRules() {
    this.resources.forEach(resource => {
      const conditions = {};
      
      // Build conditions based on question flow
      if (this.questions[0]) {
        conditions[this.questions[0].id] = resource.category;
      }
      
      if (this.questions[1]) {
        conditions[this.questions[1].id] = resource.price;
      }
      
      if (this.questions[2] && this.questions[2].text.includes('prefer')) {
        const formatValue = ['tools', 'checklist', 'course'].includes(resource.format) 
          ? 'diy' 
          : resource.format;
        conditions[this.questions[2].id] = formatValue;
      }
      
      if (this.questions.find(q => q.text.includes('experience'))) {
        const expQ = this.questions.find(q => q.text.includes('experience'));
        if (resource.requirements?.experience) {
          const exp = Array.isArray(resource.requirements.experience) 
            ? resource.requirements.experience[0]
            : resource.requirements.experience;
          conditions[expQ.id] = exp;
        }
      }

      this.rules.push({
        if: conditions,
        then: {
          url: resource.url,
          label: resource.name,
          description: resource.description,
          cta: this.getCTA(resource),
          emoji: this.getEmoji(resource)
        }
      });
    });
  }

  getCTA(resource) {
    const ctas = {
      'high_ticket': 'Book a Call',
      'cool_community': 'Join Community',
      'investment_community': 'Join Waitlist',
      'trading_tools': 'Get Access',
      'ai_tools_checklist': 'Download Free',
      'crypto_tools_checklist': 'Download Free'
    };
    return ctas[resource.id] || 'Get Access';
  }

  getEmoji(resource) {
    const emojis = {
      'high_ticket': '🎯',
      'cool_community': '👥',
      'investment_community': '📈',
      'trading_tools': '📊',
      'ai_tools_checklist': '🤖',
      'crypto_tools_checklist': '₿'
    };
    return emojis[resource.id] || '🔗';
  }

  getDefaultResource() {
    const free = this.resources.find(r => r.price === 'free');
    if (free) {
      return {
        url: free.url,
        label: free.name,
        description: free.description,
        cta: this.getCTA(free),
        emoji: this.getEmoji(free)
      };
    }
    
    return {
      url: 'https://twitter.com',
      label: 'Connect with me',
      description: "Let's chat about what you need",
      cta: 'DM Me',
      emoji: '👋'
    };
  }
}

module.exports = QuestionGenerator;
