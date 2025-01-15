import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Warn instead of error for 'any'
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }, // Ignore prefixed with '_'
      ],
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off", // Disable optional chain rule
      "react/jsx-no-undef": "error", // Prevent undefined JSX elements
      "react/react-in-jsx-scope": "off", // For Next.js projects, React is globally available
      "no-console": ["warn", { allow: ["warn", "error"] }], // Allow `console.warn` and `console.error`
    },
  },
];

export default eslintConfig;
