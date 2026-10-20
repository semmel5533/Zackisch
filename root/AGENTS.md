# Root marketing site — agent rules

Prioritize the German owner decision journey: what Zackisch is, why the existing POS remains, how DIY onboarding works, compatible personal devices, cost/third-party fees, prerequisites, examples, and registration. Include real licensed photography of diverse hospitality contexts with documented asset provenance and descriptive alt text. Never fabricate testimonials or performance statistics; do not copy competitors' layouts. All visible language and regional links use consistent locale paths (`/de-de` and `/de-en`). Static routes `/de-de` and `/de-en` need canonical, hreflang, sitemap, noindex for private paths and accurate legal disclosure. Only mention completed product features on live copy. Test build, 320px/mobile, keyboard, contrast, reduced motion and link integrity.

## Strict Technical Guardrails
1. **Zero Backend Coupling:** The marketing website is completely decoupled from Convex and Stripe client SDKs. Do NOT install `@convex-dev/*`, `convex`, or `@stripe/*` in `root/package.json`.
2. **Calculator Model v3:** Only modify `lib/calculator.ts` with explicit reference to `docs/CALCULATOR_MODEL_SPEC.md`. Labor cost savings must remain permanently 0,00 €.
3. **No AI-Generated Media:** Use only curated, verified hospitality photography listed in `docs/MEDIA_LICENSES.md`. Never prompt or generate synthetic portraits or dish images.
4. **Legal Disclosures:** Follow `docs/LAUNCH_BLOCKERS.md` and keep pending legal data clearly designated as drafts awaiting official registration.
5. **Git & Commit Conventions:** Use lowercase English technical commit messages, past tense, joined with `and`, authored by `Selim Eser <semmel5533@gmail.com>`. Never push or deploy without explicit user confirmation.

<!-- ASTRYX:START -->
Astryx v0.7.1 · 168 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — start every page from a template, never from scratch:
1. `astryx build "<idea>"` — names the template to scaffold from and the parts it lacks.
2. `astryx template <name> <path>` — scaffold it; keep its frame, gap and padding; replace the content.
3. `astryx template <Block>` for parts it lacks; `astryx component <Name>` to read props before using one.
Changing an existing page? Keep it: skip step 2 and add blocks/components inside its sections.

RULES:
- No <div> — components handle all layout and spacing.
- Read `astryx docs layout` before changing a template's frame.
- Dense data = rows (Table, List/Item), not Card-wrapped lists. Badge = counts only.
- Style with component props first, then Tailwind utilities backed by tokens. No raw hex/px.
- Palettes and custom colors go through the theme, never :root overrides. Run `astryx theme add <slug>` to import; `theme eject <slug>` only forks source. See `astryx docs theme`.
- SELF-CHECK: re-read the file; replace any style={{…}}, raw <div>/<span>, imported .css/@apply, or hardcoded/arbitrary value (bg-[#fff], p-[13px]) with the component or a token-backed utility.

`astryx help` lists every command. Key ones beyond the workflow:
  search "<query>"   find any component / hook / doc / template
  discover <words>   integrations you could add
  docs <topic>       getting-started, principles, tokens, theme … (`astryx docs` lists all)
  docs cli           commands, API reference, integration authoring
  upgrade --from <old version> --apply   run after a dependency bump
<!-- ASTRYX:END -->
