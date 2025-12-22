# Contributing

## Branch Conventions

- `master` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes

## Commit Style

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance

## Pull Request Process

1. Create feature branch from `master`
2. Make changes with clear commits
3. Run quality checks: `npm run lint && npm run type-check && npm test`
4. Update documentation if needed
5. Open PR with description
6. Address review feedback
7. Squash and merge

## Code Quality

Before committing:

```bash
npm run lint        # ESLint
npm run type-check  # TypeScript
npm run format      # Prettier
npm test            # Vitest
```

## Code Review Norms

- Review within 24 hours
- Be constructive and specific
- Approve when ready, request changes when not
