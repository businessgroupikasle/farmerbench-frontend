import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Star,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Stethoscope,
  FileText,
  Printer,
} from 'lucide-react';
import { Order, User } from '@formerbench/shared';
import doctorAvatar from '../../assets/farm-consult-about.jpg';
import tomatoImg from '../../assets/burnt-leaves.jpg';

/* ==========================================================================
   1. Order Tracking Modal
   ========================================================================== */
interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen) return null;

  const orderId = order ? `#GL-${order.id.slice(0, 5).toUpperCase()}` : '#GL-10482';
  const trackingNumber = 'AGRI-EXP-8894210TN';

  const milestones = [
    {
      title: 'Order Confirmed & Payment Verified',
      date: '28 Aug 2026, 10:15 AM',
      location: 'FarmerBench Processing Hub',
      done: true,
    },
    {
      title: 'Quality Inspection & Eco-Packaging Completed',
      date: '28 Aug 2026, 01:30 PM',
      location: 'Warehouse Central Hub',
      done: true,
    },
    {
      title: 'Dispatched via Express AgriLogistics',
      date: '28 Aug 2026, 04:45 PM',
      location: 'Coimbatore Distribution Center',
      done: true,
      current: true,
    },
    {
      title: 'Arriving at Nearest Delivery Facility',
      date: '30 Aug 2026 (Estimated)',
      location: 'Thanjavur Rural Hub',
      done: false,
    },
    {
      title: 'Out for Delivery to Farm Address',
      date: '31 Aug 2026 (Estimated)',
      location: 'Destination Address',
      done: false,
    },
  ];

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div className="fb-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="fb-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Truck size={22} color="#0F4726" />
            <h3 className="fb-modal-title">Track Shipment {orderId}</h3>
          </div>
          <button className="fb-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="fb-modal-body">
          <div
            style={{
              background: 'var(--fb-green-50)',
              border: '1px solid var(--fb-green-100)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fb-text-muted)' }}>
                Courier Partner
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                Express AgriLogistics (Surface)
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fb-text-muted)' }}>
                AWB / Tracking Number
              </div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--fb-green-800)' }}>
                {trackingNumber}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
            {milestones.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: m.current ? '#2563eb' : m.done ? 'var(--fb-green-800)' : '#e2e8f0',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    flexShrink: 0,
                    zIndex: 2,
                  }}
                >
                  {m.done ? <CheckCircle2 size={14} /> : idx + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{m.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--fb-text-muted)', marginTop: '0.15rem' }}>
                    {m.date} • {m.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fb-modal-footer">
          <button className="fb-btn-primary-dark" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   2. Write / Edit Review Modal
   ========================================================================== */
interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
  productId?: string;
  onSubmitReview: (data: { rating: number; comment: string; crop: string }) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  productTitle = 'Neem Oil 100% Cold Pressed',
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5);
  const [crop, setCrop] = useState('Paddy');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmitReview({ rating, comment, crop });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div className="fb-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="fb-modal-header">
          <div>
            <h3 className="fb-modal-title">Write a Review</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--fb-text-muted)' }}>
              {productTitle}
            </span>
          </div>
          <button className="fb-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fb-modal-body">
            {/* Star Picker */}
            <div className="fb-form-group">
              <label className="fb-form-label">Overall Rating</label>
              <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                  >
                    <Star
                      size={28}
                      fill={star <= rating ? '#f59e0b' : 'none'}
                      color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Type */}
            <div className="fb-form-group">
              <label className="fb-form-label">Crop Applied On</label>
              <select
                className="fb-form-select"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
              >
                <option value="Paddy">Paddy (Rice)</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Turmeric">Turmeric</option>
                <option value="Banana">Banana</option>
                <option value="Vegetables">Vegetables & Chillies</option>
                <option value="Coconut">Coconut</option>
              </select>
            </div>

            {/* Feedback Content */}
            <div className="fb-form-group">
              <label className="fb-form-label">Your Experience & Results</label>
              <textarea
                className="fb-form-textarea"
                rows={4}
                required
                placeholder="Describe how this product helped your crop health, dosage used, and visible results after application..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="fb-modal-footer">
            <button type="button" className="fb-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fb-btn-primary-dark" disabled={isSubmitting}>
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ==========================================================================
   3. Consultation Video Call Simulation Modal
   ========================================================================== */
