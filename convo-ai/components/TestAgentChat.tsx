"use client";

import { useEffect, useRef, useState } from "react";

import {
  Send,
  Bot,
  User,
  Sparkles,
  Globe2,
  Activity,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Tell me brokerage benefits",
  "Hindi mein samjhao",
  "What documents are required?",
  "Mujhe family se discuss karna hai",
  "Brokerage kitna milega?",
  "How does onboarding work?",
];

export default function TestAgentChat() {

  const [messages, setMessages] = useState<Message[]>([
    {
    role: "assistant",
    content:
      ""
},
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

messagesEndRef.current?.scrollIntoView();

  }, [messages]);

  async function sendMessage(customText?: string) {

    const finalMessage = customText || input;

    if (!finalMessage.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: finalMessage,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/test-agent/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: finalMessage,
          }),
        }
      );

      const data = await response.json();

      setTimeout(() => {

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
          },
        ]);

        setLoading(false);

      }, 900);

    } catch (error) {

      console.error(error);

      setLoading(false);
    }
  }

  return (

    <div className="grid grid-cols-12 gap-6 h-full min-h-0">

      {/* LEFT PANEL */}

      <div className="col-span-3 h-full flex">

        <div className="bg-white border border-[#1D4ED8]/10 rounded-3xl p-4 shadow-sm">

          <div className="flex items-center gap-2 mb-5">

            <Sparkles
              size={18}
              className="text-[#1D4ED8]"
            />

            <h2 className="font-semibold text-slate-800">
              Quick Tests
            </h2>

          </div>

          <div className="space-y-3">

            {QUICK_PROMPTS.map((prompt) => (

              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="w-full text-left p-3 rounded-2xl border border-[#1D4ED8]/10 hover:border-[#1D4ED8]/30 hover:bg-[#1D4ED8]/[0.03] transition-all text-sm text-slate-700"
              >
                {prompt}
              </button>

            ))}

          </div>

        </div>

      </div>

      {/* CHAT PANEL */}

      <div className="col-span-9 min-h-0 h-full overflow-hidden">

        <div className="bg-white border border-[#1D4ED8]/10 rounded-3xl shadow-sm overflow-hidden h-full flex flex-col min-h-0">

          {/* TOP BAR */}

          <div className="px-6 py-4 border-b border-[#1D4ED8]/10 bg-[#1D4ED8]/[0.03] flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-[#1D4ED8]/10 flex items-center justify-center">

                <Bot
                  size={22}
                  className="text-[#1D4ED8]"
                />

              </div>

              <div>

                <div className="font-semibold text-slate-800">
                  Convo-AI Agent
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  AI Relationship Manager
                </div>

              </div>

            </div>

            <div className="flex items-center gap-4 text-xs">

              <div className="flex items-center gap-1 text-green-600">

                <Activity size={14} />

                Online

              </div>

              <div className="flex items-center gap-1 text-[#1D4ED8]">

                <Globe2 size={14} />

                Multilingual Enabled

              </div>

            </div>

          </div>

          {/* MESSAGES */}

          <div className="flex-1 overflow-y-auto min-h-0 max-h-full px-6 py-5 space-y-5 bg-gradient-to-b from-white to-slate-50">

            {messages.map((message, index) => (

              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === "assistant"
                      ? "bg-white border border-[#1D4ED8]/10 text-slate-700"
                      : "bg-[#1D4ED8] text-white"
                  }`}
                >

                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wide">

                    {message.role === "assistant" ? (
                      <>
                        <Bot size={14} />
                        Convo-AI
                      </>
                    ) : (
                      <>
                        <User size={14} />
                        You
                      </>
                    )}

                  </div>

                  <div className="text-sm leading-6">
                    {message.content}
                  </div>

                </div>

              </div>

            ))}

            {loading && (

              <div className="flex justify-start">

                <div className="bg-white border border-[#1D4ED8]/10 rounded-3xl px-5 py-4 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-bounce delay-200" />

                  </div>

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

          {/* INPUT */}

          <div className="p-3 border-t border-[#1D4ED8]/10 bg-white">

            <div className="flex items-center gap-3">

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Ask Convo-AI anything..."
                className="flex-1 h-11 px-5 rounded-2xl border border-[#1D4ED8]/10 focus:border-[#1D4ED8]/40 outline-none text-sm"
              />

              <button
                onClick={() => sendMessage()}
                className="h-11 px-5 rounded-2xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white transition-all flex items-center gap-2 font-medium"
              >

                <Send size={16} />

                Send

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
