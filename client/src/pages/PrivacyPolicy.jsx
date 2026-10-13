import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Shield, Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { COMPANY } from '../api.js'
import './legal.css'
import './pages.css'

export default function PrivacyPolicy() {
  return (
    <div className="page legal-page">
      <Helmet>
        <title>Privacy Policy | DSK Printers</title>
        <meta
          name="description"
          content="Privacy Policy for DSK Printers. Learn how we collect, use, and protect your personal and order data in compliance with the DPDP Act 2023."
        />
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Privacy Policy</span>
          </nav>
          <h1>Privacy Policy</h1>
          <p>
            How DSK Printers handles your information, artwork files, and order data with care and complete transparency.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-content">
            <p className="legal-last-updated">Last updated: October 2026</p>

            <div className="legal-highlight alert-blue">
              <p>
                <strong>DSK Printers</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your personal privacy and safeguarding your custom designs and order information. We operate in accordance with Indian data protection laws, including the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act 2023)</strong>.
              </p>
            </div>

            <h2>1. Information We Collect</h2>
            <p>
              Because DSK Printers operates as a custom manufacturing and printing service (offering DTF stickers, UV DTF transfers, custom apparel, and branded promotional merchandise), we collect information necessary to fulfill custom orders, prepare price quotes, and maintain business communications.
            </p>
            <p>The information we collect includes:</p>
            <ul>
              <li>
                <strong>Contact Details:</strong> Your full name, business or company name, email address, phone number, and WhatsApp contact details when you reach out via our contact forms, quote requests, phone calls, or direct WhatsApp chats.
              </li>
              <li>
                <strong>Artwork and Print Files:</strong> High-resolution design files (PNG, PDF, AI, PSD, CDR, etc.), logos, branding instructions, and print sizing dimensions that you upload or share with our team for printing.
              </li>
              <li>
                <strong>Order and Billing Details:</strong> Products ordered, print quantities, roll dimensions, billing details, and GSTIN (Goods and Services Tax Identification Number) for B2B tax invoicing.
              </li>
              <li>
                <strong>Delivery and Shipping Address:</strong> Complete delivery address, landmark, PIN code, and recipient contact phone number for dispatching parcels.
              </li>
              <li>
                <strong>Payment Records:</strong> Transaction reference IDs, UPI transaction numbers, or bank transfer confirmation slips. <em>(Note: We do NOT collect or store credit card numbers or banking passwords on our servers).</em>
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We process your data only for legitimate business purposes:</p>
            <ul>
              <li>To prepare customized price quotations and respond to your queries.</li>
              <li>To produce, inspect, print, and manufacture your custom DTF and UV DTF orders.</li>
              <li>To coordinate dispatch and door-to-door delivery with our courier partners.</li>
              <li>To communicate order status, production progress, and dispatch tracking details via WhatsApp, phone, or email.</li>
              <li>To issue compliant GST tax invoices and maintain accounting records as mandated by Indian law.</li>
              <li>To prevent fraudulent orders and maintain security across our platform.</li>
            </ul>

            <h2>3. Protection of Your Artwork & Intellectual Property</h2>
            <p>
              We treat your artwork, logos, and custom designs with strict confidentiality. Your artwork files are utilized exclusively to execute the print run requested by you. We do not sell, license, share, or repurpose your proprietary artwork or client designs to any third party for commercial sale.
            </p>

            <h2>4. Information Sharing & Third Parties</h2>
            <div className="legal-highlight alert-green">
              <p>
                <strong>We never sell your data:</strong> DSK Printers does not sell, rent, or trade your personal information or contact details to third-party marketing firms or data brokers.
              </p>
            </div>
            <p>We only share necessary information with trusted third parties under specific circumstances:</p>
            <ul>
              <li>
                <strong>Shipping & Logistics Partners:</strong> We share your name, delivery address, PIN code, and phone number with trusted courier partners (such as Blue Dart, DTDC, Delhivery, Trackon, or Indian Post) solely to deliver your orders.
              </li>
              <li>
                <strong>Legal & Statutory Requirements:</strong> If mandated by Indian law, law enforcement agencies, or tax authorities (e.g., GST filings), we may disclose transaction information to comply with statutory obligations.
              </li>
            </ul>

            <h2>5. Cookies & Website Analytics</h2>
            <p>
              Our website uses essential technical cookies and analytical services (such as Google Analytics) to understand website performance, visitor counts, and page load speeds. These analytics tools collect anonymized technical data (e.g., browser type, screen resolution, operating system, and pages visited). This information helps us optimize the mobile experience and improve site usability without identifying you personally.
            </p>
            <p>
              You can adjust your web browser settings to decline or clear cookies at any time, although certain website features may experience limited responsiveness.
            </p>

            <h2>6. Data Security Measures</h2>
            <p>
              We implement industry-standard organizational and technical security measures to safeguard your personal data and design files against unauthorized access, alteration, loss, or misuse:
            </p>
            <ul>
              <li>Secure Socket Layer (SSL) encryption across our website.</li>
              <li>Restricted internal access to order records and client files—limited only to authorized production and support team members.</li>
              <li>Periodic cleanup and secure archival of customer artwork and operational files.</li>
            </ul>

            <h2>7. Your Rights under the DPDP Act 2023</h2>
            <p>
              Under India&apos;s Digital Personal Data Protection Act, 2023, you have clear rights regarding your personal information:
            </p>
            <ul>
              <li>
                <strong>Right to Access:</strong> You can request a summary of the personal data we hold about you.
              </li>
              <li>
                <strong>Right to Correction:</strong> You may request correction or updating of any inaccurate or outdated contact information.
              </li>
              <li>
                <strong>Right to Erasure:</strong> You can request that we delete your personal contact details from our active communication channels, subject to our statutory retention requirements (such as retaining GST invoices for 6-8 years under Indian tax laws).
              </li>
              <li>
                <strong>Right to Withdraw Consent:</strong> You may opt out of promotional messages or WhatsApp updates at any time by simply replying &quot;STOP&quot; or messaging us.
              </li>
            </ul>

            <h2>8. Contact Our Privacy Team</h2>
            <p>
              If you have any questions about this Privacy Policy, wish to exercise your data rights, or have concerns regarding your files or personal information, please reach out directly:
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
                <span>Chat on WhatsApp</span>
              </a>
              <div className="legal-contact-item">
                <MapPin size={18} />
                <span>Naraina Industrial Area Phase 2, New Delhi</span>
              </div>
            </div>

            <div className="legal-quick-actions">
              <a
                href={COMPANY.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-blue"
              >
                <MessageCircle size={18} /> Contact on WhatsApp
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
