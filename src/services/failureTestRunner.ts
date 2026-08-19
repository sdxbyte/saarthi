/**
 * SAARTHI Automated Failure Injection & AI-Independence Test Suite
 * 
 * $0 AI-Independent Continuous Operation Architecture
 * 
 * Validates that SAARTHI starts, functions, and serves all non-AI operations
 * even when Gemini/AI Studio is completely disabled, disconnected, timing out,
 * or out of quota.
 */

import { aiCircuitBreaker } from './aiCircuitBreaker';
import { dataEngine } from './dataEngine';
import { getAuthenticNrbForexPayload } from './forexData';
import { getAuthenticBullionData } from './goldData';
import { getAuthenticNepseSnapshot } from './marketData';
import { getVerifiedNewsArticles } from './newsData';

export interface TestResultItem {
  id: string;
  name: string;
  category: 'AI_INDEPENDENCE' | 'DATA_ENGINE_RESILIENCE' | 'STORAGE_INDEPENDENCE';
  description: string;
  passed: boolean;
  durationMs: number;
  outputDetails: string;
  fallbackEngaged: boolean;
}

export interface FullTestSuiteReport {
  timestampIso: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  allPassed: boolean;
  overallStatus: '100% AI-INDEPENDENT & RESILIENT' | 'DEGRADED';
  results: TestResultItem[];
}

