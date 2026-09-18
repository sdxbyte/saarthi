import { PublicApiEntry, ApiTestRequest, ApiTestResponse } from '../types/publicApis';
import { PUBLIC_APIS_DATASET } from '../data/publicApisData';

// Fetch Live List or fallback to curated dataset
export async function getPublicApisList(category?: string, query?: string): Promise<PublicApiEntry[]> {
  let list = [...PUBLIC_APIS_DATASET];

  // Try fetching fresh data from backend cache / proxy if available
  try {
    const res = await fetch('/api/public-apis/entries');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        list = data;
      }
    }
  } catch (e) {
    // Graceful fallback to embedded vetted dataset
  }

  if (category && category !== 'all') {
    list = list.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.descriptionNp && item.descriptionNp.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }

  return list;
}

// Interactive API Sandbox Runner (Client Fetch with Backend Proxy Fallback)
export async function executeApiTest(req: ApiTestRequest): Promise<ApiTestResponse> {
  const startTime = performance.now();
  let url = req.url.trim();

  // Append query params if any
  if (req.params && Object.keys(req.params).length > 0) {
    const parsedUrl = new URL(url);
    Object.entries(req.params).forEach(([k, v]) => {
      if (k && v) parsedUrl.searchParams.append(k, v);
    });
    url = parsedUrl.toString();
  }

  // Attempt direct fetch first
  try {
    const options: RequestInit = {
      method: req.method || 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        ...(req.headers || {}),
      },
    };

    if (req.method !== 'GET' && req.body) {
      options.body = req.body;
      if (!options.headers) options.headers = {};
      (options.headers as any)['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, options);
    const durationMs = Math.round(performance.now() - startTime);
    const contentType = response.headers.get('content-type') || '';

    let parsedData: any = null;
    let rawText = '';

    if (contentType.includes('application/json')) {
      parsedData = await response.json();
      rawText = JSON.stringify(parsedData, null, 2);
    } else {
      rawText = await response.text();
      try {
        parsedData = JSON.parse(rawText);
      } catch (err) {
        parsedData = rawText;
      }
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      responseHeaders[key] = val;
    });

    return {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      durationMs,
      headers: responseHeaders,
      data: parsedData,
      rawText,
      sizeBytes: new Blob([rawText]).size,
      timestamp: new Date().toISOString(),
    };
  } catch (directError: any) {
    // If CORS or Network failed on browser, route through SAARTHI Backend CORS Proxy
    try {
      const proxyRes = await fetch('/api/public-apis/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: url,
          method: req.method || 'GET',
          headers: req.headers || {},
          body: req.body,
        }),
      });

      const durationMs = Math.round(performance.now() - startTime);
      const proxyResult = await proxyRes.json();

      return {
        status: proxyResult.status || 200,
        statusText: proxyResult.statusText || 'OK (via CORS Proxy)',
        ok: proxyResult.ok ?? true,
        durationMs,
        headers: proxyResult.headers || { 'x-proxy-routed': 'true' },
        data: proxyResult.data,
        rawText: typeof proxyResult.data === 'string' ? proxyResult.data : JSON.stringify(proxyResult.data, null, 2),
        sizeBytes: new Blob([typeof proxyResult.data === 'string' ? proxyResult.data : JSON.stringify(proxyResult.data)]).size,
        timestamp: new Date().toISOString(),
      };
    } catch (proxyError: any) {
      const durationMs = Math.round(performance.now() - startTime);
      return {
        status: 0,
        statusText: 'Network / CORS Error',
        ok: false,
        durationMs,
        headers: {},
        data: { error: 'Request Failed', details: directError.message || 'Unable to connect to host.' },
        rawText: JSON.stringify({ error: directError.message }),
        sizeBytes: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// ----------------------------------------------------
// Specialized Live Public API Tool Drivers
// ----------------------------------------------------

export interface LiveWeatherResult {
  city: string;
  country: string;
  temperature: number;
  apparentTemp: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
  description: string;
  isDay: boolean;
  time: string;
}

export async function fetchLiveCityWeather(city: string = 'Kathmandu'): Promise<LiveWeatherResult> {
  const cityCoords: Record<string, { lat: number; lon: number; country: string }> = {
    'Kathmandu': { lat: 27.7172, lon: 85.3240, country: 'Nepal' },
    'Pokhara': { lat: 28.2096, lon: 83.9856, country: 'Nepal' },
    'Biratnagar': { lat: 26.4525, lon: 87.2718, country: 'Nepal' },
    'Lalitpur': { lat: 27.6710, lon: 85.3260, country: 'Nepal' },
    'Bharatpur': { lat: 27.6833, lon: 84.4333, country: 'Nepal' },
    'London': { lat: 51.5074, lon: -0.1278, country: 'United Kingdom' },
    'Tokyo': { lat: 35.6762, lon: 139.6503, country: 'Japan' },
    'New York': { lat: 40.7128, lon: -74.0060, country: 'United States' },
    'Delhi': { lat: 28.6139, lon: 77.2090, country: 'India' },
    'Sydney': { lat: -33.8688, lon: 151.2093, country: 'Australia' },
  };

  const coords = cityCoords[city] || cityCoords['Kathmandu'];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const current = data.current_weather;
    const hourIdx = new Date().getHours();
    const humidity = data.hourly?.relativehumidity_2m?.[hourIdx] ?? 65;
    const apparent = data.hourly?.apparent_temperature?.[hourIdx] ?? current.temperature;

    const weatherCodeMap: Record<number, string> = {
      0: 'Clear sky ☀️',
      1: 'Mainly clear 🌤️',
      2: 'Partly cloudy ⛅',
      3: 'Overcast ☁️',
      45: 'Foggy 🌫️',
      48: 'Depositing rime fog 🌫️',
      51: 'Light drizzle 🌦️',
      61: 'Slight rain 🌧️',
      63: 'Moderate rain 🌧️',
      65: 'Heavy rain ⛈️',
      71: 'Slight snowfall 🌨️',
      80: 'Rain showers 🌦️',
      95: 'Thunderstorm ⚡',
    };

    return {
      city,
      country: coords.country,
      temperature: current.temperature,
      apparentTemp: apparent,
      windSpeed: current.windspeed,
      humidity,
      weatherCode: current.weathercode,
      description: weatherCodeMap[current.weathercode] || 'Clear conditions',
      isDay: Boolean(current.is_day),
      time: current.time,
    };
  } catch (e) {
    return {
      city,
      country: coords.country,
      temperature: 24.5,
      apparentTemp: 25.0,
      windSpeed: 8.2,
      humidity: 62,
      weatherCode: 1,
      description: 'Mainly clear 🌤️ (Offline Snapshot)',
      isDay: true,
      time: new Date().toISOString(),
    };
  }
}

export async function fetchLiveIpDetails(): Promise<any> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) return await res.json();
  } catch (e) {}

  try {
    const res2 = await fetch('https://api.ipify.org?format=json');
    if (res2.ok) return await res2.json();
  } catch (e) {}

  return {
    ip: '103.1.200.42',
    city: 'Kathmandu',
    region: 'Bagmati',
    country_name: 'Nepal',
    country_code: 'NP',
    org: 'Nepal Telecom Broadband',
    timezone: 'Asia/Kathmandu',
    latitude: 27.7172,
    longitude: 85.3240,
  };
}

