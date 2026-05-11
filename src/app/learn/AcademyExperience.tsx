"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Lock,
  Play,
  Star,
  Video,
} from "lucide-react";
import { createBrowserSupabaseClient } from "../lib/supabaseBrowser";
import {
  assessmentPolicy,
  curriculumTracks,
  type CurriculumModule,
} from "./curriculum/academy-curriculum";

type AcademyProgress = {
  completed: string[];
  stars: Record<string, number>;
  scores: Record<string, number>;
  savedQuestions: string[];
  wrongAnswers: Record<string, number>;
  savedParagraphs: {
    moduleId: string;
    moduleTitle: string;
    index: number;
    text: string;
  }[];
  highlightedParagraphs: string[];
  lastRead: Record<string, number>;
  xp: number;
  coins: number;
  streak: number;
};

type QuizQuestion = {
  question: string;
  options?: string[];
  answer?: string;
  mode: "choice" | "written";
};

const storageKey = "ascend-academy-reader-progress";

const defaultProgress: AcademyProgress = {
  completed: [],
  stars: {},
  scores: {},
  savedQuestions: [],
  wrongAnswers: {},
  savedParagraphs: [],
  highlightedParagraphs: [],
  lastRead: {},
  xp: 0,
  coins: 0,
  streak: 0,
};

function moduleXp(module: CurriculumModule) {
  return module.assessmentQuestions >= 50 ? 650 : 320;
}

function starCount(score: number) {
  if (score >= 95) return 5;
  if (score >= 90) return 4;
  if (score >= 80) return 3;
  if (score >= 60) return 2;
  return 1;
}

function buildModuleQuestions(module: CurriculumModule): QuizQuestion[] {
  if (module.quizQuestions?.length) {
    return module.quizQuestions;
  }

  if (module.quizPrompts?.length) {
    return module.quizPrompts.map((question) => ({
      question,
      mode: "written",
    }));
  }

  const source = [
    ...module.learningObjectives,
    ...module.readingSections,
    ...module.workbookTasks,
    ...module.proofChecklist,
  ];

  return Array.from({ length: module.assessmentQuestions }, (_, index) => {
    const sourceText = source[index % source.length];
    const topic = sourceText.replace(/\.$/, "");

    if (index % 4 === 0) {
      return {
        question: `In ${module.title}, what should the learner be able to explain or apply: ${topic}?`,
        options: [
          "Use the concept in a real decision or written proof artifact",
          "Memorize the title without applying it",
          "Skip the concept and move to the final badge",
        ],
        answer: "Use the concept in a real decision or written proof artifact",
        mode: "choice",
      };
    }

    if (index % 4 === 1) {
      return {
        question: `What is the strongest evidence of mastery for this lesson area: ${topic}?`,
        options: [
          "A completed worksheet, explanation, map, plan, or review",
          "A guess made during the quiz",
          "A copied definition with no example",
        ],
        answer: "A completed worksheet, explanation, map, plan, or review",
        mode: "choice",
      };
    }

    if (index % 4 === 2) {
      return {
        question: `Why does ${module.title} use locked progression?`,
        options: [
          "So later lessons build on proven foundations",
          "So learners can avoid fundamentals",
          "So quizzes become optional decoration",
        ],
        answer: "So later lessons build on proven foundations",
        mode: "choice",
      };
    }

    return {
      question: `What score is required to pass ${module.title}?`,
      options: [`${module.passScore}%`, "50%", "100% only"],
      answer: `${module.passScore}%`,
      mode: "choice",
    };
  });
}

function buildReadingPassage(module: CurriculumModule) {
  if (module.lessonText) {
    const blocks = module.lessonText
      .split(/\n(?=\d+\.\s+)/)
      .map((block) =>
        block
          .split(/\n+/)
          .map((line) => line.trim())
          .filter(Boolean)
          .join("\n")
      )
      .filter(Boolean);

    const cleanedBlocks =
      blocks.length > 1
        ? blocks.filter((block, index) => {
            if (index > 0) return true;
            const lines = block
              .split(/\n+/)
              .map((line) => line.trim())
              .filter(Boolean)
              .filter((line) => line.toLowerCase() !== "lesson:");

            return lines.length > 1 && !lines.every((line) => /^stage\s+\d+/i.test(line));
          })
        : module.lessonText.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);

    return cleanedBlocks;
  }

  return [
    `${module.title} begins with one practical promise: the learner should be able to use the idea in real life, not merely repeat a definition. ${module.overview}`,
    `The first layer is understanding the language. ${module.readingSections[0] || module.learningObjectives[0]} This gives the learner a mental handle before numbers, charts, or decisions get more complex.`,
    `The second layer is application. ${module.readingSections[1] || module.learningObjectives[1]} A strong student should be able to explain the concept, create a small example, and notice where the idea appears in daily money choices, markets, news, or personal planning.`,
    `The third layer is proof. ${module.workbookTasks[0] || "Create a written artifact that shows the concept being used."} Ascend treats this as evidence of learning because certificates should represent usable skill, not passive scrolling.`,
    `Before the quiz, the learner should be able to answer three questions in plain language: what does this concept mean, where does it show up, and what decision becomes better because I understand it?`,
  ];
}

