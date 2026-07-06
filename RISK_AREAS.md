# ⚠️ RISK AREAS — MIGRATION HAZARD ANALYSIS

## 🔴 CRITICAL RISK AREAS

### Risk 1: Seed Data Destruction
**Location:** `src/data/factorySeedData.js`, `src/data/specialistSeedData.js`
**Hazard:** If seed data files are modified or removed before proper migration, all demo data disappears
**Impact:** App becomes empty/broken for all existing users
**Mitigation:**
- NEVER modify seed data files until Phase 5
- Keep seed data as fallback until marketCore is fully verified
- Create backup copies before any changes

### Risk 2: Factory Request Creation Breakage
**Location:** `src/services/factoryStore.js: addRequest()`
**Hazard:** Changing request creation logic could break the form submission
**Impact:** Factories cannot create new requests — core feature broken
**Mitigation:**
- Phase 2: marketCore.addRequest() is ADDITIVE only
- Phase 3: Dual write — old store continues working
- Phase 4: Only switch AFTER verifying marketCore works

### Risk 3: Specialist Opportunity Browsing Breakage
**Location:** `src/services/specialistStore.js: getOpportunities()`
**Hazard:** Switching from DEMO_OPPORTUNITIES to real requests too early
**Impact:** Specialists see empty list or errors
**Mitigation:**
- Phase 2: marketCore.getRequests() is ADDITIVE only
- Phase 3: Keep DEMO_OPPORTUNITIES as fallback
- Phase 4: Only switch when real requests exist AND are populated

### Risk 4: Application Flow Disconnect
**Location:** `src/services/factoryStore.js: updateApplicationStatus()`
**Hazard:** Accepting/rejecting applications in one store but not syncing to other
**Impact:** Factory accepts, specialist never sees acceptance
**Mitigation:**
- Phase 3: Dual write on accept/reject
- Phase 4: Read from marketCore for both sides

---

## 🟠 HIGH RISK AREAS

### Risk 5: Context Provider Re-render Loops
**Location:** `src/hooks/useFactory.js`, `src/hooks/useSpecialist.js`
**Hazard:** Adding marketCore subscription could cause infinite re-renders
**Impact:** App freezes or crashes
**Mitigation:**
- Use version counter pattern (already exists)
- Debounce marketCore event handlers
- Test each context provider change in isolation

### Risk 6: Custom Event System Conflicts
**Location:** `src/utils/dashboardEvents.js`
**Hazard:** marketCore events conflicting with existing dashboard-data-change events
**Impact:** Double re-renders or missing updates
**Mitigation:**
- Use SEPARATE event names for marketCore
- Keep existing events for legacy compatibility
- Remove legacy events ONLY in Phase 5

### Risk 7: localStorage Key Collisions
**Location:** `src/services/marketCore/storage.js` (to be created)
**Hazard:** New marketCore keys conflicting with existing keys
**Impact:** Data corruption or loss
**Mitigation:**
- Use distinct prefix: `market_` for all new keys
- Never reuse existing key names
- Test localStorage operations in isolation

### Risk 8: Profile Completion Logic Dependencies
**Location:** `src/services/specialistStore.js: calculateProfileCompletion()`
**Hazard:** Changing specialist store structure could break profile calculation
**Impact:** Profile completion percentage shows wrong values
**Mitigation:**
- Profile completion is INDEPENDENT of marketplace flow
- Do NOT modify in Phase 2-4
- Only refactor in Phase 5 if needed

---

## 🟡 MEDIUM RISK AREAS

### Risk 9: Dashboard Stats Calculation
**Location:** `src/services/factoryStore.js: getStats()`, `src/services/specialistStore.js: getStats()`
**Hazard:** Stats relying on old data structure after migration
**Impact:** Dashboard shows wrong numbers
**Mitigation:**
- Stats calculation reads from localStorage directly
- Phase 4: Update stats to read from marketCore
- Verify stats match before/after migration

