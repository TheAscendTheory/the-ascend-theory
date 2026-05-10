export type CurriculumModule = {
  id: string;
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
};

export type CurriculumTrack = {
  id: string;
  title: string;
  audience: string;
  freePercent: number;
  modules: CurriculumModule[];
};

export const ascendDifferentiators = [
  {
    title: "Proof Portfolio",
    text:
      "Learners do not only pass quizzes. They build artifacts: budgets, risk plans, market maps, trade reviews, news briefs, flashcard banks, and reflection logs.",
  },
  {
    title: "Daily Market News Lab",
    text:
      "Current events become teachable practice. Learners connect headlines to DXY, yields, indices, crypto, commodities, risk sentiment, and economic calendar events.",
  },
  {
    title: "Chart-To-Journal Workflow",
    text:
      "Trading lessons connect directly to the platform: chart, mark levels, define risk, run scenarios, and journal outcomes in one system.",
  },
  {
    title: "School And Nonprofit Mode",
    text:
      "Each module can expose objectives, age band, teacher prompts, worksheets, completion evidence, and certificate standards for classrooms and youth programs.",
  },
  {
    title: "Gamified Mastery With Guardrails",
    text:
      "Stars measure proficiency, XP rewards progress, leagues reward consistency, and locked progression prevents students from skipping foundational lessons.",
  },
  {
    title: "Full Finance Stack",
    text:
      "The Academy covers personal finance, accounting, macro, investing, trading, derivatives, commodities, crypto, blockchain, behavior, risk, and execution.",
  },
];

export const assessmentPolicy = {
  questionsPerCoreModule: 25,
  questionsPerMajorCertificate: 50,
  passScore: 80,
  starScale:
    "1 star below 60%, 2 stars at 60-79%, 3 stars at 80-89%, 4 stars at 90-94%, 5 stars at 95%+.",
  xpFairness:
    "First completion earns full XP based on score. Retakes improve stars but should earn reduced weekly XP to protect competition fairness.",
  freeAccess:
    "Roughly 30% of the full academy should be free. Later modules should remain visible but locked until subscription access is active.",
  proofRequirement:
    "Major modules should require a proof artifact before certification: worksheet, plan, journal entry, market map, or reflection.",
};

