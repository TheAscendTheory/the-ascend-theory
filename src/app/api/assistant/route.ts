import { NextResponse } from "next/server";

type AssistantRequest = {
  message?: string;
  history?: string[];
};

const systemPrompt = [
  "You are the Ascend Theory assistant.",
  "Help users with financial literacy, study planning, market preparation, platform navigation, risk planning, and journaling.",
  "Do not give personalized financial advice, trade signals, or promises of profit.",
  "Keep answers practical, structured, and concise.",
].join(" ");

function localAssistantReply(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("risk") || lower.includes("position") || lower.includes("size")) {
    return "Start with risk before direction: define account size, max risk percentage, entry, invalidation, and target. Then use the Risk Calculator in Charts to size the trade before opening or journaling anything.";
  }

  if (lower.includes("study") || lower.includes("academy") || lower.includes("learn")) {
    return "Use Academy in order: read the module, complete the workbook task, then score at least 80% on the quiz. Save weak questions into flashcards and review them during the daily study counter.";
  }

  if (lower.includes("journal") || lower.includes("trade review")) {
    return "A strong journal entry should include thesis, entry, invalidation, target, size, emotion, mistake, result, and the one rule you will carry into the next setup.";
  }

  if (lower.includes("market") || lower.includes("chart") || lower.includes("setup")) {
    return "Use a clean market read: trend or range, key liquidity, session context, catalyst risk, invalidation, and whether the reward justifies the risk. If any part is unclear, no-trade is still a valid decision.";
  }

  if (lower.includes("supabase") || lower.includes("login") || lower.includes("account")) {
    return "Account, social, academy progress, demo trading, and trade journal all depend on Supabase. If something does not save, check the environment keys first, then confirm the Supabase schema has been applied.";
  }

  return "I can help with Academy study, trading prep, risk planning, journaling, market context, and site navigation. Give me the specific thing you are working on and I will turn it into a clear next step.";
}

function extractOpenAIText(data: unknown) {
  if (!data || typeof data !== "object") {
    return "";
  }

  const response = data as {
    output_text?: string;
    output?: { content?: { text?: string }[] }[];
  };

  if (response.output_text) {
    return response.output_text;
  }

  return (
    response.output
      ?.flatMap((item) => item.content || [])
      .map((content) => content.text || "")
      .join("\n")
      .trim() || ""
  );
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as AssistantRequest | null;
  const message = body?.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "Message required." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      mode: "local",
      reply: localAssistantReply(message),
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1",
        instructions: systemPrompt,
        input: [
          ...(body?.history || []).slice(-6).map((entry) => ({
            role: "user",
            content: entry,
          })),
          {
            role: "user",
            content: message,
          },
        ],
        max_output_tokens: 350,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with ${response.status}`);
    }

    const data = await response.json();
    const reply = extractOpenAIText(data) || localAssistantReply(message);

    return NextResponse.json({ mode: "openai", reply });
  } catch (error) {
    console.error("Assistant API error:", error);

    return NextResponse.json({
      mode: "local",
      reply: localAssistantReply(message),
    });
  }
}
