import Link from "next/link";
import { NavbarClient } from "./_components/Navbar";
import { FeaturesSection } from "./_components/Features";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f5f2ec] text-[#0f0e0d] overflow-x-hidden">
      <NavbarClient />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center px-6 overflow-hidden">
        {/* grid background */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#ddd8cd 1px, transparent 1px), linear-gradient(90deg, #ddd8cd 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)",
          }}
        />

        {/* orbs */}
        <div
          className="absolute rounded-full pointer-events-none animate-drift"
          style={{
            width: 400,
            height: 400,
            background: "rgba(200,96,26,0.12)",
            filter: "blur(60px)",
            top: "10%",
            left: "-10%",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none animate-drift"
          style={{
            width: 300,
            height: 300,
            background: "rgba(200,96,26,0.08)",
            filter: "blur(60px)",
            top: "20%",
            right: "-5%",
            animationDelay: "-3s",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none animate-drift"
          style={{
            width: 200,
            height: 200,
            background: "rgba(200,96,26,0.1)",
            filter: "blur(60px)",
            bottom: "20%",
            left: "30%",
            animationDelay: "-5s",
          }}
        />

        {/* hero content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-6 pt-40">
          {/* badge */}
          <div
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#c8601a] bg-[#f0d4bb] px-4 py-1.5 rounded-full border border-[#c8601a]/25 animate-fade-up"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8601a] animate-pulse" />
            Now in beta — free to use
          </div>

          {/* title */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight max-w-[14ch] animate-fade-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            Write together, <em className="text-[#c8601a] not-italic">think</em>{" "}
            together
          </h1>

          {/* subtitle */}
          <p
            className="text-base sm:text-lg text-[#8a8070] max-w-[44ch] leading-relaxed font-light animate-fade-up"
            style={{ animationDelay: "0.35s", opacity: 0 }}
          >
            A collaborative document editor that feels like thinking out loud —
            real-time sync, live cursors, and zero friction.
          </p>

          {/* actions */}
          <div
            className="flex gap-3 flex-wrap justify-center animate-fade-up"
            style={{ animationDelay: "0.5s", opacity: 0 }}
          >
            <Link
              href="/login"
              className="text-sm font-medium px-7 py-3 rounded-full bg-[#0f0e0d] text-[#f5f2ec] hover:bg-[#c8601a] transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-[0_6px_20px_rgba(200,96,26,0.3)]"
            >
              Start writing free
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium px-7 py-3 rounded-full border border-[#ddd8cd] text-[#0f0e0d] hover:bg-[#ede9e0] hover:border-[#0f0e0d] transition-all duration-200 hover:-translate-y-0.5"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* doc preview */}
        <div
          className="relative z-10 w-full max-w-3xl mt-14 pb-12 animate-fade-up"
          style={{ animationDelay: "0.65s", opacity: 0 }}
        >
          <div className="bg-white rounded-2xl border border-[#ddd8cd] shadow-[0_8px_40px_rgba(15,14,13,0.1)] overflow-hidden">
            {/* window bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#ede9e0] border-b border-[#ddd8cd]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="text-xs text-[#8a8070] mx-auto">
                Q3 Strategy Doc
              </span>
              {/* avatars */}
              <div className="flex items-center -space-x-1.5 ml-auto">
                {[
                  { l: "A", bg: "#3b82f6" },
                  { l: "M", bg: "#10b981" },
                  { l: "R", bg: "#f59e0b" },
                ].map(({ l, bg }) => (
                  <div
                    key={l}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white border-2 border-white"
                    style={{ background: bg }}
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>

            {/* doc body */}
            <div className="px-10 py-8 space-y-2.5">
              <h2 className="text-2xl text-[#0f0e0d] mb-4">
                Q3 Growth Strategy
              </h2>
              {/* skeleton lines */}
              {["90%", "75%", "85%"].map((w, i) => (
                <div
                  key={i}
                  className="h-2.5 rounded bg-[#ede9e0]"
                  style={{ width: w }}
                />
              ))}
              {/* cursor 1 */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-semibold text-white bg-[#3b82f6] px-1.5 py-0.5 rounded-sm">
                  Aisha
                </span>
                <span className="w-0.5 h-3.5 rounded-sm bg-[#3b82f6] animate-blink" />
                <div className="h-2.5 rounded bg-[#ede9e0] flex-1" />
              </div>
              <div className="h-2.5 rounded bg-[#ede9e0] w-[60%]" />
              {/* cursor 2 */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-semibold text-white bg-[#10b981] px-1.5 py-0.5 rounded-sm">
                  Mehul
                </span>
                <span className="w-0.5 h-3.5 rounded-sm bg-[#10b981] animate-blink" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* ── CTA ── */}
      <section className="mx-6 mb-24 rounded-3xl bg-[#0f0e0d] px-8 py-20 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 120%, rgba(200,96,26,0.3), transparent)",
          }}
        />
        <h2 className="text-4xl sm:text-5xl text-[#f5f2ec] leading-tight tracking-tight mb-4 relative z-10">
          Ready to write
          <br />
          <em className="text-[#f0d4bb]">together?</em>
        </h2>
        <p className="text-[#f5f2ec]/60 mb-8 relative z-10">
          Free to get started. No credit card required.
        </p>
        <Link
          href="/login"
          className="inline-block relative z-10 text-sm font-medium px-8 py-3.5 rounded-full bg-[#f5f2ec] text-[#0f0e0d] hover:bg-[#f0d4bb] transition-all duration-200 hover:-translate-y-0.5"
        >
          Open Collab →
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#ddd8cd] px-10 py-6 flex items-center justify-between flex-wrap gap-4">
        <div className="text-lg text-[#0f0e0d]">
          Coll<span className="text-[#c8601a] italic">ab</span>
        </div>
        <p className="text-xs text-[#8a8070]">
          © 2025 Collab. Built with care.
        </p>
      </footer>
    </main>
  );
}
