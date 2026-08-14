# EUR Swap Duration & Convexity Lab — Project Memory

## What this is
A single-file, dependency-free educational HTML page (pricing → curve roles → delta → gamma for a EUR IRS). No build step, no backend. The `.html` file itself is the only deliverable — it must always still open standalone in a browser after any edit.

## Workflow rules — read every session
1. **Never regenerate the whole file from memory.** Read the current file on disk first, then make targeted edits. A full rewrite is reconstructed from what the model remembers of the conversation — that's how already-fixed content quietly comes back.
2. **One verified change per commit.** Run `/verify` before every `git commit`. There is no separate NOTES.md — a hand-maintained notes file can drift from the real file and still get trusted. `git log -p` is this project's memory of what changed and why.
3. **If a session seems to have lost the thread** (repeats a mistake, contradicts something fixed earlier in the same session), stop pushing through it. `/clear` and start fresh — this file plus `git log` re-ground a new session faster than a degraded one recovers.
4. **"Fix X everywhere" means grep-count it.** Count occurrences of the pattern before and after the edit. Report both numbers. Don't declare it done from a visual skim.
5. **Diff scope = requested scope.** Before committing, check `git diff --stat`. Flag anything that changed outside what was asked — in either direction: a missed fix