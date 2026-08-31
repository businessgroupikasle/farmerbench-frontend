import React, { useState } from 'react';
import {
  Sprout,
  Send,
  Lock,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Headphones,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import './ContactPage.css';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="contact-page-wrapper">
      {/* 1. Header Banner */}
      <section className="contact-hero-banner">
        <div className="contact-hero-container">
          <div className="contact-hero-text">
            <h1 className="contact-hero-title">
              Contact Us <Sprout size={36} style={{ color: '#78B833' }} />
            </h1>
            <p className="contact-hero-desc">
              We are here to help you with the best agricultural solutions for your farm.
            </p>
          </div>

          {/* Hands holding seedling illustration/graphic */}
          <div className="contact-hero-img-wrap">
            <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M40 200C90 170 140 160 200 170C260 180 310 160 360 200H40Z"
                fill="#2E1C11"
              />
              <ellipse cx="200" cy="180" rx="160" ry="18" fill="#3D2617" />
              {/* Healthy Green Sprout */}
              <path
                d="M198 180V120M198 120C198 90 160 95 160 95C160 95 165 130 198 120ZM198 110C198 80 236 85 236 85C236 85 231 120 198 110ZM198 100C198 60 180 50 180 50C180 50 216 60 198 100Z"
                fill="#78B833"
                stroke="#5A9620"
                strokeWidth="2"
              />
              <circle cx="200" cy="85" r="4" fill="#A4DE5B" />
              {/* Background field leaves */}
              <path d="M120 180C120 150 100 140 100 140C100 140 110 170 120 180Z" fill="#588D23" />
              <path d="M280 180C280 150 300 140 300 140C300 140 290 170 280 180Z" fill="#588D23" />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <div className="contact-main-container">
        {/* Top Grid: Form + Info */}
        <div className="contact-top-grid">
          {/* Left Card: Get In Touch Form */}
          <div className="contact-card">
            <div className="contact-card-header">
              <Sprout size={24} style={{ color: '#78B833' }} />
              <h2 className="contact-card-title">Get In Touch</h2>
            </div>
            <p className="contact-card-subtitle">
              Have a question or need help? Send us a message and we'll get back to you as soon as possible.
            </p>

            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#EBF5ED',
                    color: '#164627',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#17251E', marginBottom: '0.75rem' }}>
                  Message Sent Successfully!
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '1.75rem', maxWidth: '420px', margin: '0 auto 1.75rem' }}>
                  Thank you for contacting FarmerBench. Our agronomy team will respond to your inquiry within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="contact-btn-submit"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div>
                    <input
                      required
                      type="text"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="contact-input"
                    />
                  </div>
                  <div>
                    <input
                      required
                      type="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="contact-input"
                    />
                  </div>
                </div>

                <div>
                  <input
                    required
                    type="tel"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="contact-input"
                  />
                </div>

                <div>
                  <input
                    required
                    type="text"
                    placeholder="Subject *"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="contact-input"
                  />
                </div>

                <div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Your Message *"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="contact-input contact-textarea"
                  />
                </div>

                <button type="submit" className="contact-btn-submit">
                  <Send size={16} /> Send Message
                </button>

                <div className="contact-security-text">
                  <Lock size={14} style={{ color: '#78B833' }} />
                  <span>Your information is safe with us. We never share your details.</span>
                </div>
              </form>
            )}
          </div>

          {/* Right Card: Contact Information */}
          <div className="contact-card">
            <div className="contact-card-header">
              <Sprout size={24} style={{ color: '#78B833' }} />
              <h2 className="contact-card-title">Contact Information</h2>
            </div>
            <div style={{ height: '1.25rem' }} />

            <div className="contact-info-list">
              {/* Call Us */}
              <div className="contact-info-item">
                <div className="contact-info-icon-box">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="contact-info-heading">Call Us</p>
                  <a href="tel:+919876543210" className="contact-info-value">+91 98765 43210</a>
                  <p className="contact-info-subtext">Mon - Sat (9:00 AM - 6:00 PM)</p>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="contact-info-item">
                <div className="contact-info-icon-box">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="contact-info-heading">WhatsApp Support</p>
                  <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="contact-info-value">+91 98765 43210</a>
                  <p className="contact-info-subtext">Chat with us on WhatsApp</p>
                </div>
              </div>

              {/* Email Us */}
              <div className="contact-info-item">
                <div className="contact-info-icon-box">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="contact-info-heading">Email Us</p>
                  <a href="mailto:support@farmerbench.in" className="contact-info-value">support@farmerbench.in</a>
                  <p className="contact-info-subtext">We reply within 24 hours</p>
                </div>
              </div>

              {/* Our Address */}
              <div className="contact-info-item">
                <div className="contact-info-icon-box">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="contact-info-heading">Our Address</p>
                  <p className="contact-info-value" style={{ fontWeight: 600, color: '#17251E' }}>
                    123, Green Fields,<br />Coimbatore - 641001,<br />Tamil Nadu, India
                  </p>
                </div>
              </div>
            </div>

            {/* Follow Us Row */}
            <div className="contact-follow-us">
              <span className="contact-follow-label">Follow Us</span>
              <div className="contact-social-icons">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="contact-social-btn facebook" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="contact-social-btn instagram" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="contact-social-btn youtube" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  </svg>
                </a>
                <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="contact-social-btn whatsapp" aria-label="WhatsApp">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Map + Visit Us */}
        <div className="contact-bottom-grid">
          {/* Left: Map Preview */}
          <div className="contact-map-wrapper">
            <svg width="100%" height="260" viewBox="0 0 600 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
              {/* Map background tiles */}
              <rect width="600" height="260" fill="#E8ECE4" />
              {/* Major Roads */}
              <path d="M0 60 Q 200 80 340 140 T 600 180" stroke="#F6D585" strokeWidth="12" fill="none" />
              <path d="M80 0 L 160 260" stroke="#FFFFFF" strokeWidth="8" fill="none" />
              <path d="M300 0 L 360 260" stroke="#FFFFFF" strokeWidth="10" fill="none" />
              <path d="M0 160 Q 300 150 600 90" stroke="#FFFFFF" strokeWidth="8" fill="none" />
              <path d="M220 0 Q 300 120 450 260" stroke="#F6D585" strokeWidth="8" fill="none" />
              {/* Waterway */}
              <path d="M480 0 Q 520 80 500 160 T 540 260" stroke="#B8DCEF" strokeWidth="16" fill="none" />
              {/* City Labels */}
              <text x="310" y="190" fill="#6B7280" fontSize="11" fontWeight="700">Gandhipuram</text>
              <text x="240" y="70" fill="#9CA3AF" fontSize="10">Peelamedu</text>
              <text x="380" y="90" fill="#374151" fontSize="13" fontWeight="800">Coimbatore</text>
              <text x="80" y="180" fill="#9CA3AF" fontSize="10">Solur</text>
              <text x="440" y="210" fill="#9CA3AF" fontSize="10">Thudiyalur</text>
            </svg>

            {/* Custom Location Pin Marker */}
            <div className="contact-map-pin-overlay">
              <div className="contact-pin-badge">
                <Sprout size={14} style={{ color: '#88CF3A' }} />
                <span>FarmerBench HQ</span>
              </div>
              <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
                <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="#164627" />
                <circle cx="12" cy="11" r="5" fill="#88CF3A" />
              </svg>
            </div>
          </div>

          {/* Right: Visit Us & Office Hours */}
          <div className="contact-card">
            <div className="contact-card-header">
              <Sprout size={24} style={{ color: '#78B833' }} />
              <h2 className="contact-card-title">Visit Us</h2>
            </div>
            <p className="contact-card-subtitle" style={{ marginBottom: '1rem' }}>
              We'd love to meet you and understand your farming needs better.
            </p>

            <div className="contact-hours-box">
              <Clock size={22} className="contact-hours-icon" />
              <div>
                <p className="contact-hours-title">Office Hours</p>
                <p className="contact-hours-detail">
                  Monday - Saturday: 9:00 AM - 6:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Guarantees Strip */}
        <div className="contact-guarantees-strip">
          <div className="contact-guarantee-item">
            <div className="contact-guarantee-icon">
              <Headphones size={22} />
            </div>
            <div>
              <h4 className="contact-guarantee-title">Expert Support</h4>
              <p className="contact-guarantee-desc">Get help from our agriculture experts</p>
            </div>
          </div>

          <div className="contact-guarantee-item">
            <div className="contact-guarantee-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="contact-guarantee-title">Quality Products</h4>
              <p className="contact-guarantee-desc">100% genuine & trusted products</p>
            </div>
          </div>

          <div className="contact-guarantee-item">
            <div className="contact-guarantee-icon">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="contact-guarantee-title">Fast Delivery</h4>
              <p className="contact-guarantee-desc">Quick & safe delivery to your doorstep</p>
            </div>
          </div>

          <div className="contact-guarantee-item">
            <div className="contact-guarantee-icon">
              <Sprout size={22} />
            </div>
            <div>
              <h4 className="contact-guarantee-title">Farmer First</h4>
              <p className="contact-guarantee-desc">Solutions designed for farmers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
