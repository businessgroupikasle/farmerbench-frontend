import React from 'react';
import { Leaf, Mail, MapPin, PackageCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TermsPage.css';

const sections = [
  { id: 'coverage', title: '1. Shipping Coverage', content: <>AgriEra ships eligible agricultural products to serviceable addresses across India. Availability may depend on your postcode, carrier coverage, product type, quantity, and regulatory or handling requirements. A product that can be viewed online may not be deliverable to every location.</> },
  { id: 'processing', title: '2. Order Processing', content: <>Orders are generally prepared after payment and order verification. Processing time may vary for weekends, public holidays, high-demand periods, bulk orders, customized items, or products requiring special handling. You will receive confirmation when your order is accepted and again when it is dispatched.</> },
  { id: 'estimates', title: '3. Delivery Estimates', content: <>Estimated delivery dates shown during checkout are estimates rather than guarantees. Delivery time begins after dispatch and may change because of destination, carrier capacity, weather, road conditions, regional restrictions, or other circumstances outside our reasonable control.</> },
  { id: 'charges', title: '4. Shipping Charges', content: <>Shipping charges, when applicable, are calculated using the delivery address, package weight, dimensions, order value, and delivery method. The complete charge is displayed before you confirm payment. Additional handling fees may apply to oversized, heavy, fragile, or specially regulated products.</> },
  { id: 'tracking', title: '5. Tracking Your Order', content: <>When tracking is available, the tracking number or delivery status will be provided through your account, email, SMS, or another registered contact method. Carrier updates can take time to appear after dispatch. You can also review your order status from the My Orders section of your account.</> },
  { id: 'receipt', title: '6. Delivery and Receipt', content: <>Please provide a complete and accurate address, postcode, landmark, and reachable phone number. Someone authorized should be available to receive the shipment. Risk of loss passes in accordance with applicable law and the confirmed delivery record. Do not accept a package that is visibly opened or severely damaged without noting the issue with the carrier.</> },
  { id: 'attempts', title: '7. Failed Delivery Attempts', content: <>A carrier may make one or more delivery attempts. If delivery fails because the address is incorrect, the recipient is unavailable, or the shipment is refused without a valid reason, the package may be returned to us. Re-shipping charges or return-to-origin fees may be deducted where permitted.</> },
  { id: 'damage', title: '8. Damaged, Missing, or Incorrect Items', content: <>Inspect your order promptly after delivery. If an item is damaged, missing, leaking, expired, or different from what you ordered, contact us within 48 hours and provide the order number, package label, and clear photos or video. Keep the product and original packaging until the review is complete.</> },
  { id: 'restrictions', title: '9. Product Restrictions', content: <>Certain liquids, chemicals, fertilizers, biological products, seeds, or bulky equipment may have route, quantity, documentation, or destination restrictions. We may split an order into multiple shipments or cancel a restricted item and refund its applicable value.</> },
  { id: 'delays', title: '10. Delays and Force Majeure', content: <>AgriEra is not responsible for delivery delays caused by natural events, extreme weather, strikes, government action, transport disruption, carrier failure, local closures, or other events beyond reasonable control. We will make reasonable efforts to share available updates and assist with the shipment.</> },
  { id: 'changes', title: '11. Address Changes and Cancellation', content: <>Contact us immediately if a delivery address must be corrected. We cannot guarantee changes after an order enters processing or has shipped. Cancellation eligibility depends on the order status and is subject to our Terms & Conditions and return policy.</> },
  { id: 'support', title: '12. Shipping Support', content: <>For delivery assistance, share your order number and registered contact details with our support team. Never share payment passwords or one-time verification codes with a courier or anyone claiming to provide shipment support.</> },
];

export const ShippingPolicyPage: React.FC = () => (
  <div className="terms-page shipping-policy-page">
    <section className="terms-hero">
      <div className="terms-hero-inner">
        <div className="terms-hero-icon"><Truck size={27} /></div>
        <div>
          <span className="terms-eyebrow"><Leaf size={14} /> Orders &amp; Delivery</span>
          <h1>Shipping Policy</h1>
          <p>Clear information about order processing, delivery estimates, tracking, shipping charges, and delivery support.</p>
          <span className="terms-updated">Effective date: September 4, 2026</span>
        </div>
      </div>
    </section>

    <div className="terms-layout">
      <aside className="terms-nav" aria-label="Shipping policy sections">
        <strong>On this page</strong>
        {sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title.replace(/^\d+\. /, '')}</a>)}
      </aside>

      <main className="terms-content">
        <div className="terms-intro">
          <p><strong>Our delivery commitment:</strong> We carefully prepare agricultural products and work with delivery partners to get every eligible order to you safely and as quickly as practical.</p>
        </div>

        {sections.map((section) => (
          <section id={section.id} className="terms-section" key={section.id}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </section>
        ))}

        <section className="terms-contact">
          <PackageCheck size={28} aria-hidden="true" />
          <h2>Need help with a delivery?</h2>
          <p>Have your order number ready and contact our support team.</p>
          <div><a href="mailto:support@AgriEra.in"><Mail size={16} /> support@AgriEra.in</a><span><MapPin size={16} /> Coimbatore, Tamil Nadu, India</span></div>
          <Link to="/contact">Contact Shipping Support</Link>
        </section>
      </main>
    </div>
  </div>
);

export default ShippingPolicyPage;
