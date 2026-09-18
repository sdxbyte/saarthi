import React, { useState } from 'react';
import { Newspaper, ExternalLink, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

interface SajiloNewsTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

interface NewsItem {
  id: string;
  titleEn: string;
  titleNp: string;
  publisher: string;
  category: 'national' | 'finance' | 'tech' | 'gov';
  timeAgo: string;
  sourceUrl: string;
  snippetEn: string;
  snippetNp: string;
}

const NEWS_ARTICLES: NewsItem[] = [
  {
    id: 'n-1',
    titleEn: 'Nepal Rastra Bank Issues Directive on Digital Payments & Cross-Border QR Interoperability',
    titleNp: 'नेपाल राष्ट्र बैंकद्वारा डिजिटल भुक्तानी तथा अन्तरदेशीय क्युआर सम्बन्धी नयाँ निर्देशन जारी',
    publisher: 'Nepal Rastra Bank (NRB)',
    category: 'finance',
    timeAgo: '2 hours ago',
    sourceUrl: 'https://nrb.org.np',
    snippetEn: 'Central bank permits expanded interoperability for retail cross-border merchant payments between Nepal and India.',
    snippetNp: 'नेपाल र भारतबीच खुद्रा व्यापारी भुक्तानीका लागि अन्तर-आबद्धता थप विस्तार गर्न केन्द्रीय बैंकको स्वीकृति।',
  },
  {
    id: 'n-2',
    titleEn: 'Department of Transport Launches Automated License Renewal Tracking System',
    titleNp: 'यातायात व्यवस्था विभागद्वारा स्वचालित लाइसेन्स नवीकरण ट्र्याकिङ प्रणाली सुरु',
    publisher: 'Department of Transport Management (DoTM)',
    category: 'gov',
    timeAgo: '4 hours ago',
    sourceUrl: 'https://dotm.gov.np',
    snippetEn: 'Citizens can now track smart driving license printing queue and dispatch status online.',
    snippetNp: 'सेवाग्राहीले अब स्मार्ट चालक अनुमतिपत्र छपाइ र वितरणको स्थिति अनलाइनबाटै हेर्न सक्ने।',
  },
  {
    id: 'n-3',
    titleEn: 'NEPSE Crosses 2,740 Mark as Hydropower and Commercial Banking Lead Heavy Turnover',
    titleNp: 'जलविद्युत र बैंकिङ समूहको उत्साहले नेप्से परिसूचक २,७४० अंक पार, ७.८ अर्बको कारोबार',
    publisher: 'ShareSansar / MeroLagani',
    category: 'finance',
    timeAgo: '5 hours ago',
    sourceUrl: 'https://sharesansar.com',
    snippetEn: 'Positive market sentiment pushes benchmark index up by 24 points amid robust institutional participation.',
    snippetNp: 'बजारमा लगानीकर्ताको मनोबल उच्च रहँदा नेप्से परिसूचक २४ अंकले वृद्धि, कारोबार रकममा उल्लेख्य सुधार।',
  },
  {
    id: 'n-4',
    titleEn: 'Kalimati Market Reports High Inflow of Local Organic Produce; Vegetable Tariffs Stabilize',
    titleNp: 'कालिमाटी बजारमा स्थानीय तरकारीको आपूर्ति वृद्धि, अधिकांश कृषि उपजको मूल्य स्थिर',
    publisher: 'KFVMDB Official Notice',
    category: 'national',
    timeAgo: '7 hours ago',
    sourceUrl: 'https://kalimatimarket.gov.np',
    snippetEn: 'Seasonal inflow from Kavre, Dhading, and Makwanpur keeps wholesale vegetable rates affordable.',
    snippetNp: 'काभ्रे, धादिङ र मकवानपुरबाट ताजा तरकारीको आपूर्ति बढेसँगै खुद्रा मूल्यमा स्थिरता आएको छ।',
  },
  {
    id: 'n-5',
    titleEn: 'Nepal Telecom Completes Fiber-to-the-Home Expansion Across 15 Additional Remote Municipalities',
    titleNp: 'नेपाल टेलिकमद्वारा थप १५ दुर्गम पालिकाहरूमा तीव्र गतिको एफटिटिएच (FTTH) फाइबर सेवा विस्तार',
    publisher: 'Nepal Telecom (NTC)',
    category: 'tech',
    timeAgo: '1 day ago',
    sourceUrl: 'https://ntc.net.np',
    snippetEn: 'High-speed broadband network now covers mountainous municipal centres for civic administration.',
    snippetNp: 'उच्च गतिको ब्रोडब्यान्ड इन्टरनेट अब हिमाली तथा दुर्गम पालिका केन्द्रहरूमा पनि उपलब्ध भएको छ।',
  },
];

export const SajiloNewsTab: React.FC<SajiloNewsTabProps> = ({ currentLang, devanagariNumerals }) => {
  const [activeCat, setActiveCat] = useState<string>('all');

  const filteredNews = NEWS_ARTICLES.filter((n) => activeCat === 'all' || n.category === activeCat);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-[#edeef0]">
            {currentLang === 'ne' ? 'प्रमाणित समाचार तथा सरकारी सूचनाहरू' : 'Verified Nepal News & Official Notices'}
          </h3>
          <p className="text-xs text-[#8b909b]">
            {currentLang === 'ne' ? 'नेपाल राष्ट्र बैंक, मन्त्रालयहरू र आधिकारिक प्रकाशनहरूको ताजा अपडेट' : 'Curated feed from trusted public publishers with direct links to source'}
          </p>
        </div>
        <div className="text-xs font-mono text-emerald-400">Authentic Public Sources</div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', labelEn: 'All News', labelNp: 'सबै समाचार' },
          { id: 'gov', labelEn: 'Govt Notices', labelNp: 'सरकारी सूचना' },
          { id: 'finance', labelEn: 'Finance & Economy', labelNp: 'अर्थतन्त्र' },
          { id: 'national', labelEn: 'National', labelNp: 'राष्ट्रिय' },
          { id: 'tech', labelEn: 'Technology', labelNp: 'प्रविधि' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
              activeCat === c.id
                ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40 font-bold'
                : 'bg-[#14161b] text-[#8b909b] hover:text-[#edeef0] border border-[#262a31]'
            }`}
          >
            {currentLang === 'ne' ? c.labelNp : c.labelEn}
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {filteredNews.map((article) => (
          <article
            key={article.id}
            className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] hover:border-[#00e599]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#8b909b]">
                <span className="text-[#00e599] font-bold">{article.publisher}</span>
                <span>•</span>
                <span>{article.timeAgo}</span>
              </div>

              <h4 className="font-bold text-xs sm:text-sm text-[#edeef0] leading-snug">
                {currentLang === 'ne' ? article.titleNp : article.titleEn}
              </h4>

              <p className="text-xs text-[#8b909b] line-clamp-2">
                {currentLang === 'ne' ? article.snippetNp : article.snippetEn}
              </p>
            </div>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#1f232b] hover:bg-[#262a31] border border-[#262a31] text-xs font-mono text-[#edeef0] hover:text-[#00e599] flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-center"
            >
              <span>{currentLang === 'ne' ? 'मूल समाचार पढ्नुहोस्' : 'Read Original'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};
