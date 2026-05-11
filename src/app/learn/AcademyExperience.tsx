"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  CheckCircle2,
  FileText,
  Lock,
  Play,
  Star,
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
  xp: number;
  coins: number;
  streak: number;
};

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

const storageKey = "ascend-academy-reader-progress";

const defaultProgress: AcademyProgress = {
  completed: [],
  stars: {},
  scores: {},
  savedQuestions: [],
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
      };
    }

    return {
      question: `What score is required to pass ${module.title}?`,
      options: [`${module.passScore}%`, "50%", "100% only"],
      answer: `${module.passScore}%`,
    };
  });
}

function buildReadingPassage(module: CurriculumModule) {
  return [
    `${module.title} begins with one practical promise: the learner should be able to use the idea in real life, not merely repeat a definition. ${module.overview}`,
    `The first layer is understanding the language. ${module.readingSections[0] || module.learningObjectives[0]} This gives the learner a mental handle before numbers, charts, or decisions get more complex.`,
    `The second layer is application. ${module.readingSections[1] || module.learningObjectives[1]} A strong student should be able to explain the concept, create a small example, and notice where the idea appears in daily money choices, markets, news, or personal planning.`,
    `The third layer is proof. ${module.workbookTasks[0] || "Create a written artifact that shows the concept being used."} Ascend treats this as evidence of learning because certificates should represent usable skill, not passive scrolling.`,
    `Before the quiz, the learner should be able to answer three questions in plain language: what does this concept mean, where does it show up, and what decision becomes better because I understand it?`,
  ];
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
  const [status, setStatus] = useState("Progress saves locally. Sign in to sync with Supabase.");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
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
  const quizProgress = questions.length ? Math.round(((questionIndex + (feedback ? 1 : 0)) / questions.length) * 100) : 0;
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
        .select("course_id,saved_question,score,xp_earned")
        .eq("user_id", userId);

      if (error) {
        setStatus("Supabase connected, but academy progress table needs the schema applied.");
        return;
      }

      const completed = data
        ?.filter((row) => row.course_id)
        .map((row) => row.course_id as string) || [];
      const savedQuestions = data
        ?.filter((row) => row.saved_question)
        .map((row) => row.saved_question as string) || [];
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
        scores: { ...current.scores, ...scores },
        xp: Math.max(current.xp, (data || []).reduce((sum, row) => sum + (row.xp_earned || 0), 0)),
      }));
      setSubscriberAccess(Boolean(entitlementRows?.length));
      setStatus("Supabase sync active for Academy progress.");
    }

    loadCloudProgress();
  }, [supabase]);

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
      setStatus("Saved locally. Supabase academy progress needs schema verification.");
      return;
    }

    await supabase
      .from("ascend_profiles")
      .update({ academy_level: `Academy XP ${nextProgress.xp}` })
      .eq("user_id", userId);
    setStatus("Academy progress saved locally and synced to Supabase.");
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
    if (!currentQuestion || feedback) return;

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
    if (!subscriberAccess) {
      setHearts((current) => Math.max(0, current - 1));
    }
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
    setFeedback(null);
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
              const locked = index > unlockedIndex && !complete;
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
                    <em>{module.level} - {module.assessmentQuestions} questions</em>
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
                {activeModule.assessmentQuestions} questions. {activeModule.passScore}% to pass.
              </span>
            </div>
            <strong>{progress.stars[activeModule.id] || 0}/5 stars</strong>
          </div>

          {step === "intro" && (
            <div className="academyReaderIntro">
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
              <button type="button" onClick={() => setStep("lesson")}>
                <BookOpen size={17} />
                Begin Lesson
              </button>
            </div>
          )}

          {step === "lesson" && (
            <div className="academyLessonReader">
              <button type="button" className="plainBackButton" onClick={() => setStep("intro")}>
                <ArrowLeft size={16} />
                Module overview
              </button>
              <section>
                <h3>Reading Passage</h3>
                <div className="academyPassage">
                  {buildReadingPassage(activeModule).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
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
                Start 1-Minute Sprint
              </button>
            </div>
          )}

          {step === "quiz" && currentQuestion && (
            <div className={feedback ? `academyQuizLoop is${feedback}` : "academyQuizLoop"}>
              <div className="quizLoopTop">
                <button type="button" className="plainBackButton" onClick={() => setStep("lesson")}>
                  <ArrowLeft size={16} />
                  Reading
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
              </div>

              {feedback && (
                <div className="quizFeedbackPanel">
                  <strong>{feedback === "correct" ? "Correct. XP added." : "Not quite. Heart lost."}</strong>
                  <p>
                    {feedback === "correct"
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
          <h2>Flashcard bank.</h2>
          <p>Saved questions live here as their own practice area, separate from the module map.</p>
        </div>

        <div>
          {progress.savedQuestions.length ? (
            progress.savedQuestions.map((question) => <span key={question}>{question}</span>)
          ) : (
            <span>Save questions during quizzes to build a personal practice bank.</span>
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
          <span>Access</span>
          <strong>30% free target</strong>
        </article>
        <article>
          <span>Fair XP</span>
          <strong>Reduced retake value</strong>
        </article>
      </section>
    </section>
  );
}
