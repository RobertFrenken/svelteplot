# New Mark Checklist

Exhaustive checklist for adding a new mark to svelteplot. Follow in order — later steps depend on earlier ones.

## Source & Types

- [ ] Component source (`src/lib/marks/NewMark.svelte`)
- [ ] Props interface with TypeScript generics
- [ ] JSDoc `<!-- @component -->` comment describing the mark
- [ ] MarkType addition (`src/lib/types/mark.ts`)
- [ ] PlotDefaults type entry (`src/lib/types/plot.ts`)
- [ ] PlotDefaults hook call (`getPlotDefaults().markName` in component)

## Exports

- [ ] Barrel export (`src/lib/marks/index.ts`)
- [ ] Verify top-level re-export (`src/lib/index.ts` — auto via `export * from './marks/index.js'`)
- [ ] Verify package.json exports (auto via `./marks/*.svelte` wildcard pattern)

## Documentation

- [ ] Docs page (`src/routes/marks/<name>/+page.md`)
- [ ] Docs data loader (`src/routes/marks/<name>/+page.ts`)
- [ ] Live code examples (`` ```svelte live `` blocks in the docs page)
- [ ] Sidebar entry (`config/sidebar.ts`)
- [ ] Regenerate API reference (`pnpm docs:api:marks` via `scripts/generate-api.js`)
- [ ] Update API anchor links (jump-to links at top of `src/routes/api/marks/+page.md`)

## Testing

- [ ] Unit test fixture (`src/tests/<mark>.test.svelte`)
- [ ] Unit test driver (`src/tests/<mark>.test.svelte.ts`)
- [ ] Cover: rendering, default styling, custom styling, channel mapping, CSS class, empty data, single point, invalid coords, accessor functions
- [ ] Cover mark-specific behavior (e.g. grouping for Hull, per-element events for interactive marks)

## Examples & Visual Regression

- [ ] Examples gallery (`src/routes/examples/<name>/*.svelte`)
- [ ] Example frontmatter in each `.svelte` file (title, description, sortKey)
- [ ] Generate VR baselines (`pnpm test:visual` — uses Puppeteer via `scripts/visual-regression.js`)
- [ ] Dark mode snapshots (auto-generated as `.dark.png` alongside each `.png`)
- [ ] Snapshot directory (`src/snapshots/<name>/`)

## Optional / As Applicable

- [ ] Canvas rendering variant (e.g. `DotCanvas.svelte`)
- [ ] Event handler support (`addEventHandlers` from `marks/helpers/events.js`)
- [ ] Accessibility attributes (`role="button"` when onclick provided, ARIA labels)

## Notes

- Examples are auto-discovered via `import.meta.glob('./**/*.svelte')` in `src/routes/examples/+page.svelte` — no manual registration needed.
- VR screenshots are 600px wide at 2x DPR, taken in both light and dark mode.
- API reference is auto-generated from TypeScript interfaces in `.svelte` files.
- PlotDefaults enable `setPlotDefaults()` to configure mark defaults at any level in the component tree.
