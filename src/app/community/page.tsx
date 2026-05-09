export default function CommunityPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top right, rgba(234,179,8,0.14), transparent 35%), #030303",
      color: "white",
      padding: "120px 8%"
    }}>
      <p style={{
        color: "#eab308",
        letterSpacing: "0.42em",
        textTransform: "uppercase",
        fontSize: 12,
        marginBottom: 24
      }}>
        Community
      </p>

      <h1 style={{
        fontSize: "clamp(56px,9vw,130px)",
        lineHeight: 0.9,
        letterSpacing: "-0.07em",
        margin: 0,
        maxWidth: 1100
      }}>
        THE ASCENDERS.
      </h1>

      <p style={{
        maxWidth: 900,
        color: "rgba(255,255,255,0.72)",
        fontSize: 20,
        lineHeight: 1.8,
        marginTop: 44
      }}>
        A growing network of ambitious builders, creators, traders,
        entrepreneurs, students, and self-developing individuals committed
        to higher standards and long-term transformation.
      </p>

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 22,
        marginTop: 70
      }}>
        {[
          ["Global Network", "Connect ambitious individuals across media, finance, technology, business, and education."],
          ["Future Events", "Seminars, livestreams, workshops, youth financial literacy initiatives, and meetups."],
          ["Identity", "The Ascenders represent discipline, intelligence, execution, growth, and self-mastery."]
        ].map(([title, text]) => (
          <div key={title} style={{
            border: "1px solid rgba(234,179,8,0.22)",
            background: "rgba(234,179,8,0.045)",
            borderRadius: 28,
            padding: 32
          }}>
            <h2 style={{ color: "#eab308", marginTop: 0 }}>{title}</h2>
            <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.7 }}>{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}