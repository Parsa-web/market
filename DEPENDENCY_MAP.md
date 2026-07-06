# 🗺️ DEPENDENCY MAP — DATA FLOW VISUALIZATION

## Current State: Isolated Data Stores

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FACTORY SIDE                                      │
│                                                                             │
│  ┌──────────────┐    ┌──────────────────────────────────────────────┐       │
│  │ Factory User │───▶│ localStorage["factory_data_{userId}"]        │       │
│  │ (login)      │    │                                              │       │
│  └──────────────┘    │  ┌─────────┐ ┌──────────────┐ ┌──────────┐ │       │
│                      │  │requests │ │ applications │ │messages  │ │       │
│  ┌──────────────┐    │  │(5 demo) │ │ (3 demo)     │ │(4 convos)│ │       │
│  │useFactory    │◀───│  └─────────┘ └──────────────┘ └──────────┘ │       │
│  │(Context)     │    └──────────────────────────────────────────────┘       │
│  └──────┬───────┘                                                           │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────┐                      │
│  │ Factory Pages                                     │                      │
│  │ • FactoryDashboardPage                            │                      │
│  │ • NewRequestPage ──▶ factoryStore.addRequest()    │                      │
│  │ • RequestsPage ──▶ factoryStore.getRequests()     │                      │
│  │ • FactoryApplicationsPage ──▶ getApplications()   │                      │
│  │ • MessagesPage ──▶ getMessages()                  │                      │
│  └──────────────────────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘

         ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳
         ╳  NO CONNECTION BETWEEN SIDES  ╳
         ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳ ╳

┌─────────────────────────────────────────────────────────────────────────────┐
│                         SPECIALIST SIDE                                      │
│                                                                             │
│  ┌──────────────┐    ┌──────────────────────────────────────────────┐       │
│  │SpecialistUser│───▶│ localStorage["specialist_data_{userId}"]     │       │
│  │ (login)      │    │                                              │       │
│  └──────────────┘    │  ┌─────────────┐ ┌──────────────┐ ┌───────┐│       │
│                      │  │ opportunities│ │ applications │ │msgs   ││       │
│  ┌──────────────┐    │  │ (DEMO fake) │ │ (3 demo)     │ │(4cv)  ││       │
│  │useSpecialist │◀───│  └─────────────┘ └──────────────┘ └───────┘│       │
│  │(Context)     │    └──────────────────────────────────────────────┘       │
│  └──────┬───────┘                                                           │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────┐                      │
│  │ Specialist Pages                                  │                      │
│  │ • SpecialistDashboardPage                         │                      │
│  │ • OpportunitiesPage ──▶ getOpportunities(DEMO)    │◀── FAKE DATA         │
│  │ • SpecialistApplicationsPage ──▶ getApplications()│                      │
│  │ • SpecialistMessagesPage ──▶ getMessages()        │                      │
│  └──────────────────────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Target State: Connected via MarketCore

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FACTORY SIDE                                      │
│                                                                             │
│  ┌──────────────┐    ┌──────────────────────────────────────────────┐       │
│  │ Factory User │───▶│ useFactory (modified)                       │       │
│  └──────────────┘    │  Writes to BOTH old store AND marketCore    │       │
│                      └───────────┬──────────┬───────────────────────┘       │
│                                  │          │                               │
│                     ┌────────────▼──┐  ┌────▼──────────────┐               │
│                     │ factoryStore  │  │    marketCore      │               │
│                     │ (legacy)      │  │  ┌──────────────┐  │               │
│                     │               │  │  │  requests    │  │               │
│                     └───────────────┘  │  │  applications│  │               │
│                                        │  │  conversations│  │              │
│                                        │  └──────────────┘  │               │
│                                        └─────────┬──────────┘               │
│                                                  │                          │
│  ┌──────────────────────────────────────────────┐│                          │
│  │ Factory Pages (unchanged UI)                 ││                          │
│  │ • NewRequestPage                             ││                          │
│  │ • RequestsPage                               ││                          │
│  │ • FactoryApplicationsPage                    ││                          │
│  │ • MessagesPage                               ││                          │
│  └──────────────────────────────────────────────┘│                          │
└──────────────────────────────────────────────────┼──────────────────────────┘
                                                   │
                    ╔══════════════════════════════╧══════════════════════╗
                    ║           SHARED DATA LAYER (marketCore)           ║
                    ║                                                     ║
                    ║  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ ║
                    ║  │ market_      │  │ market_      │  │ market_  │ ║
                    ║  │ requests     │  │ applications │  │ convos   │ ║
                    ║  └──────────────┘  └──────────────┘  └──────────┘ ║
                    ║                                                     ║
                    ╚══════════════╤═══════════════╤═════════════════════╝
                                  │               │
                    ┌─────────────▼──┐  ┌─────────▼──────────────┐
                    │ specialistStore│  │    marketCore          │
                    │ (legacy)       │  │  (same instance)       │
                    └────────────────┘  └────────────────────────┘
                                  │               │
                     ┌────────────▼──┐  ┌─────────▼──────────────┐
                     │ useSpecialist │  │ useSpecialist           │
                     │ (modified)    │  │  Writes to BOTH         │
                     └───────────────┘  └────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SPECIALIST SIDE                                      │
