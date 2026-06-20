import type { Metadata } from "next";
import LegalPage from "@/components/shared/LegalPage";
import CookieSettingsButton from "@/components/shared/CookieSettingsButton";
import { SITE_URL, SITE_NAME, SITE_EMAIL } from "@/lib/constants";

const LAST_UPDATED = "13 June 2026";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${SITE_NAME} uses cookies and similar technologies, and how you can control your consent.`,
  alternates: { canonical: `${SITE_URL}/cookie-policy` },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="This policy explains how we use cookies and similar technologies on this website, what each category does, and how you can manage or withdraw your consent at any time."
      lastUpdated={LAST_UPDATED}
    >
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files placed on your device when you visit a website. Similar
        technologies (such as <strong>localStorage</strong> and pixels) work in comparable ways. They
        let a site remember your actions and preferences, keep you signed in, and — where you allow it —
        measure how the site is used.
      </p>

      <h2>2. How we use cookies</h2>
      <p>
        We group cookies into three categories. <strong>Strictly necessary</strong> cookies are always
        active because the site cannot work without them. <strong>Analytics</strong> cookies are only
        set <strong>after you give consent</strong>. We do not currently use <strong>marketing</strong>
        cookies. Non-essential cookies and scripts (including Google Analytics) are blocked until you
        accept the matching category in our consent banner.
      </p>

      <h2>3. Cookies we use</h2>

      <h3>Strictly necessary (always on)</h3>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr><td><code>cookie_consent</code></td><td>Stores your cookie choices so we don&apos;t ask again and only load what you allow.</td><td>12 months</td></tr>
          <tr><td><code>admin_session</code></td><td>Keeps a signed-in administrator authenticated (set only for staff, not customers).</td><td>Session / 24 hours</td></tr>
          <tr><td><code>ml_cart</code> (localStorage)</td><td>Remembers the items in your shopping cart on your device. Not sent to our servers.</td><td>Until cleared</td></tr>
        </tbody>
      </table>

      <h3>Analytics (only after consent)</h3>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Provider &amp; purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr><td><code>_ga</code>, <code>_ga_*</code></td><td>Google Analytics 4 (Google Ireland/LLC) — distinguishes visitors and measures usage.</td><td>Up to 24 months</td></tr>
          <tr><td><code>_av</code></td><td>Our own first-party analytics — an anonymous visitor identifier used for aggregate statistics.</td><td>12 months</td></tr>
          <tr><td><code>_as</code></td><td>Our own first-party analytics — an anonymous session identifier.</td><td>Session</td></tr>
        </tbody>
      </table>
      <p>
        If you do not consent to analytics, none of the above are set and no analytics scripts load.
      </p>

      <h3>Marketing</h3>
      <p>
        We do not currently run any marketing or advertising cookies (for example a Meta/Facebook
        Pixel). If we introduce them in future, they will be listed here and will only load after you
        consent to the Marketing category.
      </p>

      <h2>4. Managing your consent</h2>
      <p>
        You chose your preferences when you first visited. You can change or withdraw your consent at
        any time using the button below or the <strong>&ldquo;Cookie Settings&rdquo;</strong> link in the
        footer. You can also delete cookies through your browser settings.
      </p>
      <p><CookieSettingsButton /></p>

      <h2>5. Third-party cookies &amp; international transfers</h2>
      <p>
        Analytics cookies in the table above are operated by Google. When enabled, data may be processed
        outside the European Economic Area (for example in the United States) under appropriate
        safeguards such as the EU Standard Contractual Clauses. See Google&apos;s own privacy resources for
        details on how it handles data.
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        We may update this Cookie Policy from time to time. If we make material changes to the cookies
        we use, we will update the version and ask for your consent again.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about this policy? Email us at{" "}
        <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>. See also our{" "}
        <a href="/privacy-policy">Privacy Policy</a>.
      </p>
    </LegalPage>
  );
}
