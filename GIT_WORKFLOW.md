# Git Workflow Guide - NOX:VERSE Interactive Logo

This guide explains how to use Git branches for step-by-step development.

## Branch Strategy

We use **3 branches** for organized development:

- **`design`** - Color experiments, palette decisions, visual tweaks
- **`develop`** - Feature development (animations, interactions, code)
- **`main`** - Stable, working versions at each completed step

## Initial Setup

### 1. Initialize Git (if not already done)

```bash
# Initialize Git repository
git init

# Create .gitignore (optional but recommended)
echo "node_modules/" > .gitignore
echo ".DS_Store" >> .gitignore
echo "*.log" >> .gitignore
```

### 2. Create Initial Commit

```bash
# Add all files
git add .

# Make initial commit
git commit -m "Step 1: Initial setup with color palette"
```

### 3. Connect to GitHub

```bash
# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/noxverse-logo.git

# Push to main branch
git push -u origin main
```

### 4. Create and Push Branches

```bash
# Create and switch to design branch
git checkout -b design
git push -u origin design

# Create and switch to develop branch
git checkout -b develop
git push -u origin develop

# Switch back to main
git checkout main
```

## Daily Workflow

### Working on Colors (Design Branch)

```bash
# Switch to design branch
git checkout design

# Make your color changes in styles.css
# ... edit files ...

# Stage changes
git add styles.css

# Commit with descriptive message
git commit -m "Experiment: Try warm color palette"

# Push to GitHub
git push origin design
```

### Working on Features (Develop Branch)

```bash
# Switch to develop branch
git checkout develop

# Optionally merge latest design changes
git merge design

# Make your feature changes
# ... add animations, interactions, etc. ...

# Stage changes
git add .

# Commit with step number
git commit -m "Step 2: Add entrance animation timeline"

# Push to GitHub
git push origin develop
```

### Completing a Step (Merge to Main)

When a step is complete and working:

```bash
# Switch to main branch
git checkout main

# Merge develop branch
git merge develop

# Push to main
git push origin main

# Tag the completed step (optional)
git tag -a step-2 -m "Step 2: Entrance animation complete"
git push origin step-2
```

## Common Scenarios

### Starting a New Step

```bash
# Make sure develop is up to date
git checkout develop
git pull origin develop

# Create a new feature branch for the step (optional)
git checkout -b step-3-idle-animations

# Work on your feature...
# When done, merge back to develop
git checkout develop
git merge step-3-idle-animations
git branch -d step-3-idle-animations  # Delete local branch
```

### Merging Design Changes into Develop

```bash
# Switch to develop
git checkout develop

# Merge design branch
git merge design

# Resolve any conflicts if they occur
# Then push
git push origin develop
```

### Undoing Changes

```bash
# Discard uncommitted changes
git checkout -- filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Viewing Branch Status

```bash
# See which branch you're on
git branch

# See all branches (local and remote)
git branch -a

# See commit history
git log --oneline --graph --all
```

## Step-by-Step Workflow Example

### Step 1: Color Selection (Complete)

```bash
# Work in design branch
git checkout design
# ... experiment with colors ...
git add styles.css
git commit -m "Step 1: Finalize astronomy moonlight glow palette"
git push origin design

# Merge to develop
git checkout develop
git merge design
git push origin develop

# Merge to main when satisfied
git checkout main
git merge develop
git push origin main
```

### Step 2: Entrance Animation (Next)

```bash
# Work in develop branch
git checkout develop
# ... add GSAP timeline for entrance ...
git add index.html script.js
git commit -m "Step 2: Add entrance animation timeline"
git push origin develop

# Test thoroughly, then merge to main
git checkout main
git merge develop
git push origin main
```

## Best Practices

1. **Commit Often**: Small, frequent commits are better than large ones
2. **Descriptive Messages**: Use clear commit messages with step numbers
3. **Test Before Merging**: Always test in develop before merging to main
4. **Keep Main Clean**: Only merge working, tested code to main
5. **Pull Before Push**: Always pull latest changes before pushing

## Commit Message Format

Use this format for consistency:

```
Step X: Brief description

Optional longer explanation if needed
```

Examples:
- `Step 1: Finalize astronomy moonlight glow palette`
- `Step 2: Add entrance animation timeline`
- `Step 3: Add idle state animations`
- `Step 4: Add mouse parallax interaction`

## Quick Reference

```bash
# Switch branches
git checkout branch-name

# Create new branch
git checkout -b new-branch-name

# See current status
git status

# See what changed
git diff

# Pull latest changes
git pull origin branch-name

# Push changes
git push origin branch-name
```

## Troubleshooting

### "Your branch is ahead of origin"
```bash
git push origin branch-name
```

### "Your branch is behind origin"
```bash
git pull origin branch-name
```

### Merge conflicts
```bash
# Git will show conflicted files
# Edit files to resolve conflicts
# Then:
git add resolved-file
git commit -m "Resolve merge conflicts"
```

---

**Remember**: The goal is to keep `main` as a stable reference point for each completed step, while `design` and `develop` are your working spaces for experiments and development.

