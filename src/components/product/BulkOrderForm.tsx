import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
    name: user?.name || '',
    phone: user?.phone || '',
    quantity: 100,
    location: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<'name' | 'phone' | 'quantity' | 'location', string>>>({});

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      name: current.name || user.name || '',
      phone: current.phone || user.phone || '',
    }));
  }, [user?.name, user?.phone]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const update = (key: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: typeof errors = {};
    const name = form.name.trim();
    const phone = form.phone.replace(/\D/g, '');
    if (name.length < 3) next.name = 'Enter at least 3 characters.';
    else if (!/^[A-Za-z\u00C0-\u024F\s.'-]+$/.test(name)) next.name = 'Name can contain letters and spaces only.';
    if (!/^[6-9]\d{9}$/.test(phone)) next.phone = 'Enter a valid 10-digit Indian mobile number.';
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
      const bulkEmail = user?.email || `${form.phone.trim()}@bulk.agriera.in`;
      await contactService.submitContact({
        name: form.name.trim(),
        email: bulkEmail,
        phone: form.phone.trim(),
        subject: `Bulk order enquiry: ${product.title}`,
        message: JSON.stringify({
          type: 'BULK_ORDER',
          productId: product.id,
          productTitle: product.title,
          productSlug: product.slug,
          sku,
          packSize,
          requiredQuantity: form.quantity,
          location: form.location.trim(),
          notes: form.notes.trim(),
        }),
      });
      setSubmitted(true);
      addToast({ type: 'success', message: 'Bulk order request sent. Our team will contact you soon.' });
    } catch (error: any) {
      addToast({ type: 'error', message: error.message || 'Could not send the bulk order request.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={`pdp-bulk-order${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="pdp-bulk-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="pdp-bulk-dropdown"
      >
        <div className="pdp-bulk-toggle-content">
          <strong className="pdp-bulk-title">Need a bulk quantity?</strong>
          <span className="pdp-bulk-subtitle">Get special discounted pricing for farms, dealers &amp; institutions</span>
        </div>
        <div className="pdp-bulk-action">
          <span className="pdp-bulk-open-label">{open ? 'Close form' : 'Open form'}</span>
          <span className="pdp-bulk-chevron-wrap">
            <ChevronDown className="pdp-bulk-chevron" size={16} strokeWidth={2.5} aria-hidden="true" />
          </span>
        </div>
      </button>

      {open && (
        <div id="pdp-bulk-dropdown" className="pdp-bulk-dropdown">
          {submitted ? (
            <div className="pdp-bulk-success">
              <div>
                <strong>Request received successfully!</strong>
                <span>Our sales team will contact you within 24 hours with custom bulk pricing.</span>
              </div>
            </div>
          ) : (
            <form className="pdp-bulk-form" onSubmit={submit}>
              <div className="pdp-bulk-form-heading">
                <span className="pdp-bulk-heading-title">Bulk Order Enquiry</span>
                <span className="pdp-bulk-pack-badge">
                  Selected: <strong>{packSize}</strong> · {sku}
                </span>
              </div>

              <div className="pdp-bulk-perks">
                <span className="pdp-bulk-perk-item">Direct Factory Rates</span>
                <span className="pdp-bulk-perk-item">Farms &amp; Retailers</span>
                <span className="pdp-bulk-perk-item">Bulk GST Invoicing</span>
              </div>

              <div className="pdp-bulk-grid">
                <label>
                  <span>Name *</span>
                  <input
                    required
                    autoComplete="name"
                    className={errors.name ? 'has-error' : ''}
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Your full name"
                  />
                  {errors.name && <small className="pdp-field-error">{errors.name}</small>}
                </label>

                <label>
                  <span>Phone Number *</span>
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    className={errors.phone ? 'has-error' : ''}
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && <small className="pdp-field-error">{errors.phone}</small>}
                </label>

                <label>
                  <span>Required Quantity (Units) *</span>
                  <input
                    required
                    type="number"
                    min="10"
                    step="1"
                    className={errors.quantity ? 'has-error' : ''}
                    value={form.quantity}
                    onChange={(e) => update('quantity', Number(e.target.value))}
                  />
                  {errors.quantity && <small className="pdp-field-error">{errors.quantity}</small>}
                </label>

                <label className="pdp-bulk-wide">
                  <span>Delivery Location *</span>
                  <input
                    required
                    autoComplete="street-address"
                    className={errors.location ? 'has-error' : ''}
                    value={form.location}
                    onChange={(e) => update('location', e.target.value)}
                    placeholder="Village / Town, District, State, PIN Code"
                  />
                  {errors.location && <small className="pdp-field-error">{errors.location}</small>}
                </label>

                <label className="pdp-bulk-wide">
                  <span>Additional Requirements (Optional)</span>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    placeholder="Preferred delivery timeline, GST invoice requirements, or specific packaging..."
                  />
                </label>
              </div>

              <div className="pdp-bulk-footer">
                <span className="pdp-bulk-guarantee">
                  No advance payment needed. Direct quotation shared within 24 hours.
                </span>
                <button disabled={submitting} type="submit" className="pdp-bulk-submit-btn">
                  {submitting ? 'Sending Request...' : 'Request Bulk Quote'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
};
