# Contributing to LinkGuide

Thank you for your interest in contributing! This document will help you get started.

---

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repo
git clone https://github.com/antoinersx/linkguide.git
cd linkguide

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Project Structure

```
linkguide/
├── config/           # User configuration (resources.json)
├── public/           # Static files (HTML, JS, CSS)
├── src/              # Server-side code
│   ├── server.js     # Fastify server
│   └── question-generator.js
├── tests/            # Test files
└── docs/             # Documentation
```

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow existing code style
- Write tests for new features
- Update documentation

### 3. Test

```bash
# Run tests
npm test

# Check code style
npm run lint
```

### 4. Commit

```bash
git add .
git commit -m "feat: add new feature"
```

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

### 5. Push and PR

```bash
git push origin feature/your-feature-name
```

Open a Pull Request on GitHub.

---

## Code Style

### JavaScript
- Use ES6+ features
- Async/await over callbacks
- Semicolons required
- 2 spaces indentation

### Example

```javascript
// Good
async function getResources() {
  const resources = await db.query('SELECT * FROM resources');
  return resources.map(r => ({
    id: r.id,
    name: r.name
  }));
}

// Bad
function getResources(callback) {
  db.query('SELECT * FROM resources', function(err, results) {
    if (err) callback(err);
    else callback(null, results);
  });
}
```

---

## Testing

### Unit Tests

```javascript
// tests/question-generator.test.js
const QuestionGenerator = require('../src/question-generator');

test('generates max 5 options per question', () => {
  const resources = [
    { category: 'a' }, { category: 'b' },
    { category: 'c' }, { category: 'd' },
    { category: 'e' }, { category: 'f' }
  ];
  
  const generator = new QuestionGenerator(resources);
  const survey = generator.generate();
  
  survey.questions.forEach(q => {
    expect(q.options.length).toBeLessThanOrEqual(5);
  });
});
```

### Manual Testing

1. Start dev server: `npm run dev`
2. Test survey flow at `/@demo`
3. Test admin at `/admin`
4. Test flow builder at `/flow`

---

## Feature Requests

### Before Submitting

- Check if already requested in [Issues](https://github.com/antoinersx/linkguide/issues)
- Search closed issues too
- Review [Roadmap](./ROADMAP.md)

### Template

```markdown
**Feature:** Short description

**Use Case:** 
Who needs this and why?

**Proposed Solution:**
How should it work?

**Alternatives:**
What else did you consider?
```

---

## Bug Reports

### Template

```markdown
**Bug:** Short description

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected:** What should happen
**Actual:** What happens instead

**Screenshots:**
If applicable

**Environment:**
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome, Safari]
- Version: [e.g., 1.0.0]
```

---

## Questions?

- [GitHub Discussions](https://github.com/antoinersx/linkguide/discussions)
- [Twitter: @antoinersx](https://twitter.com/antoinersx)

---

## Code of Conduct

- Be respectful
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints

---

Thank you for contributing! 🎉
