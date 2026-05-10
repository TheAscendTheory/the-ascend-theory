import type { Metadata } from "next";
import SocialClient from "./SocialClient";

export const metadata: Metadata = {
  title: "Social",
  description:
    "The Ascend Theory social hub for notifications, friend requests, direct messages, stories, highlights, and saved posts.",
};

export default function SocialPage() {
  return (
    <main className="socialPage">
      <section className="socialHero">
        <p className="eyebrow">Social</p>
        <h1>ASCENDERS SOCIAL.</h1>
        <p>
          A focused member layer for notifications, private chats, friend
          requests, 24-hour stories, profile highlights, and saved posts.
        </p>
      </section>

      <SocialClient />
    </main>
  );
}
