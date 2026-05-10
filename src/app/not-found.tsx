export default function NotFound() {
  return (
    <main className="notFoundPage">
      <section className="notFoundHero">
        <p className="eyebrow">404</p>

        <h1>THIS PATH DOES NOT ASCEND.</h1>

        <p>
          The page you are looking for does not exist, may have moved, or is
          still being built inside The Ascend Theory ecosystem.
        </p>

        <div className="pageCtaActions">
          <a href="/" className="pageCtaPrimary">
            Return Home
          </a>

          <a href="/programs" className="pageCtaSecondary">
            View Programs
          </a>
        </div>
      </section>
    </main>
  );
}
