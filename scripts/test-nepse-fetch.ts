import * as cheerio from 'cheerio';

async function main() {
  console.log('--- Checking YoNEPSE Github API ---');
  try {
    const ghRes = await fetch('https://api.github.com/repos/Shubhamnpk/yonepse/contents/data');
    if (ghRes.ok) {
      const files: any = await ghRes.json();
      console.log('YoNEPSE files:', files.map((f: any) => f.name));
    }
  } catch (e: any) {
    console.log('YoNEPSE gh error:', e.message);
  }

  console.log('\n--- Checking YoNEPSE indices.json ---');
  try {
    const idxRes = await fetch('https://raw.githubusercontent.com/Shubhamnpk/yonepse/main/data/indices.json');
    if (idxRes.ok) {
      const indices: any = await idxRes.json();
      console.log('YoNEPSE indices sample:', JSON.stringify(indices, null, 2));
    }
  } catch (e: any) {
    console.log('YoNEPSE indices error:', e.message);
  }

  console.log('\n--- Checking ShareSansar /live-trading ---');
  try {
    const ssRes = await fetch('https://www.sharesansar.com/live-trading', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    console.log('ShareSansar live-trading HTTP status:', ssRes.status);
    if (ssRes.ok) {
      const html = await ssRes.text();
      const $ = cheerio.load(html);
      const rows: any[] = [];
      $('table tbody tr').each((i, el) => {
        if (i < 5) {
          const cells = $(el).find('td').map((_, td) => $(td).text().trim()).get();
          rows.push(cells);
        }
      });
      console.log('ShareSansar sample rows:', rows);
    }
  } catch (e: any) {
    console.log('ShareSansar error:', e.message);
  }

  console.log('\n--- Checking MeroLagani /LatestMarket.aspx ---');
  try {
    const mlRes = await fetch('https://merolagani.com/LatestMarket.aspx', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    console.log('MeroLagani LatestMarket HTTP status:', mlRes.status);
    if (mlRes.ok) {
      const html = await mlRes.text();
      const $ = cheerio.load(html);
      const rows: any[] = [];
      $('.table-hover tbody tr, #ctl00_ContentPlaceHolder1_LiveTrading tbody tr, table tbody tr').each((i, el) => {
        if (i < 5) {
          const cells = $(el).find('td').map((_, td) => $(td).text().trim()).get();
          if (cells.length > 0) rows.push(cells);
        }
      });
      console.log('MeroLagani sample rows (total ' + rows.length + '):', rows);

      // Check for index table on MeroLagani home or market page
      const indices: any[] = [];
      $('[id*="Index"], [class*="index"], table').each((_, table) => {
        const text = $(table).text();
        if (text.includes('NEPSE') || text.includes('Sensitive')) {
          indices.push(text.slice(0, 200).replace(/\s+/g, ' '));
        }
      });
      console.log('MeroLagani index snippets:', indices.slice(0, 3));
    }
  } catch (e: any) {
    console.log('MeroLagani error:', e.message);
  }

  console.log('\n--- Checking ShareBazaar / NepalStock API ---');
  const otherApis = [
    'https://nepalstock.com.np/api/nots/nepse-data/market-open',
    'https://nepalstock.onrender.com/info',
    'https://nepalstock.onrender.com/market-summary',
    'https://raw.githubusercontent.com/ra8in/nepse_data_api/master/README.md',
    'https://raw.githubusercontent.com/surajrimal07/NepseAPI-Unofficial/main/README.md'
  ];
  for (const url of otherApis) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(url, 'Status:', res.status);
      if (res.ok && url.includes('json')) {
        const json = await res.json();
        console.log(url, 'Sample:', JSON.stringify(json).slice(0, 100));
      }
    } catch (e: any) {
      console.log(url, 'Error:', e.message);
    }
  }
}

main();
