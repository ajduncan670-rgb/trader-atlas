"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { type Trader, ARCHETYPES, TRADERS } from "@/data/traders";

type Message = { role: "user" | "assistant"; content: string };

export default function TraderClient({ trader }: { trader: Trader }) {
  const [activeTab, setActiveTab] = useState<"profile" | "rules" | "engine" | "trades">("profile");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setLoading(true);
    setStreamText("");

    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traderId: trader.id, messages: newMessages }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) { fullText += data.text; setStreamText(fullText); }
              } catch {}
            }
          }
        }
      }
      setMessages([...newMessages, { role: "assistant", content: fullText }]);
      setStreamText("");
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Error connecting to AI engine. Check your API key in Vercel." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const suggestedPrompts = [
    `Analyze NVDA using ${trader.name}'s framework`,
    `Would ${trader.name} trade TSLA right now?`,
    `How would ${trader.name} set an exit on AAPL?`,
    `What does ${trader.name} think of the current market?`,
  ];

  const archetype = ARCHETYPES[trader.archetype];
  const siblings = TRADERS.filter((t) => t.archetype === trader.archetype && t.id !== trader.id).slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: "var(--ink)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "rgba(13,13,15,0.94)", backdropFilter: "blur(16px)", borderColor: "rgba(232,232,238,0.07)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm transition-colors" style={{ color: "var(--silver-2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--silver-2)")}>
              ← Trader Atlas
            </Link>
            <span style={{ color: "var(--ink-3)" }}>/</span>
            <span className="text-sm" style={{ color: "var(--white)" }}>{trader.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
            style={{ borderColor: `${trader.color}40`, background: `${trader.color}0A`, color: trader.color, fontFamily: "var(--font-mono)" }}>
            {archetype.label}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="pt-12 pb-8 border-b" style={{ borderColor: "rgba(232,232,238,0.07)" }}>
          <div className="w-12 h-1 rounded-full mb-6" style={{ background: `linear-gradient(90deg, ${trader.color}, ${trader.accent})` }} />
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
            <div>
              <div className="text-xs mb-3 tracking-widest uppercase" style={{ color: trader.color, fontFamily: "var(--font-mono)" }}>
                {trader.era} · {trader.timeframe}
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-none mb-4"
                style={{ fontFamily: "var(--font-display)", color: "var(--white)", letterSpacing: "-0.02em" }}>
                {trader.name}
              </h1>
              <p className="text-xl max-w-2xl leading-relaxed" style={{ color: "var(--silver-2)", fontStyle: "italic" }}>
                &ldquo;{trader.tagline}&rdquo;
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "TIMEFRAME", value: trader.timeframe.split(" — ")[0] },
                { label: "RISK", value: trader.riskProfile, cls: `risk-${trader.riskProfile}` },
                { label: "RULES", value: String(trader.rules.length) },
              ].map((stat) => (
                <div key={stat.label} className="px-4 py-3 rounded-xl border text-center min-w-[100px]"
                  style={{ background: "var(--ink-2)", borderColor: "rgba(232,232,238,0.08)" }}>
                  <div className="text-xs mb-1" style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}>{stat.label}</div>
                  <div className={`text-sm font-semibold ${stat.cls || ""}`} style={!stat.cls ? { color: "var(--white)" } : {}}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 py-4 border-b sticky top-16 z-40"
          style={{ borderColor: "rgba(232,232,238,0.07)", background: "var(--ink)" }}>
          {(["profile", "rules", "engine", "trades"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded text-sm font-medium transition-all"
              style={{
                background: activeTab === tab ? `${trader.color}18` : "transparent",
                color: activeTab === tab ? trader.color : "var(--silver-2)",
                borderBottom: activeTab === tab ? `2px solid ${trader.color}` : "2px solid transparent",
              }}>
              {tab === "engine" ? "AI Engine" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {[{ title: "The Edge", content: trader.edge }, { title: "Known For", content: trader.knownFor }].map((s) => (
                <div key={s.title}>
                  <h2 className="text-xs tracking-widest uppercase mb-4" style={{ color: trader.color, fontFamily: "var(--font-mono)" }}>{s.title}</h2>
                  <p className="text-base leading-relaxed" style={{ color: "var(--silver)" }}>{s.content}</p>
                </div>
              ))}
              <div>
                <h2 className="text-xs tracking-widest uppercase mb-4" style={{ color: trader.color, fontFamily: "var(--font-mono)" }}>Doctrine</h2>
                <div className="space-y-3">
                  {trader.doctrine.map((d, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-xl border" style={{ background: "var(--ink-2)", borderColor: "rgba(232,232,238,0.07)" }}>
                      <span className="text-xs mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center rounded-full font-bold"
                        style={{ background: `${trader.color}18`, color: trader.color, fontFamily: "var(--font-mono)" }}>{i + 1}</span>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--silver-2)" }}>&ldquo;{d}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xs tracking-widest uppercase mb-4" style={{ color: trader.color, fontFamily: "var(--font-mono)" }}>Screening Criteria</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trader.screeningCriteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg border" style={{ background: "var(--ink-2)", borderColor: "rgba(232,232,238,0.07)" }}>
                      <span style={{ color: "#4CC98A", marginTop: 1 }}>✓</span>
                      <span className="text-sm" style={{ color: "var(--silver-2)" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xs tracking-widest uppercase mb-4" style={{ color: trader.color, fontFamily: "var(--font-mono)" }}>Red Flags</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trader.redFlags.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg border" style={{ background: "rgba(201,76,76,0.05)", borderColor: "rgba(201,76,76,0.15)" }}>
                      <span style={{ color: "#C94C4C", marginTop: 1 }}>✕</span>
                      <span className="text-sm" style={{ color: "var(--silver-2)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {[{ title: "Entry Logic", color: "#4CC98A", items: trader.entryLogic }, { title: "Exit Logic", color: "#C94C4C", items: trader.exitLogic }].map((s) => (
                <div key={s.title} className="rounded-xl border p-5" style={{ background: "var(--ink-2)", borderColor: "rgba(232,232,238,0.07)" }}>
                  <h3 className="text-xs tracking-widest uppercase mb-4" style={{ color: s.color, fontFamily: "var(--font-mono)" }}>{s.title}</h3>
                  <ol className="space-y-2">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="shrink-0 text-xs mt-0.5" style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}>{i + 1}.</span>
                        <span style={{ color: "var(--silver-2)" }}>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
              <div className="rounded-xl border p-5" style={{ background: `${trader.color}07`, borderColor: `${trader.color}25` }}>
                <h3 className="text-xs tracking-widest uppercase mb-3" style={{ color: trader.color, fontFamily: "var(--font-mono)" }}>AI Engine</h3>
                <p className="text-sm mb-4" style={{ color: "var(--silver-2)" }}>Ask how {trader.name.split(" ")[0]} would analyze any ticker.</p>
                <button onClick={() => setActiveTab("engine")} className="w-full py-2.5 rounded text-sm font-semibold"
                  style={{ background: trader.color, color: "var(--ink)" }}>Open Engine →</button>
              </div>
              {siblings.length > 0 && (
                <div className="rounded-xl border p-5" style={{ background: "var(--ink-2)", borderColor: "rgba(232,232,238,0.07)" }}>
                  <h3 className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}>Same Archetype</h3>
                  <div className="space-y-2">
                    {siblings.map((s) => (
                      <Link key={s.id} href={`/trader/${s.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border transition-all"
                        style={{ background: "var(--ink)", borderColor: "rgba(232,232,238,0.07)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${s.color}40`)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(232,232,238,0.07)")}>
                        <span className="text-sm font-medium" style={{ color: "var(--white)" }}>{s.name}</span>
                        <span style={{ color: s.color }}>→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RULES TAB */}
        {activeTab === "rules" && (
          <div className="py-10 max-w-3xl mx-auto space-y-4">
            {trader.rules.map((rule, i) => (
              <div key={i} className="p-6 rounded-xl border" style={{ background: "var(--ink-2)", borderColor: "rgba(232,232,238,0.07)" }}>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ background: `${trader.color}18`, color: trader.color, fontFamily: "var(--font-mono)" }}>{i + 1}</div>
                  <div>
                    <h3 className="text-base font-bold mb-2" style={{ color: "var(--white)", fontFamily: "var(--font-display)" }}>{rule.label}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--silver-2)" }}>{rule.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI ENGINE TAB */}
        {activeTab === "engine" && (
          <div className="py-8">
            <div className="mb-6 p-4 rounded-lg border text-sm"
              style={{ background: "rgba(201,168,76,0.05)", borderColor: "rgba(201,168,76,0.2)", color: "var(--silver-2)" }}>
              <strong style={{ color: "var(--gold)" }}>⚠ Educational Reference Only.</strong>{" "}
              This AI applies {trader.name}&apos;s published methodology. Not financial advice.
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--ink-2)", borderColor: "rgba(232,232,238,0.08)" }}>
              <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "rgba(232,232,238,0.07)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: trader.color }} />
                <span className="text-sm font-medium" style={{ color: "var(--white)", fontFamily: "var(--font-mono)" }}>
                  {trader.name.split(" ")[0].toUpperCase()} ENGINE
                </span>
                <span className="ml-auto text-xs" style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}>Powered by Claude · Educational Only</span>
              </div>
              <div className="h-[460px] overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <p className="text-lg italic max-w-md mx-auto mb-6" style={{ color: "var(--silver-2)", fontFamily: "var(--font-display)" }}>
                      &ldquo;{trader.tagline}&rdquo;
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestedPrompts.map((p, i) => (
                        <button key={i} onClick={() => { setInput(p); inputRef.current?.focus(); }}
                          className="px-3 py-2 rounded-lg border text-xs transition-all"
                          style={{ borderColor: "rgba(232,232,238,0.12)", color: "var(--silver-2)", background: "var(--ink)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${trader.color}50`; e.currentTarget.style.color = trader.color; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(232,232,238,0.12)"; e.currentTarget.style.color = "var(--silver-2)"; }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[85%] px-4 py-3 text-sm leading-relaxed"
                      style={msg.role === "user"
                        ? { background: `${trader.color}18`, color: "var(--white)", borderRadius: "16px 16px 4px 16px" }
                        : { background: "var(--ink)", color: "var(--silver)", border: "1px solid rgba(232,232,238,0.07)", borderRadius: "16px 16px 16px 4px" }}>
                      {msg.role === "assistant" && (
                        <div className="text-xs mb-2 font-semibold" style={{ color: trader.color, fontFamily: "var(--font-mono)" }}>
                          {trader.name.split(" ")[0].toUpperCase()} ENGINE
                        </div>
                      )}
                      <div className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>"),
                        }} />
                    </div>
                  </div>
                ))}
                {(loading || streamText) && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] px-4 py-3 text-sm"
                      style={{ background: "var(--ink)", color: "var(--silver)", border: "1px solid rgba(232,232,238,0.07)", borderRadius: "16px 16px 16px 4px" }}>
                      <div className="text-xs mb-2 font-semibold" style={{ color: trader.color, fontFamily: "var(--font-mono)" }}>
                        {trader.name.split(" ")[0].toUpperCase()} ENGINE
                      </div>
                      {streamText
                        ? <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: streamText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") + "▋" }} />
                        : <div className="flex gap-1">{[0,1,2].map(j => <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: trader.color, opacity: 0.6 }} />)}</div>
                      }
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(232,232,238,0.07)" }}>
                <div className="flex gap-3">
                  <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey} disabled={loading}
                    placeholder={`Ask how ${trader.name.split(" ")[0]} would think about this...`}
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none border"
                    style={{ background: "var(--ink)", borderColor: input ? `${trader.color}50` : "rgba(232,232,238,0.1)", color: "var(--white)" }} />
                  <button onClick={sendMessage} disabled={loading || !input.trim()}
                    className="px-5 py-3 rounded-xl text-sm font-semibold"
                    style={{ background: loading || !input.trim() ? "var(--ink-3)" : trader.color, color: loading || !input.trim() ? "var(--silver-2)" : "var(--ink)" }}>
                    {loading ? "..." : "→"}
                  </button>
                </div>
                {messages.length > 0 && (
                  <button onClick={() => { setMessages([]); setStreamText(""); }} className="mt-2 text-xs" style={{ color: "var(--silver-2)" }}>
                    Clear conversation
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TRADES TAB */}
        {activeTab === "trades" && (
          <div className="py-10 max-w-3xl mx-auto">
            {trader.signatureTrades.length === 0 ? (
              <div className="text-center py-16 rounded-xl border" style={{ background: "var(--ink-2)", borderColor: "rgba(232,232,238,0.07)", color: "var(--silver-2)" }}>
                Signature trade data for this trader is being researched.
              </div>
            ) : (
              <div className="space-y-6">
                {trader.signatureTrades.map((trade, i) => (
                  <div key={i} className="p-6 rounded-xl border" style={{ background: "var(--ink-2)", borderColor: "rgba(232,232,238,0.07)" }}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-xl font-bold" style={{ color: "var(--white)", fontFamily: "var(--font-display)" }}>{trade.name}</h3>
                      <span className="text-xs px-2 py-1 rounded border shrink-0"
                        style={{ borderColor: `${trader.color}30`, background: `${trader.color}0D`, color: trader.color, fontFamily: "var(--font-mono)" }}>
                        {trade.year}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--silver-2)" }}>{trade.description}</p>
                    <div className="p-3 rounded-lg border" style={{ background: "rgba(76,201,138,0.06)", borderColor: "rgba(76,201,138,0.2)" }}>
                      <span className="text-xs font-semibold" style={{ color: "#4CC98A" }}>OUTCOME: </span>
                      <span className="text-sm" style={{ color: "var(--silver)" }}>{trade.outcome}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="mt-16 px-6 py-8 border-t" style={{ borderColor: "rgba(232,232,238,0.07)", background: "var(--ink)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs" style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}>
          <span>© 2025 Trader Atlas — Educational Reference Only</span>
          <Link href="/" className="transition-colors hover:text-white">← Back to All Traders</Link>
        </div>
      </footer>
    </div>
  );
}