function paragraphKey(moduleId: string, index: number) {
  return `${moduleId}:${index}`;
}

function formatReadingBlock(block: string, index: number) {
  const lines = block
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.toLowerCase() !== "lesson:");
  const firstLine = lines[0] || `Lesson block ${index + 1}`;
  const hasNumberedTitle = /^\d+\.\s+/.test(firstLine);
  const title = hasNumberedTitle
    ? firstLine
    : firstLine.length > 14
      ? firstLine
      : lines[1] || firstLine;
  const bodyLines = hasNumberedTitle ? lines.slice(1) : lines.filter((line) => line !== title);

  return {
    label: hasNumberedTitle ? `Lesson ${String(index + 1).padStart(2, "0")}` : "Overview",
    title,
    bodyLines,
  };
}

function isSubPoint(line: string) {
  return /^([A-Z]\.|[a-z]\)|[-*])\s+/.test(line);
}

function visualTone(index: number) {
  return ["map", "model", "practice", "review"][index % 4];
}

function encodeMemoryPayload(value: unknown) {
  return btoa(encodeURIComponent(JSON.stringify(value)));
}

function decodeMemoryPayload<T>(value: string): T | null {
  try {
    return JSON.parse(decodeURIComponent(atob(value))) as T;
  } catch {
    return null;
  }
}

function flattenModules() {
  return curriculumTracks.flatMap((track) =>
    track.modules.map((module) => ({
      ...module,
      trackTitle: track.title,
      audience: track.audience,
    }))
  );
}

const academyModules = flattenModules();