### Risk 10: Message Read Tracking
**Location:** `src/components/dashboard/ChatBubble.jsx`
**Hazard:** IntersectionObserver auto-read using old store methods
**Impact:** Messages not marking as read, wrong unread counts
**Mitigation:**
- ChatBubble calls store.markMessageRead()
- Phase 3: Dual write on markMessageRead
- Phase 4: Switch ChatBubble to marketCore

### Risk 11: Event Emitter Memory Leaks
**Location:** `src/utils/dashboardEvents.js`
**Hazard:** Adding more event listeners without cleanup
**Impact:** Memory leaks, performance degradation
**Mitigation:**
- Use useEffect cleanup for all subscriptions
- Limit event listener count
- Test with React DevTools Profiler

### Risk 12: Specialist Search Dependencies
**Location:** `src/utils/specialistSearch.js`
**Hazard:** Uses SPECIALISTS_CATALOG from factorySeedData
**Impact:** Specialist search breaks if catalog removed
**Mitigation:**
- specialistSearch.js is for HOME PAGE ONLY (not marketplace)
- Keep SPECIALISTS_CATALOG until Phase 5
- Do not modify search logic during migration

---

## 🟢 LOW RISK AREAS

### Risk 13: Static Home Page Data
**Location:** `src/data/homeData.js`
**Hazard:** None — static data, no dynamic dependencies
**Impact:** None
**Mitigation:** None needed

### Risk 14: Auth System
**Location:** `src/services/api.js`, `src/hooks/useAuth.js`
**Hazard:** None — completely independent of marketplace
**Impact:** None
**Mitigation:** None needed

### Risk 15: Routing
**Location:** `src/routes/AppRoutes.jsx`, `src/routes/ProtectedRoute.jsx`
**Hazard:** None — routing is independent of data flow
**Impact:** None
**Mitigation:** None needed

---

## RISK MITIGATION CHECKLIST

### Before Each Phase:
- [ ] Run app manually — verify all pages load
- [ ] Test factory request creation flow
- [ ] Test specialist opportunity browsing flow
- [ ] Test application accept/reject flow
- [ ] Test messaging flow
- [ ] Check browser console for errors
- [ ] Verify localStorage contents

### After Each Phase:
- [ ] All existing features still work
- [ ] No new console errors
- [ ] Demo data still appears
- [ ] New marketCore operations work (if added)
- [ ] Dual writes succeed (if applicable)
- [ ] Read operations return correct data (if applicable)

### Rollback Triggers:
- Any page fails to load
- Any form submission fails
- Any data disappears from dashboard
- Any console error appears
- Any localStorage corruption detected

### Rollback Strategy:
1. Revert last git commit
2. If no git: restore from backup copies
3. Verify app works with restored code
4. Analyze root cause before retrying

---

## TESTING STRATEGY (Manual)

Since there are no automated tests, manual verification is required:

### Phase 2 Verification:
```bash
# 1. Start dev server
npm run dev

# 2. Test in browser:
# - Register as factory
# - Create a request
# - Register as specialist (different browser/incognito)
# - Browse opportunities (should show DEMO data)
# - Apply to an opportunity
# - Check factory applications (should show DEMO applications)
# - Send messages in both directions

# 3. Check localStorage:
# - factory_data_{userId} exists
# - specialist_data_{userId} exists
# - market_* keys do NOT exist yet (Phase 2 only adds code, not usage)
```

### Phase 3 Verification:
```bash
# After dual write implementation:
# 1. Create new request as factory
# 2. Verify it appears in:
#    - factory_data_{userId}.requests (old store)
#    - market_requests (new store)
# 3. Apply as specialist
# 4. Verify application appears in both stores
```

### Phase 4 Verification:
```bash
# After read migration for a single page:
# 1. Factory RequestsPage reads from marketCore
# 2. Verify requests display correctly
# 3. Verify old store still has data (backward compat)
# 4. Test all CRUD operations on that page
```

---

*Risk analysis is Phase 1 deliverable. No code was changed.*
