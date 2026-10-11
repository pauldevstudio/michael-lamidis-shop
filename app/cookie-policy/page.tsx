import type { Metadata } from "next";
import LegalPage from "@/components/shared/LegalPage";
import CookieSettingsButton from "@/components/shared/CookieSettingsButton";
import { SITE_URL, SITE_NAME, SITE_EMAIL } from "@/lib/constants";

const LAST_UPDATED = "11 October 2026";

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
        let a site remember your actions and preferences, keep you signed in, and, where you allow it,
        measure how the site is used.
      </p>

      <h2>2. How we use cookies</h2>
      <p>
        We group cookies into three categories. <strong>Strictly necessary</strong> cookies are always
        active because the site cannot work without them. <strong>Analytics</strong> and{" "}
        <strong>Marketing</strong> cookies are only set <strong>after you give consent</strong>, and you
        can allow one without the other. Non-essential cookies and scripts (including Google Analytics
        and the Meta Pixel) are blocked until you accept the matching category in our consent banner.
      </p>

      <h2>3. Cookies we use</h2>

      <h3>Strictly necessary (always on)</h3>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr><td><code>cookie_consent</code></td><td>Stores your cookie choices so we don&apos;t ask again and only load what you allow.</td><td>12 months</td></tr>
          <tr><td><code>admin_session</code></td><td>Keeps a signed-in administrator authenticated (set only for staff, not customers).</td><td>24 hours</td></tr>
          <tr><td><code>lamidis_cart_v1</code> (localStorage)</td><td>Remembers the items in your shopping cart. It stays on your device until you send an order request.</td><td>Until cleared</td></tr>
          <tr><td><code>ml-lang</code> (localStorage)</td><td>Remembers the language you chose (English or Greek).</td><td>Until cleared</td></tr>
          <tr><td><code>ml-promo-closed</code> (sessionStorage)</td><td>Remembers that you closed the offers pop-up, so it does not open again during your visit.</td><td>Until you close the tab</td></tr>
        </tbody>
      </table>

      <h3>Analytics (only after consent)</h3>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Provider &amp; purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr><td><code>_ga</code>, <code>_ga_*</code></td><td>Google Analytics 4 (Google Ireland Ltd / Google LLC). Distinguishes visitors and measures usage.</td><td>Up to 24 months</td></tr>
          <tr><td><code>_av</code></td><td>Our own first-party statistics. A random visitor identifier, used to count visits and to see which advertisement or channel brought a visitor who sends an order request or a message.</td><td>12 months</td></tr>
          <tr><td><code>_as</code></td><td>Our own first-party statistics. A random session identifier.</td><td>30 minutes, renewed while you browse</td></tr>
        </tbody>
      </table>
      <p>
        If you do not consent to analytics, none of the above are set and no analytics scripts load. If
        you later withdraw your consent, our own two cookies (<code>_av</code> and <code>_as</code>) are
        deleted when you save your choice, and Google Analytics no longer loads. Cookies that Google
        already set stay on your device until they expire or you delete them in your browser.
      </p>

      <h3>Marketing (only after consent)</h3>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Provider &amp; purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr><td><code>_fbp</code></td><td>Meta Pixel (Meta Platforms Ireland Ltd). Recognises your browser so we can measure the results of our Facebook and Instagram advertising.</td><td>Up to 3 months</td></tr>
          <tr><td><code>_fbc</code></td><td>Meta Pixel. Set only when you arrive from one of our Facebook or Instagram advertisements, to link your visit to that advertisement.</td><td>Up to 3 months</td></tr>
        </tbody>
      </table>
      <p>
        With your consent, the Meta Pixel also tells Meta which pages you view and when you add an item
        to your cart, start checkout, send an order request or contact us. If you do not consent to
        marketing, the Pixel does not load and these cookies are not set. If you later withdraw your
        consent, the Pixel no longer loads. Cookies it already set stay on your device until they
        expire or you delete them in your browser.
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
        The Google Analytics cookies in the tables above are operated by Google, and the Meta Pixel
        cookies by Meta. When enabled, data may be processed outside the European Economic Area (for
        example in the United States) under appropriate safeguards such as the EU Standard Contractual
        Clauses. See Google&apos;s and Meta&apos;s own privacy resources for details on how they handle
        data.
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
