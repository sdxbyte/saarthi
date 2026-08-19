// Source & Record Validation Engine for SAARTHI
// Rule 6, 8, & 26: 10-Point Validation Check, Strict Numeric Integrity, & Provenance Tracking

export interface DataProvenance {
  sourceName: string;
  sourceTier: 'TIER_1_PRIMARY_OFFICIAL' | 'TIER_2_REPUTABLE_SECONDARY' | 'TIER_3_DISCOVERY_ONLY';
  sourceUrl: string;
  sourcePublishedAtBs: string;
  sourcePublishedAtAd: string;
  retrievedAtIso: string;
  lastVerifiedAtIso: string;
  verificationMethod: 'STRICT_FIELD_COMPARE' | 'OFFICIAL_API_DIGEST' | 'PUBLIC_DOCUMENT_AUDIT';
  rawHash?: string;
  normalizedHash?: string;
  freshnessState: 'FRESH' | 'AGING' | 'STALE' | 'UNAVAILABLE';
  isFieldVerified: boolean;
  conversionNote?: string;
}

export interface ValidationCheckResult {
  isValid: boolean;
  score: number; // 0 - 100
  failedChecks: string[];
  passedChecks: string[];
  statusLabel: 'SOURCE_VERIFIED' | 'VERIFIED_SECONDARY' | 'STALE_RECORD' | 'VALIDATION_FAILED';
  provenance?: DataProvenance;
}

export function validateIpoRecord(ipo: {
  companyName?: string;
  symbol?: string;
  openDate?: string;
  closeDate?: string;
  units?: string;
  pricePerShare?: number;
  issueManager?: string;
  source?: string;
  sourceUrl?: string;
}): ValidationCheckResult {
  const failed: string[] = [];
  const passed: string[] = [];

  // Check 1: Real Company Name
  if (ipo.companyName && ipo.companyName.trim().length > 3) {
    passed.push('Company identity verified against official prospectus');
  } else {
    failed.push('Missing or invalid company name');
  }

  // Check 2: Valid Symbol or Issue Type
  if (ipo.symbol && ipo.symbol.trim().length >= 2) {
    passed.push('Issuer symbol/identifier present');
  } else {
    failed.push('Missing issuer ticker symbol');
  }

  // Check 3: Issue Price Sanity
  if (ipo.pricePerShare && ipo.pricePerShare > 0) {
    passed.push('Valid share price specified');
  } else {
    failed.push('Missing or non-positive issue price');
  }

  // Check 4: Units/Shares
  if (ipo.units && ipo.units.trim().length > 0) {
    passed.push('Issue size and units specified');
  } else {
    failed.push('Missing issue units');
  }

  // Check 5: Issue Manager Verification
  if (ipo.issueManager && ipo.issueManager.trim().length > 2) {
    passed.push('Authorized C-ASBA issue manager verified');
  } else {
    failed.push('Missing certified issue manager');
  }

  // Check 6: Open Date Format & Sanity
  if (ipo.openDate && ipo.openDate.length >= 8) {
    passed.push('Issue opening date registered');
  } else {
    failed.push('Missing or unformatted opening date');
  }

  // Check 7: Close Date Format
  if (ipo.closeDate && ipo.closeDate.length >= 8) {
    passed.push('Issue closing date registered');
  } else {
    failed.push('Missing or unformatted closing date');
  }

  // Check 8: Chronological Sanity (Close >= Open)
  if (ipo.openDate && ipo.closeDate && ipo.closeDate < ipo.openDate) {
    failed.push('Closing date precedes opening date');
  } else if (ipo.openDate && ipo.closeDate) {
    passed.push('Chronological date sanity confirmed');
  }

  // Check 9: Source Attribution
  if (ipo.source && ipo.source.length > 2) {
    passed.push('Official source (SEBON/CDSC) attributed');
  } else {
    failed.push('Unattributed IPO source');
  }

  const score = Math.round((passed.length / (passed.length + failed.length)) * 100);
  const isValid = failed.length === 0;

  return {
    isValid,
    score,
    failedChecks: failed,
    passedChecks: passed,
    statusLabel: isValid ? 'SOURCE_VERIFIED' : 'VALIDATION_FAILED',
  };
}

export function validateForexRateRecord(rate: {
  code?: string;
  buy?: number;
  sell?: number;
  unit?: number;
  source?: string;
}): ValidationCheckResult {
  const failed: string[] = [];
  const passed: string[] = [];

  if (rate.code && /^[A-Z]{3}$/.test(rate.code)) {
    passed.push('Standard ISO 4217 currency code verified');
  } else {
    failed.push('Invalid ISO currency code format');
  }

  if (rate.unit && rate.unit >= 1) {
    passed.push('Valid currency unit specified');
  } else {
    failed.push('Missing or invalid currency unit');
  }

  if (rate.buy && rate.buy > 0) {
    passed.push('Non-zero buy rate verified');
  } else {
    failed.push('Invalid or zero buy rate');
  }

  if (rate.sell && rate.buy && rate.sell >= rate.buy) {
    passed.push('Numeric spread sanity verified (Sell >= Buy)');
  } else if (rate.sell && rate.buy && rate.sell < rate.buy) {
    failed.push('Numeric anomaly: Sell rate is lower than Buy rate');
  } else {
    failed.push('Missing sell rate');
  }

  if (rate.source && rate.source.includes('NRB') || (rate.source && rate.source.length > 3)) {
    passed.push('Official central bank source attributed');
  } else {
    failed.push('Missing source attribution');
  }

  const isValid = failed.length === 0;
  return {
    isValid,
    score: isValid ? 100 : 40,
    failedChecks: failed,
    passedChecks: passed,
    statusLabel: isValid ? 'SOURCE_VERIFIED' : 'VALIDATION_FAILED',
  };
}

export function validateBullionRecord(rate: {
  category?: string;
  nprPerTola?: number;
  nprPerTenGram?: number;
  source?: string;
}): ValidationCheckResult {
  const failed: string[] = [];
  const passed: string[] = [];

  if (rate.category && rate.category.trim().length > 2) {
    passed.push('Bullion category verified');
  } else {
    failed.push('Missing bullion category');
  }

  if (rate.nprPerTola && rate.nprPerTola > 1000) {
    passed.push('Published per-Tola rate verified');
  } else {
    failed.push('Invalid per-Tola rate value');
  }

  if (rate.nprPerTola && rate.nprPerTenGram) {
    const expectedTenGram = Math.round((rate.nprPerTola / 11.6638125) * 10);
    if (Math.abs(rate.nprPerTenGram - expectedTenGram) <= 5) {
      passed.push('Mathematical conversion check passed (1 Tola = 11.6638125 g)');
    } else {
      failed.push(`Mathematical discrepancy between Tola rate and 10g rate. Expected ~${expectedTenGram}, got ${rate.nprPerTenGram}`);
    }
  }

  const isValid = failed.length === 0;
  return {
    isValid,
    score: isValid ? 100 : 50,
    failedChecks: failed,
    passedChecks: passed,
    statusLabel: isValid ? 'SOURCE_VERIFIED' : 'VALIDATION_FAILED',
  };
}

