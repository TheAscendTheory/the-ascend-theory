import Link from "next/link";

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
          <Link href="/" className="pageCtaPrimary">
            Return Home
          </Link>

          <Link href="/programs" className="pageCtaSecondary">
            View Programs
          </Link>
        </div>
      </section>
    </main>
  );
}
