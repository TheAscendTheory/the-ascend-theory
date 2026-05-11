import { academyModules } from "./academy-curriculum";

export type AcademyRankStatus = {
  completedModules: number;
  currentRank: string;
  nextRank: string;
  progressLabel: string;
  initials: string;
  tone: string;
  iconSrc: string | null;
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

const rankIconFiles = [
  "01_initiate_i_bronze.png",
  "02_initiate_ii_silver.png",
  "03_initiate_iii_gold.png",
  "04_apprentice_i_bronze.png",
  "05_apprentice_ii_silver.png",
  "06_apprentice_iii_gold.png",
  "07_builder_i_bronze.png",
  "08_builder_ii_silver.png",
  "09_builder_iii_gold.png",
  "10_analyst_i_bronze.png",
  "11_analyst_ii_silver.png",
  "12_analyst_iii_gold.png",
  "13_operator_i_bronze.png",
  "14_operator_ii_silver.png",
  "15_operator_iii_gold.png",
  "16_strategist_i_bronze.png",
  "17_strategist_ii_silver.png",
  "18_strategist_iii_gold.png",
  "19_allocator_i_bronze.png",
  "20_allocator_ii_silver.png",
  "21_allocator_iii_gold.png",
  "22_valuator_i_bronze.png",
  "23_valuator_ii_silver.png",
  "24_valuator_iii_gold.png",
  "25_technician_i_bronze.png",
  "26_technician_ii_silver.png",
  "27_technician_iii_gold.png",
  "28_specialist_i_bronze.png",
  "29_specialist_ii_silver.png",
  "30_specialist_iii_gold.png",
  "31_tactician_i_bronze.png",
  "32_tactician_ii_silver.png",
  "33_tactician_iii_gold.png",
  "34_risk_architect_i_bronze.png",
  "35_risk_architect_ii_silver.png",
  "36_risk_architect_iii_gold.png",
  "37_cognitive_sovereign_i_bronze.png",
  "38_cognitive_sovereign_ii_silver.png",
  "39_cognitive_sovereign_iii_gold.png",
  "40_institutionalist_i_bronze.png",
  "41_institutionalist_ii_silver.png",
  "42_institutionalist_iii_gold.png",
  "43_market_strategist_i_bronze.png",
  "44_market_strategist_ii_silver.png",
  "45_market_strategist_iii_gold.png",
  "46_ascender_i_bronze.png",
  "47_ascender_ii_silver.png",
  "48_ascender_iii_gold_prestige.png",
];

export function rankIconSrc(moduleNumber: number) {
  const file = rankIconFiles[moduleNumber - 1];
  return file ? `/ranks/${file}` : null;
}

export const academyRankGuide = academyModules.map((module, index) => ({
  rank: module.rank,
  moduleTitle: module.title,
  moduleNumber: index + 1,
  unlockText:
    index === 0
      ? "Complete the first Academy module."
      : `Complete modules 1-${index + 1} in locked order.`,
  iconText: rankInitials(module.rank),
  iconSrc: rankIconSrc(index + 1),
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
    iconSrc: currentModule ? rankIconSrc(currentIndex + 1) : null,
  };
}

export function rankStatusFromLevel(level: string | null | undefined): AcademyRankStatus {
  const rankLevel = level || "New Ascender";
  const completedMatch = rankLevel.match(/(\d+)\s*\/\s*48/i);

  if (completedMatch) {
    return rankStatusFromCompleted(Number(completedMatch[1]));
  }

  const rankGuideItem = academyRankGuide.find((rank) => rank.rank === rankLevel);

  return {
    ...rankStatusFromCompleted(0),
    currentRank: rankLevel,
    initials: rankInitials(rankLevel),
    tone: rankGuideItem?.tone || "slate",
    iconSrc: rankGuideItem?.iconSrc || null,
  };
}
