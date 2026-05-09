export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(234,179,8,0.14), transparent 35%), #030303",
        color: "white",
        padding: "120px 8%",
      }}
    >
      <p
        style={{
          color: "#eab308",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          fontSize: 12,
          marginBottom: 24,
        }}
      >
        About The Movement
      </p>

      <h1
        style={{
          fontSize: "clamp(56px,9vw,130px)",
          lineHeight: 0.9,
          letterSpacing: "-0.07em",
          margin: 0,
          maxWidth: 1100,
        }}
      >
        A NEW STANDARD FOR AMBITION.
      </h1>

      <p
        style={{
          maxWidth: 900,
          color: "rgba(255,255,255,0.72)",
          fontSize: 20,
          lineHeight: 1.8,
          marginTop: 44,
        }}
      >
        The Ascend Theory is a media and education ecosystem built around
        financial literacy, systems thinking, market awareness, discipline,
        technology, and self-development.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 22,
          marginTop: 70,
        }}
      >
        {[
          [
            "Mission",
            "Help people build discipline, financial intelligence, and higher personal operating standards.",
          ],
          [
            "Vision",
            "Create a global media ecosystem for ambitious builders, students, traders, creators, and entrepreneurs.",
          ],
          [
            "Identity",
            "The Ascenders are people committed to intentional growth, execution, and long-term transformation.",
          ],
        ].map(([title, text]) => (
          <div
            key={title}
            style={{
              border: "1px solid rgba(234,179,8,0.22)",
              background: "rgba(234,179,8,0.045)",
              borderRadius: 28,
              padding: 32,
            }}
          >
            <h2
              style={{
                color: "#eab308",
                marginTop: 0,
              }}
            >
              {title}
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.7,
              }}
            >
              {text}
            </p>
          </div>
        ))}
      </section>

      <section
        style={{
          marginTop: 100,
          padding: 50,
          borderRadius: 36,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <p
          style={{
            color: "#eab308",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontSize: 12,
            marginBottom: 20,
          }}
        >
          Founder Vision
        </p>

        <h2
          style={{
            fontSize: "clamp(34px,5vw,72px)",
            lineHeight: 1,
            marginTop: 0,
            marginBottom: 28,
          }}
        >
          Building A Global Ecosystem.
        </h2>

        <p
          style={{
            maxWidth: 950,
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.9,
            fontSize: 19,
          }}
        >
          The Ascend Theory is designed as more than a content platform. The
          long-term vision is a scalable ecosystem spanning media, financial
          literacy, education, technology, digital infrastructure, community
          systems, youth initiatives, and global self-development.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginTop: 50,
          }}
        >
          {[
            "Media Infrastructure",
            "Financial Education",
            "Youth Initiatives",
            "Technology Systems",
            "Global Community",
            "Digital Products",
          ].map((item) => (
            <div
              key={item}
              style={{
                border: "1px solid rgba(234,179,8,0.18)",
                borderRadius: 20,
                padding: 22,
                background: "rgba(234,179,8,0.04)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#eab308",
                  fontWeight: 600,
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}