interface ConsultationVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationVideoModal: React.FC<ConsultationVideoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div
        className="fb-modal-box"
        style={{ maxWidth: '800px', background: '#090d16', color: '#ffffff' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 10px #22c55e',
              }}
            />
            <span style={{ fontWeight: 700 }}>Live Consultation Room — Dr. Arun Kumar</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Area */}
        <div style={{ position: 'relative', height: '420px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={doctorAvatar}
            alt="Dr. Arun Kumar"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />

          {/* User Self-view Preview Thumbnail */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              width: '140px',
              height: '95px',
              background: '#1e293b',
              borderRadius: '10px',
              border: '2px solid #334155',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '0.75rem',
            }}
          >
            {camActive ? (
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Your Video (Farm)</span>
            ) : (
              <VideoOff size={24} />
            )}
          </div>

          {/* Doctor Label */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            Dr. Arun Kumar (Senior Agronomist)
          </div>
        </div>

        {/* Controls Bar */}
        <div
          style={{
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            background: '#090d16',
            borderTop: '1px solid #1e293b',
          }}
        >
          <button
            onClick={() => setMicActive(!micActive)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: micActive ? '#334155' : '#ef4444',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {micActive ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          <button
            onClick={() => setCamActive(!camActive)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: camActive ? '#334155' : '#ef4444',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {camActive ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '999px',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <PhoneOff size={18} /> End Call
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   4. Crop Doctor Report & Prescription Modal
   ========================================================================== */
interface CropDoctorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CropDoctorReportModal: React.FC<CropDoctorReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div className="fb-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="fb-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Stethoscope size={22} color="#0F4726" />
            <h3 className="fb-modal-title">Crop Doctor Diagnosis Report</h3>
          </div>
          <button className="fb-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="fb-modal-body">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <img
              src={tomatoImg}
              alt="Disease Sample"
              style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Early Blight / Leaf Spots</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--fb-text-muted)' }}>
                Target Crop: Tomato & Nightshade Family
              </div>
              <span className="fb-status-pill-green" style={{ marginTop: '0.35rem' }}>
                Diagnosis Verified by Expert
              </span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              Specialist Observations
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--fb-text-muted)', lineHeight: 1.45 }}>
              The concentric rings and dark brown necrotic lesions indicate fungal fungal infection
              caused by <em>Alternaria solani</em>. High humidity and overhead sprinkler irrigation
              accelerate the spread.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.65rem' }}>
              Prescribed Treatment Schedule
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <strong>Immediate Spray (Day 1):</strong> Apply Copper Oxychloride 50% WP @ 2.5g per litre of water.
              </li>
              <li>
                <strong>Bio-Control (Day 7):</strong> Foliar spray of <em>Trichoderma viride</em> (2ml/L) to prevent secondary infection.
              </li>
              <li>
                <strong>Cultural Practice:</strong> Switch from overhead sprinklers to drip irrigation to keep foliage dry.
              </li>
            </ul>
          </div>
        </div>

        <div className="fb-modal-footer">
          <button className="fb-btn-primary-dark" onClick={onClose}>
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   5. Complete Farm Profile Modal (Direct Backend API Update)
   ========================================================================== */
interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSaveProfile: (data: { name?: string; phone?: string; location?: string; crops?: string }) => Promise<void>;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile,
}) => {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [crops, setCrops] = useState(user?.crops || 'Paddy, Sugarcane (12 Acres)');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile({ name, phone, location, crops });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div className="fb-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="fb-modal-header">
          <h3 className="fb-modal-title">Farm & Farmer Profile</h3>
          <button className="fb-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fb-modal-body">
            <div className="fb-form-group">
              <label className="fb-form-label">Full Name</label>
              <input
                className="fb-form-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="fb-form-group">
              <label className="fb-form-label">Primary Mobile Number</label>
              <input
                className="fb-form-input"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="fb-form-group">
              <label className="fb-form-label">Farm Location / Address</label>
              <input
                className="fb-form-input"
                required
                placeholder="e.g., 123, Green Fields, Thanjavur, Tamil Nadu - 613001"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="fb-form-group">
              <label className="fb-form-label">Primary Crops & Land Acreage</label>
              <input
                className="fb-form-input"
                placeholder="e.g., Paddy, Cotton, Turmeric (10 Acres)"
                value={crops}
                onChange={(e) => setCrops(e.target.value)}
              />
            </div>
          </div>

          <div className="fb-modal-footer">
            <button type="button" className="fb-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fb-btn-primary-dark" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ==========================================================================
   6. Printable GST Tax Invoice Modal
   ========================================================================== */
interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen) return null;

  const orderId = order ? `#GL-${order.id.slice(0, 5).toUpperCase()}` : '#GL-10482';
  const total = order?.totalPrice ?? 1480;
  const gst = Math.round(total * 0.05);
  const net = total - gst;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div className="fb-modal-box" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="fb-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={22} color="#0F4726" />
            <h3 className="fb-modal-title">Tax Invoice {orderId}</h3>
          </div>
          <button className="fb-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="fb-modal-body" id="printable-invoice">
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0F4726', paddingBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F4726' }}>
                FarmerBench Agro Pvt Ltd
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fb-text-muted)' }}>
                GSTIN: 33AAACF4921L1Z9 • CIN: U01111TN2026PTC104928
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800 }}>Invoice {orderId}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fb-text-muted)' }}>
                Date: 28 Aug 2026
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Item Description</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>Growth Booster for All Crops</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>2</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>900.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>Neem Oil 100% Cold Pressed</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>1</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>580.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <div style={{ width: '220px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal (Net):</span>
                <span>₹{net.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST (5%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.35rem' }}>
                <span>Total Paid:</span>
                <span style={{ color: '#0F4726' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fb-modal-footer">
          <button className="fb-btn-outline" onClick={handlePrint}>
            <Printer size={16} /> Print Receipt
          </button>
          <button className="fb-btn-primary-dark" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
