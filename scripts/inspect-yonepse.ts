async function inspectYoNepseFiles() {
  const files = [
    'indices.json',
    'sector_indices.json',
    'market_summary.json',
    'market_status.json',
    'top_stocks.json',
    'all_securities.json',
    'nepse_data.json'
  ];

  for (const f of files) {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/Shubhamnpk/yonepse/main/data/${f}`);
      console.log(`\n=================== ${f} (Status: ${res.status}) ===================`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          console.log(`Array of ${json.length} items. First 2:`);
          console.log(JSON.stringify(json.slice(0, 2), null, 2));
        } else {
          console.log(`Object with keys:`, Object.keys(json));
          console.log(JSON.stringify(json, null, 2).slice(0, 500));
        }
      }
    } catch (e: any) {
      console.log(`Error fetching ${f}:`, e.message);
    }
  }
}

inspectYoNepseFiles();
