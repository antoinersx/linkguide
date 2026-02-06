# LinkGuide - Product Requirements Document

## Vision
LinkGuide transforms messy bio links into intelligent, conversational experiences. Instead of overwhelming visitors with dozens of options, we guide them through a short, personalized survey to deliver the ONE perfect resource.

**Tagline:** "From link overload to perfect match in 30 seconds"

---

## Current State (V1)

### What Works
- ✅ Resource-first architecture (define resources → AI generates survey)
- ✅ Max 5 options per screen to prevent decision paralysis
- ✅ Auto-generated questions based on resource attributes
- ✅ Basic visual flow builder
- ✅ Simple analytics (views, completion rate, clicks)
- ✅ SQLite database for tracking

### Current Limitations
- ❌ Single user only (no multi-tenancy)
- ❌ No user authentication system
- ❌ Visual builder is basic (no complex branching)
- ❌ No A/B testing capabilities
- ❌ Limited customization (themes, fonts)
- ❌ No integrations (Zapier, webhooks)
- ❌ Analytics are basic (no funnels, cohorts)
- ❌ No lead capture (email before result)

---

## V2 Goals

### 1. Multi-Tenancy (SaaS)
Allow anyone to sign up and create their own LinkGuide.

**Requirements:**
- User registration/login (email + password, OAuth)
- Subdomain or custom domain per user (`username.linkguide.app` or `custom.com`)
- Row-level data isolation
- Subscription tiers (Free, Pro, Enterprise)

### 2. Advanced Visual Flow Builder
Make it intuitive to build complex decision trees.

**Requirements:**
- Drag-and-drop node editor
- Node types: Question, Condition, Split, Result, Delay, Webhook
- Visual connection lines between nodes
- Zoom, pan, minimap
- Undo/redo history
- Templates (presets for common flows)
- Path simulation (test the flow visually)

### 3. Enhanced Question Types
Beyond single-choice questions.

**Requirements:**
- Multi-select (checkboxes)
- Slider (range input)
- Text input (short answer)
- Email capture
- File upload
- Date picker
- Ranking (drag to order)

### 4. Smart Logic & Personalization
Make the survey feel truly intelligent.

**Requirements:**
- Conditional logic (if/then/else)
- Skip logic (jump to specific questions)
- Scoring system (calculate values based on answers)
- Dynamic text (insert user's answers into questions)
- AI-powered question optimization

### 5. Lead Generation Features
Capture leads before showing the result.

**Requirements:**
- Email gate (require email before result)
- Progressive profiling (ask for info over time)
- Integration with email providers (ConvertKit, Mailchimp)
- Custom lead magnets per result
- CSV export of leads

### 6. Advanced Analytics
Understand user behavior deeply.

**Requirements:**
- Funnel visualization (drop-off at each step)
- Heatmaps of option selections
- A/B testing (test different question flows)
- Cohort analysis
- Export to Google Analytics
- Real-time dashboard

### 7. Design & Customization
Make it beautiful and on-brand.

**Requirements:**
- Theme library (20+ presets)
- Custom CSS support
- Font selection (Google Fonts)
- Background images/videos
- Animation settings
- Mobile preview
- Dark/light mode toggle

### 8. Integrations
Connect to the rest of the marketing stack.

**Requirements:**
- Zapier/Make.com integration
- Webhooks (send data anywhere)
- Facebook Pixel
- Google Tag Manager
- Slack notifications
- Notion database sync
- Airtable integration

### 9. Performance & Scale
Handle thousands of users.

**Requirements:**
- Migrate to PostgreSQL
- Redis for caching
- CDN for static assets
- Rate limiting
- DDoS protection
- Auto-scaling

### 10. API & Extensibility
For power users and developers.

**Requirements:**
- REST API (CRUD resources, surveys, analytics)
- GraphQL endpoint
- Embeddable widget (iframe)
- WordPress plugin
- React/Vue components
- Webhook signatures for security

---

## User Stories

### Story 1: Creator (Current)
> "I'm a creator with 5 products. I want visitors to answer 3 questions and get the perfect product recommendation, instead of being overwhelmed by all 5 options."

**V1 Solution:** Define resources → AI generates survey → Deploy

### Story 2: Agency (V2)
> "I run a marketing agency. I want to create LinkGuides for 20 clients, each with their own subdomain and analytics. I want to white-label it."

**V2 Solution:** Multi-tenancy + white-label + agency dashboard

### Story 3: E-commerce (V2)
> "I have 100+ products. I want a quiz that narrows down to 3 perfect products, captures email, and tracks conversion to purchase."

**V2 Solution:** Product catalog integration + email gate + conversion tracking

### Story 4: Course Creator (V2)
> "I have 3 courses at different levels. I want a diagnostic quiz that places students in the right course AND captures their email for my funnel."

**V2 Solution:** Scoring logic + email gate + email provider integration

---

## Technical Architecture (V2)

### Frontend
- **Admin Dashboard:** React + TypeScript + Tailwind
- **Visual Builder:** React Flow or xyflow
- **Public Survey:** Vanilla JS (lightweight, fast)
- **Mobile App:** React Native (future)

### Backend
- **API:** Node.js + Fastify → NestJS
- **Database:** PostgreSQL (multi-tenant)
- **Cache:** Redis (sessions, rate limiting)
- **Queue:** Bull/Redis (webhooks, emails)
- **Storage:** S3 (images, exports)

### Infrastructure
- **Hosting:** Railway/Vercel (API) + Vercel (frontend)
- **CDN:** Cloudflare
- **Monitoring:** Sentry + LogRocket
- **Analytics:** Mixpanel/Amplitude

---

## Monetization Strategy

### Free Tier
- 1 survey
- 3 resources
- Basic analytics
- LinkGuide branding

### Pro ($19/month)
- Unlimited surveys
- Unlimited resources
- Custom domain
- Remove branding
- Advanced analytics
- Email capture

### Agency ($99/month)
- 20 client accounts
- White-label
- API access
- Priority support
- Custom integrations

### Enterprise (Custom)
- Self-hosted option
- SLA
- Dedicated support
- Custom development

---

## Success Metrics

### V1 (Current)
- [ ] 1 creator using it for their bio link
- [ ] 100+ survey completions
- [ ] 60%+ completion rate

### V2 Targets
- [ ] 100 paying users
- [ ] $5K MRR
- [ ] 4.5+ NPS score
- [ ] <2% churn

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| No product-market fit | Build in public, get feedback early |
| Technical debt | Write tests, document, refactor regularly |
| Competition from Linktree | Focus on AI/conversational angle |
| Scaling issues | Plan architecture for scale from day 1 |
| Support burden | Good docs, video tutorials, community |

---

## Timeline

### Phase 1: Foundation (Month 1-2)
- [ ] Multi-tenancy architecture
- [ ] Auth system
- [ ] PostgreSQL migration
- [ ] Stripe billing

### Phase 2: Visual Builder (Month 3)
- [ ] React Flow integration
- [ ] Complex logic nodes
- [ ] Templates
- [ ] Path simulation

### Phase 3: Growth Features (Month 4)
- [ ] Email capture
- [ ] Lead exports
- [ ] Email provider integrations
- [ ] Advanced analytics

### Phase 4: Scale (Month 5-6)
- [ ] API v2
- [ ] Webhooks
- [ ] Performance optimization
- [ ] Enterprise features

---

## Open Questions

1. Should we support conditional logic in V2 or V3?
2. Native mobile app - worth it?
3. AI-generated questions vs manual - which is primary?
4. Should we build a marketplace for templates?

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-04 | Claude | Initial PRD for V2 |
