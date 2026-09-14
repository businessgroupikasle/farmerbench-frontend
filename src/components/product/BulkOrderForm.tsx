import React, { useEffect, useState } from 'react';
import { Building2, CheckCircle2, ChevronDown, PackagePlus, Send } from 'lucide-react';
import { contactService } from '../../services/contact.service';
import { useUIStore } from '../../store/uiStore';
import './BulkOrderForm.css';

interface Props {
  product: { id: string; title: string; slug: string };
  packSize: string;
  sku: string;
  user?: { name?: string | null; email?: string | null; phone?: string | null } | null;
}

export const BulkOrderForm: React.FC<Props> = ({ product, packSize, sku, user }) => {
  const { addToast } = useUIStore();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    quantity: 100, location: '', notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'phone' | 'quantity' | 'location', string>>>({});

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      name: current.name || user.name || '',
      email: current.email || user.email || '',
      phone: current.phone || user.phone || '',
    }));
  }, [user?.name, user?.email, user?.phone]);

  const update = (key: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: typeof errors = {};
    const name = form.name.trim();
    const phone = form.phone.replace(/\D/g, '');
    const email = form.email.trim();
    if (name.length < 3) next.name = 'Enter at least 3 characters.';
    else if (!/^[A-Za-z\u00C0-\u024F\s.'-]+$/.test(name)) next.name = 'Name can contain letters and spaces only.';
    if (!/^[6-9]\d{9}$/.test(phone)) next.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = 'Enter a valid email address.';
    if (!Number.isInteger(form.quantity) || form.quantity < 10) next.quantity = 'Minimum bulk quantity is 10.';
    if (form.location.trim().length < 5) next.location = 'Enter a complete delivery location.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await contactService.submitContact({
        name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(),
        subject: `Bulk order enquiry: ${product.title}`,
        message: JSON.stringify({ type: 'BULK_ORDER', productId: product.id, productTitle: product.title, productSlug: product.slug, sku, packSize, requiredQuantity: form.quantity, location: form.location.trim(), notes: form.notes.trim() }),
      });
      setSubmitted(true);
      addToast({ type: 'success', message: 'Bulk order request sent. Our team will contact you soon.' });
    } catch (error: any) {
      addToast({ type: 'error', message: error.message || 'Could not send the bulk order request.' });
    } finally { setSubmitting(false); }
  };

  return <section className={`pdp-bulk-order ${open ? 'is-open' : ''}`}>
    <button type="button" className="pdp-bulk-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
      <span className="pdp-bulk-toggle-icon"><PackagePlus size={20} /></span>
      <span><strong>Need a bulk quantity?</strong><small>Get special pricing for farms, dealers and institutions</small></span>
      <ChevronDown size={19} className="pdp-bulk-chevron" />
    </button>
    {open && (submitted ? <div className="pdp-bulk-success"><CheckCircle2 size={28} /><div><strong>Request received!</strong><span>Our sales team will contact you with bulk pricing.</span></div></div> :
      <form className="pdp-bulk-form" onSubmit={submit}>
        <div className="pdp-bulk-form-heading"><Building2 size={18} /><span>Bulk Order Enquiry</span><small>Selected: {packSize} · {sku}</small></div>
        <div className="pdp-bulk-grid">
          <label><span>Name *</span><input required autoComplete="name" className={errors.name ? 'has-error' : ''} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" />{errors.name && <small className="pdp-field-error">{errors.name}</small>}</label>
          <label><span>Phone *</span><input required type="tel" inputMode="numeric" autoComplete="tel" maxLength={10} className={errors.phone ? 'has-error' : ''} value={form.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" />{errors.phone && <small className="pdp-field-error">{errors.phone}</small>}</label>
          <label><span>Email *</span><input required type="email" autoComplete="email" className={errors.email ? 'has-error' : ''} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />{errors.email && <small className="pdp-field-error">{errors.email}</small>}</label>
          <label><span>Required Quantity *</span><input required type="number" min="10" step="1" className={errors.quantity ? 'has-error' : ''} value={form.quantity} onChange={(e) => update('quantity', Number(e.target.value))} />{errors.quantity && <small className="pdp-field-error">{errors.quantity}</small>}</label>
          <label className="pdp-bulk-wide"><span>Delivery Location *</span><input required autoComplete="street-address" className={errors.location ? 'has-error' : ''} value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Village / City, District, State, PIN" />{errors.location && <small className="pdp-field-error">{errors.location}</small>}</label>
          <label className="pdp-bulk-wide"><span>Additional requirements</span><textarea rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Preferred delivery date, GST invoice or other requirements" /></label>
        </div>
        <div className="pdp-bulk-footer"><span>No payment required now. We’ll confirm price and availability.</span><button disabled={submitting} type="submit"><Send size={16} /> {submitting ? 'Sending...' : 'Request Bulk Quote'}</button></div>
      </form>)}
  </section>;
};
