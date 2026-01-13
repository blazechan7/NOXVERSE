# Git Workflow Guide

Simple guide for using Git with this project.

## The Three Branches

- **`main`** - Your finished, working code
- **`develop`** - Where you build new features
- **`design`** - Where you experiment with colors and styles

## Basic Commands

### See what branch you're on
```bash
git branch
```

### Switch to a branch
```bash
git checkout develop
```

### Save your changes
```bash
git add .
git commit -m "What you changed"
git push
```

### Get latest changes
```bash
git pull
```

## Daily Workflow

### Starting work
```bash
# Switch to develop branch
git checkout develop

# Get latest changes
git pull
```

### Making changes
```bash
# Make your edits in files...

# Save changes
git add .
git commit -m "Add new feature"
git push
```

### When feature is done
```bash
# Test in Live Server first!
# Make sure everything works

# Switch to main
git checkout main

# Get latest main
git pull

# Merge your work
git merge develop

# Push to main
git push
```

## Working with Colors (Design Branch)

```bash
# Switch to design branch
git checkout design

# Make color changes...

# Save
git add styles.css
git commit -m "Try new color palette"
git push
```

## Common Tasks

### See what changed
```bash
git status
```

### Undo changes (before saving)
```bash
git checkout -- filename
```

### Create new branch
```bash
git checkout -b new-feature-name
```

## When to Merge

Merge to main when:
- Feature is complete and working
- You've tested it in Live Server
- No errors in browser console

Don't merge:
- Broken or unfinished code
- Code you haven't tested

## Quick Tips

- Always `git pull` before starting work
- Commit often with clear messages
- Test in Live Server before merging
- Keep main branch clean and working
