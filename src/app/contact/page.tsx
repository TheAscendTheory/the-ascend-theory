export default function ContactPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#050505",
      color: "white",
      padding: "120px 8%"
    }}>
      <p style={{
        color: "#eab308",
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        fontSize: 12
      }}>
        Contact
      </p>

      <h1 style={{
        fontSize: "clamp(50px,8vw,110px)",
        marginTop: 20,
        marginBottom: 40
      }}>
        Contact The Ascend Theory
      </h1>

      <p style={{
        maxWidth: 900,
        color: "rgba(255,255,255,0.72)",
        fontSize: 20,
        lineHeight: 1.8
      }}>
        contact@theascendtheory.com
      </p>
    </main>
  );
}