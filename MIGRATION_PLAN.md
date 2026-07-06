# 🟢 PHASE 1 — ARCHITECTURE ANALYSIS REPORT

**Date:** 2026-07-05
**App:** صنعت‌نت (SpecialistNet) — Industrial marketplace
**Status:** Analysis Complete — NO CODE CHANGES MADE

---

## 1. CURRENT ARCHITECTURE SUMMARY

### Tech Stack
- React 19.2.7 + Vite 8.1.0
- React Router DOM 7.18.0
- NO state management library — uses **localStorage + React Context**
- NO backend — entirely client-side
- Language: Persian (RTL)

### Data Layer Architecture
```
src/services/
├── api.js              # Auth (register/login/logout) — localStorage
├── factoryStore.js     # Factory data — localStorage key: factory_data_{userId}
└── specialistStore.js  # Specialist data — localStorage key: specialist_data_{userId}
```

### Context Providers
```
src/hooks/
├── useAuth.js          # AuthContext — session management
├── useFactory.js       # FactoryContext — wraps factoryStore
├── useSpecialist.js    # SpecialistContext — wraps specialistStore
└── useMessageNotifications.js  # Cross-role notification hook
```

---

## 2. CRITICAL ARCHITECTURAL PROBLEMS

### ❌ Problem 1: Completely Isolated Data Stores
```
Factory localStorage:  factory_data_{userId} → { requests, applications, conversations, messages }
Specialist localStorage: specialist_data_{userId} → { opportunities(DEMO), applications, conversations, messages }
```
**Impact:** Factory and specialist data NEVER cross. A factory's request is invisible to specialists.

### ❌ Problem 2: Fake Opportunities System
- `specialistSeedData.js` contains `DEMO_OPPORTUNITIES` (6 hardcoded items)
- These are NOT connected to any factory's requests
- Specialist browses fake data that never changes

### ❌ Problem 3: Fake Applications System
- Factory applications are seeded with demo data (pointing to fake requestIds)
- Specialist applications are seeded with demo data (pointing to DEMO_OPPORTUNITIES)
- When specialist "applies", application only goes to specialist's localStorage
- Factory NEVER sees real specialist applications

### ❌ Problem 4: Fake Conversations/Messages
- Both stores have seeded conversations with demo messages
- Messages sent by factory stay in factory localStorage only
- Messages sent by specialist stay in specialist localStorage only
- NO real communication possible between roles

### ❌ Problem 5: No Shared Request Registry
- Factory creates request → stored in `factory_data_{userId}.requests`
- No central place for all requests
- Specialist cannot discover real factory requests

---

## 3. DATA DEPENDENCY MAP

### 3A. Factory Data Flow (Current)
```
Factory Creates Request
  └── factoryStore.addRequest(userId, request)
       └── Persists to: localStorage["factory_data_{userId}"]
       └── Fires event: dashboard-data-change
       └── Request appears in factory's own dashboard ONLY

Factory Views Applications
  └── factoryStore.getApplications(userId)
       └── Returns: applications from factory's own localStorage
       └── Enriches with request data from same localStorage
       └── NOTE: These are DEMO applications, NOT real ones

Factory Accepts/Rejects
  └── factoryStore.updateApplicationStatus(userId, appId, status)
       └── Updates status in factory's own localStorage
       └── Specialist NEVER sees this status change
```

### 3B. Specialist Data Flow (Current)
```
Specialist Browses Opportunities
  └── specialistStore.getOpportunities(userId, user)
       └── Returns: DEMO_OPPORTUNITIES (hardcoded, NOT factory requests)
       └── Scores each based on profile match
       └── Marks which ones specialist already applied to

Specialist Applies
  └── specialistStore.applyToOpportunity(userId, requestId, message)
       └── Creates application in specialist's localStorage
       └── Adds requestId to appliedRequestIds[]
       └── Factory NEVER receives this application

Specialist Views Applications
  └── specialistStore.getApplications(userId, user)
       └── Returns applications from specialist's own localStorage
       └── Factory status changes are NEVER reflected here
```

### 3C. Messaging Flow (Current)
```
Factory Sends Message
  └── factoryStore.sendMessage(userId, convId, content)
       └── Persists to: factory_data_{userId}.messages[convId]
       └── Specialist NEVER sees this message

Specialist Sends Message
  └── specialistStore.sendMessage(userId, convId, content)
       └── Persists to: specialist_data_{userId}.messages[convId]
       └── Factory NEVER sees this message
```

### 3D. Seed Data Dependencies
```
factorySeedData.js
  ├── SPECIALISTS_CATALOG → Used by specialistSearch.js, specialistSeedData.js
  ├── createSeedData(userId) → Called by factoryStore.load() on first load
  │   └── Creates: 5 demo requests, 3 demo applications, 4 demo conversations
  └── Dependencies: None (self-contained)

specialistSeedData.js
  ├── DEMO_OPPORTUNITIES → Used by specialistStore.getOpportunities()
  ├── createSpecialistSeedData(userId, user) → Called by specialistStore.load() on first load
  │   └── Creates: skills, machines, brands, portfolio, 3 demo applications, 4 demo conversations
  └── Dependencies: SPECIALISTS_CATALOG (from factorySeedData.js)
```

---

## 4. COMPLETE FILE INVENTORY

### Services (Data Layer)
| File | Lines | Purpose | Risk Level |
|------|-------|---------|------------|
| `src/services/api.js` | ~120 | Auth API | 🟢 Low — will keep as-is |
| `src/services/factoryStore.js` | ~400 | Factory CRUD | 🟠 Medium — will wrap |
| `src/services/specialistStore.js` | ~500 | Specialist CRUD | 🟠 Medium — will wrap |

