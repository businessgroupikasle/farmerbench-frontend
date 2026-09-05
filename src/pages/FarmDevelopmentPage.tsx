import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Search,
  FlaskConical,
  Tractor,
  Layers,
  Waves,
  CloudRain,
  Route,
  ShieldCheck,
  Calculator,
  Compass,
  CheckCircle2,
  Phone,
  Upload,
  FileText,
  Plus,
  Minus,
  ArrowRight,
  X,
  PhoneCall,
  Clock,
} from 'lucide-react';
import './FarmDevelopmentPage.css';

// Imported Assets
import heroAgronomistImg from '../assets/farm-dev-hero.jpg';
import aboutAerialImg from '../assets/farm-dev-about.jpg';
import masterPlanImg from '../assets/farm-dev-plan.jpg';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const FarmDevelopmentPage: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    farmerName: '',
    mobileNumber: '',
    location: '',
    pincode: '',
    landArea: '',
    landCondition: '',
    waterSource: '',
    preferredCrops: '',
    budget: '',
    startDate: '',
    additionalNotes: '',
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

  // 10 Service Modules
  const serviceModules = [
    {
      id: 'land-inspection',
      title: 'Land Inspection',
      icon: <Search size={26} />,
      desc: 'Topographical mapping, soil depth evaluation, and boundary survey.',
    },
    {
      id: 'soil-analysis',
      title: 'Soil Analysis',
      icon: <FlaskConical size={26} />,
      desc: 'Comprehensive pH, NPK, organic carbon & micro-nutrient testing.',
    },
    {
      id: 'land-clearing',
      title: 'Land Clearing',
      icon: <Tractor size={26} />,
      desc: 'Heavy vegetation removal, de-stumping, and rock excavation.',
    },
    {
      id: 'farm-layout',
      title: 'Farm Layout',
      icon: <Layers size={26} />,
      desc: 'Architectural zoning, crop plot demarcation, and utility planning.',
    },
    {
      id: 'levelling-drainage',
      title: 'Levelling & Drainage',
      icon: <Waves size={26} />,
      desc: 'Precision laser grading, contour bunding, and storm drainage channels.',
    },
    {
      id: 'crop-selection',
      title: 'Crop Selection',
      icon: <Sprout size={26} />,
      desc: 'High-yield climate & soil-compatible commercial crop recommendations.',
    },
    {
      id: 'irrigation-planning',
      title: 'Irrigation Planning',
      icon: <CloudRain size={26} />,
      desc: 'Custom micro-drip, sprinkler systems, fertigation and pump sizing.',
    },
    {
      id: 'roads-pathways',
      title: 'Roads & Pathways',
      icon: <Route size={26} />,
      desc: 'All-weather farm tractor roads, internal paths, and turn-points.',
    },
    {
      id: 'fencing-guidance',
      title: 'Fencing Guidance',
      icon: <ShieldCheck size={26} />,
      desc: 'Solar fencing, chain-link, barbed wire, and live hedge perimeter setup.',
    },
    {
      id: 'budget-planning',
      title: 'Budget Planning',
      icon: <Calculator size={26} />,
      desc: 'Transparent phase-wise capital expenditure & ROI financial roadmap.',
    },
  ];

  // 6 Roadmap Steps
  const workflowSteps = [
    {
      number: '1',
      title: 'Submit Land Details',
      desc: 'Share your land information and goals with us.',
    },
    {
      number: '2',
      title: 'Expert Inspection',
      desc: 'Our team visits and studies your land thoroughly.',
    },
    {
      number: '3',
      title: 'Development Plan',
      desc: 'We prepare a custom farm development plan.',
    },
    {
      number: '4',
      title: 'Cost & Timeline Review',
      desc: 'Review the cost estimate and development timeline.',
    },
    {
      number: '5',
      title: 'Supervised Development',
      desc: 'We execute with expert supervision and quality checks.',
    },
    {
      number: '6',
      title: 'Progress Monitoring',
      desc: 'We monitor progress and ensure long-term success.',
    },
  ];

  // FAQs
  const faqs: FaqItem[] = [
    {
      id: 1,
      question: 'What is included in farm development?',
      answer:
        'Farm development covers end-to-end site transformation: topographical assessment, soil and water testing, land clearing, precision laser grading, contour bunding, drainage setup, internal farm roads, perimeter fencing, automated drip/sprinkler irrigation, crop zoning, and first-season plantation guidance.',
    },
    {
      id: 2,
      question: 'How long does farm development take?',
      answer:
        'A standard 2 to 10-acre farm development project typically takes between 2 to 5 weeks. The exact timeline depends on initial land condition, topography, the extent of land clearing needed, and chosen irrigation infrastructure.',
    },
    {
      id: 3,
      question: 'Can you develop uncultivated land?',
      answer:
        'Yes, definitely! We specialize in turning barren, rock-strewn, or overgrown uncultivated lands into fertile, high-producing agricultural plots using scientific soil enrichment, deep ploughing, and water conservation engineering.',
    },
    {
      id: 4,
      question: 'Will I receive a cost estimate?',
      answer:
        'Yes. After our team reviews your submitted land details or completes an on-site visit, you will receive a transparent, itemized cost estimate broken down by earthwork, infrastructure, irrigation, and agronomy supervision with zero hidden fees.',
    },
    {
      id: 5,
      question: 'Is a site inspection required?',
      answer:
        'While initial planning can begin with GPS coordinates and photos, an on-field visit by our senior agronomist is essential before heavy machinery deployment to confirm soil depth, gradient slope, and water discharge rates.',
    },
    {
      id: 6,
      question: 'Do you provide continued farm support?',
      answer:
        'Yes! Beyond physical farm development, we provide complete post-development agronomy advisory, custom seasonal crop calendars, disease diagnostic support, and periodic field inspections to safeguard your harvest.',
    },
  ];

  // Handle Drag and Drop
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
  const handleSubmitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert('Please agree to the terms and privacy policy to continue.');
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

  const scrollToAssessmentForm = () => {
    const el = document.getElementById('assessment-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (id: number) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="farm-dev-page">
      {/* 1. Breadcrumb + Hero Banner */}
      <section
        className="farm-dev-hero"
        style={{ '--farm-dev-mobile-image': `url(${heroAgronomistImg})` } as React.CSSProperties}
      >
        <div className="farm-dev-hero-container">
          {/* Left Hero Content */}
          <div className="farm-dev-hero-content">
            <nav className="farm-dev-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/services">Services</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Farm Development</span>
            </nav>

            <h1 className="farm-dev-hero-title">
              Build a Productive Farm from the Ground Up
            </h1>

            <p className="farm-dev-hero-desc">
              Transform your land into a well-planned and productive farm with expert support.
              We assist with land assessment, field layout, soil preparation, irrigation planning
              and crop selection.
            </p>

            <div className="farm-dev-hero-actions">
              <button
                type="button"
                onClick={scrollToAssessmentForm}
                className="farm-dev-btn-primary"
              >
                Request Farm Assessment
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpertCallbackSuccess(false);
                  setIsExpertModalOpen(true);
                }}
                className="farm-dev-btn-secondary"
              >
                <Phone size={17} />
                <span>Talk to an Expert</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="farm-dev-hero-media">
            <div className="farm-dev-hero-img-card">
              <img
                src={heroAgronomistImg}
                alt="Agricultural Agronomist Planning Farm Development on Tablet"
                className="farm-dev-hero-img"
              />
              <div className="farm-dev-hero-badge">
                <Sprout size={18} style={{ color: '#88CF3A' }} />
                <div>
                  <strong>Turnkey Farm Engineering</strong>
                  <span>Scientific Soil & Water Layout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Farm Development */}
      <section className="farm-dev-about-section">
        <div className="farm-dev-about-container">
          {/* Left Column: Aerial Drone Image */}
          <div className="farm-dev-about-media">
            <div className="farm-dev-about-img-wrap">
              <img
                src={aboutAerialImg}
                alt="Aerial view of well-planned farm development with irrigation pond"
                className="farm-dev-about-img"
              />
            </div>
          </div>

          {/* Right Column: Text & 3 Feature Pillars */}
          <div className="farm-dev-about-content">
            <h2 className="farm-dev-about-title">About Farm Development</h2>
            <p className="farm-dev-about-desc">
              Our experts study your land, soil, water availability, climate and farming goals
              before preparing a practical development plan. We ensure your farm is well-structured,
              efficient and ready for long-term productivity.
            </p>

            <div className="farm-dev-pillars-grid">
              {/* Pillar 1 */}
              <div className="farm-dev-pillar-card">
                <div className="farm-dev-pillar-icon">
                  <Compass size={24} />
                </div>
                <h3 className="farm-dev-pillar-title">Expert Planning</h3>
                <p className="farm-dev-pillar-text">
                  Experienced agronomy and farm planning specialists.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="farm-dev-pillar-card">
                <div className="farm-dev-pillar-icon">
                  <FlaskConical size={24} />
                </div>
                <h3 className="farm-dev-pillar-title">Site-Based Advice</h3>
                <p className="farm-dev-pillar-text">
                  Solutions tailored to your land and local conditions.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="farm-dev-pillar-card">
                <div className="farm-dev-pillar-icon">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="farm-dev-pillar-title">End-to-End Support</h3>
                <p className="farm-dev-pillar-text">
                  From planning to execution and ongoing guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Everything Needed to Develop Your Farm (10 Modules) */}
      <section className="farm-dev-modules-section">
        <div className="farm-dev-modules-container">
          <div className="farm-dev-section-header">
            <div className="farm-dev-leaf-icon">
              <Sprout size={20} />
            </div>
            <h2 className="farm-dev-section-title">
              Everything Needed to Develop Your Farm
            </h2>
          </div>

          <div className="farm-dev-modules-grid">
            {serviceModules.map((module) => (
              <div key={module.id} className="farm-dev-module-card">
                <div className="farm-dev-module-icon-box">{module.icon}</div>
                <h3 className="farm-dev-module-title">{module.title}</h3>
                <p className="farm-dev-module-desc">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. From Land Details to a Productive Farm (6 Step Workflow) */}
      <section className="farm-dev-workflow-section">
        <div className="farm-dev-workflow-container">
          <div className="farm-dev-section-header">
            <div className="farm-dev-leaf-icon">
              <Sprout size={20} />
            </div>
            <h2 className="farm-dev-section-title">
              From Land Details to a Productive Farm
            </h2>
          </div>

          <div className="farm-dev-timeline-track">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="farm-dev-step-item">
                <div className="farm-dev-step-circle">{step.number}</div>
                <h4 className="farm-dev-step-heading">{step.title}</h4>
                <p className="farm-dev-step-text">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Farmers Choose Farm Development & Visual Layout Map */}
      <section className="farm-dev-reasons-section">
        <div className="farm-dev-reasons-container">
          {/* Left Column: Reasons & Benefits */}
          <div className="farm-dev-reasons-left">
            <h2 className="farm-dev-reasons-title">
              Why Farmers Choose<br />Farm Development
            </h2>
            <div className="farm-dev-title-divider" />

            <ul className="farm-dev-benefits-list">
              <li className="farm-dev-benefit-item">
                <div className="farm-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Better Land Utilisation</span>
              </li>
              <li className="farm-dev-benefit-item">
                <div className="farm-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Improved Irrigation & Drainage</span>
              </li>
              <li className="farm-dev-benefit-item">
                <div className="farm-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Easier Farm Operations</span>
              </li>
              <li className="farm-dev-benefit-item">
                <div className="farm-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Reduced Resource Wastage</span>
              </li>
              <li className="farm-dev-benefit-item">
                <div className="farm-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Suitable Crop Selection</span>
              </li>
              <li className="farm-dev-benefit-item">
                <div className="farm-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Better Long-Term Productivity</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Visual Layout Map with Overlay Callouts */}
          <div className="farm-dev-reasons-right">
            <div className="farm-dev-plan-wrapper">
              <img
                src={masterPlanImg}
                alt="Agricultural Farm Master Development Plan"
                className="farm-dev-plan-img"
              />

              {/* Callout tags matching the visual design */}
              <div className="farm-dev-tag tag-tree-belt">TREE BELT (BOUNDARY)</div>
              <div className="farm-dev-tag tag-irrigation">IRRIGATION CHANNEL</div>
              <div className="farm-dev-tag tag-crop-zone">CROP ZONE</div>
              <div className="farm-dev-tag tag-veg-zone">VEGETABLE ZONE</div>
              <div className="farm-dev-tag tag-farm-road">FARM ROAD</div>
              <div className="farm-dev-tag tag-water-tank">WATER TANK</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Request a Farm Development Consultation (Form Section) */}
      <section id="assessment-form-section" className="farm-dev-consultation-section">
        <div className="farm-dev-consultation-container">
          <div className="farm-dev-consultation-heading-wrap">
            <h2 className="farm-dev-form-main-title">
              Request a Farm Development Consultation
            </h2>
            <p className="farm-dev-form-main-desc">
              Fill in the details below and our experts will get in touch with a customised plan for your farm.
            </p>
          </div>

          <div className="farm-dev-form-layout-grid">
            {/* Left Card: Full Form */}
            <div className="farm-dev-form-card">
              {isSubmitted ? (
                <div className="farm-dev-success-state">
                  <div className="farm-dev-success-icon-wrap">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="farm-dev-success-title">
                    Assessment Request Submitted!
                  </h3>
                  <p className="farm-dev-success-desc">
                    Thank you, <strong>{formData.farmerName || 'Farmer'}</strong>. Our farm planning agronomist team has received your details for{' '}
                    <strong>{formData.landArea || 'your land'}</strong> in{' '}
                    <strong>{formData.location || 'your location'}</strong>. We will review your site topography and call you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        farmerName: '',
                        mobileNumber: '',
                        location: '',
                        pincode: '',
                        landArea: '',
                        landCondition: '',
                        waterSource: '',
                        preferredCrops: '',
                        budget: '',
                        startDate: '',
                        additionalNotes: '',
                        termsAgreed: false,
                      });
                      setUploadedFiles([]);
                    }}
                    className="farm-dev-btn-primary"
                    style={{ margin: '0 auto', display: 'inline-flex' }}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitAssessment} className="farm-dev-form">
                  {/* Row 1: 4 columns or 2x2 grid */}
                  <div className="farm-dev-row-4">
                    <div className="farm-dev-field">
                      <label className="farm-dev-label">Farmer Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.farmerName}
                        onChange={(e) =>
                          setFormData({ ...formData, farmerName: e.target.value })
                        }
                        className="farm-dev-input"
                      />
                    </div>

                    <div className="farm-dev-field">
                      <label className="farm-dev-label">Mobile Number *</label>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        placeholder="Enter 10-digit mobile number"
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })
                        }
                        className="farm-dev-input"
                      />
                    </div>

                    <div className="farm-dev-field">
                      <label className="farm-dev-label">Location *</label>
                      <input
                        required
                        type="text"
                        placeholder="Village / Town / District"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="farm-dev-input"
                      />
                    </div>

                    <div className="farm-dev-field">
                      <label className="farm-dev-label">Pincode *</label>
                      <input
                        required
                        type="text"
                        maxLength={6}
                        placeholder="Enter pincode"
                        value={formData.pincode}
                        onChange={(e) =>
                          setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })
                        }
                        className="farm-dev-input"
                      />
                    </div>
                  </div>

                  {/* Row 2: 4 columns */}
                  <div className="farm-dev-row-4">
                    <div className="farm-dev-field">
                      <label className="farm-dev-label">Total Land Area *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. 5 Acres"
                        value={formData.landArea}
                        onChange={(e) =>
                          setFormData({ ...formData, landArea: e.target.value })
                        }
                        className="farm-dev-input"
                      />
                    </div>

                    <div className="farm-dev-field">
                      <label className="farm-dev-label">Current Land Condition</label>
                      <select
                        value={formData.landCondition}
                        onChange={(e) =>
                          setFormData({ ...formData, landCondition: e.target.value })
                        }
                        className="farm-dev-input farm-dev-select"
                      >
                        <option value="">Select condition</option>
                        <option value="Uncultivated / Virgin Land">Uncultivated / Virgin Land</option>
                        <option value="Overgrown with Shrubs & Rocks">Overgrown with Shrubs & Rocks</option>
                        <option value="Existing Farm (Needs Renovation)">Existing Farm (Needs Renovation)</option>
                        <option value="Bare Leveled Land">Bare Leveled Land</option>
                        <option value="Semi-Developed Land">Semi-Developed Land</option>
                      </select>
                    </div>

                    <div className="farm-dev-field">
                      <label className="farm-dev-label">Water-Source Availability</label>
                      <select
                        value={formData.waterSource}
                        onChange={(e) =>
                          setFormData({ ...formData, waterSource: e.target.value })
                        }
                        className="farm-dev-input farm-dev-select"
                      >
                        <option value="">Select option</option>
                        <option value="Borewell Available">Borewell Available</option>
                        <option value="Open Well Available">Open Well Available</option>
                        <option value="Canal / River Water Access">Canal / River Water Access</option>
                        <option value="Need New Borewell Planning">Need New Borewell Planning</option>
                        <option value="Rainfed / No Water Source Yet">Rainfed / No Water Source Yet</option>
                      </select>
                    </div>

                    <div className="farm-dev-field">
                      <label className="farm-dev-label">Preferred Crops</label>
                      <input
                        type="text"
                        placeholder="e.g. Paddy, Vegetables, Fruits"
                        value={formData.preferredCrops}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredCrops: e.target.value })
                        }
                        className="farm-dev-input"
                      />
                    </div>
                  </div>

                  {/* Row 3: 2 columns */}
                  <div className="farm-dev-row-2">
                    <div className="farm-dev-field">
                      <label className="farm-dev-label">Development Budget</label>
                      <input
                        type="text"
                        placeholder="e.g. ₹5,00,000"
                        value={formData.budget}
                        onChange={(e) =>
                          setFormData({ ...formData, budget: e.target.value })
                        }
                        className="farm-dev-input"
                      />
                    </div>

                    <div className="farm-dev-field">
                      <label className="farm-dev-label">Expected Starting Date</label>
                      <div className="farm-dev-input-icon-wrap">
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({ ...formData, startDate: e.target.value })
                          }
                          className="farm-dev-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Upload Land Documents or Photos */}
                  <div className="farm-dev-field">
                    <label className="farm-dev-label">
                      Upload Land Documents or Photos
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`farm-dev-upload-box ${
                        isDragOver ? 'drag-over' : ''
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                      />
                      <div className="farm-dev-upload-icon">
                        <Upload size={28} />
                      </div>
                      <div className="farm-dev-upload-text">
                        <p className="farm-dev-upload-prompt">
                          <strong>Drag & drop files here</strong> or <span>click to browse</span>
                        </p>
                        <p className="farm-dev-upload-hint">JPG, PNG, PDF up to 20MB</p>
                      </div>
                    </div>

                    {/* Uploaded Files Chips */}
                    {uploadedFiles.length > 0 && (
                      <div className="farm-dev-file-list">
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="farm-dev-file-item">
                            <FileText size={15} />
                            <span className="farm-dev-file-name">{file.name}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(idx);
                              }}
                              className="farm-dev-file-remove"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Row 5: Additional Requirements */}
                  <div className="farm-dev-field">
                    <label className="farm-dev-label">Additional Requirements</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us anything specific about your land or requirements..."
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        setFormData({ ...formData, additionalNotes: e.target.value })
                      }
                      className="farm-dev-input farm-dev-textarea"
                    />
                  </div>

                  {/* Row 6: Consent Checkbox */}
                  <div className="farm-dev-consent-row">
                    <label className="farm-dev-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.termsAgreed}
                        onChange={(e) =>
                          setFormData({ ...formData, termsAgreed: e.target.checked })
                        }
                        className="farm-dev-checkbox"
                      />
                      <span>
                        I agree to the <Link to="/about">terms</Link> and{' '}
                        <Link to="/about">privacy policy</Link> and consent to being contacted.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="farm-dev-btn-submit"
                  >
                    {isSubmitting ? (
                      <span>Processing Request...</span>
                    ) : (
                      <>
                        <span>Request Farm Assessment</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Card: What Happens Next? */}
            <div className="farm-dev-next-card">
              <h3 className="farm-dev-next-title">What Happens Next?</h3>

              <div className="farm-dev-next-steps">
                {/* Step 1 */}
                <div className="farm-dev-next-item">
                  <div className="farm-dev-next-icon-box">
                    <Phone size={22} />
                  </div>
                  <p className="farm-dev-next-desc">
                    Our team will contact you within 24 hours to understand your requirements.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="farm-dev-next-item">
                  <div className="farm-dev-next-icon-box">
                    <Compass size={22} />
                  </div>
                  <p className="farm-dev-next-desc">
                    We schedule a site inspection and analyse your land.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="farm-dev-next-item">
                  <div className="farm-dev-next-icon-box">
                    <FileText size={22} />
                  </div>
                  <p className="farm-dev-next-desc">
                    You receive a customised development plan and cost estimate.
                  </p>
                </div>
              </div>

              {/* Security Banner */}
              <div className="farm-dev-security-badge">
                <ShieldCheck size={26} className="farm-dev-security-icon" />
                <p className="farm-dev-security-text">
                  Your information is safe and secure with us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions */}
      <section className="farm-dev-faqs-section">
        <div className="farm-dev-faqs-container">
          <h2 className="farm-dev-faqs-title">Frequently Asked Questions</h2>

          <div className="farm-dev-faqs-grid">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`farm-dev-faq-card ${isOpen ? 'active' : ''}`}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div className="farm-dev-faq-question-row">
                    <h3 className="farm-dev-faq-question">{faq.question}</h3>
                    <div className="farm-dev-faq-toggle">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="farm-dev-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Talk to Expert Modal */}
      {isExpertModalOpen && (
        <div
          className="farm-dev-modal-overlay"
          onClick={() => setIsExpertModalOpen(false)}
        >
          <div
            className="farm-dev-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsExpertModalOpen(false)}
              className="farm-dev-modal-close"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {expertCallbackSuccess ? (
              <div className="farm-dev-modal-success">
                <div className="farm-dev-modal-icon-circle">
                  <PhoneCall size={32} />
                </div>
                <h3 className="farm-dev-modal-title">Callback Scheduled!</h3>
                <p className="farm-dev-modal-desc">
                  Thank you! Our senior farm development engineer will call you back on{' '}
                  <strong>{expertPhone}</strong> within 15 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setIsExpertModalOpen(false)}
                  className="farm-dev-btn-primary"
                  style={{ width: '100%' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="farm-dev-modal-header">
                  <div className="farm-dev-modal-tag">Instant Callback</div>
                  <h3 className="farm-dev-modal-title">Talk to a Farm Development Expert</h3>
                  <p className="farm-dev-modal-desc">
                    Get immediate technical advice on land leveling, soil suitability, and project timelines.
                  </p>
                </div>

                <form onSubmit={handleExpertCallbackSubmit} className="farm-dev-modal-form">
                  <div className="farm-dev-field">
                    <label className="farm-dev-label">Mobile Number *</label>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={expertPhone}
                      onChange={(e) =>
                        setExpertPhone(e.target.value.replace(/\D/g, ''))
                      }
                      className="farm-dev-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="farm-dev-btn-submit"
                    style={{ marginTop: '0.75rem' }}
                  >
                    <PhoneCall size={16} />
                    <span>Request Immediate Call</span>
                  </button>

                  <div className="farm-dev-modal-footer-note">
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

export default FarmDevelopmentPage;
