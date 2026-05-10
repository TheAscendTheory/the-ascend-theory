import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact The Ascend Theory for business inquiries, media opportunities, partnerships, sponsorships, support, and institutional conversations.",
};

const contactChannels = [
  {
    title: "General Contact",
    email: "contact@theascendtheory.com",
    text: "Business inquiries, collaborations, ecosystem development, and general communication.",
  },
  {
    title: "Media",
    email: "media@theascendtheory.com",
    text: "Media opportunities, interviews, podcasts, press, creator collaborations, and platform features.",
  },
  {
    title: "Support",
    email: "support@theascendtheory.com",
    text: "Questions, resource support, access help, community assistance, and general support.",
  },
  {
    title: "Founder",
    email: "founder@theascendtheory.com",
    text: "Founder-level partnerships, strategic opportunities, sponsorships, and direct business communication.",
  },
];

const partnershipAreas = [
  "Schools and colleges",
  "Youth organizations",
  "Nonprofits",
  "Community programs",
  "Financial literacy initiatives",
  "Media collaborations",
  "Creator partnerships",
  "Sponsors and brands",
];

const socialLinks = [
  {
    label: "Discord",
    href: "https://discord.gg/sRkBrb2n",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@TheAscendTheoryGlobal",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/theascendtheoryglobal/",
  },
  {
    label: "X",
    href: "https://x.com/AscendTheoryHQ",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tapiwa-geza-70838a409/",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@theascendtheoryglobal",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61589229221663",
  },
];

export default function ContactPage() {
  return (
    <main className="contactPage">
      <section className="contactHero">
        <p className="eyebrow">Contact</p>

        <h1>CONNECT WITH THE THEORY.</h1>

        <p>
          Business inquiries, partnerships, collaborations, media opportunities,
          support, institutional conversations, and ecosystem development.
        </p>

        <div className="pageCtaActions">
          <a
            href="mailto:founder@theascendtheory.com"
            className="pageCtaPrimary"
          >
            Email Founder
          </a>

          <a
            href="https://discord.gg/sRkBrb2n"
            target="_blank"
            rel="noreferrer"
            className="pageCtaSecondary"
          >
            Join Discord
          </a>
        </div>
      </section>

      <section className="contactGrid" aria-label="Contact channels">
        {contactChannels.map((channel) => (
          <article key={channel.email} className="contactCard">
            <h2>{channel.title}</h2>

            <a className="contactEmail" href={`mailto:${channel.email}`}>
              {channel.email}
            </a>

            <p>{channel.text}</p>
          </article>
        ))}
      </section>

      <section className="contactPartnerships">
        <p className="eyebrow">Partnerships</p>

        <h2>Built for education, media, and community collaboration.</h2>

        <p>
          The Ascend Theory is open to conversations with institutions,
          organizations, creators, sponsors, and community leaders interested in
          financial literacy, market awareness, digital skills, youth education,
          and systems-based personal development.
        </p>

        <div className="partnershipGrid">
          {partnershipAreas.map((area) => (
            <div key={area}>{area}</div>
          ))}
        </div>
      </section>

      <section className="contactPartnerships">
        <p className="eyebrow">Social Ecosystem</p>

        <h2>Follow the build across the live channels.</h2>

        <p>
          The Ascend Theory is now active across media, social, professional,
          and community platforms. Follow the public channels or join the
          Discord to stay connected as the ecosystem develops.
        </p>

        <div className="socialLinkGrid">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <section className="pageCta">
        <h2>Start the right conversation.</h2>

        <p>
          For schools, nonprofits, sponsors, media partners, creators, and
          organizations interested in financial literacy, youth education,
          digital skills, and community impact.
        </p>

        <div className="pageCtaActions">
          <a
            href="mailto:founder@theascendtheory.com"
            className="pageCtaPrimary"
          >
            Email Founder
          </a>

          <a href="/programs" className="pageCtaSecondary">
            View Programs
          </a>
        </div>
      </section>
    </main>
  );
}
