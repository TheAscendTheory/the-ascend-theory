"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

const impactCards = [
  {
    title: "Media",
    text: "Original content built around financial literacy, markets, discipline, technology, systems, and self-development.",
  },
  {
    title: "Programs",
    text: "Workshops, youth education initiatives, market awareness sessions, AI literacy, and systems-based learning.",
  },
  {
    title: "Resources",
    text: "Guides, templates, frameworks, and practical tools for money, digital skills, discipline, and execution.",
  },
];

const pillars = [
  "Financial Literacy",
  "Market Awareness",
  "Systems Thinking",
  "Digital Skills",
  "Discipline",
  "Execution",
];

const programs = [
  "Financial literacy workshops",
  "Youth education initiatives",
  "Market awareness sessions",
  "AI and digital skills",
  "Systems training",
  "Community learning",
];

const socialLinks = [
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
    label: "TikTok",
    href: "https://www.tiktok.com/@theascendtheoryglobal",
  },
  {
    label: "Discord",
    href: "https://discord.gg/sRkBrb2n",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleWaitlistSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) {
      setFormStatus("Please enter your email address.");
      return;
    }

    setLoading(true);
    setFormStatus("");
    setFormSuccess(false);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFormStatus(data.error || "Something went wrong. Please try again.");
        return;
      }

      setFormStatus(data.message || "You are on the Ascenders list.");
      setFormSuccess(true);
      setEmail("");
    } catch {
      setFormStatus("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="homePage">
      <div className="homeAtmosphere" aria-hidden="true">
        <div className="homeGlow homeGlowOne" />
        <div className="homeGlow homeGlowTwo" />
        <div className="homeGridBg" />
      </div>

      <section className="homeHero">
        <motion.img
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          src="/logo.PNG"
          alt="The Ascend Theory"
          className="homeHeroLogo"
        />

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="eyebrow"
        >
          A New Operating Standard
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          THE ASCEND THEORY
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          Systems. Markets. Mindset.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
        >
          A media and education ecosystem built for people developing financial
          intelligence, discipline, digital awareness, and a higher operating
          standard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          className="homeActions"
        >
          <a href="#waitlist" className="primaryButton">
            Join the Movement
          </a>

          <a href="/programs" className="secondaryButton">
            Explore Programs
          </a>
        </motion.div>
      </section>

      <section className="homeStrip" aria-label="Core pillars">
        {pillars.map((pillar) => (
          <div key={pillar}>{pillar}</div>
        ))}
      </section>

      <section className="homeSection">
        <p className="eyebrow">The Direction</p>

        <h2>Built for education, media, and community impact.</h2>

        <p>
          The Ascend Theory is being developed as a youth-focused and
          community-driven education platform for financial literacy, market
          awareness, digital skills, discipline, systems thinking, and personal
          development.
        </p>

        <div className="homeCardGrid">
          {impactCards.map((card) => (
            <article key={card.title} className="homeCard">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="homePrograms">
        <div>
          <p className="eyebrow">Programs</p>

          <h2>Learning systems designed for real-world execution.</h2>

          <p>
            From financial literacy to AI skills and systems training, The
            Ascend Theory is building practical education formats for students,
            young adults, communities, and ambitious learners.
          </p>

          <div className="homeActions">
            <a href="/programs" className="primaryButton">
              View Programs
            </a>

            <a href="/contact" className="secondaryButton">
              Partner With Us
            </a>
          </div>
        </div>

        <div className="programList">
          {programs.map((program) => (
            <div key={program}>{program}</div>
          ))}
        </div>
      </section>

      <section className="homeSection compact">
        <p className="eyebrow">Core Foundation</p>

        <h2>Not just content. A learning ecosystem.</h2>

        <p>
          The goal is to connect media, practical education, community,
          resources, programs, and partnerships into one clear ecosystem.
        </p>
      </section>

      <section className="homeSection compact">
        <p className="eyebrow">Markets And Charting</p>

        <h2>A market desk for charting, risk, and review.</h2>

        <p>
          The Ascend Theory market tools give learners a real workspace for
          live charts, watchlists, drawing tools, economic events, position
          sizing, trade journaling, and performance review.
        </p>

        <div className="homeActions">
          <a href="/resources/charting" className="primaryButton">
            Open Charts
          </a>

          <a href="/resources/demo-trading" className="secondaryButton">
            Practice Demo Trading
          </a>

          <a href="/resources/trade-journal" className="secondaryButton">
            View Journal
          </a>
        </div>
      </section>

      <section id="waitlist" className="homeSection">
        <p className="eyebrow">Join Early</p>

        <h2>Be part of the foundation.</h2>

        <p>
          Join the early list and receive The Ascender Starter Guide in your
          welcome email.
        </p>

        <div className="starterGuideCard">
          <div>
            <p className="eyebrow">Free Resource</p>
            <h3>The Ascender Starter Guide</h3>
            <p>
              A practical introduction to financial literacy, market awareness,
              discipline, systems, AI literacy, and execution.
            </p>
          </div>

          <a
            href="/the-ascender-starter-guide.html"
            target="_blank"
            rel="noreferrer"
            className="secondaryButton"
          >
            Preview Guide
          </a>
        </div>

        <form onSubmit={handleWaitlistSubmit} className="waitlistForm">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            aria-label="Email address"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Joining..." : "Ascend"}
          </button>
        </form>

        {formStatus && <p className="formStatus">{formStatus}</p>}

        {formSuccess && (
          <a
            href="/the-ascender-starter-guide.html"
            target="_blank"
            rel="noreferrer"
            className="guideSuccessLink"
          >
            Open The Starter Guide
          </a>
        )}

        <div className="homeSocialLinks" aria-label="Social links">
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
    </main>
  );
}
