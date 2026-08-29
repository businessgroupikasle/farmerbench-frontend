import React, { useState } from 'react';
import {
  FlaskConical,
  Bug,
  Droplets,
  Sprout,
  TrendingUp,
  ShieldCheck,
  PhoneCall,
  Calendar,
  CheckCircle2,
  X,
  Send,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Award,
} from 'lucide-react';
import { ServicesHero } from '../components/services/ServicesHero';
import { ServicesHighlights } from '../components/services/ServicesHighlights';
import { ServicesFarmVisit } from '../components/services/ServicesFarmVisit';
import { ServicesCTA } from '../components/services/ServicesCTA';
import './ServicesPage.css';

// Fallback images
import irrigationImg from '../assets/smart-irrigation.jpg';
import monitoringImg from '../assets/crop-monitoring.jpg';
import sustainableImg from '../assets/sustainable-farm.jpg';
import organicImg from '../assets/organic-farming.jpg';
import practicesImg from '../assets/farming-practices.jpg';
import heroBgImg from '../assets/hero-bg.jpg';

interface ServiceItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  benefits: string[];
}

export const ServicesPage: React.FC = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('Soil Health & Nutrient Audit');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  const services: ServiceItem[] = [
    {
      id: 'soil-health',
      tag: 'Soil & Nutrition',
      title: 'Soil Health & Nutrient Audit',
      description:
        'Comprehensive 14-parameter laboratory soil testing with personalized organic and chemical fertilization plans for balanced soil biology.',
      icon: <FlaskConical size={22} />,
      image: practicesImg,
      benefits: ['N-P-K & Micronutrient profiling', 'Soil pH & organic carbon analysis', 'Custom dosage calculator'],
    },
    {
      id: 'crop-protection',
      tag: 'Crop Health',
      title: 'Precision Crop Protection & Pest Shield',
      description:
        'Early identification of fungal, bacterial, and pest threats with bio-friendly and targeted treatments to prevent crop loss.',
      icon: <Bug size={22} />,
      image: monitoringImg,
      benefits: ['On-field pest diagnostics', 'Integrated Pest Management (IPM)', 'Preventive spray calendar'],
    },
    {
      id: 'smart-irrigation',
      tag: 'Water Management',
      title: 'Smart Drip & Irrigation Optimization',
      description:
        'Tailored drip, micro-sprinkler, and fertigation designs to conserve water up to 45% while boosting nutrient uptake efficiency.',
      icon: <Droplets size={22} />,
      image: irrigationImg,
      benefits: ['Water requirement modeling', 'Fertigation system setup', 'Soil moisture sensor advisory'],
    },
    {
      id: 'organic-transition',
      tag: 'Organic & Sustainable',
      title: 'Organic Transition & Certification',
      description:
        'Step-by-step guidance for transitioning conventional farms into certified organic operations with sustainable bio-inputs.',
      icon: <Sprout size={22} />,
      image: organicImg,
      benefits: ['Zero-chemical farming protocols', 'Bio-fertilizer manufacturing tips', 'Certification documentation support'],
    },
    {
      id: 'yield-optimization',
      tag: 'Agronomy',
      title: 'Yield Maximization & Seed Consulting',
      description:
        'High-yielding hybrid & heirloom seed selection, plant spacing, and stage-by-stage agronomic advisories throughout crop lifecycle.',
      icon: <TrendingUp size={22} />,
      image: sustainableImg,
      benefits: ['Climate-resilient crop selection', 'Density & canopy management', 'Harvest timing & grading advice'],
    },
    {
      id: 'farm-mechanization',
      tag: 'Tech & Machinery',
      title: 'Farm Mechanization & Drone Spraying',
      description:
        'Modern agricultural machinery recommendations and drone-based rapid foliar spraying services for large acreage farms.',
      icon: <ShieldCheck size={22} />,
      image: heroBgImg,
      benefits: ['Precision drone spraying', 'Machinery rental guidance', 'Labor cost reduction strategies'],
    },
  ];

  const handleOpenConsultation = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    setBookingSuccess(false);
    setIsConsultationModalOpen(true);
  };

  const handleOpenExpertModal = () => {
    setCallbackSuccess(false);
    setIsExpertModalOpen(true);
  };

  return (
    <div className="services-page-layout">
      {/* 1. Hero Section matching user's design reference */}
      <ServicesHero
        onBookConsultation={() => handleOpenConsultation()}
        onTalkToExpert={handleOpenExpertModal}
      />

      {/* 2. Key Highlights & Trust Stats Strip (10,000+ Farmers, 50+ Experts, 25+ Specialities, Tamil Nadu & PAN India) */}
      <ServicesHighlights />

      {/* 3. Services Offerings Grid */}
      <section className="services-catalog-section">
        <div className="container">
          <div className="services-section-header">
            <span className="services-badge">
              <Sparkles size={15} /> Comprehensive Farm Solutions
            </span>
            <h2 className="services-section-title">Specialized Agricultural Services</h2>
            <p className="services-section-subtitle">
              Tailored agronomic guidance and modern farming techniques designed to maximize yield, protect crop health, and cut cultivation costs.
            </p>
          </div>

          <div className="services-grid-container">
            {services.map((item) => (
              <div key={item.id} className="services-card">
                <div className="services-card-img-wrapper">
                  <img src={item.image} alt={item.title} />
                  <span className="services-card-tag">{item.tag}</span>
                </div>

                <div className="services-card-body">
                  <div className="services-card-icon-title">
                    <div className="services-card-icon-box">{item.icon}</div>
                    <h3 className="services-card-title">{item.title}</h3>
                  </div>

                  <p className="services-card-desc">{item.description}</p>

                  <ul className="services-card-points">
                    {item.benefits.map((benefit, idx) => (
                      <li key={idx} className="services-card-point">
                        <CheckCircle2 size={16} className="services-card-point-icon" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleOpenConsultation(item.title)}
                    className="services-card-cta-btn"
                  >
                    <span>Request This Service</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Most Requested Service Spotlight: Expert Guidance, Right at Your Farm (On-Field Farm Visit) */}
      <ServicesFarmVisit
        onScheduleVisit={() => handleOpenConsultation('On-Field Crop Consultation & Farm Visit')}
      />

      {/* 5. How We Work - 4 Step Process Roadmap */}
      <section className="services-workflow-section">
        <div className="services-workflow-container">
          <div className="services-section-header">
            <span className="services-badge">
              <Award size={15} /> Clear & Simple Process
            </span>
            <h2 className="services-section-title">How Our Agronomists Support Your Farm</h2>
            <p className="services-section-subtitle">
              From the initial booking to regular field audits, we ensure every farmer receives scientific, actionable, and profitable advice.
            </p>
          </div>

          <div className="services-workflow-grid">
            {/* Step 1 */}
            <div className="services-workflow-step">
              <div className="services-step-number">1</div>
              <div className="services-step-icon">
                <Calendar size={22} />
              </div>
              <h3 className="services-step-title">Book a Visit or Call</h3>
              <p className="services-step-desc">
                Submit your farm details, location, and crop issues online or connect directly with our regional agronomist.
              </p>
            </div>

            {/* Step 2 */}
            <div className="services-workflow-step">
              <div className="services-step-number">2</div>
              <div className="services-step-icon">
                <MapPin size={22} />
              </div>
              <h3 className="services-step-title">On-Field Inspection</h3>
              <p className="services-step-desc">
                Our certified expert visits your field, collects soil/leaf samples, and analyzes crop development conditions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="services-workflow-step">
              <div className="services-step-number">3</div>
              <div className="services-step-icon">
                <FlaskConical size={22} />
              </div>
              <h3 className="services-step-title">Custom Action Plan</h3>
              <p className="services-step-desc">
                Receive a customized nutrition, irrigation, and protection chart with precise product dosages and schedule.
              </p>
            </div>

            {/* Step 4 */}
            <div className="services-workflow-step">
              <div className="services-step-number">4</div>
              <div className="services-step-icon">
                <TrendingUp size={22} />
              </div>
              <h3 className="services-step-title">Continuous Monitoring</h3>
              <p className="services-step-desc">
                Regular follow-up checkups throughout the crop lifecycle to ensure healthy vegetative growth and bumper harvest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Services Banner (CTA) Section */}
      <ServicesCTA
        onBookConsultation={() => handleOpenConsultation()}
        onTalkToExpert={handleOpenExpertModal}
      />

      {/* 6. Interactive Consultation Booking Modal */}
      {isConsultationModalOpen && (
        <div className="services-modal-overlay" onClick={() => setIsConsultationModalOpen(false)}>
          <div className="services-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsConsultationModalOpen(false)}
              className="services-modal-close"
              aria-label="Close modal"
            >
              <X size={22} />
            </button>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    color: '#165B2E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 800 }}>
                  Consultation Booked!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                  Thank you! Our regional agriculture specialist will contact you shortly to confirm the appointment and field visit details.
                </p>
                <button
                  onClick={() => setIsConsultationModalOpen(false)}
                  className="services-btn-primary"
                  style={{ width: '100%' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#165B2E' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#165B2E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Farm Advisory
                  </span>
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Book an Agricultural Consultation
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  Fill in your farming requirements and our agronomists will provide personalized guidance.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setBookingSuccess(true);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Farmer / Business Name *
                    </label>
                    <input required type="text" placeholder="e.g. Ramesh Kumar" className="services-modal-input" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        Phone Number *
                      </label>
                      <input required type="tel" placeholder="+91 98765 43210" className="services-modal-input" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        Farm Size (Acres)
                      </label>
                      <input type="number" placeholder="e.g. 5" className="services-modal-input" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Service Needed *
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="services-modal-input"
                    >
                      <option value="Soil Health & Nutrient Audit">Soil Health & Nutrient Audit</option>
                      <option value="Precision Crop Protection & Pest Shield">Precision Crop Protection & Pest Shield</option>
                      <option value="Smart Drip & Irrigation Optimization">Smart Drip & Irrigation Optimization</option>
                      <option value="Organic Transition & Certification">Organic Transition & Certification</option>
                      <option value="Yield Maximization & Seed Consulting">Yield Maximization & Seed Consulting</option>
                      <option value="Farm Mechanization & Drone Spraying">Farm Mechanization & Drone Spraying</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        Current Crops
                      </label>
                      <input type="text" placeholder="e.g. Cotton, Maize, Paddy" className="services-modal-input" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        Preferred Date
                      </label>
                      <input type="date" className="services-modal-input" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="services-btn-primary"
                    style={{ marginTop: '0.75rem', width: '100%', gap: '0.5rem' }}
                  >
                    <Send size={16} /> Confirm Consultation Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Talk to Expert Quick Callback Modal */}
      {isExpertModalOpen && (
        <div className="services-modal-overlay" onClick={() => setIsExpertModalOpen(false)}>
          <div className="services-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsExpertModalOpen(false)}
              className="services-modal-close"
              aria-label="Close modal"
            >
              <X size={22} />
            </button>

            {callbackSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    color: '#165B2E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <PhoneCall size={32} />
                </div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 800 }}>
                  Call Request Received!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                  Our agronomist will call you back within 15 minutes during working hours (8:00 AM – 7:00 PM).
                </p>
                <button
                  onClick={() => setIsExpertModalOpen(false)}
                  className="services-btn-primary"
                  style={{ width: '100%' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#165B2E' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#165B2E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Instant Support
                  </span>
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Talk to an Agriculture Expert
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  Get immediate advice on crop symptoms, pest emergencies, or dosage guidance.
                </p>

                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <Clock size={20} style={{ color: '#165B2E', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.88rem', color: '#165B2E', fontWeight: 600 }}>
                    Helpline Active: Call us directly at <a href="tel:+919876543210" style={{ color: '#165B2E', textDecoration: 'underline' }}>+91 98765 43210</a> or request a callback below.
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCallbackSuccess(true);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Your Name *
                    </label>
                    <input required type="text" placeholder="e.g. Suresh Patel" className="services-modal-input" />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Mobile Number *
                    </label>
                    <input required type="tel" placeholder="+91 98765 43210" className="services-modal-input" />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Brief Crop Issue / Question
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Yellowing leaves in paddy crop, need urgent spray recommendation"
                      className="services-modal-input"
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="services-btn-primary"
                    style={{ marginTop: '0.5rem', width: '100%', gap: '0.5rem' }}
                  >
                    <PhoneCall size={16} /> Request Free Callback
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
