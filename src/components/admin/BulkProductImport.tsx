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

  const headers = rows.shift()?.map((header, index) => (index === 0 ? header.replace(/^\uFEFF/, '') : header).trim()) || [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
};

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const buildSku = (productName: string, packSize: string) => {
  const productPart = slugify(productName).toUpperCase();
  const packPart = String(packSize || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return [productPart, packPart || 'DEFAULT'].filter(Boolean).join('-');
};

const parseBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value;
  const normalized = String(value ?? '').trim().toLowerCase();
  if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  return fallback;
};

const compactObjects = (value: unknown, fields: string[]) => parseJson(value, [])
  .filter((entry: any) => entry && typeof entry === 'object')
  .map((entry: any) => Object.fromEntries(fields.map((field) => [field, String(entry[field] ?? '').trim()])))
  .filter((entry: any) => fields.some((field) => entry[field]));

const parseDosageTable = (value: unknown) => {
  if (typeof value !== 'string') return [];
  const rows = value.split('\n').filter(Boolean);
  return rows.map((row) => {
    const parts = row.split('|').map((p) => p.trim()).filter(Boolean);
    if (parts.length < 2) return null;
    const [crop, target, dosage = '', waterVolume = '', waitingPeriod = ''] = parts.length >= 5
      ? parts
      : [parts[0], parts[1] || '', parts[2] || '', parts[3] || '', parts[4] || ''];
    return { crop, target, dosage, waterVolume, waitingPeriod };
  }).filter(Boolean);
};

const parseUsageSteps = (value: unknown) => {
  if (typeof value !== 'string') return [];
  const text = String(value).trim();
  if (!text) return [];
  const stepPattern = /Step\s+(\d+):\s*(.+?)(?=Step\s+\d+:|$)/gi;
  const steps = [];
  let match;
  while ((match = stepPattern.exec(text)) !== null) {
    steps.push({ stepNumber: parseInt(match[1]), title: '', description: match[2].trim() });
  }
  return steps.length > 0 ? steps : [];
};

const parsePipeSeparated = (value: unknown, fields: [string, string]) => {
  if (typeof value !== 'string') return [];
  const rows = value.split('\n').filter(Boolean);
  return rows.map((row) => {
    const parts = row.split('|').map((p) => p.trim()).filter(Boolean);
    if (parts.length < 2) return null;
    const obj: any = {};
    obj[fields[0]] = parts[0];
    obj[fields[1]] = parts.slice(1).join('|').trim();
    return obj;
  }).filter(Boolean);
};

const groupCsvRows = (rows: any[]) => {
  const groups = new Map<string, any>();
  rows.forEach((row, index) => {
    const title = String(row.productName || row.title || row.name || '').trim();
    const key = String(row.productKey || row.slug || slugify(title) || `row-${index + 1}`).toLowerCase();
    const current = groups.get(key) || { ...row, title, variants: [] };
    const packSize = String(row.packSize || row.variant || row.size || '').trim();
    current.variants.push({ label: packSize, mrp: row.mrp || row.price, sellingPrice: row.sellingPrice || row.discountPrice, stock: row.stock, sku: row.sku });
    groups.set(key, current);
  });
  return Array.from(groups.values());
};

