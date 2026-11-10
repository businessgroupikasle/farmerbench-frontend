import React, { useRef, useState } from 'react';
import {
  Sprout,
  Leaf,
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
  CheckCircle2,
  Navigation,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { contactService } from '../services/contact.service';
import { useUIStore } from '../store/uiStore';
import { getEmailValidationError, getMobileNumberValidationError } from '../utils/validation';
import './ContactPage.css';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type ContactField = keyof ContactFormData;
type ContactFormErrors = Partial<Record<ContactField, string>>;

const validateContactField = (field: ContactField, value: string): string | null => {
  const cleanValue = value.trim();

  switch (field) {
    case 'name':
      if (cleanValue.length < 2) return 'Please enter at least 2 characters for your name';
      if (!/\p{L}/u.test(cleanValue)) return 'Name must include letters and cannot contain only numbers';
      if (cleanValue.length > 100) return 'Name cannot exceed 100 characters';
      return null;
    case 'email':
      return getEmailValidationError(cleanValue);
    case 'phone':
      return getMobileNumberValidationError(cleanValue);
    case 'subject':
      if (cleanValue.length < 2) return 'Subject must be at least 2 characters';
      if (cleanValue.length > 200) return 'Subject cannot exceed 200 characters';
      return null;
    case 'message':
      if (cleanValue.length < 5) return 'Message must be at least 5 characters';
      if (cleanValue.length > 5000) return 'Message cannot exceed 5000 characters';
      return null;
  }
};

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLock = useRef(false);
  const { addToast } = useUIStore();

  const updateField = (field: ContactField, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateField = (field: ContactField) => {
    const warning = validateContactField(field, formData[field]);
    setErrors((current) => ({ ...current, [field]: warning || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: ContactFormErrors = {};
    (Object.keys(formData) as ContactField[]).forEach((field) => {
      const warning = validateContactField(field, formData[field]);
      if (warning) validationErrors[field] = warning;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast({ type: 'error', message: 'Please correct the highlighted fields before sending.' });
      return;
    }

    if (submitLock.current) return;
    submitLock.current = true;
    setIsSubmitting(true);
    try {
      await contactService.submitContact(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
      addToast({ type: 'success', message: 'Your message has been sent successfully' });
    } catch (error: any) {
      addToast({ type: 'error', message: error?.message || 'Unable to send your message. Please try again.' });
    } finally {
      setIsSubmitting(false);
      submitLock.current = false;
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* 1. Header Banner */}
      <section className="contact-hero-banner">
        <div className="contact-hero-container">
          <div className="contact-hero-text">
            <h1 className="contact-hero-title">
              Contact Us <Leaf className="contact-hero-leaf" aria-hidden="true" />
            </h1>
            <p className="contact-hero-desc">
              We are here to help you with the best agricultural solutions for your farm.
            </p>
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
                  Thank you for contacting AgriEra. Our agronomy team will respond to your inquiry within 24 hours.
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
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                {Object.values(errors).some(Boolean) && (
                  <div className="contact-form-warning" role="alert">
                    <AlertCircle size={17} />
                    <span>Please correct the highlighted fields before sending.</span>
                  </div>
                )}
                <div className="contact-form-row">
                  <div className="contact-field">
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      onBlur={() => validateField('name')}
                      className={`contact-input ${errors.name ? 'contact-input-error' : ''}`}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    />
                    {errors.name && <p id="contact-name-error" className="contact-field-warning"><AlertCircle size={13} />{errors.name}</p>}
                  </div>
                  <div className="contact-field">
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      onBlur={() => validateField('email')}
                      className={`contact-input ${errors.email ? 'contact-input-error' : ''}`}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    />
                    {errors.email && <p id="contact-email-error" className="contact-field-warning"><AlertCircle size={13} />{errors.email}</p>}
                  </div>
                </div>

                <div className="contact-field">
                  <input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    onBlur={() => validateField('phone')}
                    className={`contact-input ${errors.phone ? 'contact-input-error' : ''}`}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                  />
                  {errors.phone && <p id="contact-phone-error" className="contact-field-warning"><AlertCircle size={13} />{errors.phone}</p>}
                </div>

                <div className="contact-field">
                  <input
                    id="contact-subject"
                    type="text"
                    maxLength={200}
                    placeholder="Subject *"
                    value={formData.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    onBlur={() => validateField('subject')}
                    className={`contact-input ${errors.subject ? 'contact-input-error' : ''}`}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  />
                  {errors.subject && <p id="contact-subject-error" className="contact-field-warning"><AlertCircle size={13} />{errors.subject}</p>}
                </div>

                <div className="contact-field">
                  <textarea
                    id="contact-message"
                    rows={4}
                    maxLength={5000}
                    placeholder="Your Message *"
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    onBlur={() => validateField('message')}
                    className={`contact-input contact-textarea ${errors.message ? 'contact-input-error' : ''}`}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  />
                  {errors.message && <p id="contact-message-error" className="contact-field-warning"><AlertCircle size={13} />{errors.message}</p>}
                </div>
                <button type="submit" className="contact-btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? <><span className="contact-submit-spinner" /> Sending…</> : <><Send size={16} /> Send Message</>}
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
                  <a href="tel:+9193607 63060" className="contact-info-value">+91 93607 63060</a>
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
                  <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="contact-info-value">+91 93607 63060</a>
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
                  <a href="mailto:support@AgriEra.in" className="contact-info-value">support@AgriEra.in</a>
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
                <a href={import.meta.env.VITE_YOUTUBE_URL || 'https://youtube.com'} target="_blank" rel="noreferrer" className="contact-social-btn youtube" aria-label="YouTube">
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
          {/* Left: Real Google Map */}
          <div className="contact-map-wrapper">
            <iframe
              title="AgriEra HQ Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.4416952899!2d76.89718428670868!3d11.014126294711822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px', display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Location floating badge overlay */}
            <div className="contact-map-floating-badge">
              <div className="contact-pin-badge">
                <Sprout size={14} style={{ color: '#88CF3A' }} />
                <span>AgriEra HQ • Coimbatore</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=123%2C+Green+Fields%2C+Coimbatore+641001%2C+Tamil+Nadu%2C+India"
                target="_blank"
                rel="noreferrer"
                className="contact-map-directions-btn"
              >
                <Navigation size={13} />
                <span>Directions</span>
              </a>
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

            <div className="contact-visit-actions">
              <a
                href="https://www.google.com/maps/search/?api=1&query=123%2C+Green+Fields%2C+Coimbatore+641001%2C+Tamil+Nadu%2C+India"
                target="_blank"
                rel="noreferrer"
                className="contact-directions-link"
              >
                <MapPin size={16} />
                <span>Open in Google Maps</span>
                <ExternalLink size={14} />
              </a>
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
