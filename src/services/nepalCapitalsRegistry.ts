// Nepal Depository Participants (Capitals, Merchant Bankers, & Commercial Bank DPs)
// Sourced from CDS and Clearing Limited (CDSC) & SEBON Licensed Depository Participants
// Standard 8-Digit CDSC DP ID Directory

export interface NepalCapitalDP {
  dpId: string; // 8-digit CDSC DP Identifier (e.g., '13012600')
  name: string;
  shortName: string;
  code?: string;
  category: 'CAPITAL' | 'COMMERCIAL_BANK' | 'BROKER_DP';
}

export const NEPAL_CAPITALS_DIRECTORY: NepalCapitalDP[] = [
  {
    dpId: '13012600',
    name: 'GLOBAL IME CAPITAL LIMITED',
    shortName: 'Global IME Capital',
    code: '12600',
    category: 'CAPITAL',
  },
  {
    dpId: '13010600',
    name: 'NIMB ACE CAPITAL LIMITED (NIBL ACE)',
    shortName: 'NIMB Ace Capital',
    code: '10600',
    category: 'CAPITAL',
  },
  {
    dpId: '13011200',
    name: 'NABIL INVESTMENT BANKING LIMITED',
    shortName: 'Nabil Invest',
    code: '11200',
    category: 'CAPITAL',
  },
  {
    dpId: '13013800',
    name: 'NIC ASIA CAPITAL LIMITED',
    shortName: 'NIC Asia Capital',
    code: '13800',
    category: 'CAPITAL',
  },
  {
    dpId: '13013200',
    name: 'SANIMA CAPITAL LIMITED',
    shortName: 'Sanima Capital',
    code: '13200',
    category: 'CAPITAL',
  },
  {
    dpId: '13012200',
    name: 'PRABHU CAPITAL LIMITED',
    shortName: 'Prabhu Capital',
    code: '12200',
    category: 'CAPITAL',
  },
  {
    dpId: '13011800',
    name: 'SIDDHARTHA CAPITAL LIMITED',
    shortName: 'Siddhartha Capital',
    code: '11800',
    category: 'CAPITAL',
  },
  {
    dpId: '13012000',
    name: 'NMB CAPITAL LIMITED',
    shortName: 'NMB Capital',
    code: '12000',
    category: 'CAPITAL',
  },
  {
    dpId: '13011400',
    name: 'CITIZEN CAPITAL LIMITED (CBIL)',
    shortName: 'Citizen Capital',
    code: '11400',
    category: 'CAPITAL',
  },
  {
    dpId: '13014200',
    name: 'LAXMI SUNRISE CAPITAL LIMITED',
    shortName: 'Laxmi Sunrise Capital',
    code: '14200',
    category: 'CAPITAL',
  },
  {
    dpId: '13012800',
    name: 'KUMARI CAPITAL LIMITED',
    shortName: 'Kumari Capital',
    code: '12800',
    category: 'CAPITAL',
  },
  {
    dpId: '13014400',
    name: 'MACHHAPUCHCHHRE CAPITAL LIMITED',
    shortName: 'Machhapuchchhre Capital',
    code: '14400',
    category: 'CAPITAL',
  },
  {
    dpId: '13014800',
    name: 'RBB MERCHANT BANKING LIMITED',
    shortName: 'RBB Merchant Banking',
    code: '14800',
    category: 'CAPITAL',
  },
  {
    dpId: '13010200',
    name: 'HIMALAYAN CAPITAL LIMITED (CIVIL CAPITAL)',
    shortName: 'Himalayan Capital',
    code: '10200',
    category: 'CAPITAL',
  },
  {
    dpId: '13015000',
    name: 'EVEREST BANK LIMITED - DP',
    shortName: 'Everest Bank DP',
    code: '15000',
    category: 'COMMERCIAL_BANK',
  },
  {
    dpId: '13015200',
    name: 'STANDARD CHARTERED BANK NEPAL LTD - DP',
    shortName: 'Standard Chartered DP',
    code: '15200',
    category: 'COMMERCIAL_BANK',
  },
  {
    dpId: '13015400',
    name: 'NEPAL SBI BANK LIMITED - DP',
    shortName: 'Nepal SBI DP',
    code: '15400',
    category: 'COMMERCIAL_BANK',
  },
  {
    dpId: '13015600',
    name: 'AGRICULTURAL DEVELOPMENT BANK LTD (ADBL) - DP',
    shortName: 'ADBL DP',
    code: '15600',
    category: 'COMMERCIAL_BANK',
  },
  {
    dpId: '13015800',
    name: 'NAASA SECURITIES CO. LTD (BROKER 58)',
    shortName: 'Naasa Securities',
    code: '15800',
    category: 'BROKER_DP',
  },
  {
    dpId: '13016000',
    name: 'VISION SECURITIES PVT. LTD (BROKER 34)',
    shortName: 'Vision Securities',
    code: '16000',
    category: 'BROKER_DP',
  },
  {
    dpId: '13016200',
    name: 'SECURED SECURITIES LIMITED (BROKER 36)',
    shortName: 'Secured Securities',
    code: '16200',
    category: 'BROKER_DP',
  },
  {
    dpId: '13016400',
    name: 'IMPERIAL SECURITIES CO. PVT. LTD (BROKER 45)',
    shortName: 'Imperial Securities',
    code: '16400',
    category: 'BROKER_DP',
  },
  {
    dpId: '13016600',
    name: 'ONLINE SECURITIES LIMITED (BROKER 49)',
    shortName: 'Online Securities',
    code: '16600',
    category: 'BROKER_DP',
  },
  {
    dpId: '13016800',
    name: 'SANI SECURITIES COMPANY LTD (BROKER 42)',
    shortName: 'Sani Securities',
    code: '16800',
    category: 'BROKER_DP',
  },
  {
    dpId: '13017200',
    name: 'ABC SECURITIES PVT. LTD (BROKER 17)',
    shortName: 'ABC Securities',
    code: '17200',
    category: 'BROKER_DP',
  },
  {
    dpId: '13017400',
    name: 'SHREE KRISHNA SECURITIES (BROKER 28)',
    shortName: 'Shree Krishna Securities',
    code: '17400',
    category: 'BROKER_DP',
  },
  {
    dpId: '13017800',
    name: 'DAKSHINKALI SECURITIES (BROKER 33)',
    shortName: 'Dakshinkali Securities',
    code: '17800',
    category: 'BROKER_DP',
  },
  {
    dpId: '13018000',
    name: 'ASIAN SECURITIES PVT. LTD (BROKER 26)',
    shortName: 'Asian Securities',
    code: '18000',
    category: 'BROKER_DP',
  },
  {
    dpId: '13018200',
    name: 'ARUN SECURITIES PVT. LTD (BROKER 3)',
    shortName: 'Arun Securities',
    code: '18200',
    category: 'BROKER_DP',
  },
  {
    dpId: '13018400',
    name: 'KOHINOOR SECURITIES (BROKER 35)',
    shortName: 'Kohinoor Securities',
    code: '18400',
    category: 'BROKER_DP',
  },
  {
    dpId: '13018800',
    name: 'PREMIER SECURITIES (BROKER 32)',
    shortName: 'Premier Securities',
    code: '18800',
    category: 'BROKER_DP',
  },
  {
    dpId: '13019000',
    name: 'LINCH STOCK BROKING (BROKER 41)',
    shortName: 'Linch Stock Broking',
    code: '19000',
    category: 'BROKER_DP',
  },
  {
    dpId: '13019400',
    name: 'KALIKA SECURITIES (BROKER 46)',
    shortName: 'Kalika Securities',
    code: '19400',
    category: 'BROKER_DP',
  },
  {
    dpId: '13019600',
    name: 'SOUTH ASIAN BULLS (BROKER 43)',
    shortName: 'South Asian Bulls',
    code: '19600',
    category: 'BROKER_DP',
  },
  {
    dpId: '13019800',
    name: 'SRI HARI SECURITIES (BROKER 56)',
    shortName: 'Sri Hari Securities',
    code: '19800',
    category: 'BROKER_DP',
  },
];

