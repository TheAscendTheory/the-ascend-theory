import type { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Create an Ascend Theory profile for saved tools, trade journaling, watchlists, market notes, and member resources.",
};

export default function AccountPage() {
  return (
    <main className="resourcesPage">
      <section className="resourcesHero">
        <p className="eyebrow">Profile</p>

        <h1>BUILD YOUR ASCENDER PROFILE.</h1>

        <p>
          The account layer is the foundation for saved trade journals,
          watchlists, alert plans, member resources, course progress, and
          personalized learning systems.
        </p>
      </section>

      <AccountClient />
    </main>
  );
}
