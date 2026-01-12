const Home = (props: Props) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <main className="flex flex-1 flex-col items-center px-6 pb-16">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">

          <h2 className="max-w-3xl text-2xl font-semibold text-gray-700 dark:text-gray-200">
            In-Accord is the The Premier Discord customization and management suite for thriving communities.
          </h2>
          <p className="max-w-3xl text-base font-medium text-gray-600 dark:text-gray-300">
            A standalone program that automates installation, removal, and maintenance for In-Accord — the Discord client customization experience. Launch curated extensions, keep plugins patched, and streamline operations with zero guesswork.
          </p>
          <p className="max-w-3xl text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Crafted and maintained by industry veterans — built on the final open branch of GooseMod for modern operators.
          </p>

          <img
            src="https://pub-7d4119dd86a04c7bbdbcc230a9d161e7.r2.dev/Images/In-Accord%20working.png"
            alt="In-Accord application preview"
            className="h-[8rem] w-auto rounded-1xl border border-gray-200 bg-white shadow-lg transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white/80 px-6 py-10 text-sm text-gray-600 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 text-center md:max-w-sm md:text-left">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">In-Accord</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The control hub for Discord operators who need reliable automation, modular theming, and deeply integrated workflows every day.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">© {currentYear} In-Accord · Powered by GARD Realms LLC.</p>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-8 text-center text-sm sm:grid-cols-2 md:grid-cols-3 md:text-left">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Product</h4>
              <nav className="flex flex-col gap-1">
                <a href="/dashboard" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">Dashboard</a>
                <a href="/themes" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">Themes</a>
                <a href="/plugins" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">Plugins</a>
              </nav>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Community</h4>
              <nav className="flex flex-col gap-1">
                <a href="https://discord.com" target="_blank" rel="noreferrer" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">Join our Discord</a>
                <a href="/support" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">Support hub</a>
                <a href="/uploads" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">Media library</a>
              </nav>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Stay connected</h4>
              <nav className="flex flex-col gap-1">
                <a href="mailto:hello@in-accord.app" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">hello@in-accord.app</a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">GitHub</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">LinkedIn</a>
              </nav>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl text-center text-xs text-gray-500 dark:text-gray-500">
          <p>
            Need a hand? Visit the{' '}
            <a
              href="/support"
              className="font-medium text-indigo-600 underline-offset-2 hover:text-indigo-500 hover:underline dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              support center
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home

