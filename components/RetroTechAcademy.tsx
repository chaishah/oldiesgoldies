"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ModuleId, useAcademyStore } from "@/lib/academyStore";

type GestureId = "tap" | "swipe" | "scroll";
type MailChoice = "open" | "check" | "ask" | "report";
type PrivacyAnswer = "safe" | "private";
type PrivacyItemId = "phone" | "address" | "birthday" | "hobby";

type MailScenario = {
  from: string;
  subject: string;
  body: string;
  correctChoices: MailChoice[];
  success: string;
  failure: string;
};

type PrivacyItem = {
  id: PrivacyItemId;
  label: string;
  example: string;
  correctAnswer: PrivacyAnswer;
};

type LessonModule = {
  id: ModuleId;
  number: string;
  title: string;
  skill: string;
  metaphor: string;
  badge: string;
  dialLabel: string;
  action: string;
  copy: string;
};

const modules: LessonModule[] = [
  {
    id: "switchboard",
    number: "01",
    title: "The Switchboard",
    skill: "Touch Gestures",
    metaphor: "Plug in tap, swipe, and scroll cables.",
    badge: "Operator",
    dialLabel: "Tap",
    action: "Connect the cables",
    copy:
      "Match each phone line with the gesture it asks for. Touch is just a set of simple signals: tap to choose, swipe to move, and scroll to travel through longer pages."
  },
  {
    id: "watch",
    number: "02",
    title: "The Neighborhood Watch",
    skill: "Cybersecurity & Scams",
    metaphor: "Sort good mail from snake-oil letters.",
    badge: "Watch Captain",
    dialLabel: "Mail",
    action: "Sort the mail",
    copy:
      "Real companies do not rush you with threats, strange links, or prizes you never entered. Pause, inspect the sender, and ask a trusted person before acting."
  },
  {
    id: "master-key",
    number: "03",
    title: "The Master Key",
    skill: "Passwords & Privacy",
    metaphor: "Lock the door and keep the party line private.",
    badge: "Key Keeper",
    dialLabel: "Keys",
    action: "Lock the door",
    copy:
      "A strong password is like a unique house key. Use a different one for each important account and keep private details off shared conversations."
  },
  {
    id: "emergency-exit",
    number: "04",
    title: "The Emergency Exit",
    skill: "Navigation Safety",
    metaphor: "Find the Home button and return to the Front Porch.",
    badge: "Home Finder",
    dialLabel: "Home",
    action: "Press home",
    copy:
      "If the screen feels crowded or confusing, the Home button is your reset switch. It brings you back to a safe starting place."
  },
  {
    id: "party-line",
    number: "05",
    title: "The Party Line",
    skill: "Social Awareness",
    metaphor: "Pull the curtain when private details enter the conversation.",
    badge: "Curtain Puller",
    dialLabel: "Chat",
    action: "Sort details",
    copy:
      "The internet can feel like a friendly chat, but public spaces are shared. Keep phone numbers, addresses, and birthdays behind the curtain."
  },
  {
    id: "snake-oil",
    number: "06",
    title: "The Snake Oil",
    skill: "Ad Awareness",
    metaphor: "Ignore the flashy pitch and follow the real Next button.",
    badge: "Ad Spotter",
    dialLabel: "Ads",
    action: "Read safely",
    copy:
      "Some pages use bright colors and urgent words to pull attention away from the real path. Look for the steady button, not the loud one."
  }
];

const moduleById = new Map(modules.map((module) => [module.id, module]));

const mailScenarios: MailScenario[] = [
  {
    from: "Sunnyvale Clinic",
    subject: "Appointment reminder for Tuesday",
    body:
      "Hello. This is a reminder for your regular appointment. Please call the phone number on your clinic card if you need to change it.",
    correctChoices: ["open"],
    success: "This one is safe to open. It names a known clinic and asks you to use a number you already trust.",
    failure:
      "The clinic letter was wearing its proper name tag. This one was okay to open because it did not rush you or hide a strange link."
  },
  {
    from: "security-alert@bank-prize.example",
    subject: "URGENT: Your bank card will close today",
    body:
      "Click this special link now to keep your account open. You must act in the next 10 minutes.",
    correctChoices: ["check", "ask", "report"],
    success:
      "Good catch. Urgent threats and odd sender addresses deserve a careful check before anyone clicks.",
    failure:
      "That urgent letter was wearing a fake badge. Slow down and inspect the address before opening anything."
  },
  {
    from: "Prize Desk",
    subject: "You won a brand-new television",
    body:
      "You have been selected. Send your details to claim a prize from a contest you never entered.",
    correctChoices: ["check", "ask", "report"],
    success:
      "Right move. A surprise prize from a contest you never entered should go through the safety check first.",
    failure:
      "The offer sounded shinier than a brand-new toaster, but the contest never happened. Check first."
  },
  {
    from: "Parcel Notice",
    subject: "Delivery failed",
    body:
      "Your parcel is waiting. Pay a small fee at a shortened link before midnight or it will disappear.",
    correctChoices: ["check", "ask", "report"],
    success:
      "Nicely sorted. Mystery delivery fees and shortened links belong in the suspicious mail pile.",
    failure:
      "The parcel note knocked loudly, but its link was hiding behind the curtains. Check the sender first."
  }
];

