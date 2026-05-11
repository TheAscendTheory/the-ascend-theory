import { academyStages as sourceAcademyStages } from "./academy-real-content";

export type CurriculumModule = {
  id: string;
  stage: number;
  rank: string;
  title: string;
  level: string;
  access: "free" | "subscriber";
  estimatedPages: string;
  assessmentQuestions: number;
  passScore: number;
  overview: string;
  learningObjectives: string[];
  readingSections: string[];
  workbookTasks: string[];
  proofChecklist: string[];
  lessonText?: string;
  testText?: string;
  quizPrompts?: string[];
  quizQuestions?: {
    question: string;
    options?: string[];
    answer?: string;
    mode: "choice" | "written";
  }[];
};

export type CurriculumTrack = {
  id: string;
  title: string;
  audience: string;
  freePercent: number;
  modules: CurriculumModule[];
};

const rankGroups = [
  { rank: "Initiate", sourceStage: 1, focus: ["Money foundations", "Inflation, interest & debt", "Compounding and time value"] },
  { rank: "Apprentice", sourceStage: 2, focus: ["Income statements", "Balance sheets", "Cash flow and ratios"] },
  { rank: "Builder", sourceStage: 3, focus: ["Market purpose", "Asset classes and liquidity", "Market behavior"] },
  { rank: "Analyst", sourceStage: 4, focus: ["Stock ownership", "Business quality", "Equity analysis"] },
  { rank: "Operator", sourceStage: 5, focus: ["Bond basics", "Yields and rates", "Fixed-income risk"] },
  { rank: "Strategist", sourceStage: 6, focus: ["Inflation and GDP", "Central banks and policy", "Cycles and currencies"] },
  { rank: "Allocator", sourceStage: 7, focus: ["Diversification", "Portfolio construction", "Correlation and rebalancing"] },
  { rank: "Valuator", sourceStage: 8, focus: ["Intrinsic value", "DCF and multiples", "Valuation judgment"] },
  { rank: "Technician", sourceStage: 9, focus: ["Trading mechanics", "Orders and liquidity", "Execution discipline"] },
  { rank: "Specialist", sourceStage: 10, focus: ["Technical foundations", "Price behavior", "Evidence-based chart work"] },
  { rank: "Tactician", sourceStage: 11, focus: ["Derivative contracts", "Options, futures and hedging", "Advanced leverage risk"] },
  { rank: "Risk Architect", sourceStage: 12, focus: ["Position sizing", "Drawdown control", "Exposure systems"] },
  { rank: "Cognitive Sovereign", sourceStage: 13, focus: ["Bias and behavior", "Fear, greed and crowds", "Emotional discipline"] },
  { rank: "Institutionalist", sourceStage: 14, focus: ["Banks and funds", "Central banks and clearing", "Systemic risk and plumbing"] },
  { rank: "Market Strategist", sourceStage: 15, focus: ["Strategy selection", "Macro and specialization", "Advanced thesis work"] },
  { rank: "Ascender", sourceStage: 16, focus: ["Integrated finance mastery", "Markets, risk and behavior mastery", "Ascender thesis defense"] },
] as const;

const romanParts = ["I", "II", "III"] as const;

const academyProgressionPlan = rankGroups.flatMap((group) =>
  romanParts.map((partLabel, part) => ({
    rank: `${group.rank} ${partLabel}`,
    sourceStage: group.sourceStage,
    title: `${group.rank} ${partLabel}: ${group.focus[part]}`,
    part,
    parts: 3,
  })),
);

export const academyRankLadder = academyProgressionPlan.map((module) => module.rank);

function chunkItems<T>(items: T[], part: number, parts: number) {
  if (parts <= 1 || items.length <= 1) {
    return items;
  }

  const size = Math.ceil(items.length / parts);
  const chunk = items.slice(part * size, part * size + size);

  return chunk.length ? chunk : items.slice(-size);
}

function chunkTextBlocks(blocks: string[], part: number, parts: number) {
  const cleanBlocks = blocks.map((block) => block.trim()).filter(Boolean);

  if (cleanBlocks.length <= parts) {
    return cleanBlocks;
  }

  return chunkItems(cleanBlocks, part, parts);
}

function splitLessonText(text: string | undefined, part: number, parts: number) {
  if (!text || parts <= 1) {
    return text;
  }

  const normalized = text.trim();
  const sections = normalized
    .split(/\n(?=(?:\d+\.|PART\s+\d+|Part\s+\d+|SECTION\s+[IVX]+|Section\s+\d+)\s)/)
    .map((section) => section.trim())
    .filter(Boolean);

  const selectedSections =
    sections.length > parts
      ? chunkItems(sections, part, parts)
      : chunkTextBlocks(normalized.split(/\n{2,}/), part, parts);

  return selectedSections.join("\n\n");
}

