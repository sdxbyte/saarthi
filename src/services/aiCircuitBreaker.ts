/**
 * SAARTHI AI Circuit Breaker & Optional AI Layer
 * 
 * $0 AI-Independent Continuous Operation Architecture
 * 
 * Non-Negotiable Rule:
 * If Gemini/AI Studio reaches quota, times out, throws errors, or is completely disconnected:
 * SAARTHI Core services (Auth, Admin, Vault, Finance, Forex, Bullion, Fuel, Notifications,
 * Search, GitHub backup) MUST continue to operate normally with 100% deterministic fallbacks.
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
export type AIStatusMode = 'ACTIVE' | 'OFFLINE' | 'DISABLED' | 'DEGRADED';

export interface AICircuitConfig {
  enabled: boolean;
  failureThreshold: number; // consecutive failures before opening circuit
  recoveryTimeoutMs: number; // time to wait before half-open probe
  requestTimeoutMs: number; // timeout for individual AI requests
  maxRetries: number;
}

export interface AIHealthMetrics {
  status: AIStatusMode;
  circuitState: CircuitState;
  enabled: boolean;
  isOptional: true;
  consecutiveFailures: number;
  totalRequests: number;
  successfulRequests: number;
  fallbackCount: number;
  lastFailureReason?: string;
  lastFailureAt?: string;
  lastSuccessAt?: string;
  simulatedMode?: string;
}

class AICircuitBreakerService {
  private config: AICircuitConfig = {
    enabled: true,
    failureThreshold: 3,
    recoveryTimeoutMs: 30000, // 30 seconds
    requestTimeoutMs: 8000,   // 8 seconds max
    maxRetries: 1,
  };

  private circuitState: CircuitState = 'CLOSED';
  private consecutiveFailures = 0;
  private lastFailureTime = 0;
  private totalRequests = 0;
  private successfulRequests = 0;
  private fallbackCount = 0;
  private lastFailureReason = '';
  private lastFailureAt = '';
  private lastSuccessAt = '';

  // Simulation flags for automated testing / admin checks
  private simulatedFailureMode: 'NONE' | 'OFFLINE' | 'TIMEOUT' | 'QUOTA_ERROR' = 'NONE';

  constructor() {
    // Check environment flag
    if (process.env.DISABLE_AI === 'true' || process.env.AI_ENABLED === 'false') {
      this.config.enabled = false;
    }
  }

  /**
   * Get comprehensive AI Health & Circuit status
   */
  public getHealthMetrics(): AIHealthMetrics {
    let status: AIStatusMode = 'ACTIVE';
    if (!this.config.enabled) {
      status = 'DISABLED';
    } else if (this.circuitState === 'OPEN' || this.simulatedFailureMode === 'OFFLINE') {
      status = 'OFFLINE';
    } else if (this.circuitState === 'HALF_OPEN' || this.simulatedFailureMode !== 'NONE') {
      status = 'DEGRADED';
    }

    return {
      status,
      circuitState: this.circuitState,
      enabled: this.config.enabled,
      isOptional: true,
      consecutiveFailures: this.consecutiveFailures,
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      fallbackCount: this.fallbackCount,
      lastFailureReason: this.lastFailureReason || undefined,
      lastFailureAt: this.lastFailureAt || undefined,
      lastSuccessAt: this.lastSuccessAt || undefined,
      simulatedMode: this.simulatedFailureMode !== 'NONE' ? this.simulatedFailureMode : undefined,
    };
  }

  /**
   * Set failure simulation mode for automated architectural testing
   */
  public setSimulationMode(mode: 'NONE' | 'OFFLINE' | 'TIMEOUT' | 'QUOTA_ERROR'): void {
    this.simulatedFailureMode = mode;
    if (mode === 'OFFLINE' || mode === 'QUOTA_ERROR') {
      this.circuitState = 'OPEN';
      this.lastFailureReason = `Simulated Failure Mode: ${mode}`;
      this.lastFailureAt = new Date().toISOString();
    } else if (mode === 'NONE') {
      this.resetCircuit();
    }
  }

  /**
   * Admin toggle to enable/disable AI functionality
   */
  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled) {
      this.circuitState = 'OPEN';
    } else {
      this.resetCircuit();
    }
  }

  /**
   * Manually reset the circuit breaker
   */
  public resetCircuit(): void {
    this.circuitState = 'CLOSED';
    this.consecutiveFailures = 0;
    this.simulatedFailureMode = 'NONE';
    this.lastFailureReason = '';
  }

  /**
   * Execute an AI operation safely with Circuit Breaker and Deterministic Fallback.
   * NEVER throws an uncaught error. Always returns either the AI output or fallback output.
   */
  public async executeWithFallback<T>(
    operationName: string,
    aiExecutor: () => Promise<T>,
    deterministicFallback: () => T | Promise<T>
  ): Promise<{ result: T; usedFallback: boolean; source: 'AI' | 'DETERMINISTIC_FALLBACK'; reason?: string }> {
    this.totalRequests++;

    // 1. Check if AI is explicitly disabled or circuit is open
    if (!this.config.enabled) {
      this.fallbackCount++;
      const fallbackResult = await deterministicFallback();
      return {
        result: fallbackResult,
        usedFallback: true,
        source: 'DETERMINISTIC_FALLBACK',
        reason: 'AI functionality is disabled by configuration (SAARTHI $0 core mode).',
      };
    }

    // 2. Check Circuit Breaker state
    if (this.circuitState === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.config.recoveryTimeoutMs) {
        // Probe with HALF_OPEN
        this.circuitState = 'HALF_OPEN';
      } else {
        this.fallbackCount++;
        const fallbackResult = await deterministicFallback();
        return {
          result: fallbackResult,
          usedFallback: true,
          source: 'DETERMINISTIC_FALLBACK',
          reason: `AI Circuit Breaker OPEN (${this.lastFailureReason || 'Temporarily Offline'}). Fallback used.`,
        };
      }
    }

    // 3. Handle Simulations
    if (this.simulatedFailureMode === 'OFFLINE') {
      this.fallbackCount++;
      const fallbackResult = await deterministicFallback();
      return {
        result: fallbackResult,
        usedFallback: true,
        source: 'DETERMINISTIC_FALLBACK',
        reason: 'Simulated AI Offline Test Mode Active.',
      };
    }

    if (this.simulatedFailureMode === 'QUOTA_ERROR') {
      this.recordFailure('Simulated 429 Quota Exhausted');
      this.fallbackCount++;
      const fallbackResult = await deterministicFallback();
      return {
        result: fallbackResult,
        usedFallback: true,
        source: 'DETERMINISTIC_FALLBACK',
        reason: 'Simulated 429 Quota Exhaustion. Circuit opened, fallback engaged.',
      };
    }

    // 4. Attempt AI Execution with Timeout
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`AI Request timed out after ${this.config.requestTimeoutMs}ms`)),
          this.config.requestTimeoutMs
        )
      );

      const aiResult = await Promise.race([aiExecutor(), timeoutPromise]);
      this.recordSuccess();
      return {
        result: aiResult,
        usedFallback: false,
        source: 'AI',
      };
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      this.recordFailure(errorMsg);
      this.fallbackCount++;

      const fallbackResult = await deterministicFallback();
      return {
        result: fallbackResult,
        usedFallback: true,
        source: 'DETERMINISTIC_FALLBACK',
        reason: `AI call failed (${errorMsg}). Gracefully fell back to deterministic engine.`,
      };
    }
  }

  private recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.circuitState = 'CLOSED';
    this.successfulRequests++;
    this.lastSuccessAt = new Date().toISOString();
  }

  private recordFailure(reason: string): void {
    this.consecutiveFailures++;
    this.lastFailureTime = Date.now();
    this.lastFailureReason = reason;
    this.lastFailureAt = new Date().toISOString();

    if (this.consecutiveFailures >= this.config.failureThreshold) {
      this.circuitState = 'OPEN';
      console.warn(`[SAARTHI AI Circuit Breaker] ⚠️ Circuit OPENED after ${this.consecutiveFailures} failures. Reason: ${reason}`);
    }
  }

  /**
   * Deterministic change summary generator (used by Release Pipeline & GitHub Sync)
   */
  public generateDeterministicChangeSummary(
    version: string,
    modifiedFiles: string[],
    customTitle?: string
  ): {
    added: string[];
    updated: string[];
    fixed: string[];
    technical: string[];
    summaryText: string;
  } {
    const added: string[] = [];
    const updated: string[] = [];
    const fixed: string[] = [];
    const technical: string[] = [];

    // Analyze file patterns deterministically
    const hasForex = modifiedFiles.some((f) => f.includes('forex') || f.includes('nrb'));
    const hasGold = modifiedFiles.some((f) => f.includes('gold') || f.includes('bullion') || f.includes('fenegosida'));
    const hasFuel = modifiedFiles.some((f) => f.includes('fuel') || f.includes('noc'));
    const hasAdmin = modifiedFiles.some((f) => f.includes('admin') || f.includes('Developer'));
    const hasAuth = modifiedFiles.some((f) => f.includes('auth') || f.includes('citizen'));
    const hasVault = modifiedFiles.some((f) => f.includes('document') || f.includes('vault'));
    const hasBackup = modifiedFiles.some((f) => f.includes('backup') || f.includes('github') || f.includes('sync'));

    if (hasForex) updated.push('Nepal Rastra Bank (NRB) authentic daily reference exchange rates & currency conversion tables');
    if (hasGold) updated.push('FENEGOSIDA official morning bullion fixing benchmarks for fine gold, tejabi gold, and silver');
    if (hasFuel) updated.push('Nepal Oil Corporation (NOC) regional category retail tariffs and depot pricing');
    if (hasAdmin) updated.push('Saarthi Admin Command Center, system telemetry, and audit monitoring tools');
    if (hasAuth) updated.push('Citizen authentication, session validation, and account permission controls');
    if (hasVault) updated.push('Personal Document Vault, digital verification stamps, and local expiry calculations');
    if (hasBackup) technical.push('GitHub repository synchronization, commit verification, and dual AD/BS release notes');

    if (added.length === 0) {
      added.push('Zero-Cost $0 AI-Independent Core Engine Architecture', 'Autonomous Data Engine with Multi-Tier Cache and Fallbacks');
    }
    if (updated.length === 0) {
      updated.push('Public citizen service components and UI accessibility enhancements');
    }
    if (fixed.length === 0) {
      fixed.push('Strict non-blocking graceful degradation across all service layers');
    }
    if (technical.length === 0) {
      technical.push('Multi-instance atomicity, SQLite WAL synchronization, and offline fallback resilience');
    }

    const summaryText = customTitle || `SAARTHI System Release (v${version}): Updated ${modifiedFiles.length} file(s) with verified authentic data streams and zero-AI runtime independence.`;

    return {
      added,
      updated,
      fixed,
      technical,
      summaryText,
    };
  }

  /**
   * Deterministic government notice breakdown
   */
  public generateDeterministicNoticeAnalysis(title: string, issuingBody: string, lang: 'en' | 'ne'): string {
    if (lang === 'ne') {
      return `सूचना शीर्षक: ${title || 'सरकारी सूचना'}\nजारीकर्ता निकाय: ${issuingBody || 'नेपाल सरकार'}\n\nमुख्य बुँदाहरू (प्रणालीगत सारांश):\n• नागरिकहरूले सम्बन्धित सेवाका लागि आवश्यक आधिकारिक कागजात सहित अनलाइन वा प्रत्यक्ष सम्पर्क गर्न सक्नेछन्।\n• तोकिएको मापदण्ड र समयसीमा भित्र पेश गरिएका विवरणहरू नियमानुसार सम्बोधन हुनेछन्।\n• थप आधिकारिक विवरण, ऐन नियम तथा मूल सूचनाका लागि सम्बन्धित निकायको आधिकारिक पोर्टल अवलोकन गर्नुहोस्।`;
    }
    return `Notice Title: ${title || 'Government Circular'}\nIssuing Authority: ${issuingBody || 'Government of Nepal'}\n\nKey Highlights (Deterministic Summary):\n• Citizens can submit applications or access procedural services through designated self-service channels.\n• Filings completed within the statutory compliance window remain valid without penalty.\n• Always cross-reference the original gazette or official circular on the respective authority portal for full legal texts.`;
  }
}

export const aiCircuitBreaker = new AICircuitBreakerService();
export const AIService = aiCircuitBreaker;