export async function lookupEnglishDictionary(word: string): Promise<any> {
  if (!word || !word.trim()) return null;
  const cleanWord = encodeURIComponent(word.trim().toLowerCase());
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
    if (res.ok) {
      const data = await res.json();
      return data[0];
    }
  } catch (e) {}
  return null;
}

export async function searchUniversitiesByCountry(country: string = 'Nepal'): Promise<any[]> {
  try {
    const res = await fetch(`http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  // Fallback
  return [
    { name: 'Tribhuvan University', country: 'Nepal', web_pages: ['https://tu.edu.np/'], domains: ['tu.edu.np'] },
    { name: 'Kathmandu University', country: 'Nepal', web_pages: ['https://ku.edu.np/'], domains: ['ku.edu.np'] },
    { name: 'Pokhara University', country: 'Nepal', web_pages: ['https://pu.edu.np/'], domains: ['pu.edu.np'] },
    { name: 'Purbanchal University', country: 'Nepal', web_pages: ['https://puexam.edu.np/'], domains: ['puexam.edu.np'] },
    { name: 'Nepal Sanskrit University', country: 'Nepal', web_pages: ['http://nsu.edu.np/'], domains: ['nsu.edu.np'] },
  ];
}

export async function fetchRandomWisdomQuote(): Promise<{ quote: string; author: string; tags: string[] }> {
  try {
    const res = await fetch('https://api.quotable.io/random');
    if (res.ok) {
      const data = await res.json();
      return { quote: data.content, author: data.author, tags: data.tags || ['Inspiration'] };
    }
  } catch (e) {}
  return {
    quote: 'Technology is best when it brings people together and democratizes access for every citizen.',
    author: 'Matt Mullenweg',
    tags: ['Technology', 'Democracy', 'Civic Tech'],
  };
}

export async function fetchCountryDossier(countryName: string = 'nepal'): Promise<any> {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=false`);
    if (res.ok) {
      const data = await res.json();
      return data[0];
    }
  } catch (e) {}
  return null;
}
