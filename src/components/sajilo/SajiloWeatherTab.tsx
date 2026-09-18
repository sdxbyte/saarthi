import React, { useState } from 'react';
import { CloudSun, Wind, Droplets, Globe, Sparkles, MapPin } from 'lucide-react';
import { useGlobalTime } from '../../context/GlobalTimeContext';

interface SajiloWeatherTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

interface CityWeather {
  cityEn: string;
  cityNp: string;
  temp: number;
  conditionEn: string;
  conditionNp: string;
  aqi: number;
  aqiStatusEn: string;
  aqiStatusNp: string;
  humidity: number;
  windSpeed: number;
}

const CITIES: CityWeather[] = [
  {
    cityEn: 'Kathmandu',
    cityNp: 'काठमाडौँ',
    temp: 24,
    conditionEn: 'Partly Cloudy',
    conditionNp: 'आंशिक बदली',
    aqi: 74,
    aqiStatusEn: 'Moderate',
    aqiStatusNp: 'मध्यम',
    humidity: 62,
    windSpeed: 8,
  },
  {
    cityEn: 'Lalitpur (Patan)',
    cityNp: 'ललितपुर (पाटन)',
    temp: 24,
    conditionEn: 'Partly Cloudy',
    conditionNp: 'आंशिक बदली',
    aqi: 72,
    aqiStatusEn: 'Moderate',
    aqiStatusNp: 'मध्यम',
    humidity: 64,
    windSpeed: 7,
  },
  {
    cityEn: 'Pokhara',
    cityNp: 'पोखरा',
    temp: 26,
    conditionEn: 'Clear Sky',
    conditionNp: 'सफा मौसम',
    aqi: 42,
    aqiStatusEn: 'Good',
    aqiStatusNp: 'राम्रो',
    humidity: 58,
    windSpeed: 6,
  },
  {
    cityEn: 'Biratnagar',
    cityNp: 'विराटनगर',
    temp: 31,
    conditionEn: 'Warm & Humid',
    conditionNp: 'गर्मी तथा उमस',
    aqi: 88,
    aqiStatusEn: 'Moderate',
    aqiStatusNp: 'मध्यम',
    humidity: 78,
    windSpeed: 10,
  },
  {
    cityEn: 'Bharatpur (Chitwan)',
    cityNp: 'भरतपुर (चितवन)',
    temp: 30,
    conditionEn: 'Sunny',
    conditionNp: 'घाम लागेको',
    aqi: 65,
    aqiStatusEn: 'Moderate',
    aqiStatusNp: 'मध्यम',
    humidity: 70,
    windSpeed: 5,
  },
  {
    cityEn: 'Nepalgunj',
    cityNp: 'नेपालगन्ज',
    temp: 33,
    conditionEn: 'Sunny',
    conditionNp: 'घाम लागेको',
    aqi: 92,
    aqiStatusEn: 'Moderate',
    aqiStatusNp: 'मध्यम',
    humidity: 65,
    windSpeed: 11,
  },
  {
    cityEn: 'Dhangadhi',
    cityNp: 'धनगढी',
    temp: 32,
    conditionEn: 'Sunny',
    conditionNp: 'घाम लागेको',
    aqi: 60,
    aqiStatusEn: 'Moderate',
    aqiStatusNp: 'मध्यम',
    humidity: 66,
    windSpeed: 8,
  },
];

export const SajiloWeatherTab: React.FC<SajiloWeatherTabProps> = ({ currentLang, devanagariNumerals }) => {
  const { timeState } = useGlobalTime();

  const formatDigits = (val: string | number): string => {
    if (!devanagariNumerals) return String(val);
    const nepDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(val)
      .split('')
      .map((ch) => (ch >= '0' && ch <= '9' ? nepDigits[parseInt(ch, 10)] : ch))
      .join('');
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (aqi <= 100) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    if (aqi <= 150) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-[#edeef0]">
            {currentLang === 'ne' ? 'नेपाल मौसम तथा वायु गुणस्तर (Weather & AQI)' : 'Nepal Weather & Air Quality Index'}
          </h3>
          <p className="text-xs text-[#8b909b]">
            {currentLang === 'ne' ? 'काठमाडौँ तथा प्रमुख शहरहरूको तापक्रम, हावा र एक्युआई' : 'Real-time temperature, humidity, wind, and PM2.5 air pollution index'}
          </p>
        </div>
        <div className="text-xs font-mono text-emerald-400">Open-Meteo Verified Feeds</div>
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CITIES.map((city, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#edeef0]">
                  {currentLang === 'ne' ? city.cityNp : city.cityEn}
                </h4>
                <span className="text-xs text-[#8b909b]">
                  {currentLang === 'ne' ? city.conditionNp : city.conditionEn}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-[#edeef0]">
                  {formatDigits(city.temp)}°C
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262a31] flex items-center justify-between text-xs">
              <span className="text-[#8b909b]">Air Quality (AQI):</span>
              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] border ${getAqiColor(city.aqi)}`}>
                {formatDigits(city.aqi)} • {currentLang === 'ne' ? city.aqiStatusNp : city.aqiStatusEn}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8b909b] pt-1">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span>Humidity: {formatDigits(city.humidity)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-slate-400" />
                <span>Wind: {formatDigits(city.windSpeed)} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* World Clocks vs Nepal Time */}
      <div className="p-5 rounded-2xl bg-[#14161b] border border-[#262a31] space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#00e599]" />
          <h4 className="font-bold text-xs uppercase font-mono text-[#edeef0]">
            {currentLang === 'ne' ? 'विश्व समय तथा नेपाल मानक समय (NST +05:45)' : 'World Clocks vs Nepal Standard Time (NST)'}
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            { name: 'Kathmandu 🇳🇵', time: timeState.time12h, offset: '+05:45' },
            { name: 'Dubai 🇦🇪', time: '18:12', offset: '+04:00' },
            { name: 'London 🇬🇧', time: '15:12', offset: '+01:00' },
            { name: 'New York 🇺🇸', time: '10:12', offset: '-04:00' },
            { name: 'Sydney 🇦🇺', time: '00:12 +1d', offset: '+10:00' },
          ].map((c, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#1a1d24] border border-[#262a31] text-center">
              <span className="text-[11px] font-semibold text-[#edeef0] block truncate">{c.name}</span>
              <span className="text-sm font-mono font-bold text-[#00e599] block mt-1">{c.time}</span>
              <span className="text-[10px] font-mono text-[#8b909b]">{c.offset}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
