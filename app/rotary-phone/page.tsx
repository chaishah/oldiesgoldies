"use client";

import Link from "next/link";
import { useState } from "react";

type CallerChoice = "share" | "verify" | "hang-up" | "call-back";

type CallerScenario = {
  caller: string;
  line: string;
  clue: string;
  safeChoices: CallerChoice[];
  safeReply: string;
  unsafeReply: string;
};

const scenarios: CallerScenario[] = [
  {
    caller: "Bank Security Desk",
    line:
      "This is urgent. Read me the code we just sent so I can stop your account from closing.",
    clue: "Real banks do not ask you to read out login or security codes.",
    safeChoices: ["hang-up", "call-back"],
    safeReply:
      "Correct. Hang up and call the bank using the number on your card or statement.",
    unsafeReply:
      "That code is a key. A real bank will not ask you to hand it over on a surprise call."
  },
  {
    caller: "Computer Help Department",
    line:
      "Your computer is infected. I can fix it if you let me connect to your screen now.",
    clue: "Unexpected tech-support calls are a common scam warning sign.",
    safeChoices: ["hang-up", "verify"],
    safeReply:
      "Good call. Do not give screen access to someone who called out of the blue.",
    unsafeReply:
      "Screen access lets a caller see and control too much. Stop and verify first."
  },
  {
    caller: "Grandchild In Trouble",
    line:
      "Please do not tell anyone. I need money sent quickly and I am using a friend's phone.",
    clue: "Pressure, secrecy, and unusual wording deserve a second check.",
    safeChoices: ["verify", "call-back"],
    safeReply:
      "Safe move. Call a known family number or ask another trusted person before sending money.",
    unsafeReply:
      "Scam callers use panic to rush decisions. Pause and verify through a number you already know."
  }
];

const choices: Array<{ id: CallerChoice; label: string }> = [
  { id: "share", label: "Share the code" },
  { id: "verify", label: "Ask to verify" },
  { id: "hang-up", label: "Hang up" },
  { id: "call-back", label: "Call back trusted number" }
];

export default function RotaryPhonePage() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [handledCalls, setHandledCalls] = useState(0);
  const [feedback, setFeedback] = useState<{
    kind: "safe" | "unsafe";
    message: string;
  } | null>(null);

  const scenario = scenarios[scenarioIndex];
  const complete = handledCalls >= scenarios.length;

  const handleChoice = (choice: CallerChoice) => {
    const safe = scenario.safeChoices.includes(choice);

    if (!safe) {
      setFeedback({
        kind: "unsafe",
        message: scenario.unsafeReply
      });
      return;
    }

    setHandledCalls((count) => count + 1);
    setFeedback({
      kind: "safe",
      message: scenario.safeReply
    });
  };

  const handleNext = () => {
    setScenarioIndex((index) => (index + 1) % scenarios.length);
    setFeedback(null);
  };

  return (
    <main className="min-h-screen bg-[#132f2f] px-4 py-5 font-mono text-[#f8efd2] sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-7xl gap-6">
        <header className="border-b-2 border-dashed border-[#d7b15f]/50 pb-5">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded border-2 border-[#d7b15f] bg-[#f8efd2] px-4 text-sm font-bold uppercase text-[#132f2f] shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5"
            >
              Back to TV
            </Link>
            <Link
              href="/features"
              className="inline-flex min-h-11 items-center rounded border-2 border-[#d7b15f] bg-[#1d4745] px-4 text-sm font-bold uppercase text-[#f8efd2] shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5"
            >
              Feature catalog
            </Link>
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.28em] text-[#d7b15f]">
            Rotary desk special
          </p>
          <h1 className="mt-2 font-display text-5xl leading-none text-[#f8efd2] sm:text-6xl lg:text-7xl">
            Mystery Caller
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#f8efd2]/85">
            Practice what to do when a caller asks for codes, money, screen
            access, or private information.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="rounded-[2rem] border-4 border-[#d7b15f] bg-[#5a3027] p-4 shadow-[0_28px_70px_rgba(0,0,0,0.35)]">
            <div className="rounded-[1.4rem] border-4 border-[#1b1411] bg-[#8a513a] p-4">
              <div className="grid gap-5 rounded-[1rem] border-2 border-[#1b1411] bg-[#f8efd2] p-5 text-[#1b1411] lg:grid-cols-[18rem_1fr]">
                <div className="grid place-items-center rounded-full border-[14px] border-[#1b1411] bg-[#2b2420] p-5 shadow-inner">
                  <div className="grid size-52 place-items-center rounded-full border-[18px] border-[#d7b15f] bg-[#f8efd2]">
                    <div className="grid size-24 place-items-center rounded-full border-4 border-[#1b1411] bg-[#8bc6c6] font-display text-4xl">
                      {complete ? "OK" : scenarioIndex + 1}
                    </div>
                  </div>
                </div>

                <article className="rounded border-2 border-[#1b1411] bg-[#fff8e6] p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a4463f]">
                    Incoming call
                  </p>
                  <h2 className="mt-3 font-display text-4xl leading-tight">
                    {complete ? "Line Secured" : scenario.caller}
                  </h2>
                  <p className="mt-4 text-lg leading-8">
                    {complete
                      ? "You handled every mystery caller safely. When in doubt, hang up and use a number you already trust."
                      : scenario.line}
                  </p>
                  {!complete ? (
                    <div className="mt-5 rounded border-2 border-dashed border-[#5a3027] bg-[#f8efd2] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5a3027]">
                        Safety clue
                      </p>
                      <p className="mt-2 text-sm leading-6">{scenario.clue}</p>
                    </div>
                  ) : null}
                </article>
              </div>
            </div>
          </div>

          <aside className="grid gap-4 rounded-[2rem] border-4 border-[#d7b15f] bg-[#1d4745] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.25)]">
            <div className="rounded border-2 border-[#d7b15f] bg-[#f8efd2] p-4 text-[#132f2f]">
              <p className="text-sm font-bold uppercase tracking-[0.16em]">
                Safe calls
              </p>
              <p className="mt-2 font-display text-5xl">
                {Math.min(handledCalls, scenarios.length)} / {scenarios.length}
              </p>
            </div>

            <div className="grid gap-3">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleChoice(choice.id)}
                  disabled={complete || feedback?.kind === "safe"}
                  className="min-h-14 rounded border-2 border-[#d7b15f] bg-[#f8efd2] px-4 text-left font-bold uppercase text-[#132f2f] shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {choice.label}
                </button>
              ))}
            </div>

            {feedback ? (
              <div
                className={`rounded border-2 p-4 ${
                  feedback.kind === "safe"
                    ? "border-[#d7b15f] bg-[#d7b15f]/25"
                    : "border-[#a4463f] bg-[#a4463f]/25"
                }`}
              >
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#d7b15f]">
                  {feedback.kind === "safe" ? "Safe move" : "Careful"}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#f8efd2]">
                  {feedback.message}
                </p>
                {feedback.kind === "safe" && !complete ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="mt-4 h-11 w-full rounded border-2 border-[#d7b15f] bg-[#d7b15f] px-4 font-bold uppercase text-[#132f2f] transition hover:bg-[#f8efd2]"
                  >
                    Next caller
                  </button>
                ) : null}
              </div>
            ) : null}
          </aside>
        </section>
      </section>
    </main>
  );
}
