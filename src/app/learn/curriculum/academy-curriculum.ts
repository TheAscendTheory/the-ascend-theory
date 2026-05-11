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
  { rank: "Initiate", sourceStage: 1 },
  { rank: "Apprentice", sourceStage: 2 },
  { rank: "Builder", sourceStage: 3 },
  { rank: "Analyst", sourceStage: 4 },
  { rank: "Operator", sourceStage: 5 },
  { rank: "Strategist", sourceStage: 6 },
  { rank: "Allocator", sourceStage: 7 },
  { rank: "Valuator", sourceStage: 8 },
  { rank: "Technician", sourceStage: 9 },
  { rank: "Specialist", sourceStage: 10 },
  { rank: "Tactician", sourceStage: 11 },
  { rank: "Risk Architect", sourceStage: 12 },
  { rank: "Cognitive Sovereign", sourceStage: 13 },
  { rank: "Institutionalist", sourceStage: 14 },
  { rank: "Market Strategist", sourceStage: 15 },
  { rank: "Ascender", sourceStage: 16 },
] as const;

const romanParts = ["I", "II", "III"] as const;

const academyProgressionPlan = rankGroups.flatMap((group) =>
  romanParts.map((partLabel, part) => ({
    rank: `${group.rank} ${partLabel}`,
    sourceStage: group.sourceStage,
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

function chunkTextByWeight(blocks: string[], part: number, parts: number) {
  const cleanBlocks = blocks.map((block) => block.trim()).filter(Boolean);

  if (cleanBlocks.length <= parts) {
    return chunkTextBlocks(cleanBlocks, part, parts);
  }

  const targetSize =
    cleanBlocks.reduce((total, block) => total + block.length, 0) / parts;
  const chunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentSize = 0;

  cleanBlocks.forEach((block, index) => {
    const remainingBlocks = cleanBlocks.length - index;
    const remainingChunks = parts - chunks.length;
    const shouldClose =
      currentChunk.length > 0 &&
      currentSize >= targetSize &&
      remainingBlocks >= remainingChunks;

    if (shouldClose) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentSize = 0;
    }

    currentChunk.push(block);
    currentSize += block.length;
  });

  if (currentChunk.length) {
    chunks.push(currentChunk);
  }

  while (chunks.length < parts) {
    chunks.push([]);
  }

  return chunks[part]?.length ? chunks[part] : chunks.findLast((chunk) => chunk.length) || cleanBlocks;
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
      ? chunkTextByWeight(sections, part, parts)
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
      ? chunkTextByWeight(sections, part, parts)
      : chunkTextBlocks(normalized.split(/\n{2,}/), part, parts);

  return selectedSections.join("\n\n");
}

function passScoreForModule(source: CurriculumModule, index: number) {
  if (source.passScore >= 85) {
    return source.passScore;
  }

  if (index >= 36) {
    return 83;
  }

  if (index >= 24) {
    return 82;
  }

  return source.passScore;
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
    title: `${source.title} - Part ${romanParts[plan.part]}`,
    level: plan.rank,
    access: index < 14 ? "free" : "subscriber",
    estimatedPages: `${source.estimatedPages} - Part ${plan.part + 1} of ${plan.parts}`,
    assessmentQuestions,
    passScore: passScoreForModule(source, index),
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
    "Letter grade scale: A+ 97-100, A 93-96, A- 90-92, B+ 87-89, B 83-86, B- 80-82, C+ 77-79, C 73-76, C- 70-72, D+ 67-69, D 63-66, D- 60-62, F below 60. Stars remain proficiency rewards.",
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
    "Forty-eight rank-gated modules with focused readings, real mastery prompts, standardized F-to-A grading, 80% baseline pass rule, 85% final exam rule, saved flashcards, stars, XP, streaks, and subscriber-locked advanced material.",
  nextBuildStep:
    "Convert the written mastery prompts with answer keys into fully auto-graded question banks where exact scoring is required.",
};
