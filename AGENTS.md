# Agent Guidelines

## Git Commit Guidelines

### Commit Message Format

- **Language**: English only
- **Style**: Simple and concise, no detailed descriptions
- **Format**: Use imperative mood (e.g., "Add feature", "Fix bug", "Update config")

### Examples

✅ Good:
- `Initial commit: RoboEyes Web port`
- `Add color selection feature`
- `Fix eye position movement`
- `Update mood definitions`
- `Refactor animation system`

❌ Bad:
- `feat: 实现颜色选择功能` (Chinese)
- `Added color selection feature with 8 preset colors including white, cyan, green, red, yellow, purple, orange, and blue` (Too detailed)
- `fix bug` (Too vague)

### Commit Workflow

1. Stage changes: `git add .`
2. Commit with simple message: `git commit -m "Brief description"`
3. Push to remote: `git push -u origin main`

### Branch Naming

- Use `main` as the default branch
- For feature branches: `feature/feature-name`
- For bug fixes: `fix/bug-description`
