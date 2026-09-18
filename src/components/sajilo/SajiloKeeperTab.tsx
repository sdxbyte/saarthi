import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Car,
  CreditCard,
  Lock,
  Download,
  Upload,
  Clock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { KeeperItem, KeeperCategory, KeeperStatus } from '../../types/sajiloTypes';
import {
  getKeeperItems,
  saveKeeperItem,
  deleteKeeperItem,
  computeKeeperStatus,
  exportKeeperJson,
  importKeeperJson,
} from '../../utils/sajiloKeeperStore';
import { convertAdToBs } from '../../utils/bsAdConverter';

interface SajiloKeeperTabProps {
  currentLang: 'en' | 'ne';
  devanagariNumerals: boolean;
}

export const SajiloKeeperTab: React.FC<SajiloKeeperTabProps> = ({ currentLang, devanagariNumerals }) => {
  const [items, setItems] = useState<KeeperItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KeeperItem | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<KeeperCategory>('passport');
  const [formDocNumber, setFormDocNumber] = useState('');
  const [formExpiryDateAd, setFormExpiryDateAd] = useState('');
  const [formRemindDays, setFormRemindDays] = useState(30);
  const [formNotes, setFormNotes] = useState('');

  useEffect(() => {
    reloadItems();
  }, []);

  const reloadItems = () => {
    setItems(getKeeperItems());
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('passport');
    setFormDocNumber('');
    setFormExpiryDateAd('');
    setFormRemindDays(30);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: KeeperItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormDocNumber(item.documentNumber || '');
    setFormExpiryDateAd(item.expiryDateAd);
    setFormRemindDays(item.remindDaysBefore || 30);
    setFormNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formExpiryDateAd) return;

    saveKeeperItem({
      ...(editingItem ? { id: editingItem.id } : {}),
      title: formTitle.trim(),
      category: formCategory,
      documentNumber: formDocNumber.trim() || undefined,
      expiryDateAd: formExpiryDateAd,
      expiryDateBs: convertAdToBs(formExpiryDateAd),
      remindDaysBefore: Number(formRemindDays),
      notes: formNotes.trim() || undefined,
    });

    setIsModalOpen(false);
    reloadItems();
  };

  const handleDelete = (id: string) => {
    if (window.confirm(currentLang === 'ne' ? 'के तपाई यो रिमाइन्डर हटाउन निश्चित हुनुहुन्छ?' : 'Are you sure you want to delete this reminder?')) {
      deleteKeeperItem(id);
      reloadItems();
    }
  };

  const handleExport = () => {
    const jsonStr = exportKeeperJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sajilo_keeper_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importKeeperJson(content)) {
        reloadItems();
        alert(currentLang === 'ne' ? 'किपर डाटा सफलतापूर्वक आयात गरियो!' : 'Keeper data imported successfully!');
      } else {
        alert(currentLang === 'ne' ? 'आयात गर्न सकिएन, फाइल ढाँचा मिलेन।' : 'Failed to import. Invalid JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const formatDigits = (val: string | number): string => {
    if (!devanagariNumerals) return String(val);
    const nepDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(val)
      .split('')
      .map((ch) => (ch >= '0' && ch <= '9' ? nepDigits[parseInt(ch, 10)] : ch))
      .join('');
  };

  const getCategoryIcon = (cat: KeeperCategory) => {
    switch (cat) {
      case 'passport':
        return <Lock className="w-4 h-4 text-blue-400" />;
      case 'bluebook':
        return <Car className="w-4 h-4 text-emerald-400" />;
      case 'license':
        return <CreditCard className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-purple-400" />;
    }
  };

  const filteredItems = items.filter((item) => {
    const { status } = computeKeeperStatus(item);
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.documentNumber && item.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#14161b] border border-[#262a31] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#edeef0]">
              {currentLang === 'ne' ? 'सजिलो किपर (Sajilo Keeper)' : 'Sajilo Keeper (Offline Document Vault)'}
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">
              100% Offline & Private
            </span>
          </div>
          <p className="text-xs text-[#8b909b] mt-1">
            {currentLang === 'ne'
              ? 'राहदानी, सवारी लाइसेन्स, ब्लुबुक, कर र बिलहरूको सुरक्षित नवीकरण रिमाइन्डर'
              : 'Local-first offline reminders for Passports, Bluebook renewals, Driving Licenses, and Utility Bills'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="p-2 rounded-xl bg-[#1f232b] hover:bg-[#262a31] border border-[#262a31] text-xs font-mono text-[#8b909b] hover:text-[#edeef0] transition-colors"
            title="Export JSON Backup"
          >
            <Download className="w-4 h-4" />
          </button>

          <label className="p-2 rounded-xl bg-[#1f232b] hover:bg-[#262a31] border border-[#262a31] text-xs font-mono text-[#8b909b] hover:text-[#edeef0] cursor-pointer transition-colors" title="Import JSON Backup">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 rounded-xl bg-[#00e599] text-[#0a0b0d] font-bold text-xs flex items-center gap-1.5 hover:bg-[#00c985] transition-transform active:scale-95 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{currentLang === 'ne' ? 'नयाँ रिमाइन्डर थप्नुहोस्' : 'Add Reminder'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b909b]" />
          <input
            type="text"
            placeholder={currentLang === 'ne' ? 'कागजात वा नम्बर खोज्नुहोस्...' : 'Search title or document number...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14161b] border border-[#262a31] focus:border-[#00e599] text-xs text-[#edeef0] placeholder-[#8b909b] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#14161b] border border-[#262a31] text-xs text-[#edeef0] outline-none"
          >
            <option value="all">{currentLang === 'ne' ? 'सबै वर्ग (All Categories)' : 'All Categories'}</option>
            <option value="passport">Passport (राहदानी)</option>
            <option value="bluebook">Bluebook (सवारी दर्ता किताब)</option>
            <option value="license">License (लाइसेन्स)</option>
            <option value="citizenship">Citizenship (नागरिकता)</option>
            <option value="bill">Utility Bills (घरायसी बिल)</option>
            <option value="custom">Custom (अन्य)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#14161b] border border-[#262a31] text-xs text-[#edeef0] outline-none"
          >
            <option value="all">{currentLang === 'ne' ? 'सबै स्थिति (All Status)' : 'All Status'}</option>
            <option value="safe">Safe (सुरक्षित)</option>
            <option value="expiring_soon">Expiring Soon (नजिकिँदैछ)</option>
            <option value="urgent">Urgent (&lt; 7 Days)</option>
            <option value="expired">Expired (सकियो)</option>
          </select>
        </div>
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center rounded-2xl bg-[#14161b] border border-[#262a31] text-[#8b909b] font-mono text-xs">
            {currentLang === 'ne' ? 'कुनै पनि रिमाइन्डर फेला परेन।' : 'No reminders found. Click "Add Reminder" to create one.'}
          </div>
        ) : (
          filteredItems.map((item) => {
            const { status, daysLeft } = computeKeeperStatus(item);

            let statusBadge = (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {formatDigits(daysLeft)} days left
              </span>
            );

            if (status === 'expired') {
              statusBadge = (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
                  Expired ({formatDigits(Math.abs(daysLeft))} days ago)
                </span>
              );
            } else if (status === 'urgent') {
              statusBadge = (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-500/15 text-orange-400 border border-orange-500/30 font-bold">
                  Urgent: {formatDigits(daysLeft)} days left
                </span>
              );
            } else if (status === 'expiring_soon') {
              statusBadge = (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Expiring Soon: {formatDigits(daysLeft)} days left
                </span>
              );
            }

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#14161b] border border-[#262a31] hover:border-[#00e599]/30 transition-all flex flex-col justify-between gap-3 shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1f232b] flex items-center justify-center shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#edeef0] leading-snug">{item.title}</h4>
                        {item.documentNumber && (
                          <span className="text-[10px] font-mono text-[#8b909b]">No: {item.documentNumber}</span>
                        )}
                      </div>
                    </div>
                    {statusBadge}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#262a31]/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#8b909b] block">Expiry (AD)</span>
                      <span className="font-mono text-[#edeef0]">{item.expiryDateAd}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8b909b] block">Expiry (BS)</span>
                      <span className="font-mono text-[#00e599]">{item.expiryDateBs || 'वि.सं.'}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="mt-2 text-[11px] text-[#8b909b] line-clamp-2 bg-[#171a21] p-2 rounded-lg">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#262a31]/60 text-[10px] font-mono text-[#8b909b]">
                  <span>Alert before: {formatDigits(item.remindDaysBefore || 30)} days</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1 rounded text-[#8b909b] hover:text-[#00e599] hover:bg-[#262a31] transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded text-[#8b909b] hover:text-red-400 hover:bg-[#262a31] transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#14161b] border border-[#262a31] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a31]">
              <h3 className="font-bold text-sm text-[#edeef0]">
                {editingItem
                  ? currentLang === 'ne' ? 'रिमाइन्डर सम्पादन गर्नुहोस्' : 'Edit Reminder'
                  : currentLang === 'ne' ? 'नयाँ रिमाइन्डर थप्नुहोस्' : 'Add New Reminder'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#8b909b] hover:text-[#edeef0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[#edeef0] block mb-1">Title / Document Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Machine Readable Passport"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-xs text-[#edeef0] outline-none focus:border-[#00e599]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#edeef0] block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as KeeperCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-xs text-[#edeef0] outline-none"
                  >
                    <option value="passport">Passport</option>
                    <option value="bluebook">Bluebook / Vehicle</option>
                    <option value="license">Driving License</option>
                    <option value="citizenship">Citizenship</option>
                    <option value="insurance">Insurance Policy</option>
                    <option value="bill">Utility Bill</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#edeef0] block mb-1">Doc Number (Opt)</label>
                  <input
                    type="text"
                    placeholder="e.g. BA 85 PA 4920"
                    value={formDocNumber}
                    onChange={(e) => setFormDocNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-xs text-[#edeef0] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#edeef0] block mb-1">Expiry Date (AD) *</label>
                  <input
                    type="date"
                    required
                    value={formExpiryDateAd}
                    onChange={(e) => setFormExpiryDateAd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-xs text-[#edeef0] outline-none focus:border-[#00e599]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#edeef0] block mb-1">Remind Days Before</label>
                  <select
                    value={formRemindDays}
                    onChange={(e) => setFormRemindDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-xs text-[#edeef0] outline-none"
                  >
                    <option value={7}>7 Days Before</option>
                    <option value={15}>15 Days Before</option>
                    <option value={30}>30 Days Before (1 Month)</option>
                    <option value={60}>60 Days Before (2 Months)</option>
                    <option value={90}>90 Days Before (3 Months)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#edeef0] block mb-1">Notes / Renewal Guidelines</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Must bring old passport copy and citizenship certificate..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1d24] border border-[#262a31] text-xs text-[#edeef0] outline-none focus:border-[#00e599]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1f232b] text-xs text-[#8b909b] hover:text-[#edeef0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00e599] text-[#0a0b0d] font-bold text-xs hover:bg-[#00c985] transition-transform"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
