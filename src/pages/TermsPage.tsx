import React from 'react';
import { FileText, Leaf, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TermsPage.css';

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms', content: <>By accessing or using the AgriEra website, creating an account, purchasing a product, or booking a service, you agree to these Terms & Conditions. If you do not agree, please do not use the platform.</> },
  { id: 'eligibility', title: '2. Eligibility and Accounts', content: <>You must be legally capable of entering into a binding agreement. You are responsible for providing accurate information, protecting your login credentials, and all activity performed through your account. Notify us promptly if you suspect unauthorized access.</> },
  { id: 'products', title: '3. Products and Information', content: <>We aim to display product descriptions, images, prices, availability, and agricultural guidance accurately. Packaging, color, or appearance may vary. Product recommendations are general information and should be used according to labels, local conditions, and qualified professional advice.</> },
  { id: 'orders', title: '4. Orders and Availability', content: <>An order is an offer to purchase. We may accept, limit, or cancel an order because of stock availability, pricing errors, delivery restrictions, suspected misuse, or other operational reasons. If payment has already been collected for a cancelled order, the applicable amount will be refunded through the original payment method.</> },
  { id: 'pricing', title: '5. Prices and Payments', content: <>Prices are displayed in Indian Rupees unless stated otherwise. Applicable taxes, delivery charges, and other fees are shown before checkout. Payments are processed through authorized payment providers, and their separate terms may also apply.</> },
  { id: 'delivery', title: '6. Shipping and Delivery', content: <>Delivery estimates are provided in good faith and may vary due to location, weather, carrier operations, or events beyond our reasonable control. Please provide a complete delivery address and inspect the shipment after receipt. Additional details are available in our shipping policy.</> },
  { id: 'returns', title: '7. Returns, Refunds, and Cancellations', content: <>Returns, replacements, refunds, and cancellations are governed by the policies shown on the website and any product-specific conditions. Perishable, opened, used, customized, or regulated agricultural products may not be eligible for return except where required by applicable law.</> },
  { id: 'services', title: '8. Agricultural Services', content: <>Consultations, farm development, irrigation, and related services depend on site conditions and the agreed scope. Estimates may change when actual field conditions differ from the information provided. Crop performance cannot be guaranteed because outcomes depend on weather, soil, water, pests, farming practices, and other external factors.</> },
  { id: 'acceptable-use', title: '9. Acceptable Use', content: <>You may not misuse the platform, attempt unauthorized access, interfere with its operation, submit unlawful or misleading material, infringe another person’s rights, scrape data without permission, or use the service for fraudulent activity.</> },
  { id: 'content', title: '10. Intellectual Property', content: <>The website’s branding, interface, text, graphics, software, and original content belong to AgriEra or its licensors. You may use the platform for personal or legitimate business purchasing purposes, but may not reproduce, sell, modify, or distribute protected material without permission.</> },
  { id: 'liability', title: '11. Disclaimers and Liability', content: <>The platform is provided on an “as available” basis. To the extent permitted by applicable law, AgriEra is not responsible for indirect or consequential loss arising from platform interruptions, third-party services, misuse of products, or reliance on general agricultural information. Nothing in these terms excludes rights or liabilities that cannot legally be excluded.</> },
  { id: 'changes', title: '12. Changes and Termination', content: <>We may update the platform or these terms to reflect operational, legal, or service changes. The revised version becomes effective when posted with a new effective date. We may suspend or terminate access where these terms are violated or where necessary to protect users or the platform.</> },
  { id: 'law', title: '13. Governing Law and Disputes', content: <>These terms are governed by the laws applicable in India. Subject to mandatory consumer protections, disputes will be handled by the competent courts serving Coimbatore, Tamil Nadu. Please contact us first so we can try to resolve your concern promptly.</> },
];

export const TermsPage: React.FC = () => (
  <div className="terms-page">
    <section className="terms-hero">
      <div className="terms-hero-inner">
        <div className="terms-hero-icon"><FileText size={25} /></div>
        <div>
          <span className="terms-eyebrow"><Leaf size={14} /> Legal Information</span>
          <h1>Terms &amp; Conditions</h1>
          <p>Please read these terms carefully before using AgriEra’s products, services, and digital platform.</p>
          <span className="terms-updated">Effective date: September 4, 2026</span>
        </div>
      </div>
    </section>

    <div className="terms-layout">
      <aside className="terms-nav" aria-label="Terms sections">
        <strong>On this page</strong>
        {sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title.replace(/^\d+\. /, '')}</a>)}
      </aside>

      <main className="terms-content">
        <div className="terms-intro">
          <p>These Terms &amp; Conditions form an agreement between you and <strong>AgriEra</strong> regarding your use of our website, agricultural marketplace, and farm-related services.</p>
        </div>
        {sections.map((section) => (
          <section id={section.id} className="terms-section" key={section.id}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </section>
        ))}
        <section className="terms-contact">
          <h2>Questions about these terms?</h2>
          <p>Contact our support team and we’ll be happy to help.</p>
          <div><a href="mailto:support@AgriEra.in"><Mail size={16} /> support@AgriEra.in</a><span><MapPin size={16} /> Coimbatore, Tamil Nadu, India</span></div>
          <Link to="/contact">Contact Us</Link>
        </section>
        <p className="terms-legal-note">This page is a general business template and should be reviewed by qualified legal counsel before production use.</p>
      </main>
    </div>
  </div>
);

export default TermsPage;