export default function AcademyExperience() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const modules = academyModules;
  const [progress, setProgress] = useState<AcademyProgress>(() => {
    if (typeof window === "undefined") {
      return defaultProgress;
    }

    const saved = window.localStorage.getItem(storageKey);

    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
  });
  const [activeId, setActiveId] = useState(modules[0]?.id || "");
  const [step, setStep] = useState<"intro" | "lesson" | "quiz" | "result">("intro");
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [status, setStatus] = useState("Progress saves locally. Sign in to sync across devices.");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceFlipped, setPracticeFlipped] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [hearts, setHearts] = useState(5);
  const [combo, setCombo] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [subscriberAccess, setSubscriberAccess] = useState(false);

  const activeIndex = modules.findIndex((module) => module.id === activeId);
  const activeModule = modules[activeIndex] || modules[0];
  const questions = activeModule ? buildModuleQuestions(activeModule) : [];
  const currentQuestion = questions[questionIndex];
  const readingPassage = activeModule ? buildReadingPassage(activeModule) : [];
  const activeLastRead = activeModule ? progress.lastRead[activeModule.id] || 0 : 0;
  const activeSavedParagraphs = activeModule
    ? progress.savedParagraphs.filter((paragraph) => paragraph.moduleId === activeModule.id)
    : [];
  const quizProgress = questions.length ? Math.round(((questionIndex + (feedback ? 1 : 0)) / questions.length) * 100) : 0;
  const practiceDeck = [
    ...progress.savedQuestions.map((question) => {
      const matched = modules
        .flatMap((module) => buildModuleQuestions(module))
        .find((item) => item.question === question);

      return {
        id: `question:${question}`,
        front: question,
        back: matched?.answer || "Review your written response and compare it with the lesson.",
      };
    }),
    ...progress.savedParagraphs.map((paragraph) => ({
      id: paragraphKey(paragraph.moduleId, paragraph.index),
      front: `${paragraph.moduleTitle} / paragraph ${paragraph.index + 1}`,
      back: paragraph.text,
    })),
  ];
  const activePracticeCard = practiceDeck.length ? practiceDeck[practiceIndex % practiceDeck.length] : null;
  const frequentlyWrong = Object.entries(progress.wrongAnswers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const adaptiveMode = subscriberAccess
    ? "Subscriber mode"
    : combo >= 5
      ? "Challenge pace"
      : hearts <= 2
        ? "Recovery pace"
        : "Steady pace";
  const unlockedIndex =
    modules.findIndex((module) => !progress.completed.includes(module.id)) === -1
      ? modules.length - 1
      : modules.findIndex((module) => !progress.completed.includes(module.id));

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    async function loadCloudProgress() {
      if (!supabase) return;

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) return;

      const { data, error } = await supabase
        .from("ascend_academy_progress")
        .select("stage_id,course_id,saved_question,score,xp_earned")
        .eq("user_id", userId);

      if (error) {
        setStatus("Progress is saved on this device. Sign in again later to sync.");
        return;
      }

      const completed = data
        ?.filter((row) => row.course_id)
        .map((row) => row.course_id as string) || [];
      const savedQuestions = data
        ?.filter((row) => row.saved_question && !String(row.saved_question).startsWith("paragraph::") && !String(row.saved_question).startsWith("highlight::"))
        .map((row) => row.saved_question as string) || [];
      const savedParagraphs = (data || [])
        .filter((row) => String(row.saved_question || "").startsWith("paragraph::"))
        .map((row) => decodeMemoryPayload<AcademyProgress["savedParagraphs"][number]>(String(row.saved_question).replace("paragraph::", "")))
        .filter(Boolean) as AcademyProgress["savedParagraphs"];
      const highlightedParagraphs = (data || [])
        .filter((row) => String(row.saved_question || "").startsWith("highlight::"))
        .map((row) => String(row.saved_question).replace("highlight::", ""));
      const cloudLastRead = Object.fromEntries(
        (data || [])
          .filter((row) => String(row.stage_id || "").startsWith("last-read::"))
          .map((row) => [String(row.stage_id).replace("last-read::", ""), row.score || 0])
      );
      const scores = Object.fromEntries(
        (data || [])
          .filter((row) => row.course_id)
          .map((row) => [row.course_id as string, row.score || 0])
      );
      const { data: entitlementRows } = await supabase
        .from("ascend_media_entitlements")
        .select("entitlement")
        .eq("user_id", userId)
        .in("entitlement", ["subscription", "admin"])
        .limit(1);

      setProgress((current) => ({
        ...current,
        completed: Array.from(new Set([...current.completed, ...completed])),
        savedQuestions: Array.from(new Set([...current.savedQuestions, ...savedQuestions])),
        savedParagraphs: Array.from(
          new Map(
            [...current.savedParagraphs, ...savedParagraphs].map((paragraph) => [
              paragraphKey(paragraph.moduleId, paragraph.index),
              paragraph,
            ])
          ).values()
        ),
        highlightedParagraphs: Array.from(new Set([...current.highlightedParagraphs, ...highlightedParagraphs])),
        lastRead: { ...current.lastRead, ...cloudLastRead },
        scores: { ...current.scores, ...scores },
        xp: Math.max(current.xp, (data || []).reduce((sum, row) => sum + (row.xp_earned || 0), 0)),
      }));
      setSubscriberAccess(Boolean(entitlementRows?.length));
      setStatus("Account sync active for Academy progress.");
    }

    loadCloudProgress();
  }, [supabase]);

  useEffect(() => {
    if (step !== "lesson" || !activeModule || typeof IntersectionObserver === "undefined") return;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-academy-module="${activeModule.id}"]`)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleIndexes = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => Number((entry.target as HTMLElement).dataset.paragraphIndex || 0));

        const furthest = Math.max(...visibleIndexes, -1);
        if (furthest < 0) return;

        setProgress((current) => {
          if ((current.lastRead[activeModule.id] || 0) >= furthest) return current;

          return {
            ...current,
            lastRead: {
              ...current.lastRead,
              [activeModule.id]: furthest,
            },
          };
        });
      },
      { threshold: 0.45 }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [step, activeModule]);

  async function saveCloudProgress(nextProgress: AcademyProgress, module: CurriculumModule, score: number) {
    if (!supabase) return;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) return;

    const { error } = await supabase.from("ascend_academy_progress").upsert({
      user_id: userId,
      course_id: module.id,
      score,
      xp_earned: moduleXp(module),
      completed_at: new Date().toISOString(),
    });

    if (error) {
      setStatus("Saved locally. Account sync needs attention.");
      return;
    }

    await supabase
      .from("ascend_profiles")
      .update({ academy_level: `Academy XP ${nextProgress.xp}` })
      .eq("user_id", userId);
    setStatus("Academy progress saved.");
  }

  async function saveQuestion(question: string) {
    const nextProgress = {
      ...progress,
      savedQuestions: Array.from(new Set([...progress.savedQuestions, question])),
    };

    setProgress(nextProgress);

    if (!supabase) return;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) return;

    await supabase.from("ascend_academy_progress").upsert({
      user_id: userId,
      saved_question: question,
      score: 0,
      xp_earned: 0,
      completed_at: new Date().toISOString(),
    });
  }

  async function syncReadingMemory(
    payload:
      | { type: "last-read"; moduleId: string; index: number }
      | { type: "paragraph"; paragraph: AcademyProgress["savedParagraphs"][number] }
      | { type: "highlight"; key: string }
  ) {
    if (!supabase) return;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) return;

    if (payload.type === "last-read") {
      await supabase.from("ascend_academy_progress").upsert({
        user_id: userId,
        stage_id: `last-read::${payload.moduleId}`,
        score: payload.index,
        xp_earned: 0,
        completed_at: new Date().toISOString(),
      });
      return;
    }

    if (payload.type === "paragraph") {
      await supabase.from("ascend_academy_progress").upsert({
        user_id: userId,
        saved_question: `paragraph::${encodeMemoryPayload(payload.paragraph)}`,
        score: 0,
        xp_earned: 0,
        completed_at: new Date().toISOString(),
      });
      return;
    }

    await supabase.from("ascend_academy_progress").upsert({
      user_id: userId,
      saved_question: `highlight::${payload.key}`,
      score: 0,
      xp_earned: 0,
      completed_at: new Date().toISOString(),
    });
  }

  function markParagraphRead(index: number) {
    if (!activeModule) return;

    setProgress((current) => ({
      ...current,
      lastRead: {
        ...current.lastRead,
        [activeModule.id]: index,
      },
    }));
    syncReadingMemory({ type: "last-read", moduleId: activeModule.id, index });
    setStatus(`Saved reading position in ${activeModule.title}.`);
  }

  function saveParagraph(index: number, text: string) {
    if (!activeModule) return;

    const paragraph = {
      moduleId: activeModule.id,
      moduleTitle: activeModule.title,
      index,
      text,
    };

    setProgress((current) => ({
      ...current,
      savedParagraphs: Array.from(
        new Map(
          [...current.savedParagraphs, paragraph].map((saved) => [
            paragraphKey(saved.moduleId, saved.index),
            saved,
          ])
        ).values()
      ),
      lastRead: {
        ...current.lastRead,
        [activeModule.id]: index,
      },
    }));
    syncReadingMemory({ type: "paragraph", paragraph });
    syncReadingMemory({ type: "last-read", moduleId: activeModule.id, index });
    setStatus("Paragraph saved to your reading bank.");
  }

  function toggleHighlightParagraph(index: number) {
    if (!activeModule) return;

    const key = paragraphKey(activeModule.id, index);

    setProgress((current) => {
      const highlighted = current.highlightedParagraphs.includes(key);

      return {
        ...current,
        highlightedParagraphs: highlighted
          ? current.highlightedParagraphs.filter((item) => item !== key)
          : [...current.highlightedParagraphs, key],
        lastRead: {
          ...current.lastRead,
          [activeModule.id]: index,
        },
      };
    });

    if (!progress.highlightedParagraphs.includes(key)) {
      syncReadingMemory({ type: "highlight", key });
    }
    syncReadingMemory({ type: "last-read", moduleId: activeModule.id, index });
    setStatus("Highlight updated.");
  }

  function continueReading() {
    if (!activeModule) return;

    setStep("lesson");
    window.setTimeout(() => {
      document
        .getElementById(paragraphKey(activeModule.id, activeLastRead))
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  }

  function openModule(moduleId: string, index: number) {
    if (index > unlockedIndex && !progress.completed.includes(moduleId)) return;
    setActiveId(moduleId);
    setStep("intro");
    setResult(null);
    resetQuizLoop();
  }

  function resetQuizLoop() {
    setQuestionIndex(0);
    setSelectedAnswer("");
    setWrittenAnswer("");
    setCorrectCount(0);
    setFeedback(null);
    setHearts(5);
    setCombo(0);
    setSessionXp(0);
  }

  function startQuizLoop() {
    resetQuizLoop();
    setStep("quiz");
  }

  function exitQuizToReading() {
    resetQuizLoop();
    setStep("lesson");
    setStatus("Test session reset. Reading progress is still saved.");
  }

  function finishQuiz(finalCorrect: number) {
    if (!activeModule || !questions.length) return;

    const score = Math.round((finalCorrect / questions.length) * 100);
    const passed = score >= activeModule.passScore;
    setResult({ score, passed });
    setStep("result");

    if (!passed) return;

    const nextProgress = {
      ...progress,
      completed: Array.from(new Set([...progress.completed, activeModule.id])),
      stars: {
        ...progress.stars,
        [activeModule.id]: Math.max(progress.stars[activeModule.id] || 0, starCount(score)),
      },
      scores: {
        ...progress.scores,
        [activeModule.id]: Math.max(progress.scores[activeModule.id] || 0, score),
      },
      xp: progress.completed.includes(activeModule.id)
        ? progress.xp
        : progress.xp + Math.round(moduleXp(activeModule) * (score / 100)),
      coins: progress.coins + Math.max(10, finalCorrect * 2 + combo),
      streak: passed ? progress.streak + 1 : progress.streak,
    };

    setProgress(nextProgress);
    saveCloudProgress(nextProgress, activeModule, score);
  }

  function answerQuestion(answer: string) {
    if (!currentQuestion || feedback || !currentQuestion.answer) return;

    const isCorrect = answer === currentQuestion.answer;
    setSelectedAnswer(answer);
    setFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      const nextCombo = combo + 1;
      setCorrectCount((current) => current + 1);
      setCombo(nextCombo);
      setSessionXp((current) => current + 10 + Math.min(nextCombo, 10));
      setProgress((current) => ({
        ...current,
        coins: current.coins + 2 + Math.min(nextCombo, 5),
      }));
      return;
    }

    setCombo(0);
    setProgress((current) => ({
      ...current,
      wrongAnswers: {
        ...current.wrongAnswers,
        [currentQuestion.question]: (current.wrongAnswers[currentQuestion.question] || 0) + 1,
      },
    }));
    if (!subscriberAccess) {
      setHearts((current) => Math.max(0, current - 1));
    }
  }

  function submitWrittenAnswer() {
    if (!currentQuestion || feedback || writtenAnswer.trim().length < 8) return;

    const nextCombo = combo + 1;
    setCorrectCount((current) => current + 1);
    setCombo(nextCombo);
    setSessionXp((current) => current + 10 + Math.min(nextCombo, 10));
    setFeedback("correct");
    setProgress((current) => ({
      ...current,
      coins: current.coins + 2 + Math.min(nextCombo, 5),
    }));
  }

  function nextQuestion() {
    const finalCorrect = correctCount + (feedback === "correct" ? 1 : 0);
    const noHeartsLeft = !subscriberAccess && feedback === "incorrect" && hearts <= 1;
    const lastQuestion = questionIndex >= questions.length - 1;

    if (lastQuestion || noHeartsLeft) {
      finishQuiz(finalCorrect);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedAnswer("");
    setWrittenAnswer("");
    setFeedback(null);
  }

  function shufflePracticeDeck() {
    if (!practiceDeck.length) return;
    setPracticeIndex(Math.floor(Math.random() * practiceDeck.length));
    setPracticeFlipped(false);
  }

  if (!activeModule) {
    return null;
  }

  return (
    <section className="academyExperience">
      <div className="academyCommandBar">
        <article>
          <span>Academy XP</span>
          <strong>{progress.xp}</strong>
        </article>
        <article>
          <span>Coins</span>
          <strong>{progress.coins}</strong>
        </article>
        <article>
          <span>Streak</span>
          <strong>{progress.streak}</strong>
        </article>
        <article>
          <span>Flashcards</span>
          <strong>{progress.savedQuestions.length}</strong>
        </article>
      </div>

      <p className="academyStatusLine">{status}</p>

      <div className="academyReaderLayout">
        <aside className="academyPathPanel">
          <p className="eyebrow">Learning Map</p>
          <h2>Locked path, clear progress.</h2>
          <div className="academyModulePath">
            {modules.map((module, index) => {
              const complete = progress.completed.includes(module.id);
              const progressionLocked = index > unlockedIndex && !complete;
              const accessLocked = module.access === "subscriber" && !subscriberAccess && !complete;
              const locked = progressionLocked || accessLocked;
              const active = module.id === activeModule.id;

              return (
                <button
                  key={module.id}
                  type="button"
                  className={active ? "isActive" : ""}
                  disabled={locked}
                  onClick={() => openModule(module.id, index)}
                >
                  <span>{index + 1}</span>
                  <div>
                    <strong>{module.title}</strong>
                    <em>
                      {module.rank} - {module.assessmentQuestions} prompts
                      {accessLocked ? " - subscriber" : ""}
                    </em>
                  </div>
                  {complete ? <CheckCircle2 size={18} /> : locked ? <Lock size={18} /> : <Play size={18} />}
                </button>
              );
            })}
          </div>
        </aside>

        <article className="academyReader">
          <div className="academyReaderHeader">
            <div>
              <p className="eyebrow">{activeModule.trackTitle} / {activeModule.level}</p>
              <h2>{activeModule.title}</h2>
              <span>
                Rank {activeModule.rank}. {activeModule.assessmentQuestions} mastery prompts.{" "}
                {activeModule.passScore}% to pass.
              </span>
            </div>
            <strong>{progress.stars[activeModule.id] || 0}/5 stars</strong>
          </div>

          {step === "intro" && (
            <div className="academyReaderIntro">
              <div className="academyLecturePreview">
                <div className={`academyVisualFrame ${visualTone(activeIndex)}`}>
                  <span />
                  <span />
                  <span />
                  <strong>{activeModule.rank}</strong>
                </div>
                <div>
                  <p className="eyebrow">Class Preview</p>
                  <h3>{activeModule.title}</h3>
                  <p>{activeModule.overview}</p>
                </div>
              </div>
              <p>{activeModule.overview}</p>
              <div className="dailyChallengeCard">
                <strong>Daily challenge</strong>
                <span>
                  Finish a short sprint, save one weak question, and keep momentum.
                </span>
              </div>
              <div>
                {activeModule.learningObjectives.map((objective) => (
                  <span key={objective}>{objective}</span>
                ))}
              </div>
              <div className="academyIntroActions">
                <button type="button" onClick={() => setStep("lesson")}>
                  <BookOpen size={17} />
                  {activeLastRead ? "Continue Reading" : "Begin Reading"}
                </button>
                {activeLastRead > 0 && (
                  <button type="button" onClick={continueReading}>
                    <Play size={17} />
                    Reading paragraph {activeLastRead + 1}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === "lesson" && (
            <div className="academyLessonReader">
              <button type="button" className="plainBackButton" onClick={() => setStep("intro")}>
                <ArrowLeft size={16} />
                Module overview
              </button>
              <aside className="academyLessonMedia">
                <article>
                  <Video size={18} />
                  <div>
                    <strong>Lecture support</strong>
                    <p>Short walkthroughs and class-style explanations can sit beside the reading.</p>
                  </div>
                </article>
                <article>
                  <ImageIcon size={18} />
                  <div>
                    <strong>Visual model</strong>
                    <p>Key ideas are supported with diagrams, examples, and animated study cues.</p>
                  </div>
                </article>
                <div className={`academyVisualFrame ${visualTone(activeIndex + activeLastRead)}`}>
                  <span />
                  <span />
                  <span />
                  <strong>{activeModule.rank}</strong>
                </div>
              </aside>
              <section>
                <h3>Reading Passage</h3>
                <div className="academyMemoryBar">
                  <span>
                    {activeLastRead > 0
                      ? `Last read: paragraph ${activeLastRead + 1} of ${readingPassage.length}`
                      : `Start here: ${readingPassage.length} reading blocks`}
                  </span>
                  <span>{activeSavedParagraphs.length} saved from this level</span>
                  {activeLastRead > 0 && (
                    <button type="button" onClick={continueReading}>
                      Continue Reading
                    </button>
                  )}
                </div>
                <div className="academyPassage">
                  {readingPassage.map((paragraph, index) => {
                    const key = paragraphKey(activeModule.id, index);
                    const highlighted = progress.highlightedParagraphs.includes(key);
                    const saved = activeSavedParagraphs.some((savedParagraph) => savedParagraph.index === index);

                    return (
                      <article
                        key={key}
                        id={key}
                        data-academy-module={activeModule.id}
                        data-paragraph-index={index}
                        className={highlighted ? "isHighlighted" : ""}
                      >
                        {(() => {
                          const block = formatReadingBlock(paragraph, index);

                          return (
                            <>
                              <header className="academyLectureBlockHeader">
                                <span>{block.label}</span>
                                <h4>{block.title}</h4>
                              </header>
                              <div className="academyLectureText">
                                {block.bodyLines.map((line, lineIndex) => (
                                  <p
                                    key={`${key}-line-${lineIndex}`}
                                    className={isSubPoint(line) ? "isSubPoint" : ""}
                                  >
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                        <div className="paragraphMemoryTools">
                          <button type="button" onClick={() => toggleHighlightParagraph(index)}>
                            <Star size={14} />
                            {highlighted ? "Highlighted" : "Highlight"}
                          </button>
                          <button type="button" onClick={() => saveParagraph(index, paragraph)}>
                            <BookMarked size={14} />
                            {saved ? "Saved" : "Save"}
                          </button>
                          <button type="button" onClick={() => markParagraphRead(index)}>
                            <CheckCircle2 size={14} />
                            Mark Read
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section>
                <h3>Reading Path</h3>
                {activeModule.readingSections.map((section, index) => (
                  <article key={section}>
                    <FileText size={18} />
                    <div>
                      <strong>{index + 1}. {section}</strong>
                      <p>
                        Write the idea in your own words, then connect it to a real decision.
                      </p>
                    </div>
                  </article>
                ))}
              </section>

              <section>
                <h3>Proof Work</h3>
                {activeModule.workbookTasks.map((task) => (
                  <article key={task}>
                    <BookMarked size={18} />
                    <div>
                      <strong>{task}</strong>
                      <p>Use this as proof for certificates and account mastery.</p>
                    </div>
                  </article>
                ))}
              </section>

              <button type="button" onClick={startQuizLoop}>
                <Star size={17} />
                Start Test
              </button>
            </div>
          )}

          {step === "quiz" && currentQuestion && (
            <div className={feedback ? `academyQuizLoop is${feedback}` : "academyQuizLoop"}>
              <div className="quizLoopTop">
                <button type="button" className="plainBackButton" onClick={exitQuizToReading}>
                  <ArrowLeft size={16} />
                  Exit Test
                </button>
                <div className="quizLoopProgress" aria-label={`Quiz progress ${quizProgress}%`}>
                  <span style={{ width: `${quizProgress}%` }} />
                </div>
              </div>

              <div className="quizLoopStats">
                <span>{subscriberAccess ? "Unlimited" : `${hearts}/5 hearts`}</span>
                <span>{sessionXp} XP</span>
                <span>{combo} combo</span>
                <span>{adaptiveMode}</span>
              </div>

              <div className="quizQuestionCard">
                <p className="eyebrow">Question {questionIndex + 1} of {questions.length}</p>
                <h3>{currentQuestion.question}</h3>
                {currentQuestion.mode === "choice" && currentQuestion.options?.length ? (
                  <div className="quizAnswerGrid">
                    {currentQuestion.options.map((option) => {
                      const chosen = selectedAnswer === option;
                      const correct = option === currentQuestion.answer;
                      const stateClass = feedback
                        ? correct
                          ? "isCorrect"
                          : chosen
                            ? "isWrong"
                            : ""
                        : "";

                      return (
                        <button
                          key={option}
                          type="button"
                          className={stateClass}
                          disabled={Boolean(feedback)}
                          onClick={() => answerQuestion(option)}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="quizWrittenAnswer">
                    <textarea
                      value={writtenAnswer}
                      disabled={Boolean(feedback)}
                      onChange={(event) => setWrittenAnswer(event.target.value)}
                      placeholder="Write your answer in your own words. This is saved as a mastery response prompt for now."
                    />
                    <button
                      type="button"
                      disabled={Boolean(feedback) || writtenAnswer.trim().length < 8}
                      onClick={submitWrittenAnswer}
                    >
                      Save Answer
                    </button>
                  </div>
                )}
              </div>

              {feedback && (
                <div className="quizFeedbackPanel">
                  <strong>
                    {currentQuestion.mode === "written"
                      ? "Answer saved. XP added."
                      : feedback === "correct"
                        ? "Correct. XP added."
                        : "Not quite. Heart lost."}
                  </strong>
                  <p>
                    {currentQuestion.mode === "written"
                      ? "This prompt now counts toward your mastery sprint. Save it to flashcards if it deserves extra review."
                      : feedback === "correct"
                      ? `+${10 + Math.min(combo, 10)} XP, +${2 + Math.min(combo, 5)} coins, combo now ${combo}.`
                      : subscriberAccess
                        ? `Answer: ${currentQuestion.answer}. Unlimited attempts are active.`
                        : `Correct answer: ${currentQuestion.answer}`}
                  </p>
                  <div>
                    <button type="button" onClick={() => saveQuestion(currentQuestion.question)}>
                      <BookMarked size={15} />
                      Save
                    </button>
                    <button type="button" onClick={nextQuestion}>
                      <Play size={16} />
                      {questionIndex >= questions.length - 1 || (!subscriberAccess && hearts <= 1) ? "Finish" : "Next"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "result" && result && (
            <div className="academyResultPanel">
              <h3>{result.passed ? "Passed. Module unlocked." : "Not yet. Review and retry."}</h3>
              <strong>{result.score}%</strong>
              <p>
                {result.passed
                  ? `You earned ${starCount(result.score)} stars. Retakes can improve proficiency.`
                  : "You need 80% or higher. Review the reading, save weak questions, then retry."}
              </p>
              <div>
                <button type="button" onClick={() => setStep("lesson")}>
                  <BookOpen size={17} />
                  Review Lesson
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextIndex = Math.min(activeIndex + 1, modules.length - 1);
                    openModule(modules[nextIndex].id, nextIndex);
                  }}
                  disabled={!result.passed || activeIndex >= modules.length - 1}
                >
                  <Play size={17} />
                  Next Module
                </button>
              </div>
            </div>
          )}
        </article>
      </div>

      <section className="flashcardBank">
        <div>
          <p className="eyebrow">Saved Slot</p>
          <h2>Flashcard and reading bank.</h2>
          <p>Saved questions and paragraphs live here as their own practice area, separate from the module map.</p>
        </div>

        <div>
          {progress.savedQuestions.length || progress.savedParagraphs.length ? (
            <>
              {progress.savedQuestions.map((question) => <span key={question}>{question}</span>)}
              {progress.savedParagraphs.map((paragraph) => (
                <span key={paragraphKey(paragraph.moduleId, paragraph.index)}>
                  {paragraph.moduleTitle} / paragraph {paragraph.index + 1}: {paragraph.text}
                </span>
              ))}
            </>
          ) : (
            <span>Save questions and paragraphs to build a personal practice bank.</span>
          )}
        </div>
      </section>

      <section className="academyPracticeArena">
        <div>
          <p className="eyebrow">Practice Arena</p>
          <h2>Retention recall deck.</h2>
          <p>Shuffle saved questions and lesson highlights. Tap the card to reveal the answer or saved passage.</p>
        </div>

        <article
          className={practiceFlipped ? "practiceCard isFlipped" : "practiceCard"}
          onClick={() => practiceDeck.length && setPracticeFlipped((flipped) => !flipped)}
        >
          <span>{practiceFlipped ? "Back" : "Front"}</span>
          <strong>
            {activePracticeCard
              ? practiceFlipped
                ? activePracticeCard.back
                : activePracticeCard.front
              : "Save questions or paragraphs to build your recall deck."}
          </strong>
        </article>

        <div className="practiceActions">
          <button type="button" onClick={shufflePracticeDeck} disabled={!practiceDeck.length}>
            Shuffle Deck
          </button>
          <button
            type="button"
            onClick={() => {
              if (!practiceDeck.length) return;
              setPracticeIndex((index) => (index + 1) % practiceDeck.length);
              setPracticeFlipped(false);
            }}
            disabled={!practiceDeck.length}
          >
            Next Card
          </button>
        </div>

        <div className="wrongAnswerColumn">
          <h3>Frequently answered wrong</h3>
          {frequentlyWrong.length ? (
            frequentlyWrong.map(([question, count]) => (
              <button key={question} type="button" onClick={() => saveQuestion(question)}>
                <span>{count} misses</span>
                {question}
              </button>
            ))
          ) : (
            <p>Questions you miss during tests will collect here for faster review.</p>
          )}
        </div>
      </section>

      <section className="academyPolicyStrip">
        <article>
          <span>Pass Rule</span>
          <strong>{assessmentPolicy.passScore}%</strong>
        </article>
        <article>
          <span>Stars</span>
          <strong>1-5 proficiency</strong>
        </article>
        <article>
          <span>Practice</span>
          <strong>Recall deck</strong>
        </article>
        <article>
          <span>Progress</span>
          <strong>Locked path</strong>
        </article>
      </section>
    </section>
  );
}