const privacyItems: PrivacyItem[] = [
  {
    id: "phone",
    label: "Phone number",
    example: "0400 123 456",
    correctAnswer: "private"
  },
  {
    id: "address",
    label: "Home address",
    example: "12 Garden Street",
    correctAnswer: "private"
  },
  {
    id: "birthday",
    label: "Birthday",
    example: "14 July 1952",
    correctAnswer: "private"
  },
  {
    id: "hobby",
    label: "Favorite hobby",
    example: "Listening to old radio shows",
    correctAnswer: "safe"
  }
];

export default function RetroTechAcademy() {
  const {
    learnerName,
    activeModule,
    completedModules,
    setLearnerName,
    setActiveModule,
    completeModule,
    resetProgress
  } = useAcademyStore();
  const [mounted, setMounted] = useState(false);
  const [gameStep, setGameStep] = useState(0);
  const [switchboardGestures, setSwitchboardGestures] = useState<GestureId[]>([]);
  const [mailIndex, setMailIndex] = useState(0);
  const [mailFeedback, setMailFeedback] = useState<{
    kind: "success" | "failure";
    message: string;
  } | null>(null);
  const [handledMail, setHandledMail] = useState(0);
  const [emergencyExitUsed, setEmergencyExitUsed] = useState(false);
  const [privacyAnswers, setPrivacyAnswers] = useState<
    Partial<Record<PrivacyItemId, PrivacyAnswer>>
  >({});
  const [curtainPulled, setCurtainPulled] = useState(false);
  const [articlePage, setArticlePage] = useState(0);
  const [adWarning, setAdWarning] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setGameStep(0);
    setSwitchboardGestures([]);
    setMailIndex(0);
    setMailFeedback(null);
    setHandledMail(0);
    setEmergencyExitUsed(false);
    setPrivacyAnswers({});
    setCurtainPulled(false);
    setArticlePage(0);
    setAdWarning(null);
  }, [activeModule]);

  const selectedModule = moduleById.get(activeModule) ?? modules[0];
  const progress = mounted ? completedModules.length : 0;
  const completionPercent = Math.round((progress / modules.length) * 100);
  const isComplete = mounted && completedModules.includes(selectedModule.id);

  useEffect(() => {
    if (
      activeModule === "switchboard" &&
      switchboardGestures.length === 3 &&
      !completedModules.includes("switchboard")
    ) {
      completeModule("switchboard");
    }
  }, [activeModule, completeModule, completedModules, switchboardGestures.length]);

  useEffect(() => {
    const privacyComplete =
      activeModule === "party-line" &&
      curtainPulled &&
      privacyItems.every(
        (item) => privacyAnswers[item.id] === item.correctAnswer
      );

    if (privacyComplete && !completedModules.includes("party-line")) {
      completeModule("party-line");
    }
  }, [activeModule, completeModule, completedModules, curtainPulled, privacyAnswers]);

  const dialRotation = useMemo(() => {
    const index = modules.findIndex((module) => module.id === activeModule);
    return index * 38 - 38;
  }, [activeModule]);

  const handleSwitchboardGesture = (gesture: GestureId) => {
    setSwitchboardGestures((currentGestures) => {
      if (currentGestures.includes(gesture)) {
        return currentGestures;
      }

      return [...currentGestures, gesture];
    });
  };

  const handleMailChoice = (choice: MailChoice) => {
    const scenario = mailScenarios[mailIndex];
    const correct = scenario.correctChoices.includes(choice);

    if (!correct) {
      setMailFeedback({
        kind: "failure",
        message: scenario.failure
      });
      return;
    }

    const nextHandledMail = handledMail + 1;
    setHandledMail(nextHandledMail);
    setMailFeedback({
      kind: "success",
      message: scenario.success
    });

    if (nextHandledMail >= 3) {
      completeModule("watch");
    }
  };

  const handleNextMail = () => {
    setMailIndex((currentIndex) => (currentIndex + 1) % mailScenarios.length);
    setMailFeedback(null);
  };

  const handleMasterKeyChoice = () => {
    if (isComplete || selectedModule.id !== "master-key") {
      return;
    }

    if (gameStep < 2) {
      setGameStep((step) => step + 1);
      return;
    }

    completeModule("master-key");
  };

  const handleHomePress = () => {
    if (selectedModule.id !== "emergency-exit") {
      return;
    }

    setEmergencyExitUsed(true);
    completeModule("emergency-exit");
  };

  const handlePrivacyAnswer = (
    itemId: PrivacyItemId,
    answer: PrivacyAnswer
  ) => {
    setPrivacyAnswers((currentAnswers) => ({
      ...currentAnswers,
      [itemId]: answer
    }));
  };

  const handleArticleNext = () => {
    setAdWarning(null);

    if (articlePage >= 2) {
      completeModule("snake-oil");
      return;
    }

    setArticlePage((currentPage) => currentPage + 1);
  };

  const handleAdClick = () => {
    setAdWarning(
      "That shiny Winner button was the snake oil pitch. Leave it alone and use the plain Next button."
    );
  };

  return (
    <main className="min-h-screen overflow-hidden px-4 py-5 font-mono sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 lg:min-h-[calc(100vh-2.5rem)]">
        <header className="flex flex-col gap-4 border-b-2 border-dashed border-walnut/35 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cherry">
              Local-first lesson broadcast
            </p>
            <h1 className="mt-2 font-display text-5xl leading-none text-bakelite sm:text-6xl lg:text-7xl">
              Retro-Tech Academy
            </h1>
            <Link
              href="/features"
              className="mt-4 inline-flex min-h-11 items-center rounded border-2 border-walnut bg-paper px-4 text-sm font-bold uppercase text-walnut shadow-[4px_4px_0_rgba(46,33,26,0.18)] transition hover:-translate-y-0.5"
            >
              Feature catalog
            </Link>
          </div>
          <div className="grid gap-2 sm:min-w-80">
            <label
              className="text-sm font-bold uppercase tracking-[0.16em] text-walnut"
              htmlFor="learner-name"
            >
              Name card
            </label>
            <input
              id="learner-name"
              value={mounted ? learnerName : ""}
              onChange={(event) => setLearnerName(event.target.value)}
              className="h-12 rounded border-2 border-walnut bg-paper px-4 text-lg text-ink shadow-sm"
              placeholder="Type your name"
            />
          </div>
        </header>

        <div className="grid flex-1 gap-6 xl:grid-cols-[1fr_19rem] xl:items-stretch">
          <section className="rounded-[2rem] bg-wood p-3 shadow-cabinet sm:p-5">
            <div className="h-full rounded-[1.4rem] border-4 border-bakelite/65 bg-cabinet/70 p-3">
              <div className="mb-3 flex items-center justify-between gap-3 px-2">
                <div className="flex gap-2" aria-hidden="true">
                  <span className="size-3 rounded-full bg-cherry shadow-inner" />
                  <span className="size-3 rounded-full bg-mustard shadow-inner" />
                  <span className="size-3 rounded-full bg-robin shadow-inner" />
                </div>
                <button
                  type="button"
                  onClick={handleHomePress}
                  className={`min-h-12 rounded-full border-4 px-5 font-bold uppercase shadow-[0_5px_0_#2E211A] transition active:translate-y-0.5 ${
                    selectedModule.id === "emergency-exit"
                      ? "border-bakelite bg-mustard text-bakelite hover:-translate-y-0.5"
                      : "border-bakelite/40 bg-paper/40 text-bakelite/50"
                  }`}
                >
                  Home
                </button>
              </div>
              <div className="screen-scanlines min-h-[36rem] overflow-hidden rounded-[1.1rem] border-[10px] border-bakelite bg-robin shadow-insetTube">
                <div className="paper-texture flex min-h-full flex-col p-5 sm:p-7 lg:p-9">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full border-2 border-bakelite bg-mustard px-4 py-2 text-sm font-bold uppercase text-bakelite">
                      Channel {selectedModule.number}
                    </span>
                    <span className="rounded-full border-2 border-bakelite bg-paper px-4 py-2 text-sm font-bold uppercase text-cherry">
                      {completionPercent}% punched
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.article
                      key={selectedModule.id}
                      initial={{ opacity: 0, x: 28, filter: "sepia(0.8)" }}
                      animate={{ opacity: 1, x: 0, filter: "sepia(0)" }}
                      exit={{ opacity: 0, x: -28, filter: "sepia(0.8)" }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="flex flex-1 flex-col"
                    >
                      <div className="mt-8">
                        <p className="text-base font-bold uppercase tracking-[0.18em] text-walnut">
                          {selectedModule.skill}
                        </p>
                        <h2 className="mt-2 font-display text-4xl leading-tight text-bakelite sm:text-5xl">
                          {selectedModule.title}
                        </h2>
                        <p className="mt-4 max-w-3xl text-lg leading-8 text-ink">
                          {selectedModule.copy}
                        </p>
                      </div>

                      <LessonGame
                        module={selectedModule}
                        gameStep={gameStep}
                        isComplete={isComplete}
                        switchboardGestures={switchboardGestures}
                        mailFeedback={mailFeedback}
                        mailIndex={mailIndex}
                        handledMail={handledMail}
                        emergencyExitUsed={emergencyExitUsed}
                        privacyAnswers={privacyAnswers}
                        curtainPulled={curtainPulled}
                        articlePage={articlePage}
                        adWarning={adWarning}
                        onSwitchboardGesture={handleSwitchboardGesture}
                        onMailChoice={handleMailChoice}
                        onNextMail={handleNextMail}
                        onMasterKeyChoice={handleMasterKeyChoice}
                        onPrivacyAnswer={handlePrivacyAnswer}
                        onCurtainPull={() => setCurtainPulled(true)}
                        onArticleNext={handleArticleNext}
                        onAdClick={handleAdClick}
                      />

                      <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-bold uppercase tracking-[0.12em] text-walnut">
                          {isComplete
                            ? `${selectedModule.badge} stamp earned`
                            : selectedModule.metaphor}
                        </p>
                        <div className="rounded-full border-2 border-bakelite bg-paper px-4 py-2 text-sm font-bold uppercase text-cherry">
                          Use the screen
                        </div>
                      </div>
                    </motion.article>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          <aside className="grid gap-5">
            <RemoteControl
              activeModule={activeModule}
              completedModules={mounted ? completedModules : []}
              dialRotation={dialRotation}
              onModuleChange={setActiveModule}
            />

            <ProgressWallet
              learnerName={mounted ? learnerName : ""}
              completedModules={mounted ? completedModules : []}
            />

            <section className="rounded border-2 border-walnut bg-bakelite p-4 text-paper shadow-[6px_6px_0_rgba(46,33,26,0.2)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mustard">
                Browser memory
              </p>
              <p className="mt-2 text-sm leading-6 text-paper/85">
                Progress stays on this device with localStorage. No account,
                password, or database is needed.
              </p>
            </section>

            <button
              type="button"
              onClick={resetProgress}
              className="h-11 rounded border-2 border-walnut bg-cream px-4 text-sm font-bold uppercase text-walnut transition hover:bg-paper"
            >
              Clear punch card
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}

function RemoteControl({
  activeModule,
  completedModules,
  dialRotation,
  onModuleChange
}: {
  activeModule: ModuleId;
  completedModules: ModuleId[];
  dialRotation: number;
  onModuleChange: (moduleId: ModuleId) => void;
}) {
  return (
    <section className="rounded-[2rem] border-4 border-bakelite bg-[#201715] p-4 text-paper shadow-cabinet">
      <div className="rounded-[1.4rem] border-2 border-paper/10 bg-gradient-to-b from-[#3b2a25] to-[#17110f] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-mustard">
              Remote
            </p>
            <p className="mt-1 text-sm text-paper/75">Point at the TV</p>
          </div>
          <div className="h-8 w-12 rounded-full border-2 border-cherry bg-cherry/70 shadow-inner" />
        </div>

        <div className="relative mx-auto mt-5 grid size-32 place-items-center rounded-full border-8 border-paper/15 bg-[#100c0b] shadow-inner">
          <motion.div
            className="absolute h-14 w-3 origin-bottom rounded-full bg-mustard"
            animate={{ rotate: dialRotation }}
            transition={{ type: "spring", stiffness: 170, damping: 18 }}
          />
          <div className="grid size-14 place-items-center rounded-full border-4 border-walnut bg-paper text-xs font-bold uppercase text-bakelite">
            Dial
          </div>
        </div>

        <nav className="mt-5 grid grid-cols-2 gap-2" aria-label="Remote channel buttons">
          {modules.map((module) => {
            const complete = completedModules.includes(module.id);
            const active = module.id === activeModule;

            return (
              <button
                key={module.id}
                type="button"
                onClick={() => onModuleChange(module.id)}
                className={`grid min-h-20 place-items-center rounded-full border-2 px-2 text-center transition ${
                  active
                    ? "border-mustard bg-mustard text-bakelite shadow-[0_0_0_4px_rgba(217,164,65,0.2)]"
                    : "border-paper/20 bg-paper/10 text-paper hover:bg-paper/20"
                }`}
              >
                <span className="text-lg font-bold">{complete ? "OK" : module.number}</span>
                <span className="text-[0.68rem] font-bold uppercase leading-tight">
                  {module.dialLabel}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              const index = modules.findIndex((module) => module.id === activeModule);
              const previous = modules[(index + modules.length - 1) % modules.length];
              onModuleChange(previous.id);
            }}
            className="h-12 rounded-full border-2 border-paper/25 bg-paper/10 font-bold uppercase text-paper transition hover:bg-paper/20"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => {
              const index = modules.findIndex((module) => module.id === activeModule);
              const next = modules[(index + 1) % modules.length];
              onModuleChange(next.id);
            }}
            className="h-12 rounded-full border-2 border-paper/25 bg-paper/10 font-bold uppercase text-paper transition hover:bg-paper/20"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

function SwitchboardGestureGame({
  completedGestures,
  isComplete,
  onGestureComplete
}: {
  completedGestures: GestureId[];
  isComplete: boolean;
  onGestureComplete: (gesture: GestureId) => void;
}) {
  const [swipeStart, setSwipeStart] = useState<number | null>(null);

  const gestureDone = (gesture: GestureId) =>
    isComplete || completedGestures.includes(gesture);

  return (
    <div className="mt-8 grid gap-4 rounded border-2 border-bakelite bg-paper/75 p-4 sm:grid-cols-3">
      <button
        type="button"
        onClick={() => onGestureComplete("tap")}
        className={`grid min-h-44 place-items-center rounded border-2 p-4 text-center transition ${
          gestureDone("tap")
            ? "border-cherry bg-mustard/40"
            : "border-walnut bg-cream hover:bg-mustard/20"
        }`}
      >
        <span
          className={`h-3 w-full rounded-full ${
            gestureDone("tap") ? "bg-cherry" : "bg-walnut/20"
          }`}
        />
        <span className="font-display text-3xl">Tap</span>
        <span className="text-sm font-bold uppercase text-walnut">
          {gestureDone("tap") ? "Line connected" : "Tap this plate"}
        </span>
      </button>

      <div
        role="button"
        tabIndex={0}
        onPointerDown={(event) => setSwipeStart(event.clientX)}
        onPointerCancel={() => setSwipeStart(null)}
        onPointerUp={(event) => {
          if (swipeStart === null) {
            return;
          }

          if (Math.abs(event.clientX - swipeStart) > 55) {
            onGestureComplete("swipe");
          }

          setSwipeStart(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            onGestureComplete("swipe");
          }
        }}
        className={`grid min-h-44 touch-pan-y place-items-center rounded border-2 p-4 text-center transition ${
          gestureDone("swipe")
            ? "border-cherry bg-mustard/40"
            : "border-walnut bg-cream"
        }`}
      >
        <span
          className={`h-3 w-full rounded-full ${
            gestureDone("swipe") ? "bg-cherry" : "bg-walnut/20"
          }`}
        />
        <span className="font-display text-3xl">Swipe</span>
        <span className="text-sm font-bold uppercase text-walnut">
          {gestureDone("swipe") ? "Line connected" : "Drag side to side"}
        </span>
      </div>

      <div
        onScroll={() => onGestureComplete("scroll")}
        onWheel={() => onGestureComplete("scroll")}
        className={`h-44 overflow-y-auto rounded border-2 p-4 text-center transition ${
          gestureDone("scroll")
            ? "border-cherry bg-mustard/40"
            : "border-walnut bg-cream"
        }`}
      >
        <div
          className={`h-3 w-full rounded-full ${
            gestureDone("scroll") ? "bg-cherry" : "bg-walnut/20"
          }`}
        />
        <div className="grid min-h-56 place-items-center">
          <span className="font-display text-3xl">Scroll</span>
          <span className="text-sm font-bold uppercase text-walnut">
            {gestureDone("scroll") ? "Line connected" : "Move this window"}
          </span>
          <span className="text-sm leading-6 text-walnut">
            Radio bulletin continued below the fold.
          </span>
          <span className="text-sm leading-6 text-walnut">
            Keep moving until the line clicks into place.
          </span>
        </div>
      </div>
    </div>
  );
}

function LessonGame({
  module,
  gameStep,
  isComplete,
  switchboardGestures,
  mailFeedback,
  mailIndex,
  handledMail,
  emergencyExitUsed,
  privacyAnswers,
  curtainPulled,
  articlePage,
  adWarning,
  onSwitchboardGesture,
  onMailChoice,
  onNextMail,
  onMasterKeyChoice,
  onPrivacyAnswer,
  onCurtainPull,
  onArticleNext,
  onAdClick
}: {
  module: LessonModule;
  gameStep: number;
  isComplete: boolean;
  switchboardGestures: GestureId[];
  mailFeedback: {
    kind: "success" | "failure";
    message: string;
  } | null;
  mailIndex: number;
  handledMail: number;
  emergencyExitUsed: boolean;
  privacyAnswers: Partial<Record<PrivacyItemId, PrivacyAnswer>>;
  curtainPulled: boolean;
  articlePage: number;
  adWarning: string | null;
  onSwitchboardGesture: (gesture: GestureId) => void;
  onMailChoice: (choice: MailChoice) => void;
  onNextMail: () => void;
  onMasterKeyChoice: () => void;
  onPrivacyAnswer: (itemId: PrivacyItemId, answer: PrivacyAnswer) => void;
  onCurtainPull: () => void;
  onArticleNext: () => void;
  onAdClick: () => void;
}) {
  if (module.id === "switchboard") {
    return (
      <SwitchboardGestureGame
        completedGestures={switchboardGestures}
        isComplete={isComplete}
        onGestureComplete={onSwitchboardGesture}
      />
    );
  }

  if (module.id === "watch") {
    return (
      <NeighborhoodWatchGame
        feedback={mailFeedback}
        handledMail={handledMail}
        isComplete={isComplete}
        scenario={mailScenarios[mailIndex]}
        onChoice={onMailChoice}
        onNextMail={onNextMail}
      />
    );
  }

  if (module.id === "emergency-exit") {
    return <EmergencyExitGame emergencyExitUsed={emergencyExitUsed} />;
  }

  if (module.id === "party-line") {
    return (
      <PartyLineGame
        answers={privacyAnswers}
        curtainPulled={curtainPulled}
        isComplete={isComplete}
        onAnswer={onPrivacyAnswer}
        onCurtainPull={onCurtainPull}
      />
    );
  }

  if (module.id === "snake-oil") {
    return (
      <SnakeOilGame
        adWarning={adWarning}
        articlePage={articlePage}
        isComplete={isComplete}
        onAdClick={onAdClick}
        onNext={onArticleNext}
      />
    );
  }

  return (
    <div className="mt-8 grid gap-4 rounded border-2 border-bakelite bg-paper/75 p-4 sm:grid-cols-3">
      {["Long", "Unique", "Private"].map((rule, index) => (
        <button
          type="button"
          key={rule}
          onClick={onMasterKeyChoice}
          className="grid min-h-36 place-items-center rounded border-2 border-walnut bg-cream p-4 text-center transition hover:bg-mustard/20 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isComplete || index !== gameStep}
        >
          <div
            className={`grid size-16 place-items-center rounded-full border-4 ${
              gameStep >= index || isComplete
                ? "border-cherry bg-mustard"
                : "border-walnut bg-paper"
            }`}
          >
            <span className="text-3xl">{gameStep >= index || isComplete ? "OK" : "?"}</span>
          </div>
          <span className="font-display text-3xl">{rule}</span>
        </button>
      ))}
    </div>
  );
}

function EmergencyExitGame({
  emergencyExitUsed
}: {
  emergencyExitUsed: boolean;
}) {
  if (emergencyExitUsed) {
    return (
      <div className="mt-8 rounded border-2 border-bakelite bg-paper/75 p-4">
        <div className="grid min-h-80 place-items-center rounded border-2 border-walnut bg-cream p-6 text-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cherry">
              Front Porch
            </p>
            <h3 className="mt-3 font-display text-5xl text-bakelite">
              Back Home
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-ink">
              You found the safe way back. When a screen feels too busy, Home is
              the reset switch.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded border-2 border-bakelite bg-paper/75 p-4">
      <div className="relative min-h-80 overflow-hidden rounded border-2 border-walnut bg-cream p-4">
        <div className="absolute left-5 top-5 w-64 rotate-[-2deg] border-2 border-bakelite bg-paper p-4 shadow-[5px_5px_0_rgba(46,33,26,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-cherry">
            Weather
          </p>
          <p className="mt-3 font-display text-3xl text-bakelite">Cloudy</p>
        </div>
        <div className="absolute right-8 top-12 w-72 rotate-[2deg] border-2 border-bakelite bg-mustard/40 p-4 shadow-[5px_5px_0_rgba(46,33,26,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-cherry">
            Pop-up
          </p>
          <p className="mt-3 text-lg font-bold text-bakelite">
            A new window opened.
          </p>
        </div>
        <div className="absolute bottom-8 left-16 w-80 rotate-[1deg] border-2 border-bakelite bg-robin/45 p-4 shadow-[5px_5px_0_rgba(46,33,26,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-cherry">
            Message
          </p>
          <p className="mt-3 text-lg leading-7 text-ink">
            Too many things are on the screen. Use the Home button on the TV
            frame.
          </p>
        </div>
        <div className="absolute bottom-14 right-10 w-56 rotate-[-3deg] border-2 border-bakelite bg-cherry/15 p-4 shadow-[5px_5px_0_rgba(46,33,26,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-cherry">
            Lost?
          </p>
          <p className="mt-3 font-display text-3xl text-bakelite">Find Home</p>
        </div>
      </div>
    </div>
  );
}

function PartyLineGame({
  answers,
  curtainPulled,
  isComplete,
  onAnswer,
  onCurtainPull
}: {
  answers: Partial<Record<PrivacyItemId, PrivacyAnswer>>;
  curtainPulled: boolean;
  isComplete: boolean;
  onAnswer: (itemId: PrivacyItemId, answer: PrivacyAnswer) => void;
  onCurtainPull: () => void;
}) {
  return (
    <div className="mt-8 grid gap-4 rounded border-2 border-bakelite bg-paper/75 p-4 lg:grid-cols-[1fr_18rem]">
      <section className="rounded border-2 border-walnut bg-cream p-5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-cherry">
          Public message board
        </p>
        <div className="mt-4 grid gap-3">
          <div className="rounded border-2 border-walnut bg-paper p-3">
            <p className="text-sm font-bold text-bakelite">Neighbor Pat</p>
            <p className="mt-1 text-sm leading-6 text-ink">
              Lovely weather today. What do you enjoy doing online?
            </p>
          </div>
          <div className="rounded border-2 border-cherry bg-cherry/10 p-3">
            <p className="text-sm font-bold text-bakelite">Unknown Visitor</p>
            <p className="mt-1 text-sm leading-6 text-ink">
              Before we chat, please post your phone number, address, and
              birthday here.
            </p>
          </div>
          <button
            type="button"
            onClick={onCurtainPull}
            disabled={curtainPulled || isComplete}
            className={`min-h-14 rounded border-2 border-bakelite px-4 text-left font-bold uppercase shadow-[4px_4px_0_rgba(46,33,26,0.25)] transition ${
              curtainPulled || isComplete
                ? "bg-mustard/40 text-bakelite"
                : "bg-cherry text-paper hover:-translate-y-0.5"
            }`}
          >
            {curtainPulled || isComplete ? "Curtain pulled" : "Pull the curtain"}
          </button>
        </div>
      </section>

      <aside className="grid gap-3">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-walnut">
          Safe to share?
        </p>
        {privacyItems.map((item) => {
          const selected = answers[item.id];
          const correct = selected === item.correctAnswer;

          return (
            <div
              key={item.id}
              className={`rounded border-2 p-3 ${
                correct
                  ? "border-walnut bg-mustard/30"
                  : "border-walnut bg-paper"
              }`}
            >
              <p className="font-bold text-bakelite">{item.label}</p>
              <p className="mt-1 text-sm text-walnut">{item.example}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["safe", "private"] as PrivacyAnswer[]).map((answer) => (
                  <button
                    key={answer}
                    type="button"
                    onClick={() => onAnswer(item.id, answer)}
                    disabled={isComplete}
                    className={`min-h-10 rounded border-2 px-2 text-xs font-bold uppercase transition ${
                      selected === answer
                        ? "border-cherry bg-cherry text-paper"
                        : "border-walnut bg-cream text-walnut hover:bg-mustard/20"
                    }`}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </aside>
    </div>
  );
}

function SnakeOilGame({
  adWarning,
  articlePage,
  isComplete,
  onAdClick,
  onNext
}: {
  adWarning: string | null;
  articlePage: number;
  isComplete: boolean;
  onAdClick: () => void;
  onNext: () => void;
}) {
  const pages = [
    {
      title: "How to Read a Page",
      body: "Look for steady navigation. Real buttons usually sit near the article and use plain words."
    },
    {
      title: "Ignore the Shouting",
      body: "Flashing prizes and countdowns are trying to hurry you. Slow reading is safer reading."
    },
    {
      title: "Find the Real Path",
      body: "The safe way forward is the simple Next button at the bottom of the article."
    }
  ];
  const currentPage = pages[articlePage] ?? pages[pages.length - 1];

  return (
    <div className="mt-8 rounded border-2 border-bakelite bg-paper/75 p-4">
      <div className="grid gap-4 rounded border-2 border-walnut bg-cream p-5 lg:grid-cols-[1fr_16rem]">
        <article className="min-h-80">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-cherry">
            Magazine page {Math.min(articlePage + 1, pages.length)} / {pages.length}
          </p>
          <h3 className="mt-3 font-display text-4xl leading-tight text-bakelite">
            {isComplete ? "Article finished safely" : currentPage.title}
          </h3>
          <p className="mt-4 text-lg leading-8 text-ink">
            {isComplete
              ? "You reached the end without buying the snake oil. The plain button was the right trail."
              : currentPage.body}
          </p>
          <button
            type="button"
            onClick={onNext}
            disabled={isComplete}
            className="mt-8 min-h-12 rounded border-2 border-bakelite bg-robin px-5 font-bold uppercase text-bakelite shadow-[4px_4px_0_rgba(46,33,26,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {articlePage >= 2 ? "Finish article" : "Next"}
          </button>
        </article>

        <aside className="grid gap-3">
          <button
            type="button"
            onClick={onAdClick}
            disabled={isComplete}
            className="min-h-28 rounded border-4 border-cherry bg-mustard p-4 text-center font-display text-3xl leading-tight text-bakelite shadow-[5px_5px_0_rgba(46,33,26,0.3)] transition hover:rotate-1 disabled:opacity-60"
          >
            Winner! Click now!
          </button>
          <button
            type="button"
            onClick={onAdClick}
            disabled={isComplete}
            className="min-h-20 rounded border-2 border-bakelite bg-cherry px-4 font-bold uppercase text-paper transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            Limited time offer
          </button>
          {adWarning ? (
            <div className="rounded border-2 border-cherry bg-cherry/10 p-3">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-cherry">
                Nice pause
              </p>
              <p className="mt-2 text-sm leading-6 text-ink">{adWarning}</p>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function NeighborhoodWatchGame({
  feedback,
  handledMail,
  isComplete,
  scenario,
  onChoice,
  onNextMail
}: {
  feedback: {
    kind: "success" | "failure";
    message: string;
  } | null;
  handledMail: number;
  isComplete: boolean;
  scenario: MailScenario;
  onChoice: (choice: MailChoice) => void;
  onNextMail: () => void;
}) {
  const choices: Array<{ id: MailChoice; label: string }> = [
    { id: "open", label: "Open it" },
    { id: "check", label: "Check it first" },
    { id: "ask", label: "Ask someone trusted" },
    { id: "report", label: "Ignore/report" }
  ];

  return (
    <div className="mt-8 grid gap-4 rounded border-2 border-bakelite bg-paper/75 p-4 lg:grid-cols-[1fr_18rem]">
      <article className="rounded border-2 border-walnut bg-cream p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-walnut/30 pb-3">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-cherry">
            Mail item
          </p>
          <p className="rounded-full border-2 border-walnut bg-paper px-3 py-1 text-sm font-bold text-walnut">
            {Math.min(handledMail, 3)} / 3 safe calls
          </p>
        </div>
        <dl className="mt-4 grid gap-3 text-left">
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">
              From
            </dt>
            <dd className="mt-1 text-lg font-bold text-bakelite">{scenario.from}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">
              Subject
            </dt>
            <dd className="mt-1 font-display text-3xl leading-tight text-bakelite">
              {scenario.subject}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">
              Message
            </dt>
            <dd className="mt-2 text-base leading-7 text-ink">{scenario.body}</dd>
          </div>
        </dl>
      </article>

      <aside className="grid gap-3">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-walnut">
          What should you do?
        </p>
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            disabled={isComplete || feedback?.kind === "success"}
            onClick={() => onChoice(choice.id)}
            className="min-h-14 rounded border-2 border-bakelite bg-paper px-4 text-left font-bold uppercase text-bakelite shadow-[4px_4px_0_rgba(46,33,26,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {choice.label}
          </button>
        ))}

        {feedback ? (
          <div
            className={`rounded border-2 p-4 ${
              feedback.kind === "success"
                ? "border-walnut bg-mustard/35"
                : "border-cherry bg-cherry/10"
            }`}
          >
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-cherry">
              {feedback.kind === "success" ? "Good sorting" : "Try again"}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink">{feedback.message}</p>
            <button
              type="button"
              onClick={onNextMail}
              className="mt-4 h-11 w-full rounded border-2 border-bakelite bg-cherry px-4 font-bold uppercase text-paper transition hover:bg-walnut"
            >
              Next letter
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function ProgressWallet({
  learnerName,
  completedModules
}: {
  learnerName: string;
  completedModules: ModuleId[];
}) {
  return (
    <section className="paper-texture rounded border-2 border-walnut bg-paper p-5 shadow-[6px_6px_0_rgba(46,33,26,0.2)]">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-cherry">
        Punch card
      </p>
      <h2 className="mt-2 font-display text-3xl text-bakelite">
        {learnerName.trim() || "Guest Learner"}
      </h2>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {modules.map((module) => {
          const complete = completedModules.includes(module.id);

          return (
            <div
              key={module.id}
              className={`grid aspect-square place-items-center rounded-full border-2 text-center font-bold ${
                complete
                  ? "border-cherry bg-cherry text-paper"
                  : "border-dashed border-walnut/45 bg-cream text-walnut"
              }`}
            >
              {complete ? "PUNCHED" : module.number}
            </div>
          );
        })}
      </div>
      <div className="mt-5 grid gap-2">
        {modules.map((module) => {
          const complete = completedModules.includes(module.id);

          return (
            <div
              key={module.id}
              className="flex items-center justify-between gap-3 border-t border-walnut/20 pt-2 text-sm"
            >
              <span className="font-bold text-bakelite">{module.badge}</span>
              <span className={complete ? "text-cherry" : "text-walnut/60"}>
                {complete ? "Stamped" : module.number}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
