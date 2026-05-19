---
description: Triage and fix a bug — debugger first, then minimum-change fix and regression test.
argument-hint: "<bug description, error, or repro>"
---

Bug context:

> $ARGUMENTS

1. **Triage — `debugger` subagent.**
   Invoke `debugger`. It will reproduce, name the proximate cause and the root cause, and propose a minimum fix.

2. **Confirm with user.**
   Show the user the root cause and proposed fix. Wait for green light. The user can redirect — sometimes the "right" fix is wrong for non-technical reasons (scope, timing, ownership).

3. **Implement.**
   Apply the fix. Keep it minimal — no drive-by changes. If you see adjacent issues, note them as follow-up stories.

4. **Regression test — `test-author` subagent.**
   Invoke `test-author` to add a regression test that fails on the bug and passes on the fix.

5. **Run tests.**
   Confirm green. Report files changed and test status. Offer `/review` before PR.
