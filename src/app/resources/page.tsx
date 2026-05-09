export default function ResourcesPage() {
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
        Resources
      </p>

      <h1 style={{
        fontSize: "clamp(56px,9vw,130px)",
        lineHeight: 0.9,
        letterSpacing: "-0.07em",
        margin: 0,
        maxWidth: 1100
      }}>
        TOOLS FOR ASCENSION.
      </h1>

      <p style={{
        maxWidth: 900,
        color: "rgba(255,255,255,0.72)",
        fontSize: 20,
        lineHeight: 1.8,
        marginTop: 44
      }}>
        Educational systems, financial literacy resources, frameworks,
        market education, digital products, templates, and learning tools
        built for modern self-development.
      </p>

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 22,
        marginTop: 70
      }}>
        {[
          ["Financial Literacy", "Core money principles, wealth education, budgeting, investing, and economic awareness."],
          ["Market Education", "Trading psychology, market structure, systems thinking, and strategic execution."],
          ["Digital Systems", "Templates, workflows, productivity systems, AI tools, and operational frameworks."]
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