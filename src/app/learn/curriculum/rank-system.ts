import { academyModules } from "./academy-curriculum";

export type AcademyRankStatus = {
  completedModules: number;
  currentRank: string;
  nextRank: string;
  progressLabel: string;
  initials: string;
  tone: string;
};

const rankTones = [
  "slate",
  "bronze",
  "amber",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "fuchsia",
  "rose",
  "red",
  "orange",
  "gold",
  "platinum",
  "ascender",
];

export const academyRankGuide = academyModules.map((module, index) => ({
  rank: module.rank,
  moduleTitle: module.title,
  moduleNumber: index + 1,
  unlockText:
    index === 0
      ? "Complete the first Academy module."
      : `Complete modules 1-${index + 1} in locked order.`,
  iconText: rankInitials(module.rank),
  tone: rankTones[Math.floor(index / 3)] || "ascender",
}));

export function rankInitials(rank: string) {
  const words = rank.replace(/\b(I|II|III)\b/g, "").trim().split(/\s+/);
  const base = words.map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const tier = rank.match(/\b(I|II|III)\b/)?.[1] || "";
  return `${base || "A"}${tier ? tier.replaceAll("I", "1") : ""}`;
}

export function rankStatusFromCompleted(completedModules: number): AcademyRankStatus {
  const safeCompleted = Math.max(0, Math.min(completedModules, academyModules.length));
  const currentIndex = safeCompleted > 0 ? safeCompleted - 1 : -1;
  const currentModule = currentIndex >= 0 ? academyModules[currentIndex] : null;
  const nextModule = academyModules[safeCompleted] || null;
  const currentRank = currentModule?.rank || "New Ascender";
  const groupIndex = currentIndex >= 0 ? Math.floor(currentIndex / 3) : 0;

  return {
    completedModules: safeCompleted,
    currentRank,
    nextRank: nextModule?.rank || "Ascender III complete",
    progressLabel: `${safeCompleted}/${academyModules.length} modules`,
    initials: rankInitials(currentRank),
    tone: currentModule ? rankTones[groupIndex] || "ascender" : "slate",
  };
}
