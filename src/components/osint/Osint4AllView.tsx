import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  Copy,
  Check,
  Bookmark,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Shield,
  Crosshair,
  X,
} from 'lucide-react';
import {
  OSINT4ALL_CATEGORIES,
  OSINT4ALL_TOOLS,
  OsintAccessTier,
  OsintCategoryId,
  OsintToolEntry,
} from '../../data/osint4allData';

interface Osint4AllViewProps {
  currentLang?: 'en' | 'ne';
}

const STORAGE_BOOKMARKS_KEY = 'saarthi_osint4all_bookmarks';
const STORAGE_CUSTOM_TOOLS_KEY = 'saarthi_osint4all_custom_tools';

export const Osint4AllView: React.FC<Osint4AllViewProps> = ({ currentLang = 'en' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'saved' | OsintCategoryId>('all');
  const [selectedTier, setSelectedTier] = useState<'all' | OsintAccessTier>('all');
  const [pivotInput, setPivotInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Custom entry form state
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customCategory, setCustomCategory] = useState<OsintCategoryId>('frameworks-workflows');
  const [customTier, setCustomTier] = useState<OsintAccessTier>('Free / Open');
  const [customDesc, setCustomDesc] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customTools, setCustomTools] = useState<OsintToolEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_TOOLS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch {
      // ignore storage errors
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_TOOLS_KEY, JSON.stringify(customTools));
    } catch {
      // ignore storage errors
    }
  }, [customTools]);

  const allTools = useMemo(() => [...customTools, ...OSINT4ALL_TOOLS], [customTools]);

  const cleanPivot = pivotInput.trim();
  const detectedPivotType = useMemo<'domain' | 'ip' | 'email' | null>(() => {
    if (!cleanPivot) return null;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanPivot)) return 'email';
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(cleanPivot)) return 'ip';
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanPivot)) return 'domain';
    return null;
  }, [cleanPivot]);

  const resolveToolUrl = (tool: OsintToolEntry): string => {
    if (cleanPivot && tool.pivotUrlTemplate && tool.pivotType === detectedPivotType) {
      return tool.pivotUrlTemplate.replace('{query}', encodeURIComponent(cleanPivot));
    }
    return tool.url;
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev]));
  };

  const handleCopyUrl = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleAddCustomTool = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = customName.trim();
    const trimmedUrl = customUrl.trim();
    if (!trimmedName || !trimmedUrl) {
      setFormError(currentLang === 'ne' ? 'नाम र मान्य URL आवश्यक छ।' : 'Tool name and valid URL are required.');
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`);
    } catch {
      setFormError(currentLang === 'ne' ? 'अमान्य URL ढाँचा।' : 'Please enter a valid URL.');
      return;
    }

    const catMeta = OSINT4ALL_CATEGORIES.find((c) => c.id === customCategory);
    const newEntry: OsintToolEntry = {
      id: `custom-osint-${Date.now()}`,
      name: trimmedName,
      url: parsedUrl.toString(),
      domain: parsedUrl.hostname.replace(/^www\./, ''),
      category: customCategory,
      categoryLabel: catMeta?.label || 'Custom',
      accessTier: customTier,
      description: customDesc.trim() || 'User-saved open-source intelligence resource.',
      descriptionNp: customDesc.trim() || 'प्रयोगकर्ताद्वारा सुरक्षित गरिएको OSINT स्रोत।',
      tags: ['custom', customCategory],
    };

    setCustomTools((prev) => [newEntry, ...prev]);
    setCustomName('');
    setCustomUrl('');
    setCustomDesc('');
    setShowAddForm(false);
  };

  const handleDeleteCustomTool = (id: string) => {
    setCustomTools((prev) => prev.filter((t) => t.id !== id));
    setBookmarks((prev) => prev.filter((b) => b !== id));
  };

  const handleExportBookmarks = () => {
    const savedItems = allTools.filter((t) => bookmarks.includes(t.id) || t.id.startsWith('custom-osint-'));
    const payload = {
      source: 'SAARTHI OSINT4ALL Directory',
      exportedAt: new Date().toISOString(),
      count: savedItems.length,
      items: savedItems,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'saarthi-osint4all-saved.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allTools.filter((tool) => {
      if (selectedCategory === 'saved' && !bookmarks.includes(tool.id)) return false;
      if (selectedCategory !== 'all' && selectedCategory !== 'saved' && tool.category !== selectedCategory) {
        return false;
      }
      if (selectedTier !== 'all' && tool.accessTier !== selectedTier) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.domain.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.categoryLabel.toLowerCase().includes(q) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [allTools, selectedCategory, selectedTier, searchQuery, bookmarks]);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: allTools.length, saved: bookmarks.length };
    for (const cat of OSINT4ALL_CATEGORIES) {
      map[cat.id] = allTools.filter((t) => t.category === cat.id).length;
    }
    return map;
  }, [allTools, bookmarks]);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Reference & Summary Strip */}
      <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
            <Shield className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-zinc-200 font-medium">OSINT4ALL Directory</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{allTools.length} Tools Indexed</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{OSINT4ALL_CATEGORIES.length} Vectors</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{bookmarks.length} Saved</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            {currentLang === 'ne'
              ? 'खुला स्रोत गुप्तचर (OSINT) अनुसन्धान, डोमेन विश्लेषण, अभिलेख तथा सार्वजनिक तथ्याङ्क निर्देशिका।'
              : 'Structured open-source intelligence directory modeled after osint4all.com. No simulated scans—every tool links directly to its authoritative external portal.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{currentLang === 'ne' ? 'थप्नुहोस्' : 'Add Tool'}</span>
          </button>

          {(bookmarks.length > 0 || customTools.length > 0) && (
            <button
              onClick={handleExportBookmarks}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Saved</span>
            </button>
          )}

          <a
            href="https://osint4all.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open osint4all.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Add Custom Resource Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddCustomTool}
          className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              {currentLang === 'ne' ? 'निजी OSINT औजार थप्नुहोस्' : 'Add Custom OSINT Bookmark'}
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              aria-label="Close form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {formError && (
            <p className="text-xs text-rose-400 font-medium">{formError}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Tool Name (e.g., IntelTechniques)"
              className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="URL (e.g., https://inteltechniques.com)"
              className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            <select
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value as OsintCategoryId)}
              className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-zinc-600"
            >
              {OSINT4ALL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <select
              value={customTier}
              onChange={(e) => setCustomTier(e.target.value as OsintAccessTier)}
              className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-zinc-600"
            >
              <option value="Free / Open">Free / Open</option>
              <option value="Freemium">Freemium</option>
              <option value="Open Source CLI">Open Source CLI</option>
            </select>
          </div>

          <input
            type="text"
            value={customDesc}
            onChange={(e) => setCustomDesc(e.target.value)}
            placeholder="Brief description of investigative use case"
            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Save Locally
            </button>
          </div>
        </form>
      )}

      {/* Search, Access Tier & Target Pivot Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Directory Search */}
        <div className="lg:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              currentLang === 'ne'
                ? 'OSINT औजार वा वर्ग खोज्नुहोस्...'
                : 'Search tools, domains, tags (e.g. crt.sh, shodan, exif)...'
            }
            className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Client-side Query Pivot Helper */}
        <div className="lg:col-span-5 relative">
          <Crosshair className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={pivotInput}
            onChange={(e) => setPivotInput(e.target.value)}
            placeholder="Optional lookup pivot (domain, IP, or email)"
            className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors font-mono"
          />
          {cleanPivot && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400">
                {detectedPivotType ? detectedPivotType.toUpperCase() : 'TEXT'}
              </span>
              <button
                onClick={() => setPivotInput('')}
                className="text-zinc-400 hover:text-white cursor-pointer"
                aria-label="Clear pivot"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Tier Filter */}
        <div className="lg:col-span-2">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as 'all' | OsintAccessTier)}
            aria-label="Filter by access tier"
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 cursor-pointer"
          >
            <option value="all">All Access Tiers</option>
            <option value="Free / Open">Free / Open</option>
            <option value="Freemium">Freemium</option>
            <option value="Open Source CLI">Open Source CLI</option>
          </select>
        </div>
      </div>

      {/* Segmented Category Filter Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-white text-zinc-950 font-semibold'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
          }`}
        >
          <span>All Vectors</span>
          <span className={`text-[11px] font-mono tabular-nums ${selectedCategory === 'all' ? 'text-zinc-600' : 'text-zinc-500'}`}>
            {categoryCounts.all}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('saved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'saved'
              ? 'bg-white text-zinc-950 font-semibold'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
          }`}
        >
          <span>Saved</span>
          <span className={`text-[11px] font-mono tabular-nums ${selectedCategory === 'saved' ? 'text-zinc-600' : 'text-zinc-500'}`}>
            {categoryCounts.saved}
          </span>
        </button>

        {OSINT4ALL_CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                active
                  ? 'bg-white text-zinc-950 font-semibold'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>{currentLang === 'ne' ? cat.labelNp : cat.label}</span>
              <span className={`text-[11px] font-mono tabular-nums ${active ? 'text-zinc-600' : 'text-zinc-500'}`}>
                {categoryCounts[cat.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400 border-b border-zinc-800/80 pb-3">
        <span className="tabular-nums">
          Showing {filteredTools.length} of {allTools.length} OSINT tools
        </span>
        {detectedPivotType && (
          <span className="text-emerald-400">
            Pivot active for {detectedPivotType}: {cleanPivot}
          </span>
        )}
      </div>

      {/* Directory List */}
      {filteredTools.length === 0 ? (
        <div className="py-12 px-6 text-center space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-900/20">
          <p className="text-sm text-zinc-300">
            {selectedCategory === 'saved'
              ? 'No saved OSINT tools yet. Bookmark tools below to build your local investigation kit.'
              : 'No OSINT tools matched your current filter.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedTier('all');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-white hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/70">
          {filteredTools.map((tool, index) => {
            const targetUrl = resolveToolUrl(tool);
            const isPivotActive = targetUrl !== tool.url;
            const isBookmarked = bookmarks.includes(tool.id);
            const isCustom = tool.id.startsWith('custom-osint-');

            return (
              <div
                key={tool.id}
                className="py-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-zinc-900/25 -mx-3 px-3 rounded-xl transition-colors"
              >
                <div className="space-y-1.5 flex-1 max-w-2xl">
                  {/* Unboxed Metadata (Zero-pill discipline) */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-zinc-400">
                    <span className="tabular-nums">{String(index + 1).padStart(2, '0')}.</span>
                    <span className="text-zinc-300">{tool.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{tool.domain}</span>
                    <span aria-hidden="true">·</span>
                    <span>{tool.accessTier}</span>
                    {isPivotActive && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400">Pivot Ready</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white tracking-tight">
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>{tool.name}</span>
                    </a>
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {currentLang === 'ne' ? tool.descriptionNp : tool.description}
                  </p>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button
                    onClick={() => toggleBookmark(tool.id)}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark tool'}
                    className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                      isBookmarked
                        ? 'bg-zinc-800 border-zinc-600 text-amber-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleCopyUrl(tool.id, targetUrl)}
                    title="Copy target URL"
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                  >
                    {copiedId === tool.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isCustom && (
                    <button
                      onClick={() => handleDeleteCustomTool(tool.id)}
                      title="Delete custom entry"
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-xs font-medium text-zinc-200 hover:text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{isPivotActive ? 'Lookup' : 'Open'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
