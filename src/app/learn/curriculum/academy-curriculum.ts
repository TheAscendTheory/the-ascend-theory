import { academyStages, ascendRanks } from "./academy-real-content";

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

export const academyRankLadder = ascendRanks;

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
      "Learners move through 16 levels from Initiate to Ascender with progression, stars, XP, streaks, and saved practice.",
  },
  {
    title: "Free-To-Subscriber Structure",
    text:
      "The first five levels are free, which keeps roughly 30% of the Academy open while advanced certification stays subscriber-only.",
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
    "Levels 1-5 are free. Levels 6-16 remain visible but locked until subscription access is active.",
  proofRequirement:
    "Major modules should require a proof artifact before certification: worksheet, plan, journal entry, market map, or reflection.",
};

export const curriculumTracks: CurriculumTrack[] = [
  {
    id: "ascend-academy",
    title: "Ascend Academy",
    audience: "Students, families, traders, builders, and self-directed learners",
    freePercent: 31,
    modules: academyStages,
  },
];

export const curriculumSummary = {
  currentImplementedQuizCount: academyStages.reduce(
    (total, module) => total + module.assessmentQuestions,
    0
  ),
  targetModel:
    "Sixteen rank-gated levels with full readings, real mastery prompts, 80% pass rule, 85% final exam rule, saved flashcards, stars, XP, streaks, and subscriber-locked advanced material.",
  nextBuildStep:
    "Convert the written mastery prompts with answer keys into fully auto-graded question banks where exact scoring is required.",
};
