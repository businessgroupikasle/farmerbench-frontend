import React, { useState } from 'react';
import { Check, Sprout, Award, X, Send, Sparkles } from 'lucide-react';
import { getUploadUrl } from '../../utils/image';
import mainFieldImg from '../../assets/farming-practices.jpg';
import vineyardImg from '../../assets/vineyard-hills.jpg';
import wheatImg from '../../assets/wheat-sunburst.jpg';

export const HomeAgriculturePractice: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const mainFieldUrl = getUploadUrl('farming-practices.jpg', mainFieldImg);
  const vineyardUrl = getUploadUrl('vineyard-hills.jpg', vineyardImg);
  const wheatUrl = getUploadUrl('wheat-sunburst.jpg', wheatImg);

  return (
    <>
      <section className="agriflow-practice-section">
        {/* Left Visual Composition (3 Rounded Pill Capsules) */}
        <div className="agriflow-practice-collage">
          {/* Main Large Golden Field Pill */}
          <div className="agriflow-pill-main">
            <img src={mainFieldUrl} alt="Eco-friendly farming practices" />
            <div className="agriflow-pill-main-overlay">
              <h3 className="agriflow-pill-main-text">
                Eco–Friendly<br />Farming Practices
              </h3>
            </div>
          </div>

          {/* Top Left Smaller Vineyard Pill */}
          <div className="agriflow-pill-top-left">
            <img src={vineyardUrl} alt="Organic vineyard rows" />
          </div>

          {/* Bottom Left Medium Wheat Sunburst Pill */}
          <div className="agriflow-pill-bottom-left">
            <img src={wheatUrl} alt="Golden wheat sunburst" />
          </div>
        </div>

        {/* Right Content Section */}
        <div className="agriflow-practice-content">
          <div>
            <h2 className="agriflow-practice-heading">
              Agriculture & Natural<br />Product Farming
            </h2>
            <p className="agriflow-practice-desc">
              Visit to the center of natural product farming, where the beauty of nature's wealth meets ethical cultivation.
            </p>
          </div>

          {/* Feature Box */}
          <div className="agriflow-practice-feature-box">
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity: 0.28,
              }}
              viewBox="0 0 400 120"
              fill="none"
            >
              <circle cx="60" cy="60" r="90" stroke="#78B833" strokeWidth="1.2" />
              <circle cx="340" cy="60" r="110" stroke="#78B833" strokeWidth="1.2" />
            </svg>

            <div className="agriflow-feature-item">
              <div className="agriflow-feature-icon-circle">
                <Sprout size={24} strokeWidth={2.4} />
              </div>
              <div>
                <p className="agriflow-feature-title">Fresh Produce</p>
                <p className="agriflow-feature-subtitle">Cultivation Journey</p>
              </div>
            </div>

            <div className="agriflow-feature-item">
              <div className="agriflow-feature-icon-circle">
                <Award size={24} strokeWidth={2.4} />
              </div>
              <div>
                <p className="agriflow-feature-title">Guaranteed</p>
                <p className="agriflow-feature-subtitle">Organic Quality</p>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="agriflow-checklist">
            <div className="agriflow-checklist-item">
              <div className="agriflow-check-icon">
                <Check size={15} strokeWidth={3} />
              </div>
              <span className="agriflow-checklist-text">
                Rigorous certification process ensures organic quality.
              </span>
            </div>

            <div className="agriflow-checklist-item">
              <div className="agriflow-check-icon">
                <Check size={15} strokeWidth={3} />
              </div>
              <span className="agriflow-checklist-text">
                Eco-friendly farming practices ensure soil sustainability.
              </span>
            </div>
          </div>

          {/* Contact Button */}
          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={() => setIsContactOpen(true)} className="agriflow-practice-btn">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {isContactOpen && (
        <div className="agriflow-modal-overlay" onClick={() => setIsContactOpen(false)}>
          <div className="agriflow-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsContactOpen(false)} className="agriflow-modal-close">
              <X size={22} />
            </button>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(136, 207, 58, 0.2)',
                    color: '#88CF3A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <Sparkles size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.75rem' }}>
                  Thank You for Your Interest!
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Our agriculture specialists will connect with you shortly regarding ethical farming and supply.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setIsContactOpen(false);
                  }}
                  className="agriflow-btn-contact"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                  Learn More About Our Farming
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Ask our agronomists about our organic certification, farm visits, and wholesale distribution.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Name
                    </label>
                    <input required type="text" placeholder="Your name" className="agriflow-input" />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Email
                    </label>
                    <input required type="email" placeholder="your@email.com" className="agriflow-input" />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#CBD5E1', marginBottom: '0.35rem' }}>
                      Inquiry Details
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us what you'd like to know about our eco-friendly farming practices..."
                      className="agriflow-input"
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="agriflow-btn-contact"
                    style={{ width: '100%', marginTop: '0.5rem', gap: '0.5rem' }}
                  >
                    <Send size={16} /> Send Inquiry
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HomeAgriculturePractice;
