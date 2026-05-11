import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for The Ascend Theory, including how waitlist, contact, email, and site interaction information may be collected and used.",
};

export default function PrivacyPage() {
  return (
    <main className="privacyPage">
      <section className="privacyHero">
        <p className="eyebrow">Privacy Policy</p>

        <h1>YOUR INFORMATION MATTERS.</h1>

        <p>
          The Ascend Theory collects limited information to operate the
          waitlist, communicate with early supporters, and improve the ecosystem.
        </p>
      </section>

      <section className="privacyContent">
        <h2>Information We Collect</h2>

        <p>
          When you join the waitlist or contact The Ascend Theory, we may
          collect information such as your email address, message details, and
          basic interaction data.
        </p>

        <h2>How We Use Information</h2>

        <p>
          We use submitted information to manage the waitlist, send updates,
          respond to inquiries, share resources, improve the site, and develop
          media, education, community, and program offerings.
        </p>

        <h2>Email Communication</h2>

        <p>
          If you join the waitlist, you may receive emails related to The Ascend
          Theory, including launch updates, resources, newsletters, programs,
          and community announcements. You may unsubscribe from emails
          when unsubscribe options are provided.
        </p>

        <h2>Third-Party Services</h2>

        <p>
          The site may use trusted infrastructure and communication providers
          to host the site, store waitlist information, send emails, and
          understand site performance.
        </p>

        <h2>Data Protection</h2>

        <p>
          We aim to use reasonable safeguards to protect submitted information.
          However, no internet-based system can be guaranteed to be completely
          secure.
        </p>

        <h2>Contact</h2>

        <p>
          For privacy-related questions, contact support@theascendtheory.com.
        </p>
      </section>

      <section className="pageCta">
        <h2>Questions about your information?</h2>

        <p>
          Contact The Ascend Theory for support, privacy questions, or account
          and waitlist-related requests.
        </p>

        <div className="pageCtaActions">
          <a
            href="mailto:support@theascendtheory.com"
            className="pageCtaPrimary"
          >
            Email Support
          </a>

          <a href="/contact" className="pageCtaSecondary">
            Contact Page
          </a>
        </div>
      </section>
    </main>
  );
}
