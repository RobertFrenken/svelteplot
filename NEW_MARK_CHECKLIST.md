# New Mark Checklist

Exhaustive checklist for adding a new mark to svelteplot. Follow in order — later steps depend on earlier ones.

> **Layout note:** the library was extracted into a monorepo (commit `3a1d5205`).
> Library code lives under `packages/svelteplot/src/...`; the showcase site
> (routes, snapshots, examples) stayed at the repo root. Paths below reflect
> the monorepo layout.

## Source & Types

- [ ] Component source (`packages/svelteplot/src/marks/NewMark.svelte`)
- [ ] Props interface with TypeScript generics (`<Datum extends DataRecord>`)
- [ ] JSDoc `<!-- @component -->` comment describing the mark
- [ ] MarkType addition (`packages/svelteplot/src/types/mark.ts`)
- [ ] PlotDefaults type entry (`packages/svelteplot/src/types/plot.ts`)
- [ ] PlotDefaults hook call (`getPlotDefaults().markName` in component)

## Exports

- [ ] Barrel export (`packages/svelteplot/src/marks/index.ts`)
- [ ] Verify top-level re-export (`packages/svelteplot/src/index.ts` — auto via `export * from './marks/index.js'`)
- [ ] Verify package exports (auto via `./marks/*.svelte` wildcard pattern in `packages/svelteplot/package.json`)

## Documentation

- [ ] Docs page (`src/routes/marks/<name>/+page.md`)
- [ ] Docs data loader (`src/routes/marks/<name>/+page.ts`)
- [ ] Live code examples (` ```svelte live ` blocks in the docs page)
- [ ] Sidebar entry (`config/sidebar.ts`)
- [ ] Regenerate API reference (`pnpm docs:api:marks` via `scripts/generate-api.js`)
- [ ] Update API anchor links (jump-to links at top of `src/routes/api/marks/+page.md`)

## Testing

- [ ] Unit test fixture (`packages/svelteplot/tests/<mark>.test.svelte`)
- [ ] Unit test driver (`packages/svelteplot/tests/<mark>.test.svelte.ts`)
- [ ] Cover: rendering, default styling, custom styling, channel mapping, CSS class, empty data, single point, invalid coords, accessor functions
- [ ] Cover mark-specific behavior (e.g. grouping for Hull, per-element events for interactive marks, alignment for paired marks)

## Examples & Visual Regression

- [ ] Examples gallery (`src/routes/examples/<name>/*.svelte`)
- [ ] Example frontmatter in each `.svelte` file (title, description, sortKey)
- [ ] Generate VR baselines (`pnpm test:visual` — uses Puppeteer via `scripts/visual-regression.js`)
- [ ] Dark mode snapshots (auto-generated as `.dark.png` alongside each `.png`)
- [ ] Snapshot directory (`src/snapshots/<name>/`)

## Optional / As Applicable

- [ ] Canvas rendering variant (e.g. `DotCanvas.svelte` under `packages/svelteplot/src/marks/helpers/`)
- [ ] Event handler support (`addEventHandlers` from `packages/svelteplot/src/marks/helpers/events.js`)
- [ ] Accessibility attributes (`role="button"` when onclick provided, ARIA labels)

## Notes

- Examples are auto-discovered via `import.meta.glob('./**/*.svelte')` in `src/routes/examples/+page.svelte` — no manual registration needed.
- VR screenshots are 600px wide at 2x DPR, taken in both light and dark mode.
- API reference is auto-generated from TypeScript interfaces in `.svelte` files.
- PlotDefaults enable `setPlotDefaults()` to configure mark defaults at any level in the component tree.
- For marks that are designed to pair with another (e.g. Hexbin + Hexgrid, Density + Frame), add a sub-pixel center-alignment test that parses the rendered SVG `<path>` `d` attributes from both marks. Visual screenshots can hide small offsets that test extraction will catch immediately.
