export default function ContactPage() {
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
        Contact
      </p>

      <h1 style={{
        fontSize: "clamp(56px,9vw,130px)",
        lineHeight: 0.9,
        letterSpacing: "-0.07em",
        margin: 0,
        maxWidth: 1100
      }}>
        CONNECT WITH THE THEORY.
      </h1>

      <p style={{
        maxWidth: 900,
        color: "rgba(255,255,255,0.72)",
        fontSize: 20,
        lineHeight: 1.8,
        marginTop: 44
      }}>
        Business inquiries, partnerships, collaborations, media opportunities,
        and ecosystem development.
      </p>

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 22,
        marginTop: 70
      }}>
        <div style={{
          border: "1px solid rgba(234,179,8,0.22)",
          background: "rgba(234,179,8,0.045)",
          borderRadius: 28,
          padding: 32
        }}>
          <h2 style={{
            color: "#eab308",
            marginTop: 0
          }}>
            Email
          </h2>

          <p style={{
            color: "rgba(255,255,255,0.72)",
            fontSize: 18
          }}>
            contact@theascendtheory.com
          </p>
        </div>

        <div style={{
          border: "1px solid rgba(234,179,8,0.22)",
          background: "rgba(234,179,8,0.045)",
          borderRadius: 28,
          padding: 32
        }}>
          <h2 style={{
            color: "#eab308",
            marginTop: 0
          }}>
            Future Channels
          </h2>

          <p style={{
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.7
          }}>
            YouTube, podcasts, livestreams, educational platforms,
            social media ecosystems, and community initiatives.
          </p>
        </div>

        <div style={{
          border: "1px solid rgba(234,179,8,0.22)",
          background: "rgba(234,179,8,0.045)",
          borderRadius: 28,
          padding: 32
        }}>
          <h2 style={{
            color: "#eab308",
            marginTop: 0
          }}>
            Mission
          </h2>

          <p style={{
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.7
          }}>
            Building a global ecosystem focused on systems, markets,
            discipline, technology, financial literacy, and ascension.
          </p>
        </div>
      </section>
    </main>
  );
}