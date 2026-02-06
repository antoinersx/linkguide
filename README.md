# LinkGuide 🎯

**From link overload to perfect match in 30 seconds**

LinkGuide transforms your bio link into an intelligent, conversational experience. Instead of overwhelming visitors with dozens of options, guide them through a short survey and deliver the ONE perfect resource.

```
Traditional Bio Link:          LinkGuide:
┌─────────────────┐           ┌─────────────────┐
│ 📱 My Products  │           │ What brings     │
│ 📚 Free Guide   │    →      │ you here?       │
│ 💼 Services     │           │  • Business     │
│ 🎓 Course       │           │  • Investing    │
│ 📧 Newsletter   │           │                 │
│ 🎙️ Podcast     │           │ [Continue] →    │
└─────────────────┘           └─────────────────┘
                                       ↓
                              ┌─────────────────┐
                              │ Perfect Match   │
                              │ Found! 🎯       │
                              │                 │
                              │ [Get Access]    │
                              └─────────────────┘
```

---

## ✨ Features

### Resource-First Architecture
Define your products/services once, AI generates the optimal survey questions automatically.

### Smart Routing
Visitors answer 2-4 questions and get routed to their perfect match based on:
- Interest/Category
- Budget/Price tier
- Working style preference
- Experience level

### Max 5 Options Per Screen
Prevents decision paralysis. Research shows 4-5 options is the sweet spot for conversion.

### Visual Flow Builder
Drag-and-drop interface to design complex decision trees without code.

### Analytics
Track views, completion rates, drop-off points, and which resources get clicked.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/antoinersx/linkguide.git
cd linkguide
npm install
```

### 2. Start Development Server

```bash
npm start
```

### 3. Open in Browser

- **Public Survey:** http://localhost:3000/@demo
- **Admin Panel:** http://localhost:3000/admin
- **Flow Builder:** http://localhost:3000/flow

### 4. Configure Your Resources

Edit `config/resources.json`:

```json
{
  "resources": [
    {
      "id": "my-product",
      "name": "My Product",
      "description": "What they get",
      "url": "https://...",
      "price": "high",
      "format": "done_for_you",
      "category": "business"
    }
  ]
}
```

The AI automatically generates questions from your resources.

---

## 🏗️ Architecture

```
LinkGuide/
├── config/
│   └── resources.json          # Your products/services
├── public/
│   ├── index.html              # Public survey UI
│   ├── admin.html              # Resource management
│   ├── flow-builder.html       # Visual flow editor
│   └── app.js                  # Survey logic
├── src/
│   ├── server.js               # Fastify API
│   └── question-generator.js   # AI question generation
└── analytics.db                # SQLite tracking
```

### Tech Stack
- **Backend:** Node.js + Fastify
- **Database:** SQLite (analytics)
- **Frontend:** Vanilla JS (zero dependencies for public survey)
- **Storage:** JSON files (resources, config)

---

## 📊 How It Works

### 1. Define Resources
You list what you offer with attributes (price, category, format).

### 2. AI Generates Survey
The system analyzes your resources and creates:
- Category question (routes to interest area)
- Budget question (filters by price)
- Format question (DIY vs done-for-you)
- Experience question (if needed)

### 3. Smart Routing
Each answer combination maps to a specific resource. Example:
```
Category: Business + Budget: $10K-50K + Format: Done-for-you
→ High Ticket Implementation
```

### 4. Analytics
Track the entire funnel:
- Page views
- Question drop-off
- Completion rate
- Resource clicks

---

## 🎨 Customization

### Themes
Edit CSS variables in `public/index.html`:

```css
:root {
  --primary: #000000;        /* Button color */
  --background: #ffffff;     /* Page background */
  --accent: #007AFF;         /* Links & highlights */
}
```

### Questions
The AI generates questions automatically, but you can edit them via:
1. **Admin Panel:** `/admin` → "Survey Editor" tab
2. **Flow Builder:** `/flow` → Visual editor
3. **JSON:** Edit and POST to `/api/admin/resources`

### Icons
Icons are auto-assigned based on keywords:
- "business" → 💼
- "investing" → 📈
- "trading" → 📊
- "ai" → 🤖
- "crypto" → ₿

---

## 🔧 API Reference

### Public Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /@:username` | Public survey page |
| `GET /api/survey/:username` | Initialize survey |
| `POST /api/survey/:username/result` | Calculate result |

### Admin Endpoints (requires X-Token header)

| Endpoint | Description |
|----------|-------------|
| `GET /api/admin/resources` | Get resources |
| `POST /api/admin/resources` | Update resources |
| `GET /api/admin/survey` | Get generated survey |
| `POST /api/admin/regenerate` | Regenerate survey |
| `GET /api/admin/analytics` | Get stats |

---

## 🚢 Deployment

### Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `UPDATE_TOKEN` | Yes | Admin API authentication |

---

## 🗺️ Roadmap

See [PRD.md](./PRD.md) for detailed V2 plans.

### V2: Multi-Tenancy (Q2 2026)
- User accounts & auth
- Custom domains
- Subscription billing
- PostgreSQL migration

### V3: Advanced Logic (Q3 2026)
- Conditional branching
- Scoring system
- A/B testing
- Lead capture

### V4: Scale (Q4 2026)
- API v2
- Webhooks
- Enterprise features
- Mobile app

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing`
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/antoinersx/linkguide/issues)
- **Discussions:** [GitHub Discussions](https://github.com/antoinersx/linkguide/discussions)
- **Twitter:** [@antoinersx](https://twitter.com/antoinersx)

---

Built with ❤️ for creators who want to serve their audience better.
