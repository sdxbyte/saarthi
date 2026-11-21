import { describe, it, expect } from 'vitest';
import { calculateNepalTax } from '../src/utils/taxCalculator';
import { calculateEmi } from '../src/utils/emiCalculator';
import { convertAdToBs, convertBsToAd, toNepaliDigits } from '../src/utils/bsAdConverter';

describe('Nepal Income Tax Calculator (FY 2083/84)', () => {
  it('applies 0% first-slab rate when enrolled in SSF for single salary up to 500k', () => {
    const res = calculateNepalTax({
      annualSalary: 500000,
      maritalStatus: 'single',
      isSsf: true,
      lifeInsurance: 0,
      healthInsurance: 0,
    });
    expect(res.annualTax).toBe(0);
    expect(res.monthlyTax).toBe(0);
    expect(res.monthlyInhand).toBe(Math.round(500000 / 12));
  });

  it('applies 1% first-slab social security tax when NOT enrolled in SSF', () => {
    const res = calculateNepalTax({
      annualSalary: 500000,
      maritalStatus: 'single',
      isSsf: false,
      lifeInsurance: 0,
      healthInsurance: 0,
    });
    expect(res.annualTax).toBe(5000);
    expect(res.effectiveRate).toBe(1);
  });

  it('caps life insurance deduction at Rs. 40,000 and health insurance at Rs. 20,000', () => {
    const res = calculateNepalTax({
      annualSalary: 900000,
      maritalStatus: 'single',
      isSsf: true,
      lifeInsurance: 999999,
      healthInsurance: 999999,
    });
    expect(res.netTaxableIncome).toBe(840000); // 900k - (40k + 20k)
    // Slabs: 0-500k @0% (0) + 500k-700k @10% (20,000) + 700k-840k @20% (28,000) = 48,000
    expect(res.annualTax).toBe(48000);
  });

  it('uses Rs. 600,000 first slab for married/couple filers', () => {
    const res = calculateNepalTax({
      annualSalary: 600000,
      maritalStatus: 'married',
      isSsf: true,
      lifeInsurance: 0,
      healthInsurance: 0,
    });
    expect(res.annualTax).toBe(0);
  });

  it('handles zero salary safely without NaN', () => {
    const res = calculateNepalTax({
      annualSalary: 0,
      maritalStatus: 'single',
      isSsf: false,
      lifeInsurance: 10000,
      healthInsurance: 5000,
    });
    expect(res.netTaxableIncome).toBe(0);
    expect(res.annualTax).toBe(0);
    expect(res.effectiveRate).toBe(0);
  });
});

describe('Loan EMI Calculator', () => {
  it('computes accurate monthly EMI and totals for a standard home loan', () => {
    const res = calculateEmi(3500000, 10.5, 15);
    // Standard EMI formula: P*r*(1+r)^n / ((1+r)^n - 1)
    expect(res.monthlyEmi).toBeGreaterThan(38000);
    expect(res.monthlyEmi).toBeLessThan(39500);
    expect(res.totalPayment).toBe(res.monthlyEmi * 15 * 12);
    expect(res.totalInterest).toBe(res.totalPayment - 3500000);
  });

  it('returns zeroed structure when inputs are missing or zero', () => {
    expect(calculateEmi(0, 10, 5)).toEqual({
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
    });
    expect(calculateEmi(100000, 0, 5)).toEqual({
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
    });
  });
});

describe('BS <-> AD Converter & Nepali Digits', () => {
  it('converts Western digits to Devanagari numerals', () => {
    expect(toNepaliDigits('2083-04-21')).toBe('२०८३-०४-२१');
    expect(toNepaliDigits(1970)).toBe('१९७०');
  });

  it('performs accurate round-trip BS -> AD -> BS date conversion', () => {
    const ad = convertBsToAd(2083, 1, 1); // Baisakh 1, 2083
    expect(ad).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const bs = convertAdToBs(ad);
    expect(bs).toContain('2083');
    expect(bs).toContain('बैशाख');
  });
});