const escapeCsv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const BulkProductImport: React.FC<Props> = ({ categories, subcategories, createProduct, onClose, onComplete }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, failed: 0 });
  const [defaultCategoryId, setDefaultCategoryId] = useState(categories[0]?.id || '');
  const categoryLookup = useMemo(() => new Map(categories.flatMap((c) => [[c.id.toLowerCase(), c], [c.name.toLowerCase(), c], [String(c.slug || '').toLowerCase(), c]])), [categories]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name); setError(''); setProgress({ done: 0, failed: 0 });
    try {
      const text = await file.text();
      const parsed = file.name.toLowerCase().endsWith('.json') ? JSON.parse(text) : parseCsv(text);
      const list = Array.isArray(parsed) ? parsed : parsed.products;
      if (!Array.isArray(list) || !list.length) throw new Error('The file does not contain any product rows.');
      setRows(file.name.toLowerCase().endsWith('.csv') ? groupCsvRows(list) : list);
    } catch (err: any) { setRows([]); setError(err.message || 'Could not read this file.'); }
  };

  const resolvePayload = (item: any, index: number) => {
    const title = String(item.productName || item.title || item.name || '').trim();
    if (title.length < 2) throw new Error(`Row ${index + 1}: title is required`);
    const categoryKey = String(item.categoryId || item.category || item.categorySlug || '').toLowerCase().trim();
    let category = categoryKey ? categoryLookup.get(categoryKey) : undefined;
    const subKey = String(item.subcategoryId || item.subcategory || item.subcategorySlug || '').toLowerCase().trim();
    const subcategory = subKey ? subcategories.find((sub) => sub.id.toLowerCase() === subKey || sub.name.toLowerCase() === subKey || String(sub.slug || '').toLowerCase() === subKey) : undefined;
    if (!category && subcategory?.categoryId) category = categories.find((entry) => entry.id === subcategory.categoryId);
    if (!category && defaultCategoryId) category = categories.find((entry) => entry.id === defaultCategoryId);
    if (!category) category = categories[0];

    const packSizeValue = String(item.packSize || '').trim();
    const mrp = Number(item.mrp || item.price || 0);
    const sellingPrice = Number(item.sellingPrice || item.discountPrice || item.mrp || item.price || 0);
    const stock = Number(item.stock || 0);
    const sku = String(item.sku || buildSku(title, packSizeValue)).trim().toUpperCase();

    const variant = { label: packSizeValue, mrp, sellingPrice, stock: Math.trunc(stock), sku };
    const variants = packSizeValue ? [variant] : [];

    if (!variants.length) throw new Error(`Row ${index + 1}: pack size is required`);
    if (mrp <= 0) throw new Error(`Row ${index + 1}: MRP must be greater than zero`);
    if (sellingPrice <= 0 || sellingPrice > mrp) throw new Error(`Row ${index + 1}: selling price must be between 1 and MRP`);
    if (!Number.isFinite(stock) || stock < 0) throw new Error(`Row ${index + 1}: stock must be zero or greater`);

    const price = mrp;
    const images = [...splitList(item.images || item.image), ...['image1', 'image2', 'image3', 'image4', 'image5'].map((field) => String(item[field] || '').trim()).filter(Boolean)].filter((image) => /^https?:\/\//i.test(image) || image.startsWith('/uploads/'));

    const features = splitList(item.features).map((f) => f.replace(/^✓\s*/, '').trim()).filter(Boolean);
    const benefits = splitList(item.benefits).map((b) => b.replace(/^✓\s*/, '').trim()).filter(Boolean);
    const usageSteps = parseUsageSteps(item.usageSteps);
    const dosageTable = parseDosageTable(item.dosageTable);
    const specifications = item.specifications && typeof item.specifications === 'string' && item.specifications.includes('|')
      ? parsePipeSeparated(item.specifications, ['label', 'value'])
      : compactObjects(item.specifications, ['label', 'value']);
    const faqs = item.faqs && typeof item.faqs === 'string' && item.faqs.includes('|')
      ? parsePipeSeparated(item.faqs, ['question', 'answer'])
      : compactObjects(item.faqs, ['question', 'answer']);

    return {
      title, slug: String(item.productKey || item.slug || slugify(title)), description: String(item.description || ''),
      price, discountPrice: sellingPrice, stock: Math.max(0, Math.trunc(stock)),
      featured: parseBoolean(item.featured), images, categoryId: category.id,
      subcategoryId: subcategory?.categoryId === category.id ? subcategory.id : null,
      attributes: {
        targetCrops: String(item.targetCrops || '').trim(),
        variants,
        packSizes: variants.map((v: any) => v.label),
        features,
        benefits,
        usageSteps,
        dosageTable,
        ingredients: String(item.ingredients || '').trim(),
        specifications,
        faqs,
        showProductDetails: parseBoolean(item.showProductDetails, true)
      },
    };
  };

  const validation = rows.map((row, index) => {
    try { return { valid: true, payload: resolvePayload(row, index), message: 'Ready to import' }; }
    catch (err: any) { return { valid: false, payload: null, message: err.message || `Row ${index + 1} is invalid` }; }
  });

  const downloadTemplate = () => {
    const headers = ['productName', 'productKey', 'description', 'category', 'subcategory', 'targetCrops', 'packSize', 'mrp', 'sellingPrice', 'stock', 'sku', 'features', 'benefits', 'usageSteps', 'dosageTable', 'ingredients', 'specifications', 'faqs', 'featured', 'showProductDetails', 'image1', 'image2', 'image3', 'image4', 'image5'];
    const examples = [
      ['Growth Booster', 'growth-booster', 'Improves plant growth, rooting and crop yield.', 'Bio Stimulants', '', 'Paddy, Cotton, Vegetables', '500 ml', 650, 599, 25, 'GB-500ML', '\u2713 Faster root growth|\u2713 Improves flowering', '\u2713 Better nutrient uptake|\u2713 Higher crop yield', 'Step 1: Mix the recommended dose with water\nStep 2: Apply evenly to the crop', 'Paddy | Plant growth regulator | 30 ml | 200 L | 48 hours', 'Seaweed extract, amino acids and micronutrients', 'Form | Liquid\nShelf Life | 24 months', 'Can this be used for paddy? | Yes, follow the recommended dosage.', false, true, '', '', '', '', ''],
      ['Growth Booster', 'growth-booster', 'Improves plant growth, rooting and crop yield.', 'Bio Stimulants', '', 'Paddy, Cotton, Vegetables', '1 litre', 1100, 999, 15, 'GB-1L', '\u2713 Faster root growth|\u2713 Improves flowering', '\u2713 Better nutrient uptake|\u2713 Higher crop yield', 'Step 1: Mix the recommended dose with water\nStep 2: Apply evenly to the crop', 'Cotton | Pest control | 40 ml | 250 L | 48 hours', 'Seaweed extract, amino acids and micronutrients', 'Form | Liquid\nShelf Life | 24 months', 'Can this be used for cotton? | Yes, follow the recommended dosage.', false, true, '', '', '', '', ''],
    ];
    const csv = '\uFEFF' + [headers, ...examples].map((row) => row.map(escapeCsv).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'agriera-product-bulk-import-template.csv'; anchor.click(); URL.revokeObjectURL(url);
  };
  const runImport = async () => {
    setImporting(true); setError(''); setProgress({ done: 0, failed: 0 }); let done = 0; let failed = 0; const errors: string[] = [];
    for (let index = 0; index < rows.length; index += 1) {
      try { await createProduct(resolvePayload(rows[index], index)); done += 1; } catch (err: any) { failed += 1; errors.push(err.message || `Row ${index + 1} failed`); }
      setProgress({ done, failed });
    }
    setImporting(false); if (errors.length) setError(errors.slice(0, 4).join(' | ') + (errors.length > 4 ? ` | +${errors.length - 4} more` : '')); if (done) onComplete();
  };

  const validCount = validation.filter((item) => item.valid).length;

  return <div className="admin-modal-overlay"><div className="admin-modal-card admin-bulk-import-card">
    <div className="admin-modal-header"><div><h3 className="admin-modal-title">Bulk Import Products</h3><p className="admin-welcome-sub">Import complete product details across every product tab. Images alone can be added later.</p></div><button className="admin-modal-close-btn" onClick={onClose} disabled={importing}><X size={20} /></button></div>
    <div className="admin-modal-body admin-bulk-import-body">
      <div className="admin-bulk-toolbar">
        <button type="button" className="admin-quick-btn" onClick={downloadTemplate}><Download size={15} /> Download CSV Template</button>
        <label><span>Default category</span><select className="admin-form-select" value={defaultCategoryId} onChange={(event) => setDefaultCategoryId(event.target.value)}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      </div>
      <button type="button" className="admin-gallery-dropzone admin-bulk-dropzone" onClick={() => inputRef.current?.click()}><FileSpreadsheet size={32} /><strong>{fileName || 'Choose a CSV or JSON product file'}</strong><span>{rows.length ? `${rows.length} products grouped and ready for review` : 'The template includes Basic, Highlights, Benefits, Steps, Dosage, Ingredients, Specs and FAQs'}</span></button>
      <input ref={inputRef} type="file" accept=".json,.csv,application/json,text/csv" hidden onChange={(event) => handleFile(event.target.files?.[0])} />
      {error && <div className="admin-gallery-alert"><AlertTriangle size={16} /><span>{error}</span></div>}
      {(progress.done > 0 || progress.failed > 0) && <div className="admin-bulk-progress"><CheckCircle2 size={17} /> {progress.done} created {progress.failed ? `• ${progress.failed} skipped/failed` : 'successfully'}</div>}
      {!!rows.length && <><div className="admin-bulk-summary"><span className="ready">{validCount} Valid</span><span className="error">{rows.length - validCount} Error</span></div><div className="admin-bulk-preview"><table><thead><tr><th>Status</th><th>Product</th><th>Variants</th><th>Category</th><th>Result</th></tr></thead><tbody>{rows.map((row, index) => { const item = validation[index]; return <tr key={`${row.slug || row.title || 'product'}-${index}`}><td><span className={`admin-bulk-status ${item.valid ? 'ready' : 'error'}`}>{item.valid ? 'Ready' : 'Error'}</span></td><td><strong>{row.productName || row.title || row.name || `Row ${index + 1}`}</strong></td><td>{item.payload?.attributes?.variants?.length || 0}</td><td>{categories.find((category) => category.id === item.payload?.categoryId)?.name || '—'}</td><td>{item.message}{item.valid && !item.payload?.images?.length ? '; image can be added later' : ''}</td></tr>; })}</tbody></table></div></>}
      <div className="admin-bulk-help"><strong>Complete product import:</strong> productName, packSize, MRP, sellingPrice required. Features/Benefits/Specs/FAQs: separate with <code>|</code> (one per row). Usage steps: "Step 1: description\nStep 2: description". Dosage table: "Crop | Target | Dosage | Water Volume | Waiting Period". Category, subcategory, images all optional (auto-default category used). Blank SKU auto-generated.</div>
    </div>
    <div className="admin-modal-footer"><button type="button" className="admin-quick-btn" onClick={downloadTemplate}><Download size={15} /> CSV Template</button><button type="button" className="admin-primary-btn" disabled={!validCount || importing} onClick={runImport}><Upload size={15} /> {importing ? `Importing ${progress.done + progress.failed}/${rows.length}...` : `Import ${validCount} Valid Products`}</button></div>
  </div></div>;
};
