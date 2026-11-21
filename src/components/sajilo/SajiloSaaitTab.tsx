import React, { useState, useMemo } from 'react';
import { Calendar, Heart, Home, Award, Clock, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { NEPALI_SAAIT_DATABASE } from '../../data/sajiloSaaitData';
import { SaaitRecord } from '../../types/sajiloTypes';

interface SajiloSaaitTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

export const SajiloSaaitTab: React.FC<SajiloSaaitTabProps> = ({ currentLang, devanagariNumerals }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const categories = [
    { id: 'all', labelNp: 'सबै साइत (All)', labelEn: 'All Saait', icon: Sparkles },
    { id: 'vivaha', labelNp: 'विवाह साइत (Wedding)', labelEn: 'Wedding', icon: Heart },
    { id: 'bratabandha', labelNp: 'व्रतबन्ध साइत (Upanayan)', labelEn: 'Bratabandha', icon: Award },
    { id: 'pasni', labelNp: 'पास्नी साइत (Rice Feeding)', labelEn: 'Pasni', icon: Calendar },
    { id: 'grihapravesh', labelNp: 'गृहप्रवेश (Housewarming)', labelEn: 'Griha Pravesh', icon: Home },
  ];

  const months = ['all', 'बैशाख', 'जेठ', 'मंसिर', 'माघ', 'फागुन', 'चैत'];

  const filteredSaait = useMemo(() => {
    return NEPALI_SAAIT_DATABASE.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchMonth = selectedMonth === 'all' || item.bsMonth === selectedMonth;
      return matchCat && matchMonth;
    });
  }, [selectedCategory, selectedMonth]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262a31]">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00e599]" />
              <h3 className="font-bold text-sm sm:text-base text-[#edeef0]">
                {currentLang === 'ne'
                  ? 'नेपाली शुभ साइत तथा लगन तालिका (२०८१ / २०८२)'
                  : 'Nepali Shubha Saait & Muhurat Calendar (2081 / 2082)'}
              </h3>
            </div>
            <p className="text-xs text-[#8c92a4] mt-1">
              {currentLang === 'ne'
                ? 'विवाह, व्रतबन्ध, पास्नी तथा गृहप्रवेशका शास्त्रसम्मत शुभ घडी तथा मुहूर्तहरू।'
                : 'Auspicious Vedic muhurat dates for marriage, upanayan, pasni, and housewarming.'}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00e599]/10 text-[#00e599] text-xs font-bold border border-[#00e599]/30 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{filteredSaait.length} साइतहरू</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#00e599] text-black shadow-lg shadow-[#00e599]/20'
                    : 'bg-[#0d0e12] border border-[#262a31] text-[#8c92a4] hover:text-[#edeef0] hover:bg-[#1a1d24]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{currentLang === 'ne' ? cat.labelNp : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-2 text-xs pt-1">
          <span className="text-[#8c92a4] font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{currentLang === 'ne' ? 'महिना अनुसार छान्नुहोस्:' : 'Filter Month:'}</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {months.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedMonth === m
                    ? 'bg-[#262a31] text-[#00e599] font-bold border border-[#00e599]/40'
                    : 'text-[#8c92a4] hover:text-[#edeef0]'
                }`}
              >
                {m === 'all' ? (currentLang === 'ne' ? 'सबै महिना' : 'All Months') : m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Saait Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSaait.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#14161b] border border-[#262a31] hover:border-[#00e599]/50 transition-all shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#262a31]">
                <div>
                  <span className="text-[11px] font-bold text-[#00e599] uppercase tracking-wider">
                    {item.bsMonth}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-[#edeef0] mt-0.5">
                    {item.titleNp}
                  </h4>
                </div>

                {item.isRecommended && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00e599]/10 text-[#00e599] border border-[#00e599]/30 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>उत्तम साइत</span>
                  </span>
                )}
              </div>

              {/* Date Telemetry */}
              <div className="mt-3 p-3 rounded-xl bg-[#0d0e12] border border-[#262a31] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'वि.सं. मिति:' : 'BS Date:'}</span>
                  <span className="font-bold text-[#edeef0]">{item.bsDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'ई.सं. (AD):' : 'AD Date:'}</span>
                  <span className="text-[#8c92a4]">{item.adDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'तिथि / नक्षत्र:' : 'Tithi/Nakshatra:'}</span>
                  <span className="text-[#f59e0b] font-medium">{item.tithiNp}, {item.nakshatraNp}</span>
                </div>
              </div>

              {/* Auspicious Time Window */}
              <div className="mt-3 p-2.5 rounded-xl bg-[#00e599]/5 border border-[#00e599]/20 text-xs flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#00e599] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#00e599] block">{currentLang === 'ne' ? 'शुभ साइत समय:' : 'Auspicious Window:'}</span>
                  <span className="text-[#edeef0] font-semibold">{item.auspiciousTimeNp}</span>
                </div>
              </div>

              {item.notesNp && (
                <p className="mt-2.5 text-[11px] text-[#8c92a4] leading-relaxed">
                  💡 {item.notesNp}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
