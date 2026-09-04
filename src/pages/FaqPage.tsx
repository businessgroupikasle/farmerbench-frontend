import React, { useMemo, useState } from 'react';
import { ChevronDown, HelpCircle, Leaf, Mail, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import './FaqPage.css';

const categories = ['All', 'Orders', 'Products', 'Services', 'Account', 'Delivery'];

const faqs = [
  { category: 'Orders', question: 'How can I place an order on AgriEra?', answer: 'Browse the Products page, choose a product, add it to your cart, and continue to checkout. Confirm your delivery address and payment details before submitting the order.' },
  { category: 'Orders', question: 'Can I change or cancel an order?', answer: 'Contact our support team as soon as possible. Changes or cancellation may be possible before processing or dispatch begins. Once shipped, the order is handled under our Return Policy.' },
  { category: 'Orders', question: 'Where can I see my previous orders?', answer: 'Sign in to your AgriEra account and open the My Orders section in your dashboard. It contains your order history, status, totals, and available actions.' },
  { category: 'Products', question: 'How do I choose the right product for my crop?', answer: 'Review the product description, crop suitability, dosage, and usage instructions. For recommendations based on your farm conditions, book a consultation with an AgriEra agricultural expert.' },
  { category: 'Products', question: 'Are the products sold by AgriEra genuine?', answer: 'AgriEra aims to source products from trusted manufacturers and authorized supply channels. Check each package, label, batch number, seal, and expiry date when your order arrives.' },
  { category: 'Products', question: 'What should I do if a product arrives damaged?', answer: 'Contact support within 48 hours of delivery. Include your order number and clear photos or video of the outer package, shipping label, damaged product, batch number, and seal.' },
  { category: 'Services', question: 'Which agricultural services are available?', answer: 'Our services include farm development, well development, drip irrigation planning, farm consultancy, and other practical agricultural support. Availability depends on your location and project requirements.' },
  { category: 'Services', question: 'How do I book a farm consultation?', answer: 'Visit the Farm Consultancy page, complete the enquiry form, and submit your farm details. Our team will contact you to understand the requirement and arrange the next step.' },
  { category: 'Services', question: 'Do you guarantee crop yield or farm results?', answer: 'No specific outcome can be guaranteed. Results depend on weather, soil, water, pests, crop variety, field practices, and other external factors. Our team provides professional recommendations based on available information.' },
  { category: 'Account', question: 'Do I need an account to shop?', answer: 'You can browse products without an account. An account helps you manage profile information, orders, addresses, and other personalized features.' },
  { category: 'Account', question: 'I forgot my password. How can I reset it?', answer: 'Open the login page and select the password recovery option. Follow the instructions sent to your registered email address. Contact support if you cannot access that email.' },
  { category: 'Delivery', question: 'How long does delivery take?', answer: 'Delivery time depends on the product, destination postcode, carrier network, and order processing requirements. The available estimate is shown during checkout or in your order status.' },
  { category: 'Delivery', question: 'How can I track my shipment?', answer: 'Tracking details are shown in My Orders when available and may also be sent by email or SMS after dispatch. Carrier updates can take a short time to appear.' },
  { category: 'Delivery', question: 'Does AgriEra deliver everywhere in India?', answer: 'We deliver eligible products to serviceable locations across India. Availability depends on postcode coverage, product type, package size, and applicable transport restrictions.' },
];

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqs[0].question);

  const visibleFaqs = useMemo(() => {
    const term = query.trim().toLowerCase();
    return faqs.filter((faq) =>
      (activeCategory === 'All' || faq.category === activeCategory) &&
      (!term || faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term))
    );
  }, [activeCategory, query]);

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <div className="faq-hero-inner">
          <span className="faq-eyebrow"><Leaf size={15} /> Help Center</span>
          <h1>Frequently Asked Questions</h1>
          <p>Find quick answers about AgriEra products, orders, farm services, delivery, and your account.</p>
          <label className="faq-search">
            <Search size={19} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for an answer..." aria-label="Search frequently asked questions" />
          </label>
        </div>
      </section>

      <main className="faq-main">
        <div className="faq-category-tabs" aria-label="FAQ categories">
          {categories.map((category) => (
            <button key={category} type="button" className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>
          ))}
        </div>

        <div className="faq-layout">
          <section className="faq-list" aria-live="polite">
            {visibleFaqs.map((faq) => {
              const isOpen = openQuestion === faq.question;
              return (
                <article className={`faq-item ${isOpen ? 'open' : ''}`} key={faq.question}>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpenQuestion(isOpen ? null : faq.question)}>
                    <span><small>{faq.category}</small>{faq.question}</span>
                    <ChevronDown size={20} />
                  </button>
                  <div className="faq-answer"><p>{faq.answer}</p></div>
                </article>
              );
            })}
            {visibleFaqs.length === 0 && <div className="faq-empty"><HelpCircle size={30} /><h2>No matching questions</h2><p>Try another search term or select a different category.</p></div>}
          </section>

          <aside className="faq-support-card">
            <div><HelpCircle size={27} /></div>
            <h2>Still have questions?</h2>
            <p>Our support team is ready to help with products, orders, or agricultural services.</p>
            <Link to="/contact">Contact Support</Link>
            <a href="mailto:support@AgriEra.in"><Mail size={15} /> support@AgriEra.in</a>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default FaqPage;
