import React, { useState } from 'react';
import { Sparkles, BookOpen, Flame, Play, Pause, RotateCcw, Volume2, CheckCircle2 } from 'lucide-react';
import { SACRED_STOTRAS_DATABASE, FESTIVE_PUJA_VIDHI_DATABASE } from '../../data/sajiloStotraData';
import { StotraItem, PujaVidhiItem } from '../../types/sajiloTypes';

interface SajiloStotraTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

export const SajiloStotraTab: React.FC<SajiloStotraTabProps> = ({ currentLang, devanagariNumerals }) => {
  const [activeSection, setActiveSection] = useState<'stotra' | 'vidhi' | 'japa'>('stotra');
  const [selectedStotraId, setSelectedStotraId] = useState<string>('stotra-hanuman');
  const [selectedVidhiId, setSelectedVidhiId] = useState<string>('vidhi-ghatasthapana');

  // 108 Japa Counter State
  const [japaCount, setJapaCount] = useState<number>(0);
  const [japaMantra, setJapaMantra] = useState<'mahamrityunjaya' | 'gayatri' | 'omnamahshivaya'>('mahamrityunjaya');

  const selectedStotra =
    SACRED_STOTRAS_DATABASE.find((s) => s.id === selectedStotraId) || SACRED_STOTRAS_DATABASE[0];

  const selectedVidhi =
    FESTIVE_PUJA_VIDHI_DATABASE.find((v) => v.id === selectedVidhiId) || FESTIVE_PUJA_VIDHI_DATABASE[0];

  const formatDigits = (val: string | number): string => {
    if (!devanagariNumerals) return String(val);
    const nepDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(val)
      .split('')
      .map((ch) => (ch >= '0' && ch <= '9' ? nepDigits[parseInt(ch, 10)] : ch))
      .join('');
  };

  const handleIncrementJapa = () => {
    if (japaCount < 108) {
      setJapaCount((prev) => prev + 1);
    }
  };

  const handleResetJapa = () => {
    setJapaCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Section Nav */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#14161b] border border-[#262a31] rounded-xl self-start">
        <button
          onClick={() => setActiveSection('stotra')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeSection === 'stotra'
              ? 'bg-[#00e599] text-black shadow-lg shadow-[#00e599]/20'
              : 'text-[#8c92a4] hover:text-[#edeef0] hover:bg-[#1a1d24]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{currentLang === 'ne' ? 'नित्य स्तोत्र तथा मन्त्र' : 'Sacred Stotras'}</span>
        </button>

        <button
          onClick={() => setActiveSection('japa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeSection === 'japa'
              ? 'bg-[#f59e0b] text-black shadow-lg shadow-[#f59e0b]/20'
              : 'text-[#8c92a4] hover:text-[#edeef0] hover:bg-[#1a1d24]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{currentLang === 'ne' ? '१०८ जप माला काउन्टर' : '108 Japa Counter'}</span>
        </button>

        <button
          onClick={() => setActiveSection('vidhi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeSection === 'vidhi'
              ? 'bg-[#ff4d6d] text-white shadow-lg shadow-[#ff4d6d]/20'
              : 'text-[#8c92a4] hover:text-[#edeef0] hover:bg-[#1a1d24]'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>{currentLang === 'ne' ? 'चाडपर्व पूजा विधि' : 'Festive Puja Vidhi'}</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 1: SACRED STOTRAS */}
      {/* ---------------------------------------------------- */}
      {activeSection === 'stotra' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stotra Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <h4 className="text-xs font-bold text-[#8c92a4] uppercase tracking-wider px-2">
              {currentLang === 'ne' ? 'स्तोत्र सूची (Select Stotra)' : 'Stotra Catalog'}
            </h4>
            {SACRED_STOTRAS_DATABASE.map((item) => {
              const isSelected = item.id === selectedStotraId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedStotraId(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#1a1d24] border-[#00e599] text-[#edeef0] shadow-md'
                      : 'bg-[#14161b] border-[#262a31] text-[#8c92a4] hover:text-[#edeef0] hover:bg-[#181a20]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#edeef0]">{item.titleNp}</div>
                  <div className="text-xs text-[#00e599] mt-0.5">{item.deityNp}</div>
                  <p className="text-[11px] text-[#8c92a4] line-clamp-1 mt-1">{item.descriptionNp}</p>
                </button>
              );
            })}
          </div>

          {/* Stotra Verses Content View */}
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] shadow-xl space-y-6">
            <div className="pb-4 border-b border-[#262a31]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#edeef0]">{selectedStotra.titleNp}</h3>
                  <p className="text-xs text-[#00e599] font-medium mt-0.5">
                    {selectedStotra.deityNp} {selectedStotra.authorNp ? `• रचयिता: ${selectedStotra.authorNp}` : ''}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#00e599]/10 text-[#00e599] text-xs font-semibold border border-[#00e599]/30">
                  {selectedStotra.verses.length} श्लोकहरू
                </span>
              </div>
              <p className="text-xs text-[#8c92a4] mt-2 leading-relaxed">{selectedStotra.descriptionNp}</p>
            </div>

            {/* Verses List */}
            <div className="space-y-4">
              {selectedStotra.verses.map((verse) => (
                <div
                  key={verse.number}
                  className="p-4 rounded-xl bg-[#0d0e12] border border-[#262a31] space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1a1d24] text-[#00e599] text-xs font-bold flex items-center justify-center border border-[#262a31]">
                      {formatDigits(verse.number)}
                    </span>
                    <span className="text-[11px] text-[#8c92a4] font-semibold">
                      {currentLang === 'ne' ? 'संस्कृत मूल श्लोक' : 'Sanskrit Verse'}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-[#edeef0] whitespace-pre-line leading-relaxed font-serif">
                    {verse.sanskritText}
                  </p>

                  <div className="pt-2 border-t border-[#262a31]/60 text-xs text-[#8c92a4] leading-relaxed">
                    <span className="font-bold text-[#f59e0b] block mb-0.5">नेपाली भावार्थ:</span>
                    {verse.nepaliMeaning}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SECTION 2: 108 JAPA MANTRA COUNTER */}
      {/* ---------------------------------------------------- */}
      {activeSection === 'japa' && (
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#14161b] border border-[#262a31] shadow-2xl space-y-6 text-center">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-bold border border-[#f59e0b]/30">
              १०८ मन्त्र जप साधना
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#edeef0] mt-3">
              {japaMantra === 'mahamrityunjaya'
                ? 'महामृत्युञ्जय मन्त्र जप'
                : japaMantra === 'gayatri'
                ? 'गायत्री मन्त्र जप'
                : 'ॐ नमः शिवाय पञ्चाक्षर मन्त्र'}
            </h3>
            <p className="text-xs text-[#8c92a4] mt-1">
              प्रत्येक मन्त्र उच्चारण पश्चात गोलो चक्रमा थिच्नुहोस् वा क्लिक गर्नुहोस्।
            </p>
          </div>

          {/* Mantra Selector */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setJapaMantra('mahamrityunjaya');
                setJapaCount(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                japaMantra === 'mahamrityunjaya'
                  ? 'bg-[#f59e0b] text-black'
                  : 'bg-[#0d0e12] border border-[#262a31] text-[#8c92a4]'
              }`}
            >
              महामृत्युञ्जय
            </button>
            <button
              onClick={() => {
                setJapaMantra('gayatri');
                setJapaCount(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                japaMantra === 'gayatri'
                  ? 'bg-[#f59e0b] text-black'
                  : 'bg-[#0d0e12] border border-[#262a31] text-[#8c92a4]'
              }`}
            >
              गायत्री मन्त्र
            </button>
            <button
              onClick={() => {
                setJapaMantra('omnamahshivaya');
                setJapaCount(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                japaMantra === 'omnamahshivaya'
                  ? 'bg-[#f59e0b] text-black'
                  : 'bg-[#0d0e12] border border-[#262a31] text-[#8c92a4]'
              }`}
            >
              ॐ नमः शिवाय
            </button>
          </div>

          {/* Big Interactive Circular Counter */}
          <div className="flex flex-col items-center justify-center py-4">
            <button
              onClick={handleIncrementJapa}
              className="w-48 h-48 rounded-full border-4 border-[#f59e0b] bg-[#0d0e12] hover:bg-[#1a1d24] active:scale-95 transition-all flex flex-col items-center justify-center shadow-2xl shadow-[#f59e0b]/20 group"
            >
              <span className="text-4xl sm:text-5xl font-black text-[#f59e0b] tracking-wider">
                {formatDigits(japaCount)}
              </span>
              <span className="text-xs text-[#8c92a4] font-semibold mt-1">
                / {formatDigits(108)} जप
              </span>
              <span className="text-[10px] text-[#00e599] font-medium mt-2 opacity-80 group-hover:opacity-100">
                (क्लिक गरी जप थप्नुहोस्)
              </span>
            </button>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mt-6 bg-[#0d0e12] rounded-full h-2.5 overflow-hidden border border-[#262a31]">
              <div
                className="bg-[#f59e0b] h-full transition-all duration-300"
                style={{ width: `${(japaCount / 108) * 100}%` }}
              />
            </div>
          </div>

          {/* Reset & Status */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handleResetJapa}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d0e12] border border-[#262a31] text-xs font-semibold text-[#8c92a4] hover:text-[#edeef0] hover:bg-[#1a1d24] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? 'सुरुबाट गणना गर्नुहोस् (Reset)' : 'Reset'}</span>
            </button>

            {japaCount >= 108 && (
              <span className="flex items-center gap-1 text-xs font-bold text-[#00e599]">
                <CheckCircle2 className="w-4 h-4" />
                <span>माला पूर्ण भयो!</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SECTION 3: FESTIVE PUJA VIDHI */}
      {/* ---------------------------------------------------- */}
      {activeSection === 'vidhi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-2">
            <h4 className="text-xs font-bold text-[#8c92a4] uppercase tracking-wider px-2">
              {currentLang === 'ne' ? 'चाडपर्व विधि सूची' : 'Puja Vidhi Catalog'}
            </h4>
            {FESTIVE_PUJA_VIDHI_DATABASE.map((item) => {
              const isSelected = item.id === selectedVidhiId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedVidhiId(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#1a1d24] border-[#ff4d6d] text-[#edeef0] shadow-md'
                      : 'bg-[#14161b] border-[#262a31] text-[#8c92a4] hover:text-[#edeef0] hover:bg-[#181a20]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#edeef0]">{item.titleNp}</div>
                  <div className="text-xs text-[#ff4d6d] mt-0.5">{item.occasionNp}</div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#14161b] border border-[#262a31] shadow-xl space-y-6">
            <div className="pb-4 border-b border-[#262a31]">
              <h3 className="text-lg sm:text-xl font-black text-[#edeef0]">{selectedVidhi.titleNp}</h3>
              <p className="text-xs text-[#ff4d6d] font-medium mt-0.5">{selectedVidhi.occasionNp}</p>
            </div>

            {/* Materials Needed Box */}
            <div className="p-4 rounded-xl bg-[#0d0e12] border border-[#262a31] space-y-2">
              <h4 className="text-xs font-bold text-[#00e599] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>आवश्यक पूजा सामग्रीहरू:</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedVidhi.materialsNeededNp.map((mat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#14161b] border border-[#262a31] text-xs text-[#edeef0]"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* Steps List */}
            <div className="space-y-4">
              {selectedVidhi.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-xl bg-[#0d0e12] border border-[#262a31] space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#ff4d6d] text-white text-xs font-bold flex items-center justify-center">
                      {formatDigits(step.stepNumber)}
                    </span>
                    <h5 className="font-bold text-sm text-[#edeef0]">{step.stepTitleNp}</h5>
                  </div>

                  <p className="text-xs sm:text-sm text-[#8c92a4] leading-relaxed pl-8">
                    {step.instructionsNp}
                  </p>

                  {step.mantraNp && (
                    <div className="mt-2 ml-8 p-3 rounded-lg bg-[#14161b] border border-[#ff4d6d]/30 text-xs font-serif text-[#ff4d6d]">
                      <span className="font-bold block text-[10px] text-[#8c92a4] uppercase mb-0.5">सङ्कल्प मन्त्र:</span>
                      {step.mantraNp}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
