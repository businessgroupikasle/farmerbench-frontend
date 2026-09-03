import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets,
  Sprout,
  Wrench,
  CheckCircle2,
  Phone,
  Upload,
  FileText,
  Plus,
  Minus,
  X,
  PhoneCall,
  Clock,
  Layers,
  FlaskConical,
  Sparkles,
  Award,
  Activity,
  Sliders,
  Filter,
  Route,
  Zap,
} from 'lucide-react';
import './DripIrrigationPage.css';

// Assets
import heroDripImg from '../assets/drip-dev-hero.jpg';
import macroDripImg from '../assets/drip-dev-macro.jpg';
import planDripImg from '../assets/drip-dev-plan.jpg';
import organicImg from '../assets/organic-farming.jpg';
import sustainableImg from '../assets/sustainable-farm.jpg';
import practicesImg from '../assets/farming-practices.jpg';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const DripIrrigationPage: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    farmerName: '',
    mobileNumber: '',
    farmLocation: '',
    farmSize: '',
    cropVariety: '',
    cropSpacing: '',
    waterSource: '',
    pumpCapacity: '',
    existingMethod: '',
    requiredService: 'New Installation',
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

  // 11 Drip Modules
  const serviceModules = [
    {
      number: '1.',
      title: 'Farm & Water Assessment',
      icon: <Layers size={24} />,
      desc: 'Soil percolation, water pH/salinity, and elevation slope audit.',
    },
    {
      number: '2.',
      title: 'Crop Water Calculation',
      icon: <Droplets size={24} />,
      desc: 'Peak evapotranspiration (ETc) and daily liter-per-plant needs.',
    },
    {
      number: '3.',
      title: 'Drip-System Layout',
      icon: <Activity size={24} />,
      desc: 'CAD layout mapping for uniform pressure across all plots.',
    },
    {
      number: '4.',
      title: 'Mainline & Sub-Main',
      icon: <Sliders size={24} />,
      desc: 'Heavy-duty PVC/HDPE delivery pipes and block control valves.',
    },
    {
      number: '5.',
      title: 'Lateral & Emitter',
      icon: <Route size={24} />,
      desc: 'Inline / online pressure-compensating (PC) dripper tubing.',
    },
    {
      number: '6.',
      title: 'Filter & Pressure Control',
      icon: <Filter size={24} />,
      desc: 'Disc, screen, and hydro-cyclone sand separators with PRVs.',
    },
    {
      number: '7.',
      title: 'Fertigation Unit',
      icon: <FlaskConical size={24} />,
      desc: 'Venturi injectors and bypass fertilizer tanks for direct feeding.',
    },
    {
      number: '8.',
      title: 'Micro-Sprinklers',
      icon: <Sparkles size={24} />,
      desc: 'Overhead micro-jets for close-spaced crops and cooling.',
    },
    {
      number: '9.',
      title: 'Installation Support',
      icon: <Wrench size={24} />,
      desc: 'Expert trenching, pipeline laying, jointing, and flush testing.',
    },
    {
      number: '10.',
      title: 'Testing & Training',
      icon: <Award size={24} />,
      desc: 'Pressure regulation checks and on-field farmer training.',
    },
    {
      number: '11.',
      title: 'Maintenance & Repair',
      icon: <Zap size={24} />,
      desc: 'Acid treatment, lateral flushing, and emitter descaling.',
    },
  ];

  // 9 Crop Categories
  const cropList = [
    { name: 'Vegetables', desc: 'Tomato, Chilli, Brinjal, Capsicum, Cucumber', img: organicImg },
    { name: 'Banana', desc: 'Grand Naine, Robusta, Red Banana, Nendran', img: sustainableImg },
    { name: 'Coconut', desc: 'Tall & Dwarf varieties, Arecanut, Palms', img: practicesImg },
    { name: 'Sugarcane', desc: 'Single-bud, ratoon & wider row spacing', img: heroDripImg },
    { name: 'Cotton', desc: 'Bt Cotton, high-density planting system', img: organicImg },
    { name: 'Fruit Orchards', desc: 'Mango, Pomegranate, Citrus, Guava, Papaya', img: sustainableImg },
    { name: 'Flower Crops', desc: 'Marigold, Rose, Jasmine, Chrysanthemum', img: practicesImg },
    { name: 'Plantation Crops', desc: 'Tea, Coffee, Rubber, Cardamom, Pepper', img: heroDripImg },
    { name: 'Greenhouses & Nurseries', desc: 'Polyhouse, shade net, hydroponic beds', img: macroDripImg },
  ];

  // 7 Workflow Steps
  const workflowSteps = [
    {
      number: '1',
      title: 'Enter Farm Details',
      desc: 'Share your crop, acreage, and water availability.',
    },
    {
      number: '2',
      title: 'Field Assessment',
      desc: 'Our engineer surveys soil texture and pressure head.',
    },
    {
      number: '3',
      title: 'Measure Spacing & Water',
      desc: 'Calculate exact plant spacing and discharge rates.',
    },
    {
      number: '4',
      title: 'Irrigation-System Design',
      desc: 'Generate custom hydraulic CAD block layout.',
    },
    {
      number: '5',
      title: 'Confirm Materials & Cost',
      desc: 'Transparent itemized quotation and subsidy support.',
    },
    {
      number: '6',
      title: 'Installation & Testing',
      desc: 'Precision fitting and pressure uniformity test.',
    },
    {
      number: '7',
      title: 'Operation & Maintenance Training',
      desc: 'Hands-on training on flushing and fertigation.',
    },
  ];

  // FAQs
  const faqs: FaqItem[] = [
    {
      id: 1,
      question: 'Which crops are suitable for drip irrigation?',
      answer:
        'Drip irrigation is suitable for virtually all crops, including vegetables (tomato, chilli, brinjal, cucumber), fruit orchards (mango, pomegranate, citrus, guava), cash crops (sugarcane, cotton), tree crops (coconut, arecanut, oil palm), flowers, and greenhouse polyhouses.',
    },
    {
      id: 2,
      question: 'Can fertilizer be applied through the system?',
      answer:
        'Yes! Fertigation (applying water-soluble fertilizers directly through Venturi injectors or fertilizer tanks) delivers nutrients straight to active root zones, increasing nutrient uptake efficiency by 30-40% and saving significant fertilizer costs.',
    },
    {
      id: 3,
      question: 'How much water can be saved?',
      answer:
        'Drip irrigation saves between 40% to 70% of water compared to traditional flood irrigation while increasing overall crop yield by 20% to 50% due to precise moisture levels without water stress or soil waterlogging.',
    },
    {
      id: 4,
      question: 'Do you repair existing drip systems?',
      answer:
        'Yes! We provide complete diagnostic, maintenance, and upgrade services: unclogging emitters, flushing lateral lines, replacing damaged sub-mains, servicing disc/sand filters, repairing control valves, and upgrading old flood systems.',
    },
    {
      id: 5,
      question: 'What information is needed for system design?',
      answer:
        'We need your total farm acreage, crop type, row-to-row and plant-to-plant spacing, water source discharge rate (liters/hour), pump motor horsepower, and land elevation profile.',
    },
    {
      id: 6,
      question: 'How often should filters and emitters be cleaned?',
      answer:
        'Disc/screen filters should be backwashed weekly, lateral lines should be flushed monthly through flush valves, and periodic organic acid treatments (such as nitric or phosphoric acid) should be done to remove mineral scale and algae deposits.',
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
  const handleSubmitPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert('Please agree to share information with AgriEra to continue.');
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

  const scrollToPlanForm = () => {
    const el = document.getElementById('drip-plan-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (id: number) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="drip-dev-page">
      {/* 1. Breadcrumb + Hero Banner */}
      <section className="drip-dev-hero">
        <div className="drip-dev-hero-container">
          {/* Left Hero Content */}
          <div className="drip-dev-hero-content">
            <nav className="drip-dev-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/services">Services</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Drip Irrigation</span>
            </nav>

            <h1 className="drip-dev-hero-title">
              Deliver the Right Water to Every Plant
            </h1>

            <p className="drip-dev-hero-desc">
              Save water and improve crop performance with professionally planned
              drip and micro-irrigation systems designed for your farm.
            </p>

            <div className="drip-dev-hero-actions">
              <button
                type="button"
                onClick={scrollToPlanForm}
                className="drip-dev-btn-primary"
              >
                Get a Drip-Irrigation Plan
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpertCallbackSuccess(false);
                  setIsExpertModalOpen(true);
                }}
                className="drip-dev-btn-secondary"
              >
                <Phone size={17} />
                <span>Talk to an Expert</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="drip-dev-hero-media">
            <div className="drip-dev-hero-img-card">
              <img
                src={heroDripImg}
                alt="Agricultural Expert and Farmer Checking Drip Irrigation Lateral Tubing in Farm"
                className="drip-dev-hero-img"
              />
              <div className="drip-dev-hero-badge">
                <Droplets size={18} style={{ color: '#88CF3A' }} />
                <div>
                  <strong>Precision Root-Zone Delivery</strong>
                  <span>Conserves Up to 60% Water • Increases Yield</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Drip Irrigation */}
      <section className="drip-dev-about-section">
        <div className="drip-dev-about-container">
          {/* Left Column: Macro Close-up */}
          <div className="drip-dev-about-media">
            <div className="drip-dev-about-img-wrap">
              <img
                src={macroDripImg}
                alt="Macro Close-Up of Drip Irrigation Emitter Dripping Water to Seedling Roots"
                className="drip-dev-about-img"
              />
            </div>
          </div>

          {/* Right Column: Text & 3 Feature Pillars */}
          <div className="drip-dev-about-content">
            <h2 className="drip-dev-about-title">About Drip Irrigation</h2>
            <p className="drip-dev-about-desc">
              Drip irrigation supplies water directly to the root zones of plants through a
              network of pipes, tubes and emitters. It ensures precise water application,
              conserves water and improves crop yield. The right design depends on your crop,
              spacing, farm size, water source, pressure and field conditions.
            </p>

            <div className="drip-dev-pillars-grid">
              {/* Pillar 1 */}
              <div className="drip-dev-pillar-card">
                <div className="drip-dev-pillar-icon">
                  <Sprout size={24} />
                </div>
                <h3 className="drip-dev-pillar-title">Crop-Specific Design</h3>
                <p className="drip-dev-pillar-text">
                  Custom systems based on crop type, spacing and water needs.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="drip-dev-pillar-card">
                <div className="drip-dev-pillar-icon">
                  <Droplets size={24} />
                </div>
                <h3 className="drip-dev-pillar-title">Water-Efficient Planning</h3>
                <p className="drip-dev-pillar-text">
                  Optimized designs to save water and reduce operating costs.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="drip-dev-pillar-card">
                <div className="drip-dev-pillar-icon">
                  <Wrench size={24} />
                </div>
                <h3 className="drip-dev-pillar-title">Installation Support</h3>
                <p className="drip-dev-pillar-text">
                  End-to-end support from installation to training and maintenance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Complete Drip & Micro-Irrigation Support (11 Modules) */}
      <section className="drip-dev-modules-section">
        <div className="drip-dev-modules-container">
          <div className="drip-dev-section-header">
            <div className="drip-dev-leaf-icon">
              <Droplets size={22} />
            </div>
            <h2 className="drip-dev-section-title">
              Complete Drip & Micro-Irrigation Support
            </h2>
          </div>

          <div className="drip-dev-modules-grid">
            {serviceModules.map((module, idx) => (
              <div key={idx} className="drip-dev-module-card">
                <div className="drip-dev-module-icon-box">{module.icon}</div>
                <h3 className="drip-dev-module-title">
                  {module.number} {module.title}
                </h3>
                <p className="drip-dev-module-desc">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Suitable for a Wide Range of Crops (9 Crops Showcase) */}
      <section className="drip-dev-crops-section">
        <div className="drip-dev-crops-container">
          <div className="drip-dev-section-header">
            <h2 className="drip-dev-section-title">
              Suitable for a Wide Range of Crops
            </h2>
          </div>

          <div className="drip-dev-crops-grid">
            {cropList.map((crop, idx) => (
              <div key={idx} className="drip-dev-crop-card">
                <div className="drip-dev-crop-img-wrap">
                  <img src={crop.img} alt={crop.name} className="drip-dev-crop-img" />
                </div>
                <h4 className="drip-dev-crop-name">{crop.name}</h4>
                <p className="drip-dev-crop-desc">{crop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. From Farm Assessment to Farmer Training (7 Steps Process Roadmap) */}
      <section className="drip-dev-workflow-section">
        <div className="drip-dev-workflow-container">
          <div className="drip-dev-section-header">
            <div className="drip-dev-leaf-icon">
              <Droplets size={22} />
            </div>
            <h2 className="drip-dev-section-title">
              From Farm Assessment to Farmer Training
            </h2>
          </div>

          <div className="drip-dev-timeline-track">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="drip-dev-step-item">
                <div className="drip-dev-step-circle">{step.number}</div>
                <h4 className="drip-dev-step-heading">{step.title}</h4>
                <p className="drip-dev-step-text">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. More Crop from Every Drop & Visual Setup Map */}
      <section className="drip-dev-reasons-section">
        <div className="drip-dev-reasons-container">
          {/* Left Column: Benefits */}
          <div className="drip-dev-reasons-left">
            <h2 className="drip-dev-reasons-title">
              More Crop from<br />Every Drop
            </h2>
            <div className="drip-dev-title-divider" />

            <ul className="drip-dev-benefits-list">
              <li className="drip-dev-benefit-item">
                <div className="drip-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Reduced Water Wastage</span>
              </li>
              <li className="drip-dev-benefit-item">
                <div className="drip-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Uniform Water Distribution</span>
              </li>
              <li className="drip-dev-benefit-item">
                <div className="drip-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Lower Labour Requirements</span>
              </li>
              <li className="drip-dev-benefit-item">
                <div className="drip-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Easier Fertilizer Application</span>
              </li>
              <li className="drip-dev-benefit-item">
                <div className="drip-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Reduced Weed Growth</span>
              </li>
              <li className="drip-dev-benefit-item">
                <div className="drip-dev-benefit-check">
                  <CheckCircle2 size={20} />
                </div>
                <span>Better Crop Health & Productivity</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Visual Setup Map with Overlay Callouts */}
          <div className="drip-dev-reasons-right">
            <div className="drip-dev-plan-wrapper">
              <img
                src={planDripImg}
                alt="Complete Drip Irrigation Head Station and Field Network"
                className="drip-dev-plan-img"
              />

              {/* Callout Tags matching screenshot */}
              <div className="drip-dev-tag tag-water-source">Water Source</div>
              <div className="drip-dev-tag tag-pump">Pump</div>
              <div className="drip-dev-tag tag-filter">Filter</div>
              <div className="drip-dev-tag tag-fertigation">Fertigation Tank</div>
              <div className="drip-dev-tag tag-mainline">Mainline</div>
              <div className="drip-dev-tag tag-submain">Sub-Main</div>
              <div className="drip-dev-tag tag-lateral">Lateral</div>
              <div className="drip-dev-tag tag-emitters">Emitters</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Get Your Custom Drip-Irrigation Plan (Form Section) */}
      <section id="drip-plan-form-section" className="drip-dev-consultation-section">
        <div className="drip-dev-consultation-container">
          <div className="drip-dev-consultation-heading-wrap">
            <h2 className="drip-dev-form-main-title">
              Get Your Custom Drip-Irrigation Plan
            </h2>
            <p className="drip-dev-form-main-desc">
              Fill in your field specifications and our irrigation engineering specialists will create a customized layout.
            </p>
          </div>

          <div className="drip-dev-form-layout-grid">
            {/* Left Card: Full Form */}
            <div className="drip-dev-form-card">
              {isSubmitted ? (
                <div className="drip-dev-success-state">
                  <div className="drip-dev-success-icon-wrap">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="drip-dev-success-title">
                    Drip Irrigation Plan Request Submitted!
                  </h3>
                  <p className="drip-dev-success-desc">
                    Thank you, <strong>{formData.farmerName || 'Farmer'}</strong>. Our micro-irrigation engineering team has received your request for{' '}
                    <strong>{formData.cropVariety || 'your crop'}</strong> ({formData.farmSize || 'farm area'}) in{' '}
                    <strong>{formData.farmLocation || 'your location'}</strong>. We will design your hydraulic block plan and call you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        farmerName: '',
                        mobileNumber: '',
                        farmLocation: '',
                        farmSize: '',
                        cropVariety: '',
                        cropSpacing: '',
                        waterSource: '',
                        pumpCapacity: '',
                        existingMethod: '',
                        requiredService: 'New Installation',
                        termsAgreed: false,
                      });
                      setUploadedFiles([]);
                    }}
                    className="drip-dev-btn-primary"
                    style={{ margin: '0 auto', display: 'inline-flex' }}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitPlan} className="drip-dev-form">
                  {/* Row 1: Farmer Name, Mobile Number, Farm Location */}
                  <div className="drip-dev-row-3">
                    <div className="drip-dev-field">
                      <label className="drip-dev-label">Farmer Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.farmerName}
                        onChange={(e) =>
                          setFormData({ ...formData, farmerName: e.target.value })
                        }
                        className="drip-dev-input"
                      />
                    </div>

                    <div className="drip-dev-field">
                      <label className="drip-dev-label">Mobile Number *</label>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        placeholder="Enter 10-digit number"
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })
                        }
                        className="drip-dev-input"
                      />
                    </div>

                    <div className="drip-dev-field">
                      <label className="drip-dev-label">Farm Location *</label>
                      <input
                        required
                        type="text"
                        placeholder="Village, City, District"
                        value={formData.farmLocation}
                        onChange={(e) =>
                          setFormData({ ...formData, farmLocation: e.target.value })
                        }
                        className="drip-dev-input"
                      />
                    </div>
                  </div>

                  {/* Row 2: Farm Size, Crop and Variety, Crop Spacing */}
                  <div className="drip-dev-row-3">
                    <div className="drip-dev-field">
                      <label className="drip-dev-label">Farm Size *</label>
                      <select
                        required
                        value={formData.farmSize}
                        onChange={(e) =>
                          setFormData({ ...formData, farmSize: e.target.value })
                        }
                        className="drip-dev-input drip-dev-select"
                      >
                        <option value="">Select size</option>
                        <option value="Less than 1 Acre">Less than 1 Acre</option>
                        <option value="1 - 2 Acres">1 - 2 Acres</option>
                        <option value="3 - 5 Acres">3 - 5 Acres</option>
                        <option value="5 - 10 Acres">5 - 10 Acres</option>
                        <option value="10+ Acres">10+ Acres</option>
                      </select>
                    </div>

                    <div className="drip-dev-field">
                      <label className="drip-dev-label">Crop and Variety</label>
                      <input
                        type="text"
                        placeholder="e.g. Tomato, Banana, Sugarcane"
                        value={formData.cropVariety}
                        onChange={(e) =>
                          setFormData({ ...formData, cropVariety: e.target.value })
                        }
                        className="drip-dev-input"
                      />
                    </div>

                    <div className="drip-dev-field">
                      <label className="drip-dev-label">Crop Spacing</label>
                      <input
                        type="text"
                        placeholder="Enter spacing (e.g., 1.5 x 1.5 ft)"
                        value={formData.cropSpacing}
                        onChange={(e) =>
                          setFormData({ ...formData, cropSpacing: e.target.value })
                        }
                        className="drip-dev-input"
                      />
                    </div>
                  </div>

                  {/* Row 3: Water Source, Pump Capacity, Existing Irrigation Method */}
                  <div className="drip-dev-row-3">
                    <div className="drip-dev-field">
                      <label className="drip-dev-label">Water Source</label>
                      <select
                        value={formData.waterSource}
                        onChange={(e) =>
                          setFormData({ ...formData, waterSource: e.target.value })
                        }
                        className="drip-dev-input drip-dev-select"
                      >
                        <option value="">Select source</option>
                        <option value="Borewell">Borewell</option>
                        <option value="Open Well">Open Well</option>
                        <option value="Canal / River">Canal / River</option>
                        <option value="Farm Pond / Storage Sump">Farm Pond / Storage Sump</option>
                        <option value="Pipeline Supply">Pipeline Supply</option>
                      </select>
                    </div>

                    <div className="drip-dev-field">
                      <label className="drip-dev-label">Pump Capacity (HP)</label>
                      <input
                        type="text"
                        placeholder="Enter pump capacity (HP)"
                        value={formData.pumpCapacity}
                        onChange={(e) =>
                          setFormData({ ...formData, pumpCapacity: e.target.value })
                        }
                        className="drip-dev-input"
                      />
                    </div>

                    <div className="drip-dev-field">
                      <label className="drip-dev-label">Existing Irrigation Method</label>
                      <select
                        value={formData.existingMethod}
                        onChange={(e) =>
                          setFormData({ ...formData, existingMethod: e.target.value })
                        }
                        className="drip-dev-input drip-dev-select"
                      >
                        <option value="">Select method</option>
                        <option value="Flood Irrigation">Flood Irrigation</option>
                        <option value="Rainfed / None">Rainfed / None</option>
                        <option value="Old Drip System (Needs Repair)">Old Drip System (Needs Repair)</option>
                        <option value="Sprinklers">Sprinklers</option>
                        <option value="Manual Hose">Manual Hose</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Required Service Pill Buttons */}
                  <div className="drip-dev-field">
                    <label className="drip-dev-label">Required Service</label>
                    <div className="drip-dev-service-pills">
                      {['New Installation', 'Repair', 'Expansion'].map((serviceType) => (
                        <button
                          key={serviceType}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, requiredService: serviceType })
                          }
                          className={`drip-dev-service-pill ${
                            formData.requiredService === serviceType ? 'active' : ''
                          }`}
                        >
                          {serviceType}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row 5: Upload Farm Layout or Photos */}
                  <div className="drip-dev-field">
                    <label className="drip-dev-label">Upload Farm Layout or Photos</label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`drip-dev-upload-box ${
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
                      <div className="drip-dev-upload-icon">
                        <Upload size={24} />
                      </div>
                      <div className="drip-dev-upload-text">
                        <p className="drip-dev-upload-prompt">
                          Drag & drop files here or <span>click to browse</span>
                        </p>
                        <p className="drip-dev-upload-hint">JPG, PNG or PDF (Max. 10 MB)</p>
                      </div>
                    </div>

                    {/* Uploaded Files Chips */}
                    {uploadedFiles.length > 0 && (
                      <div className="drip-dev-file-list">
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="drip-dev-file-item">
                            <FileText size={14} />
                            <span className="drip-dev-file-name">{file.name}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(idx);
                              }}
                              className="drip-dev-file-remove"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Row 6: Consent Checkbox */}
                  <div className="drip-dev-consent-row">
                    <label className="drip-dev-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.termsAgreed}
                        onChange={(e) =>
                          setFormData({ ...formData, termsAgreed: e.target.checked })
                        }
                        className="drip-dev-checkbox"
                      />
                      <span>
                        I agree to share the above information with <strong>AgriEra</strong> for the purpose of providing irrigation solutions.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="drip-dev-btn-submit"
                  >
                    {isSubmitting ? (
                      <span>Generating Custom Layout...</span>
                    ) : (
                      <span>Get a Drip-Irrigation Plan</span>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Card: What Happens Next? */}
            <div className="drip-dev-next-card">
              <h3 className="drip-dev-next-title">What Happens Next?</h3>

              <div className="drip-dev-next-steps">
                {/* Step 1 */}
                <div className="drip-dev-next-item">
                  <div className="drip-dev-next-icon-box">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 className="drip-dev-next-heading">1. We'll Call You</h4>
                    <p className="drip-dev-next-desc">
                      Our irrigation expert will call you to understand your requirements.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="drip-dev-next-item">
                  <div className="drip-dev-next-icon-box">
                    <Sprout size={22} />
                  </div>
                  <div>
                    <h4 className="drip-dev-next-heading">2. Field Assessment</h4>
                    <p className="drip-dev-next-desc">
                      We assess your field, water source and crop needs.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="drip-dev-next-item">
                  <div className="drip-dev-next-icon-box">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h4 className="drip-dev-next-heading">3. System Design & Estimate</h4>
                    <p className="drip-dev-next-desc">
                      You'll receive a custom design and transparent cost estimate.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="drip-dev-next-item">
                  <div className="drip-dev-next-icon-box">
                    <Wrench size={22} />
                  </div>
                  <div>
                    <h4 className="drip-dev-next-heading">4. Installation Scheduling</h4>
                    <p className="drip-dev-next-desc">
                      We schedule installation and ensure timely completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="drip-dev-faqs-section">
        <div className="drip-dev-faqs-container">
          <h2 className="drip-dev-faqs-title">Frequently Asked Questions</h2>

          <div className="drip-dev-faqs-grid">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`drip-dev-faq-card ${isOpen ? 'active' : ''}`}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div className="drip-dev-faq-question-row">
                    <h3 className="drip-dev-faq-question">{faq.question}</h3>
                    <div className="drip-dev-faq-toggle">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="drip-dev-faq-answer">
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
      <section className="drip-dev-bottom-banner">
        <div className="drip-dev-bottom-container">
          <div className="drip-dev-bottom-content">
            <div className="drip-dev-bottom-icon">
              <Droplets size={36} />
            </div>
            <div>
              <h3 className="drip-dev-bottom-title">
                Make Every Drop Work Harder for Your Farm
              </h3>
              <p className="drip-dev-bottom-desc">
                Efficient water. Healthier crops. Higher returns. Let's build the right drip system for your farm.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToPlanForm}
            className="drip-dev-bottom-btn"
          >
            <span>Get a Drip-Irrigation Plan</span>
          </button>
        </div>
      </section>

      {/* Talk to Expert Modal */}
      {isExpertModalOpen && (
        <div
          className="drip-dev-modal-overlay"
          onClick={() => setIsExpertModalOpen(false)}
        >
          <div
            className="drip-dev-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsExpertModalOpen(false)}
              className="drip-dev-modal-close"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {expertCallbackSuccess ? (
              <div className="drip-dev-modal-success">
                <div className="drip-dev-modal-icon-circle">
                  <PhoneCall size={32} />
                </div>
                <h3 className="drip-dev-modal-title">Callback Scheduled!</h3>
                <p className="drip-dev-modal-desc">
                  Thank you! Our micro-irrigation and fertigation specialist will call you on{' '}
                  <strong>{expertPhone}</strong> within 15 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setIsExpertModalOpen(false)}
                  className="drip-dev-btn-primary"
                  style={{ width: '100%' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="drip-dev-modal-header">
                  <div className="drip-dev-modal-tag">Instant Consultation</div>
                  <h3 className="drip-dev-modal-title">Talk to a Drip Irrigation Specialist</h3>
                  <p className="drip-dev-modal-desc">
                    Get immediate advice on lateral dripper spacing, pressure regulators, and fertigation tanks.
                  </p>
                </div>

                <form onSubmit={handleExpertCallbackSubmit} className="drip-dev-modal-form">
                  <div className="drip-dev-field">
                    <label className="drip-dev-label">Mobile Number *</label>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={expertPhone}
                      onChange={(e) =>
                        setExpertPhone(e.target.value.replace(/\D/g, ''))
                      }
                      className="drip-dev-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="drip-dev-btn-submit"
                    style={{ marginTop: '0.75rem' }}
                  >
                    <PhoneCall size={16} />
                    <span>Request Immediate Call</span>
                  </button>

                  <div className="drip-dev-modal-footer-note">
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

export default DripIrrigationPage;