export const curriculumTracks: CurriculumTrack[] = [
  {
    id: "foundation",
    title: "Foundation School",
    audience: "Students, families, beginners, and first-time learners",
    freePercent: 45,
    modules: [
      {
        id: "money-as-a-tool",
        title: "Money As A Tool",
        level: "Preschool",
        access: "free",
        estimatedPages: "20-25 concise pages",
        assessmentQuestions: 25,
        passScore: 80,
        overview:
          "Learners build the first mental model: money is a tool for storing, moving, measuring, and exchanging value. The lesson must be simple enough for young students while still useful for adults who never received financial education.",
        learningObjectives: [
          "Explain money as a tool instead of a status symbol.",
          "Separate needs, wants, assets, liabilities, income, and expenses.",
          "Use a simple decision framework before spending.",
          "Create a first savings rule and explain why it matters.",
        ],
        readingSections: [
          "What money does: exchange, storage, measurement, and planning.",
          "Needs vs wants with school-age, family, and adult examples.",
          "The first budget: income, outflow, leftover, and assignment.",
          "Saving first: why tiny habits create future options.",
          "Common traps: impulse spending, comparison, and emotional buying.",
          "Applied scenario: plan a $50, $500, and $5,000 decision.",
        ],
        workbookTasks: [
          "Build a needs/wants table from a real week of spending.",
          "Write a one-sentence money rule.",
          "Create a three-bucket plan: spend, save, give/invest.",
        ],
        proofChecklist: [
          "Can define money without using hype language.",
          "Can explain why saving first changes behavior.",
          "Can make a spending choice using a written rule.",
        ],
      },
      {
        id: "personal-budget-system",
        title: "Personal Budget System",
        level: "Elementary",
        access: "free",
        estimatedPages: "20-25 concise pages",
        assessmentQuestions: 25,
        passScore: 80,
        overview:
          "Learners move from awareness to a repeatable cash-flow system. The module should teach budgeting as control and freedom, not punishment.",
        learningObjectives: [
          "Build a zero-based monthly budget.",
          "Identify fixed, variable, irregular, and discretionary expenses.",
          "Create emergency-fund rules.",
          "Review spending without shame or avoidance.",
        ],
        readingSections: [
          "Budgeting as a dashboard for decisions.",
          "Fixed, variable, irregular, and lifestyle expenses.",
          "Zero-based budgeting and priority order.",
          "Emergency funds: starter, stable, and advanced levels.",
          "Budget review rhythm: daily check, weekly review, monthly reset.",
          "Applied scenario: income drop, surprise bill, and savings goal.",
        ],
        workbookTasks: [
          "Create a sample monthly budget from a provided income profile.",
          "Find three leaks in a sample spending report.",
          "Write an emergency-fund target and timeline.",
        ],
        proofChecklist: [
          "Can assign every dollar a job.",
          "Can explain which expenses are flexible.",
          "Can adjust a budget when income changes.",
        ],
      },
      {
        id: "proof-portfolio-foundations",
        title: "Foundation Proof Portfolio",
        level: "Elementary",
        access: "free",
        estimatedPages: "15-20 concise pages plus workbook",
        assessmentQuestions: 25,
        passScore: 80,
        overview:
          "Learners collect evidence that they can apply the first lessons. This is where Ascend starts standing apart: students leave with real artifacts, not only answers.",
        learningObjectives: [
          "Create a simple money map.",
          "Build a first budget artifact.",
          "Write a savings rule and explain it.",
          "Reflect on one spending decision using a framework.",
        ],
        readingSections: [
          "What proof of learning means.",
          "How to build a money map.",
          "How to review a decision without shame.",
          "How to submit a worksheet or reflection.",
          "How proof artifacts support certificates.",
        ],
        workbookTasks: [
          "Submit a needs/wants table.",
          "Submit a starter budget.",
          "Submit a one-page money reflection.",
        ],
        proofChecklist: [
          "Has at least three saved artifacts.",
          "Can explain each artifact in plain language.",
          "Can identify one behavior to improve next week.",
        ],
      },
    ],
  },
  {
    id: "financial-literacy",
    title: "Financial Life A-Z",
    audience: "Learners preparing for real adult money decisions",
    freePercent: 30,
    modules: [
      {
        id: "credit-debt-interest",
        title: "Credit, Debt, And Interest",
        level: "Middle School",
        access: "free",
        estimatedPages: "25-30 concise pages",
        assessmentQuestions: 25,
        passScore: 80,
        overview:
          "A practical module on borrowing, repayment, credit scores, APR, compounding debt, predatory lending, and responsible credit use.",
        learningObjectives: [
          "Explain credit score factors and utilization.",
          "Calculate simple interest and understand APR.",
          "Compare debt payoff methods.",
          "Identify high-risk debt products.",
        ],
        readingSections: [
          "What credit is and why lenders measure trust.",
          "Payment history, utilization, credit age, account mix, and inquiries.",
          "APR, effective cost, minimum payments, and compounding debt.",
          "Good debt, bad debt, and dangerous debt.",
          "Debt snowball vs avalanche.",
          "Applied scenario: choose between two loan offers.",
        ],
        workbookTasks: [
          "Calculate utilization across three cards.",
          "Build a debt payoff order.",
          "Rewrite a bad credit decision into a safer plan.",
        ],
        proofChecklist: [
          "Can explain why minimum payments are expensive.",
          "Can identify utilization risk.",
          "Can compare debt strategies.",
        ],
      },
      {
        id: "investing-retirement-tax",
        title: "Investing, Retirement, And Tax-Aware Accounts",
        level: "High School",
        access: "subscriber",
        estimatedPages: "30-40 concise pages",
        assessmentQuestions: 50,
        passScore: 80,
        overview:
          "A core adult-finance module covering ETFs, dividends, retirement accounts, employer matches, tax-advantaged accounts, compounding, and basic tax literacy.",
        learningObjectives: [
          "Explain ETFs, dividends, diversification, and fees.",
          "Compare retirement account types at a high level.",
          "Understand compounding over decades.",
          "Recognize tax benefits and country-specific differences.",
        ],
        readingSections: [
          "Why investing is ownership, lending, or exposure.",
          "ETFs, mutual funds, index funds, and expense ratios.",
          "Dividends: yield, payout ratio, reinvestment, and traps.",
          "Retirement accounts: 401(k), IRA, Roth IRA, TFSA, RRSP, and local-rule awareness.",
          "Tax basics: taxable income, deductions, credits, capital gains.",
          "Applied scenario: build a starter long-term portfolio policy.",
        ],
        workbookTasks: [
          "Compare two ETFs by fee, holdings, and risk.",
          "Estimate compounding over 10, 20, and 40 years.",
          "Write a retirement contribution priority list.",
        ],
        proofChecklist: [
          "Can explain why fees matter.",
          "Can describe dividend risk.",
          "Can identify when local tax rules must be verified.",
        ],
      },
      {
        id: "life-decisions-lab",
        title: "Real-Life Money Decisions Lab",
        level: "High School",
        access: "subscriber",
        estimatedPages: "25-35 concise pages plus scenarios",
        assessmentQuestions: 50,
        passScore: 80,
        overview:
          "A scenario-based lab that turns financial literacy into decision-making: renting, buying a car, choosing insurance, paying for school, starting a side income, and avoiding traps.",
        learningObjectives: [
          "Compare major life decisions using cost, risk, and opportunity cost.",
          "Understand insurance, housing, transportation, and education tradeoffs.",
          "Build a decision checklist before signing contracts.",
          "Recognize when advice from a professional is needed.",
        ],
        readingSections: [
          "Opportunity cost in real life.",
          "Renting, housing, and affordability ratios.",
          "Cars, loans, insurance, and total cost of ownership.",
          "Paying for college, scholarships, and debt caution.",
          "Side income, taxes, and record keeping.",
          "Applied scenario: choose between two life paths with different costs.",
        ],
        workbookTasks: [
          "Compare two housing options.",
          "Calculate total car ownership cost.",
          "Build a contract-signing checklist.",
        ],
        proofChecklist: [
          "Can explain total cost beyond monthly payment.",
          "Can compare two options with opportunity cost.",
          "Can identify when a decision is too risky.",
        ],
      },
    ],
  },
  {
    id: "market-university",
    title: "Market University",
    audience: "Traders and investors learning how markets actually move",
    freePercent: 25,
    modules: [
      {
        id: "market-structure-liquidity",
        title: "Market Structure And Liquidity",
        level: "College",
        access: "subscriber",
        estimatedPages: "35-50 concise pages",
        assessmentQuestions: 50,
        passScore: 80,
        overview:
          "This module turns chart reading into market reasoning: structure, liquidity, sessions, VWAP, volume, volatility, invalidation, and execution context.",
        learningObjectives: [
          "Map swing highs/lows, ranges, breaks, and failed breaks.",
          "Identify likely liquidity pools without overclaiming certainty.",
          "Use session context and VWAP to understand intraday behavior.",
          "Write an entry, invalidation, target, and review plan.",
        ],
        readingSections: [
          "Auction basics: price seeks agreement and rejects unfair value.",
          "Trend, range, expansion, compression, and reversal.",
          "Liquidity: buy-side, sell-side, stops, sweeps, and trapped traders.",
          "Session behavior: Asia range, London expansion, NY open, NY PM.",
          "VWAP and volume profile as context tools.",
          "Applied scenario: build a complete market map from raw candles.",
        ],
        workbookTasks: [
          "Mark structure on three chart examples.",
          "Write the invalidation for each setup.",
          "Review a failed breakout and explain the trapped side.",
        ],
        proofChecklist: [
          "Can distinguish a sweep from a confirmed breakout.",
          "Can define invalidation before entry.",
          "Can explain why no-trade is sometimes correct.",
        ],
      },
      {
        id: "macro-correlation-news",
        title: "Macro, Correlation, And News Flow",
        level: "University",
        access: "subscriber",
        estimatedPages: "35-50 concise pages",
        assessmentQuestions: 50,
        passScore: 80,
        overview:
          "Learners connect DXY, yields, central banks, inflation, employment, commodities, equities, crypto, and news events without turning headlines into blind signals.",
        learningObjectives: [
          "Explain how inflation, rates, growth, and employment shape market expectations.",
          "Use DXY, US10Y, SPX/NQ, BTC, gold, and oil as context.",
          "Separate scheduled catalysts from surprise headlines.",
          "Build a pre-news and post-news trading checklist.",
        ],
        readingSections: [
          "Macro basics: inflation, rates, growth, jobs, and liquidity.",
          "Central banks and expectations.",
          "Cross-asset map: dollar, yields, equities, crypto, metals, oil.",
          "News trading: scheduled vs unscheduled catalysts.",
          "Market reaction: first move, second move, and liquidity traps.",
          "Applied scenario: FOMC day plan and review.",
        ],
        workbookTasks: [
          "Build a correlation dashboard for one week.",
          "Write a CPI-day risk plan.",
          "Explain a market move using at least three assets.",
        ],
        proofChecklist: [
          "Can avoid trading news blindly.",
          "Can connect macro to structure without forcing bias.",
          "Can identify risk-on/risk-off context.",
        ],
      },
      {
        id: "daily-market-news-lab",
        title: "Daily Market News Lab",
        level: "University",
        access: "subscriber",
        estimatedPages: "Daily brief format plus weekly review",
        assessmentQuestions: 50,
        passScore: 80,
        overview:
          "A recurring lab that uses current events as live education. Students turn news into structured market context without blindly trading headlines.",
        learningObjectives: [
          "Summarize a market-moving news event.",
          "Identify affected assets and why they may react.",
          "Separate immediate volatility from durable context.",
          "Write a risk-aware response plan.",
        ],
        readingSections: [
          "What makes news market-moving.",
          "Scheduled data vs surprise headlines.",
          "Central bank speeches, inflation, jobs, earnings, geopolitics, and commodities.",
          "Reaction mapping: DXY, yields, indices, crypto, gold, oil, and FX.",
          "How to write a daily market brief.",
          "Weekly review: what mattered, what was noise, and what changed.",
        ],
        workbookTasks: [
          "Write one daily market brief.",
          "Map one headline across five assets.",
          "Review one news move after the session closes.",
        ],
        proofChecklist: [
          "Can explain why the event mattered.",
          "Can identify affected assets.",
          "Can avoid turning news into an impulsive signal.",
        ],
      },
      {
        id: "chart-risk-journal-lab",
        title: "Chart, Risk, And Journal Lab",
        level: "University",
        access: "subscriber",
        estimatedPages: "30-45 concise pages plus platform practice",
        assessmentQuestions: 50,
        passScore: 80,
        overview:
          "A platform-integrated lab using Ascend's charting desk. Learners must map structure, define risk, size a trade, plan invalidation, and journal the outcome.",
        learningObjectives: [
          "Use the market dashboard without clutter.",
          "Create a complete trade plan before execution.",
          "Use risk calculator outputs correctly.",
          "Journal result, mistake, emotion, and improvement.",
        ],
        readingSections: [
          "The clean trading workspace: chart first, tools second.",
          "Selecting instruments by session, volatility, and relevance.",
          "Marking levels and writing invalidation.",
          "Sizing risk before entry.",
          "Journaling for pattern discovery.",
          "Reviewing trades by process quality, not only P/L.",
        ],
        workbookTasks: [
          "Create one market map.",
          "Submit one risk plan.",
          "Submit one journal review with a lesson learned.",
        ],
        proofChecklist: [
          "Can use chart, risk, and journal in one flow.",
          "Can define invalidation before reward.",
          "Can review execution honestly.",
        ],
      },
    ],
  },
  {
    id: "blockchain-digital-assets",
    title: "Blockchain And Digital Assets",
    audience: "Learners who need crypto plus the infrastructure beneath it",
    freePercent: 25,
    modules: [
      {
        id: "blockchain-foundations",
        title: "Blockchain Infrastructure Foundations",
        level: "College",
        access: "subscriber",
        estimatedPages: "30-45 concise pages",
        assessmentQuestions: 50,
        passScore: 80,
        overview:
          "A dedicated blockchain module covering ledgers, consensus, wallets, custody, smart contracts, tokens, DeFi, oracles, bridges, audits, governance, regulation, and real-world settlement.",
        learningObjectives: [
          "Explain blockchain without confusing it with crypto price speculation.",
          "Compare custody models and key risks.",
          "Understand smart contracts, tokens, DeFi, bridges, and oracles.",
          "Identify security, governance, and regulatory risks.",
        ],
        readingSections: [
          "Distributed ledgers and why shared state matters.",
          "Consensus: proof of work, proof of stake, validators, and incentives.",
          "Wallets, keys, seed phrases, custody, and approvals.",
          "Smart contracts and token standards.",
          "DeFi rails: swaps, lending, liquidity pools, staking, synthetics.",
          "Security failures: exploits, phishing, bridges, oracles, permissions.",
          "Real-world use cases and legal dependencies.",
        ],
        workbookTasks: [
          "Diagram self-custody vs exchange custody.",
          "Audit a token narrative using utility, liquidity, and risk.",
          "Build a protocol risk checklist.",
        ],
        proofChecklist: [
          "Can explain custody risk clearly.",
          "Can separate blockchain utility from token hype.",
          "Can identify smart-contract and bridge risk.",
        ],
      },
    ],
  },
];

export const curriculumSummary = {
  currentImplementedQuizCount: 800,
  targetModel:
    "Each module should become a lesson reader with 20-50 pages of concise content, workbook tasks, a 25-50 question assessment, 80% pass rule, locked progression, star proficiency, and XP reward.",
  nextBuildStep:
    "Move each module from this planning file into individual editable lesson files with full readings, examples, worksheets, and manually proofed question banks.",
};