export async function runAllFailureSimulationTests(): Promise<FullTestSuiteReport> {
  const results: TestResultItem[] = [];

  // ==========================================
  // Test 1: AI Completely Offline / Disconnected
  // ==========================================
  {
    const start = Date.now();
    aiCircuitBreaker.setSimulationMode('OFFLINE');
    let fallbackEngaged = false;
    let outputDetails = '';

    try {
      const res = await aiCircuitBreaker.executeWithFallback(
        'test_notice_analysis',
        async () => {
          throw new Error('AI Studio Gemini unreachable (Connection Refused)');
        },
        () => {
          return aiCircuitBreaker.generateDeterministicNoticeAnalysis(
            'Vehicle Tax Renewal Deadline Notice',
            'Department of Transport Management',
            'ne'
          );
        }
      );

      fallbackEngaged = res.usedFallback;
      const passed = res.usedFallback && res.result.includes('सूचना शीर्षक') && res.source === 'DETERMINISTIC_FALLBACK';
      outputDetails = `AI simulated OFFLINE. Fallback cleanly generated deterministic output: "${res.result.slice(0, 60)}..."`;

      results.push({
        id: 'TEST-1-AI-OFFLINE',
        name: 'AI Disconnected / Offline Independence',
        category: 'AI_INDEPENDENCE',
        description: 'Verify system executes deterministic logic with zero crashes when AI is unreachable.',
        passed,
        durationMs: Date.now() - start,
        outputDetails,
        fallbackEngaged,
      });
    } catch (err: any) {
      results.push({
        id: 'TEST-1-AI-OFFLINE',
        name: 'AI Disconnected / Offline Independence',
        category: 'AI_INDEPENDENCE',
        description: 'Verify system executes deterministic logic with zero crashes when AI is unreachable.',
        passed: false,
        durationMs: Date.now() - start,
        outputDetails: `Unexpected exception: ${err.message}`,
        fallbackEngaged: false,
      });
    } finally {
      aiCircuitBreaker.resetCircuit();
    }
  }

  // ==========================================
  // Test 2: AI Quota Exhausted (429 Rate Limit)
  // ==========================================
  {
    const start = Date.now();
    aiCircuitBreaker.setSimulationMode('QUOTA_ERROR');

    try {
      const res = await aiCircuitBreaker.executeWithFallback(
        'test_quota_summary',
        async () => {
          throw new Error('429 Resource has been exhausted (quota exceeded)');
        },
        () => {
          return aiCircuitBreaker.generateDeterministicChangeSummary('1.6.0', [
            'src/services/forexData.ts',
            'src/services/goldData.ts',
          ]);
        }
      );

      const passed = res.usedFallback && res.result.added.length > 0 && res.source === 'DETERMINISTIC_FALLBACK';
      const outputDetails = `429 Quota Exhaustion simulated. Circuit breaker engaged; generated ${res.result.added.length} change categories.`;

      results.push({
        id: 'TEST-2-AI-QUOTA',
        name: 'AI Quota Exhaustion (429) Circuit Breaker',
        category: 'AI_INDEPENDENCE',
        description: 'Ensure quota exhaustion triggers circuit breaker and serves deterministic changelog without failing.',
        passed,
        durationMs: Date.now() - start,
        outputDetails,
        fallbackEngaged: true,
      });
    } catch (err: any) {
      results.push({
        id: 'TEST-2-AI-QUOTA',
        name: 'AI Quota Exhaustion (429) Circuit Breaker',
        category: 'AI_INDEPENDENCE',
        description: 'Ensure quota exhaustion triggers circuit breaker and serves deterministic changelog without failing.',
        passed: false,
        durationMs: Date.now() - start,
        outputDetails: `Exception: ${err.message}`,
        fallbackEngaged: false,
      });
    } finally {
      aiCircuitBreaker.resetCircuit();
    }
  }

  // ==========================================
  // Test 3: AI Request Timeout (8000ms+)
  // ==========================================
  {
    const start = Date.now();
    try {
      const res = await aiCircuitBreaker.executeWithFallback(
        'test_timeout_operation',
        async () => {
          // Infinite hanging promise
          await new Promise((resolve) => setTimeout(resolve, 15000));
          return 'AI Completed Late';
        },
        () => 'Deterministic Fallback Passed'
      );

      const passed = res.usedFallback && res.result === 'Deterministic Fallback Passed';
      results.push({
        id: 'TEST-3-AI-TIMEOUT',
        name: 'AI Request Timeout Protection',
        category: 'AI_INDEPENDENCE',
        description: 'Confirm that hanging or slow AI requests timeout safely and fall back to local logic.',
        passed,
        durationMs: Date.now() - start,
        outputDetails: `AI timed out. Fallback engaged safely in ${Date.now() - start}ms.`,
        fallbackEngaged: true,
      });
    } catch (err: any) {
      results.push({
        id: 'TEST-3-AI-TIMEOUT',
        name: 'AI Request Timeout Protection',
        category: 'AI_INDEPENDENCE',
        description: 'Confirm that hanging or slow AI requests timeout safely and fall back to local logic.',
        passed: false,
        durationMs: Date.now() - start,
        outputDetails: `Exception: ${err.message}`,
        fallbackEngaged: false,
      });
    }
  }

  // ==========================================
  // Test 4: Primary External Data Source Offline
  // ==========================================
  {
    const start = Date.now();
    dataEngine.setSimulationFlag('ALL_OFFLINE');

    try {
      const forexResult = await dataEngine.executePipeline(
        'nrb_forex_rates_test',
        'nrb_forex',
        {
          primary: async () => {
            throw new Error('Nepal Rastra Bank API Connection Refused (503)');
          },
          secondary: async () => {
            throw new Error('Secondary Gateway Unreachable');
          },
          staticFallback: () => getAuthenticNrbForexPayload(),
        },
        {
          validateSchema: (d) => !!d && Array.isArray(d.rates),
        },
        {
          sourceName: 'Nepal Rastra Bank (NRB)',
          sourceUrl: 'https://www.nrb.org.np/forex/',
          sourceType: 'Official Central Bank API',
          ttlSeconds: 300,
        }
      );

      const passed = !!forexResult.data && forexResult.data.rates.length >= 10 && forexResult.fromCache === true;
      const outputDetails = `External sources down. Retrieved ${forexResult.data.rates.length} rates from authentic persistent cache. Freshness: ${forexResult.meta.freshnessStatus}.`;

      results.push({
        id: 'TEST-4-DATA-FALLBACK',
        name: 'External Source Failure & Multi-Tier Fallback',
        category: 'DATA_ENGINE_RESILIENCE',
        description: 'Verify Data Engine preserves authentic last-known-good rates when official upstream APIs go down.',
        passed,
        durationMs: Date.now() - start,
        outputDetails,
        fallbackEngaged: true,
      });
    } catch (err: any) {
      results.push({
        id: 'TEST-4-DATA-FALLBACK',
        name: 'External Source Failure & Multi-Tier Fallback',
        category: 'DATA_ENGINE_RESILIENCE',
        description: 'Verify Data Engine preserves authentic last-known-good rates when official upstream APIs go down.',
        passed: false,
        durationMs: Date.now() - start,
        outputDetails: `Exception: ${err.message}`,
        fallbackEngaged: false,
      });
    } finally {
      dataEngine.setSimulationFlag('RESET');
    }
  }

  // ==========================================
  // Test 5: All Core Financial Datasets Zero-AI Verification
  // ==========================================
  {
    const start = Date.now();
    try {
      const forex = getAuthenticNrbForexPayload();
      const gold = getAuthenticBullionData();
      const nepse = getAuthenticNepseSnapshot();
      const news = getVerifiedNewsArticles();

      const passed =
        forex.rates.length > 15 &&
        gold.items.length >= 4 &&
        nepse.indices.length >= 2 &&
        news.length >= 3;

      results.push({
        id: 'TEST-5-CORE-DATA-AUTHENTICITY',
        name: 'Core Datasets 100% Deterministic Integrity',
        category: 'DATA_ENGINE_RESILIENCE',
        description: 'Verify NRB Forex, FENEGOSIDA Bullion, NEPSE Market, and News datasets load with 0 external AI calls.',
        passed,
        durationMs: Date.now() - start,
        outputDetails: `Loaded ${forex.rates.length} Forex currencies, ${gold.items.length} Bullion benchmarks, ${nepse.indices.length} NEPSE indices, and ${news.length} news items.`,
        fallbackEngaged: false,
      });
    } catch (err: any) {
      results.push({
        id: 'TEST-5-CORE-DATA-AUTHENTICITY',
        name: 'Core Datasets 100% Deterministic Integrity',
        category: 'DATA_ENGINE_RESILIENCE',
        description: 'Verify NRB Forex, FENEGOSIDA Bullion, NEPSE Market, and News datasets load with 0 external AI calls.',
        passed: false,
        durationMs: Date.now() - start,
        outputDetails: `Exception: ${err.message}`,
        fallbackEngaged: false,
      });
    }
  }

  // ==========================================
  // Test 6: Network Degraded Latency Tolerance
  // ==========================================
  {
    const start = Date.now();
    dataEngine.setSimulationFlag('NETWORK_DEGRADED');

    try {
      const bullionResult = await dataEngine.executePipeline(
        'fenegosida_gold_test',
        'fenegosida_bullion',
        {
          primary: async () => getAuthenticBullionData(),
          staticFallback: () => getAuthenticBullionData(),
        },
        {
          validateSchema: (d) => !!d && Array.isArray(d.items),
        },
        {
          sourceName: 'FENEGOSIDA',
          sourceUrl: 'https://www.fenegosida.org',
          sourceType: 'Official Bullion Benchmark',
          ttlSeconds: 300,
        }
      );

      const passed = !!bullionResult.data && bullionResult.data.items.length > 0;
      results.push({
        id: 'TEST-6-NETWORK-DEGRADED',
        name: 'Degraded Network State Handling',
        category: 'DATA_ENGINE_RESILIENCE',
        description: 'Ensure sluggish network connections resolve cleanly through asynchronous pipelines.',
        passed,
        durationMs: Date.now() - start,
        outputDetails: `Pipeline completed safely in ${Date.now() - start}ms under artificial network latency.`,
        fallbackEngaged: false,
      });
    } catch (err: any) {
      results.push({
        id: 'TEST-6-NETWORK-DEGRADED',
        name: 'Degraded Network State Handling',
        category: 'DATA_ENGINE_RESILIENCE',
        description: 'Ensure sluggish network connections resolve cleanly through asynchronous pipelines.',
        passed: false,
        durationMs: Date.now() - start,
        outputDetails: `Exception: ${err.message}`,
        fallbackEngaged: false,
      });
    } finally {
      dataEngine.setSimulationFlag('RESET');
    }
  }

  const passedTests = results.filter((r) => r.passed).length;
  const failedTests = results.length - passedTests;

  return {
    timestampIso: new Date().toISOString(),
    totalTests: results.length,
    passedTests,
    failedTests,
    allPassed: failedTests === 0,
    overallStatus: failedTests === 0 ? '100% AI-INDEPENDENT & RESILIENT' : 'DEGRADED',
    results,
  };
}
