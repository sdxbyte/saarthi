# SAARTHI Zero-Cost ($0) AI-Independent Continuous Operation Master Architecture

## 1. Permanent Architecture Flow

The permanent, non-negotiable architectural flow of SAARTHI is:

```
+-------------------------------------------------------------------------+
|                               AI STUDIO                                 |
|            (Development, Refinement, & Code Generation Engine)           |
+-------------------------------------------------------------------------+
                                    │
                                    ▼ [Commit & Sync]
+-------------------------------------------------------------------------+
|                         GITHUB (sdxbyte/saarthi)                        |
|                         SINGLE SOURCE OF TRUTH                          |
|  - Source Code & Schemas        - Verified Data Snapshots & Provenance  |
|  - Changelog & Releases         - Configuration & Service Definitions   |
+-------------------------------------------------------------------------+
                                    │
                                    ▼ [Deploy / Fetch]
+-------------------------------------------------------------------------+
|                                 VERCEL                                  |
|                 LIVE DEPLOYMENT & DELIVERY LAYER                        |
|  - Serves SAARTHI Production    - Exposes Deterministic Backend & APIs  |
|  - High-Speed Edge Caching      - Serves Verified State Independently   |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                              SAARTHI USERS                              |
|   (Consume 100% Verified, Source-Backed, Timestamped Civic Data)       |
+-------------------------------------------------------------------------+
```

---

## 2. Fundamental Architectural Principles

1. **GitHub is the Single Source of Truth**: All source code, assets, configuration, verified data snapshots, and release changelogs reside authoritatively in `sdxbyte/saarthi`. No external database (Firebase, Supabase, Neon, PostgreSQL, MongoDB, Cloud SQL) is required.
2. **Vercel is the Delivery Engine**: Vercel deploys directly from GitHub and serves the application to citizens.
3. **AI-Independence ($0 Core Runtime)**:
   > **"If Gemini/AI Studio reaches quota, runs out of credits, times out, throws 429/500 errors, or is completely disconnected, SAARTHI core functionality MUST NEVER be interrupted."**
4. **Authentic Data & Zero Fabrication**: Information is retrieved directly from official regulatory sources (NRB, FENEGOSIDA, NOC, NEPSE, CDSC, SEBON), validated with strict schemas, stamped with dual AD/BS timestamps, and served with clear freshness provenance. If a source is unavailable, the verified last-known-good cache is displayed with transparent labeling—never fabricated or estimated.

---

## 3. Structural Layer Separation

```
+-------------------------------------------------------------------------+
|                  SAARTHI PUBLIC UI & ADMIN DASHBOARDS                   |
| (Civic Services, Forex, Gold, Fuel, NEPSE, IPOs, Document Vault, Auth)   |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
|             DETERMINISTIC APPLICATION & DATA PIPELINE LAYER             |
| - Citizen Auth & RBAC (Local PBKDF2/Crypto)                             |
| - Unified Data Engine (Fetcher -> Parser -> Validator -> Normalizer)    |
| - Multi-Tier Cache (In-Memory TTL + Persistent Storage Fallback)        |
| - BS/AD Dual Calendar Engine (Mathematical Bikram Sambat Algorithms)     |
| - Document Vault (Local Storage & Encrypted User Vaults)                |
| - Immutable Audit Logging & System Telemetry                            |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
|                     STATE AUTHORITY & PERSISTENCE                       |
| - $0-Cost GitHub Repository Authority (sdxbyte/saarthi)                 |
| - Local Durable SQLite WAL Database                                     |
| - Automated Git Backup & Release Engine                                 |
+-------------------------------------------------------------------------+
                                    |
          [OPTIONAL ISOLATED ENHANCEMENT SIDE-CHANNEL]
+-------------------------------------------------------------------------+
|                 AI CIRCUIT BREAKER & OPTIONAL AI LAYER                  |
| - States: CLOSED (Healthy) | OPEN (Offline/Quota) | HALF_OPEN (Probe)   |
| - Request Timeout: 8000ms max                                           |
| - 100% Deterministic Fallback on ANY Failure                            |
| - Zero Core Dependency: System operates perfectly with AI DISABLED      |
+-------------------------------------------------------------------------+
```

---

## 3. Core Component Independence Breakdown

