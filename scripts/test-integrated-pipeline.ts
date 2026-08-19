import * as cheerio from 'cheerio';

async function testIntegratedPipeline() {
  console.log('Testing integrated pipeline...');
  
  // 1. Fetch all securities map
  let securitiesMap: Record<string, { name: string; sector: string }> = {};
  try {
    const secRes = await fetch('https://raw.githubusercontent.com/Shubhamnpk/yonepse/main/data/all_securities.json');
    if (secRes.ok) {
      const list: any = await secRes.json();
      for (const item of list) {
        if (item.symbol) {
          securitiesMap[item.symbol.toUpperCase()] = {
            name: item.companyName || item.securityName || item.symbol,
            sector: item.sectorName || 'Other'
          };
        }
      }
      console.log('Loaded securities mapping for', Object.keys(securitiesMap).length, 'companies');
    }
  } catch (e: any) {
    console.log('Error fetching all_securities.json:', e.message);
  }

  // 2. Fetch live indices
  let mainIndices: any[] = [];
  try {
    const idxRes = await fetch('https://raw.githubusercontent.com/Shubhamnpk/yonepse/main/data/indices.json');
    if (idxRes.ok) {
      const idxList: any = await idxRes.json();
      mainIndices = idxList.map((idx: any) => ({
        name: idx.index,
        value: Number(idx.close || idx.currentValue),
        change: Number(idx.change),
        pChange: Number(idx.perChange),
        high: Number(idx.high),
        low: Number(idx.low),
        prevClose: Number(idx.previousClose)
      }));
      console.log('Loaded main indices:', mainIndices.length, mainIndices.map((i: any) => `${i.name}: ${i.value} (${i.change})`));
    }
  } catch (e: any) {
    console.log('Error fetching indices.json:', e.message);
  }

  // 3. Fetch nepse_data.json
  let nepseDataStocks: any[] = [];
  try {
    const nepseRes = await fetch('https://raw.githubusercontent.com/Shubhamnpk/yonepse/main/data/nepse_data.json');
    if (nepseRes.ok) {
      const list: any = await nepseRes.json();
      nepseDataStocks = list.map((s: any) => {
        const meta = securitiesMap[s.symbol.toUpperCase()] || { name: s.name || s.symbol, sector: 'Other' };
        return {
          symbol: s.symbol,
          companyName: meta.name || s.name,
          sector: meta.sector,
          ltp: Number(s.ltp),
          change: Number(s.change),
          pChange: Number(s.percent_change),
          high: Number(s.high),
          low: Number(s.low),
          volume: Number(s.volume),
          turnover: Number(s.turnover),
          trades: Number(s.trades),
          prevClose: Number(s.previous_close)
        };
      });
      console.log('Loaded nepse_data stocks:', nepseDataStocks.length);
      console.log('Sample stock:', nepseDataStocks[0]);
    }
  } catch (e: any) {
    console.log('Error fetching nepse_data.json:', e.message);
  }

  // 4. Fetch top stocks
  try {
    const topRes = await fetch('https://raw.githubusercontent.com/Shubhamnpk/yonepse/main/data/top_stocks.json');
    if (topRes.ok) {
      const topData: any = await topRes.json();
      console.log('Top Gainers count:', topData.top_gainer?.length);
      console.log('Top Losers count:', topData.top_loser?.length);
      console.log('Top Turnover count:', topData.top_turnover?.length);
    }
  } catch (e: any) {
    console.log('Error fetching top_stocks.json:', e.message);
  }
}

testIntegratedPipeline();
