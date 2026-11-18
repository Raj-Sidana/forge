"use client";
import { HoleBackground } from "@/components/animate-ui/backgrounds/hole";
import { BlueTitle, GrayTitle, SectionHeading, SectionLabel } from "@/components/reusables";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react"
import Image from "next/image";
import { PricingTable, SignInButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FEATURES, PLACEHOLDERS, STEPS, SUGGESTIONS } from "@/lib/data";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Key } from "lucide-react";
import { mergeClassNames } from "@base-ui/react";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused || prompt) return;
    const t = setInterval(() => {
      setPlaceholderIndex(i =>(i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(t);
  }, [isFocused, prompt]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [prompt]);

  const handleSubmit = () => {
    if (!prompt.trim() || !isSignedIn) return;
    router.push(`/workspace?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  // Submit on ENter, allow shift+Enter for newlines
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };

  const handleSuggestion = (s: string) => {
    setPrompt(s);
    textareaRef.current?.focus();
  };


  return (
    <main className="min-h-screen bg-[#0a0a0a] selection:bg-white/20">
      <section className="relative flex flex-col items-center overflow-hidden px-4
      pb-24 pt-40 text-center">
        <HoleBackground
        strokeColor="rgba(255,255,255,0.05)"
        className="absolute inset-0 h-full w-full"
        style={{
          maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
        }}
        />

        <Badge variant={"outline"} className="gap-2 p-4 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"/>
        Powered by Gemini 3.5 Flash
        </Badge>
        <h1 className="mx-auto max-w-3xl text-balance font-serif text-5xl
        leading-tight tracking-tight sm:text-5xl lg:text-7xl z-10">
          <GrayTitle>Forge your dream</GrayTitle>
          <br />
          <BlueTitle>from a single prompt</BlueTitle>
        </h1>  

        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed
        text-white/40 z-10">
          Descibe what you want to build. AI writes the code, picks the 
          packages, and renders a live preview all inside your browser.
        </p>

        {/* Prompt Box */}

        <div className="relative mx-auto mt-10 w-full max-w-2xl">
          <div
  className={cn(
    "rounded-2xl border bg-[#111111] duration-200",
    isFocused
      ? "border-white/20 ring-1 ring-white/8"
      : "border-white/8"
  )}
>
  <textarea
  ref={textareaRef}
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  onKeyDown={handleKeyDown}
  rows={1}
  className="w-full resize-none bg-transparent px-5 pb-4 pt-5 text-sm
  placeholder:text-white/20 focus:outline-none sm:text-base"
  style={{ minHeight: 56, maxHeight: 200}}
  placeholder={PLACEHOLDERS[placeholderIndex]}
  />

  <div className="flex items-center justify-between border-t border-white/6
  px-4 py-2.5">
    <span className="text-xs text-white/20">
    Press ⏎ to generate · Shift + ⏎ for newline
    </span>

    {isSignedIn ?(
      <Button
      onClick={handleSubmit}
      disabled={!prompt.trim()}
      className="h-8 rounded-full px-5 font-semibold"
      variant={prompt.trim() ? "default" : "secondary"}
      >Generate</Button>
    ) : (
      <SignInButton mode="modal">
      <Button className="h-8 rounded-full bg-white px-5 font-semibold">
        Generate 
        <ArrowRight className="h-3.5 w-3.5"/>
      </Button>
      </SignInButton>
    )}
  </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
            <button
            key={s}
            onClick={() => handleSuggestion(s)}
            className="rounded-full border-white/8 bg-white/4 px-3 py-1.5 
            text-xs text-white/40 hover:border-white/15 hover:bg-white/8
            hover:text-white/70"
            >
              {s}
            </button>
            ))}
          </div>
        </div>
        <p className="mt-10 text-xs text-white/20">
        NO credit card required · 10 free generation on sign up
        </p>
      </section>
      
      {/* Browser Mockup — Workspace UI Preview */}
      <section className="relative flex flex-col items-center px-4 pb-32 pt-4">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/[0.03] to-transparent" />

        <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_0_80px_rgba(0,0,0,0.8)]">

          {/* Browser Chrome */}
          <div className="flex items-center gap-3 border-b border-white/8 bg-[#161616] px-4 py-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            {/* URL bar */}
            <div className="flex flex-1 items-center gap-2 rounded-md border border-white/8 bg-white/5 px-3 py-1.5">
              <svg className="h-3 w-3 shrink-0 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11v2a6 6 0 0012 0v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3" />
                <rect x="5" y="11" width="14" height="10" rx="2" />
              </svg>
              <span className="text-xs text-white/30">forge.app/workspace</span>
            </div>
          </div>

          {/* Split panel */}
          <div className="flex h-[480px]">

            {/* ── Left: Chat panel ── */}
            <div className="flex w-[42%] shrink-0 flex-col border-r border-white/8 bg-[#0e0e0e]">
              {/* Chat header */}
              <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-white/50">Forge AI</span>
              </div>

              {/* Messages */}
              <div className="flex flex-1 flex-col gap-4 overflow-hidden px-4 py-4">

                {/* User bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-white/10 px-3.5 py-2.5">
                    <p className="text-xs leading-relaxed text-white/80">
                      Build a project management app with a kanban board
                    </p>
                  </div>
                </div>

                {/* AI response bubble 1 */}
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-[10px] font-bold text-white">
                    F
                  </div>
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/6 px-3.5 py-2.5">
                    <p className="text-xs leading-relaxed text-white/70">
                      Sure! I'll scaffold a full-stack kanban board with drag-and-drop columns, card creation, and status tracking.
                    </p>
                  </div>
                </div>

                {/* AI response bubble 2 — typing indicator */}
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-[10px] font-bold text-white">
                    F
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white/6 px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Message input */}
              <div className="border-t border-white/8 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5">
                  <span className="flex-1 text-xs text-white/20">Ask a follow-up…</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10">
                    <svg className="h-3 w-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Code / Preview panel ── */}
            <div className="flex flex-1 flex-col bg-[#0a0a0a]">
              {/* Tabs */}
              <div className="flex items-center gap-0 border-b border-white/8 bg-[#111111]">
                <button className="border-b-2 border-blue-500 px-4 py-2.5 text-xs font-medium text-white/80">
                  Preview
                </button>
                <button className="px-4 py-2.5 text-xs text-white/30 hover:text-white/50">
                  Code
                </button>
                <button className="px-4 py-2.5 text-xs text-white/30 hover:text-white/50">
                  Files
                </button>
                <div className="ml-auto flex items-center gap-2 px-3">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-white/30">Generating…</span>
                </div>
              </div>

              {/* Kanban board */}
              <div className="flex flex-1 gap-3 overflow-hidden p-4">
                {/* Todo column */}
                <div className="flex w-1/3 flex-col gap-2">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-white/30">Todo</span>
                    <span className="rounded-full bg-white/8 px-1.5 py-0.5 text-[10px] text-white/40">3</span>
                  </div>
                  {/* Card skeletons */}
                  <div className="rounded-lg border border-white/8 bg-white/4 p-3">
                    <div className="mb-2 h-2 w-3/4 rounded-full bg-white/10" />
                    <div className="h-1.5 w-1/2 rounded-full bg-white/6" />
                  </div>
                  <div className="rounded-lg border border-white/8 bg-white/4 p-3">
                    <div className="mb-2 h-2 w-5/6 rounded-full bg-white/10" />
                    <div className="h-1.5 w-2/5 rounded-full bg-white/6" />
                  </div>
                  <div className="rounded-lg border border-white/8 bg-white/4 p-3">
                    <div className="mb-2 h-2 w-2/3 rounded-full bg-white/10" />
                    <div className="h-1.5 w-3/5 rounded-full bg-white/6" />
                  </div>
                </div>

                {/* In Progress column */}
                <div className="flex w-1/3 flex-col gap-2">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-400/70">In Progress</span>
                    <span className="rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-400/60">2</span>
                  </div>
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                    <div className="mb-2 h-2 w-4/5 rounded-full bg-blue-400/20" />
                    <div className="h-1.5 w-1/2 rounded-full bg-blue-400/10" />
                  </div>
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                    <div className="mb-2 h-2 w-3/5 rounded-full bg-blue-400/20" />
                    <div className="h-1.5 w-2/3 rounded-full bg-blue-400/10" />
                  </div>
                </div>

                {/* Done column */}
                <div className="flex w-1/3 flex-col gap-2">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400/60">Done</span>
                    <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400/50">1</span>
                  </div>
                  <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-3">
                    <div className="mb-2 h-2 w-4/6 rounded-full bg-emerald-400/15" />
                    <div className="h-1.5 w-1/3 rounded-full bg-emerald-400/10" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom label */}
        <p className="mt-5 text-xs text-white/20">Live workspace — no setup required</p>
      </section>

      <section className="mx-auto mb-14 max-w-5xl px-4 text-center">
        <SectionLabel>Everything you need</SectionLabel>
        <SectionHeading gray="From prompt" blue="to production"/>

        <div className="mx-auto grid max-w-5xl grid-cols-l gap-px overflow-hidden
        rounded-2xl border border-white/6 bg-white/6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({icon: Icon, label, desc}) => {
            return (
              <div 
              key={label}
              className="group bg-[#0a0a0a] p-7 hover:bg-[#0f0f0f]"
              >

              <div className="mb-4 flex h-9 items-center justify-center rounded-lg
              border-white/8 bg-white/4 group-hover:border-white/15 group-hover:bg-white/8">
              <Icon className="h-4 w-4 text-white/60 group-hover:text-blue-400/70"/>
              </div>

              <p className="mb-2 text-sm font-semibold">{label}</p>
              <p className="text-sm leading-relaxed text-white/40">{desc}</p>
              </div>
            );
          })}
        </div>

      </section>

      <section className="mx-auto mb-14 max-w-5xl px-4 text-center">
        <SectionLabel>How it works</SectionLabel>
        <SectionHeading gray="Four steps" blue="to a working app"/>

        <div className="mx-auto mt-10 max-w-3xl text-left">
          {STEPS.map((step,i) => (
            <div key={step.number} className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full border border-white/10 bg-white/4">
                <span className="font-mono text-xs font-semibold text-white/50">{step.number}</span>
              </div>

              {i < STEPS.length  && (
                <div className="mt-2 h-full w-px bg-white/6"/>
              )}
              
              <div className="pb-10 pt-1.5">
                <p className="mb-1.5 text-sm font-semibold sm:text-base">
                  {step.label}
                </p>

                <p className="text-sm leading-relaxed text-white/40">
                {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-32">
        <div className="mx-auto mb-14 max-w-5xl text-center">
        <SectionLabel>Simple pricing</SectionLabel>
        <SectionHeading gray="Start free" blue="scale when ready"/>

        <p className="mx-auto mt-4 max-w-sm text-sm text-white/35">
        No credit card required. Upgrade or downgrade anytime</p>
        </div>

        <div className="mx-auto max-w-5xl">
          <PricingTable
          checkoutProps={{
            appearance: {
              elements: {
                drawerRoot: {
                  zIndex: 2000,
                },
              },
            },
          }}
          />
        </div>
      </section>

      <section className="relative mx-auto mb-32 max-w-5xl overflow-hidden
      rounded-2xl border border-white/8 px-10 py-24 text-center">
        <HoleBackground
        strokeColor="rgba(255,255,255,0.05)"
        className="absolute inset-0 h-full w-full"
        style={{
          maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
        }}
        />

        <SectionHeading gray="Start building," blue="for free"/>

        <p className="mb-8 text-sm leading-relaxed text-white/40">
        Get 10 free generations on sign up. No credit card required.
        <br />
        Upgrade when you&apos;re ready
        </p>

        <SignInButton mode="modal">
          <Button
          size="lg"
          className="relative"h-11 rounded-full bg-white px-8>
            Get started free
            <ChevronRight className="h-4 w-4"/>
          </Button>
        </SignInButton>
      </section>

      <footer className="relative z-10 border-white/7 py-12 mx-auto px-6
      flex flex-wrap items items-center justify-center text-stone-400">
        Made with ❤️ by 5idana
      </footer>
    </main>
  );
}
