import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "domain", pattern: "lib/domain/**/*" },
        { type: "application", pattern: "lib/application/**/*" },
        { type: "infrastructure", pattern: "lib/infrastructure/**/*" },
        { type: "components", pattern: "components/**/*" },
      ],
      "boundaries/ignore": ["**/*.test.*", "**/*.spec.*"],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            {
              from: { element: { type: "domain" } },
              disallow: [
                { to: { element: { type: "infrastructure" } } },
                { to: { element: { type: "components" } } },
                { to: { element: { type: "application" } } },
              ],
            },
            {
              from: { element: { type: "components" } },
              disallow: [{ to: { element: { type: "infrastructure" } } }],
            },
            {
              from: { element: { type: "application" } },
              disallow: [
                { to: { element: { type: "infrastructure" } } },
                { to: { element: { type: "components" } } },
              ],
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
