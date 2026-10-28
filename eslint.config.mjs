import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Layer rules. Dependencies point inward:
 *
 *   app/ (interfaces)  → everything
 *   components/         → lib/domain, lib/ui
 *   lib/ui/             → lib/domain
 *   lib/infrastructure/ → lib/domain, lib/ui
 *   lib/application/    → lib/domain
 *   lib/domain/         → nothing outside itself
 *
 * Enforced with `no-restricted-imports` because the project imports through
 * the `@/` alias, which the boundaries plugin cannot resolve.
 */
const layerRules = [
  {
    files: ["lib/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/lib/application/*",
                "@/lib/infrastructure/*",
                "@/lib/ui/*",
                "@/components/*",
                "@/app/*",
              ],
              message:
                "El dominio no depende de otras capas: la dependencia apunta hacia adentro.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["lib/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/infrastructure/*", "@/components/*"],
              message:
                "La capa de aplicación depende de puertos del dominio, no de infraestructura.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["lib/infrastructure/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/*"],
              message:
                "Infraestructura no conoce los componentes: los datos viajan como VOs.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["lib/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/*", "@/lib/infrastructure/*"],
              message:
                "El kernel de UI depende solo del dominio; el copy no conoce el transporte.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/infrastructure/*", "@/lib/application/*"],
              message:
                "Los componentes son presentacionales: reciben VOs del dominio y emiten eventos.",
            },
          ],
        },
      ],
    },
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...layerRules,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
