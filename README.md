# LinkGuide 🎯

Smart bio links with survey-driven results. Instead of overwhelming visitors with dozens of links, guide them through 2-4 questions and serve the **one perfect link** they actually need.

```
"What brings you here?" → "What's your goal?" → 🎯 Perfect Match Found
```

## Quick Start

```bash
cd /Users/antoine/Vibe/link-guide
npm install
npm start
```

Open: http://localhost:3000/@demo

## How to Update Your Survey

### Option 1: Edit on GitHub (Recommended)

1. Open `config/survey.json`
2. Edit directly on GitHub web interface
3. Commit → auto-reloads on next request

### Option 2: Ask Me (Claude)

Just say:
- "Add a question asking about their budget"
- "Change the theme to blue and orange"
- "Add a new rule: if they're a beginner, show the starter guide"

I'll update the JSON for you.

### Option 3: API (For Automation)

```bash
curl -X POST http://localhost:3000/api/admin/update \
  -H "X-Token: dev-token-change-in-prod" \
  -H "Content-Type: application/json" \
  -d @config/survey.json
```

## Config Structure

```json
{
  "title": "What are you looking for?",
  "theme": {
    "primary": "#6366f1",
    "background": "#0f0f23"
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
          "next": "creator_goal"
        }
      ]
    }
  ],
  "rules": [
    {
      "if": { "role": "creator", "creator_goal": "monetize" },
      "then": {
        "url": "https://...",
        "label": "Monetization Guide",
        "description": "...",
        "cta": "Get Access",
        "emoji": "💰"
      }
    }
  ],
  "default": {
    "url": "https://...",
    "label": "All Links"
  }
}
```

## Admin API

### Get Analytics
```bash
curl http://localhost:3000/api/admin/analytics \
  -H "X-Token: dev-token-change-in-prod"
```

Returns:
```json
{
  "pageViews": 150,
  "sessions": 89,
  "completions": 67,
  "completionRate": 75,
  "topLinks": [...],
  "dropOffs": [...],
  "dailyViews": [...]
}
```

### Get Current Config
```bash
curl http://localhost:3000/api/admin/config \
  -H "X-Token: dev-token-change-in-prod"
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/@:username` | GET | Public survey page |
| `/api/survey/:username` | GET | Initialize survey (creates session) |
| `/api/survey/:username/question/:id` | GET | Get question details |
| `/api/survey/:username/answer` | POST | Submit answer |
| `/api/survey/:username/result` | POST | Calculate final result |
| `/api/survey/:username/click` | POST | Track link click |
| `/api/survey/:username/dropoff` | POST | Track where users leave |
| `/api/admin/analytics` | GET | Get stats (requires token) |
| `/api/admin/config` | GET | Get current config (requires token) |
| `/api/admin/update` | POST | Update config (requires token) |

## Database (SQLite)

Analytics stored in `analytics.db`:
- `page_views` — Every visit
- `survey_sessions` — Survey starts/completions
- `question_answers` — Individual answers
- `link_clicks` — Which links get clicked

Query directly:
```bash
sqlite3 analytics.db "SELECT * FROM link_clicks ORDER BY clicked_at DESC LIMIT 10"
```

## Deployment

### Railway/Render
1. Push to GitHub
2. Connect repo
3. Set env: `UPDATE_TOKEN=your-secure-token`
4. Deploy

### VPS/Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `UPDATE_TOKEN` | dev-token-change-in-prod | Admin API auth |

## Why This Architecture?

| Approach | Pros | Cons |
|----------|------|------|
| **GitOps (current)** | No login, version history, simple | Requires git knowledge |
| **Visual builder** | Easy for non-devs | Needs auth, more complex |
| **Chat bot** | Mobile-friendly updates | Another channel to manage |

The GitOps approach fits the "no new login" constraint perfectly — edit on GitHub or ask me to edit for you.

## Future Enhancements

- [ ] Multi-user support (separate configs per username)
- [ ] A/B testing different question flows
- [ ] Email capture before showing result
- [ ] Integration webhooks (Zapier, Make)
- [ ] QR code generation for each survey
- [ ] Custom domain support

---

Built with Fastify + SQLite + Vanilla JS. No build step, no framework lock-in.
