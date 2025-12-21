/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
  trailingComma: "es5",
  printWidth: 80,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
  // Tailwind CSS class sorting
  tailwindFunctions: ["cn", "clsx", "cva"],
};

export default config;
