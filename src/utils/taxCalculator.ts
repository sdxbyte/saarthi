export interface TaxInput {
  annualSalary: number;
  maritalStatus: 'single' | 'married';
  isSsf: boolean;
  lifeInsurance: number; // max 40,000
  healthInsurance: number; // max 20,000
}

export interface TaxSlabBreakdown {
  range: string;
  rate: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface TaxResult {
  grossSalary: number;
  netTaxableIncome: number;
  annualTax: number;
  monthlyTax: number;
  monthlyInhand: number;
  effectiveRate: number;
  slabs: TaxSlabBreakdown[];
}

export function calculateNepalTax(input: TaxInput): TaxResult {
  const { annualSalary, maritalStatus, isSsf, lifeInsurance, healthInsurance } = input;

  // Deductions
  const lifeDeduction = Math.min(40000, Math.max(0, lifeInsurance));
  const healthDeduction = Math.min(20000, Math.max(0, healthInsurance));
  const totalDeductions = lifeDeduction + healthDeduction;

  const netTaxableIncome = Math.max(0, annualSalary - totalDeductions);

  let slabs: TaxSlabBreakdown[] = [];
  let remaining = netTaxableIncome;
  let totalTax = 0;

  if (maritalStatus === 'single') {
    // Single FY 2083/84 Slabs
    // 1st Slab: 0 - 500,000 @ 1% (or 0% if SSF)
    const slab1Limit = 500000;
    const slab1Taxable = Math.min(remaining, slab1Limit);
    const slab1Rate = isSsf ? 0 : 1;
    const slab1Tax = (slab1Taxable * slab1Rate) / 100;
    slabs.push({
      range: 'Up to Rs. 500,000',
      rate: slab1Rate,
      taxableAmount: slab1Taxable,
      taxAmount: slab1Tax,
    });
    totalTax += slab1Tax;
    remaining -= slab1Taxable;

    // 2nd Slab: Next 200,000 (500k to 700k) @ 10%
    if (remaining > 0) {
      const slab2Limit = 200000;
      const slab2Taxable = Math.min(remaining, slab2Limit);
      const slab2Tax = (slab2Taxable * 10) / 100;
      slabs.push({
        range: 'Rs. 500,000 - 700,000',
        rate: 10,
        taxableAmount: slab2Taxable,
        taxAmount: slab2Tax,
      });
      totalTax += slab2Tax;
      remaining -= slab2Taxable;
    }

    // 3rd Slab: Next 300,000 (700k to 1M) @ 20%
    if (remaining > 0) {
      const slab3Limit = 300000;
      const slab3Taxable = Math.min(remaining, slab3Limit);
      const slab3Tax = (slab3Taxable * 20) / 100;
      slabs.push({
        range: 'Rs. 700,000 - 1,000,000',
        rate: 20,
        taxableAmount: slab3Taxable,
        taxAmount: slab3Tax,
      });
      totalTax += slab3Tax;
      remaining -= slab3Taxable;
    }

    // 4th Slab: Next 1,000,000 (1M to 2M) @ 30%
    if (remaining > 0) {
      const slab4Limit = 1000000;
      const slab4Taxable = Math.min(remaining, slab4Limit);
      const slab4Tax = (slab4Taxable * 30) / 100;
      slabs.push({
        range: 'Rs. 1,000,000 - 2,000,000',
        rate: 30,
        taxableAmount: slab4Taxable,
        taxAmount: slab4Tax,
      });
      totalTax += slab4Tax;
      remaining -= slab4Taxable;
    }

    // 5th Slab: Above 2,000,000 @ 39%
    if (remaining > 0) {
      const slab5Taxable = remaining;
      const slab5Tax = (slab5Taxable * 39) / 100;
      slabs.push({
        range: 'Above Rs. 2,000,000',
        rate: 39,
        taxableAmount: slab5Taxable,
        taxAmount: slab5Tax,
      });
      totalTax += slab5Tax;
    }
  } else {
    // Married / Couple FY 2081/82 Slabs
    // 1st Slab: 0 - 600,000 @ 1% (or 0% if SSF)
    const slab1Limit = 600000;
    const slab1Taxable = Math.min(remaining, slab1Limit);
    const slab1Rate = isSsf ? 0 : 1;
    const slab1Tax = (slab1Taxable * slab1Rate) / 100;
    slabs.push({
      range: 'Up to Rs. 600,000',
      rate: slab1Rate,
      taxableAmount: slab1Taxable,
      taxAmount: slab1Tax,
    });
    totalTax += slab1Tax;
    remaining -= slab1Taxable;

    // 2nd Slab: Next 200,000 (600k to 800k) @ 10%
    if (remaining > 0) {
      const slab2Limit = 200000;
      const slab2Taxable = Math.min(remaining, slab2Limit);
      const slab2Tax = (slab2Taxable * 10) / 100;
      slabs.push({
        range: 'Rs. 600,000 - 800,000',
        rate: 10,
        taxableAmount: slab2Taxable,
        taxAmount: slab2Tax,
      });
      totalTax += slab2Tax;
      remaining -= slab2Taxable;
    }

    // 3rd Slab: Next 300,000 (800k to 1.1M) @ 20%
    if (remaining > 0) {
      const slab3Limit = 300000;
      const slab3Taxable = Math.min(remaining, slab3Limit);
      const slab3Tax = (slab3Taxable * 20) / 100;
      slabs.push({
        range: 'Rs. 800,000 - 1,100,000',
        rate: 20,
        taxableAmount: slab3Taxable,
        taxAmount: slab3Tax,
      });
      totalTax += slab3Tax;
      remaining -= slab3Taxable;
    }

    // 4th Slab: Next 900,000 (1.1M to 2M) @ 30%
    if (remaining > 0) {
      const slab4Limit = 900000;
      const slab4Taxable = Math.min(remaining, slab4Limit);
      const slab4Tax = (slab4Taxable * 30) / 100;
      slabs.push({
        range: 'Rs. 1,100,000 - 2,000,000',
        rate: 30,
        taxableAmount: slab4Taxable,
        taxAmount: slab4Tax,
      });
      totalTax += slab4Tax;
      remaining -= slab4Taxable;
    }

    // 5th Slab: Above 2,000,000 @ 39%
    if (remaining > 0) {
      const slab5Taxable = remaining;
      const slab5Tax = (slab5Taxable * 39) / 100;
      slabs.push({
        range: 'Above Rs. 2,000,000',
        rate: 39,
        taxableAmount: slab5Taxable,
        taxAmount: slab5Tax,
      });
      totalTax += slab5Tax;
    }
  }

  const monthlyTax = Math.round(totalTax / 12);
  const monthlyInhand = Math.round((annualSalary - totalTax) / 12);
  const effectiveRate = annualSalary > 0 ? Number(((totalTax / annualSalary) * 100).toFixed(2)) : 0;

  return {
    grossSalary: annualSalary,
    netTaxableIncome,
    annualTax: Math.round(totalTax),
    monthlyTax,
    monthlyInhand,
    effectiveRate,
    slabs,
  };
}
