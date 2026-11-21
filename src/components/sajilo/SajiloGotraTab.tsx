import React, { useState, useMemo } from 'react';
import { Search, Compass, Shield, Users, Landmark, MapPin, Sparkles } from 'lucide-react';
import { NEPALI_GOTRA_DATABASE } from '../../data/sajiloGotraData';
import { GotraRecord } from '../../types/sajiloTypes';

interface SajiloGotraTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

export const SajiloGotraTab: React.FC<SajiloGotraTabProps> = ({ currentLang, devanagariNumerals }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');

  const filteredRecords = useMemo(() => {
    return NEPALI_GOTRA_DATABASE.filter((item) => {
      const matchesCommunity =
        selectedCommunity === 'all' || item.community === selectedCommunity;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        item.tharNp.toLowerCase().includes(query) ||
        item.tharEn.toLowerCase().includes(query) ||
        item.gotraNp.toLowerCase().includes(query) ||
        item.gotraEn.toLowerCase().includes(query) ||
        item.kuldevataNp.toLowerCase().includes(query) ||
        item.originNp.toLowerCase().includes(query);

      return matchesCommunity && matchesQuery;
    });
  }, [searchQuery, selectedCommunity]);

  const communities = [
    { id: 'all', labelNp: 'सबै (All)', labelEn: 'All' },
    { id: 'brahmin', labelNp: 'ब्राह्मण (Brahmin)', labelEn: 'Brahmin' },
    { id: 'chhetri', labelNp: 'क्षेत्री/ठकुरी (Chhetri)', labelEn: 'Chhetri' },
    { id: 'newar', labelNp: 'नेवार (Newar)', labelEn: 'Newar' },
    { id: 'janajati', labelNp: 'जनजाति/किरात (Janajati)', labelEn: 'Janajati' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262a31]">
          <div>
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#00e599]" />
              <h3 className="font-bold text-sm sm:text-base text-[#edeef0]">
                {currentLang === 'ne'
                  ? 'नेपाली थर, गोत्र, प्रवर तथा कुलदेवता निर्देशिका'
                  : 'Nepali Thar, Gotra, Pravara & Kuldevata Directory'}
              </h3>
            </div>
            <p className="text-xs text-[#8c92a4] mt-1">
              {currentLang === 'ne'
                ? 'आफ्नो थर अनुसार गोत्र, ऋषि प्रवर, कुल मस्टो तथा उद्गमस्थल खोज्नुहोस्।'
                : 'Lookup clan lineage, Rishi Pravara, Kuldevata, and ancestral seat by surname.'}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00e599]/10 text-[#00e599] text-xs font-bold border border-[#00e599]/30 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{filteredRecords.length} रेकर्डहरू</span>
          </div>
        </div>

        {/* Search Input & Community Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c92a4]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLang === 'ne'
                  ? 'थर, गोत्र वा कुलदेवता खोज्नुहोस् (उदा: अधिकारी, काश्यप, मस्टो)...'
                  : 'Search by surname, Gotra or Kuldevata (e.g. Adhikari, Kashyap)...'
              }
              className="w-full pl-9 pr-4 py-2.5 bg-[#0d0e12] border border-[#262a31] rounded-xl text-xs sm:text-sm text-[#edeef0] focus:border-[#00e599] outline-none transition-colors"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0d0e12] border border-[#262a31] rounded-xl text-xs sm:text-sm text-[#edeef0] focus:border-[#00e599] outline-none transition-colors"
            >
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {currentLang === 'ne' ? c.labelNp : c.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gotra Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 rounded-2xl bg-[#14161b] border border-[#262a31] hover:border-[#00e599]/50 transition-all shadow-lg space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#262a31]">
                <div>
                  <h4 className="font-bold text-base text-[#edeef0] flex items-center gap-1.5">
                    <span>{item.tharNp}</span>
                    <span className="text-xs text-[#8c92a4] font-normal">({item.tharEn})</span>
                  </h4>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1a1d24] text-[#00e599] border border-[#262a31]">
                    {item.community.toUpperCase()}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-[#8c92a4] uppercase font-semibold tracking-wider">
                    {currentLang === 'ne' ? 'गोत्र' : 'Gotra'}
                  </div>
                  <div className="font-bold text-sm text-[#00e599]">{item.gotraNp}</div>
                </div>
              </div>

              {/* Attributes List */}
              <div className="space-y-2 mt-3 text-xs">
                <div className="flex items-start gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#f59e0b] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'प्रवर: ' : 'Pravara: '}</span>
                    <span className="text-[#edeef0] font-medium">{item.pravaraNp}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#ff4d6d] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'कुलदेवता: ' : 'Kuldevata: '}</span>
                    <span className="text-[#edeef0] font-medium">{item.kuldevataNp}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#38bdf8] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[#8c92a4]">{currentLang === 'ne' ? 'उद्गमस्थल: ' : 'Origin: '}</span>
                    <span className="text-[#edeef0]">{item.originNp}</span>
                  </div>
                </div>

                {item.subClansNp && item.subClansNp.length > 0 && (
                  <div className="pt-2 border-t border-[#262a31] text-[11px] text-[#8c92a4]">
                    <span className="font-semibold text-[#edeef0]">उप-थर / हाँगा: </span>
                    {item.subClansNp.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-[#14161b] border border-[#262a31] text-[#8c92a4] text-xs sm:text-sm">
          {currentLang === 'ne'
            ? 'खोज गरिएको थर वा गोत्र फेला परेन। कृपया फरक शब्द प्रयोग गर्नुहोस्।'
            : 'No matching surname or Gotra found. Please try another search term.'}
        </div>
      )}
    </div>
  );
};