│                                                                             │
│  ┌──────────────┐                                                          │
│  │SpecialistUser│                                                          │
│  └──────────────┘                                                          │
│                                                                             │
│  ┌──────────────────────────────────────────────────┐                      │
│  │ Specialist Pages (unchanged UI)                   │                      │
│  │ • OpportunitiesPage ──▶ gets REAL factory requests│◀── REAL DATA         │
│  │ • SpecialistApplicationsPage                      │                      │
│  │ • SpecialistMessagesPage                          │                      │
│  └──────────────────────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow: After Full Migration

```
┌──────────────────────┐         ┌──────────────────────┐
│     FACTORY          │         │    SPECIALIST         │
│                      │         │                       │
│ 1. Create Request    │         │                       │
│    └─▶ marketCore    │─────────│───────────────────┐   │
│        .addRequest() │         │                   │   │
│                      │         │                   ▼   │
│                      │    ┌────┴─────────────────────┐ │
│                      │    │    marketCore            │ │
│                      │    │    ┌─────────────────┐   │ │
│                      │    │    │ requests[]      │   │ │
│                      │    │    │ applications[]  │   │ │
│                      │    │    │ conversations[] │   │ │
│                      │    │    │ messages{}      │   │ │
│                      │    │    └─────────────────┘   │ │
│                      │    └────┬─────────────────────┘ │
│                      │         │                       │
│                      │         ▼                       │
│                      │    2. Browse Requests           │
│                      │       └─▶ marketCore           │
│                      │           .getRequests()       │
│                      │         │                       │
│                      │         ▼                       │
│                      │    3. Apply to Request          │
│                      │       └─▶ marketCore           │
│                      │           .addApplication()    │
│                      │         │                       │
│                      │    ┌────┘                       │
│                      │    ▼                            │
│ 4. View Applications │    ┌──────────────────────────┐ │
│    └─▶ marketCore    │    │ Factory sees application │ │
│        .getApps()    │    │ Specialist sees status   │ │
│                      │    └──────────────────────────┘ │
│ 5. Accept/Reject     │                                  │
│    └─▶ marketCore    │    6. Track Status               │
│        .updateApp()  │       └─▶ marketCore             │
│                      │           .getApps()             │
│ 7. Message Specialist│                                  │
│    └─▶ marketCore    │    8. Message Factory             │
│        .sendMessage()│       └─▶ marketCore             │
│                      │           .sendMessage()         │
└──────────────────────┘         └──────────────────────┘
```

## Risk Matrix

| Component | Dependency Count | Breaking Risk | Migration Order |
|-----------|------------------|---------------|-----------------|
| api.js (Auth) | 0 | 🟢 None | Keep as-is |
| factoryStore.js | 3 (useFactory, pages) | 🟠 High | Phase 3-4 |
| specialistStore.js | 3 (useSpecialist, pages) | 🟠 High | Phase 3-4 |
| factorySeedData.js | 2 (factoryStore, specialistSearch) | 🔴 Critical | Phase 5 (remove last) |
| specialistSeedData.js | 1 (specialistStore) | 🔴 Critical | Phase 5 (remove last) |
| useFactory.js | 10+ pages | 🟡 Medium | Phase 3-4 |
| useSpecialist.js | 10+ pages | 🟡 Medium | Phase 3-4 |
| dashboardEvents.js | 4 (both stores, hooks) | 🟡 Medium | Keep as-is |
| dashboardUtils.js | 10+ pages | 🟢 Low | Keep as-is |

## localStorage Keys (Current → Target)

| Current Key | Target Key | Migration Phase |
|-------------|------------|-----------------|
| `factory_data_{userId}` | `market_requests` | Phase 3-4 |
| `factory_data_{userId}` | `market_applications` | Phase 3-4 |
| `factory_data_{userId}` | `market_conversations` | Phase 3-4 |
| `factory_data_{userId}` | `market_messages` | Phase 3-4 |
| `specialist_data_{userId}` | (same shared keys) | Phase 3-4 |
| `auth_users` | `auth_users` | No change |
| `auth_session` | `auth_session` | No change |

---

*This dependency map is Phase 1 deliverable. No code was changed.*
