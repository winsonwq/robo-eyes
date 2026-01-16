# Agent Guidelines

<!-- 
  This file provides guidelines for AI agents working on this project.
  It defines coding standards, commit conventions, and workflow practices.
-->

## Git Commit Guidelines

<!-- 
  Git commit guidelines ensure consistent and clear commit messages.
  This helps maintain a clean project history and makes it easier to track changes.
-->

### Commit Message Format

<!-- 
  Commit messages should be clear, concise, and follow a consistent format.
  This makes it easier to understand what changes were made and why.
-->

- **Language**: English only
- **Style**: Simple and concise, no detailed descriptions
- **Format**: Use imperative mood (e.g., "Add feature", "Fix bug", "Update config")

### Examples

<!-- 
  Good examples show clear, concise commit messages that follow the guidelines.
  Bad examples demonstrate common mistakes to avoid.
-->

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

<!-- 
  Standard workflow for committing changes to the repository.
  Follow these steps in order to ensure changes are properly tracked.
-->

1. Stage changes: `git add .`
2. Commit with simple message: `git commit -m "Brief description"`
3. Push to remote: `git push -u origin main`

### Branch Naming

<!-- 
  Branch naming conventions help organize different types of work.
  Use descriptive names that indicate the purpose of the branch.
-->

- Use `main` as the default branch
- For feature branches: `feature/feature-name`
- For bug fixes: `fix/bug-description`