| Subsystem | Primary Implementation | Fallback / Resilience | AI Dependency | Runtime Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication & RBAC** | Local Session & SHA-256/PBKDF2 | In-memory token cache | **0% (None)** | **$0** |
| **Document Vault** | Local Storage / IndexedDB / JSON | Deterministic Expiry Math | **0% (None)** | **$0** |
| **Foreign Exchange (Forex)** | NRB Official Central Bank API | Verified Daily Reference Cache | **0% (None)** | **$0** |
| **Gold & Silver (Bullion)** | FENEGOSIDA Morning Benchmark | Historic Daily Rates Cache | **0% (None)** | **$0** |
| **Fuel Tariffs** | NOC Petroleum Tariff Matrix | Verified Regional Depot Cache | **0% (None)** | **$0** |
| **NEPSE Stock Market** | Real-time Market Snapshot Scraper | Previous Close Snapshot | **0% (None)** | **$0** |
| **IPO & CDSC Results** | CDSC / SEBON Public Feeds | Verified IPO Database | **0% (None)** | **$0** |
| **Dual Date Engine** | Mathematical BS/AD Conversion | Static Leap Year Table | **0% (None)** | **$0** |
| **Release & Git Backup** | Native GitHub REST API & Git Sync | SQLite WAL State Storage | **0% (None)** | **$0** |
| **Change Summaries** | Deterministic File Pattern Engine | Static Category Rules | Optional (100% Fallback) | **$0** |
| **Notice Analysis** | Structured Template Parser | Deterministic Gazette Summary | Optional (100% Fallback) | **$0** |

---

## 4. AI Circuit Breaker Specification

Located in `/src/services/aiCircuitBreaker.ts`:

- **State Machine**:
  - `CLOSED`: Normal operation. AI requests execute with an 8000ms timeout.
  - `OPEN`: Triggered when 3 consecutive failures (network error, timeout, 429 quota exhaustion) occur. AI requests immediately return deterministic fallbacks without network delay.
  - `HALF_OPEN`: After a 30-second cooldown, a single probe request is attempted. If successful, state transitions back to `CLOSED`; if it fails, state returns to `OPEN`.
- **Zero-Crash Guarantee**:
  - All AI calls are wrapped in `aiCircuitBreaker.executeWithFallback()`.
  - An uncaught exception is impossible from the AI layer.

---

## 5. Unified Data Engine Pipeline

Located in `/src/services/dataEngine.ts`:

```
[Official Source (NRB/FENEGOSIDA/NOC/NEPSE)]
                  │
                  ▼
          [Network Fetcher]
                  │
                  ▼
        [JSON/HTML Parser]
                  │
                  ▼
       [Schema Type Validator] ─── (Invalid) ──► [Reject & Retain Cache]
                  │
                  ▼ (Valid)
     [Business Sanity Check]   ─── (Suspicious) ──► [Log Alert & Use Cache]
                  │
                  ▼ (Passed)
     [Dual Timestamp Provenance]
  (AD, BS, Nepal Time, Source Tier)
                  │
                  ▼
     [Multi-Tier Cache Storage]
  (In-Memory TTL + Persistent Store)
                  │
                  ▼
        [SAARTHI UI / API]
```

---

## 6. Automated Failure Injection Verification

Located in `/src/services/failureTestRunner.ts`:

The system includes an automated 6-point failure test suite accessible via `/api/system/tests/run-failure-simulations` and the Admin Operations Center:

1. **AI Offline / Disconnected Test**: Simulates Gemini unreachable; validates that deterministic notice analysis succeeds with zero errors.
2. **AI Quota Exhaustion (429) Test**: Simulates API quota limits; verifies immediate circuit breaker engagement and deterministic changelog generation.
3. **AI Request Timeout Test**: Simulates infinite hanging responses; verifies 8s timeout triggers cleanly.
4. **Primary Data Source Offline Test**: Simulates official upstream API outages; verifies last verified authentic cache is served with appropriate provenance badge.
5. **Core Datasets Zero-AI Verification**: Validates Forex, Bullion, NEPSE, and News datasets load without making external AI calls.
6. **Network Latency Degraded Test**: Validates asynchronous pipelines remain responsive under simulated connection latency.

---

## 7. Permanent System Compliance

- Dual Calendar: Every data item and audit log includes **AD Date**, **BS Date**, **Time (NPT)**, and **Timezone (+05:45)**.
- Immutable Audit Logs: Append-only SQLite WAL logs backed up to GitHub repository JSONs.
- $0 Operational Cost: Zero paid API keys, zero paid cloud databases, zero recurring subscription fees.
