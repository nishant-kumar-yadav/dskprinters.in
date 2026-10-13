import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { RotateCcw, AlertTriangle, CheckCircle, Mail, Phone, MessageCircle } from 'lucide-react'
import { COMPANY } from '../api.js'
import './legal.css'
import './pages.css'

export default function RefundPolicy() {
  return (
    <div className="page legal-page">
      <Helmet>
        <title>Refund & Cancellation Policy | DSK Printers</title>
        <meta
          name="description"
          content="Refund and cancellation policy of DSK Printers. Clear guidelines on custom printing orders, defect replacements, transit damages, and refund processing."
        />
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Refund &amp; Cancellation Policy</span>
          </nav>
          <h1>Refund &amp; Cancellation Policy</h1>
          <p>
            Clear, transparent policies on order cancellations, defect replacements, and refund processing for custom printing orders.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-content">
            <p className="legal-last-updated">Last updated: October 2026</p>

            <div className="legal-highlight alert-blue">
              <p>
                At <strong>DSK Printers</strong>, our primary goal is your complete satisfaction. Because every single DTF sticker, UV DTF decal, and printed garment is custom manufactured to your bespoke specifications, standard retail return policies cannot apply. Please review the terms below before confirming your order.
              </p>
            </div>

            <h2>1. The Custom-Made Nature of Our Products</h2>
            <p>
              Unlike off-the-shelf commercial goods, all items produced by DSK Printers are strictly customized with your personalized artwork, branding, dimensions, and specifications. Once raw materials (DTF PET film, inks, hot-melt powder, UV varnishes, or blank apparel) are printed with your artwork, they have zero resale value and cannot be restocked.
            </p>

            <h2>2. Order Cancellation Policy</h2>

            <h3>A. Cancellation Before Production Begins</h3>
            <div className="legal-highlight alert-green">
              <p>
                <strong>100% Full Refund:</strong> If you notify us to cancel your order <em>before</em> our pre-press team has loaded your artwork into our RIP software or initiated film printing, you will receive a full 100% refund of any advance payment.
              </p>
            </div>

            <h3>B. Cancellation After Production Commences</h3>
            <div className="legal-highlight alert-red">
              <p>
                <strong>Non-Refundable:</strong> Once your artwork has been RIP-processed, film printing has begun, or apparel cutting/blank staging has started, orders cannot be cancelled, modified, or refunded under any circumstances.
              </p>
            </div>

            <h2>3. Defective Products &amp; Reprint Guarantee</h2>
            <p>
              We maintain rigorous quality control across every meter of film and garment. However, if a manufacturing defect slips past our inspection, we are committed to making it right immediately with a <strong>free reprint or full replacement</strong>.
            </p>
            <p>Qualifying manufacturing defects include:</p>
            <ul>
              <li>Ink head banding, smudging, or severe missing color lines caused by printer failure.</li>
              <li>Improper powder adhesion or curing failure resulting in film peeling during standard heat pressing.</li>
              <li>Incorrect print dimensions deviating noticeably from your approved digital proof.</li>
              <li>Incorrect garment sizes or blank styles differing from your confirmed order invoice.</li>
            </ul>

            <div className="legal-highlight">
              <p>
                <strong>Reporting Window:</strong> Any manufacturing defects must be reported to our team within <strong>48 hours of parcel delivery</strong> along with high-definition photographs and video proof demonstrating the issue.
              </p>
            </div>

            <h2>4. Transit Damage &amp; Courier Handling</h2>
            <p>
              All DTF rolls and UV stickers are packaged inside sturdy, heavy-duty cylindrical mailing tubes or reinforced corrugated boxes to prevent transport crushing. In the rare event that a courier mishandles your package:
            </p>
            <ul>
              <li>
                <strong>Mandatory Unboxing Video:</strong> You must record a continuous, unedited video of unpacking the parcel, clearly showing the courier shipping label, outer box condition, and the damaged products inside.
              </li>
              <li>
                <strong>Reporting Deadline:</strong> Transit damage claims must be lodged within <strong>24 hours of package delivery</strong>. Claims submitted after 24 hours without an unboxing video cannot be accepted by courier insurance partners.
              </li>
              <li>
                <strong>Resolution:</strong> Once transit damage is validated, we will rush a priority reprint of the damaged items at zero additional cost.
              </li>
            </ul>

            <h2>5. Color Variation &amp; Artwork Disclaimers</h2>
            <p>
              Please note that the following factors are inherent to digital printing and do not qualify for returns, reprints, or refunds:
            </p>
            <ul>
              <li>
                <strong>RGB vs CMYK Color Shift:</strong> Computer monitors, smartphones, and tablet screens display colors using backlit RGB light. Large-format printers print with CMYK+White inks on physical film and fabric. A minor variance of 5%–10% between screen appearance and final print output is normal and expected.
              </li>
              <li>
                <strong>Low Resolution Files:</strong> If customer-supplied artwork is blurry, pixelated, or below the recommended 300 DPI resolution, the print will faithfully replicate that pixelation. DSK Printers is not responsible for print degradation resulting from low-quality source files.
              </li>
              <li>
                <strong>Incorrect Application:</strong> DTF transfers require accurate heat press parameters (temperature, dwell time, and pressure) as detailed in our application guides. Failures resulting from using domestic household steam irons, inaccurate heat press calibration, or peeling at incorrect temperatures are not manufacturing defects.
              </li>
            </ul>

            <h2>6. Refund Processing Timeline</h2>
            <p>
              When a refund is approved by our management team (e.g., pre-production cancellations or validated mutual agreement):
            </p>
            <ul>
              <li>Refunds are credited back to the <strong>original payment method</strong> (original UPI ID, bank account, or digital wallet).</li>
              <li>The refund process is initiated within <strong>2 business days</strong> of approval.</li>
              <li>Depending on your banking institution, funds typically reflect in your account within <strong>7 to 10 business days</strong>.</li>
              <li>A digital payment confirmation receipt will be shared with you via WhatsApp or email once dispatched.</li>
            </ul>

            <h2>7. How to Raise a Complaint or Claim</h2>
            <p>
              To report a defect, damaged delivery, or request a cancellation, please follow these simple steps:
            </p>
            <ol>
              <li>Send a message to our WhatsApp support at <strong>{COMPANY.phone}</strong> or email <strong>{COMPANY.email}</strong>.</li>
              <li>Provide your Order / Invoice number and date of delivery.</li>
              <li>Attach clear photos showing the defect, along with your unboxing video (for transit damage claims).</li>
              <li>Our dedicated production manager will review your submission and respond within <strong>4 to 8 business hours</strong> with a resolution plan.</li>
            </ol>

            <div className="legal-contact-grid">
              <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer" className="legal-contact-item">
                <MessageCircle size={18} />
                <span>WhatsApp Claim Desk</span>
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
                <CheckCircle size={18} />
                <span>Factory: Naraina Phase 2, Delhi</span>
              </div>
            </div>

            <div className="legal-quick-actions">
              <a
                href={COMPANY.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-blue"
              >
                <MessageCircle size={18} /> Report an Issue on WhatsApp
              </a>
              <Link to="/contact" className="btn btn-outline">
                Contact Customer Care
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
