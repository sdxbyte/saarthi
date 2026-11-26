import React, { useState } from 'react';
import { ScanLine, Upload, Loader2, AlertCircle, Download, Plus, Trash2, FileText } from 'lucide-react';
import { generateReceiptPDF } from '../../utils/pdfExporter';

interface ReceiptScannerViewProps {
  currentLang: 'en' | 'ne';
}

interface ReceiptItem {
  name: string;
  price: number;
}

interface ParsedReceipt {
  merchantName: string;
  date: string;
  totalAmount: number;
  currency: string;
  taxAmount: number;
  category: string;
  items: ReceiptItem[];
  summaryNotes?: string;
}

export const ReceiptScannerView: React.FC<ReceiptScannerViewProps> = ({ currentLang }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rawReceiptText, setRawReceiptText] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<ParsedReceipt | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Manual structured entry state
  const [merchantName, setMerchantName] = useState('');
  const [receiptDate, setReceiptDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('Groceries');
  const [taxAmount, setTaxAmount] = useState('0');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [manualItems, setManualItems] = useState<ReceiptItem[]>([]);
  const [summaryNotes, setSummaryNotes] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleScanReceipt = async () => {
    if (!selectedImage && !rawReceiptText.trim()) return;

    setIsScanning(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/receipt/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          rawText: rawReceiptText.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.details ||
            'Automated OCR engine is not configured on this server. Enter itemized details manually on the right.'
        );
      }

      setScannedResult(data.receipt);
    } catch (err: any) {
      setScannedResult(null);
      setErrorMsg(
        currentLang === 'ne'
          ? `स्वचालित OCR उपलब्ध छैन: ${err.message}। कृपया दायाँपट्टि रसिदको विवरण म्यानुअल रूपमा प्रविष्ट गर्नुहोस्।`
          : err.message
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddManualItem = () => {
    const priceNum = Number(newItemPrice);
    if (!newItemName.trim() || Number.isNaN(priceNum) || priceNum < 0) return;
    setManualItems((prev) => [...prev, { name: newItemName.trim(), price: priceNum }]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleRemoveManualItem = (index: number) => {
    setManualItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyManualReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantName.trim() || manualItems.length === 0) {
      setErrorMsg(
        currentLang === 'ne'
          ? 'कृपया पसलको नाम र कम्तिमा एक वस्तुको मूल्य प्रविष्ट गर्नुहोस्।'
          : 'Enter a merchant name and at least one itemized line before generating the statement.'
      );
      return;
    }
    const subtotal = manualItems.reduce((sum, item) => sum + item.price, 0);
    const vat = Math.max(0, Number(taxAmount) || 0);
    setErrorMsg(null);
    setScannedResult({
      merchantName: merchantName.trim(),
      date: receiptDate,
      totalAmount: subtotal + vat,
      currency: 'NPR',
      taxAmount: vat,
      category,
      items: manualItems,
      summaryNotes: summaryNotes.trim() || undefined,
    });
  };

  const handleExportPDF = async () => {
    if (!scannedResult) return;
    await generateReceiptPDF({
      merchantName: scannedResult.merchantName,
      date: scannedResult.date,
      totalAmount: scannedResult.totalAmount,
      taxAmount: scannedResult.taxAmount,
      category: scannedResult.category,
      items: scannedResult.items,
      summaryNotes: scannedResult.summaryNotes,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-[#101C32] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ScanLine className="w-6 h-6 text-[#2563EB] dark:text-[#60A5FA]" />
            <h1 className="text-xl font-bold text-[#0B1F3A] dark:text-white">
              {currentLang === 'ne' ? 'डिजिटल रसिद तथा खर्च विवरण' : 'SAARTHI Receipt & Expense Builder'}
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {currentLang === 'ne'
              ? 'रसिदको पाठ पेस्ट गर्नुहोस् वा म्यानुअल रूपमा बिल विवरण प्रविष्ट गरी PDF डाउनलोड गर्नुहोस्'
              : 'Parse pasted receipt text or enter authentic itemized store bills to export clean PDF statements'}
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] dark:text-[#93C5FD] text-xs font-semibold flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>{currentLang === 'ne' ? 'प्रमाणित खर्च PDF' : 'Zero-Fabrication Statement'}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upload & Structured Text Input */}
        <div className="lg:col-span-6 bg-white dark:bg-[#101C32] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <h2 className="font-bold text-[#0B1F3A] dark:text-white text-base">
            {currentLang === 'ne' ? 'रसिद फोटो वा पाठ (Text)' : 'Receipt Reference & Text Parser'}
          </h2>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#2563EB] rounded-xl p-5 text-center transition-colors bg-slate-50 dark:bg-[#0B1628]">
            {selectedImage ? (
              <div className="space-y-3">
                <img
                  src={selectedImage}
                  alt="Receipt Preview"
                  className="max-h-52 mx-auto rounded-lg object-contain border border-slate-200 dark:border-slate-800"
                />
                <label className="inline-block px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer">
                  {currentLang === 'ne' ? 'अर्को फोटो छान्नुहोस्' : 'Change Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer space-y-2 block">
                <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                <div className="text-sm font-semibold text-[#0B1F3A] dark:text-white">
                  {currentLang === 'ne' ? 'रसिदको फोटो राख्नुहोस् (वैकल्पिक)' : 'Attach Receipt Photo (Reference)'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">JPG, PNG, WEBP</div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {currentLang === 'ne'
                ? 'रसिदको पाठ पेस्ट गर्नुहोस् (उदाहरण: Merchant: Store Name, Item - 250)'
                : 'Paste Structured Receipt Lines (Optional)'}
            </label>
            <textarea
              rows={4}
              value={rawReceiptText}
              onChange={(e) => setRawReceiptText(e.target.value)}
              placeholder={'Merchant: Kathmandu Mart\nDate: 2026-08-05\nMilk 1L - 120\nRice 5kg - 1450\nVAT: 180'}
              className="w-full rounded-xl bg-slate-50 dark:bg-[#0B1628] border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <button
            onClick={handleScanReceipt}
            disabled={(!selectedImage && !rawReceiptText.trim()) || isScanning}
            className="w-full py-2.5 bg-[#0B1F3A] hover:bg-[#102A4C] disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{currentLang === 'ne' ? 'प्रशोधन गर्दै...' : 'Processing Receipt...'}</span>
              </>
            ) : (
              <>
                <ScanLine className="w-4 h-4" />
                <span>{currentLang === 'ne' ? 'रसिद पाठ विश्लेषण गर्नुहोस्' : 'Parse Receipt Text / Scan'}</span>
              </>
            )}
          </button>

          {/* Manual Verified Receipt Entry */}
          <form onSubmit={handleApplyManualReceipt} className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {currentLang === 'ne' ? 'म्यानुअल रसिद प्रविष्टि' : 'Manual Itemized Entry'}
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="Merchant / Store Name"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                className="rounded-lg bg-slate-50 dark:bg-[#0B1628] border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
              <input
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                className="rounded-lg bg-slate-50 dark:bg-[#0B1628] border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg bg-slate-50 dark:bg-[#0B1628] border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="Groceries">Groceries</option>
                <option value="Utilities">Utilities</option>
                <option value="Fuel & Transport">Fuel &amp; Transport</option>
                <option value="Medical & Health">Medical &amp; Health</option>
                <option value="General">General</option>
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="VAT / Tax (NPR)"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
                className="rounded-lg bg-slate-50 dark:bg-[#0B1628] border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Item description"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 rounded-lg bg-slate-50 dark:bg-[#0B1628] border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-24 rounded-lg bg-slate-50 dark:bg-[#0B1628] border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddManualItem}
                className="px-3 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            {manualItems.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {manualItems.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-slate-100 dark:bg-[#0B1628]">
                    <span className="text-slate-800 dark:text-slate-200">{it.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-700 dark:text-slate-300">Rs. {it.price.toLocaleString()}</span>
                      <button type="button" onClick={() => handleRemoveManualItem(idx)} className="text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <input
              type="text"
              placeholder="Optional notes"
              value={summaryNotes}
              onChange={(e) => setSummaryNotes(e.target.value)}
              className="w-full rounded-lg bg-slate-50 dark:bg-[#0B1628] border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl border border-[#2563EB] text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#2563EB]/10 font-semibold text-xs transition-colors cursor-pointer"
            >
              {currentLang === 'ne' ? 'विवरण तयार गर्नुहोस्' : 'Build Statement from Manual Items'}
            </button>
          </form>
        </div>

        {/* Right: Statement Output */}
        <div className="lg:col-span-6 bg-white dark:bg-[#101C32] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#0B1F3A] dark:text-white text-base">
              {currentLang === 'ne' ? 'तयार गरिएको रसिद विवरण' : 'Receipt Statement'}
            </h2>
            {scannedResult && (
              <button
                onClick={handleExportPDF}
                className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{currentLang === 'ne' ? 'PDF डाउनलोड' : 'Download PDF'}</span>
              </button>
            )}
          </div>

          {scannedResult ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1628] border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0B1F3A] dark:text-white text-base">{scannedResult.merchantName}</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                    {scannedResult.category}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Date: {scannedResult.date || 'Today'}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1628] border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Paid</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-0.5">
                    Rs. {scannedResult.totalAmount.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1628] border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">VAT / Tax Included</div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums mt-0.5">
                    Rs. {scannedResult.taxAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {scannedResult.items.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Itemized Breakdown:</div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-[#0B1628]">
                    {scannedResult.items.map((item, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200">
                        <span>{item.name}</span>
                        <span className="font-mono font-semibold tabular-nums">Rs. {item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#0B1628]">
              {currentLang === 'ne'
                ? 'रसिद पाठ पेस्ट गर्नुहोस् वा म्यानुअल वस्तुहरू थपेर विवरण तयार गर्नुहोस्।'
                : 'Paste structured receipt lines or add itemized entries manually to preview and export PDF.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
