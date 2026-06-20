import type { Metadata } from "next";
import LegalPage from "@/components/shared/LegalPage";
import { SITE_URL, SITE_NAME, SITE_EMAIL, SITE_PHONE, SITE_ADDRESS } from "@/lib/constants";

const LAST_UPDATED = "13 June 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses and protects your personal data under the EU GDPR.`,
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains what personal data we collect, why we collect it, the legal bases we rely on, who we share it with, and the rights you have under the EU General Data Protection Regulation (GDPR)."
      lastUpdated={LAST_UPDATED}
    >
      <h2>1. Who we are</h2>
      <p>
        This website is operated by <strong>{SITE_NAME}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
        &ldquo;our&rdquo;), based at {SITE_ADDRESS}. We are the <strong>data controller</strong> for the
        personal data described in this policy. Our full registered business details (including company
        registration and VAT number) are available on request.
      </p>
      <p>
        Contact us about privacy at <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a> or {SITE_PHONE}.
      </p>

      <h2>2. The information we collect</h2>
      <ul>
        <li><strong>Order details</strong> — your name, email, phone, delivery address, the items ordered and your chosen payment method, when you place an order.</li>
        <li><strong>Enquiries &amp; quote requests</strong> — your name, email, phone and any message you send through our contact, quote or chat features.</li>
        <li><strong>Newsletter</strong> — your email address, if you subscribe to deals and updates.</li>
        <li><strong>Usage &amp; technical data</strong> — with your consent, information about how you use the site (pages viewed, approximate location derived from your IP address, device and browser type, and referring site), through analytics.</li>
      </ul>
      <p>We do not knowingly collect special-category data, and we do not store full payment-card details — orders are paid by bank transfer, cash on delivery, or in our showroom.</p>

      <h2>3. How we use your data &amp; our legal bases</h2>
      <ul>
        <li><strong>To process and deliver your order</strong> and provide customer support — legal basis: <strong>performance of a contract</strong>.</li>
        <li><strong>To respond to enquiries and quote requests</strong> — legal basis: <strong>your consent</strong> and/or steps taken at your request before entering a contract.</li>
        <li><strong>To send marketing emails</strong> (newsletter) — legal basis: <strong>your consent</strong>, which you can withdraw at any time via the unsubscribe link.</li>
        <li><strong>To measure and improve the site</strong> through analytics — legal basis: <strong>your consent</strong> (managed through our cookie banner).</li>
        <li><strong>To keep the site secure and meet legal/accounting obligations</strong> — legal basis: <strong>legitimate interests</strong> and <strong>legal obligation</strong>.</li>
      </ul>

      <h2>4. Cookies &amp; analytics</h2>
      <p>
        We use cookies and similar technologies as described in our{" "}
        <a href="/cookie-policy">Cookie Policy</a>. Analytics and any future marketing cookies only load
        after you give consent, and you can change or withdraw consent at any time via the
        &ldquo;Cookie Settings&rdquo; link in the footer.
      </p>

      <h2>5. Who we share your data with</h2>
      <p>We never sell your personal data. We share it only with service providers (&ldquo;processors&rdquo;) who help us run the business, under contracts that require them to protect it:</p>
      <ul>
        <li><strong>Hosting &amp; infrastructure</strong> — our website host (Vercel) and database provider (MongoDB Atlas).</li>
        <li><strong>Analytics</strong> — Google Analytics (Google Ireland Ltd / Google LLC), only with your consent.</li>
        <li><strong>Delivery partners</strong> — couriers we use to deliver your order, where applicable.</li>
        <li><strong>Authorities</strong> — where we are legally required to disclose information.</li>
      </ul>

      <h2>6. International transfers</h2>
      <p>
        Some of our providers may process data outside the European Economic Area (for example in the
        United States). Where they do, the transfer is protected by appropriate safeguards such as the
        European Commission&apos;s Standard Contractual Clauses.
      </p>

      <h2>7. How long we keep your data</h2>
      <ul>
        <li><strong>Order &amp; transaction records</strong> — for as long as required by Cypriot tax and accounting law (typically up to 6 years).</li>
        <li><strong>Enquiries &amp; quotes</strong> — for as long as needed to deal with your request and a reasonable period afterwards.</li>
        <li><strong>Newsletter</strong> — until you unsubscribe.</li>
        <li><strong>Analytics</strong> — in aggregated or pseudonymised form, per the retention periods in our Cookie Policy.</li>
      </ul>

      <h2>8. Your rights</h2>
      <p>Under the GDPR you have the right to:</p>
      <ul>
        <li>access the personal data we hold about you;</li>
        <li>have inaccurate data corrected;</li>
        <li>have your data erased (&ldquo;right to be forgotten&rdquo;), where applicable;</li>
        <li>restrict or object to our processing;</li>
        <li>data portability;</li>
        <li>withdraw consent at any time, without affecting processing already carried out.</li>
      </ul>
      <p>
        To exercise any of these rights, email <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>. You also
        have the right to lodge a complaint with the Cypriot supervisory authority, the{" "}
        <a href="https://www.dataprotection.gov.cy" target="_blank" rel="noopener noreferrer">
          Office of the Commissioner for Personal Data Protection
        </a>{" "}
        (dataprotection.gov.cy).
      </p>

      <h2>9. How we protect your data</h2>
      <p>
        We serve the entire site over encrypted HTTPS, store data with reputable providers, restrict
        administrative access, and protect staff sessions with signed, secure, HttpOnly cookies.
      </p>

      <h2>10. Children</h2>
      <p>This site is intended for adults. We do not knowingly collect data from children.</p>

      <h2>11. Changes to this policy</h2>
      <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date above shows the latest revision.</p>

      <h2>12. Contact</h2>
      <p>
        For any privacy question or request, contact <strong>{SITE_NAME}</strong> at{" "}
        <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a> or {SITE_PHONE}.
      </p>
    </LegalPage>
  );
}
