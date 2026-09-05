import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets,
  MapPin,
  Search,
  Layers,
  CircleDot,
  Wrench,
  Activity,
  CloudRain,
  RefreshCw,
  Database,
  CheckCircle2,
  Phone,
  Upload,
  FileText,
  Plus,
  Minus,
  X,
  PhoneCall,
  Clock,
  AlertTriangle,
  HardHat,
  Compass,
  Calendar,
} from 'lucide-react';
import './WellDevelopmentPage.css';

// Assets
import heroWellImg from '../assets/well-dev-hero.jpg';
import aboutWellImg from '../assets/well-dev-about.jpg';
import planWellImg from '../assets/well-dev-plan.jpg';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const WellDevelopmentPage: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    farmerName: '',
    mobileNumber: '',
    farmLocation: '',
    farmArea: '',
    mainCrops: '',
    existingWaterSource: '',
    currentDepth: '',
    waterShortageDetails: '',
    requiredQuantity: '',
    inspectionDate: '',
    termsConfirmed: false,
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

  // 10 Water Development Modules
  const serviceModules = [
    {
      id: 'water-requirement',
      title: 'Water Requirement',
      icon: <Droplets size={26} />,
      desc: 'Daily crop water budgeting and seasonal volume estimation.',
    },
    {
      id: 'borewell-site-guidance',
      title: 'Borewell Site Guidance',
      icon: <MapPin size={26} />,
      desc: 'Scientific hydro-geological point selection & fracture mapping.',
    },
    {
      id: 'groundwater-survey',
      title: 'Groundwater Survey',
      icon: <Search size={26} />,
      desc: 'Resistivity geophysical survey and aquifer depth analysis.',
    },
    {
      id: 'borewell-planning',
      title: 'Borewell Planning',
      icon: <Layers size={26} />,
      desc: 'Diameter sizing, casing depth, and drilling specifications.',
    },
    {
      id: 'open-well-improvement',
      title: 'Open-Well Improvement',
      icon: <CircleDot size={26} />,
      desc: 'Deepening, desilting, side-boring, and wall protection.',
    },
    {
      id: 'borewell-maintenance',
      title: 'Borewell Maintenance',
      icon: <Wrench size={26} />,
      desc: 'Flushing, compressor cleaning, yield testing & silt removal.',
    },
    {
      id: 'pump-pipeline',
      title: 'Pump & Pipeline',
      icon: <Activity size={26} />,
      desc: 'Submersible motor HP calculation and friction loss pipeline design.',
    },
    {
      id: 'rainwater-harvesting',
      title: 'Rainwater Harvesting',
      icon: <CloudRain size={26} />,
      desc: 'Rooftop & farm runoff catchment to replenish groundwater.',
    },
    {
      id: 'recharge-structures',
      title: 'Recharge Structures',
      icon: <RefreshCw size={26} />,
      desc: 'Percolation shafts, injection wells, and recharge filter pits.',
    },
    {
      id: 'water-storage',
      title: 'Water Storage',
      icon: <Database size={26} />,
      desc: 'Farm ponds, HDPE lined sumps, and overhead storage tanks.',
    },
  ];

  // 6 Workflow Steps
  const workflowSteps = [
    {
      number: '1',
      title: 'Submit Farm & Water Details',
      desc: 'Share your farm and water information.',
    },
    {
      number: '2',
      title: 'Location Assessment',
      desc: 'We study your site, soil and local conditions.',
    },
    {
      number: '3',
      title: 'Groundwater Review',
      desc: 'We analyze groundwater potential.',
    },
    {
      number: '4',
      title: 'Well Development Plan',
      desc: 'Get a customized plan for your farm.',
    },
    {
      number: '5',
      title: 'Select Pump & Recharge Solution',
      desc: 'Choose the right pump and recharge system.',
    },
    {
      number: '6',
      title: 'Installation & Testing',
      desc: 'We ensure proper installation and testing.',
    },
  ];

  // FAQs
  const faqs: FaqItem[] = [
    {
      id: 1,
      question: 'Can groundwater availability be guaranteed?',
      answer:
        'No scientific technology can 100% guarantee underground water as subterranean geological fracture zones vary. However, our advanced geophysical resistivity surveys and hydro-geological mapping drastically reduce dry-bore risks and maximize drilling success rates.',
    },
    {
      id: 2,
      question: 'What is a groundwater recharge system?',
      answer:
        'A groundwater recharge system directs surface rainwater runoff through multi-layer filtration media (coarse sand, gravel, charcoal, and geotextile mesh) directly into deep subterranean aquifers or open wells, replenishing the water table and reviving low-yield borewells.',
    },
    {
      id: 3,
      question: 'Do you conduct groundwater surveys?',
      answer:
        'Yes! Our certified hydro-geologists utilize multi-electrode electrical resistivity meters and electromagnetic sounding instruments to pinpoint subsurface water-bearing strata, fissure depths, and potential water yields.',
    },
    {
      id: 4,
      question: 'How do you recommend a suitable pump?',
      answer:
        'We calculate the exact total dynamic head (TDH), total depth, pipeline friction loss, crop discharge demand, and electrical/solar power supply to engineer the most energy-efficient pump setup.',
    },
    {
      id: 5,
      question: 'Can an existing borewell be improved?',
      answer:
        'Yes. Sub-optimal borewells can often be revitalized via high-pressure compressor flushing, silt removal, slot chemical descaling, hydro-fracturing, or by pairing with an artificial recharge shaft.',
    },
    {
      id: 6,
      question: 'Is a site visit compulsory?',
      answer:
        'An on-site visit is highly recommended to perform instrumented geophysical surveys, assess soil percolation rates, verify electrical connections, and map elevation gradients accurately before starting work.',
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
  const handleSubmitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsConfirmed) {
      alert('Please confirm the declaration checkbox to continue.');
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
    const el = document.getElementById('water-assessment-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (id: number) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="well-dev-page">
      {/* 1. Breadcrumb + Hero Banner */}
      <section
        className="well-dev-hero"
        style={{ '--well-dev-mobile-image': `url(${heroWellImg})` } as React.CSSProperties}
      >
        <div className="well-dev-hero-container">
          {/* Left Hero Content */}
          <div className="well-dev-hero-content">
            <nav className="well-dev-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/services">Services</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Well Development</span>
            </nav>

            <h1 className="well-dev-hero-title">
              Reliable Water Solutions for Sustainable Farming
            </h1>

            <p className="well-dev-hero-desc">
              Get expert assistance for borewell planning, groundwater assessment,
              water-recharge systems and efficient agricultural water management.
            </p>

            <div className="well-dev-hero-actions">
              <button
                type="button"
                onClick={scrollToAssessmentForm}
                className="well-dev-btn-primary"
              >
                <Calendar size={18} />
                <span>Book a Water Assessment</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpertCallbackSuccess(false);
                  setIsExpertModalOpen(true);
                }}
                className="well-dev-btn-secondary"
              >
                <Phone size={17} />
                <span>Talk to an Expert</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="well-dev-hero-media">
            <div className="well-dev-hero-img-card">
              <img
                src={heroWellImg}
                alt="Agricultural Water Solutions - Borewell Water Pump Running in Green Crop Fields"
                className="well-dev-hero-img"
              />
              <div className="well-dev-hero-badge">
                <Droplets size={18} style={{ color: '#88CF3A' }} />
                <div>
                  <strong>Scientific Groundwater Survey</strong>
                  <span>Optimal Discharge & Pump Sizing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Well Development */}
      <section className="well-dev-about-section">
        <div className="well-dev-about-container">
          {/* Left Column: Image of Inspection */}
          <div className="well-dev-about-media">
            <div className="well-dev-about-img-wrap">
              <img
                src={aboutWellImg}
                alt="Borewell Technician Measuring Agricultural Pump and Pipe System"
                className="well-dev-about-img"
              />
            </div>
          </div>

          {/* Right Column: Text & 3 Feature Pillars */}
          <div className="well-dev-about-content">
            <h2 className="well-dev-about-title">About Well Development</h2>
            <p className="well-dev-about-desc">
              Our experts assess your land, water requirements and local conditions before
              recommending a suitable groundwater solution. From borewell planning to recharge
              systems, we help you build a reliable and sustainable water source for long-term farming.
            </p>

            <div className="well-dev-pillars-grid">
              {/* Pillar 1 */}
              <div className="well-dev-pillar-card">
                <div className="well-dev-pillar-icon">
                  <HardHat size={24} />
                </div>
                <h3 className="well-dev-pillar-title">Technical Guidance</h3>
                <p className="well-dev-pillar-text">
                  Expert advice backed by field experience and data.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="well-dev-pillar-card">
                <div className="well-dev-pillar-icon">
                  <Compass size={24} />
                </div>
                <h3 className="well-dev-pillar-title">Location-Based Planning</h3>
                <p className="well-dev-pillar-text">
                  Solutions designed for your soil, terrain and rainfall.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="well-dev-pillar-card">
                <div className="well-dev-pillar-icon">
                  <Droplets size={24} />
                </div>
                <h3 className="well-dev-pillar-title">Efficient Water Use</h3>
                <p className="well-dev-pillar-text">
                  Maximize output with smart pumping and recharge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Complete Well & Water Development Support (10 Modules) */}
      <section className="well-dev-modules-section">
        <div className="well-dev-modules-container">
          <div className="well-dev-section-header">
            <div className="well-dev-leaf-icon">
              <Droplets size={22} />
            </div>
            <h2 className="well-dev-section-title">
              Complete Well & Water Development Support
            </h2>
          </div>

          <div className="well-dev-modules-grid">
            {serviceModules.map((module) => (
              <div key={module.id} className="well-dev-module-card">
                <div className="well-dev-module-icon-box">{module.icon}</div>
                <h3 className="well-dev-module-title">{module.title}</h3>
                <p className="well-dev-module-desc">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. A Clear Process for Reliable Water Planning (6 Step Workflow) */}
      <section className="well-dev-workflow-section">
        <div className="well-dev-workflow-container">
          <div className="well-dev-section-header">
            <div className="well-dev-leaf-icon">
              <Droplets size={22} />
            </div>
            <h2 className="well-dev-section-title">
              A Clear Process for Reliable Water Planning
            </h2>
          </div>

          <div className="well-dev-timeline-track">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="well-dev-step-item">
                <div className="well-dev-step-circle">{step.number}</div>
                <h4 className="well-dev-step-heading">{step.title}</h4>
                <p className="well-dev-step-text">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Smarter Water Planning for Your Farm & Visual Water Layout Map */}
      <section className="well-dev-reasons-section">
        <div className="well-dev-reasons-container">
          {/* Left Column: Reasons */}
          <div className="well-dev-reasons-left">
            <h2 className="well-dev-reasons-title">
              Smarter Water Planning<br />for Your Farm
            </h2>
            <div className="well-dev-title-divider" />

            <ul className="well-dev-benefits-list">
              <li className="well-dev-benefit-item">
                <div className="well-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Better Water-Source Planning</span>
              </li>
              <li className="well-dev-benefit-item">
                <div className="well-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Reduced Borewell Placement Risk</span>
              </li>
              <li className="well-dev-benefit-item">
                <div className="well-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Improved Groundwater Recharge</span>
              </li>
              <li className="well-dev-benefit-item">
                <div className="well-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Efficient Pump Selection</span>
              </li>
              <li className="well-dev-benefit-item">
                <div className="well-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Reliable Irrigation Support</span>
              </li>
              <li className="well-dev-benefit-item">
                <div className="well-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Better Use of Rainwater</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Visual Layout Map with Overlay Callouts */}
          <div className="well-dev-reasons-right">
            <div className="well-dev-plan-wrapper">
              <img
                src={planWellImg}
                alt="Agricultural Water Network & Infrastructure Layout"
                className="well-dev-plan-img"
              />

              {/* Callout Tags matching screenshot */}
              <div className="well-dev-tag tag-borewell">Borewell</div>
              <div className="well-dev-tag tag-storage-tank">Storage Tank</div>
              <div className="well-dev-tag tag-recharge-pit">Recharge Pit</div>
              <div className="well-dev-tag tag-rain-channel">Rainwater Channel</div>
              <div className="well-dev-tag tag-pipeline">Pipeline</div>
              <div className="well-dev-tag tag-water-tower">Storage Tank</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Important Groundwater Note Alert Banner */}
      <section className="well-dev-alert-section">
        <div className="well-dev-alert-container">
          <div className="well-dev-alert-card">
            <div className="well-dev-alert-icon-wrap">
              <AlertTriangle size={32} />
            </div>
            <div className="well-dev-alert-text-wrap">
              <h4 className="well-dev-alert-title">Important Groundwater Note</h4>
              <p className="well-dev-alert-desc">
                Groundwater availability cannot be guaranteed. Recommendations are based on
                surveys, regional conditions and available technical information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Book a Well & Water Assessment (Form Section) */}
      <section id="water-assessment-form-section" className="well-dev-consultation-section">
        <div className="well-dev-consultation-container">
          <div className="well-dev-consultation-heading-wrap">
            <h2 className="well-dev-form-main-title">
              Book a Well & Water Assessment
            </h2>
            <p className="well-dev-form-main-desc">
              Fill in your farm details and our hydro-geology team will schedule an on-field assessment.
            </p>
          </div>

          <div className="well-dev-form-layout-grid">
            {/* Left Card: Full Booking Form */}
            <div className="well-dev-form-card">
              {isSubmitted ? (
                <div className="well-dev-success-state">
                  <div className="well-dev-success-icon-wrap">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="well-dev-success-title">
                    Water Assessment Request Received!
                  </h3>
                  <p className="well-dev-success-desc">
                    Thank you, <strong>{formData.farmerName || 'Farmer'}</strong>. Our water engineering team has received your assessment booking for{' '}
                    <strong>{formData.farmLocation || 'your farm'}</strong>. We will review regional aquifer data and call you within 24 hours to schedule the site visit.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        farmerName: '',
                        mobileNumber: '',
                        farmLocation: '',
                        farmArea: '',
                        mainCrops: '',
                        existingWaterSource: '',
                        currentDepth: '',
                        waterShortageDetails: '',
                        requiredQuantity: '',
                        inspectionDate: '',
                        termsConfirmed: false,
                      });
                      setUploadedFiles([]);
                    }}
                    className="well-dev-btn-primary"
                    style={{ margin: '0 auto', display: 'inline-flex' }}
                  >
                    Submit Another Booking
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitAssessment} className="well-dev-form">
                  {/* Row 1: Farmer Name & Mobile Number */}
                  <div className="well-dev-row-2">
                    <div className="well-dev-field">
                      <label className="well-dev-label">Farmer Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.farmerName}
                        onChange={(e) =>
                          setFormData({ ...formData, farmerName: e.target.value })
                        }
                        className="well-dev-input"
                      />
                    </div>

                    <div className="well-dev-field">
                      <label className="well-dev-label">Mobile Number *</label>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        placeholder="Enter mobile number"
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })
                        }
                        className="well-dev-input"
                      />
                    </div>
                  </div>

                  {/* Row 2: Farm Location & Total Farm Area */}
                  <div className="well-dev-row-2">
                    <div className="well-dev-field">
                      <label className="well-dev-label">Farm Location *</label>
                      <input
                        required
                        type="text"
                        placeholder="Village / Town, District, State"
                        value={formData.farmLocation}
                        onChange={(e) =>
                          setFormData({ ...formData, farmLocation: e.target.value })
                        }
                        className="well-dev-input"
                      />
                    </div>

                    <div className="well-dev-field">
                      <label className="well-dev-label">Total Farm Area *</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter area (in acres)"
                        value={formData.farmArea}
                        onChange={(e) =>
                          setFormData({ ...formData, farmArea: e.target.value })
                        }
                        className="well-dev-input"
                      />
                    </div>
                  </div>

                  {/* Row 3: Main Crops & Existing Water Source */}
                  <div className="well-dev-row-2">
                    <div className="well-dev-field">
                      <label className="well-dev-label">Main Crops</label>
                      <input
                        type="text"
                        placeholder="e.g., Paddy, Cotton, Maize"
                        value={formData.mainCrops}
                        onChange={(e) =>
                          setFormData({ ...formData, mainCrops: e.target.value })
                        }
                        className="well-dev-input"
                      />
                    </div>

                    <div className="well-dev-field">
                      <label className="well-dev-label">Existing Water Source</label>
                      <select
                        value={formData.existingWaterSource}
                        onChange={(e) =>
                          setFormData({ ...formData, existingWaterSource: e.target.value })
                        }
                        className="well-dev-input well-dev-select"
                      >
                        <option value="">Select water source</option>
                        <option value="Existing Borewell (Low Yield)">Existing Borewell (Low Yield)</option>
                        <option value="Open Well">Open Well</option>
                        <option value="Canal / River Connection">Canal / River Connection</option>
                        <option value="No Water Source (New Land)">No Water Source (New Land)</option>
                        <option value="Multiple Sources">Multiple Sources</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Current Well Depth & Water Shortage Details */}
                  <div className="well-dev-row-2">
                    <div className="well-dev-field">
                      <label className="well-dev-label">Current Well or Borewell Depth (ft)</label>
                      <input
                        type="text"
                        placeholder="Enter depth in feet"
                        value={formData.currentDepth}
                        onChange={(e) =>
                          setFormData({ ...formData, currentDepth: e.target.value })
                        }
                        className="well-dev-input"
                      />
                    </div>

                    <div className="well-dev-field">
                      <label className="well-dev-label">Water Shortage Details</label>
                      <textarea
                        rows={2}
                        placeholder="Describe water shortage or issues"
                        value={formData.waterShortageDetails}
                        onChange={(e) =>
                          setFormData({ ...formData, waterShortageDetails: e.target.value })
                        }
                        className="well-dev-input well-dev-textarea"
                      />
                    </div>
                  </div>

                  {/* Row 5: Required Water Quantity */}
                  <div className="well-dev-field">
                    <label className="well-dev-label">Required Water Quantity (liters/day)</label>
                    <input
                      type="text"
                      placeholder="Enter required quantity"
                      value={formData.requiredQuantity}
                      onChange={(e) =>
                        setFormData({ ...formData, requiredQuantity: e.target.value })
                      }
                      className="well-dev-input"
                    />
                  </div>

                  {/* Row 6: Upload Site Photos & Preferred Inspection Date */}
                  <div className="well-dev-row-2">
                    <div className="well-dev-field">
                      <label className="well-dev-label">Upload Site Photos</label>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`well-dev-upload-box ${
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
                        <div className="well-dev-upload-icon">
                          <Upload size={24} />
                        </div>
                        <div className="well-dev-upload-text">
                          <p className="well-dev-upload-prompt">
                            Drag & drop photos here or <span>click to browse</span>
                          </p>
                        </div>
                      </div>

                      {/* Uploaded Files Chips */}
                      {uploadedFiles.length > 0 && (
                        <div className="well-dev-file-list">
                          {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="well-dev-file-item">
                              <FileText size={14} />
                              <span className="well-dev-file-name">{file.name}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(idx);
                                }}
                                className="well-dev-file-remove"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="well-dev-field">
                      <label className="well-dev-label">Preferred Inspection Date</label>
                      <input
                        type="date"
                        value={formData.inspectionDate}
                        onChange={(e) =>
                          setFormData({ ...formData, inspectionDate: e.target.value })
                        }
                        className="well-dev-input"
                      />
                    </div>
                  </div>

                  {/* Row 7: Consent Checkbox */}
                  <div className="well-dev-consent-row">
                    <label className="well-dev-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.termsConfirmed}
                        onChange={(e) =>
                          setFormData({ ...formData, termsConfirmed: e.target.checked })
                        }
                        className="well-dev-checkbox"
                      />
                      <span>
                        I confirm that the above information is correct and I agree to be contacted by <strong>AgriEra</strong> for this service.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="well-dev-btn-submit"
                  >
                    {isSubmitting ? (
                      <span>Submitting Assessment...</span>
                    ) : (
                      <>
                        <Calendar size={18} />
                        <span>Book a Water Assessment</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Card: What Happens Next? */}
            <div className="well-dev-next-card">
              <h3 className="well-dev-next-title">What Happens Next?</h3>

              <div className="well-dev-next-steps">
                {/* Step 1 */}
                <div className="well-dev-next-item">
                  <div className="well-dev-next-icon-box">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 className="well-dev-next-heading">Our team will contact you</h4>
                    <p className="well-dev-next-desc">
                      We will call you to understand your requirements.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="well-dev-next-item">
                  <div className="well-dev-next-icon-box">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 className="well-dev-next-heading">Site inspection is scheduled</h4>
                    <p className="well-dev-next-desc">
                      Our expert will visit your farm for assessment.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="well-dev-next-item">
                  <div className="well-dev-next-icon-box">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h4 className="well-dev-next-heading">Technical recommendation</h4>
                    <p className="well-dev-next-desc">
                      You will receive a customized water solution plan.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="well-dev-next-item">
                  <div className="well-dev-next-icon-box">
                    <Wrench size={22} />
                  </div>
                  <div>
                    <h4 className="well-dev-next-heading">Installation guidance</h4>
                    <p className="well-dev-next-desc">
                      We help you with installation and ongoing support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="well-dev-faqs-section">
        <div className="well-dev-faqs-container">
          <h2 className="well-dev-faqs-title">Frequently Asked Questions</h2>

          <div className="well-dev-faqs-grid">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`well-dev-faq-card ${isOpen ? 'active' : ''}`}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div className="well-dev-faq-question-row">
                    <h3 className="well-dev-faq-question">{faq.question}</h3>
                    <div className="well-dev-faq-toggle">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="well-dev-faq-answer">
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
      <section className="well-dev-bottom-banner">
        <div className="well-dev-bottom-container">
          <div className="well-dev-bottom-content">
            <div className="well-dev-bottom-icon">
              <Droplets size={36} />
            </div>
            <div>
              <h3 className="well-dev-bottom-title">
                Plan a Reliable Water Solution for Your Farm
              </h3>
              <p className="well-dev-bottom-desc">
                Get expert guidance for water-source development, recharge systems and efficient agricultural water management.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToAssessmentForm}
            className="well-dev-bottom-btn"
          >
            <Calendar size={18} />
            <span>Book a Water Assessment</span>
          </button>
        </div>
      </section>

      {/* Talk to Expert Modal */}
      {isExpertModalOpen && (
        <div
          className="well-dev-modal-overlay"
          onClick={() => setIsExpertModalOpen(false)}
        >
          <div
            className="well-dev-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsExpertModalOpen(false)}
              className="well-dev-modal-close"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {expertCallbackSuccess ? (
              <div className="well-dev-modal-success">
                <div className="well-dev-modal-icon-circle">
                  <PhoneCall size={32} />
                </div>
                <h3 className="well-dev-modal-title">Callback Scheduled!</h3>
                <p className="well-dev-modal-desc">
                  Thank you! Our senior groundwater & borewell engineer will call you on{' '}
                  <strong>{expertPhone}</strong> within 15 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setIsExpertModalOpen(false)}
                  className="well-dev-btn-primary"
                  style={{ width: '100%' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="well-dev-modal-header">
                  <div className="well-dev-modal-tag">Instant Callback</div>
                  <h3 className="well-dev-modal-title">Talk to a Water & Well Expert</h3>
                  <p className="well-dev-modal-desc">
                    Get immediate guidance on borewell drilling, recharge pits, and pump selections.
                  </p>
                </div>

                <form onSubmit={handleExpertCallbackSubmit} className="well-dev-modal-form">
                  <div className="well-dev-field">
                    <label className="well-dev-label">Mobile Number *</label>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={expertPhone}
                      onChange={(e) =>
                        setExpertPhone(e.target.value.replace(/\D/g, ''))
                      }
                      className="well-dev-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="well-dev-btn-submit"
                    style={{ marginTop: '0.75rem' }}
                  >
                    <PhoneCall size={16} />
                    <span>Request Immediate Call</span>
                  </button>

                  <div className="well-dev-modal-footer-note">
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

export default WellDevelopmentPage;
