# Migration: <Name>

**Status:** Draft | Approved | In Progress | Complete
**Author:** <name>
**Date:** YYYY-MM-DD

## Classification
- **Type:** schema | data | both
- **Mode:** online (no downtime) | requires downtime
- **Estimated total duration:** `<wallclock>`

## Affected systems

**Writers:**
- ...

**Readers:**
- ...

**Batch / async consumers:**
- ...

## Phases

### Phase 1: Expand
**Goal:** Add new structure alongside old.

**Steps:**
1. ...

**Verification:**
- ...

**Rollback:**
- ...

**Estimated duration / lock impact:**

---

### Phase 2: Backfill
**Goal:** Populate new from old.

**Steps:**
1. ...

**Verification:**
- Row counts match.
- Checksum on sample matches.

**Rollback:**
- ...

**Estimated duration:**

---

### Phase 3: Migrate reads
**Goal:** Switch readers to new.

**Steps:**
1. ...

**Verification:**
- ...

**Rollback:**
- Toggle feature flag back.

---

### Phase 4: Contract
**Goal:** Stop writing old, drop after soak.

**Soak period:** `<duration>`

**Steps:**
1. Stop writes to old.
2. Soak.
3. Drop old structure.

**Verification:**
- ...

**Rollback:**
- After drop, this is non-trivial. State the recovery plan explicitly.

## Risks
- ...

## Open questions
- [ ] ...
