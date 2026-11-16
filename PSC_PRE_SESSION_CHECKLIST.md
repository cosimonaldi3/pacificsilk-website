# PSC Website - Pre-Session Checklist

**Run this at the START of every session to prevent localhost/deployment breaks.**

---

## Quick Start

### Option 1: Automated (Recommended)
Open Claude Code terminal and run:
```bash
bash psc-health-check.sh
```

Wait for it to finish. If it says "✓ Health Check Passed", you're good to go.  
If it says "✗ Health Check Failed", fix the issue shown before proceeding.

---

### Option 2: Manual Checklist
If the script doesn't work, check these manually:

- [ ] **No uncommitted changes**
  - In terminal: `git status`
  - Should show "nothing to commit, working tree clean"
  - If not: either commit changes or stash them

- [ ] **No merge conflicts**
  - Check if any files have `<<<<<<< HEAD` markers
  - If yes, you have a merge conflict that needs resolving

- [ ] **node_modules exists**
  - Folder `node_modules/` should exist in your project root
  - If missing, run: `npm install`

- [ ] **Build works**
  - Run: `npm run build`
  - Wait for it to finish
  - Should say "✓ Build successful"
  - If errors, read them carefully before starting the session

- [ ] **Localhost works** (Optional but recommended)
  - Run: `npm run dev`
  - Open http://localhost:3000
  - Page should load without errors
  - Check browser console for red errors

---

## What Each Check Does

| Check | Why It Matters |
|-------|---|
| Git Status | Uncommitted changes = merge conflicts later |
| Merge Conflicts | These break the build immediately |
| Dependencies | Missing modules = "module not found" errors |
| Build Test | Catches TypeScript errors before you code |
| Localhost Test | Final check that everything actually works |

---

## If Something Fails

**Merge Conflicts?**
- Tell me in chat: "I have a merge conflict"
- I'll guide you through resolving it

**Build Fails?**
- Copy the error message and paste it in chat
- Include lines showing what failed

**node_modules Broken?**
- Delete `node_modules/` folder
- Run `npm install` to rebuild
- Then run check again

**Still Broken?**
- Start the session and we'll debug together

---

## After Each Session

Before closing, I'll tell you to:
1. Commit your changes to your feature branch
2. Create a pull request and merge to main
3. Run health check one more time to verify main is clean

Then next session = fresh start with clean main branch.
