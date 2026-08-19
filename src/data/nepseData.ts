// Sourced & Verified Stock Market Data
// Rule 7: NEPSE Verified Data Layer

import { getAuthenticNepseSnapshot } from '../services/marketData';
import { getVerifiedIpos } from '../services/ipoData';

const snapshot = getAuthenticNepseSnapshot();
const verifiedIpos = getVerifiedIpos();

export const MOCK_MARKET_INDICES = snapshot.indices;
export const MOCK_STOCKS = snapshot.topGainers;

export const MOCK_IPOS = verifiedIpos.map((ipo) => ({
  id: ipo.id,
  companyName: ipo.companyNameEn,
  type: ipo.type,
  units: ipo.units,
  pricePerShare: ipo.pricePerShare,
  openDate: ipo.openDateBs,
  closeDate: ipo.closeDateBs,
  status: ipo.status === 'OPEN' ? 'Open' : ipo.status === 'UPCOMING' ? 'Upcoming' : 'Closed',
  minUnits: ipo.minUnits,
  issueManager: ipo.issueManagerEn,
  rating: ipo.ratingGrade || 'N/A',
}));
