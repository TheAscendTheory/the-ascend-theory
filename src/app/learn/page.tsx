import type { Metadata } from "next";
import AcademyExperience from "./AcademyExperience";

export const metadata: Metadata = {
  title: "Ascend Academy",
  description:
    "Ascend Academy is a staged financial literacy, markets, trading, systems, and self-development curriculum with lessons, quizzes, XP, badges, and account levels.",
};

export default function LearnPage() {
  return (
    <main className="academyPage">
      <section className="academyHero">
        <p className="eyebrow">Ascend Academy</p>
        <h1>LEARN THE SYSTEM.</h1>
        <p>
          A staged learning path from first principles to advanced market
          thinking, built with lessons, quizzes, grades, badges, XP, and account
          levels.
        </p>
      </section>

      <AcademyExperience />
    </main>
  );
}
