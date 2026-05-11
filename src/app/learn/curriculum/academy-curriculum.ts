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

const academyProgressionPlan = [
  { rank: "Valuator I", sourceStage: 1, title: "Money, Time Value & Compounding", part: 0, parts: 1 },
  { rank: "Valuator II", sourceStage: 2, title: "Accounting Statements & Cash Flow", part: 0, parts: 1 },
  { rank: "Valuator III", sourceStage: 8, title: "Valuation, Intrinsic Value & Multiples", part: 0, parts: 1 },
  { rank: "Technician I", sourceStage: 3, title: "Market Structure & Asset Classes", part: 0, parts: 1 },
  { rank: "Technician II", sourceStage: 9, title: "Orders, Liquidity & Execution", part: 0, parts: 1 },
  { rank: "Technician III", sourceStage: 10, title: "Technical Analysis With Evidence", part: 0, parts: 2 },
  { rank: "Specialist I", sourceStage: 4, title: "Equity Markets & Stock Ownership", part: 0, parts: 1 },
  { rank: "Specialist II", sourceStage: 5, title: "Bonds, Yields & Interest Rates", part: 0, parts: 1 },
  { rank: "Specialist III", sourceStage: 6, title: "Macroeconomics, Cycles & Policy", part: 0, parts: 1 },
  { rank: "Tactician I", sourceStage: 11, title: "Derivative Contracts & Leverage", part: 0, parts: 3 },
  { rank: "Tactician II", sourceStage: 11, title: "Options, Futures & Hedging", part: 1, parts: 3 },
  { rank: "Tactician III", sourceStage: 11, title: "Advanced Derivative Risk", part: 2, parts: 3 },
  { rank: "Risk Architect I", sourceStage: 7, title: "Portfolio Construction", part: 0, parts: 1 },
  { rank: "Risk Architect II", sourceStage: 12, title: "Position Sizing & Survival", part: 0, parts: 2 },
  { rank: "Risk Architect III", sourceStage: 12, title: "Drawdowns, Exposure & Risk Systems", part: 1, parts: 2 },
  { rank: "Cognitive Sovereign I", sourceStage: 13, title: "Behavioral Bias & Decision Quality", part: 0, parts: 3 },
  { rank: "Cognitive Sovereign II", sourceStage: 13, title: "Fear, Greed & Crowd Psychology", part: 1, parts: 3 },
  { rank: "Cognitive Sovereign III", sourceStage: 13, title: "Discipline, Pressure & Emotional Control", part: 2, parts: 3 },
  { rank: "Institutionalist I", sourceStage: 14, title: "Banks, Funds & Market Institutions", part: 0, parts: 3 },
  { rank: "Institutionalist II", sourceStage: 14, title: "Central Banks, Clearing & System Risk", part: 1, parts: 3 },
  { rank: "Institutionalist III", sourceStage: 14, title: "Capital Flows, Incentives & Market Plumbing", part: 2, parts: 3 },
  { rank: "Market Strategist I", sourceStage: 15, title: "Strategy Selection & Edge", part: 0, parts: 3 },
  { rank: "Market Strategist II", sourceStage: 15, title: "Macro, Cross-Asset & Specialization", part: 1, parts: 3 },
  { rank: "Market Strategist III", sourceStage: 15, title: "Advanced Market Thesis", part: 2, parts: 3 },
  { rank: "Ascender I", sourceStage: 16, title: "Integrated Finance Mastery", part: 0, parts: 3 },
  { rank: "Ascender II", sourceStage: 16, title: "Markets, Risk & Behavior Mastery", part: 1, parts: 3 },
  { rank: "Ascender III", sourceStage: 16, title: "Ascender Thesis Defense", part: 2, parts: 3 },
] as const;

export const academyRankLadder = academyProgressionPlan.map((module) => module.rank);

function chunkItems<T>(items: T[], part: number, parts: number) {
  if (parts <= 1 || items.length <= 1) {
    return items;
  }

  const size = Math.ceil(items.length / parts);
  const chunk = items.slice(part * size, part * size + size);

  return chunk.length ? chunk : items.slice(-size);
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

  if (sections.length <= parts) {
    return normalized;
  }

  return chunkItems(sections, part, parts).join("\n\n");
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

  if (sections.length <= parts) {
    return normalized;
  }

  return chunkItems(sections, part, parts).join("\n\n");
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
    access: index < 8 ? "free" : "subscriber",
    estimatedPages:
      plan.parts > 1
        ? `Focused part ${plan.part + 1} of ${plan.parts}`
        : source.estimatedPages,
    assessmentQuestions,
    overview: `${plan.rank} turns ${source.title} into a focused, rank-gated module. ${source.overview}`,
    learningObjectives: learningObjectives.length ? learningObjectives : source.learningObjectives,
    readingSections: readingSections.length ? readingSections : source.readingSections,
    workbookTasks: [
      `Complete the ${plan.rank} reading and write one clear application example.`,
      `Save weak ideas from ${plan.title} into the practice deck before testing.`,
      ...source.workbookTasks.slice(0, 2),
    ],
    proofChecklist: [
      `Can explain why ${plan.title.toLowerCase()} matters in real decisions.`,
      ...source.proofChecklist,
    ],
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
      "Learners move through 27 rank-gated modules from Valuator I to Ascender III with progression, stars, XP, streaks, and saved practice.",
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
    "The first eight modules are free. Modules 9-27 remain visible but locked until subscription access is active.",
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
    "Twenty-seven rank-gated modules with focused readings, real mastery prompts, 80% pass rule, 85% final exam rule, saved flashcards, stars, XP, streaks, and subscriber-locked advanced material.",
  nextBuildStep:
    "Convert the written mastery prompts with answer keys into fully auto-graded question banks where exact scoring is required.",
};
