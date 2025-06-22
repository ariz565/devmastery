import AuthNavbar from "./components/AuthNavbar";

export default {
  titleSuffix: "DevMastery - Code, Learn, Grow",
  search: {
    placeholder: "Search DevMastery...",
  },
  unstable_flexsearch: true,
  unstable_staticImage: true,
  floatTOC: true,
  font: false,
  github: "https://github.com/devmastery/devmastery-platform",
  projectLink: "https://github.com/devmastery/devmastery-platform",
  navbar: {
    extraContent: () => <AuthNavbar />,
  },
  logo: () => (
    <>
      <img
        src="/logo.svg"
        height="25"
        width="25"
        style={{ marginRight: "1em" }}
      />
      <h1>
        DevMastery <span style={{ opacity: 0.6, fontSize: "0.8em" }}>Pro</span>
      </h1>
    </>
  ),
  head: function Head(props) {
    return (
      <>
        <meta charset="utf-8" />
        <meta name="theme-color" content="#000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/javascript.svg" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/javascript.svg"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/javascript.svg"
        />
        <link rel="mask-icon" href="/javascript.svg" color="#000000" />
        <link rel="shortcut icon" href="/javascript.svg" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="description"
          content="DevMastery - Your ultimate platform for coding tutorials, blog posts, and technical interview preparation"
        />
        <meta
          name="description"
          content="DevMastery - Your ultimate platform for coding tutorials, blog posts, and technical interview preparation"
        />
        <meta name="author" content="DevMastery Team" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="692" />
        <meta property="og:title" content={`${props.title} | DevMastery`} />
        <meta
          property="og:description"
          content="DevMastery - Your ultimate platform for coding tutorials, blog posts, and technical interview preparation"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@devmastery" />
        <meta name="twitter:creator" content="@devmastery" />
      </>
    );
  },
  darkMode: true,
  footer: {
    text: (
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.svg"
                height="20"
                width="20"
                alt="DevMastery Logo"
              />
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                DevMastery
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Empowering developers through knowledge sharing
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
            <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <a
                href="/admin"
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Admin
              </a>
              <a
                href="/about"
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                About
              </a>
              <a
                href="/contact"
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Contact
              </a>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} DevMastery. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    ),
  },
  nextThemes: {
    defaultTheme: "dark",
  },
  sidebar: {
    toggleButton: true,
  },
};
