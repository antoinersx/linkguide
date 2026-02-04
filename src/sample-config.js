module.exports = {
  "username": "demo",
  "title": "What are you looking for?",
  "subtitle": "Answer 2 quick questions and I'll point you to the right place",
  "theme": {
    "primary": "#6366f1",
    "primaryGradient": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    "background": "#0f0f23",
    "surface": "#1a1a2e",
    "text": "#ffffff",
    "textSecondary": "#a1a1aa",
    "accent": "#22d3ee"
  },
  "questions": [
    {
      "id": "role",
      "text": "Which best describes you?",
      "type": "single",
      "options": [
        {
          "label": "🎨 Creator",
          "value": "creator",
          "description": "You make content, art, or build an audience",
          "next": "creator_goal"
        },
        {
          "label": "💼 Business Owner",
          "value": "business",
          "description": "You run a company or service",
          "next": "business_goal"
        },
        {
          "label": "🚀 Founder",
          "value": "founder",
          "description": "You're building a startup",
          "next": "founder_stage"
        }
      ]
    },
    {
      "id": "creator_goal",
      "text": "What's your main goal right now?",
      "type": "single",
      "options": [
        {
          "label": "📈 Grow my audience",
          "value": "growth",
          "description": "More followers, subscribers, reach"
        },
        {
          "label": "💰 Monetize my content",
          "value": "monetize",
          "description": "Turn views into revenue"
        },
        {
          "label": "🤝 Get brand deals",
          "value": "partnerships",
          "description": "Work with brands and sponsors"
        }
      ]
    },
    {
      "id": "business_goal",
      "text": "What does your business need most?",
      "type": "single",
      "options": [
        {
          "label": "📣 More leads & customers",
          "value": "leads",
          "description": "Drive sales and acquisition"
        },
        {
          "label": "⚙️ Better systems",
          "value": "systems",
          "description": "Automate and scale operations"
        },
        {
          "label": "👥 Build a team",
          "value": "hiring",
          "description": "Find and hire great people"
        }
      ]
    },
    {
      "id": "founder_stage",
      "text": "What stage are you at?",
      "type": "single",
      "options": [
        {
          "label": "💡 Idea stage",
          "value": "idea",
          "description": "Validating and researching"
        },
        {
          "label": "🔨 Building MVP",
          "value": "mvp",
          "description": "Product in development"
        },
        {
          "label": "📊 Already have users",
          "value": "growth",
          "description": "Scaling and optimizing"
        }
      ]
    }
  ],
  "rules": [
    {
      "if": {
        "role": "creator",
        "creator_goal": "monetize"
      },
      "then": {
        "url": "https://gumroad.com",
        "label": "Monetization Playbook",
        "description": "The exact framework I used to earn my first $10K from content",
        "cta": "Get the Playbook",
        "emoji": "💰"
      }
    },
    {
      "if": {
        "role": "creator",
        "creator_goal": "growth"
      },
      "then": {
        "url": "https://twitter.com",
        "label": "Growth Framework",
        "description": "My content strategy that grew me from 0 to 50K followers",
        "cta": "Get the Framework",
        "emoji": "📈"
      }
    },
    {
      "if": {
        "role": "creator",
        "creator_goal": "partnerships"
      },
      "then": {
        "url": "https://calendly.com",
        "label": "1-on-1 Strategy Call",
        "description": "Let's discuss your brand and find perfect partnerships",
        "cta": "Book a Call",
        "emoji": "🤝"
      }
    },
    {
      "if": {
        "role": "business",
        "business_goal": "leads"
      },
      "then": {
        "url": "https://mailchimp.com",
        "label": "Lead Generation System",
        "description": "The automated funnel that brings us 100+ qualified leads/month",
        "cta": "See the System",
        "emoji": "📣"
      }
    },
    {
      "if": {
        "role": "business",
        "business_goal": "systems"
      },
      "then": {
        "url": "https://notion.so",
        "label": "Business OS Template",
        "description": "The Notion system we use to run our 7-figure business",
        "cta": "Get the Template",
        "emoji": "⚙️"
      }
    },
    {
      "if": {
        "role": "founder",
        "founder_stage": "idea"
      },
      "then": {
        "url": "https://figma.com",
        "label": "Idea Validation Kit",
        "description": "Test your idea before writing a single line of code",
        "cta": "Get the Kit",
        "emoji": "💡"
      }
    },
    {
      "if": {
        "role": "founder",
        "founder_stage": "mvp"
      },
      "then": {
        "url": "https://github.com",
        "label": "MVP Launch Checklist",
        "description": "Everything you need to ship in the next 30 days",
        "cta": "Get the Checklist",
        "emoji": "🔨"
      }
    }
  ],
  "default": {
    "url": "https://linktr.ee",
    "label": "All My Links",
    "description": "Browse everything I have to offer",
    "cta": "See All Links",
    "emoji": "🔗"
  },
  "links": [
    {
      "label": "Twitter",
      "url": "https://twitter.com",
      "icon": "twitter"
    },
    {
      "label": "Newsletter",
      "url": "https://substack.com",
      "icon": "mail"
    },
    {
      "label": "YouTube",
      "url": "https://youtube.com",
      "icon": "youtube"
    }
  ]
};