### Hooks (Context Providers)
| File | Lines | Purpose | Risk Level |
|------|-------|---------|------------|
| `src/hooks/useAuth.js` | ~80 | Auth context | 🟢 Low |
| `src/hooks/useFactory.js` | ~120 | Factory context | 🟡 High — must not break |
| `src/hooks/useSpecialist.js` | ~150 | Specialist context | 🟡 High — must not break |
| `src/hooks/useMessageNotifications.js` | ~60 | Notification hook | 🟢 Low |

### Seed/Demo Data
| File | Lines | Purpose | Risk Level |
|------|-------|---------|------------|
| `src/data/factorySeedData.js` | ~150 | Factory demo data | 🔴 Critical — source of truth for demo |
| `src/data/specialistSeedData.js` | ~200 | Specialist demo data | 🔴 Critical — source of truth for demo |
| `src/data/homeData.js` | ~80 | Landing page data | 🟢 Low — static UI data |
| `src/data/specialties.json` | ~30 | Specialty list | 🟢 Low — reference data |

### Key Pages (Marketplace Flow)
| File | Purpose | Reads From | Risk Level |
|------|---------|------------|------------|
| `NewRequestPage.jsx` | Create request | factoryStore.addRequest | 🟡 High |
| `RequestsPage.jsx` | List requests | factoryStore.getRequests | 🟡 High |
| `FactoryApplicationsPage.jsx` | View applications | factoryStore.getApplications | 🟡 High |
| `OpportunitiesPage.jsx` | Browse opportunities | specialistStore.getOpportunities | 🔴 Critical |
| `SpecialistApplicationsPage.jsx` | View applications | specialistStore.getApplications | 🟡 High |
| `MessagesPage.jsx` (factory) | Messaging | factoryStore.getMessages | 🟡 High |
| `SpecialistMessagesPage.jsx` | Messaging | specialistStore.getMessages | 🟡 High |

---

## 5. RISK ASSESSMENT

### 🔴 CRITICAL RISKS (Must address carefully)
1. **Breaking existing demo data** — All seed data is the only working data in the app
2. **Breaking factory request creation** — Core feature, must work at every step
3. **Breaking specialist opportunity browsing** — Currently works with DEMO data, must continue
4. **Breaking messaging** — Currently works within each role's localStorage

### 🟠 HIGH RISKS (Careful handling needed)
1. **Context provider changes** — useFactory and useSpecialist are used everywhere
2. **Event system** — dashboard-data-change is used for re-renders
3. **Profile completion logic** — calculateProfileCompletion has many dependencies

### 🟡 MEDIUM RISKS (Standard precautions)
1. **Route changes** — ProtectedRoute and AppRoutes
2. **Component rendering** — DashboardLayout wraps providers conditionally

### 🟢 LOW RISKS (Safe to modify)
1. **Auth system** — Independent, well-isolated
2. **Static home page data** — No dynamic dependencies
3. **Specialties data** — Reference data, no logic dependencies

---

## 6. MIGRATION STRATEGY OVERVIEW

### Target Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    UI Components                         │
│  (factory pages, specialist pages, shared components)    │
└─────────────┬───────────────────────┬───────────────────┘
              │                       │
              ▼                       ▼
┌─────────────────────┐   ┌─────────────────────┐
│   useFactory Hook   │   │  useSpecialist Hook  │
│   (modified)        │   │  (modified)          │
└─────────┬───────────┘   └─────────┬───────────┘
          │                         │
          ▼                         ▼
┌─────────────────────────────────────────────────────────┐
│              MarketCore (NEW - Single Source)            │
│  ┌──────────┐ ┌──────────────┐ ┌──────────────────┐    │
│  │ Requests │ │ Applications │ │ Conversations/Msgs│    │
│  └──────────┘ └──────────────┘ └──────────────────┘    │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Storage Adapter (localStorage)              │
│  Shared keys: market_requests, market_applications, etc  │
└─────────────────────────────────────────────────────────┘
```

### Phase Breakdown
| Phase | Description | Duration | Risk |
|-------|-------------|----------|------|
| 🟢 Phase 1 | Analysis (THIS REPORT) | Done | None |
| 🟡 Phase 2 | Add marketCore module | ~2 hours | Low |
| 🟠 Phase 3 | Dual write system | ~3 hours | Medium |
| 🔵 Phase 4 | Migrate read operations | ~2 hours | Medium |
| 🔴 Phase 5 | Remove legacy system | ~1 hour | High |

### Backward Compatibility Strategy
1. **Phase 2:** Old stores continue working unchanged
2. **Phase 3:** Writes go to BOTH old and new stores
3. **Phase 4:** Reads gradually switch to new store, one page at a time
4. **Phase 5:** Only after ALL pages verified working with new store

---

## 7. NEXT STEPS (Phase 2 Preparation)

Phase 2 will create:
1. `src/services/marketCore/` directory
2. `src/services/marketCore/requests.js` — Request CRUD
3. `src/services/marketCore/applications.js` — Application CRUD
4. `src/services/marketCore/conversations.js` — Conversation/Message CRUD
5. `src/services/marketCore/storage.js` — localStorage adapter
6. `src/services/marketCore/index.js` — Public API

**NO existing files will be modified in Phase 2.**
**NO existing functionality will break.**
**Old stores continue to work exactly as before.**

---

*This report is Phase 1 deliverable. No code was changed.*
