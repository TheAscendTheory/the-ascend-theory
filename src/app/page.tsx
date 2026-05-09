"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleWaitlistSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFormStatus("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormStatus(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setFormStatus(
        data.message || "Welcome email sent. You are on the Ascenders list."
      );
      setEmail("");
    } catch {
      setFormStatus("Connection failed.");
    }

    setLoading(false);
  }

  const pillars = [
    ["Systems", "Build structure, routines, discipline, leverage, and personal operating systems."],
    ["Markets", "Understand money, trading, investing, economics, and global financial movement."],
    ["Mindset", "Develop emotional control, patience, ambition, and long-term thinking."],
    ["Technology", "Use AI, digital tools, automation, and modern skills to move faster."],
    ["Culture", "Build a global identity around growth, intelligence, execution, and ascension."],
    ["Execution", "Turn vision into real output, measurable progress, and visible proof."],
  ];

  const ecosystem = [
    "YouTube Media",
    "Newsletter",
    "Courses",
    "Live Sessions",
    "Community",
    "Youth Financial Literacy",
    "Podcasts",
    "Market Breakdowns",
    "Digital Resources",
  ];

  return (
    <>
      <main className="homeSite">
        <div className="homeBackground">
          <div className="homeGlow homeGlowOne" />
          <div className="homeGlow homeGlowTwo" />
          <div className="homeGridBg" />
        </div>

        <section className="hero">
          <motion.img
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1 }}
            src="/logo.png"
            alt="The Ascend Theory symbol"
            className="heroLogo"
          />

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="eyebrow"
          >
            A New Operating Standard
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            THE ASCEND THEORY
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Systems. Markets. Mindset.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="heroText"
          >
            A media and education ecosystem built for people developing
            financial intelligence, discipline, self-mastery, and a higher
            operating standard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="buttons"
          >
            <a href="#contact" className="primary">
              Join the Movement
            </a>

            <a href="/about" className="secondary">
              Explore the Theory
            </a>
          </motion.div>
        </section>

        <section className="missionStrip">
          {[
            ["01", "Financial Literacy"],
            ["02", "Market Awareness"],
            ["03", "Personal Discipline"],
            ["04", "Systems Thinking"],
          ].map(([num, label]) => (
            <div key={label}>
              <p>{num}</p>
              <h3>{label}</h3>
            </div>
          ))}
        </section>

        <section id="theory" className="section">
          <p className="eyebrow">The Theory</p>

          <h2>What Is The Ascend Theory?</h2>

          <p>
            The Ascend Theory is a modern education and media platform built
            around financial literacy, market awareness, personal discipline,
            systems thinking, technology, and self-development.
          </p>
        </section>

        <section className="cardsSection">
          {[
            ["Media", "Short-form, long-form, podcasts, interviews, and market breakdowns."],
            ["Education", "Financial literacy, digital skills, discipline, and self-development resources."],
            ["Community", "A global identity for builders, students, creators, traders, and ambitious learners."],
          ].map(([title, text]) => (
            <div className="goldCard" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </section>

        <section id="pillars" className="section">
          <p className="eyebrow">Core Pillars</p>

          <h2>The Foundation</h2>

          <div className="gridCards">
            {pillars.map(([title, text]) => (
              <div className="card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="ecosystem" className="ecosystem">
          <p className="eyebrow">Ecosystem</p>

          <h2>
            More Than Content.
            <br />
            A Movement.
          </h2>

          <p>
            The Ascend Theory is expanding into media, education, community,
            digital resources, financial literacy, youth programs, live
            sessions, podcasts, and market breakdowns.
          </p>

          <div className="ecosystemGrid">
            {ecosystem.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <p className="eyebrow">Join Early</p>

          <h2>Be Part of the Foundation.</h2>

          <p>Join the early list and move with the first Ascenders.</p>

          <form onSubmit={handleWaitlistSubmit} className="form">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Joining..." : "Ascend"}
            </button>
          </form>

          {formStatus && <p className="status">{formStatus}</p>}
        </section>

        <footer>
          <h3>The Ascend Theory</h3>
          <p>Systems. Markets. Mindset.</p>
          <small>© 2026 The Ascend Theory. All rights reserved.</small>
        </footer>
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #030303;
          color: white;
          font-family: Arial, Helvetica, sans-serif;
          overflow-x: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .homeSite {
          position: relative;
          min-height: 100vh;
          background: #030303;
          overflow: hidden;
        }

        .homeBackground {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .homeGlow {
          position: absolute;
          border-radius: 999px;
          filter: blur(120px);
          background: rgba(234, 179, 8, 0.16);
        }

        .homeGlowOne {
          width: 420px;
          height: 420px;
          top: -80px;
          right: 10%;
        }

        .homeGlowTwo {
          width: 360px;
          height: 360px;
          bottom: 20%;
          left: -80px;
          opacity: 0.45;
        }

        .homeGridBg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.5;
        }

        .hero {
          position: relative;
          z-index: 5;
          min-height: 92vh;
          padding: 90px 6%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .heroLogo {
          width: 180px;
          height: 180px;
          object-fit: contain;
          margin-bottom: 34px;
          filter: drop-shadow(0 0 45px rgba(234, 179, 8, 0.25));
        }

        .eyebrow {
          color: #eab308;
          text-transform: uppercase;
          letter-spacing: 0.42em;
          font-size: 12px;
          margin-bottom: 22px;
        }

        .hero h1 {
          font-size: clamp(56px, 10vw, 145px);
          line-height: 0.9;
          letter-spacing: -0.08em;
          margin: 0;
          max-width: 1150px;
        }

        .hero h2 {
          color: #eab308;
          font-size: clamp(28px, 4vw, 58px);
          margin: 26px 0 0;
        }

        .heroText,
        .section p,
        .ecosystem p {
          max-width: 800px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 18px;
          line-height: 1.75;
        }

        .buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 34px;
        }

        .primary,
        .secondary,
        .form button {
          padding: 16px 26px;
          border-radius: 999px;
          font-weight: 700;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .primary,
        .form button {
          background: #eab308;
          color: black;
          border: none;
        }

        .secondary {
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        .primary:hover,
        .form button:hover {
          transform: scale(1.04);
          background: #facc15;
        }

        .secondary:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .missionStrip {
          position: relative;
          z-index: 5;
          padding: 60px 6%;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
          background: rgba(255, 255, 255, 0.02);
        }

        .missionStrip p {
          color: #eab308;
        }

        .missionStrip h3 {
          font-size: 24px;
          margin: 0;
        }

        .section {
          position: relative;
          z-index: 5;
          padding: 105px 6%;
        }

        .section h2,
        .ecosystem h2 {
          font-size: clamp(42px, 6vw, 78px);
          line-height: 1;
          margin: 0 0 28px;
        }

        .cardsSection {
          position: relative;
          z-index: 5;
          padding: 70px 6%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .goldCard,
        .card {
          border-radius: 28px;
          padding: 32px;
          border: 1px solid rgba(234, 179, 8, 0.22);
          background: rgba(234, 179, 8, 0.045);
        }

        .goldCard h3,
        .card h3 {
          color: #eab308;
          font-size: 28px;
          margin-top: 0;
        }

        .goldCard p,
        .card p {
          color: rgba(255, 255, 255, 0.68);
          line-height: 1.7;
        }

        .gridCards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .card {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.045);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .card:hover,
        .goldCard:hover {
          transform: translateY(-8px);
          border-color: rgba(234, 179, 8, 0.55);
        }

        .ecosystem {
          position: relative;
          z-index: 5;
          margin: 70px 6%;
          padding: 75px;
          border-radius: 42px;
          border: 1px solid rgba(234, 179, 8, 0.22);
          background: linear-gradient(
            135deg,
            rgba(234, 179, 8, 0.12),
            rgba(255, 255, 255, 0.035)
          );
          backdrop-filter: blur(16px);
        }

        .ecosystemGrid {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .ecosystemGrid div {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 18px;
          background: rgba(0, 0, 0, 0.35);
          color: rgba(255, 255, 255, 0.75);
        }

        .form {
          display: flex;
          gap: 14px;
          max-width: 620px;
          margin-top: 30px;
        }

        .form input {
          flex: 1;
          padding: 16px 20px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.06);
          color: white;
          outline: none;
        }

        .status {
          color: #eab308 !important;
          margin-top: 20px;
        }

        footer {
          position: relative;
          z-index: 5;
          padding: 60px 6%;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
        }

        footer h3 {
          color: white;
          font-size: 26px;
        }

        @media (max-width: 850px) {
          .heroLogo {
            width: 145px;
            height: 145px;
          }

          .missionStrip,
          .cardsSection,
          .gridCards,
          .ecosystemGrid {
            grid-template-columns: 1fr;
          }

          .ecosystem {
            margin: 50px 20px;
            padding: 36px 24px;
          }

          .form {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}