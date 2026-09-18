import React, { useState } from 'react';
import { Sparkles, Moon, Sun, Star } from 'lucide-react';

interface SajiloRashifalTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

const RASHIS = [
  { nameNp: 'मेष', nameEn: 'Aries', icon: '♈', element: 'Fire', color: 'Red', luckyNum: 9, textNp: 'रोकिएका कामहरू बन्नेछन्। आर्थिक लाभ र नयाँ सहकार्यको अवसर मिल्नेछ। बोलीमा ध्यान दिनुहोला।', textEn: 'Pending projects gain momentum. Good day for financial ventures and family harmony.' },
  { nameNp: 'वृष', nameEn: 'Taurus', icon: '♉', element: 'Earth', color: 'White', luckyNum: 6, textNp: 'स्वास्थ्यमा सुधार हुनेछ। व्यापार व्यवसायमा सामान्य लाभ रहनेछ। विद्यार्थीहरूका लागि राम्रो समय।', textEn: 'Health improves steadily. Steady professional earnings. Favorable for educational pursuits.' },
  { nameNp: 'मिथुन', nameEn: 'Gemini', icon: '♊', element: 'Air', color: 'Green', luckyNum: 5, textNp: 'मनमा उत्साह रहनेछ। यात्राको योग बन्नेछ। साथीभाइबाट सहयोग पाइनेछ।', textEn: 'Enthusiastic energy throughout the day. Short travel likely. Support from colleagues.' },
  { nameNp: 'कर्कट', nameEn: 'Cancer', icon: '♋', element: 'Water', color: 'Silver', luckyNum: 2, textNp: 'पारिवारिक सुख मिल्नेछ। नयाँ जिम्मेवारी प्राप्त हुन सक्छ। खर्चमा नियन्त्रण गर्नुहोला।', textEn: 'Domestic peace and comfort. Potential promotion or new responsibility at work.' },
  { nameNp: 'सिंह', nameEn: 'Leo', icon: '♌', element: 'Fire', color: 'Gold', luckyNum: 1, textNp: 'आत्मविश्वास बढ्नेछ। सामाजिक प्रतिष्ठामा वृद्धि हुनेछ। सरकारी कामहरू सहजै बन्नेछन्।', textEn: 'High confidence and leadership. Excellent day for administrative and civic tasks.' },
  { nameNp: 'कन्या', nameEn: 'Virgo', icon: '♍', element: 'Earth', color: 'Green', luckyNum: 5, textNp: 'अध्ययन अध्यापनमा मन जानेछ। वित्तीय लगानी फलदायी हुनेछ। स्वास्थ्यको ख्याल राख्नुहोला।', textEn: 'Focused intellect. Prudent financial decisions yield gains. Watch dietary habits.' },
  { nameNp: 'तुला', nameEn: 'Libra', icon: '♎', element: 'Air', color: 'Blue', luckyNum: 6, textNp: 'व्यापारमा नयाँ लगानीको अवसर आउनेछ। दाजुभाइ तथा इष्टमित्रबाट पूर्ण सहयोग मिल्नेछ।', textEn: 'Favorable partnerships and business expansion. Harmonious interactions with peers.' },
  { nameNp: 'वृश्चिक', nameEn: 'Scorpio', icon: '♏', element: 'Water', color: 'Maroon', luckyNum: 9, textNp: 'शत्रुहरू परास्त हुनेछन्। जटिल समस्याहरूको समाधान भेटिनेछ। मान-सम्मान मिल्नेछ।', textEn: 'Obstacles cleared. Decisive breakthroughs in challenging projects. Recognition in community.' },
  { nameNp: 'धनु', nameEn: 'Sagittarius', icon: '♐', element: 'Fire', color: 'Yellow', luckyNum: 3, textNp: 'धार्मिक तथा सांस्कृतिक कार्यमा रुचि बढ्नेछ। टाढाको यात्राको योग छ। मन प्रसन्न रहनेछ।', textEn: 'Spiritual clarity and positive outlook. Long-distance communications bring good news.' },
  { nameNp: 'मकर', nameEn: 'Capricorn', icon: '♑', element: 'Earth', color: 'Black', luckyNum: 8, textNp: 'काममा केही ढिलासुस्ती हुन सक्छ तर धैर्य राख्दा सफलता मिल्नेछ। आर्थिक पक्ष सबल रहनेछ।', textEn: 'Patience required in routine tasks. Solid financial resilience and practical outcomes.' },
  { nameNp: 'कुम्भ', nameEn: 'Aquarius', icon: '♒', element: 'Air', color: 'Cyan', luckyNum: 8, textNp: 'नयाँ योजना सुरु गर्न उत्तम समय छ। प्रविधिको प्रयोगबाट विशेष फाइदा हुनेछ।', textEn: 'Innovative concepts succeed. Tech-related workflows deliver impressive efficiency.' },
  { nameNp: 'मीन', nameEn: 'Pisces', icon: '♓', element: 'Water', color: 'Yellow', luckyNum: 3, textNp: 'आध्यात्मिक शान्ति प्राप्त हुनेछ। रोकिएको धन प्राप्त हुने सम्भावना छ। प्रियजनसँग भेटघाट हुनेछ।', textEn: 'Inner peace and intuition. Recovery of stuck funds. Pleasant reunion with loved ones.' },
];

export const SajiloRashifalTab: React.FC<SajiloRashifalTabProps> = ({ currentLang, devanagariNumerals }) => {
  const [selectedRashi, setSelectedRashi] = useState<number | null>(null);

  const formatDigits = (val: string | number): string => {
    if (!devanagariNumerals) return String(val);
    const nepDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(val)
      .split('')
      .map((ch) => (ch >= '0' && ch <= '9' ? nepDigits[parseInt(ch, 10)] : ch))
      .join('');
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-[#edeef0]">
            {currentLang === 'ne' ? 'दैनिक राशिफल (Daily Vedic Horoscope)' : 'Daily Vedic Rashifal & Planetary Alignments'}
          </h3>
          <p className="text-xs text-[#8b909b]">
            {currentLang === 'ne' ? '१२ राशिहरूको आजको ग्रहगोचर तथा शुभ फल' : 'Daily planetary predictions, auspicious colors and numbers'}
          </p>
        </div>
        <div className="text-xs font-mono text-amber-400">Vedic Panchang Aligned</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RASHIS.map((r, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedRashi(selectedRashi === idx ? null : idx)}
            className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] hover:border-amber-500/40 cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-[#edeef0]">
                    {currentLang === 'ne' ? `${r.nameNp} (${r.nameEn})` : `${r.nameEn} (${r.nameNp})`}
                  </h4>
                  <span className="text-[10px] font-mono text-[#8b909b]">
                    Element: {r.element}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                Lucky: {formatDigits(r.luckyNum)}
              </span>
            </div>

            <p className="text-xs text-[#8b909b] leading-relaxed">
              {currentLang === 'ne' ? r.textNp : r.textEn}
            </p>

            <div className="pt-2 border-t border-[#262a31]/60 flex items-center justify-between text-[10px] font-mono text-[#8b909b]">
              <span>Auspicious Color: {r.color}</span>
              <span className="text-amber-400">Daily Forecast</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