function splitTestText(text: string | undefined, part: number, parts: number) {
  if (!text || parts <= 1) {
    return text;
  }

  const normalized = text.trim();
  const sections = normalized
    .split(/\n(?=(?:Part\s+\d+|SECTION\s+[IVX]+|Section\s+\d+|\d+\.)\s)/)
    .map((section) => section.trim())
    .filter(Boolean);

  const selectedSections =
    sections.length > parts
      ? chunkItems(sections, part, parts)
      : chunkTextBlocks(normalized.split(/\n{2,}/), part, parts);

  return selectedSections.join("\n\n");
}

function splitModule(
  source: CurriculumModule,
  plan: (typeof academyProgressionPlan)[number],
  index: number,
): CurriculumModule {
  const quizQuestions = chunkItems(source.quizQuestions || [], plan.part, plan.parts);
  const quizPrompts = chunkItems(source.quizPrompts || [], plan.part, plan.parts);
  const readingSections = chunkItems(source.readingSections, plan.part, plan.parts);
  const learningObjectives = chunkItems(source.learningObjectives, plan.part, plan.parts);
  const assessmentQuestions =
    quizQuestions.length || quizPrompts.length || Math.max(25, Math.ceil(source.assessmentQuestions / plan.parts));

  return {
    ...source,
    id: `academy-${String(index + 1).padStart(2, "0")}-${plan.rank.toLowerCase().replaceAll(" ", "-")}`,
    stage: index + 1,
    rank: plan.rank,
    title: plan.title,
    level: plan.rank,
    access: index < 14 ? "free" : "subscriber",
    estimatedPages:
      plan.parts > 1
        ? `Focused part ${plan.part + 1} of ${plan.parts}`
        : source.estimatedPages,
    assessmentQuestions,
    overview: source.overview,
    learningObjectives: learningObjectives.length ? learningObjectives : source.learningObjectives,
    readingSections: readingSections.length ? readingSections : source.readingSections,
    workbookTasks: source.workbookTasks,
    proofChecklist: source.proofChecklist,
    lessonText: splitLessonText(source.lessonText, plan.part, plan.parts),
    testText: splitTestText(source.testText, plan.part, plan.parts),
    quizPrompts,
    quizQuestions,
  };
}

export const academyModules = academyProgressionPlan.map((plan, index) => {
  const source = sourceAcademyStages.find((stage) => stage.stage === plan.sourceStage);

  if (!source) {
    throw new Error(`Missing Academy source stage ${plan.sourceStage}.`);
  }

  return splitModule(source, plan, index);
});

export const ascendDifferentiators = [
  {
    title: "Full Lesson Reader",
    text:
      "Each level opens into long-form study material with a structured reader, mastery questions, and proof work.",
  },
  {
    title: "Prompt Bank Mastery",
    text:
      "The Academy uses the supplied stage tests as mastery prompts so students build reasoning, flashcards, and proof work.",
  },
  {
    title: "Locked Rank Path",
    text:
      "Learners move through 48 rank-gated modules from Initiate I to Ascender III with progression, stars, XP, streaks, and saved practice.",
  },
  {
    title: "Free-To-Subscriber Structure",
    text:
      "The early path stays free for habit-building. Advanced ranks remain visible but require subscription access.",
  },
];

export const assessmentPolicy = {
  questionsPerCoreModule: 25,
  questionsPerMajorCertificate: 50,
  passScore: 80,
  finalPassScore: 85,
  starScale:
    "1 star below 60%, 2 stars at 60-79%, 3 stars at 80-89%, 4 stars at 90-94%, 5 stars at 95%+.",
  xpFairness:
    "First completion earns full XP based on score. Retakes improve stars but should earn reduced weekly XP to protect competition fairness.",
  freeAccess:
    "The first fourteen modules are free. Modules 15-48 remain visible but locked until subscription access is active.",
  proofRequirement:
    "Major modules should require a proof artifact before certification: worksheet, plan, journal entry, market map, or reflection.",
};

export const curriculumTracks: CurriculumTrack[] = [
  {
    id: "ascend-academy",
    title: "Ascend Academy",
    audience: "Students, families, traders, builders, and self-directed learners",
    freePercent: 30,
    modules: academyModules,
  },
];

export const curriculumSummary = {
  currentImplementedQuizCount: academyModules.reduce(
    (total, module) => total + module.assessmentQuestions,
    0,
  ),
  targetModel:
    "Forty-eight rank-gated modules with focused readings, real mastery prompts, 80% pass rule, 85% final exam rule, saved flashcards, stars, XP, streaks, and subscriber-locked advanced material.",
  nextBuildStep:
    "Convert the written mastery prompts with answer keys into fully auto-graded question banks where exact scoring is required.",
};
