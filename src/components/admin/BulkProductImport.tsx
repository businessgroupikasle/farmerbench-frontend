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
  if (Array.isArray(value)) {
    return value.map((step: any, index) => ({
      stepNumber: Number(step?.stepNumber) || index + 1,
      title: String(step?.title || '').trim(),
      description: String(step?.description || '').trim(),
    })).filter((step) => step.title || step.description);
  }
  if (typeof value !== 'string') return [];
  const text = value.replace(/\\n/g, '\n').trim();
  if (!text) return [];

  const toStep = (stepNumber: string, rawContent: string) => {
    const content = rawContent.trim().replace(/^[|:;\-–—\s]+/, '').trim();
    if (!content) return null;
    const explicitParts = content.includes('|')
      ? content.split('|', 2)
      : content.match(/^([^:]{2,40}):\s*(.+)$/)?.slice(1);
    const title = explicitParts?.[0]?.trim() || content.split(/\s+/)[0].replace(/[^A-Za-z0-9-]/g, '');
    const description = explicitParts?.[1]?.trim() || content;
    return { stepNumber: Number(stepNumber), title, description };
  };

  const parseMatches = (pattern: RegExp) => {
    const parsed: any[] = [];
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const step = toStep(match[1], match[2]);
      if (step) parsed.push(step);
    }
    return parsed;
  };

  const labelled = parseMatches(/step\s*#?\s*(\d+)\s*(?:[:.)\-–—])\s*(.+?)(?=\s*step\s*#?\s*\d+\s*(?:[:.)\-–—])|$)/gis);
  if (labelled.length) return labelled;
  return parseMatches(/(?:^|[\r\n]+)\s*(\d+)\s*[.)\-]\s*(.+?)(?=(?:[\r\n]+)\s*\d+\s*[.)\-]|$)/gis);
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
    if (item.stock === undefined || item.stock === null || String(item.stock).trim() === '') throw new Error(`Row ${index + 1}: stock is required`);
    const stock = Number(item.stock);
    const sku = String(item.sku || buildSku(title, packSizeValue)).trim().toUpperCase();

    const groupedVariants = Array.isArray(item.variants) ? item.variants : [];
    const variants = (groupedVariants.length ? groupedVariants : (packSizeValue ? [{ label: packSizeValue, mrp, sellingPrice, stock, sku }] : []))
      .filter((entry: any) => String(entry.label || '').trim())
      .map((entry: any) => {
        const variantMrp = Number(entry.mrp || entry.price || 0);
        const variantSellingPrice = Number(entry.sellingPrice || entry.discountPrice || entry.mrp || entry.price || 0);
        const variantStock = Number(entry.stock || 0);
        if (variantMrp <= 0) throw new Error(`Row ${index + 1}: variant MRP must be greater than zero`);
        if (variantSellingPrice <= 0 || variantSellingPrice > variantMrp) throw new Error(`Row ${index + 1}: variant selling price must be between 1 and MRP`);
        if (!Number.isFinite(variantStock) || variantStock < 0) throw new Error(`Row ${index + 1}: variant stock must be zero or greater`);
        return { label: String(entry.label).trim(), mrp: variantMrp, sellingPrice: variantSellingPrice, stock: Math.trunc(variantStock), sku: String(entry.sku || buildSku(title, entry.label)).trim().toUpperCase() };
      });

    if (String(item.description || '').trim().length < 10) throw new Error(`Row ${index + 1}: description must be at least 10 characters`);
    if (mrp <= 0) throw new Error(`Row ${index + 1}: MRP must be greater than zero`);
    if (sellingPrice <= 0 || sellingPrice > mrp) throw new Error(`Row ${index + 1}: selling price must be between 1 and MRP`);
    if (!Number.isFinite(stock) || stock < 0) throw new Error(`Row ${index + 1}: stock must be zero or greater`);

    const primaryVariant = variants[0];
    const price = primaryVariant?.mrp || mrp;
    const finalSellingPrice = primaryVariant?.sellingPrice || sellingPrice;
    const finalStock = primaryVariant?.stock ?? Math.trunc(stock);
    const providedImages = [...splitList(item.images || item.image), ...['image1', 'image2', 'image3', 'image4', 'image5'].map((field) => String(item[field] || '').trim()).filter(Boolean)].filter((image) => /^https?:\/\//i.test(image) || image.startsWith('/uploads/'));
    const images = providedImages.length ? providedImages : ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800'];

    const parsedFeatures = splitList(item.features).map((f) => f.replace(/^✓\s*/, '').trim()).filter(Boolean);
    const parsedBenefits = splitList(item.benefits).map((b) => b.replace(/^✓\s*/, '').trim()).filter(Boolean);
    const parsedUsageSteps = parseUsageSteps(item.usageSteps);
    const parsedDosageTable = parseDosageTable(item.dosageTable);
    const parsedSpecifications = item.specifications && typeof item.specifications === 'string' && item.specifications.includes('|')
      ? parsePipeSeparated(item.specifications, ['label', 'value'])
      : compactObjects(item.specifications, ['label', 'value']);
    const parsedFaqs = item.faqs && typeof item.faqs === 'string' && item.faqs.includes('|')
      ? parsePipeSeparated(item.faqs, ['question', 'answer'])
      : compactObjects(item.faqs, ['question', 'answer']);

    const targetCrops = String(item.targetCrops || '').trim() || 'Refer to the product label for applicable crops';
    const features = parsedFeatures.length ? parsedFeatures : [`${title} product information and application guidance`];
    const benefits = parsedBenefits.length ? parsedBenefits : ['Supports the agricultural application described for this product'];
    const usageSteps = parsedUsageSteps.length ? parsedUsageSteps : [{ stepNumber: 1, title: 'Follow label directions', description: 'Read the product label and use only according to the manufacturer recommendations.' }];
    const dosageTable = parsedDosageTable.length ? parsedDosageTable : [{ crop: 'Applicable crops', target: 'As stated on product label', dosage: 'Refer product label', waterVolume: 'As recommended', waitingPeriod: 'Follow label directions' }];
    const ingredients = String(item.ingredients || '').trim() || 'Refer to the product label or manufacturer documentation for composition details.';
    const specifications = parsedSpecifications.length ? parsedSpecifications : [{ label: 'Product', value: title }];
    const faqs = parsedFaqs.length ? parsedFaqs : [{ question: `How should ${title} be used?`, answer: 'Use only as directed on the product label or after consulting a qualified agronomist.' }];
    return {
      title, slug: String(item.productKey || item.slug || slugify(title)), description: String(item.description || ''),
      price, discountPrice: finalSellingPrice, stock: Math.max(0, finalStock),
      featured: parseBoolean(item.featured), images, categoryId: category.id,
      subcategoryId: subcategory?.categoryId === category.id ? subcategory.id : null,
      attributes: {
        targetCrops,
        variants,
        packSizes: variants.map((v: any) => v.label),
        features,
        benefits,
        usageSteps,
        dosageTable,
        ingredients,
        specifications,
        faqs,
        showProductDetails: parseBoolean(item.showProductDetails, true)
      },
    };
  };

  const validation = rows.map((row, index) => {
    try {
      const payload = resolvePayload(row, index);
      const detailFields = ['targetCrops', 'features', 'benefits', 'usageSteps', 'dosageTable', 'ingredients', 'specifications', 'faqs'];
      const autoFilled = detailFields.filter((field) => !row[field] || (Array.isArray(row[field]) && !row[field].length));
      return { valid: true, payload, message: autoFilled.length ? 'Ready; auto-filled: ' + autoFilled.join(', ') : 'Ready to import' };
    } catch (err: any) { return { valid: false, payload: null, message: err.message || `Row ${index + 1} is invalid` }; }
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
      if (!validation[index]?.valid) { failed += 1; errors.push(validation[index]?.message || `Row ${index + 1} is invalid`); setProgress({ done, failed }); continue; }
      try { await createProduct(validation[index].payload); done += 1; } catch (err: any) { failed += 1; errors.push(err.message || `Row ${index + 1} failed`); }
      setProgress({ done, failed });
    }
    setImporting(false); if (errors.length) setError(errors.slice(0, 4).join(' | ') + (errors.length > 4 ? ` | +${errors.length - 4} more` : '')); if (done) onComplete();
  };

  const validCount = validation.filter((item) => item.valid).length;

  return <div className="admin-modal-overlay"><div className="admin-modal-card admin-bulk-import-card">
    <div className="admin-modal-header"><div><span className="admin-bulk-eyebrow">CATALOG TOOLS</span><h3 className="admin-modal-title">Bulk Import Products</h3><p className="admin-welcome-sub">Upload your product sheet, review mapped details and publish the catalog.</p></div><button className="admin-modal-close-btn" onClick={onClose} disabled={importing}><X size={20} /></button></div>
    <div className="admin-modal-body admin-bulk-import-body">
      <div className="admin-bulk-toolbar">
        <button type="button" className="admin-quick-btn" onClick={downloadTemplate}><Download size={15} /> Download CSV Template</button>
        <label><span>Default category</span><select className="admin-form-select" value={defaultCategoryId} onChange={(event) => setDefaultCategoryId(event.target.value)}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      </div>
      <button type="button" className="admin-gallery-dropzone admin-bulk-dropzone" onClick={() => inputRef.current?.click()}><FileSpreadsheet size={32} /><strong>{fileName || 'Choose a CSV or JSON product file'}</strong><span>{rows.length ? `${rows.length} products grouped and ready for review` : 'The template includes Basic, Highlights, Benefits, Steps, Dosage, Ingredients, Specs and FAQs'}</span></button>
      <input ref={inputRef} type="file" accept=".json,.csv,application/json,text/csv" hidden onChange={(event) => handleFile(event.target.files?.[0])} />
      {error && <div className="admin-gallery-alert"><AlertTriangle size={16} /><span>{error}</span></div>}
      {(progress.done > 0 || progress.failed > 0) && <div className="admin-bulk-progress"><CheckCircle2 size={17} /> {progress.done} created {progress.failed ? `• ${progress.failed} skipped/failed` : 'successfully'}</div>}
      {!!rows.length && <><div className="admin-bulk-summary"><span className="ready">{validCount} Valid</span><span className="error">{rows.length - validCount} Error</span></div><div className="admin-bulk-preview"><table><thead><tr><th>Status</th><th>Product</th><th>Variants</th><th>Category</th><th>Result</th></tr></thead><tbody>{rows.map((row, index) => { const item = validation[index]; return <tr key={`${row.slug || row.title || 'product'}-${index}`}><td><span className={`admin-bulk-status ${item.valid ? 'ready' : 'error'}`}>{item.valid ? 'Ready' : 'Error'}</span></td><td><strong>{row.productName || row.title || row.name || `Row ${index + 1}`}</strong></td><td>{item.payload?.attributes?.variants?.length || 0}</td><td>{categories.find((category) => category.id === item.payload?.categoryId)?.name || '—'}</td><td>{item.message}{item.valid && !splitList(row.images || row.image).length && !['image1', 'image2', 'image3', 'image4', 'image5'].some((field) => String(row[field] || '').trim()) ? '; default image added—replace it later' : ''}</td></tr>; })}</tbody></table></div></>}
      <div className="admin-bulk-help"><strong>Optional:</strong> subcategory, pack size/variants and images. Products without an image receive a temporary default image that you can replace later. Missing product-detail sections are safely auto-filled and identified in the preview. Product name, description, category/default category, MRP, selling price and stock must come from the import file.</div>
    </div>
    <div className="admin-modal-footer"><button type="button" className="admin-quick-btn" onClick={downloadTemplate}><Download size={15} /> CSV Template</button><button type="button" className="admin-primary-btn" disabled={!validCount || importing} onClick={runImport}><Upload size={15} /> {importing ? `Importing ${progress.done + progress.failed}/${rows.length}...` : `Import ${validCount} Valid Products`}</button></div>
  </div></div>;
};
