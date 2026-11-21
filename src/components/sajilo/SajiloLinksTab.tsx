import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Search,
  Bookmark,
  BookmarkPlus,
  Trash2,
  Tag,
  Globe,
  Sparkles,
  Github,
  Code2,
  Layers,
  Shield,
  BookOpen,
  Terminal,
  Info,
  X,
  Share2,
} from 'lucide-react';
import { CURATED_USEFUL_LINKS } from '../../data/sajiloLinksData';
import { UsefulLinkItem } from '../../types/sajiloTypes';

interface SajiloLinksTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals?: boolean;
}

const STORAGE_KEY_CUSTOM_BOOKMARKS = 'saarthi_custom_bookmarks';

export const SajiloLinksTab: React.FC<SajiloLinksTabProps> = ({ currentLang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customBookmarks, setCustomBookmarks] = useState<UsefulLinkItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_BOOKMARKS);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.warn('Failed to parse custom bookmarks:', err);
      }
    }
    return [];
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<UsefulLinkItem['category']>('custom');
  const [newTags, setNewTags] = useState('');

  // Persist custom bookmarks
  const saveCustomBookmarks = (items: UsefulLinkItem[]) => {
    setCustomBookmarks(items);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_BOOKMARKS, JSON.stringify(items));
      } catch (err) {
        console.warn('Failed to persist custom bookmarks:', err);
      }
    }
  };

  const handleCopy = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCustomBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newItem: UsefulLinkItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      url: formattedUrl,
      category: newCategory,
      descriptionEn: newDesc.trim() || 'Custom saved citizen bookmark.',
      descriptionNp: newDesc.trim() || 'व्यक्तिगत सुरक्षित वेब लिङ्क।',
      tags: tagsArray.length > 0 ? tagsArray : ['Custom', 'Bookmark'],
      badge: 'Personal Bookmark',
    };

    saveCustomBookmarks([newItem, ...customBookmarks]);
    setNewTitle('');
    setNewUrl('');
    setNewDesc('');
    setNewTags('');
    setIsAddModalOpen(false);
  };

  const handleDeleteCustomBookmark = (id: string) => {
    const updated = customBookmarks.filter((item) => item.id !== id);
    saveCustomBookmarks(updated);
  };

  // Combine curated + custom
  const allItems = useMemo(() => {
    return [...customBookmarks, ...CURATED_USEFUL_LINKS];
  }, [customBookmarks]);

  // Filter items
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Category filter
      if (selectedCategory === 'featured' && !item.isFeatured) return false;
      if (selectedCategory === 'fmhy' && item.category !== 'fmhy') return false;
      if (selectedCategory === 'nepali_tools' && item.category !== 'nepali_tools') return false;
      if (selectedCategory === 'civic_gov' && item.category !== 'civic_gov') return false;
      if (selectedCategory === 'dev_tech' && item.category !== 'dev_tech') return false;
      if (selectedCategory === 'media_learning' && item.category !== 'media_learning') return false;
      if (selectedCategory === 'custom' && item.category !== 'custom') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query) || (item.titleNp && item.titleNp.toLowerCase().includes(query));
        const matchesDesc =
          item.descriptionEn.toLowerCase().includes(query) || (item.descriptionNp && item.descriptionNp.toLowerCase().includes(query));
        const matchesUrl = item.url.toLowerCase().includes(query);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesUrl || matchesTags;
      }
      return true;
    });
  }, [allItems, selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', labelEn: 'All Links', labelNp: 'सबै लिङ्कहरू', count: allItems.length },
    { id: 'featured', labelEn: 'Featured Portals', labelNp: 'विशेष सिफारिस', count: allItems.filter((i) => i.isFeatured).length },
    { id: 'fmhy', labelEn: 'FMHY Mega Index', labelNp: 'FMHY स्रोतहरू', count: allItems.filter((i) => i.category === 'fmhy').length },
    { id: 'nepali_tools', labelEn: 'Nepali Open Source', labelNp: 'नेपाली ओपन-सोर्स', count: allItems.filter((i) => i.category === 'nepali_tools').length },
    { id: 'civic_gov', labelEn: 'Civic & Govt', labelNp: 'सरकारी तथा नागरिक', count: allItems.filter((i) => i.category === 'civic_gov').length },
    { id: 'dev_tech', labelEn: 'Dev & Tech', labelNp: 'डेभलपर औजार', count: allItems.filter((i) => i.category === 'dev_tech').length },
    { id: 'media_learning', labelEn: 'Media & Learning', labelNp: 'सिकाइ तथा पुस्तकालय', count: allItems.filter((i) => i.category === 'media_learning').length },
    { id: 'custom', labelEn: 'My Bookmarks', labelNp: 'मेरो बुकमार्क', count: customBookmarks.length },
  ];

  const sajiloHero = CURATED_USEFUL_LINKS.find((i) => i.id === 'link-sajilo-github');
  const fmhyHero = CURATED_USEFUL_LINKS.find((i) => i.id === 'link-fmhy-main');

  return (
    <div id="sajilo-links-tab-container" className="space-y-6">
      {/* 1. Header & Overview */}
      <div className="surface-card p-4 sm:p-5 rounded-[12px] space-y-3 border border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold bg-[var(--color-accent-muted)] text-[var(--color-accent-mark)] border border-[var(--color-accent-mark)]/30">
                {currentLang === 'ne' ? 'उपयोगी वेब लिङ्कहरू' : 'CURATED WEB DIRECTORY'}
              </span>
              <span className="text-xs text-[var(--color-text-secondary)] font-mono">
                {currentLang === 'ne' ? 'सजिलो खुला स्रोत र विश्वव्यापी वेब स्रोत' : 'Sajilo Ecosystem & Global FMHY Directory'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text)] tracking-tight flex items-center gap-2">
              <Globe className="w-5 h-5 text-[var(--color-accent-mark)]" />
              <span>{currentLang === 'ne' ? 'महत्वपूर्ण लिङ्कहरू र खुला स्रोत हब' : 'Useful Links & Resource Hub'}</span>
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
              {currentLang === 'ne'
                ? 'नेपाली दैनिक जीवनका लागि आवश्यक आधिकारिक सरकारी पोर्टलहरू, आदर्श आचार्यको सजिलो खुला स्रोत परियोजना, र विश्वकै विशाल फ्रि-मिडिया-हेक-ये (FMHY) डाइरेक्टरी एकै ठाउँमा।'
                : 'Direct access to essential portals: Adarsha Acharya’s Sajilo open-source suite, the comprehensive FreeMediaHeckYeah (FMHY) directory, official Nepal Government portals, and community dev tools.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-add-custom-link"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-[6px] bg-[var(--color-accent-fill)] text-[var(--color-accent-ink)] hover:opacity-90 font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? 'मेरो लिङ्क थप्नुहोस्' : 'Bookmark a Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Spotlight Hero Section (Sajilo + FMHY) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Spotlight 1: Sajilo GitHub Repository */}
        {sajiloHero && (
          <div
            id="spotlight-sajilo-github"
            className="surface-card p-5 rounded-[12px] border border-[var(--color-accent-mark)]/30 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-accent-muted)]/20 relative overflow-hidden flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Github className="w-3 h-3" />
                  <span>{currentLang === 'ne' ? 'अनुरोध गरिएको खुला स्रोत' : 'Featured Repository'}</span>
                </span>
                <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                  by {sajiloHero.authorOrSource}
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                  <span>{currentLang === 'ne' ? sajiloHero.titleNp : sajiloHero.title}</span>
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                  {currentLang === 'ne' ? sajiloHero.descriptionNp : sajiloHero.descriptionEn}
                </p>
              </div>

              {/* Sub-links / Sections */}
              {sajiloHero.subLinks && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {sajiloHero.subLinks.map((sl) => (
                    <a
                      key={sl.url}
                      href={sl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-[6px] text-[11px] font-medium bg-[var(--color-canvas)] text-[var(--color-text)] hover:text-[var(--color-accent-mark)] border border-[var(--color-border)] hover:border-[var(--color-accent-mark)]/40 transition-colors inline-flex items-center gap-1"
                    >
                      <span>{sl.label}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[var(--color-divider)] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
                <Terminal className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px] sm:max-w-xs">git clone {sajiloHero.url}.git</span>
                <button
                  onClick={() => handleCopy('git-clone-sajilo', `git clone ${sajiloHero.url}.git`)}
                  className="p-1 rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] transition-colors cursor-pointer"
                  title="Copy Git Clone Command"
                >
                  {copiedId === 'git-clone-sajilo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(sajiloHero.id, sajiloHero.url)}
                  className="px-2.5 py-1.5 rounded-[6px] bg-[var(--color-canvas)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedId === sajiloHero.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === sajiloHero.id ? 'Copied' : 'Copy'}</span>
                </button>

                <a
                  id="btn-visit-sajilo-github"
                  href={sajiloHero.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-[6px] bg-[var(--color-accent-fill)] text-[var(--color-accent-ink)] hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>{currentLang === 'ne' ? 'गिटहबमा हेर्नुहोस्' : 'Visit on GitHub'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Spotlight 2: FMHY - FreeMediaHeckYeah */}
        {fmhyHero && (
          <div
            id="spotlight-fmhy-main"
            className="surface-card p-5 rounded-[12px] border border-cyan-500/30 bg-gradient-to-br from-[var(--color-surface)] to-cyan-500/5 relative overflow-hidden flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>{currentLang === 'ne' ? 'अनुरोध गरिएको मेगा डाइरेक्टरी' : 'Global Mega Directory'}</span>
                </span>
                <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                  {fmhyHero.authorOrSource}
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                  <span>{currentLang === 'ne' ? fmhyHero.titleNp : fmhyHero.title}</span>
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                  {currentLang === 'ne' ? fmhyHero.descriptionNp : fmhyHero.descriptionEn}
                </p>
              </div>

              {/* Quick Jump Links into FMHY Sections */}
              {fmhyHero.subLinks && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {fmhyHero.subLinks.map((sl) => (
                    <a
                      key={sl.url}
                      href={sl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-[6px] text-[11px] font-medium bg-[var(--color-canvas)] text-[var(--color-text)] hover:text-cyan-400 border border-[var(--color-border)] hover:border-cyan-500/40 transition-colors inline-flex items-center gap-1"
                    >
                      <span>{sl.label}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[var(--color-divider)] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-xs font-mono text-[var(--color-text-secondary)]">
                <span className="text-cyan-400 font-bold">fmhy.net</span>
                <span>• Ad-free & community curated</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(fmhyHero.id, fmhyHero.url)}
                  className="px-2.5 py-1.5 rounded-[6px] bg-[var(--color-canvas)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedId === fmhyHero.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === fmhyHero.id ? 'Copied' : 'Copy'}</span>
                </button>

                <a
                  id="btn-visit-fmhy-main"
                  href={fmhyHero.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-[6px] bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>{currentLang === 'ne' ? 'fmhy.net खोल्नुहोस्' : 'Explore FMHY'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Search and Category Filter Bar */}
      <div className="surface-card p-4 rounded-[12px] border border-[var(--color-border)] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <input
              id="input-search-links"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLang === 'ne'
                  ? 'लिङ्क, शीर्षक, ट्याग वा पोर्टल खोज्नुहोस् (उदा: FMHY, Sajilo, IRD, NRB, AI, Git)...'
                  : 'Search links, tags, or portals (e.g. FMHY, Sajilo, IRD, NRB, Dev, AI)...'
              }
              className="w-full pl-9 pr-8 py-2 rounded-[6px] bg-[var(--color-canvas)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-mark)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs font-mono text-[var(--color-text-secondary)] self-end sm:self-center">
            {filteredItems.length} {currentLang === 'ne' ? 'लिङ्कहरू भेटिए' : 'links found'}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 custom-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-accent-mark)] border border-[var(--color-border)] shadow-xs font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]/60'
                }`}
              >
                <span>{currentLang === 'ne' ? cat.labelNp : cat.labelEn}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[var(--color-canvas)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Filtered Links Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isCopied = copiedId === item.id;
          const isCustom = item.id.startsWith('custom-');

          return (
            <div
              key={item.id}
              id={`link-card-${item.id}`}
              className="surface-card p-4 rounded-[12px] border border-[var(--color-border)] hover:border-[var(--color-accent-mark)]/40 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-semibold bg-[var(--color-surface-hover)] text-[var(--color-accent-mark)] border border-[var(--color-border)]">
                        {item.badge}
                      </span>
                    )}
                    {item.authorOrSource && (
                      <span className="text-[10px] font-mono text-[var(--color-text-muted)] truncate max-w-[140px]">
                        {item.authorOrSource}
                      </span>
                    )}
                  </div>

                  {isCustom && (
                    <button
                      onClick={() => handleDeleteCustomBookmark(item.id)}
                      className="p-1 rounded text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent-mark)] transition-colors leading-snug">
                    {currentLang === 'ne' && item.titleNp ? item.titleNp : item.title}
                  </h4>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-3 leading-relaxed">
                    {currentLang === 'ne' ? item.descriptionNp : item.descriptionEn}
                  </p>
                </div>

                {/* Sub-links if available */}
                {item.subLinks && item.subLinks.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1">
                    {item.subLinks.slice(0, 3).map((sl) => (
                      <a
                        key={sl.url}
                        href={sl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-canvas)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-[var(--color-border)] inline-flex items-center gap-0.5"
                      >
                        <span className="truncate max-w-[100px]">{sl.label}</span>
                        <ExternalLink className="w-2 h-2 opacity-50" />
                      </a>
                    ))}
                    {item.subLinks.length > 3 && (
                      <span className="text-[10px] text-[var(--color-text-muted)] self-center">
                        +{item.subLinks.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  {item.tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[var(--color-text-muted)] bg-[var(--color-canvas)] border border-[var(--color-border)]/60"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-[var(--color-divider)] flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] truncate max-w-[150px]">
                  {item.url.replace(/^https?:\/\//i, '')}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(item.id, item.url)}
                    className="p-1.5 rounded-[6px] bg-[var(--color-canvas)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text)] transition-colors cursor-pointer"
                    title="Copy URL to clipboard"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-[6px] bg-[var(--color-surface-hover)] hover:bg-[var(--color-accent-fill)] hover:text-[var(--color-accent-ink)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text)] flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>{currentLang === 'ne' ? 'खोल्नुहोस्' : 'Visit'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="surface-card p-12 text-center rounded-[12px] border border-[var(--color-border)] space-y-3">
          <Info className="w-8 h-8 text-[var(--color-text-muted)] mx-auto" />
          <h4 className="text-sm font-semibold text-[var(--color-text)]">
            {currentLang === 'ne' ? 'कुनै पनि लिङ्क भेटिएन' : 'No links matching your filter'}
          </h4>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {currentLang === 'ne'
              ? 'खोज शब्द परिवर्तन गर्नुहोस् वा नयाँ व्यक्तिगत बुकमार्क थप्नुहोस्।'
              : 'Try clearing your search query or add a new custom bookmark.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-3 py-1.5 rounded-[6px] bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs text-[var(--color-text)] hover:opacity-90 font-medium cursor-pointer"
          >
            {currentLang === 'ne' ? 'फिल्टर रिसेट गर्नुहोस्' : 'Reset Filters'}
          </button>
        </div>
      )}

      {/* 5. Add Custom Link Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="surface-card w-full max-w-md p-5 rounded-[12px] border border-[var(--color-border)] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-divider)] pb-3">
              <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                <BookmarkPlus className="w-4 h-4 text-[var(--color-accent-mark)]" />
                <span>{currentLang === 'ne' ? 'नयाँ व्यक्तिगत लिङ्क सुरक्षित गर्नुहोस्' : 'Bookmark a New Link'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomBookmark} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  {currentLang === 'ne' ? 'शीर्षक / नाम' : 'Title / Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My Favorite Coding Hub"
                  className="w-full px-3 py-2 rounded-[6px] bg-[var(--color-canvas)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-mark)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  {currentLang === 'ne' ? 'वेबसाइट ठेगाना (URL)' : 'Website URL'} *
                </label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-[6px] bg-[var(--color-canvas)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-mark)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  {currentLang === 'ne' ? 'विवरण वा नोट' : 'Description / Notes'}
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief note about why this link is helpful..."
                  className="w-full px-3 py-2 rounded-[6px] bg-[var(--color-canvas)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-mark)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  {currentLang === 'ne' ? 'ट्यागहरू (अल्पविरामद्वारा छुट्ट्याइएको)' : 'Tags (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="tools, reading, productivity"
                  className="w-full px-3 py-2 rounded-[6px] bg-[var(--color-canvas)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-mark)]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-[6px] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] cursor-pointer"
                >
                  {currentLang === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[6px] bg-[var(--color-accent-fill)] text-[var(--color-accent-ink)] hover:opacity-90 text-xs font-semibold cursor-pointer"
                >
                  {currentLang === 'ne' ? 'सुरक्षित गर्नुहोस्' : 'Save Bookmark'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
