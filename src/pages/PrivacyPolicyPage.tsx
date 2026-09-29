import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, LockKeyhole, Mail, MapPin } from 'lucide-react';
import './TermsPage.css';

const sections = [
  { id: 'information', title: '1. Information We Collect', content: <>We collect account, contact, delivery, order, payment-reference, farm-service, and support information that you provide while using AgriEra.</> },
  { id: 'use', title: '2. How We Use Information', content: <>We use your information to operate accounts, process orders, deliver services, respond to requests, personalize farming support, prevent misuse, and meet legal obligations.</> },
  { id: 'sharing', title: '3. Information Sharing', content: <>Information is shared only with service providers, delivery partners, payment processors, professional advisers, or authorities where needed to provide the service or comply with law.</> },
  { id: 'security', title: '4. Data Security', content: <>We use reasonable technical and organizational safeguards. No internet service is completely risk-free, so users should also protect passwords and account access.</> },
  { id: 'retention', title: '5. Data Retention', content: <>We retain information for as long as required for service delivery, accounting, dispute resolution, security, and applicable legal requirements.</> },
  { id: 'choices', title: '6. Your Choices', content: <>You may review or update profile information through your account and contact us regarding correction, access, or deletion requests, subject to legal retention requirements.</> },
  { id: 'cookies', title: '7. Cookies and Local Storage', content: <>The platform may use cookies and browser storage for authentication, cart continuity, preferences, analytics, security, and reliable site operation.</> },
  { id: 'updates', title: '8. Policy Updates', content: <>We may update this policy when our services or legal requirements change. The latest effective date will be displayed on this page.</> },
];

export const PrivacyPolicyPage: React.FC = () => <div className="terms-page">
  <section className="terms-hero"><div className="terms-hero-inner"><div className="terms-hero-icon"><LockKeyhole size={27} /></div><div><span className="terms-eyebrow"><Leaf size={14} /> Privacy &amp; Data</span><h1>Privacy Policy</h1><p>How AgriEra collects, uses, protects, and manages your information.</p><span className="terms-updated">Effective date: September 29, 2026</span></div></div></section>
  <div className="terms-layout"><aside className="terms-nav" aria-label="Privacy policy sections"><strong>On this page</strong>{sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</aside><main className="terms-content"><div className="terms-intro"><p>This policy applies when you use AgriEra&apos;s website, account, store, agricultural services, and support channels.</p></div>{sections.map((section) => <section id={section.id} className="terms-section" key={section.id}><h2>{section.title}</h2><p>{section.content}</p></section>)}<section className="terms-contact"><h2>Privacy questions or requests?</h2><div><a href="mailto:support@AgriEra.in"><Mail size={16} /> support@AgriEra.in</a><span><MapPin size={16} /> Coimbatore, Tamil Nadu, India</span></div><Link to="/contact">Contact Us</Link></section></main></div>
</div>;

export default PrivacyPolicyPage;
