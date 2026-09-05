import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Calendar,
  Layers,
  Sparkles,
  FlaskConical,
  Droplets,
  ShieldCheck,
  Scissors,
  TrendingUp,
  Calculator,
  Wheat,
  Warehouse,
  Phone,
  MessageSquare,
  Video,
  MapPin,
  CalendarDays,
  CheckCircle2,
  Upload,
  FileText,
  Plus,
  Minus,
  ArrowRight,
  X,
  PhoneCall,
  Clock,
  UserCheck,
  User,
} from 'lucide-react';
import './FarmConsultancyPage.css';

// Assets
import heroConsultImg from '../assets/farm-consult-hero.jpg';
import aboutConsultImg from '../assets/farm-consult-about.jpg';
import cropConditionImg from '../assets/crop-monitoring.jpg';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const FarmConsultancyPage: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    farmerName: '',
    mobileNumber: '',
    location: '',
    cropVariety: '',
    farmSize: '',
    growthStage: '',
    mainConcern: '',
    previousTreatments: '',
    consultationMode: 'Phone Consultation',
    preferredLanguage: 'Tamil',
    preferredDateTime: '',
    termsAgreed: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [expertCallbackSuccess, setExpertCallbackSuccess] = useState(false);
  const [expertPhone, setExpertPhone] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 12 Expert Support Modules
  const serviceModules = [
    {
      id: 'crop-variety-selection',
      title: 'Crop & Variety Selection',
      icon: <Sprout size={24} />,
      desc: 'Match climate, soil pH and local market rates.',
    },
    {
      id: 'seasonal-crop-planning',
      title: 'Seasonal Crop-Planning',
      icon: <Calendar size={24} />,
      desc: 'Stage-by-stage roadmap from sowing to harvest.',
    },
    {
      id: 'soil-health-improvement',
      title: 'Soil-Health Improvement',
      icon: <Layers size={24} />,
      desc: 'Organic matter boosting, salinity & acidity balance.',
    },
    {
      id: 'seed-planting',
      title: 'Seed & Planting',
      icon: <Sparkles size={24} />,
      desc: 'Seed treatment, germination test & optimal spacing.',
    },
    {
      id: 'nutrient-scheduling',
      title: 'Nutrient Scheduling',
      icon: <FlaskConical size={24} />,
      desc: 'Tailored basal and foliar NPK + micronutrient doses.',
    },
    {
      id: 'irrigation-planning',
      title: 'Irrigation Planning',
      icon: <Droplets size={24} />,
      desc: 'Moisture retention, irrigation intervals and fertigation.',
    },
    {
      id: 'pest-disease-management',
      title: 'Pest & Disease Management',
      icon: <ShieldCheck size={24} />,
      desc: 'Early biological and chemical curative treatments.',
    },
    {
      id: 'weed-management',
      title: 'Weed Management',
      icon: <Scissors size={24} />,
      desc: 'Pre & post-emergence weed control without crop shock.',
    },
    {
      id: 'yield-improvement',
      title: 'Yield Improvement',
      icon: <TrendingUp size={24} />,
      desc: 'Canopy management, flower retention and fruit sizing.',
    },
    {
      id: 'input-cost-optimisation',
      title: 'Input-Cost Optimisation',
      icon: <Calculator size={24} />,
      desc: 'Cut wasteful chemical spray expenditure.',
    },
    {
      id: 'harvest-planning',
      title: 'Harvest Planning',
      icon: <Wheat size={24} />,
      desc: 'Optimal maturity index, timing and moisture checks.',
    },
    {
      id: 'post-harvest-guidance',
      title: 'Post-Harvest Guidance',
      icon: <Warehouse size={24} />,
      desc: 'Sorting, grading, storage loss prevention and selling.',
    },
  ];

  // 6 Consultation Modes
  const consultationModes = [
    {
      id: 'Phone Consultation',
      title: 'Phone Consultation',
      desc: 'Talk directly with our agriculture expert over the phone.',
      icon: <Phone size={24} />,
      recommended: false,
    },
    {
      id: 'WhatsApp Consultation',
      title: 'WhatsApp Consultation',
      desc: 'Share your queries and get expert answers over chat.',
      icon: <MessageSquare size={24} />,
      recommended: false,
    },
    {
      id: 'Video Consultation',
      title: 'Video Consultation',
      desc: 'Face-to-face consultation from the comfort of your home.',
      icon: <Video size={24} />,
      recommended: false,
    },
    {
      id: 'Farm Visit',
      title: 'Farm Visit',
      desc: 'Expert visits your farm, studies conditions and guides you.',
      icon: <MapPin size={24} />,
      recommended: true,
    },
    {
      id: 'Seasonal Advisory Plan',
      title: 'Seasonal Advisory Plan',
      desc: 'Get crop-wise advice for the entire growing season.',
      icon: <CalendarDays size={24} />,
      recommended: false,
    },
    {
      id: 'Monthly Farm-Support Plan',
      title: 'Monthly Farm-Support Plan',
      desc: 'Ongoing expert support to guide your farming every month.',
      icon: <ShieldCheck size={24} />,
      recommended: false,
    },
  ];

  // 7 Workflow Steps
  const workflowSteps = [
    {
      number: '1',
      title: 'Select Consultation',
      desc: 'Choose the type of consultation that suits you.',
    },
    {
      number: '2',
      title: 'Submit Farm Information',
      desc: 'Share details about your farm, crop and current condition.',
    },
    {
      number: '3',
      title: 'Upload Crop Photos',
      desc: 'Upload clear photos of your crop and field condition.',
    },
    {
      number: '4',
      title: 'Choose Consultation Mode',
      desc: 'Pick phone, video, visit or other preferred mode.',
    },
    {
      number: '5',
      title: 'Speak with an Expert',
      desc: 'Discuss your concerns and get expert advice.',
    },
    {
      number: '6',
      title: 'Receive Action Plan',
      desc: 'Get a practical plan with clear recommendations.',
    },
    {
      number: '7',
      title: 'Ask Follow-Up Questions',
      desc: 'Stay connected and get support when needed.',
    },
  ];

  // FAQs
  const faqs: FaqItem[] = [
    {
      id: 1,
      question: 'Who provides the consultation?',
      answer:
        'Our consultations are conducted by certified agronomists, entomologists, plant pathologists, and experienced agricultural field specialists with extensive regional crop expertise.',
    },
    {
      id: 2,
      question: 'Will I receive a written recommendation?',
      answer:
        'Yes! After each consultation, you will receive a digital Farm Action Plan detailing crop nutrition schedules, exact product dosages, irrigation timings, and pest prevention steps on WhatsApp and email.',
    },
    {
      id: 3,
      question: 'Can I consult an expert through WhatsApp?',
      answer:
        'Yes, you can share clear photographs of your crops, leaves, roots, or soil condition on WhatsApp, and discuss actionable solutions directly with our dedicated agronomists.',
    },
    {
      id: 4,
      question: 'Can I ask follow-up questions?',
      answer:
        'Yes! All consultations include free follow-up support to review progress, verify symptom recovery, and fine-tune nutrient doses after application.',
    },
    {
      id: 5,
      question: 'Is a farm visit available in my location?',
      answer:
        'On-field farm visits are currently active across Tamil Nadu, Karnataka, Andhra Pradesh, and Telangana, and rapidly expanding across other agricultural regions.',
    },
    {
      id: 6,
      question: 'Is seasonal consultancy available?',
      answer:
        'Yes! Our Seasonal Advisory Plan provides stage-by-stage guidance from sowing to harvest with dedicated crop calendar reminders and weekly health audits.',
    },
  ];

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Submit Handler
  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert('Please agree to share information with AgriEra experts to continue.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleExpertCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expertPhone || expertPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setExpertCallbackSuccess(true);
  };

  const scrollToConsultForm = () => {
    const el = document.getElementById('consultancy-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToModes = () => {
    const el = document.getElementById('consultation-modes-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectModeAndScroll = (modeName: string) => {
    setFormData((prev) => ({ ...prev, consultationMode: modeName }));
    scrollToConsultForm();
  };

  const toggleFaq = (id: number) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="consult-dev-page">
      {/* 1. Breadcrumb + Hero Banner */}
      <section
        className="consult-dev-hero"
        style={{ '--consult-dev-mobile-image': `url(${heroConsultImg})` } as React.CSSProperties}
      >
        <div className="consult-dev-hero-container">
          {/* Left Hero Content */}
          <div className="consult-dev-hero-content">
            <nav className="consult-dev-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/services">Services</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Farm Consultancy</span>
            </nav>

            <h1 className="consult-dev-hero-title">
              Expert Guidance for Better Farming Decisions
            </h1>

            <p className="consult-dev-hero-desc">
              Get practical, crop-specific advice for planning, nutrition, irrigation,
              crop protection, cost control and yield improvement.
            </p>

            <div className="consult-dev-hero-actions">
              <button
                type="button"
                onClick={scrollToConsultForm}
                className="consult-dev-btn-primary"
              >
                <span>Consult an Agriculture Expert</span>
                <ArrowRight size={17} />
              </button>
              <button
                type="button"
                onClick={scrollToModes}
                className="consult-dev-btn-secondary"
              >
                <span>View Consultation Modes</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="consult-dev-hero-media">
            <div className="consult-dev-hero-img-card">
              <img
                src={heroConsultImg}
                alt="Agriculture Expert Discussing Farm Solutions with Farmer in Field"
                className="consult-dev-hero-img"
              />
              <div className="consult-dev-hero-badge">
                <Sprout size={18} style={{ color: '#88CF3A' }} />
                <div>
                  <strong>Certified Agronomist Guidance</strong>
                  <span>Field Diagnostics & Stage-Wise Action Plans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Farm Consultancy */}
      <section className="consult-dev-about-section">
        <div className="consult-dev-about-container">
          {/* Left Column: Image of Inspection */}
          <div className="consult-dev-about-media">
            <div className="consult-dev-about-img-wrap">
              <img
                src={aboutConsultImg}
                alt="Agronomist Crouching and Examining Crop Seedling in Fertile Soil"
                className="consult-dev-about-img"
              />
            </div>
          </div>

          {/* Right Column: Text & 3 Feature Pillars */}
          <div className="consult-dev-about-content">
            <h2 className="consult-dev-about-title">About Farm Consultancy</h2>
            <p className="consult-dev-about-desc">
              Our agriculture experts study your crop, field condition, current practices and
              goals in detail before recommending an action plan. You receive practical,
              crop-specific guidance that you can apply confidently for better yield and profitability.
            </p>

            <div className="consult-dev-pillars-grid">
              {/* Pillar 1 */}
              <div className="consult-dev-pillar-card">
                <div className="consult-dev-pillar-icon">
                  <UserCheck size={24} />
                </div>
                <h3 className="consult-dev-pillar-title">Qualified Experts</h3>
                <p className="consult-dev-pillar-text">
                  Experienced agronomists with strong field knowledge and crop expertise.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="consult-dev-pillar-card">
                <div className="consult-dev-pillar-icon">
                  <Sprout size={24} />
                </div>
                <h3 className="consult-dev-pillar-title">Crop-Specific Advice</h3>
                <p className="consult-dev-pillar-text">
                  Solutions tailored to your crop, soil, climate and farming practices.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="consult-dev-pillar-card">
                <div className="consult-dev-pillar-icon">
                  <FileText size={24} />
                </div>
                <h3 className="consult-dev-pillar-title">Practical Action Plans</h3>
                <p className="consult-dev-pillar-text">
                  Clear, easy-to-follow recommendations you can implement with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Expert Support Across Every Stage of Farming (12 Modules) */}
      <section className="consult-dev-modules-section">
        <div className="consult-dev-modules-container">
          <div className="consult-dev-section-header">
            <div className="consult-dev-leaf-icon">
              <Sprout size={22} />
            </div>
            <h2 className="consult-dev-section-title">
              Expert Support Across Every Stage of Farming
            </h2>
          </div>

          <div className="consult-dev-modules-grid">
            {serviceModules.map((module) => (
              <div key={module.id} className="consult-dev-module-card">
                <div className="consult-dev-module-icon-box">{module.icon}</div>
                <h3 className="consult-dev-module-title">{module.title}</h3>
                <p className="consult-dev-module-desc">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Choose How You Want to Consult (6 Modes) */}
      <section id="consultation-modes-section" className="consult-dev-modes-section">
        <div className="consult-dev-modes-container">
          <div className="consult-dev-section-header">
            <h2 className="consult-dev-section-title">
              Choose How You Want to Consult
            </h2>
          </div>

          <div className="consult-dev-modes-grid">
            {consultationModes.map((mode) => (
              <div
                key={mode.id}
                className={`consult-dev-mode-card ${
                  formData.consultationMode === mode.id ? 'active' : ''
                }`}
                onClick={() => selectModeAndScroll(mode.id)}
              >
                {mode.recommended && (
                  <span className="consult-dev-mode-badge">Recommended</span>
                )}
                <div className="consult-dev-mode-icon-box">{mode.icon}</div>
                <h3 className="consult-dev-mode-title">{mode.title}</h3>
                <p className="consult-dev-mode-desc">{mode.desc}</p>
                <div className="consult-dev-mode-action">
                  <span>Select & Book</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Simple Steps to Expert Farm Guidance (7 Steps Process Roadmap) */}
      <section className="consult-dev-workflow-section">
        <div className="consult-dev-workflow-container">
          <div className="consult-dev-section-header">
            <div className="consult-dev-leaf-icon">
              <Sprout size={22} />
            </div>
            <h2 className="consult-dev-section-title">
              Simple Steps to Expert Farm Guidance
            </h2>
          </div>

          <div className="consult-dev-timeline-track">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="consult-dev-step-item">
                <div className="consult-dev-step-circle">{step.number}</div>
                <h4 className="consult-dev-step-heading">{step.title}</h4>
                <p className="consult-dev-step-text">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Confident Decisions & Interactive Action Plan Preview Card */}
      <section className="consult-dev-reasons-section">
        <div className="consult-dev-reasons-container">
          {/* Left Column: Benefits */}
          <div className="consult-dev-reasons-left">
            <h2 className="consult-dev-reasons-title">
              Confident Decisions.<br />Healthier Crops.
            </h2>
            <div className="consult-dev-title-divider" />

            <ul className="consult-dev-benefits-list">
              <li className="consult-dev-benefit-item">
                <div className="consult-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Crop-Specific Recommendations</span>
              </li>
              <li className="consult-dev-benefit-item">
                <div className="consult-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Timely Problem Identification</span>
              </li>
              <li className="consult-dev-benefit-item">
                <div className="consult-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Better Use of Agricultural Inputs</span>
              </li>
              <li className="consult-dev-benefit-item">
                <div className="consult-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Reduced Avoidable Expenses</span>
              </li>
              <li className="consult-dev-benefit-item">
                <div className="consult-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Improved Crop Planning</span>
              </li>
              <li className="consult-dev-benefit-item">
                <div className="consult-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Continued Expert Support</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Visual Interactive Action Plan Card */}
          <div className="consult-dev-reasons-right">
            <div className="consult-dev-plan-card">
              {/* Header Bar */}
              <div className="consult-dev-plan-header">
                <div>
                  <h3 className="consult-dev-plan-title">Your Farm Action Plan</h3>
                </div>
                <div className="consult-dev-expert-tag">
                  <div className="consult-dev-expert-avatar">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="consult-dev-expert-name">
                      <strong>Rahul Sharma</strong>
                      <CheckCircle2 size={13} className="verified-check" />
                    </div>
                    <span className="consult-dev-expert-role">Agriculture Specialist</span>
                  </div>
                </div>
              </div>

              {/* 3 Grid Boxes */}
              <div className="consult-dev-plan-grid">
                {/* 1. Crop Condition */}
                <div className="consult-dev-plan-box">
                  <h4 className="consult-dev-box-title">Crop Condition</h4>
                  <div className="consult-dev-crop-badge-row">
                    <img
                      src={cropConditionImg}
                      alt="Crop Leaf Condition"
                      className="consult-dev-crop-thumb"
                    />
                    <div>
                      <span className="consult-dev-status-pill">Good</span>
                      <p className="consult-dev-crop-sub">Overall Condition: Good</p>
                      <p className="consult-dev-crop-sub">Stage: Vegetative</p>
                    </div>
                  </div>
                </div>

                {/* 2. Priority Actions */}
                <div className="consult-dev-plan-box">
                  <h4 className="consult-dev-box-title">Priority Actions</h4>
                  <ul className="consult-dev-actions-list">
                    <li>
                      <CheckCircle2 size={13} className="action-check" />
                      <span>Apply balanced nutrition</span>
                    </li>
                    <li>
                      <CheckCircle2 size={13} className="action-check" />
                      <span>Monitor for early pest signs</span>
                    </li>
                    <li>
                      <CheckCircle2 size={13} className="action-check" />
                      <span>Improve soil organic matter</span>
                    </li>
                    <li>
                      <CheckCircle2 size={13} className="action-check" />
                      <span>Ensure proper irrigation</span>
                    </li>
                  </ul>
                </div>

                {/* 3. Nutrition Schedule */}
                <div className="consult-dev-plan-box">
                  <h4 className="consult-dev-box-title">Nutrition Schedule</h4>
                  <div className="consult-dev-nutrition-list">
                    <div className="consult-dev-nut-item">
                      <span>Urea (46% N)</span>
                      <strong>50 kg/acre</strong>
                    </div>
                    <div className="consult-dev-nut-item">
                      <span>NPK 19:19:19</span>
                      <strong>25 kg/acre</strong>
                    </div>
                    <div className="consult-dev-nut-item">
                      <span>Zinc Sulphate</span>
                      <strong>10 kg/acre</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Details Row */}
              <div className="consult-dev-plan-footer">
                <div className="consult-dev-footer-col">
                  <div className="consult-dev-footer-label">
                    <Droplets size={14} color="#164627" />
                    <strong>Irrigation Advice</strong>
                  </div>
                  <p className="consult-dev-footer-text">
                    Irrigate once in 3–4 days based on soil moisture.
                  </p>
                  <span className="consult-dev-next-badge">Next Irrigation: 2 Days Later</span>
                </div>

                <div className="consult-dev-footer-col">
                  <div className="consult-dev-footer-label">
                    <Calendar size={14} color="#164627" />
                    <strong>Follow-Up Date</strong>
                  </div>
                  <p className="consult-dev-footer-text">
                    Next Review: <strong>20 May 2025</strong>
                  </p>
                  <span className="consult-dev-mode-tag">Mode: Phone Consultation</span>
                </div>

                <div className="consult-dev-footer-col">
                  <div className="consult-dev-footer-label">
                    <strong>Note</strong>
                  </div>
                  <p className="consult-dev-footer-text">
                    Follow the recommended practices and keep us updated for the best results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Book Your Agriculture Consultation (Form Section) */}
      <section id="consultancy-form-section" className="consult-dev-consultation-section">
        <div className="consult-dev-consultation-container">
          <div className="consult-dev-consultation-heading-wrap">
            <h2 className="consult-dev-form-main-title">
              Book Your Agriculture Consultation
            </h2>
            <p className="consult-dev-form-main-desc">
              Fill in your crop and farm details and our dedicated agronomy team will connect with you.
            </p>
          </div>

          <div className="consult-dev-form-layout-grid">
            {/* Left Card: Full Form */}
            <div className="consult-dev-form-card">
              {isSubmitted ? (
                <div className="consult-dev-success-state">
                  <div className="consult-dev-success-icon-wrap">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="consult-dev-success-title">
                    Consultation Request Confirmed!
                  </h3>
                  <p className="consult-dev-success-desc">
                    Thank you, <strong>{formData.farmerName || 'Farmer'}</strong>. Your consultation request for{' '}
                    <strong>{formData.cropVariety || 'your crop'}</strong> ({formData.consultationMode}) has been booked.
                    Our designated agronomist will connect with you on <strong>{formData.mobileNumber}</strong> in{' '}
                    <strong>{formData.preferredLanguage}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        farmerName: '',
                        mobileNumber: '',
                        location: '',
                        cropVariety: '',
                        farmSize: '',
                        growthStage: '',
                        mainConcern: '',
                        previousTreatments: '',
                        consultationMode: 'Phone Consultation',
                        preferredLanguage: 'Tamil',
                        preferredDateTime: '',
                        termsAgreed: false,
                      });
                      setUploadedFiles([]);
                    }}
                    className="consult-dev-btn-primary"
                    style={{ margin: '0 auto', display: 'inline-flex' }}
                  >
                    Book Another Consultation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitConsultation} className="consult-dev-form">
                  {/* Row 1: Farmer Name, Mobile Number, Location */}
                  <div className="consult-dev-row-3">
                    <div className="consult-dev-field">
                      <label className="consult-dev-label">Farmer Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.farmerName}
                        onChange={(e) =>
                          setFormData({ ...formData, farmerName: e.target.value })
                        }
                        className="consult-dev-input"
                      />
                    </div>

                    <div className="consult-dev-field">
                      <label className="consult-dev-label">Mobile Number *</label>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        placeholder="Enter 10-digit mobile number"
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })
                        }
                        className="consult-dev-input"
                      />
                    </div>

                    <div className="consult-dev-field">
                      <label className="consult-dev-label">Location *</label>
                      <div className="consult-dev-input-with-icon">
                        <input
                          required
                          type="text"
                          placeholder="Village / City / District"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({ ...formData, location: e.target.value })
                          }
                          className="consult-dev-input"
                        />
                        <MapPin size={16} className="input-loc-icon" />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Crop and Variety, Farm Size, Current Growth Stage */}
                  <div className="consult-dev-row-3">
                    <div className="consult-dev-field">
                      <label className="consult-dev-label">Crop and Variety *</label>
                      <select
                        required
                        value={formData.cropVariety}
                        onChange={(e) =>
                          setFormData({ ...formData, cropVariety: e.target.value })
                        }
                        className="consult-dev-input consult-dev-select"
                      >
                        <option value="">Select crop and variety</option>
                        <option value="Tomato / Vegetable">Tomato / Vegetable</option>
                        <option value="Chilli / Capsicum">Chilli / Capsicum</option>
                        <option value="Banana">Banana</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Sugarcane">Sugarcane</option>
                        <option value="Coconut / Arecanut">Coconut / Arecanut</option>
                        <option value="Paddy / Rice">Paddy / Rice</option>
                        <option value="Fruit Orchard">Fruit Orchard</option>
                        <option value="Other Commercial Crop">Other Commercial Crop</option>
                      </select>
                    </div>

                    <div className="consult-dev-field">
                      <label className="consult-dev-label">Farm Size *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g., 2 Acres"
                        value={formData.farmSize}
                        onChange={(e) =>
                          setFormData({ ...formData, farmSize: e.target.value })
                        }
                        className="consult-dev-input"
                      />
                    </div>

                    <div className="consult-dev-field">
                      <label className="consult-dev-label">Current Growth Stage *</label>
                      <select
                        required
                        value={formData.growthStage}
                        onChange={(e) =>
                          setFormData({ ...formData, growthStage: e.target.value })
                        }
                        className="consult-dev-input consult-dev-select"
                      >
                        <option value="">Select growth stage</option>
                        <option value="Sowing / Nursery / Seedling">Sowing / Nursery / Seedling</option>
                        <option value="Vegetative Stage">Vegetative Stage</option>
                        <option value="Flowering Stage">Flowering Stage</option>
                        <option value="Fruit / Pod Development">Fruit / Pod Development</option>
                        <option value="Maturity / Pre-Harvest">Maturity / Pre-Harvest</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Main Farming Concern */}
                  <div className="consult-dev-field">
                    <label className="consult-dev-label">Main Farming Concern *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Describe your main concern in detail (e.g., leaf yellowing, pest infestation, poor yield, fertilizer advice)..."
                      value={formData.mainConcern}
                      onChange={(e) =>
                        setFormData({ ...formData, mainConcern: e.target.value })
                      }
                      className="consult-dev-input consult-dev-textarea"
                    />
                  </div>

                  {/* Row 4: Previous Products or Treatments Used */}
                  <div className="consult-dev-field">
                    <label className="consult-dev-label">Previous Products or Treatments Used</label>
                    <input
                      type="text"
                      placeholder="Mention products, fertilizers, pesticides or other treatments used"
                      value={formData.previousTreatments}
                      onChange={(e) =>
                        setFormData({ ...formData, previousTreatments: e.target.value })
                      }
                      className="consult-dev-input"
                    />
                  </div>

                  {/* Row 5: Upload Crop Photos */}
                  <div className="consult-dev-field">
                    <label className="consult-dev-label">Upload Crop Photos</label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`consult-dev-upload-box ${
                        isDragOver ? 'drag-over' : ''
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                      />
                      <div className="consult-dev-upload-icon">
                        <Upload size={24} />
                      </div>
                      <div className="consult-dev-upload-text">
                        <p className="consult-dev-upload-prompt">
                          Drag & drop images here or <span>click to upload</span>
                        </p>
                        <p className="consult-dev-upload-hint">You can upload up to 5 photos (JPG, PNG)</p>
                      </div>
                    </div>

                    {/* Uploaded Files Chips */}
                    {uploadedFiles.length > 0 && (
                      <div className="consult-dev-file-list">
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="consult-dev-file-item">
                            <FileText size={14} />
                            <span className="consult-dev-file-name">{file.name}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(idx);
                              }}
                              className="consult-dev-file-remove"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Row 6: Consultation Mode, Preferred Language, Date and Time */}
                  <div className="consult-dev-row-3">
                    <div className="consult-dev-field">
                      <label className="consult-dev-label">Preferred Consultation Mode *</label>
                      <select
                        value={formData.consultationMode}
                        onChange={(e) =>
                          setFormData({ ...formData, consultationMode: e.target.value })
                        }
                        className="consult-dev-input consult-dev-select"
                      >
                        <option value="Phone Consultation">Phone Consultation</option>
                        <option value="WhatsApp Consultation">WhatsApp Consultation</option>
                        <option value="Video Consultation">Video Consultation</option>
                        <option value="Farm Visit">Farm Visit</option>
                        <option value="Seasonal Advisory Plan">Seasonal Advisory Plan</option>
                        <option value="Monthly Farm-Support Plan">Monthly Farm-Support Plan</option>
                      </select>
                    </div>

                    <div className="consult-dev-field">
                      <label className="consult-dev-label">Preferred Language *</label>
                      <select
                        value={formData.preferredLanguage}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredLanguage: e.target.value })
                        }
                        className="consult-dev-input consult-dev-select"
                      >
                        <option value="Tamil">Tamil</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Kannada">Kannada</option>
                        <option value="Malayalam">Malayalam</option>
                      </select>
                    </div>

                    <div className="consult-dev-field">
                      <label className="consult-dev-label">Preferred Date and Time</label>
                      <input
                        type="datetime-local"
                        value={formData.preferredDateTime}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredDateTime: e.target.value })
                        }
                        className="consult-dev-input"
                      />
                    </div>
                  </div>

                  {/* Row 7: Consent Checkbox */}
                  <div className="consult-dev-consent-row">
                    <label className="consult-dev-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.termsAgreed}
                        onChange={(e) =>
                          setFormData({ ...formData, termsAgreed: e.target.checked })
                        }
                        className="consult-dev-checkbox"
                      />
                      <span>
                        I agree to share the provided information with <strong>AgriEra</strong> experts for consultation and follow-up.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="consult-dev-btn-submit"
                  >
                    {isSubmitting ? (
                      <span>Assigning Agronomist...</span>
                    ) : (
                      <>
                        <span>Consult an Agriculture Expert</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Card: What Happens Next? */}
            <div className="consult-dev-next-card">
              <h3 className="consult-dev-next-title">What Happens Next?</h3>

              <div className="consult-dev-next-steps">
                {/* Step 1 */}
                <div className="consult-dev-next-item">
                  <div className="consult-dev-next-badge-num">1</div>
                  <div>
                    <h4 className="consult-dev-next-heading">Expert Assignment</h4>
                    <p className="consult-dev-next-desc">
                      We assign the most suitable agriculture expert for your consultation.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="consult-dev-next-item">
                  <div className="consult-dev-next-badge-num">2</div>
                  <div>
                    <h4 className="consult-dev-next-heading">Consultation Confirmation</h4>
                    <p className="consult-dev-next-desc">
                      You will receive a confirmation with your consultation details and time.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="consult-dev-next-item">
                  <div className="consult-dev-next-badge-num">3</div>
                  <div>
                    <h4 className="consult-dev-next-heading">Expert Discussion</h4>
                    <p className="consult-dev-next-desc">
                      Connect with the expert through your chosen mode and discuss your concerns.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="consult-dev-next-item">
                  <div className="consult-dev-next-badge-num">4</div>
                  <div>
                    <h4 className="consult-dev-next-heading">Written Action Plan & Follow-Up</h4>
                    <p className="consult-dev-next-desc">
                      Receive a clear action plan and continued support for better results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="consult-dev-faqs-section">
        <div className="consult-dev-faqs-container">
          <h2 className="consult-dev-faqs-title">Frequently Asked Questions</h2>

          <div className="consult-dev-faqs-grid">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`consult-dev-faq-card ${isOpen ? 'active' : ''}`}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div className="consult-dev-faq-question-row">
                    <h3 className="consult-dev-faq-question">{faq.question}</h3>
                    <div className="consult-dev-faq-toggle">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="consult-dev-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA Banner */}
      <section className="consult-dev-bottom-banner">
        <div className="consult-dev-bottom-container">
          <div className="consult-dev-bottom-content">
            <h3 className="consult-dev-bottom-title">
              Get Expert Support for Your Next Farming Decision
            </h3>
            <p className="consult-dev-bottom-desc">
              Talk to our agriculture experts and get practical solutions for better yield and profits.
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToConsultForm}
            className="consult-dev-bottom-btn"
          >
            <span>Consult an Agriculture Expert</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* Talk to Expert Modal */}
      {isExpertModalOpen && (
        <div
          className="consult-dev-modal-overlay"
          onClick={() => setIsExpertModalOpen(false)}
        >
          <div
            className="consult-dev-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsExpertModalOpen(false)}
              className="consult-dev-modal-close"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {expertCallbackSuccess ? (
              <div className="consult-dev-modal-success">
                <div className="consult-dev-modal-icon-circle">
                  <PhoneCall size={32} />
                </div>
                <h3 className="consult-dev-modal-title">Callback Scheduled!</h3>
                <p className="consult-dev-modal-desc">
                  Thank you! Our senior agronomist will call you on{' '}
                  <strong>{expertPhone}</strong> within 15 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setIsExpertModalOpen(false)}
                  className="consult-dev-btn-primary"
                  style={{ width: '100%' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="consult-dev-modal-header">
                  <div className="consult-dev-modal-tag">Instant Callback</div>
                  <h3 className="consult-dev-modal-title">Talk to a Crop Agronomist</h3>
                  <p className="consult-dev-modal-desc">
                    Get immediate assistance on plant health, pest control, and fertilizer scheduling.
                  </p>
                </div>

                <form onSubmit={handleExpertCallbackSubmit} className="consult-dev-modal-form">
                  <div className="consult-dev-field">
                    <label className="consult-dev-label">Mobile Number *</label>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={expertPhone}
                      onChange={(e) =>
                        setExpertPhone(e.target.value.replace(/\D/g, ''))
                      }
                      className="consult-dev-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="consult-dev-btn-submit"
                    style={{ marginTop: '0.75rem' }}
                  >
                    <PhoneCall size={16} />
                    <span>Request Immediate Call</span>
                  </button>

                  <div className="consult-dev-modal-footer-note">
                    <Clock size={14} />
                    <span>Available Mon - Sat (8:00 AM - 7:00 PM)</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmConsultancyPage;
