import React, { useMemo, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { adminService, CouponRecord } from '../../services/admin.service';

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCouponCreated: (coupon: CouponRecord) => void;
  showToast: (msg: string) => void;
}

export const CreateCouponModal: React.FC<CreateCouponModalProps> = ({
  isOpen,
  onClose,
  onCouponCreated,
  showToast,
}) => {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minimumSpend, setMinimumSpend] = useState('0');
  const [usageLimit, setUsageLimit] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [showOnHomepage, setShowOnHomepage] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Today in YYYY-MM-DD local format
  const todayStr = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  if (!isOpen) return null;

  const validateField = (name: string, value: any, currentType = discountType): string => {
    switch (name) {
      case 'code': {
        const val = String(value || '').trim();
        if (!val) return 'Coupon Code is mandatory';
        if (val.length < 2) return 'Coupon code must be at least 2 characters';
        if (val.length > 40) return 'Coupon code cannot exceed 40 characters';
        if (!/^[A-Z0-9]+$/.test(val)) {
          return 'Coupon code must contain uppercase letters and numbers only (e.g., AGRIERA25). No spaces or special characters.';
        }
        return '';
      }
      case 'discountType': {
        if (!value || (value !== 'PERCENTAGE' && value !== 'FIXED')) {
          return 'Discount Type is mandatory';
        }
        return '';
      }
      case 'discountValue': {
        if (value === '' || value === null || value === undefined) {
          return 'Discount Value is mandatory';
        }
        const num = Number(value);
        if (Number.isNaN(num) || num <= 0) {
          return 'Discount value must be greater than 0';
        }
        if (currentType === 'PERCENTAGE' && num > 100) {
          return 'Percentage discount must not exceed 100%';
        }
        return '';
      }
      case 'usageLimit': {
        if (value === '' || value === null || value === undefined) return '';
        const num = Number(value);
        if (!Number.isInteger(num) || num <= 0) {
          return 'Usage limit must be a positive whole number';
        }
        return '';
      }
      case 'validUntil': {
        const val = String(value || '').trim();
        if (!val) return 'Valid Until date is mandatory';
        const parsed = new Date(val);
        if (Number.isNaN(parsed.getTime())) return 'Invalid date format';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (parsed < today) {
          return 'Past dates are not allowed. Please select today or a future date.';
        }
        return '';
      }
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let val: any = '';
    if (field === 'code') val = code;
    else if (field === 'discountType') val = discountType;
    else if (field === 'discountValue') val = discountValue;
    else if (field === 'usageLimit') val = usageLimit;
    else if (field === 'validUntil') val = validUntil;

    const err = validateField(field, val);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Standardize coupon code: uppercase, strip spaces
    const clean = e.target.value.toUpperCase().replace(/\s+/g, '');
    setCode(clean);
    if (touched.code) {
      const err = validateField('code', clean);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next.code = err;
        else delete next.code;
        return next;
      });
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextType = e.target.value as 'PERCENTAGE' | 'FIXED';
    setDiscountType(nextType);
    if (touched.discountValue) {
      const err = validateField('discountValue', discountValue, nextType);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next.discountValue = err;
        else delete next.discountValue;
        return next;
      });
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDiscountValue(val);
    if (touched.discountValue) {
      const err = validateField('discountValue', val);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next.discountValue = err;
        else delete next.discountValue;
        return next;
      });
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsageLimit(val);
    if (touched.usageLimit) {
      const err = validateField('usageLimit', val);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next.usageLimit = err;
        else delete next.usageLimit;
        return next;
      });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValidUntil(val);
    if (touched.validUntil) {
      const err = validateField('validUntil', val);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next.validUntil = err;
        else delete next.validUntil;
        return next;
      });
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {
      code: validateField('code', code),
      discountType: validateField('discountType', discountType),
      discountValue: validateField('discountValue', discountValue),
      usageLimit: validateField('usageLimit', usageLimit),
      validUntil: validateField('validUntil', validUntil),
    };
    Object.keys(newErrors).forEach((k) => {
      if (!newErrors[k]) delete newErrors[k];
    });
    setErrors(newErrors);
    setTouched({
      code: true,
      discountType: true,
      discountValue: true,
      usageLimit: true,
      validUntil: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) {
      showToast('Please fix the validation errors before creating the coupon.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await adminService.createCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minimumSpend: Math.max(0, Number(minimumSpend) || 0),
        usageLimit: usageLimit ? Number(usageLimit) : null,
        validUntil,
        showOnHomepage,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create coupon');
      }

      onCouponCreated(response.data);
      showToast(`Coupon ${code.trim().toUpperCase()} created successfully!`);
      onClose();
    } catch (error: any) {
      const msg = error.message || 'Failed to create coupon';
      if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate')) {
        setErrors((prev) => ({
          ...prev,
          code: `Coupon code "${code.trim().toUpperCase()}" already exists. Please choose a different code.`,
        }));
        setTouched((prev) => ({ ...prev, code: true }));
      }
      showToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-card admin-coupon-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Create Discount Coupon</h3>
          <button onClick={onClose} className="admin-modal-close-btn" type="button" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-modal-body">
            {/* Coupon Code */}
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="coupon-code-input">
                Coupon Code <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="coupon-code-input"
                name="coupCode"
                value={code}
                onChange={handleCodeChange}
                onBlur={() => handleBlur('code')}
                placeholder="e.g. AGRIERA25"
                className="admin-form-input"
                style={{
                  textTransform: 'uppercase',
                  borderColor: touched.code && errors.code ? '#DC2626' : undefined,
                }}
                required
              />
              <small style={{ display: 'block', color: '#64748B', fontSize: '0.72rem', marginTop: '2px' }}>
                Mandatory: Uppercase letters and numbers only (e.g. AGRIERA25). No spaces or special characters.
              </small>
              {touched.code && errors.code && (
                <span className="admin-field-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <AlertCircle size={13} /> {errors.code}
                </span>
              )}
            </div>

            {/* Discount Type */}
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="coupon-type-select">
                Discount Type <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                id="coupon-type-select"
                name="coupType"
                value={discountType}
                onChange={handleTypeChange}
                onBlur={() => handleBlur('discountType')}
                className="admin-form-select"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
              {touched.discountType && errors.discountType && (
                <span className="admin-field-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <AlertCircle size={13} /> {errors.discountType}
                </span>
              )}
            </div>

            {/* Discount Value */}
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="coupon-value-input">
                Discount Value <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="coupon-value-input"
                name="coupDisc"
                type="number"
                min="0.01"
                step="0.01"
                value={discountValue}
                onChange={handleValueChange}
                onBlur={() => handleBlur('discountValue')}
                placeholder={discountType === 'PERCENTAGE' ? 'e.g. 25 (max 100%)' : 'e.g. 150'}
                className="admin-form-input"
                style={{ borderColor: touched.discountValue && errors.discountValue ? '#DC2626' : undefined }}
                required
              />
              <small style={{ display: 'block', color: '#64748B', fontSize: '0.72rem', marginTop: '2px' }}>
                {discountType === 'PERCENTAGE' ? 'Mandatory: Percentage must be greater than 0 and not exceed 100%.' : 'Mandatory: Fixed amount must be greater than 0.'}
              </small>
              {touched.discountValue && errors.discountValue && (
                <span className="admin-field-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <AlertCircle size={13} /> {errors.discountValue}
                </span>
              )}
            </div>

            {/* Minimum Spend */}
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="coupon-min-input">
                Minimum Spend (₹)
              </label>
              <input
                id="coupon-min-input"
                name="coupMin"
                type="number"
                min="0"
                step="1"
                value={minimumSpend}
                onChange={(e) => setMinimumSpend(e.target.value)}
                className="admin-form-input"
              />
              <small style={{ display: 'block', color: '#64748B', fontSize: '0.72rem', marginTop: '2px' }}>
                Optional: Minimum cart subtotal required to apply coupon.
              </small>
            </div>

            {/* Usage Limit */}
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="coupon-limit-input">
                Usage Limit (optional)
              </label>
              <input
                id="coupon-limit-input"
                name="coupLimit"
                type="number"
                min="1"
                step="1"
                value={usageLimit}
                onChange={handleLimitChange}
                onBlur={() => handleBlur('usageLimit')}
                placeholder="e.g. 500"
                className="admin-form-input"
                style={{ borderColor: touched.usageLimit && errors.usageLimit ? '#DC2626' : undefined }}
              />
              <small style={{ display: 'block', color: '#64748B', fontSize: '0.72rem', marginTop: '2px' }}>
                Optional: If entered, accept only positive whole numbers.
              </small>
              {touched.usageLimit && errors.usageLimit && (
                <span className="admin-field-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <AlertCircle size={13} /> {errors.usageLimit}
                </span>
              )}
            </div>

            {/* Valid Until */}
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="coupon-expiry-input">
                Valid Until <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="coupon-expiry-input"
                name="coupExpiry"
                type="date"
                min={todayStr}
                value={validUntil}
                onChange={handleExpiryChange}
                onBlur={() => handleBlur('validUntil')}
                className="admin-form-input"
                style={{ borderColor: touched.validUntil && errors.validUntil ? '#DC2626' : undefined }}
                required
              />
              <small style={{ display: 'block', color: '#64748B', fontSize: '0.72rem', marginTop: '2px' }}>
                Mandatory: Past dates should not be allowed.
              </small>
              {touched.validUntil && errors.validUntil && (
                <span className="admin-field-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <AlertCircle size={13} /> {errors.validUntil}
                </span>
              )}
            </div>

            {/* Show on Homepage */}
            <label className="admin-form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.65rem', cursor: 'pointer' }}>
              <input
                name="coupHomepage"
                type="checkbox"
                checked={showOnHomepage}
                onChange={(e) => setShowOnHomepage(e.target.checked)}
              />
              <span>
                <strong>Show on homepage</strong>
                <small style={{ display: 'block', color: '#64748B', marginTop: '.15rem' }}>Feature this coupon in the homepage offer banner.</small>
              </span>
            </label>
          </div>

          <div className="admin-modal-footer">
            <button type="button" onClick={onClose} className="admin-quick-btn" disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="admin-primary-btn"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              style={{
                opacity: Object.keys(errors).length > 0 ? 0.6 : 1,
                cursor: Object.keys(errors).length > 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

