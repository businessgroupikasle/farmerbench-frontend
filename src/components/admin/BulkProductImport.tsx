import React, { useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Upload, X } from 'lucide-react';

type NamedRecord = { id: string; name: string; slug?: string; categoryId?: string };

interface Props {
  categories: NamedRecord[];
  subcategories: NamedRecord[];
  createProduct: (data: any) => Promise<any>;
  onClose: () => void;
  onComplete: () => void;
}

const splitList = (value: unknown) => Array.isArray(value)
  ? value.map(String).map((item) => item.trim()).filter(Boolean)
  : typeof value === 'string' ? value.split('|').map((item) => item.trim()).filter(Boolean) : [];

const parseJson = (value: unknown, fallback: any) => {
  if (value && typeof value === 'object') return value;
  if (typeof value !== 'string' || !value.trim()) return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
};

const parseCsv = (text: string) => {
  const rows: string[][] = []; let row: string[] = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = '';
    } else cell += char;
  }
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
  const headers = rows.shift()?.map((header) => header.trim()) || [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
};

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const BulkProductImport: React.FC<Props> = ({ categories, subcategories, createProduct, onClose, onComplete }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, failed: 0 });
  const categoryLookup = useMemo(() => new Map(categories.flatMap((c) => [[c.id.toLowerCase(), c], [c.name.toLowerCase(), c], [String(c.slug || '').toLowerCase(), c]])), [categories]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name); setError(''); setProgress({ done: 0, failed: 0 });
    try {
      const text = await file.text();
      const parsed = file.name.toLowerCase().endsWith('.json') ? JSON.parse(text) : parseCsv(text);
      const list = Array.isArray(parsed) ? parsed : parsed.products;
      if (!Array.isArray(list) || !list.length) throw new Error('The file does not contain any product rows.');
      setRows(list);
    } catch (err: any) { setRows([]); setError(err.message || 'Could not read this file.'); }
  };

  const resolvePayload = (item: any, index: number) => {
    const title = String(item.title || item.name || '').trim();
    if (title.length < 2) throw new Error(`Row ${index + 1}: title is required`);
    const categoryKey = String(item.categoryId || item.category || item.categorySlug || '').toLowerCase().trim();
    const category = categoryLookup.get(categoryKey);
    if (!category) throw new Error(`Row ${index + 1}: category '${categoryKey}' was not found`);
    const subKey = String(item.subcategoryId || item.subcategory || item.subcategorySlug || '').toLowerCase().trim();
    const subcategory = subKey ? subcategories.find((sub) => sub.id.toLowerCase() === subKey || sub.name.toLowerCase() === subKey || String(sub.slug || '').toLowerCase() === subKey) : undefined;
    const variants = parseJson(item.variants, []).map((variant: any) => ({
      label: String(variant.label || variant.packSize || '').trim(), mrp: Number(variant.mrp || variant.price || 0),
      sellingPrice: Number(variant.sellingPrice || variant.discountPrice || variant.mrp || variant.price || 0),
      stock: Math.max(0, Math.trunc(Number(variant.stock || 0))), sku: String(variant.sku || '').trim(),
    })).filter((variant: any) => variant.label && variant.mrp > 0);
    const price = Number(item.price || variants[0]?.mrp || 0);
    const images = splitList(item.images || item.image).filter((image) => /^https?:\/\//i.test(image) || image.startsWith('/uploads/'));
    if (price <= 0) throw new Error(`Row ${index + 1}: price must be greater than zero`);
    if (!images.length) throw new Error(`Row ${index + 1}: at least one valid image URL is required`);
    return {
      title, slug: String(item.slug || slugify(title)), description: String(item.description || `${title} is an agricultural product available from AgriEra.`),
      price, discountPrice: Number(item.discountPrice || variants[0]?.sellingPrice || price), stock: Math.max(0, Math.trunc(Number(item.stock ?? variants[0]?.stock ?? 0))),
      featured: item.featured === true || ['true', '1', 'yes'].includes(String(item.featured).toLowerCase()), images, categoryId: category.id,
      subcategoryId: subcategory?.categoryId === category.id ? subcategory.id : null,
      attributes: { variants, packSizes: variants.length ? variants.map((v: any) => v.label) : splitList(item.packSizes), features: splitList(item.features), benefits: splitList(item.benefits), usageSteps: parseJson(item.usageSteps, []), dosageTable: parseJson(item.dosageTable, []), ingredients: String(item.ingredients || ''), specifications: parseJson(item.specifications, []), faqs: parseJson(item.faqs, []), beforeAfter: parseJson(item.beforeAfter, null) },
    };
  };

  const downloadTemplate = () => {
    const example = [{ title: 'Shivam F1 High-Yield Hybrid Tomato Seeds', slug: 'shivam-f1-hybrid-tomato-seeds', category: categories[0]?.name || 'Seeds', subcategory: '', description: 'High-yield hybrid tomato seeds with excellent disease tolerance.', price: 2100, discountPrice: 1999, stock: 50, featured: true, images: ['https://example.com/tomato-main.jpg'], features: ['High genetic purity', 'Disease tolerant'], benefits: ['Heavy yield potential'], variants: [{ label: '50 g Commercial Pack', mrp: 2100, sellingPrice: 1999, stock: 50, sku: 'TOMATO-50G' }], usageSteps: [{ stepNumber: 1, title: 'Sow', description: 'Sow in a prepared nursery bed.' }], dosageTable: [], ingredients: 'Hybrid tomato seeds', specifications: [{ label: 'Crop', value: 'Tomato' }], faqs: [{ question: 'What is the germination rate?', answer: 'At least 85% under suitable conditions.' }], beforeAfter: null }];
    const url = URL.createObjectURL(new Blob([JSON.stringify(example, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'product-bulk-import-template.json'; anchor.click(); URL.revokeObjectURL(url);
  };

  const runImport = async () => {
    setImporting(true); setError(''); setProgress({ done: 0, failed: 0 }); let done = 0; let failed = 0; const errors: string[] = [];
    for (let index = 0; index < rows.length; index += 1) {
      try { await createProduct(resolvePayload(rows[index], index)); done += 1; } catch (err: any) { failed += 1; errors.push(err.message || `Row ${index + 1} failed`); }
      setProgress({ done, failed });
    }
    setImporting(false); if (errors.length) setError(errors.slice(0, 4).join(' | ') + (errors.length > 4 ? ` | +${errors.length - 4} more` : '')); if (done) onComplete();
  };

  return <div className="admin-modal-overlay"><div className="admin-modal-card admin-bulk-import-card">
    <div className="admin-modal-header"><div><h3 className="admin-modal-title">Bulk Import Products</h3><p className="admin-welcome-sub">Create complete product-detail records in the database from JSON or CSV.</p></div><button className="admin-modal-close-btn" onClick={onClose} disabled={importing}><X size={20} /></button></div>
    <div className="admin-modal-body admin-bulk-import-body"><button type="button" className="admin-gallery-dropzone admin-bulk-dropzone" onClick={() => inputRef.current?.click()}><FileSpreadsheet size={32} /><strong>{fileName || 'Choose a JSON or CSV product file'}</strong><span>{rows.length ? `${rows.length} product rows ready` : 'JSON is recommended for rich product details and variants'}</span></button><input ref={inputRef} type="file" accept=".json,.csv,application/json,text/csv" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
      {error && <div className="admin-gallery-alert"><AlertTriangle size={16} /><span>{error}</span></div>}{(progress.done > 0 || progress.failed > 0) && <div className="admin-bulk-progress"><CheckCircle2 size={17} /> {progress.done} created {progress.failed ? `• ${progress.failed} failed` : 'successfully'}</div>}
      <div className="admin-bulk-help"><strong>Supported details:</strong> title, category, subcategory, description, pricing, stock, images, variants/SKUs, highlights, benefits, usage steps, dosage, ingredients, specifications, FAQs, and before/after results. In CSV, separate simple lists with <code>|</code> and use JSON text for nested columns.</div></div>
    <div className="admin-modal-footer"><button type="button" className="admin-quick-btn" onClick={downloadTemplate}><Download size={15} /> Download template</button><button type="button" className="admin-primary-btn" disabled={!rows.length || importing} onClick={runImport}><Upload size={15} /> {importing ? `Importing ${progress.done + progress.failed}/${rows.length}...` : `Import ${rows.length || ''} Products`}</button></div>
  </div></div>;
};
