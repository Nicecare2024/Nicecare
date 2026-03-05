# Git Workflow: develop → main

This document describes our branching strategy and gives step-by-step commands for daily work. **AI coding agents** working in this repo should follow the instructions in the [For AI coding agents](#for-ai-coding-agents) section.

---

## Branch roles

| Branch | Purpose |
|--------|--------|
| **main** | Production. Only updated via merges from `develop` (or hotfix branches). |
| **develop** | Integration branch. All feature work merges here first. |
| **feature/*** | One branch per feature or task. Always created from `develop` and merged back into `develop`. |

---

## Scenario 1: Start and finish a feature

### 1. Start a new feature from develop
```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-feature-name
# ... do work, commit ...
```

### 2. Merge the feature into develop
```bash
git checkout develop
git pull origin develop
git merge feature/my-feature-name
git push origin develop
# Optional: delete the feature branch locally
git branch -d feature/my-feature-name
```

### 3. Release: merge develop into main
- **Preferred:** Open a Pull Request **develop → main** in your Git host (GitHub/GitLab/etc.), get review, then merge. The PR will close once merged; the `develop` branch remains.
- **CLI alternative:**
```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

### 4. After the release
- Continue merging new features into `develop`. When ready for the next release, open a **new** PR **develop → main** and merge again. No need to “recreate” `develop`.

---

## Scenario 2: Hotfix on main, then sync to develop

### 1. Fix on main
```bash
git checkout main
git pull origin main
git checkout -b hotfix/urgent-fix
# ... fix, commit ...
git checkout main
git merge hotfix/urgent-fix
git push origin main
```

### 2. Bring the fix into develop
```bash
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

---

## Quick reference

| Goal | Commands |
|------|----------|
| Start a feature | `git checkout develop` → `git pull` → `git checkout -b feature/xxx` |
| Merge feature into develop | `git checkout develop` → `git pull` → `git merge feature/xxx` → `git push` |
| Release (develop → main) | Open PR **develop → main** and merge (or use the CLI merge + push above). |
| After hotfix on main | `git checkout develop` → `git merge main` → `git push` |

---

## For AI coding agents

When working on this project, **check the current branch and follow this workflow**. Use it to decide what to do and what to suggest to developers.

### 1. Check the branch first
- Run or infer: `git branch --show-current` (or equivalent).
- **main:** Only release merges and hotfixes belong here. Do not create feature work on `main`. If the user is on `main` and asks for a new feature or refactor, suggest: *“You’re on `main`. Create a feature branch from `develop` first (see docs/GIT-WORKFLOW.md).”*
- **develop:** Safe for integration work. If the user wants to start a new feature, suggest creating a branch: `git checkout -b feature/short-name` and then implement there.
- **feature/xxx:** Normal development. Implement changes here. When done, suggest: *“Merge this branch into `develop` and push (see docs/GIT-WORKFLOW.md).”*
- **hotfix/xxx:** Only for urgent fixes that will merge into `main`. After merging to `main`, suggest merging `main` into `develop` so develop stays in sync.

### 2. Work accordingly
- **Never** suggest committing or pushing directly to `main` for feature work.
- **Always** assume feature work happens on a `feature/*` branch that merges into `develop`.
- When generating Git commands, use the flow: `develop` ← feature branches, then `main` ← `develop` (or `main` ← hotfix, then `develop` ← `main`).

### 3. Suggest next steps to junior developers
After completing a task, suggest the **next step** based on branch and state, for example:
- **On a feature branch:** “Your changes are ready. Next: merge into `develop` (`git checkout develop && git pull && git merge <this-branch> && git push`), then open a PR develop → main when you’re ready to release. See docs/GIT-WORKFLOW.md.”
- **On develop:** “You’re on the integration branch. To release, open a PR from `develop` to `main`. For new work, create a feature branch from `develop` first.”
- **On main:** “You’re on production. For new features, switch to `develop`, pull, and create a feature branch. For an urgent fix, use a `hotfix/` branch. See docs/GIT-WORKFLOW.md.”

### 4. Point to this doc
When the workflow is relevant (branch strategy, merge order, next steps), mention: **“See `docs/GIT-WORKFLOW.md`”** so juniors and other agents can follow the same process.
