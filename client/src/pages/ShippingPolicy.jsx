import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Truck, Package, Clock, MapPin, Mail, Phone, MessageCircle } from 'lucide-react'
import { COMPANY } from '../api.js'
import './legal.css'
import './pages.css'

export default function ShippingPolicy() {
  return (
    <div className="page legal-page">
      <Helmet>
        <title>Shipping & Delivery Policy | DSK Printers</title>
        <meta
          name="description"
          content="Shipping and delivery policy of DSK Printers. Pan-India delivery via top couriers, production timelines, safe tube packaging, and Delhi factory pickup options."
        />
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Shipping Policy</span>
          </nav>
          <h1>Shipping &amp; Delivery Policy</h1>
          <p>
            Fast, secure Pan-India delivery for DTF transfer rolls, UV DTF stickers, and customized merchandise from our New Delhi production facility.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-content">
            <p className="legal-last-updated">Last updated: October 2026</p>

            <div className="legal-highlight alert-blue">
              <p>
                <strong>DSK Printers</strong> partners with India&apos;s leading express couriers and surface cargo networks to ensure your custom print orders reach your doorstep quickly, safely, and securely anywhere across India.
              </p>
            </div>

            <h2>1. Pan-India Shipping Coverage</h2>
            <p>
              We deliver to over <strong>19,000+ PIN codes across all 28 states and 8 union territories</strong> in India. Shipments are handled through reliable logistics providers including <strong>Blue Dart, DTDC, Delhivery, Trackon, Tirupati Courier, and India Post Speed Post</strong>.
            </p>

            <h2>2. Order Processing &amp; Production Timelines</h2>
            <p>
              Because every order is custom-manufactured to order, the fulfillment cycle consists of two phases: <em>Production Time</em> and <em>Transit Time</em>.
            </p>
            <ul>
              <li>
                <strong>Design Approval &amp; Payment Confirmation:</strong> The production clock begins only after you approve the digital mock-up/size proof and advance payment is confirmed.
              </li>
              <li>
                <strong>Standard DTF Rolls &amp; UV Stickers:</strong> Ready for dispatch within <strong>2 to 3 business days</strong>.
              </li>
              <li>
                <strong>Custom T-Shirts, Hoodies &amp; Bulk Apparel:</strong> Ready for dispatch within <strong>3 to 5 business days</strong> depending on order volume and garment inventory.
              </li>
              <li>
                <strong>Same-Day / Rush Printing:</strong> Urgent express jobs may be accommodated upon prior request and machine availability (subject to rush production fees).
              </li>
            </ul>

            <h2>3. Transit &amp; Delivery Timelines</h2>
            <p>
              Once your order is handed over to the courier partner, estimated transit times are as follows:
            </p>
            <ul>
              <li><strong>Delhi NCR:</strong> 1 to 2 business days after dispatch.</li>
              <li><strong>Metro Cities (Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Ahmedabad, Pune):</strong> 2 to 4 business days.</li>
              <li><strong>Tier 2 &amp; Tier 3 Cities:</strong> 3 to 6 business days.</li>
              <li><strong>North-East, Jammu &amp; Kashmir, and Remote Locations:</strong> 5 to 8 business days.</li>
            </ul>
            <p>
              <em>Note: Sundays and public holidays are non-working days for production and courier hubs. Adverse weather conditions or regional logistical restrictions may occasionally impact transit timelines.</em>
            </p>

            <h2>4. Shipping Charges &amp; Transparent Billing</h2>
            <p>
              Shipping costs are calculated transparently based on <strong>actual or volumetric weight</strong> (whichever is higher) and the destination delivery PIN code.
            </p>
            <ul>
              <li>All shipping charges are communicated upfront in your quotation before you confirm the order.</li>
              <li>There are no hidden handling fees or surprise surcharges added at dispatch.</li>
              <li>For orders qualifying under special promotional offers or high-volume wholesale agreements, subsidized or free standard delivery terms may apply as confirmed in writing.</li>
            </ul>

            <h2>5. Protective &amp; Heavy-Duty Packaging</h2>
            <p>
              Printed transfer films and UV stickers require specialized handling to reach you in pristine condition. We pack every order using commercial industrial packaging:
            </p>
            <ul>
              <li>
                <strong>Rigid Cylindrical Mailing Tubes:</strong> DTF transfer rolls and gang sheets are rolled carefully and encased inside thick, heavy-duty cardboard tubes to prevent folding, creasing, and edge denting.
              </li>
              <li>
                <strong>Moisture Barrier Wrapping:</strong> Rolls and sheets are sealed in protective plastic sleeves with moisture-absorbing silica packets to protect against monsoon humidity and temperature shifts.
              </li>
              <li>
                <strong>Reinforced Corrugated Cartons:</strong> Custom printed t-shirts, caps, and bulk garments are packed in heavy ply outer cartons securely taped with tamper-evident packaging tape.
              </li>
            </ul>

            <h2>6. Consignment Tracking &amp; Updates</h2>
            <div className="legal-highlight alert-green">
              <p>
                <strong>Real-Time Tracking:</strong> As soon as your parcel is scanned by the courier partner, we generate a docket tracking number and send the live tracking link directly to your registered WhatsApp number and email.
              </p>
            </div>
            <p>
              You can track the live movement of your parcel on the courier&apos;s online portal at any time. Our dispatch team also monitors active shipments to resolve transit bottlenecks.
            </p>

            <h2>7. Delivery Attempts &amp; Undelivered Shipments</h2>
            <ul>
              <li>
                <strong>Delivery Attempts:</strong> The courier partner will make up to <strong>2 to 3 delivery attempts</strong> to the provided address. Courier personnel typically call the recipient&apos;s phone number before delivery.
              </li>
              <li>
                <strong>Accurate Address Requirement:</strong> Customers are responsible for providing complete shipping information, including landmark, correct PIN code, and active mobile number.
              </li>
              <li>
                <strong>Returned Shipments (RTO):</strong> If a consignment is returned to our Delhi facility due to an incomplete address, incorrect phone number, recipient unavailability, or refusal to accept delivery, the customer is responsible for the return-to-origin freight and re-shipping charges.
              </li>
            </ul>

            <h2>8. Bulk Cargo &amp; Surface Transport</h2>
            <p>
              For large commercial wholesale orders (e.g., 500+ t-shirts, multiple rolls of 100-meter DTF films, or heavy promotional goods), we utilize cost-effective surface cargo and transport networks such as <strong>V-Trans, TCI Express, Gati-KWE, or Safechem Logistics</strong>. Surface transport timelines and transporter bilty (LR) details are shared immediately upon handover.
            </p>

            <h2>9. Free Local Pickup from Delhi Factory</h2>
            <div className="legal-highlight">
              <p>
                <strong>Zero Shipping Cost:</strong> If you are based in or visiting Delhi NCR, you can choose <strong>Self-Pickup</strong> directly from our Naraina Industrial Area factory at no delivery charge.
              </p>
            </div>
            <p>
              You may also arrange your own on-demand pickup using bike/courier logistics apps such as <strong>Dunzo, Porter, Borzo (WeFast), or Uber Package</strong> once our team confirms your order is packed and ready.
            </p>

            <h2>10. Shipping Inquiries &amp; Support</h2>
            <p>
              For urgent dispatch tracking, expedited air shipping requests, or factory pickup coordination, reach out to our dispatch desk:
            </p>

            <div className="legal-contact-grid">
              <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer" className="legal-contact-item">
                <MessageCircle size={18} />
                <span>Track on WhatsApp</span>
              </a>
              <a href={`tel:${COMPANY.phone}`} className="legal-contact-item">
                <Phone size={18} />
                <span>Call {COMPANY.phone}</span>
              </a>
              <a href={`mailto:${COMPANY.email}`} className="legal-contact-item">
                <Mail size={18} />
                <span>{COMPANY.email}</span>
              </a>
              <div className="legal-contact-item">
                <MapPin size={18} />
                <span>Naraina Phase 2, New Delhi</span>
              </div>
            </div>

            <div className="legal-quick-actions">
              <a
                href={COMPANY.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-blue"
              >
                <MessageCircle size={18} /> Check Shipment Status
              </a>
              <Link to="/contact" className="btn btn-outline">
                Factory Directions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
