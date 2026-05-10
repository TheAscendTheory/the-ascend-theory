"use client";

import { FormEvent, useState } from "react";
import { Bot, Minus, Send, Sparkles, X } from "lucide-react";

const starterPrompts = [
  "Explain this market setup",
  "Help me plan risk",
  "Build a study plan",
  "Summarize today's focus",
];

export default function AIAssistantDock() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    "I can help you study, plan trades, understand tools, and navigate Ascend.",
  ]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim()) {
      return;
    }

    const userMessage = draft.trim();
    const history = messages.slice(-6);

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      setMessages((current) => [
        ...current,
        data.reply || data.error || "I could not answer that yet. Try asking it another way.",
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        "I could not reach the assistant endpoint. Check the deployment environment and try again.",
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="floatingChatButton assistantButton"
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        aria-label="Open AI assistant"
      >
        <Bot size={20} />
        <span>AI Assist</span>
      </button>
    );
  }

  return (
    <aside className={minimized ? "floatingChat isMinimized" : "floatingChat"}>
      <div className="floatingChatHeader assistantHeader">
        <button type="button" onClick={() => setMinimized((current) => !current)}>
          <Sparkles size={17} />
          <span>Ascend Assistant</span>
        </button>

        <div>
          <button
            type="button"
            onClick={() => setMinimized((current) => !current)}
            aria-label={minimized ? "Expand assistant" : "Minimize assistant"}
          >
            <Minus size={16} />
          </button>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
            <X size={16} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="assistantPromptGrid">
            {starterPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => setDraft(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="floatingMessages">
            {messages.map((message, index) => (
              <p key={`${message}-${index}`} className={index % 2 === 1 ? "myFloatingMessage" : ""}>
                {message}
              </p>
            ))}
            {loading && <p>Thinking through the cleanest next step...</p>}
          </div>

          <form onSubmit={sendMessage} className="floatingChatBar">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask the Ascend assistant"
              disabled={loading}
            />
            <button type="submit" aria-label="Send assistant message" disabled={loading}>
              <Send size={17} />
            </button>
          </form>
        </>
      )}
    </aside>
  );
}
