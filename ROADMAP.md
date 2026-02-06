# LinkGuide Roadmap

This document tracks planned features and their priority.

---

## Legend

- 🔴 **Critical** - Must have for launch
- 🟡 **High** - Important for growth
- 🟢 **Medium** - Nice to have
- ⚪ **Low** - Future consideration
- ✅ **Done**

---

## Phase 1: Foundation (Current - V1)

### Core Features
- ✅ Resource-first architecture
- ✅ AI question generation
- ✅ Max 5 options per screen
- ✅ Basic visual flow builder
- ✅ SQLite analytics
- ✅ Responsive mobile design
- ✅ Admin panel

### Technical
- ✅ Fastify server
- ✅ Auto-reload config
- ✅ File-based storage
- ✅ GitHub repo

---

## Phase 2: Multi-Tenancy (V2 - Q2 2026)

### Authentication & Users 🔴
- [ ] User registration (email/password)
- [ ] OAuth (Google, Twitter, GitHub)
- [ ] Password reset
- [ ] Email verification
- [ ] User profile management

### Multi-Tenancy 🔴
- [ ] Subdomain per user (`user.linkguide.app`)
- [ ] Custom domain support
- [ ] Row-level data isolation
- [ ] Database per tenant or schema isolation

### Database Migration 🔴
- [ ] PostgreSQL setup
- [ ] Migration script from SQLite
- [ ] Connection pooling
- [ ] Backup strategy

### Billing 🟡
- [ ] Stripe integration
- [ ] Subscription tiers (Free/Pro/Agency)
- [ ] Usage limits per tier
- [ ] Billing dashboard

### Onboarding 🟡
- [ ] Welcome tutorial
- [ ] Template library
- [ ] Resource import (CSV)
- [ ] Quick start wizard

---

## Phase 3: Advanced Builder (V2.5 - Q3 2026)

### Visual Flow Builder v2 🔴
- [ ] React Flow integration
- [ ] Zoom, pan, minimap
- [ ] Undo/redo
- [ ] Copy/paste nodes
- [ ] Grouping nodes
- [ ] Path simulation
- [ ] Export as image

### Node Types 🟡
- [ ] Question node (multiple types)
- [ ] Condition node (if/then)
- [ ] Split node (A/B test)
- [ ] Delay node (wait X time)
- [ ] Webhook node
- [ ] Calculation node (scoring)

### Logic & Branching 🟡
- [ ] Conditional logic
- [ ] Skip logic
- [ ] Scoring system
- [ ] Dynamic text insertion
- [ ] Variable storage

---

## Phase 4: Growth Features (V3 - Q4 2026)

### Question Types 🟡
- [ ] Multi-select (checkboxes)
- [ ] Slider/range
- [ ] Text input (short & long)
- [ ] Email input with validation
- [ ] File upload
- [ ] Date picker
- [ ] Ranking (drag to order)
- [ ] Image choice
- [ ] Video embed

### Lead Generation 🔴
- [ ] Email gate (before result)
- [ ] Progressive profiling
- [ ] Custom fields
- [ ] Lead scoring
- [ ] Email provider integrations:
  - [ ] ConvertKit
  - [ ] Mailchimp
  - [ ] ActiveCampaign
  - [ ] SendGrid

### Analytics v2 🟡
- [ ] Funnel visualization
- [ ] Drop-off analysis
- [ ] Heatmaps
- [ ] A/B testing framework
- [ ] Cohort analysis
- [ ] Export to CSV/PDF
- [ ] Real-time dashboard

### Integrations 🟢
- [ ] Zapier
- [ ] Make.com (Integromat)
- [ ] Webhooks
- [ ] Slack notifications
- [ ] Notion database
- [ ] Airtable
- [ ] Google Sheets

---

## Phase 5: Design & Polish (V3.5)

### Themes 🟡
- [ ] 20+ preset themes
- [ ] Theme marketplace
- [ ] Custom CSS editor
- [ ] Font selection (Google Fonts)
- [ ] Background images/videos
- [ ] Animation settings

### Customization 🟢
- [ ] Logo upload
- [ ] Favicon
- [ ] Custom domains (free SSL)
- [ ] White-label option (remove branding)
- [ ] Custom result pages

### Mobile 🟢
- [ ] PWA support
- [ ] Offline mode
- [ ] Push notifications
- [ ] Native app (React Native) ⚪

---

## Phase 6: Scale & Enterprise (V4)

### API 🟡
- [ ] REST API v2
- [ ] GraphQL endpoint
- [ ] API documentation
- [ ] Rate limiting
- [ ] Webhook signatures

### Embeddable 🟢
- [ ] Widget (iframe)
- [ ] WordPress plugin
- [ ] Shopify app
- [ ] React component
- [ ] Vue component

### Enterprise ⚪
- [ ] SSO (SAML, OIDC)
- [ ] Audit logs
- [ ] Role-based access
- [ ] SLA guarantees
- [ ] Dedicated support
- [ ] Self-hosted option

### Performance 🔴
- [ ] Redis caching
- [ ] CDN (Cloudflare)
- [ ] Edge functions
- [ ] Database optimization
- [ ] Load testing

---

## Feature Voting

Want to influence priority? Comment on the issue with your use case.

| Feature | Votes | Status |
|---------|-------|--------|
| Email capture | 12 | Planned Q3 |
| Custom domains | 8 | Planned Q2 |
| A/B testing | 6 | Planned Q3 |
| Webhooks | 5 | Planned Q3 |
| File upload | 3 | Backlog |
| Mobile app | 2 | Backlog |

---

## Changelog

### v1.0.0 (2026-02-04)
- Initial release
- Resource-first architecture
- AI question generation
- Visual flow builder
- Analytics dashboard

---

Last updated: 2026-02-04
