"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TRADERS, ARCHETYPES, type Archetype } from "@/data/traders";

const ARCHETYPE_KEYS = Object.keys(ARCHETYPES) as Archetype[];

export default function HomePage() {
  const [activeArchetype, setActiveArchetype] = useState<Archetype | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return TRADERS.filter((t) => {
      const matchesArchetype = activeArchetype === "all" || t.archetype === activeArchetype;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.edge.toLowerCase().includes(q) ||
        t.knownFor.toLowerCase().includes(q);
      return matchesArchetype && matchesSearch;
    });
  }, [activeArchetype, searchQuery]);

  return (
    <div className="min-h-screen" style={{ background: "var(--ink)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(13,13,15,0.92)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(232,232,238,0.07)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
              style={{ background: "var(--gold)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
            >
              TA
            </div>
            <span
              className="text-lg tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--white)" }}
            >
              Trader Atlas
            </span>
          </div>

          <div
            className="hidden md:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
            style={{
              borderColor: "rgba(201,168,76,0.3)",
              background: "rgba(201,168,76,0.07)",
              color: "var(--gold)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span className="animate-pulse-gold">◆</span>
            <span>Educational Reference Only — Not Financial Advice</span>
          </div>

          <nav className="flex items-center gap-6">
            <a
              href="#traders"
              className="text-sm transition-colors"
              style={{ color: "var(--silver-2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--silver-2)")}
            >
              Traders
            </a>
            <a
              href="#about"
              className="text-sm transition-colors"
              style={{ color: "var(--silver-2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--silver-2)")}
            >
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-6">
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(201,168,76,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          <div
            className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border mb-8"
            style={{
              borderColor: "rgba(201,168,76,0.25)",
              background: "rgba(201,168,76,0.05)",
              color: "var(--gold)",
              fontFamily: "var(--font-mono)",
            }}
          >
            25 Traders · 7 Archetypes · 1 AI Engine
          </div>

          <h1
            className="text-5xl md:text-7xl font-black leading-none mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--white)",
              letterSpacing: "-0.02em",
            }}
          >
            Trade Like
            <br />
            <span style={{ color: "var(--gold)" }}>the Greats.</span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--silver-2)" }}
          >
            The complete methodology reference for 25 legendary traders — from Livermore to Camillo.
            Study their rules, run their frameworks against any ticker.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#traders"
              className="px-8 py-3.5 rounded text-sm font-semibold transition-all"
              style={{ background: "var(--gold)", color: "var(--ink)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gold-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--gold)")}
            >
              Browse All Traders
            </a>
            <Link
              href="/trader/chris-camillo"
              className="px-8 py-3.5 rounded text-sm font-semibold border transition-all"
              style={{
                borderColor: "rgba(232,232,238,0.15)",
                color: "var(--white)",
                background: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(232,232,238,0.35)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(232,232,238,0.15)")}
            >
              Start with Camillo ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Archetype Legend */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveArchetype("all")}
              className="px-3 py-1.5 rounded text-xs font-medium border transition-all"
              style={{
                borderColor: activeArchetype === "all" ? "var(--gold)" : "rgba(232,232,238,0.1)",
                background: activeArchetype === "all" ? "rgba(201,168,76,0.12)" : "transparent",
                color: activeArchetype === "all" ? "var(--gold)" : "var(--silver-2)",
              }}
            >
              All Traders ({TRADERS.length})
            </button>
            {ARCHETYPE_KEYS.map((arch) => (
              <button
                key={arch}
                onClick={() => setActiveArchetype(arch)}
                className="px-3 py-1.5 rounded text-xs font-medium border transition-all"
                style={{
                  borderColor:
                    activeArchetype === arch
                      ? ARCHETYPES[arch].color
                      : "rgba(232,232,238,0.1)",
                  background:
                    activeArchetype === arch
                      ? `${ARCHETYPES[arch].color}18`
                      : "transparent",
                  color:
                    activeArchetype === arch ? ARCHETYPES[arch].color : "var(--silver-2)",
                }}
              >
                {ARCHETYPES[arch].label} ({TRADERS.filter((t) => t.archetype === arch).length})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="px-6 pb-8" id="traders">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search traders, strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded text-sm outline-none border transition-all"
              style={{
                background: "var(--ink-2)",
                borderColor: searchQuery ? "rgba(201,168,76,0.4)" : "rgba(232,232,238,0.1)",
                color: "var(--white)",
                fontFamily: "var(--font-body)",
              }}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "var(--silver-2)" }}
            >
              {filtered.length} results
            </span>
          </div>
        </div>
      </section>

      {/* Trader Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((trader, i) => (
              <Link
                key={trader.id}
                href={`/trader/${trader.id}`}
                className="group relative block rounded-xl border overflow-hidden transition-all duration-200"
                style={{
                  background: "var(--ink-2)",
                  borderColor: "rgba(232,232,238,0.07)",
                  animationDelay: `${i * 30}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${trader.color}40`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 32px ${trader.color}14`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(232,232,238,0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Color accent bar */}
                <div
                  className="h-0.5 w-full transition-all duration-300"
                  style={{
                    background: `linear-gradient(90deg, ${trader.color}, ${trader.accent}60)`,
                    opacity: 0.6,
                  }}
                />

                <div className="p-5">
                  {/* Archetype badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded border"
                      style={{
                        color: trader.color,
                        borderColor: `${trader.color}30`,
                        background: `${trader.color}0D`,
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {ARCHETYPES[trader.archetype].label}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded border risk-${trader.riskProfile}`}
                    >
                      {trader.riskProfile}
                    </span>
                  </div>

                  {/* Name */}
                  <h3
                    className="text-xl font-bold mb-1 leading-tight transition-colors"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--white)",
                    }}
                  >
                    {trader.name}
                  </h3>

                  {/* Era */}
                  <div
                    className="text-xs mb-3"
                    style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}
                  >
                    {trader.era} · {trader.timeframe}
                  </div>

                  {/* Tagline */}
                  <p
                    className="text-sm leading-relaxed mb-4 line-clamp-2"
                    style={{ color: "var(--silver-2)" }}
                  >
                    &ldquo;{trader.tagline}&rdquo;
                  </p>

                  {/* Edge */}
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--silver-2)", opacity: 0.7 }}>
                    {trader.edge}
                  </p>

                  {/* CTA */}
                  <div
                    className="mt-4 pt-4 border-t flex items-center justify-between"
                    style={{ borderColor: "rgba(232,232,238,0.07)" }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}
                    >
                      {trader.rules.length} rules · {trader.signatureTrades.length} trades
                    </span>
                    <span
                      className="text-xs font-semibold transition-colors"
                      style={{ color: trader.color }}
                    >
                      Open →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20" style={{ color: "var(--silver-2)" }}>
              <div className="text-4xl mb-4">∅</div>
              <p>No traders match that filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* About section */}
      <section
        id="about"
        className="px-6 py-20 border-t"
        style={{ borderColor: "rgba(232,232,238,0.07)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--white)" }}
          >
            What is Trader Atlas?
          </h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--silver-2)" }}>
            Trader Atlas is a methodology encyclopedia for serious students of the market.
            We&apos;ve researched and codified the complete trading frameworks of 25 legendary
            traders — from Jesse Livermore&apos;s tape-reading instincts to Jim Simons&apos;
            mathematical edge to Chris Camillo&apos;s social arbitrage.
          </p>
          <p className="text-base leading-relaxed mb-10" style={{ color: "var(--silver-2)" }}>
            Each trader profile includes their core doctrine, entry/exit rules, screening
            criteria, signature trades, and red flags. The AI engine lets you run any ticker
            or thesis through a trader&apos;s framework — not to give you signals, but to help you
            think like they would.
          </p>

          <div
            className="p-6 rounded-xl border text-left"
            style={{
              background: "rgba(201,168,76,0.05)",
              borderColor: "rgba(201,168,76,0.2)",
            }}
          >
            <div
              className="text-xs font-semibold mb-2 tracking-widest uppercase"
              style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
            >
              ⚠ Disclaimer
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--silver-2)" }}>
              Trader Atlas is for educational and reference purposes only. Nothing on this site
              constitutes financial advice, investment recommendations, or trading signals.
              All trading involves risk. Past performance of any trader or strategy does not
              guarantee future results. Always consult a qualified financial professional
              before making any investment decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 border-t"
        style={{
          borderColor: "rgba(232,232,238,0.07)",
          background: "var(--ink)",
        }}
      >
        <div
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}
        >
          <span>© 2025 Trader Atlas — Educational Reference Only</span>
          <span>Built with Next.js + Anthropic API · Not Financial Advice</span>
        </div>
      </footer>
    </div>
  );
}
