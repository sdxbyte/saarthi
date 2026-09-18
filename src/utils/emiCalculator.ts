export interface EMICalculation {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
}

export function calculateEmi(principal: number, annualRate: number, tenureYears: number): EMICalculation {
  if (!principal || !annualRate || !tenureYears) {
    return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0 };
  }

  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const monthlyEmi = Math.round(emi);
  const totalPayment = Math.round(monthlyEmi * totalMonths);
  const totalInterest = Math.round(totalPayment - principal);

  return {
    monthlyEmi,
    totalInterest,
    totalPayment,
  };
}
