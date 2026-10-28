<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Convenciones del repo (VotaChain frontend)

### Idioma

- **Identificadores en inglés** (lenguaje ubicuo del dominio): `VoteAuthorization`,
  `VoterReceipt`, `EligibilitySnapshot`, `CastVoteCommand`, `Membership`…
  Ni props, ni tipos, ni nombres de archivo ni de función van en español.
- **Copy visible en español es-PE** (tratamiento de *usted*, sobrio, sin tecnicismos)
  y vive **solo** en `lib/ui/copy.ts`. Los componentes no inventan strings de
  negocio.

### Capas (las dependencias apuntan hacia adentro)

```
app/ (interfaces)   → puede usar todo; es donde se cablea puerto + servicio
components/         → lib/domain, lib/ui        (presentacional: props in, eventos out)
lib/ui/             → lib/domain                 (copy y proyección visual)
lib/infrastructure/ → lib/domain, lib/ui         (DTOs, HTTP, mappers)
lib/application/    → lib/domain                 (servicios; conocen puertos, no HTTP)
lib/domain/         → nada                        (puro: sin next, react, fetch)
```

Las reglas se **verifican** con `no-restricted-imports` en `eslint.config.mjs`.
Un puerto se declara en `lib/domain/**/ports.ts` y lo implementa
`lib/infrastructure/api/`. El composition root es
`lib/infrastructure/api/composition.ts`.

### Atomic Design

- `components/atoms/` (<50 líneas) · `components/molecules/` (<100) ·
  `components/organisms/` (1 área funcional) · `components/templates/` (slots).
- **Importar por ruta directa** (`@/components/atoms/Button`). No hay barrels:
  re-exportar un componente `"use client"` desde un index rompe los Server
  Components.
- Todo elemento interactivo traza a un átomo. 0 `fetch` en componentes.
- Los valores visuales salen de tokens (`app/globals.css` `@theme`); 0 hex y 0
  valores arbitrarios fuera de `@theme`.

### Dominio

- Zod valida en `lib/domain`, nunca en JSX.
- Los estados inválidos son irrepresentables (p. ej. un recibo `CONFIRMED`
  siempre lleva su hash; solo un `CONFIRMED` puede llevarlo).
- Nada de `localStorage` ni secretos en cliente: la sesión va en cookie
  `httpOnly`.

### Verificación antes de entregar

```bash
pnpm lint && pnpm test && pnpm build
```
