import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FileCheck, Mail, Phone, MessageCircle, MapPin } from 'lucide-react'
import { COMPANY } from '../api.js'
import './legal.css'
import './pages.css'

export default function TermsConditions() {
  return (
    <div className="page legal-page">
      <Helmet>
        <title>Terms & Conditions | DSK Printers</title>
        <meta
          name="description"
          content="Terms and Conditions of service for DSK Printers. Read our policies regarding custom orders, design approvals, pricing, payments, and 50+ wash durability."
        />
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Terms &amp; Conditions</span>
          </nav>
          <h1>Terms &amp; Conditions</h1>
          <p>
            Please read these terms and conditions carefully before placing your custom printing orders with DSK Printers.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-content">
            <p className="legal-last-updated">Last updated: October 2026</p>

            <div className="legal-highlight alert-blue">
              <p>
                Welcome to <strong>DSK Printers</strong>. By accessing our website, requesting a quote, submitting artwork, or confirming an order via our website, WhatsApp, phone, or in person, you agree to be bound by these Terms and Conditions.
              </p>
            </div>

            <h2>1. Acceptance of Terms</h2>
            <p>
              These Terms &amp; Conditions govern the commercial relationship between DSK Printers (operating from Naraina Industrial Area Phase 2, New Delhi, GSTIN: <strong>{COMPANY.gst}</strong>) and you (the &quot;Client&quot; or &quot;Customer&quot;). If you do not agree with any part of these terms, please do not initiate an order or upload files to our service.
            </p>

            <h2>2. Services Offered</h2>
            <p>
              DSK Printers is an in-house manufacturer and service provider specializing in customized commercial printing, including:
            </p>
            <ul>
              <li><strong>Direct-to-Film (DTF) Transfer Sheets &amp; Rolls:</strong> Cold/warm peel film transfers for cotton, polyester, blends, denim, and fleece garments.</li>
              <li><strong>UV DTF Transfer Stickers:</strong> 3D embossed, peel-and-stick hard surface decals for metal, plastic, glass, acrylic, ceramics, leather, and wood.</li>
              <li><strong>Custom Apparel &amp; Merchandise:</strong> Printed round neck t-shirts, polo t-shirts, corporate uniforms, hoodies, caps, tote bags, and promotional garments.</li>
              <li><strong>Specialty Transfers:</strong> Silicone heat transfers, plastisol screen-printed transfers, and high-density labels.</li>
            </ul>

            <h2>3. Order Process &amp; Design Approval</h2>
            <p>
              Because every order is custom-manufactured to client specifications, we operate on a streamlined verification workflow:
            </p>
            <ol>
              <li>
                <strong>Enquiry &amp; Artwork Submission:</strong> The client shares artwork files, desired dimensions (in inches or centimetres), material type, and quantities via our website quote form, WhatsApp, or email.
              </li>
              <li>
                <strong>Quotation &amp; Digital Proof:</strong> Our production team reviews the file resolution, prepares a size layout or digital mock-up, and provides an all-inclusive quotation.
              </li>
              <li>
                <strong>Proof Approval:</strong> The client must inspect the digital proof thoroughly (including spelling, colors, dimensions, and layout) and confirm approval in writing (via WhatsApp or email).
              </li>
              <li>
                <strong>Order Confirmation:</strong> An order is deemed confirmed only after written design approval and receipt of the required advance payment.
              </li>
            </ol>
            <div className="legal-highlight alert-red">
              <p>
                <strong>Important:</strong> Once a digital proof is approved and sent to our printing machines, no further design modifications, size adjustments, or text corrections can be accommodated.
              </p>
            </div>

            <h2>4. Pricing &amp; Minimum Order Quantities</h2>
            <ul>
              <li>
                <strong>Measurement &amp; Rates:</strong> DTF transfers are generally priced per square inch or running meter. UV DTF decals and apparel are priced per unit or sheet based on overall surface area, artwork complexity, and ordered quantity tiers.
              </li>
              <li>
                <strong>Volume Tiers:</strong> Lower per-unit rates apply to bulk wholesale volumes. Rates quoted in an estimate are valid for 15 calendar days from the date of issuance.
              </li>
              <li>
                <strong>Taxes:</strong> All commercial orders are subject to applicable Goods and Services Tax (GST) as mandated by the Government of India. Valid GST tax invoices are provided for every transaction.
              </li>
            </ul>

            <h2>5. Payment Terms</h2>
            <p>
              As all items are custom-manufactured and cannot be repurposed or resold to any other customer:
            </p>
            <ul>
              <li><strong>Advance Payment:</strong> 100% advance payment is required for custom DTF rolls and print-only jobs before production begins. For large bulk garment production orders, a minimum 50% advance deposit is required to start production, with the balance due prior to courier dispatch or upon factory pickup.</li>
              <li><strong>Accepted Modes of Payment:</strong> We accept UPI (Google Pay, PhonePe, Paytm, BHIM), IMPS / NEFT / RTGS bank transfer, and cash at our Delhi factory.</li>
              <li><strong>Payment Confirmation:</strong> Jobs enter the production queue only after funds reflect in our bank account or our accounts team confirms the payment slip.</li>
            </ul>

            <h2>6. Customer Artwork &amp; Intellectual Property</h2>
            <p>
              You, as the customer, represent and warrant that you own all copyrights, trademarks, licensing rights, or commercial permissions for all logos, brand identities, text, and artwork submitted to DSK Printers.
            </p>
            <div className="legal-highlight">
              <p>
                <strong>Indemnification:</strong> DSK Printers assumes no liability for copyright or trademark infringement arising from customer-provided graphics. The customer agrees to defend, indemnify, and hold harmless DSK Printers, its proprietors, and employees against any legal actions, claims, damages, or expenses arising from alleged infringement of third-party intellectual property rights.
              </p>
            </div>

            <h2>7. Quality Assurance &amp; 50+ Wash Durability</h2>
            <p>
              We stand behind the engineering of our printing processes:
            </p>
            <ul>
              <li>
                <strong>50+ Wash Durability Guarantee:</strong> Our DTF prints are manufactured using high-grade imported inks and hot-melt TPU adhesive powders. When transferred using appropriate heat press parameters (150°C–160°C for 12–15 seconds with medium-heavy pressure) and washed inside-out in cold or lukewarm water, our prints are tested to withstand 50+ domestic wash cycles without cracking or peeling.
              </li>
              <li>
                <strong>Color Representation:</strong> Digital displays operate in RGB mode, whereas high-speed textile printers utilize CMYK+White inks. A slight, normal variance of 5%–10% between screen appearance and final print output is standard in the textile and printing industry.
              </li>
            </ul>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law:
            </p>
            <ul>
              <li>DSK Printers shall not be held liable for indirect, incidental, special, punitive, or consequential damages, including loss of business profits, event deadlines, or reputational damage.</li>
              <li>DSK Printers&apos; total aggregate liability for any claim arising out of or related to an order, whether in contract, tort, or warranty, shall strictly not exceed the total amount paid by the customer for that specific order invoice.</li>
            </ul>

            <h2>9. Force Majeure</h2>
            <p>
              DSK Printers shall not be deemed in breach of this agreement due to delays or failures in performance caused by circumstances beyond reasonable control, including power grid outages, raw material supply chain interruptions, courier strikes, extreme weather, flooding, lockdowns, or acts of government.
            </p>

            <h2>10. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms &amp; Conditions and any transactions between DSK Printers and the customer shall be governed by and construed in accordance with the laws of India. Any disputes or legal proceedings arising hereunder shall be subject to the exclusive jurisdiction of the competent courts located in <strong>New Delhi, Delhi, India</strong>.
            </p>

            <h2>11. Contact Information</h2>
            <p>
              For legal notices, business queries, or clarification on our terms, please contact:
            </p>

            <div className="legal-contact-grid">
              <a href={`mailto:${COMPANY.email}`} className="legal-contact-item">
                <Mail size={18} />
                <span>{COMPANY.email}</span>
              </a>
              <a href={`tel:${COMPANY.phone}`} className="legal-contact-item">
                <Phone size={18} />
                <span>{COMPANY.phone}</span>
              </a>
              <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer" className="legal-contact-item">
                <MessageCircle size={18} />
                <span>WhatsApp Business</span>
              </a>
              <div className="legal-contact-item">
                <MapPin size={18} />
                <span>GSTIN: {COMPANY.gst}</span>
              </div>
            </div>

            <div className="legal-quick-actions">
              <a
                href={COMPANY.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-blue"
              >
                <MessageCircle size={18} /> Speak with Support
              </a>
              <Link to="/contact" className="btn btn-outline">
                Contact Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