// Helper Functions
export function getCapitalByDpId(dpId: string): NepalCapitalDP | undefined {
  const clean = dpId.trim().replace(/\D/g, '');
  return NEPAL_CAPITALS_DIRECTORY.find((c) => c.dpId === clean || c.code === clean);
}

export function findCapitalByBoid(boid: string): NepalCapitalDP | undefined {
  const clean = boid.trim().replace(/\D/g, '');
  if (clean.length >= 8) {
    const dpPrefix = clean.slice(0, 8);
    return NEPAL_CAPITALS_DIRECTORY.find((c) => c.dpId === dpPrefix);
  }
  return undefined;
}

export function splitBoid(fullBoid: string): { dpId: string; clientId: string; capital?: NepalCapitalDP } {
  const clean = fullBoid.trim().replace(/\D/g, '');
  if (clean.length === 16) {
    const dpId = clean.slice(0, 8);
    const clientId = clean.slice(8);
    const capital = getCapitalByDpId(dpId);
    return { dpId, clientId, capital };
  } else if (clean.length > 8) {
    const dpId = clean.slice(0, 8);
    const clientId = clean.slice(8);
    const capital = getCapitalByDpId(dpId);
    return { dpId, clientId, capital };
  }
  return { dpId: '', clientId: clean, capital: undefined };
}

export function composeBoid(dpId: string, clientId: string): string {
  const cleanDp = dpId.trim().replace(/\D/g, '').padStart(8, '0').slice(-8);
  const cleanClient = clientId.trim().replace(/\D/g, '').padStart(8, '0').slice(-8);
  return `${cleanDp}${cleanClient}`;
}

export function maskBoidSecurely(boid: string): string {
  const clean = boid.trim().replace(/\D/g, '');
  if (clean.length === 16) {
    return `${clean.slice(0, 8)}••••${clean.slice(-4)}`;
  }
  if (clean.length > 8) {
    return `${clean.slice(0, 4)}••••${clean.slice(-4)}`;
  }
  return clean ? '••••••••' : '';
}
