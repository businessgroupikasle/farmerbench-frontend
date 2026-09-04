import React from 'react';
import { Leaf, Mail, MapPin, RefreshCcw, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TermsPage.css';

const sections = [
  { id: 'window', title: '1. Return Request Window', content: <>Contact AgriEra within 7 calendar days of delivery to request an eligible return. Damaged, leaking, missing, expired, or incorrect products should be reported within 48 hours of delivery so we can investigate promptly. A request submitted within the applicable period is still subject to verification and the conditions below.</> },
  { id: 'eligible', title: '2. Eligible Returns', content: <>A product may be eligible when it is unused, unopened, in its original packaging, and returned with its labels, accessories, manuals, invoice, and any promotional items. Products delivered in a damaged or defective condition, or products materially different from the confirmed order, may also qualify after review.</> },
  { id: 'excluded', title: '3. Non-Returnable Products', content: <>Unless defective or required by applicable law, we cannot accept opened, used, altered, contaminated, expired after delivery, or improperly stored products. Perishable goods, live plants, seeds with broken seals, customized orders, clearance items, and chemicals or biological products with compromised packaging may also be excluded for safety and quality reasons.</> },
  { id: 'evidence', title: '4. Photos and Supporting Evidence', content: <>Please provide your order number, the affected item name and quantity, a description of the issue, and clear photos or video of the product, package, shipping label, seal, batch number, and expiry date where applicable. Keep all items and packaging until we confirm that the review is complete.</> },
  { id: 'process', title: '5. Return Authorization Process', content: <>Do not send a product back without authorization. Our support team will review the request and provide approval, pickup instructions, or a return address when eligible. Items returned without authorization, by an unsupported delivery method, or in a condition different from the submitted evidence may be refused.</> },
  { id: 'pickup', title: '6. Pickup and Return Shipping', content: <>For verified damaged, defective, or incorrect products, AgriEra will normally arrange or reimburse reasonable return shipping. For other approved returns, return delivery charges may be paid by the customer and original shipping charges may be non-refundable. Pickup availability depends on the delivery postcode and carrier network.</> },
  { id: 'inspection', title: '7. Inspection and Approval', content: <>Returned products are inspected for identity, condition, packaging, quantity, batch details, and stated reason. We will notify you whether the return is approved, partially approved, or rejected. Normal packaging variation, minor cosmetic differences, or damage caused after delivery may not qualify.</> },
  { id: 'replacement', title: '8. Replacements', content: <>When a verified product is damaged, defective, missing, or incorrect, we may offer a replacement subject to stock and delivery availability. If replacement is unavailable or impractical, we may offer a refund or another appropriate resolution.</> },
  { id: 'refunds', title: '9. Refunds', content: <>Approved refunds are issued to the original payment method wherever possible. Bank and payment-provider processing times may apply after we initiate the refund. Cash-on-delivery orders may require verified bank or payment details. Any permitted deductions will be explained before the refund is completed.</> },
  { id: 'cancellations', title: '10. Order Cancellations', content: <>You may request cancellation before an order enters dispatch, but cancellation is not guaranteed once processing has begun. After dispatch, the order is handled under this Return Policy. AgriEra may cancel an item because of stock, pricing, payment, address, safety, or delivery restrictions and will refund any applicable amount collected.</> },
  { id: 'services', title: '11. Services and Digital Items', content: <>Farm consultations, site visits, planning work, and other services are not returned like physical goods. Cancellation or rescheduling depends on the service terms, work already performed, travel committed, and the agreed scope. Downloaded or delivered digital materials are generally non-returnable except where required by law.</> },
  { id: 'abuse', title: '12. Misuse of the Return Process', content: <>We may limit or reject requests involving altered evidence, repeated unreasonable claims, substituted products, missing components, unsafe handling, or other suspected misuse. This does not restrict any mandatory consumer right available under applicable law.</> },
];

export const ReturnPolicyPage: React.FC = () => (
  <div className="terms-page return-policy-page">
    <section className="terms-hero">
      <div className="terms-hero-inner">
        <div className="terms-hero-icon"><RotateCcw size={27} /></div>
        <div>
          <span className="terms-eyebrow"><Leaf size={14} /> Returns &amp; Refunds</span>
          <h1>Return Policy</h1>
          <p>Understand when a product can be returned, how to submit a request, and how replacements and refunds are handled.</p>
          <span className="terms-updated">Effective date: September 4, 2026</span>
        </div>
      </div>
    </section>

    <div className="terms-layout">
      <aside className="terms-nav" aria-label="Return policy sections">
        <strong>On this page</strong>
        {sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title.replace(/^\d+\. /, '')}</a>)}
      </aside>

      <main className="terms-content">
        <div className="terms-intro">
          <p><strong>Our return commitment:</strong> If an eligible order arrives damaged, defective, or incorrect, tell us promptly and we will work toward a fair resolution.</p>
        </div>
        {sections.map((section) => (
          <section id={section.id} className="terms-section" key={section.id}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </section>
        ))}
        <section className="terms-contact">
          <RefreshCcw size={28} aria-hidden="true" />
          <h2>Start a return request</h2>
          <p>Contact support with your order number, reason for return, and clear supporting photos.</p>
          <div><a href="mailto:support@AgriEra.in"><Mail size={16} /> support@AgriEra.in</a><span><MapPin size={16} /> Coimbatore, Tamil Nadu, India</span></div>
          <Link to="/contact">Contact Return Support</Link>
        </section>
        <p className="terms-legal-note">This policy is a general business template and should be reviewed by qualified legal counsel before production use.</p>
      </main>
    </div>
  </div>
);

export default ReturnPolicyPage;
