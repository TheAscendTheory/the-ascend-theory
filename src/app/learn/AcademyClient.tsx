"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Award,
  BookMarked,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Lock,
  Star,
} from "lucide-react";
import { createBrowserSupabaseClient } from "../lib/supabaseBrowser";
import {
  ascendDifferentiators,
  assessmentPolicy,
  curriculumSummary,
  curriculumTracks,
} from "./curriculum/academy-curriculum";

type AcademyStage = {
  id: string;
  level: string;
  title: string;
  xp: number;
  audience: string;
  lessons: {
    title: string;
    explanation: string;
    example: string;
    why: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    answer: string;
  };
};

type MarketCourse = {
  id: string;
  title: string;
  certificate: string;
  description: string;
  modules: {
    title: string;
    explanation: string;
    example: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    answer: string;
  };
};

type StudyStats = {
  streakCount: number;
  dailyStudyCount: number;
  weeklyXp: number;
  lastStudyDate: string;
  weekKey: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

const marketCourses: MarketCourse[] = [
  {
    id: "equities",
    title: "Equity Markets A-Z",
    certificate: "Certificate in Equity Market Foundations",
    description:
      "Learn how ownership, exchanges, company analysis, indexes, sectors, earnings, dividends, valuation, order types, and risk management work in stock markets.",
    modules: [
      {
        title: "Ownership And Shares",
        explanation:
          "A share is a small ownership claim in a company. Public markets let investors buy and sell those claims through brokers and exchanges.",
        example:
          "If a company has 1,000 shares and you own 10, you own 1% of the company.",
      },
      {
        title: "Exchanges And Liquidity",
        explanation:
          "NYSE and NASDAQ organize trading, while market makers and participants provide bids, asks, and volume.",
        example:
          "A tight spread on Apple usually means buyers and sellers are active near the same price.",
      },
      {
        title: "Earnings, Sectors, And Indexes",
        explanation:
          "Stocks react to company results, sector rotation, and broad indexes like the S&P 500 and Nasdaq.",
        example:
          "Strong semiconductor earnings can lift related chip stocks and influence the Nasdaq.",
      },
      {
        title: "Valuation And Risk",
        explanation:
          "Equity decisions combine business quality, price, timing, risk per position, and portfolio exposure.",
        example:
          "A great company can still be a poor trade if bought at a stretched price with no risk plan.",
      },
    ],
    quiz: {
      question: "What does owning a share usually represent?",
      options: ["Company ownership", "A currency loan", "A futures obligation"],
      answer: "Company ownership",
    },
  },
  {
    id: "forex",
    title: "Forex Markets A-Z",
    certificate: "Certificate in Foreign Exchange Foundations",
    description:
      "Study currency pairs, pips, lots, central banks, interest-rate differentials, sessions, liquidity windows, macro catalysts, and risk in the largest market.",
    modules: [
      {
        title: "Currency Pair Language",
        explanation:
          "Forex is quoted in pairs. The first currency is the base, the second is the quote, and price shows how much quote currency buys one base unit.",
        example: "EUR/USD at 1.1000 means one euro costs 1.10 U.S. dollars.",
      },
      {
        title: "Pips, Lots, And Leverage",
        explanation:
          "Pips measure small price movement, lots define position size, and leverage magnifies gains and losses.",
        example:
          "A tiny EUR/USD move can matter if the lot size is large, so risk must be calculated first.",
      },
      {
        title: "Macro Drivers",
        explanation:
          "Currencies move around interest rates, inflation, growth, employment, central banks, and risk sentiment.",
        example:
          "If U.S. yields rise sharply, the dollar may strengthen against lower-yielding currencies.",
      },
      {
        title: "Sessions And Liquidity",
        explanation:
          "Asia, London, and New York sessions behave differently. Volatility often expands during overlaps and major news.",
        example:
          "GBP pairs often become more active during London trading hours.",
      },
    ],
    quiz: {
      question: "In EUR/USD, what is EUR?",
      options: ["Base currency", "Quote currency", "Commodity currency"],
      answer: "Base currency",
    },
  },
  {
    id: "bonds",
    title: "Bond Markets A-Z",
    certificate: "Certificate in Fixed Income Foundations",
    description:
      "Understand government and corporate borrowing, yields, duration, credit risk, Treasury curves, coupons, price-yield relationships, and macro signaling.",
    modules: [
      {
        title: "Borrowing Through Bonds",
        explanation:
          "A bond is debt. Governments and companies borrow from investors and promise interest payments plus principal repayment.",
        example:
          "A U.S. Treasury bond is the U.S. government borrowing money from investors.",
      },
      {
        title: "Yield And Price",
        explanation:
          "Bond prices and yields generally move opposite each other. Yield shows the return investors demand.",
        example:
          "If investors demand higher yield, existing lower-yield bonds usually fall in price.",
      },
      {
        title: "Credit And Duration",
        explanation:
          "Credit risk is the chance a borrower fails to pay. Duration estimates sensitivity to interest-rate changes.",
        example:
          "Long-duration bonds can move sharply when rates change.",
      },
      {
        title: "Yield Curve Signals",
        explanation:
          "The yield curve compares short-term and long-term rates and often reflects growth, inflation, and recession expectations.",
        example:
          "An inverted curve can suggest markets expect economic slowing or future rate cuts.",
      },
    ],
    quiz: {
      question: "When bond yields rise, bond prices generally do what?",
      options: ["Fall", "Always rise", "Never move"],
      answer: "Fall",
    },
  },
  {
    id: "derivatives",
    title: "Derivatives Markets A-Z",
    certificate: "Certificate in Derivatives Foundations",
    description:
      "Learn futures, options, swaps, margin, leverage, hedging, speculation, Greeks, expiration, settlement, and how derivatives connect to underlying markets.",
    modules: [
      {
        title: "Underlying Assets",
        explanation:
          "A derivative is a contract tied to another asset, such as an index, currency, commodity, stock, or rate.",
        example:
          "An oil futures contract derives its value from crude oil.",
      },
      {
        title: "Futures And Options",
        explanation:
          "Futures create obligations, while options create rights. Both can be used for hedging or speculation.",
        example:
          "A farmer may use futures to lock in a crop price before harvest.",
      },
      {
        title: "Options Basics",
        explanation:
          "Calls, puts, premiums, time value, and Greeks help explain how options change as price, time, and volatility move.",
        example:
          "A call option can gain value if the underlying asset rises before expiration.",
      },
      {
        title: "Leverage And Expiration",
        explanation:
          "Derivatives can move faster than the underlying. Expiration, margin, and liquidity must be respected.",
        example:
          "A correct market idea can still lose money if the option expires too soon.",
      },
    ],
    quiz: {
      question: "A derivative gets its value from what?",
      options: ["An underlying asset", "A bank account", "A social feed"],
      answer: "An underlying asset",
    },
  },
  {
    id: "commodities",
    title: "Commodities Markets A-Z",
    certificate: "Certificate in Commodity Market Foundations",
    description:
      "Study energy, metals, agriculture, supply and demand, inventories, seasonality, futures curves, storage, geopolitics, and inflation sensitivity.",
    modules: [
      {
        title: "Commodity Families",
        explanation:
          "Commodities include energy, metals, agriculture, livestock, and soft goods. They are tied to real-world supply chains.",
        example: "Oil is energy, gold is a metal, and wheat is agriculture.",
      },
      {
        title: "Supply And Demand",
        explanation:
          "Weather, inventories, production cuts, transport issues, and geopolitics can all move commodity prices.",
        example:
          "A hurricane can disrupt oil supply and push energy prices higher.",
      },
      {
        title: "Spot And Futures",
        explanation:
          "Spot is the current cash price. Futures reflect expected future delivery prices and storage/carry costs.",
        example:
          "Oil futures for next month and six months from now can trade at different prices.",
      },
      {
        title: "Inflation Linkages",
        explanation:
          "Commodities often connect to inflation, currency strength, industrial demand, and global growth expectations.",
        example:
          "Rising energy prices can feed into transportation and production costs.",
      },
    ],
    quiz: {
      question: "Oil, gold, and wheat are examples of what?",
      options: ["Commodities", "Equities", "Currencies"],
      answer: "Commodities",
    },
  },
  {
    id: "crypto",
    title: "Cryptocurrency Markets A-Z",
    certificate: "Certificate in Digital Asset Foundations",
    description:
      "Learn Bitcoin, Ethereum, altcoins, exchanges, custody, tokenomics, liquidity, on-chain data, stablecoins, market cycles, regulation, and risk.",
    modules: [
      {
        title: "Blockchain And Custody",
        explanation:
          "Blockchains record transactions. Wallets and private keys control access, so custody decisions are part of risk management.",
        example:
          "Losing a private key can mean losing access to the asset.",
      },
      {
        title: "Crypto Asset Types",
        explanation:
          "Bitcoin, Ethereum, stablecoins, altcoins, and DeFi tokens have different purposes, risks, and market behavior.",
        example:
          "A stablecoin aims to track a fiat currency while Bitcoin trades as a scarce digital asset.",
      },
      {
        title: "Cycles And Volatility",
        explanation:
          "Crypto can be highly volatile and often reacts to liquidity, regulation, leverage, narratives, and tech cycles.",
        example:
          "Altcoins may rally aggressively during risk-on phases and fall quickly when liquidity dries up.",
      },
      {
        title: "Security And Regulation",
        explanation:
          "Scams, exchange risk, smart-contract exploits, tax treatment, and regulations are part of the learning path.",
        example:
          "A high-yield crypto offer may be riskier than it looks if the protocol or custodian is weak.",
      },
    ],
    quiz: {
      question: "What protects access to a crypto wallet?",
      options: ["Private key", "Dividend date", "Bond coupon"],
      answer: "Private key",
    },
  },
  {
    id: "blockchain",
    title: "Blockchain Infrastructure A-Z",
    certificate: "Certificate in Blockchain Foundations",
    description:
      "Study blockchain as its own financial technology layer: distributed ledgers, consensus, wallets, custody, smart contracts, token standards, DeFi rails, bridges, oracles, governance, audits, regulation, and real-world settlement use cases.",
    modules: [
      {
        title: "Distributed Ledgers",
        explanation:
          "A blockchain is a shared ledger maintained by a network instead of one central database owner. The network records transactions in blocks and links them over time.",
        example:
          "Bitcoin uses a public ledger so anyone can verify transaction history without relying on one company database.",
      },
      {
        title: "Consensus And Validators",
        explanation:
          "Consensus is how a blockchain agrees on the valid state of the ledger. Proof of work and proof of stake are two major models with different costs, incentives, and security assumptions.",
        example:
          "Bitcoin miners spend energy to secure blocks, while Ethereum validators stake ETH and can be penalized for dishonest behavior.",
      },
      {
        title: "Wallets, Keys, And Custody",
        explanation:
          "Wallets manage keys. Self-custody gives control but makes the user responsible for seed phrases, approvals, and recovery. Custodial platforms reduce key responsibility but add counterparty risk.",
        example:
          "Keeping funds on an exchange is convenient, but a hardware wallet can reduce exchange failure risk if handled correctly.",
      },
      {
        title: "Smart Contracts",
        explanation:
          "Smart contracts are code deployed on a blockchain that can hold assets and execute rules automatically. They power many DeFi, NFT, and token systems.",
        example:
          "A lending protocol can use smart contracts to manage deposits, loans, collateral, and liquidations.",
      },
      {
        title: "Tokens And Standards",
        explanation:
          "Token standards define how assets behave on a chain. Fungible tokens, NFTs, stablecoins, and governance tokens serve different purposes and carry different risks.",
        example:
          "An ERC-20 token behaves differently from an NFT because one is interchangeable and the other is unique.",
      },
      {
        title: "DeFi Rails",
        explanation:
          "Decentralized finance uses smart contracts for trading, lending, borrowing, liquidity pools, staking, and synthetic exposure without a traditional broker.",
        example:
          "A decentralized exchange can route a token swap through liquidity pools instead of a centralized order book.",
      },
      {
        title: "Oracles, Bridges, And Layers",
        explanation:
          "Oracles bring outside data on-chain, bridges move assets or messages between chains, and layer-2 networks try to improve speed and cost. Each adds a new trust and security layer.",
        example:
          "A DeFi contract may need an oracle price feed to know when collateral should be liquidated.",
      },
      {
        title: "Security, Audits, And Exploits",
        explanation:
          "Blockchain systems can fail through smart-contract bugs, bad permissions, phishing, bridge attacks, oracle manipulation, poor key storage, or economic design flaws.",
        example:
          "An audited protocol can still be risky if users sign a malicious approval or a bridge is compromised.",
      },
      {
        title: "Governance And Regulation",
        explanation:
          "Some protocols use token voting or foundation governance, while regulators examine securities law, consumer protection, custody, stablecoins, taxes, and anti-money-laundering rules.",
        example:
          "A governance vote can change protocol fees, but legal requirements may still affect how the project operates.",
      },
      {
        title: "Real-World Settlement",
        explanation:
          "Blockchain can support payments, tokenized assets, remittances, identity systems, supply-chain records, and settlement experiments, but adoption depends on cost, trust, regulation, and usability.",
        example:
          "Tokenized Treasuries use blockchain rails while still depending on legal rights and real-world custodians.",
      },
    ],
    quiz: {
      question: "What does consensus help a blockchain network agree on?",
      options: ["The valid ledger state", "A company's dividend", "A personal budget category"],
      answer: "The valid ledger state",
    },
  },
];

const financeCourses: MarketCourse[] = [
  {
    id: "budgeting",
    title: "Budgeting A-Z",
    certificate: "Certificate in Budgeting Foundations",
    description:
      "Learn how to direct income, control expenses, plan for goals, and build a budget that creates freedom instead of restriction.",
    modules: [
      {
        title: "Income And Outflow",
        explanation:
          "A budget starts by knowing what comes in, what goes out, and what remains. Without that map, money decisions become guesses.",
        example: "If $1,200 comes in and $950 goes out, the remaining $250 needs a job before it disappears.",
      },
      {
        title: "Fixed And Variable Expenses",
        explanation:
          "Fixed expenses repeat predictably, while variable expenses change. Separating them makes spending easier to control.",
        example: "Rent is fixed. Food delivery, gas, and entertainment are variable.",
      },
      {
        title: "Zero-Based Planning",
        explanation:
          "Zero-based budgeting means every dollar is assigned to spending, saving, investing, debt, or giving.",
        example: "A leftover $40 can become emergency savings instead of mystery spending.",
      },
    ],
    quiz: {
      question: "What is the first job of a budget?",
      options: ["Track and direct cash flow", "Make life boring", "Predict stock prices"],
      answer: "Track and direct cash flow",
    },
  },
  {
    id: "credit",
    title: "Credit A-Z",
    certificate: "Certificate in Credit Foundations",
    description:
      "Understand credit scores, utilization, interest, payment history, credit cards, loans, and how credit can help or harm wealth building.",
    modules: [
      {
        title: "Credit Score Inputs",
        explanation:
          "Credit scores are influenced by payment history, utilization, age of credit, account mix, and new inquiries.",
        example: "Paying on time and keeping balances low usually helps a score.",
      },
      {
        title: "Utilization",
        explanation:
          "Utilization compares your credit card balance to your limit. Lower utilization often signals healthier credit use.",
        example: "$200 used on a $1,000 limit is 20% utilization.",
      },
      {
        title: "Interest And Minimum Payments",
        explanation:
          "Minimum payments can keep an account current while allowing interest to grow over time.",
        example: "A small unpaid balance can become expensive if high APR compounds monthly.",
      },
    ],
    quiz: {
      question: "Which habit usually protects credit the most?",
      options: ["Paying on time", "Maxing every card", "Opening random accounts weekly"],
      answer: "Paying on time",
    },
  },
  {
    id: "taxes",
    title: "Taxes A-Z",
    certificate: "Certificate in Tax Literacy Foundations",
    description:
      "Learn income tax basics, deductions, credits, capital gains, tax-advantaged accounts, and why tax planning matters.",
    modules: [
      {
        title: "Taxable Income",
        explanation:
          "Taxable income is the portion of income used to calculate taxes after allowed deductions or adjustments.",
        example: "Gross income and taxable income are not always the same number.",
      },
      {
        title: "Deductions And Credits",
        explanation:
          "Deductions reduce taxable income. Credits reduce tax owed. They are not the same tool.",
        example: "A $1,000 credit is usually more direct than a $1,000 deduction.",
      },
      {
        title: "Capital Gains",
        explanation:
          "Capital gains happen when an asset is sold for more than its cost basis. Rules vary by country and holding period.",
        example: "Selling an investment for profit may create a taxable gain.",
      },
    ],
    quiz: {
      question: "What can a tax credit directly reduce?",
      options: ["Tax owed", "Market volatility", "A stock's dividend"],
      answer: "Tax owed",
    },
  },
  {
    id: "retirement-accounts",
    title: "Retirement Accounts A-Z",
    certificate: "Certificate in Retirement Planning Foundations",
    description:
      "Understand compounding, employer plans, IRAs, Roth accounts, TFSAs, RRSPs, contribution limits, and withdrawal rules at a high level.",
    modules: [
      {
        title: "Compounding",
        explanation:
          "Compounding is growth on prior growth. Time can become more powerful than contribution size.",
        example: "Investing early gives returns more years to potentially earn returns of their own.",
      },
      {
        title: "Tax-Advantaged Accounts",
        explanation:
          "Accounts like 401(k), IRA, Roth IRA, TFSA, and RRSP can change how contributions, growth, or withdrawals are taxed depending on the country.",
        example: "A TFSA is Canadian, while a Roth IRA is U.S.-based. Learners should verify local rules.",
      },
      {
        title: "Employer Matching",
        explanation:
          "Some employers contribute extra money when employees contribute to retirement plans.",
        example: "A 100% match on 3% of pay means the employer adds money when the employee contributes.",
      },
    ],
    quiz: {
      question: "Why does starting early help retirement planning?",
      options: ["More time for compounding", "Taxes disappear everywhere", "Risk becomes zero"],
      answer: "More time for compounding",
    },
  },
  {
    id: "dividends",
    title: "Dividends A-Z",
    certificate: "Certificate in Dividend Foundations",
    description:
      "Learn what dividends are, payout ratios, dividend yield, reinvestment, dividend growth, and the risks of chasing yield.",
    modules: [
      {
        title: "Dividend Basics",
        explanation:
          "A dividend is a company distributing part of its profits or cash to shareholders.",
        example: "A company may pay $0.50 per share each quarter.",
      },
      {
        title: "Yield And Payout Ratio",
        explanation:
          "Dividend yield compares annual dividend to share price. Payout ratio compares dividends to earnings or cash flow.",
        example: "A very high yield can be a warning if the business cannot support it.",
      },
      {
        title: "Reinvestment",
        explanation:
          "Dividend reinvestment means using dividends to buy more shares, which may increase future income potential.",
        example: "A DRIP can automatically buy fractional shares with paid dividends.",
      },
    ],
    quiz: {
      question: "What is a dividend?",
      options: ["A payment to shareholders", "A currency pair", "A guaranteed bond"],
      answer: "A payment to shareholders",
    },
  },
  {
    id: "etfs",
    title: "ETFs A-Z",
    certificate: "Certificate in ETF Foundations",
    description:
      "Study exchange-traded funds, indexes, expense ratios, diversification, sector ETFs, bond ETFs, commodity ETFs, and risks.",
    modules: [
      {
        title: "ETF Structure",
        explanation:
          "An ETF is a fund that trades on an exchange like a stock while holding a basket of assets.",
        example: "An S&P 500 ETF gives exposure to many large U.S. companies in one trade.",
      },
      {
        title: "Expense Ratios",
        explanation:
          "Expense ratios are ongoing fund costs. Lower costs can matter over long time periods.",
        example: "A 0.03% ETF costs less annually than a 1.00% fund, all else equal.",
      },
      {
        title: "Leveraged ETFs",
        explanation:
          "Leveraged ETFs magnify daily movement and carry extra risk, especially when held for longer periods.",
        example: "A 3x ETF can move much more sharply than the index it tracks.",
      },
    ],
    quiz: {
      question: "What does an ETF commonly hold?",
      options: ["A basket of assets", "Only cash forever", "One private password"],
      answer: "A basket of assets",
    },
  },
  {
    id: "cfds",
    title: "CFDs A-Z",
    certificate: "Certificate in CFD Risk Foundations",
    description:
      "Learn what contracts for difference are, how margin and leverage work, why CFDs are restricted in some places, and why risk controls are essential.",
    modules: [
      {
        title: "CFD Basics",
        explanation:
          "A CFD lets a trader speculate on price movement without owning the underlying asset. Availability depends on jurisdiction.",
        example: "A CFD on gold tracks gold price movement without owning physical gold.",
      },
      {
        title: "Margin And Leverage",
        explanation:
          "CFDs often use leverage, meaning a small deposit controls larger exposure. Losses can grow quickly.",
        example: "A 2% move against a leveraged CFD position can damage an account if size is too large.",
      },
      {
        title: "Costs And Regulation",
        explanation:
          "Spreads, overnight financing, broker rules, and regional restrictions matter before any CFD trade.",
        example: "CFDs are not available to retail traders in some jurisdictions, including the U.S.",
      },
    ],
    quiz: {
      question: "What is the biggest beginner danger with CFDs?",
      options: ["Leverage risk", "Too much diversification", "Guaranteed dividends"],
      answer: "Leverage risk",
    },
  },
];

const masteryCourses: MarketCourse[] = [
  {
    id: "accounting-language",
    title: "Accounting: The Language Of Finance",
    certificate: "Certificate in Accounting Foundations",
    description:
      "Learn how income statements, balance sheets, cash flow statements, accrual accounting, margins, liquidity, ROE, and ROA reveal financial reality.",
    modules: [
      {
        title: "Three Core Statements",
        explanation:
          "The income statement shows profit, the balance sheet shows financial position, and the cash flow statement shows actual movement of money.",
        example: "A company can report profit while still struggling if cash is leaving faster than it arrives.",
      },
      {
        title: "Accrual Vs Cash",
        explanation:
          "Accrual accounting records economic activity when earned or owed, while cash accounting records when money actually moves.",
        example: "A sale made on credit can raise revenue before cash is collected.",
      },
      {
        title: "Financial Ratios",
        explanation:
          "Ratios turn statements into signals about profitability, efficiency, debt, liquidity, and shareholder returns.",
        example: "ROE compares profit to shareholder equity, while current ratio compares current assets to current liabilities.",
      },
    ],
    quiz: {
      question: "Which statement shows real money movement?",
      options: ["Cash flow statement", "Logo page", "Social profile"],
      answer: "Cash flow statement",
    },
  },
  {
    id: "time-value-money",
    title: "Time Value Of Money",
    certificate: "Certificate in Time Value Of Money",
    description:
      "Master present value, future value, discounting, compounding, opportunity cost, and risk-adjusted returns.",
    modules: [
      {
        title: "Present And Future Value",
        explanation:
          "Money today is usually worth more than money later because it can be invested, saved, or used immediately.",
        example: "$1,000 today can become more than $1,000 later if it compounds at a positive return.",
      },
      {
        title: "Discounting",
        explanation:
          "Discounting translates future cash flows into today's value by applying a required return or discount rate.",
        example: "A company expected to earn cash years from now is worth less today if rates are high.",
      },
      {
        title: "Risk-Adjusted Return",
        explanation:
          "A return is only meaningful when compared with the risk taken to earn it.",
        example: "A 12% return with massive drawdown risk may be worse than an 8% return with steadier behavior.",
      },
    ],
    quiz: {
      question: "What does discounting help estimate?",
      options: ["Today's value of future money", "A username", "A candle color"],
      answer: "Today's value of future money",
    },
  },
  {
    id: "macro-economics",
    title: "Macro Economics",
    certificate: "Certificate in Macro Market Drivers",
    description:
      "Study inflation, interest rates, GDP growth, employment data, central banks, liquidity cycles, and how macro sets the market backdrop.",
    modules: [
      {
        title: "Inflation And Rates",
        explanation:
          "Inflation measures price pressure, while interest rates influence borrowing, valuation, currency strength, and risk appetite.",
        example: "Higher rates can pressure growth stocks because future earnings are discounted more heavily.",
      },
      {
        title: "Growth And Employment",
        explanation:
          "GDP and employment data help markets judge whether an economy is expanding, slowing, overheating, or weakening.",
        example: "Strong jobs data can move bonds, currencies, and indexes because it affects central bank expectations.",
      },
      {
        title: "Central Banks",
        explanation:
          "Central banks influence liquidity, interest rates, and market expectations through policy decisions and guidance.",
        example: "A surprise Fed statement can move USD, gold, bonds, and equities in the same session.",
      },
    ],
    quiz: {
      question: "What does macro most often help define?",
      options: ["Market backdrop and direction", "Only font size", "Guaranteed entries"],
      answer: "Market backdrop and direction",
    },
  },
  {
    id: "corporate-finance",
    title: "Corporate Finance",
    certificate: "Certificate in Corporate Finance Foundations",
    description:
      "Understand capital structure, cost of capital, cash generation, earnings growth, DCF valuation, and valuation multiples.",
    modules: [
      {
        title: "Capital Structure",
        explanation:
          "Capital structure is how a company funds itself through debt, equity, or both.",
        example: "Too much debt can increase risk even when a business is profitable.",
      },
      {
        title: "Cost Of Capital",
        explanation:
          "Cost of capital is the return required by lenders and investors to finance a company.",
        example: "A project should earn more than its cost of capital to create value.",
      },
      {
        title: "Valuation",
        explanation:
          "Valuation estimates what a company may be worth using cash flows, earnings, growth, quality, and comparable multiples.",
        example: "DCF values projected cash flows, while P/E compares price to earnings.",
      },
    ],
    quiz: {
      question: "What does capital structure describe?",
      options: ["Debt and equity funding mix", "A chart color", "A crypto wallet key"],
      answer: "Debt and equity funding mix",
    },
  },
  {
    id: "portfolio-theory",
    title: "Investing And Portfolio Theory",
    certificate: "Certificate in Portfolio Construction",
    description:
      "Learn diversification, correlation, efficient frontier thinking, rebalancing, compounding, and exposure management.",
    modules: [
      {
        title: "Diversification",
        explanation:
          "Diversification spreads risk across assets, sectors, strategies, or time horizons.",
        example: "A portfolio holding only one stock can be destroyed by one company-specific event.",
      },
      {
        title: "Correlation",
        explanation:
          "Correlation measures how assets move together, which matters during stress and portfolio design.",
        example: "If every asset falls together during a crisis, the portfolio was less diversified than it looked.",
      },
      {
        title: "Rebalancing",
        explanation:
          "Rebalancing resets portfolio weights so one winner, loser, or sector does not quietly dominate the risk.",
        example: "Selling a small amount of an oversized position can restore the original plan.",
      },
    ],
    quiz: {
      question: "What is modern portfolio thinking mainly managing?",
      options: ["Exposure and risk", "Random hype", "Only one winning pick"],
      answer: "Exposure and risk",
    },
  },
  {
    id: "trading-execution",
    title: "Trading And Execution",
    certificate: "Certificate in Trading Structure",
    description:
      "Study liquidity, market structure, order flow, entry discipline, exit planning, position sizing, stop logic, and CRT/QT-style process building.",
    modules: [
      {
        title: "Liquidity And Structure",
        explanation:
          "Liquidity shows where orders may sit, while structure shows whether price is trending, ranging, breaking, or rejecting.",
        example: "A sweep of a prior high followed by rejection can show trapped buyers and changing order flow.",
      },
      {
        title: "Entry And Exit Discipline",
        explanation:
          "A trade plan defines entry, invalidation, target, size, and conditions before emotions take over.",
        example: "A good setup still needs a clear stop and a reason to exit.",
      },
      {
        title: "Framework Execution",
        explanation:
          "Structured systems like CRT and QT turn observation into repeatable decisions instead of impulse trades.",
        example: "Macro context, liquidity map, confirmation, risk, and execution can become a checklist.",
      },
    ],
    quiz: {
      question: "What must every trade define before entry?",
      options: ["Invalidation and risk", "A perfect prediction", "A social post"],
      answer: "Invalidation and risk",
    },
  },
  {
    id: "behavioral-finance",
    title: "Behavioral Finance",
    certificate: "Certificate in Market Psychology",
    description:
      "Learn fear, greed, herd behavior, confirmation bias, overconfidence, forced exits, liquidity traps, and emotional control.",
    modules: [
      {
        title: "Fear And Greed",
        explanation:
          "Markets often overshoot because people chase upside when confident and panic when afraid.",
        example: "A parabolic rally can attract late buyers just before risk expands.",
      },
      {
        title: "Cognitive Bias",
        explanation:
          "Bias makes traders search for confirming evidence, size too aggressively, or ignore invalidation.",
        example: "A trader may keep adding to a losing idea because they want to be right.",
      },
      {
        title: "Liquidity Traps",
        explanation:
          "Crowded positioning can force traders out at poor prices when stops, margin, or fear trigger together.",
        example: "A sharp move below obvious support can trigger stops before price reverses.",
      },
    ],
    quiz: {
      question: "What is confirmation bias?",
      options: ["Only seeking evidence that agrees", "Knowing all outcomes", "Reducing position size"],
      answer: "Only seeking evidence that agrees",
    },
  },
  {
    id: "quant-basics",
    title: "Quantitative Basics",
    certificate: "Certificate in Probability And Risk Math",
    description:
      "Build practical understanding of probability, expected value, return distribution, drawdowns, risk of ruin, and sample size.",
    modules: [
      {
        title: "Probability",
        explanation:
          "Probability helps estimate how often an outcome may happen, while accepting that no single trade is guaranteed.",
        example: "A 60% win-rate system can still lose several trades in a row.",
      },
      {
        title: "Expected Value",
        explanation:
          "Expected value combines win rate, average win, and average loss to judge whether a process is favorable.",
        example: "A lower win rate can still work if winners are much larger than losers.",
      },
      {
        title: "Drawdown Mechanics",
        explanation:
          "Drawdown measures decline from peak equity and shows why position size matters during losing streaks.",
        example: "Losing 20% requires a 25% gain to recover, so survival math comes first.",
      },
    ],
    quiz: {
      question: "What does expected value combine?",
      options: ["Win rate and win/loss size", "Only feelings", "Only one trade"],
      answer: "Win rate and win/loss size",
    },
  },
  {
    id: "financial-instruments",
    title: "Financial Instruments And Products",
    certificate: "Certificate in Product Knowledge",
    description:
      "Know what you are trading: stocks, ETFs, bonds, futures, options, structured products, CFDs, and each product's leverage, risk, and liquidity profile.",
    modules: [
      {
        title: "Instrument Profiles",
        explanation:
          "Each product behaves differently because ownership, leverage, expiration, liquidity, and fees vary.",
        example: "A stock can be held indefinitely, while an option can expire worthless.",
      },
      {
        title: "Leverage And Liquidity",
        explanation:
          "Some instruments create large exposure with small capital, but thin liquidity and leverage can increase risk.",
        example: "A futures contract can move account equity quickly because each tick has a defined dollar value.",
      },
      {
        title: "Suitability",
        explanation:
          "A product must match the learner's goals, jurisdiction, risk tolerance, and knowledge level.",
        example: "A beginner may study options before trading them because time decay and Greeks add complexity.",
      },
    ],
    quiz: {
      question: "Why must traders understand the product first?",
      options: ["Each has unique risk and liquidity", "All products are identical", "It removes all losses"],
      answer: "Each has unique risk and liquidity",
    },
  },
  {
    id: "risk-management",
    title: "Risk Management",
    certificate: "Certificate in Capital Preservation",
    description:
      "Master survival rules: risk per trade, invalidation, drawdown control, portfolio caps, exposure limits, and consistency over big wins.",
    modules: [
      {
        title: "Risk Per Decision",
        explanation:
          "Risk must be defined before the trade or investment, not after price moves against the plan.",
        example: "A 1% account risk cap keeps one mistake from becoming an account-ending event.",
      },
      {
        title: "Invalidation",
        explanation:
          "Invalidation is the condition that proves the idea is no longer behaving as expected.",
        example: "If a breakout fails and closes back inside the range, the original thesis may be invalid.",
      },
      {
        title: "Preserve First",
        explanation:
          "Professional thinking starts with capital preservation, then controlled growth.",
        example: "Consistency beats one huge win followed by uncontrolled drawdowns.",
      },
    ],
    quiz: {
      question: "What comes before growth in professional risk thinking?",
      options: ["Capital preservation", "Oversizing", "Ignoring invalidation"],
      answer: "Capital preservation",
    },
  },
  {
    id: "real-skill-layer",
    title: "Real Skill Layer",
    certificate: "Certificate in Market Skill Integration",
    description:
      "Integrate live price reading, liquidity engineering, manipulation phases, macro-to-structure alignment, and emotional stability.",
    modules: [
      {
        title: "Real-Time Reading",
        explanation:
          "Real skill means observing how price behaves around planned levels, not forcing the market to match a bias.",
        example: "A level that should reject but accelerates through may be information, not failure.",
      },
      {
        title: "Macro To Execution",
        explanation:
          "Strong process aligns broad context, key levels, liquidity, timing, and risk before execution.",
        example: "A dollar catalyst can support a forex bias, while session structure gives the timing.",
      },
      {
        title: "Emotional Pressure",
        explanation:
          "Skill includes staying consistent when bored, excited, wrong, or tempted to revenge trade.",
        example: "Passing on a low-quality setup is a professional action, not inactivity.",
      },
    ],
    quiz: {
      question: "What does real skill integrate?",
      options: ["Context, structure, execution, and emotion", "Only prediction", "Only screenshots"],
      answer: "Context, structure, execution, and emotion",
    },
  },
  {
    id: "mastery",
    title: "What Mastery Actually Means",
    certificate: "Ascender Mastery Certificate",
    description:
      "Learn why mastery is not prediction. It is probability, correct positioning, risk control, repeatable edge extraction, and stability through cycles.",
    modules: [
      {
        title: "Probability Over Prediction",
        explanation:
          "Markets do not require certainty. They require decisions with favorable probability and controlled downside.",
        example: "A trader can be wrong often and still grow if losses are small and winners pay enough.",
      },
      {
        title: "Extract Edges Repeatedly",
        explanation:
          "An edge is valuable only when it can be applied consistently through changing market conditions.",
        example: "One great trade is not mastery; a repeatable process over many trades is closer.",
      },
      {
        title: "Stable Through Cycles",
        explanation:
          "Mastery includes adapting to bull markets, bear markets, chop, volatility expansion, and quiet periods.",
        example: "Sometimes the best trade is smaller size, no trade, or waiting for clearer conditions.",
      },
    ],
    quiz: {
      question: "What is the goal of mastery?",
      options: ["Repeatable edge with controlled risk", "Predict every candle", "Never study again"],
      answer: "Repeatable edge with controlled risk",
    },
  },
];

const academyStages: AcademyStage[] = [
  {
    id: "preschool",
    level: "Preschool",
    title: "Money Is A Tool",
    xp: 50,
    audience: "Absolute beginners",
    lessons: [
      {
        title: "What Money Does",
        explanation:
          "Money helps people trade value without needing to swap one item directly for another.",
        example:
          "Instead of trading apples for shoes, someone can sell apples for money and use that money to buy shoes.",
        why: "Understanding money as a tool prevents fear and confusion later.",
      },
      {
        title: "Needs And Wants",
        explanation:
          "Needs keep you safe and functioning. Wants are nice to have but can wait.",
        example:
          "Food and rent are needs. A new game or designer hoodie is a want.",
        why: "This is the root of budgeting and self-control.",
      },
      {
        title: "Saving First",
        explanation:
          "Saving means keeping some money for later before it disappears into random spending.",
        example:
          "If you receive $10, saving $2 first builds the habit of ownership.",
        why: "Small saving habits become financial confidence over time.",
      },
    ],
    quiz: {
      question: "What is the healthiest first money habit?",
      options: ["Spend everything", "Save a small amount first", "Ignore money"],
      answer: "Save a small amount first",
    },
  },
  {
    id: "elementary",
    level: "Elementary",
    title: "Personal Finance Foundations",
    xp: 75,
    audience: "New learners",
    lessons: [
      {
        title: "Income, Expenses, Leftover",
        explanation:
          "A budget shows what comes in, what goes out, and what remains for saving, investing, or goals.",
        example:
          "$500 income minus $350 expenses leaves $150 to assign intentionally.",
        why: "Cash flow is the dashboard of personal finance.",
      },
      {
        title: "Emergency Funds",
        explanation:
          "An emergency fund is money set aside for unexpected problems so one bad event does not create debt.",
        example:
          "A car repair or medical bill is less damaging when cash is already reserved.",
        why: "Prepared people make calmer decisions.",
      },
      {
        title: "Debt And Interest",
        explanation:
          "Debt lets you use money now and pay later, often with extra cost called interest.",
        example:
          "Borrowing $100 and paying back $120 means the $20 difference is the cost.",
        why: "Debt can help or trap you depending on how it is used.",
      },
    ],
    quiz: {
      question: "What does a budget help you control?",
      options: ["Luck", "Cash flow", "Market prices"],
      answer: "Cash flow",
    },
  },
  {
    id: "middle-school",
    level: "Middle School",
    title: "Markets And Ownership",
    xp: 100,
    audience: "Growing students",
    lessons: [
      {
        title: "Asset Types",
        explanation:
          "Markets contain different assets: stocks represent ownership, bonds represent debt, crypto represents digital networks, and indexes track baskets.",
        example:
          "The S&P 500 tracks a basket of large U.S. companies.",
        why: "Knowing the instrument prevents treating every market the same.",
      },
      {
        title: "Risk And Time",
        explanation:
          "Risk is the chance results differ from expectations. Time horizon changes how much volatility you can tolerate.",
        example:
          "A long-term investor and day trader can look at the same chart and make different choices.",
        why: "Strategy must match the time frame and risk tolerance.",
      },
      {
        title: "News And Sentiment",
        explanation:
          "Markets move when expectations change. News, rates, earnings, and emotion all affect expectations.",
        example:
          "A surprise inflation report can move stocks, bonds, forex, and crypto at once.",
        why: "Context helps explain why price is moving.",
      },
    ],
    quiz: {
      question: "Why do people diversify?",
      options: ["To remove all risk", "To spread risk", "To trade faster"],
      answer: "To spread risk",
    },
  },
  {
    id: "high-school",
    level: "High School",
    title: "Charting And Structure",
    xp: 125,
    audience: "Market beginners",
    lessons: [
      {
        title: "Candles And Trend",
        explanation:
          "Candles show open, high, low, and close. Trends show whether buyers or sellers are controlling direction over time.",
        example:
          "Higher highs and higher lows often describe an uptrend.",
        why: "Structure gives the chart a readable language.",
      },
      {
        title: "Liquidity Zones",
        explanation:
          "Liquidity often sits near obvious highs, lows, and stop areas where many orders cluster.",
        example:
          "Price may spike above a prior high, fill orders, then reverse.",
        why: "Liquidity thinking helps traders avoid chasing obvious traps.",
      },
      {
        title: "Session Timing",
        explanation:
          "Different sessions bring different participants, volatility, and behavior.",
        example:
          "London and New York overlap can create sharper forex movement.",
        why: "Timing filters reduce random trades.",
      },
    ],
    quiz: {
      question: "What is market structure mainly used for?",
      options: ["Guessing", "Mapping likely reaction zones", "Avoiding risk"],
      answer: "Mapping likely reaction zones",
    },
  },
  {
    id: "college",
    level: "College",
    title: "Risk, Systems, And Execution",
    xp: 175,
    audience: "Developing traders",
    lessons: [
      {
        title: "Risk Per Trade",
        explanation:
          "Risk per trade defines how much you can lose if your idea is wrong. It should be decided before entry.",
        example:
          "Risking 1% of a $1,000 account means the planned loss is $10.",
        why: "Survival comes before profit.",
      },
      {
        title: "Trade Planning",
        explanation:
          "A plan defines entry, invalidation, target, size, catalyst, and conditions before emotion enters.",
        example:
          "If price rejects VWAP and reclaims a level, enter; if it loses the low, exit.",
        why: "Execution improves when decisions are made before pressure.",
      },
      {
        title: "Journaling",
        explanation:
          "A journal tracks setups, mistakes, emotions, and performance so patterns become visible.",
        example:
          "If most losses happen after news, the system needs a news filter.",
        why: "Measured behavior can be improved.",
      },
    ],
    quiz: {
      question: "What should be decided before entering a trade?",
      options: ["Risk and invalidation", "Only profit target", "Social media bias"],
      answer: "Risk and invalidation",
    },
  },
  {
    id: "university",
    level: "University",
    title: "Macro, Liquidity, And Professional Thinking",
    xp: 250,
    audience: "Advanced learners",
    lessons: [
      {
        title: "Macro Relationships",
        explanation:
          "Advanced traders watch how dollar strength, yields, indexes, crypto, commodities, and risk appetite interact.",
        example:
          "Rising yields and a rising dollar can pressure growth stocks and crypto.",
        why: "Correlation helps explain broad market movement.",
      },
      {
        title: "Volume And Auction Behavior",
        explanation:
          "Markets are auctions. Volume and order flow show where participation accepts or rejects price.",
        example:
          "High volume at a level can show agreement, while fast rejection can show trapped traders.",
        why: "This goes deeper than pattern memorization.",
      },
      {
        title: "Playbook Building",
        explanation:
          "A playbook stores proven setups, conditions, screenshots, rules, and review notes.",
        example:
          "A trader may keep only three tested setups and ignore everything else.",
        why: "Consistency comes from narrowing attention to proven behavior.",
      },
    ],
    quiz: {
      question: "What separates a system from a random idea?",
      options: ["A name", "Repeatable rules and evidence", "A bigger screen"],
      answer: "Repeatable rules and evidence",
    },
  },
];

const badges = [
  { threshold: 50, label: "Spark Badge" },
  { threshold: 225, label: "Foundation Badge" },
  { threshold: 475, label: "Market Badge" },
  { threshold: 725, label: "Operator Badge" },
  { threshold: 1100, label: "Master Badge" },
  { threshold: 1800, label: "Ascender Seal" },
];

const honorRanks = [
  {
    minXp: 0,
    label: "Novice",
    title: "New Ascender",
    flavor: "You have entered the academy.",
  },
  {
    minXp: 50,
    label: "Apprentice",
    title: "Spark Bearer",
    flavor: "You understand the first principles.",
  },
  {
    minXp: 225,
    label: "Builder",
    title: "Foundation Builder",
    flavor: "You are building discipline and money awareness.",
  },
  {
    minXp: 475,
    label: "Strategist",
    title: "Market Student",
    flavor: "You can read structure and context with intent.",
  },
  {
    minXp: 725,
    label: "Operator",
    title: "Systems Operator",
    flavor: "You are moving from lessons to repeatable process.",
  },
  {
    minXp: 1100,
    label: "Master",
    title: "Ascend Master",
    flavor: "You have proven depth across core market domains.",
  },
  {
    minXp: 1500,
    label: "Grandmaster",
    title: "Ascend Grandmaster",
    flavor: "Your knowledge spans markets, systems, and execution.",
  },
  {
    minXp: 1800,
    label: "Ascender",
    title: "Ascended Scholar",
    flavor: "Highest honor: every class completed.",
  },
];

const academyGlossary = [
  {
    term: "Liquidity",
    meaning: "How easily an asset can be bought or sold without heavily moving price.",
  },
  {
    term: "Risk",
    meaning: "The amount you can lose if the decision is wrong.",
  },
  {
    term: "Volatility",
    meaning: "How much and how quickly price moves.",
  },
  {
    term: "Yield",
    meaning: "The return investors demand from a bond or income-producing asset.",
  },
  {
    term: "Leverage",
    meaning: "Using borrowed exposure, which can magnify both gains and losses.",
  },
  {
    term: "Correlation",
    meaning: "How closely two assets move together or against each other.",
  },
  {
    term: "Consensus",
    meaning: "The process a blockchain network uses to agree on valid transactions and ledger state.",
  },
  {
    term: "Smart Contract",
    meaning: "Blockchain-based code that can hold assets and execute rules automatically.",
  },
  {
    term: "Custody",
    meaning: "Who controls the keys or legal access to an asset.",
  },
  {
    term: "Oracle",
    meaning: "A service that brings external data, such as prices, into a blockchain system.",
  },
];

const studyPrompts = [
  "Explain the idea in your own words.",
  "Write one real-world example before taking the quiz.",
  "Name one mistake a beginner might make with this topic.",
  "Connect the lesson to risk, timing, or decision quality.",
];

const practiceQuestionSets = [
  {
    title: "Foundation Drills",
    description: "Quick checks for money, budgeting, accounting, and basic finance language.",
    questions: [
      "What is the difference between income and cash flow?",
      "Why can profit and cash be different?",
      "What does a balance sheet show?",
      "What is the difference between an asset and a liability?",
      "Why does compound interest reward early action?",
      "What makes an emergency fund different from investing money?",
    ],
  },
  {
    title: "Market Structure Drills",
    description: "Practice questions for price behavior, liquidity, execution, and risk.",
    questions: [
      "Where would obvious liquidity likely rest on this chart?",
      "What would invalidate the trade idea before entry?",
      "Is price trending, ranging, breaking, or rejecting?",
      "What session is active and how could that affect volatility?",
      "What is the difference between a sweep and a true breakout?",
      "How would position size change if the stop distance doubled?",
    ],
  },
  {
    title: "Macro And Portfolio Drills",
    description: "Questions that connect big-picture drivers to portfolio and trading decisions.",
    questions: [
      "How could rising interest rates affect bonds, growth stocks, and currencies?",
      "What asset is most exposed if the dollar strengthens?",
      "Which holdings in the portfolio are probably correlated?",
      "What would force a rebalance after a large rally?",
      "How can inflation change consumer behavior and company margins?",
      "What data release could change the market's rate expectations this week?",
    ],
  },
  {
    title: "Blockchain And Digital Asset Drills",
    description: "Practice prompts for blockchain rails, custody, DeFi, smart contracts, and token risk.",
    questions: [
      "What problem does the blockchain design claim to solve?",
      "Who controls custody: the user, an exchange, a protocol, or a custodian?",
      "What could break the smart contract, bridge, oracle, or governance model?",
      "Is the token necessary for the system or mainly attached to a narrative?",
      "Where does liquidity come from and what happens if it disappears?",
      "What real-world legal or regulatory dependency does this blockchain project still rely on?",
    ],
  },
  {
    title: "Mastery Reflection Drills",
    description: "Higher-level prompts that turn lessons into judgment, discipline, and repeatable process.",
    questions: [
      "Was the last decision based on a plan or a feeling?",
      "What edge is being tested and how many examples support it?",
      "What mistake would this setup tempt a beginner to make?",
      "What would make no trade the correct decision?",
      "How will the learner respond after two losses in a row?",
      "What behavior proves the learner is improving even before profit appears?",
    ],
  },
];

const leagueTiers = [
  { name: "Bronze III", minXp: 0, promoteAt: 90, demoteBelow: 0 },
  { name: "Bronze II", minXp: 90, promoteAt: 180, demoteBelow: 20 },
  { name: "Bronze I", minXp: 180, promoteAt: 300, demoteBelow: 60 },
  { name: "Silver III", minXp: 300, promoteAt: 450, demoteBelow: 120 },
  { name: "Silver II", minXp: 450, promoteAt: 620, demoteBelow: 210 },
  { name: "Silver I", minXp: 620, promoteAt: 830, demoteBelow: 320 },
  { name: "Gold III", minXp: 830, promoteAt: 1080, demoteBelow: 470 },
  { name: "Gold II", minXp: 1080, promoteAt: 1360, demoteBelow: 650 },
  { name: "Gold I", minXp: 1360, promoteAt: 1700, demoteBelow: 860 },
  { name: "Platinum III", minXp: 1700, promoteAt: 2100, demoteBelow: 1120 },
  { name: "Platinum II", minXp: 2100, promoteAt: 2550, demoteBelow: 1420 },
  { name: "Platinum I", minXp: 2550, promoteAt: 3100, demoteBelow: 1760 },
  { name: "Emerald III", minXp: 3100, promoteAt: 3720, demoteBelow: 2180 },
  { name: "Emerald II", minXp: 3720, promoteAt: 4400, demoteBelow: 2680 },
  { name: "Emerald I", minXp: 4400, promoteAt: 5200, demoteBelow: 3260 },
  { name: "Sapphire III", minXp: 5200, promoteAt: 6100, demoteBelow: 3940 },
  { name: "Sapphire II", minXp: 6100, promoteAt: 7100, demoteBelow: 4740 },
  { name: "Sapphire I", minXp: 7100, promoteAt: 8300, demoteBelow: 5660 },
  { name: "Ruby III", minXp: 8300, promoteAt: 9600, demoteBelow: 6740 },
  { name: "Ruby II", minXp: 9600, promoteAt: 11000, demoteBelow: 7980 },
  { name: "Ruby I", minXp: 11000, promoteAt: 12600, demoteBelow: 9380 },
  { name: "Diamond III", minXp: 12600, promoteAt: 14350, demoteBelow: 11000 },
  { name: "Diamond II", minXp: 14350, promoteAt: 16250, demoteBelow: 12800 },
  { name: "Diamond I", minXp: 16250, promoteAt: 18400, demoteBelow: 14800 },
  { name: "Obsidian III", minXp: 18400, promoteAt: 20750, demoteBelow: 17000 },
  { name: "Obsidian II", minXp: 20750, promoteAt: 23300, demoteBelow: 19400 },
  { name: "Obsidian I", minXp: 23300, promoteAt: 26200, demoteBelow: 22000 },
  { name: "Mythic III", minXp: 26200, promoteAt: 29400, demoteBelow: 24900 },
  { name: "Mythic II", minXp: 29400, promoteAt: 32900, demoteBelow: 28100 },
  { name: "Mythic I", minXp: 32900, promoteAt: 36800, demoteBelow: 31600 },
  { name: "Master III", minXp: 36800, promoteAt: 41100, demoteBelow: 35400 },
  { name: "Master II", minXp: 41100, promoteAt: 45800, demoteBelow: 39600 },
  { name: "Master I", minXp: 45800, promoteAt: 51000, demoteBelow: 44200 },
  { name: "Grandmaster III", minXp: 51000, promoteAt: 56800, demoteBelow: 49300 },
  { name: "Grandmaster II", minXp: 56800, promoteAt: 63200, demoteBelow: 55000 },
  { name: "Grandmaster I", minXp: 63200, promoteAt: 70500, demoteBelow: 61400 },
  { name: "Ascender III", minXp: 70500, promoteAt: 79000, demoteBelow: 68500 },
  { name: "Ascender II", minXp: 79000, promoteAt: 89000, demoteBelow: 76800 },
  { name: "Ascender", minXp: 89000, promoteAt: 999999, demoteBelow: 86500 },
];

const leagueOpponents = [
  { name: "Nova", xp: 15420 },
  { name: "Atlas", xp: 13280 },
  { name: "Sage", xp: 11840 },
  { name: "Vega", xp: 9820 },
  { name: "Orion", xp: 8260 },
  { name: "Ivy", xp: 6440 },
  { name: "Kai", xp: 5120 },
  { name: "Mira", xp: 3860 },
  { name: "Sol", xp: 2740 },
  { name: "Jade", xp: 1880 },
  { name: "Rune", xp: 1160 },
  { name: "Echo", xp: 540 },
];

function honorFromXp(xp: number) {
  return honorRanks.reduce(
    (current, rank) => (xp >= rank.minXp ? rank : current),
    honorRanks[0]
  );
}

function nextHonorFromXp(xp: number) {
  return honorRanks.find((rank) => rank.minXp > xp) || null;
}

function rankFromXp(xp: number) {
  return honorFromXp(xp).title;
}

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function weekKey(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return dateKey(start);
}

function daysBetween(previousDate: string, currentDate: string) {
  const previous = new Date(`${previousDate}T00:00:00`);
  const current = new Date(`${currentDate}T00:00:00`);
  return Math.round((current.getTime() - previous.getTime()) / 86400000);
}

function leagueFromWeeklyXp(xp: number) {
  return leagueTiers.reduce(
    (current, tier) => (xp >= tier.minXp ? tier : current),
    leagueTiers[0]
  );
}

function nextLeagueFromWeeklyXp(xp: number) {
  return leagueTiers.find((tier) => tier.minXp > xp) || null;
}

function uniqueOptions(correct: string, options: string[]) {
  return Array.from(new Set([correct, ...options])).slice(0, 3);
}

function starsFromScore(score: number) {
  if (score >= 95) return 5;
  if (score >= 90) return 4;
  if (score >= 80) return 3;
  if (score >= 60) return 2;
  if (score > 0) return 1;
  return 0;
}

function buildCourseQuestions(course: MarketCourse): QuizQuestion[] {
  const moduleTitles = course.modules.map((module) => module.title);
  const moduleExamples = course.modules.map((module) => module.example);
  const questions: QuizQuestion[] = [course.quiz];

  course.modules.forEach((module, index) => {
    const otherTitles = moduleTitles.filter((title) => title !== module.title);
    const otherExamples = moduleExamples.filter((example) => example !== module.example);

    questions.push(
      {
        question: `Which topic is central to ${course.title}?`,
        options: uniqueOptions(module.title, otherTitles),
        answer: module.title,
      },
      {
        question: `Which example best matches ${module.title}?`,
        options: uniqueOptions(module.example, otherExamples),
        answer: module.example,
      },
      {
        question: `What should a learner remember about ${module.title}?`,
        options: uniqueOptions(module.explanation, [
          "It removes all risk from financial decisions.",
          "It only matters after a trade is closed.",
          "It is mainly useful for branding and presentation.",
        ]),
        answer: module.explanation,
      },
      {
        question: `How does ${module.title} support better decisions?`,
        options: uniqueOptions("It improves context, risk awareness, and process.", [
          "It guarantees every trade will win.",
          "It replaces the need for study.",
          "It makes position sizing irrelevant.",
        ]),
        answer: "It improves context, risk awareness, and process.",
      }
    );

    if (index % 2 === 0) {
      questions.push({
        question: `Before applying ${module.title}, what should come first?`,
        options: uniqueOptions("Define the purpose, risk, and conditions.", [
          "Enter immediately without a plan.",
          "Ignore broader market context.",
          "Only copy another person's decision.",
        ]),
        answer: "Define the purpose, risk, and conditions.",
      });
    }
  });

  while (questions.length < 25) {
    const courseModule = course.modules[questions.length % course.modules.length];
    questions.push({
      question: `Applied review: what is the safest way to use ${courseModule.title}?`,
      options: uniqueOptions("Connect it to a written plan and risk limit.", [
        "Use it as a guaranteed signal.",
        "Use it without reviewing outcomes.",
        "Use it only when emotions are high.",
      ]),
      answer: "Connect it to a written plan and risk limit.",
    });
  }

  return questions.slice(0, 25);
}

function buildStageQuestions(stage: AcademyStage): QuizQuestion[] {
  const lessonTitles = stage.lessons.map((lesson) => lesson.title);
  const questions: QuizQuestion[] = [stage.quiz];

  stage.lessons.forEach((lesson, index) => {
    const otherTitles = lessonTitles.filter((title) => title !== lesson.title);

    questions.push(
      {
        question: `Which lesson belongs in ${stage.level}: ${stage.title}?`,
        options: uniqueOptions(lesson.title, otherTitles),
        answer: lesson.title,
      },
      {
        question: `What does ${lesson.title} teach?`,
        options: uniqueOptions(lesson.explanation, [
          "It teaches learners to ignore planning.",
          "It teaches that risk never matters.",
          "It teaches that progress happens without practice.",
        ]),
        answer: lesson.explanation,
      },
      {
        question: `Which example matches ${lesson.title}?`,
        options: uniqueOptions(lesson.example, stage.lessons.map((item) => item.example).filter((example) => example !== lesson.example)),
        answer: lesson.example,
      },
      {
        question: `Why does ${lesson.title} matter?`,
        options: uniqueOptions(lesson.why, [
          "It guarantees instant wealth.",
          "It replaces all future lessons.",
          "It only matters for advanced traders.",
        ]),
        answer: lesson.why,
      }
    );

    if (index % 2 === 0) {
      questions.push({
        question: `What should a student do after reading ${lesson.title}?`,
        options: uniqueOptions("Apply the idea with a small practical example.", [
          "Skip the quiz and move ahead.",
          "Memorize words without using them.",
          "Forget the previous module.",
        ]),
        answer: "Apply the idea with a small practical example.",
      });
    }
  });

  while (questions.length < 25) {
    questions.push({
      question: `Mastery check for ${stage.level}: what proves real understanding?`,
      options: uniqueOptions("Explaining the idea and applying it correctly.", [
        "Clicking through without reading.",
        "Guessing every answer quickly.",
        "Only remembering the title.",
      ]),
      answer: "Explaining the idea and applying it correctly.",
    });
  }

  return questions.slice(0, 25);
}

function quizScore(questions: QuizQuestion[], answers: Record<string, string>, id: string) {
  const correct = questions.filter((question, index) => answers[`${id}:${index}`] === question.answer).length;
  return Math.round((correct / questions.length) * 100);
}

export default function AcademyClient() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [userId, setUserId] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [courseAnswers, setCourseAnswers] = useState<Record<string, string>>({});
  const [proficiencyStars, setProficiencyStars] = useState<Record<string, number>>({});
  const [status, setStatus] = useState("");
  const [studyStats, setStudyStats] = useState<StudyStats>({
    streakCount: 0,
    dailyStudyCount: 0,
    weeklyXp: 0,
    lastStudyDate: "",
    weekKey: weekKey(),
  });

  const totalXp = academyStages
    .filter((stage) => completed.includes(stage.id))
    .reduce((total, stage) => total + stage.xp, 0) + completedCourses.length * 300;
  const honor = honorFromXp(totalXp);
  const nextHonor = nextHonorFromXp(totalXp);
  const allClassesComplete =
    completed.length === academyStages.length &&
    completedCourses.length === marketCourses.length + financeCourses.length + masteryCourses.length;
  const rank = allClassesComplete ? "Ascended Scholar" : honor.title;
  const earnedBadges = badges.filter((badge) => totalXp >= badge.threshold);
  const totalClasses = academyStages.length + marketCourses.length + financeCourses.length + masteryCourses.length;
  const completedClasses = completed.length + completedCourses.length;
  const progressPercent = Math.round((completedClasses / totalClasses) * 100);
  const currentLeague = leagueFromWeeklyXp(studyStats.weeklyXp);
  const nextLeague = nextLeagueFromWeeklyXp(studyStats.weeklyXp);
  const leagueBoard = [...leagueOpponents, { name: "You", xp: studyStats.weeklyXp }]
    .sort((a, b) => b.xp - a.xp)
    .map((competitor, index) => ({ ...competitor, place: index + 1 }));
  const learnerPlace = leagueBoard.find((competitor) => competitor.name === "You")?.place || leagueBoard.length;
  const leagueStatus =
    learnerPlace <= 3
      ? "Promotion zone"
      : learnerPlace >= leagueBoard.length - 1 || studyStats.weeklyXp < currentLeague.demoteBelow
        ? "Demotion zone"
        : "Safe zone";
  const academyMapNodes = [
    {
      id: "map-foundations",
      label: "Foundations",
      detail: `${completed.length} / ${academyStages.length} stages`,
      complete: completed.length === academyStages.length,
      active: completed.length > 0,
    },
    {
      id: "map-mastery",
      label: "Core Mastery",
      detail: `${masteryCourses.filter((course) => completedCourses.includes(course.id)).length} / ${masteryCourses.length} certificates`,
      complete: masteryCourses.every((course) => completedCourses.includes(course.id)),
      active: masteryCourses.some((course) => completedCourses.includes(course.id)),
    },
    {
      id: "map-financial-life",
      label: "Financial Life",
      detail: `${financeCourses.filter((course) => completedCourses.includes(course.id)).length} / ${financeCourses.length} certificates`,
      complete: financeCourses.every((course) => completedCourses.includes(course.id)),
      active: financeCourses.some((course) => completedCourses.includes(course.id)),
    },
    {
      id: "map-markets",
      label: "Markets A-Z",
      detail: `${marketCourses.filter((course) => completedCourses.includes(course.id)).length} / ${marketCourses.length} certificates`,
      complete: marketCourses.every((course) => completedCourses.includes(course.id)),
      active: marketCourses.some((course) => completedCourses.includes(course.id)),
    },
    {
      id: "map-practice",
      label: "Question Training",
      detail: `${savedQuestions.length} saved flashcards`,
      complete: savedQuestions.length >= 12,
      active: savedQuestions.length > 0,
    },
    {
      id: "map-league",
      label: "Weekly League",
      detail: `${currentLeague.name} - #${learnerPlace}`,
      complete: currentLeague.name === "Ascender",
      active: studyStats.weeklyXp > 0,
    },
    {
      id: "map-ascender",
      label: "Ascender Period",
      detail: allClassesComplete ? "Unlocked" : `${completedClasses} / ${totalClasses} classes`,
      complete: allClassesComplete,
      active: progressPercent >= 85,
    },
  ];

  useEffect(() => {
    const loadTimer = window.setTimeout(async () => {
      const today = dateKey();
      const activeWeek = weekKey();
      const storedStats = window.localStorage.getItem("ascend-study-stats");
      if (storedStats) {
        const parsedStats = JSON.parse(storedStats) as StudyStats;
        setStudyStats({
          streakCount: parsedStats.streakCount || 0,
          dailyStudyCount: parsedStats.lastStudyDate === today ? parsedStats.dailyStudyCount || 0 : 0,
          weeklyXp: parsedStats.weekKey === activeWeek ? parsedStats.weeklyXp || 0 : 0,
          lastStudyDate: parsedStats.lastStudyDate || "",
          weekKey: activeWeek,
        });
      }

      if (!supabase) {
        const localProgress = window.localStorage.getItem("ascend-academy-progress");
        setCompleted(localProgress ? JSON.parse(localProgress) : []);
        const localCourses = window.localStorage.getItem("ascend-academy-courses");
        setCompletedCourses(localCourses ? JSON.parse(localCourses) : []);
        const localQuestions = window.localStorage.getItem("ascend-question-bank");
        setSavedQuestions(localQuestions ? JSON.parse(localQuestions) : []);
        const localStars = window.localStorage.getItem("ascend-academy-stars");
        setProficiencyStars(localStars ? JSON.parse(localStars) : {});
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const localProgress = window.localStorage.getItem("ascend-academy-progress");
        setCompleted(localProgress ? JSON.parse(localProgress) : []);
        const localCourses = window.localStorage.getItem("ascend-academy-courses");
        setCompletedCourses(localCourses ? JSON.parse(localCourses) : []);
        const localQuestions = window.localStorage.getItem("ascend-question-bank");
        setSavedQuestions(localQuestions ? JSON.parse(localQuestions) : []);
        const localStars = window.localStorage.getItem("ascend-academy-stars");
        setProficiencyStars(localStars ? JSON.parse(localStars) : {});
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("ascend_academy_progress")
        .select("stage_id, course_id, saved_question")
        .eq("user_id", user.id);

      if (error) {
        setStatus(error.message);
      } else {
        setCompleted((data || []).filter((row) => row.stage_id).map((row) => row.stage_id as string));
        setCompletedCourses((data || []).filter((row) => row.course_id).map((row) => row.course_id as string));
        setSavedQuestions((data || []).filter((row) => row.saved_question).map((row) => row.saved_question as string));
      }
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [supabase]);

  function recordStudy(xp: number) {
    const today = dateKey();
    const activeWeek = weekKey();

    setStudyStats((current) => {
      const sameDay = current.lastStudyDate === today;
      const yesterday = current.lastStudyDate && daysBetween(current.lastStudyDate, today) === 1;
      const sameWeek = current.weekKey === activeWeek;
      const nextStats = {
        streakCount: sameDay ? current.streakCount : yesterday ? current.streakCount + 1 : 1,
        dailyStudyCount: sameDay ? current.dailyStudyCount + 1 : 1,
        weeklyXp: (sameWeek ? current.weeklyXp : 0) + xp,
        lastStudyDate: today,
        weekKey: activeWeek,
      };

      window.localStorage.setItem("ascend-study-stats", JSON.stringify(nextStats));
      return nextStats;
    });
  }

  async function completeStage(stage: AcademyStage, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const questions = buildStageQuestions(stage);
    const score = quizScore(questions, answers, stage.id);

    if (score < 80) {
      setStatus(`${stage.level} score: ${score}%. Review the lesson and retake until you reach 80%.`);
      return;
    }

    const stars = starsFromScore(score);
    const nextStars = { ...proficiencyStars, [stage.id]: Math.max(proficiencyStars[stage.id] || 0, stars) };
    const nextCompleted = Array.from(new Set([...completed, stage.id]));
    setCompleted(nextCompleted);
    setProficiencyStars(nextStars);
    setStatus(`${stage.level} passed with ${score}%. ${stars} stars earned. ${stage.xp} XP earned.`);
    window.localStorage.setItem("ascend-academy-progress", JSON.stringify(nextCompleted));
    window.localStorage.setItem("ascend-academy-stars", JSON.stringify(nextStars));
    recordStudy(stage.xp);

    if (supabase && userId) {
      const { error } = await supabase.from("ascend_academy_progress").upsert({
        user_id: userId,
        stage_id: stage.id,
        score,
        xp_earned: stage.xp,
        completed_at: new Date().toISOString(),
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      await supabase.from("ascend_profiles").update({ academy_level: rankFromXp(totalXp + stage.xp) }).eq("user_id", userId);
    }
  }

  async function completeCourse(course: MarketCourse, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const questions = buildCourseQuestions(course);
    const score = quizScore(questions, courseAnswers, course.id);

    if (score < 80) {
      setStatus(`${course.title} score: ${score}%. Review the module and retake until you reach 80%.`);
      return;
    }

    const stars = starsFromScore(score);
    const xpEarned = Math.round(300 * (score / 100));
    const nextStars = { ...proficiencyStars, [course.id]: Math.max(proficiencyStars[course.id] || 0, stars) };
    const nextCourses = Array.from(new Set([...completedCourses, course.id]));
    setCompletedCourses(nextCourses);
    setProficiencyStars(nextStars);
    window.localStorage.setItem("ascend-academy-courses", JSON.stringify(nextCourses));
    window.localStorage.setItem("ascend-academy-stars", JSON.stringify(nextStars));
    setStatus(`${course.certificate} earned with ${score}%. ${stars} stars earned. ${xpEarned} XP added.`);
    recordStudy(xpEarned);

    if (supabase && userId) {
      const { error } = await supabase.from("ascend_academy_progress").upsert({
        user_id: userId,
        course_id: course.id,
        score,
        xp_earned: xpEarned,
        completed_at: new Date().toISOString(),
      });

      if (error) {
        setStatus(error.message);
      }
    }
  }

  async function saveQuestion(question: string) {
    const nextQuestions = Array.from(new Set([...savedQuestions, question]));
    setSavedQuestions(nextQuestions);
    window.localStorage.setItem("ascend-question-bank", JSON.stringify(nextQuestions));
    setStatus("Question saved to your study bank.");
    recordStudy(10);

    if (supabase && userId) {
      const { error } = await supabase.from("ascend_academy_progress").upsert({
        user_id: userId,
        saved_question: question,
        score: 0,
        xp_earned: 0,
        completed_at: new Date().toISOString(),
      });

      if (error) {
        setStatus(error.message);
      }
    }
  }

  return (
    <section className="academyShell" aria-label="Ascend Academy curriculum">
      <aside className="academyProgressPanel">
        <p className="eyebrow">Account Level</p>
        <h2>{rank}</h2>
        <div className="honorMedallion">
          <Award size={28} />
          <span>{allClassesComplete ? "Ascender" : honor.label}</span>
        </div>
        <div className="academyXpBar">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <strong>{totalXp} XP</strong>
        <p>{completed.length} of {academyStages.length} stages completed.</p>
        <p>{completedCourses.length} of {marketCourses.length + financeCourses.length + masteryCourses.length} certificates earned.</p>
        <p>{allClassesComplete ? "Highest honor unlocked." : honor.flavor}</p>
        {nextHonor && !allClassesComplete && (
          <p>
            Next honor: {nextHonor.title} at {nextHonor.minXp} XP.
          </p>
        )}

        <div className="studyStatsGrid">
          <article>
            <span>Study streak</span>
            <strong>{studyStats.streakCount}</strong>
            <p>days</p>
          </article>
          <article>
            <span>Today</span>
            <strong>{studyStats.dailyStudyCount}</strong>
            <p>study actions</p>
          </article>
        </div>

        <div className="leaguePanel">
          <div className="leaguePanelHeader">
            <div>
              <p className="eyebrow">Weekly League</p>
              <h3>{currentLeague.name} Tier</h3>
            </div>
            <strong>#{learnerPlace}</strong>
          </div>
          <div className="leagueMeter">
            <span
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    ((studyStats.weeklyXp - currentLeague.minXp) /
                      Math.max(1, currentLeague.promoteAt - currentLeague.minXp)) *
                      100
                  )
                )}%`,
              }}
            />
          </div>
          <p>
            {studyStats.weeklyXp} weekly XP - {leagueStatus}
          </p>
          {nextLeague ? (
            <p>{Math.max(0, nextLeague.minXp - studyStats.weeklyXp)} XP to reach {nextLeague.name}.</p>
          ) : (
            <p>Top league unlocked. Hold the crown.</p>
          )}

          <div className="leagueBoard">
            {leagueBoard.map((competitor) => (
              <span key={competitor.name} className={competitor.name === "You" ? "isLearner" : ""}>
                <strong>{competitor.place}. {competitor.name}</strong>
                {competitor.xp} XP
              </span>
            ))}
          </div>
        </div>

        <div className="academyBadgeList">
          {earnedBadges.length === 0 ? (
            <span>No badges yet</span>
          ) : (
            earnedBadges.map((badge) => (
              <span key={badge.label}>
                <Award size={14} />
                {badge.label}
              </span>
            ))
          )}
        </div>

        <div className="questionBank">
          <h3>Question Bank</h3>
          {savedQuestions.length === 0 ? (
            <p>No saved flashcards yet.</p>
          ) : (
            savedQuestions.map((question) => <span key={question}>{question}</span>)
          )}
        </div>

        <div className="academyHelpBox">
          <h3>Never Lost Method</h3>
          {studyPrompts.map((prompt) => (
            <span key={prompt}>{prompt}</span>
          ))}
        </div>

        {status && <p className="accountStatus">{status}</p>}
      </aside>

      <div className="academyTimeline">
        <section className="academyMap">
          <div className="academyMapHeader">
            <div>
              <p className="eyebrow">Ascend Map</p>
              <h2>The learner journey fills as you complete the academy.</h2>
            </div>
            <strong>{progressPercent}%</strong>
          </div>

          <div className="academyMapTrack">
            {academyMapNodes.map((node, index) => (
              <article
                key={node.id}
                className={[
                  "academyMapNode",
                  node.complete ? "isComplete" : "",
                  node.active ? "isActive" : "",
                  node.id === "map-ascender" ? "isFinal" : "",
                ].join(" ")}
              >
                <span>{index + 1}</span>
                <div>
                  <h3>{node.label}</h3>
                  <p>{node.detail}</p>
                </div>
                {node.complete ? <CheckCircle2 size={20} /> : node.active ? <Star size={18} /> : <Lock size={18} />}
              </article>
            ))}
          </div>

          <div className={allClassesComplete ? "ascenderPeriod isUnlocked" : "ascenderPeriod"}>
            <Award size={30} />
            <div>
              <span>{allClassesComplete ? "Ascender Period Active" : "Final Ascender Period Locked"}</span>
              <p>
                {allClassesComplete
                  ? "Every lesson, quiz, certificate, and study path is complete. The learner enters the final recognition phase."
                  : "Complete every stage and certificate to fill the map and unlock the final Ascender recognition period."}
              </p>
            </div>
          </div>
        </section>

        <section className="academyCurriculumBlueprint">
          <p className="eyebrow">Curriculum Buildout</p>
          <h2>Editable module plans for the full Academy.</h2>
          <p>
            This is the new proofing layer: objectives, readings, workbook
            tasks, pass requirements, access level, and assessment depth are
            organized outside the main component so lessons can be expanded and
            edited cleanly.
          </p>

          <div className="curriculumPolicyGrid">
            <article>
              <span>Implemented Now</span>
              <strong>{curriculumSummary.currentImplementedQuizCount} scored questions</strong>
              <p>{curriculumSummary.targetModel}</p>
            </article>
            <article>
              <span>Pass Rule</span>
              <strong>{assessmentPolicy.passScore}% minimum</strong>
              <p>{assessmentPolicy.starScale}</p>
            </article>
            <article>
              <span>Access Model</span>
              <strong>30% free target</strong>
              <p>{assessmentPolicy.freeAccess}</p>
            </article>
          </div>

          <div className="ascendAdvantageGrid">
            {ascendDifferentiators.map((item) => (
              <article key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="curriculumTrackGrid">
            {curriculumTracks.map((track) => (
              <article key={track.id} className="curriculumTrackCard">
                <div>
                  <p className="eyebrow">{track.audience}</p>
                  <h3>{track.title}</h3>
                  <span>{track.freePercent}% free preview target</span>
                </div>

                {track.modules.map((module) => (
                  <section key={module.id}>
                    <div>
                      <strong>{module.title}</strong>
                      <span>{module.level} - {module.access}</span>
                    </div>
                    <p>{module.overview}</p>
                    <ul>
                      {module.readingSections.slice(0, 4).map((section) => (
                        <li key={section}>{section}</li>
                      ))}
                    </ul>
                    <em>
                      {module.estimatedPages} - {module.assessmentQuestions} questions - {module.passScore}% pass
                    </em>
                  </section>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section className="marketCourseBlock">
          <p className="eyebrow">Mastery Roadmap</p>
          <h2>Core Finance Mastery</h2>
          <p>
            The non-negotiable finance spine: accounting, TVM, macro,
            corporate finance, portfolio theory, execution, behavior, quant,
            instruments, risk, real skill, and mastery.
          </p>

          <div className="marketCourseGrid">
            {masteryCourses.map((course) => {
              const courseComplete = completedCourses.includes(course.id);
              const courseQuestions = buildCourseQuestions(course);
              const courseStars = proficiencyStars[course.id] || 0;

              return (
                <article key={course.id} className={courseComplete ? "marketCourse isComplete" : "marketCourse"}>
                  <div className="marketCourseHeader">
                    <div>
                      <h3>{course.title}</h3>
                      <span>{course.certificate}</span>
                      <em>{courseQuestions.length} question assessment - {courseStars}/5 stars</em>
                    </div>
                    {courseComplete ? <CheckCircle2 size={22} /> : <GraduationCap size={22} />}
                  </div>

                  <p>{course.description}</p>

                  <div className="academyLessonList">
                    {course.modules.map((module) => (
                      <div key={module.title}>
                        <BookOpen size={16} />
                        <span>
                          <strong>{module.title}</strong>
                          {module.explanation}
                          <em>Example: {module.example}</em>
                        </span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={(event) => completeCourse(course, event)} className="academyQuiz">
                    <div className="courseQuizHeader">
                      <h3>Final assessment: score 80% or higher to pass.</h3>
                      <button
                        type="button"
                        className="saveQuestionButton"
                        onClick={() => saveQuestion(courseQuestions[0].question)}
                      >
                        <BookMarked size={15} />
                        Save
                      </button>
                    </div>

                    <div className="academyQuizQuestions">
                      {courseQuestions.map((question, questionIndex) => (
                        <fieldset key={question.question}>
                          <legend>{questionIndex + 1}. {question.question}</legend>
                          {question.options.map((option) => (
                            <label key={option}>
                              <input
                                type="radio"
                                name={`${course.id}:${questionIndex}`}
                                value={option}
                                disabled={courseComplete}
                                checked={courseAnswers[`${course.id}:${questionIndex}`] === option}
                                onChange={(event) =>
                                  setCourseAnswers((current) => ({
                                    ...current,
                                    [`${course.id}:${questionIndex}`]: event.target.value,
                                  }))
                                }
                              />
                              {option}
                            </label>
                          ))}
                        </fieldset>
                      ))}
                    </div>

                    <button type="submit" disabled={courseComplete}>
                      <Star size={16} />
                      {courseComplete ? "Certificate Earned" : "Pass Quiz +300 XP"}
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        </section>

        <section className="marketCourseBlock">
          <p className="eyebrow">Financial Literacy</p>
          <h2>Financial Life A-Z</h2>
          <p>
            Solo lessons for the money skills learners need outside the chart:
            budgeting, saving, credit, taxes, retirement accounts, dividends,
            ETFs, CFDs, and long-term decision-making.
          </p>

          <div className="marketCourseGrid">
            {financeCourses.map((course) => {
              const courseComplete = completedCourses.includes(course.id);
              const courseQuestions = buildCourseQuestions(course);
              const courseStars = proficiencyStars[course.id] || 0;

              return (
                <article key={course.id} className={courseComplete ? "marketCourse isComplete" : "marketCourse"}>
                  <div className="marketCourseHeader">
                    <div>
                      <h3>{course.title}</h3>
                      <span>{course.certificate}</span>
                      <em>{courseQuestions.length} question assessment - {courseStars}/5 stars</em>
                    </div>
                    {courseComplete ? <CheckCircle2 size={22} /> : <GraduationCap size={22} />}
                  </div>

                  <p>{course.description}</p>

                  <div className="academyLessonList">
                    {course.modules.map((module) => (
                      <div key={module.title}>
                        <BookOpen size={16} />
                        <span>
                          <strong>{module.title}</strong>
                          {module.explanation}
                          <em>Example: {module.example}</em>
                        </span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={(event) => completeCourse(course, event)} className="academyQuiz">
                    <div className="courseQuizHeader">
                      <h3>Final assessment: score 80% or higher to pass.</h3>
                      <button
                        type="button"
                        className="saveQuestionButton"
                        onClick={() => saveQuestion(courseQuestions[0].question)}
                      >
                        <BookMarked size={15} />
                        Save
                      </button>
                    </div>

                    <div className="academyQuizQuestions">
                      {courseQuestions.map((question, questionIndex) => (
                        <fieldset key={question.question}>
                          <legend>{questionIndex + 1}. {question.question}</legend>
                          {question.options.map((option) => (
                            <label key={option}>
                              <input
                                type="radio"
                                name={`${course.id}:${questionIndex}`}
                                value={option}
                                disabled={courseComplete}
                                checked={courseAnswers[`${course.id}:${questionIndex}`] === option}
                                onChange={(event) =>
                                  setCourseAnswers((current) => ({
                                    ...current,
                                    [`${course.id}:${questionIndex}`]: event.target.value,
                                  }))
                                }
                              />
                              {option}
                            </label>
                          ))}
                        </fieldset>
                      ))}
                    </div>

                    <button type="submit" disabled={courseComplete}>
                      <Star size={16} />
                      {courseComplete ? "Certificate Earned" : "Pass Quiz +300 XP"}
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        </section>

        <section className="marketCourseBlock">
          <p className="eyebrow">Market Certificates</p>
          <h2>Financial Markets A-Z</h2>
          <p>
            Each market type has its own study path, tailored quiz, XP reward,
            saved-question flashcard support, and certificate-style completion.
          </p>

          <div className="marketCourseGrid">
            {marketCourses.map((course) => {
              const courseComplete = completedCourses.includes(course.id);
              const courseQuestions = buildCourseQuestions(course);
              const courseStars = proficiencyStars[course.id] || 0;

              return (
                <article key={course.id} className={courseComplete ? "marketCourse isComplete" : "marketCourse"}>
                  <div className="marketCourseHeader">
                    <div>
                      <h3>{course.title}</h3>
                      <span>{course.certificate}</span>
                      <em>{courseQuestions.length} question assessment - {courseStars}/5 stars</em>
                    </div>
                    {courseComplete ? <CheckCircle2 size={22} /> : <GraduationCap size={22} />}
                  </div>

                  <p>{course.description}</p>

                  <div className="academyLessonList">
                    {course.modules.map((module) => (
                      <div key={module.title}>
                        <BookOpen size={16} />
                        <span>
                          <strong>{module.title}</strong>
                          {module.explanation}
                          <em>Example: {module.example}</em>
                        </span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={(event) => completeCourse(course, event)} className="academyQuiz">
                    <div className="courseQuizHeader">
                      <h3>Final assessment: score 80% or higher to pass.</h3>
                      <button
                        type="button"
                        className="saveQuestionButton"
                        onClick={() => saveQuestion(courseQuestions[0].question)}
                      >
                        <BookMarked size={15} />
                        Save
                      </button>
                    </div>

                    <div className="academyQuizQuestions">
                      {courseQuestions.map((question, questionIndex) => (
                        <fieldset key={question.question}>
                          <legend>{questionIndex + 1}. {question.question}</legend>
                          {question.options.map((option) => (
                            <label key={option}>
                              <input
                                type="radio"
                                name={`${course.id}:${questionIndex}`}
                                value={option}
                                disabled={courseComplete}
                                checked={courseAnswers[`${course.id}:${questionIndex}`] === option}
                                onChange={(event) =>
                                  setCourseAnswers((current) => ({
                                    ...current,
                                    [`${course.id}:${questionIndex}`]: event.target.value,
                                  }))
                                }
                              />
                              {option}
                            </label>
                          ))}
                        </fieldset>
                      ))}
                    </div>

                    <button type="submit" disabled={courseComplete}>
                      <Star size={16} />
                      {courseComplete ? "Certificate Earned" : "Pass Quiz +300 XP"}
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        </section>

        {academyStages.map((stage, index) => {
          const isCompleted = completed.includes(stage.id);
          const previousComplete = index === 0 || completed.includes(academyStages[index - 1].id);
          const locked = !previousComplete;
          const stageQuestions = buildStageQuestions(stage);
          const stageStars = proficiencyStars[stage.id] || 0;

          return (
            <article key={stage.id} className={isCompleted ? "academyStage isComplete" : "academyStage"}>
              <div className="academyStageHeader">
                <div>
                  <p className="eyebrow">{stage.level}</p>
                  <h2>{stage.title}</h2>
                  <span>{stage.audience}</span>
                  <em>{stageQuestions.length} question assessment - {stageStars}/5 stars</em>
                </div>
                {locked ? <Lock size={22} /> : isCompleted ? <CheckCircle2 size={24} /> : <GraduationCap size={24} />}
              </div>

              <div className="academyLessonList">
                {stage.lessons.map((lesson) => (
                  <div key={lesson.title}>
                    <BookOpen size={16} />
                    <span>
                      <strong>{lesson.title}</strong>
                      {lesson.explanation}
                      <em>Example: {lesson.example}</em>
                      <em>Why it matters: {lesson.why}</em>
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={(event) => completeStage(stage, event)} className="academyQuiz">
                <h3>Final assessment: score 80% or higher to unlock the next stage.</h3>
                <div className="academyQuizQuestions">
                  {stageQuestions.map((question, questionIndex) => (
                    <fieldset key={question.question}>
                      <legend>{questionIndex + 1}. {question.question}</legend>
                      {question.options.map((option) => (
                        <label key={option}>
                          <input
                            type="radio"
                            name={`${stage.id}:${questionIndex}`}
                            value={option}
                            disabled={locked || isCompleted}
                            checked={answers[`${stage.id}:${questionIndex}`] === option}
                            onChange={(event) =>
                              setAnswers((current) => ({
                                ...current,
                                [`${stage.id}:${questionIndex}`]: event.target.value,
                              }))
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </fieldset>
                  ))}
                </div>

                <button type="submit" disabled={locked || isCompleted}>
                  <Star size={16} />
                  {isCompleted ? "Completed" : locked ? "Locked" : `Pass Quiz +${stage.xp} XP`}
                </button>
              </form>
            </article>
          );
        })}

        <section className="academyDrillBlock">
          <p className="eyebrow">Question Training</p>
          <h2>Weekly Study Drills</h2>
          <p>
            Extra practice prompts keep the academy active after certificates.
            Save any question into the flashcard bank and use it for daily study,
            class review, or trading-journal reflection.
          </p>

          <div className="academyDrillGrid">
            {practiceQuestionSets.map((set) => (
              <article key={set.title}>
                <h3>{set.title}</h3>
                <p>{set.description}</p>
                <div>
                  {set.questions.map((question) => (
                    <button key={question} type="button" onClick={() => saveQuestion(question)}>
                      <BookMarked size={15} />
                      {question}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="academyGlossary">
          <p className="eyebrow">Study Support</p>
          <h2>Core glossary for every learner.</h2>
          <div>
            {academyGlossary.map((item) => (
              <article key={item.term}>
                <strong>{item.term}</strong>
                <span>{item.meaning}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
