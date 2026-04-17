import Link from "next/link";

const coreFeatures = [
  "Enter your name on a simple name card.",
  "Change lesson channels with a TV remote.",
  "See lesson progress on a punch card.",
  "Earn a stamp after completing each lesson.",
  "Clear the punch card and start again."
];

const channels = [
  {
    number: "01",
    title: "Touch Gestures",
    badge: "Operator",
    features: [
      "Tap a target on the TV screen.",
      "Swipe side to side on the TV screen.",
      "Scroll inside a small TV-screen window."
    ]
  },
  {
    number: "02",
    title: "Scam And Mail Safety",
    badge: "Watch Captain",
    features: [
      "Read one mail item at a time.",
      "Choose whether to open it, check it first, ask someone trusted, or ignore/report it.",
      "Try again after an unsafe choice."
    ]
  },
  {
    number: "03",
    title: "Passwords And Privacy",
    badge: "Key Keeper",
    features: [
      "Choose password safety ideas on the TV screen.",
      "Learn that good passwords are long, unique, and private."
    ]
  },
  {
    number: "04",
    title: "The Emergency Exit",
    badge: "Home Finder",
    features: [
      "Observe a cluttered screen.",
      "Press the physical-looking Home button on the TV frame.",
      "Return safely to the Front Porch."
    ]
  },
  {
    number: "05",
    title: "The Party Line",
    badge: "Curtain Puller",
    features: [
      "View a simulated public message board.",
      "Sort personal details as safe or private.",
      "Pull the curtain when a stranger asks for private information."
    ]
  },
  {
    number: "06",
    title: "The Snake Oil",
    badge: "Ad Spotter",
    features: [
      "Read a vintage-style magazine page.",
      "Avoid flashy Winner advertisements.",
      "Use the real Next button to finish the article."
    ]
  }
];

const futureIdeas = [
  "Video call manners and mute controls.",
  "Photo sharing and permission checks.",
  "App store download safety.",
  "Maps, location sharing, and getting home.",
  "Two-factor codes and login prompts.",
  "Software updates and trusted notifications."
];

const themePages = [
  {
    href: "/rotary-phone",
    title: "Mystery Caller",
    theme: "Rotary phone desk",
    description:
      "Practice safe responses when a caller asks for codes, money, screen access, or private details."
  }
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen px-4 py-5 font-mono sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-7xl gap-6">
        <header className="border-b-2 border-dashed border-walnut/35 pb-5">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded border-2 border-walnut bg-paper px-4 text-sm font-bold uppercase text-walnut shadow-[4px_4px_0_rgba(46,33,26,0.18)] transition hover:-translate-y-0.5"
          >
            Back to TV
          </Link>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.28em] text-cherry">
            Lesson index
          </p>
          <h1 className="mt-2 font-display text-5xl leading-none text-bakelite sm:text-6xl lg:text-7xl">
            Feature Catalog
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-ink">
            A separate shelf for current and future lessons, so the remote can
            stay simple and only change channels.
          </p>
        </header>

        <section className="grid gap-4 rounded-[1.5rem] border-4 border-bakelite bg-wood p-4 shadow-cabinet">
          <div className="paper-texture rounded border-2 border-bakelite bg-paper p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cherry">
              Current use cases
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {coreFeatures.map((feature) => (
                <div
                  key={feature}
                  className="min-h-28 rounded border-2 border-walnut bg-cream p-4 text-sm font-bold leading-6 text-bakelite"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {channels.map((channel) => (
            <article
              key={channel.number}
              className="paper-texture rounded border-2 border-walnut bg-paper p-5 shadow-[6px_6px_0_rgba(46,33,26,0.2)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-cherry">
                    Channel {channel.number}
                  </p>
                  <h2 className="mt-2 font-display text-3xl leading-tight text-bakelite">
                    {channel.title}
                  </h2>
                </div>
                <span className="rounded-full border-2 border-bakelite bg-mustard px-3 py-1 text-xs font-bold uppercase text-bakelite">
                  {channel.badge}
                </span>
              </div>
              <ul className="mt-5 grid gap-3">
                {channel.features.map((feature) => (
                  <li
                    key={feature}
                    className="border-t border-walnut/20 pt-3 text-sm leading-6 text-ink"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="paper-texture rounded border-2 border-walnut bg-paper p-5 shadow-[6px_6px_0_rgba(46,33,26,0.2)]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cherry">
            Future shelf
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {futureIdeas.map((idea) => (
              <div
                key={idea}
                className="rounded border-2 border-dashed border-walnut/45 bg-cream p-4 text-sm font-bold leading-6 text-walnut"
              >
                {idea}
              </div>
            ))}
          </div>
        </section>

        <section className="paper-texture rounded border-2 border-walnut bg-paper p-5 shadow-[6px_6px_0_rgba(46,33,26,0.2)]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cherry">
            Other retro rooms
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {themePages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="rounded border-2 border-walnut bg-cream p-4 text-walnut shadow-[4px_4px_0_rgba(46,33,26,0.14)] transition hover:-translate-y-0.5"
              >
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-cherry">
                  {page.theme}
                </span>
                <span className="mt-2 block font-display text-3xl text-bakelite">
                  {page.title}
                </span>
                <span className="mt-3 block text-sm leading-6">
                  {page.description}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
