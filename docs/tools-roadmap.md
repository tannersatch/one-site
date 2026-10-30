# Developer Tools Roadmap

Implement one tool per increment. After each increment, run its tests, formatting,
production build, and desktop/mobile browser checks. Stop for review and a user
commit before starting the next increment. Do not commit automatically.

| Increment | Tool                   | Scope                                                                   | Status                         |
| --------- | ---------------------- | ----------------------------------------------------------------------- | ------------------------------ |
| 1         | JSON formatter         | Strict validation, format/minify, indentation, copy, lossless numbers   | Committed                      |
| 2         | SQL formatter          | SQL dialect selection, format, copy, examples                           | Committed                      |
| 3         | JSON to TypeScript     | Root type name, nested objects/arrays, generated types, copy            | Committed                      |
| 4         | JSON / YAML converter  | Both directions, parser errors, copy; document YAML-to-JSON limitations | Committed                      |
| 5         | Unix timestamp         | Seconds/milliseconds, UTC/local dates, current time, copy               | Committed                      |
| 6         | Markdown previewer     | Live preview, sanitized HTML, safe external links                       | Committed                      |
| 7         | Diff checker           | Two inputs, line/word changes, whitespace options                       | Committed                      |
| 8         | Regex tester           | Flags, matches/groups, invalid expressions, worker timeout              | Complete; awaiting user commit |
| 9         | CSS gradient generator | Linear/radial/mesh modes, editable colors, opacity, presets, CSS        | Complete; awaiting user commit |

## Shared Conventions

- Register completed tools in `app/data/tools.ts`; it powers the directory and
  desktop/mobile navigation. Do not register unimplemented routes.
- Use Nuxt UI, existing theme tokens, and ordinary scoped CSS. No Tailwind utility
  classes in application templates.
- Reuse `ToolPage`, `ToolToolbar`, `CopyButton`, and `ToolTextEditor` where suitable.
- Keep processing local; do not persist pasted input or secrets.
- Prefer established libraries for SQL formatting, type generation, YAML,
  Markdown/sanitization, and diffing. Use native JSON/Date/RegExp APIs where safe.
- Keep dependencies and refactors confined to the active increment.
- Tests use Node's built-in runner: `pnpm test`.

## Increment 1 Acceptance Checks

- Accept every JSON root value; reject comments, trailing commas, and extra roots.
- Preserve number lexemes and string content when formatting or minifying.
- Offer two spaces, four spaces, and tabs; show useful line/column errors.
- Invalid or cleared input must not leave stale output available for copying.
- Verify clipboard actions, directory/navigation registration, both themes, and
  phone/desktop layouts.

## Increment 2 Acceptance Checks

- Support Standard SQL, PostgreSQL, MySQL, SQL Server, SQLite, and BigQuery.
- Offer uppercase, lowercase, and preserved keyword case without changing literals
  or identifiers; offer two spaces, four spaces, and tabs.
- Preserve comments, quoted identifiers, numeric literals, and placeholders.
- Include a matching example for each dialect; changing options must not overwrite
  pasted input.
- Formatting errors and cleared input must remove stale output and disable copying.
- Formatting must not execute SQL or claim semantic validation.
- Verify clipboard actions, directory/mobile navigation registration, both themes,
  and responsive layouts. Run SQL and JSON tests together before the commit pause.

## Increment 3 Acceptance Checks

- Infer nested objects, optional array-item properties, unions, nulls, and empty
  arrays using an established inference library; retain JSON strings as strings.
- Preserve the root JSON shape, including arrays and primitives. Expose a named
  exported root alias with namespaced inferred definitions to avoid collisions.
- Validate root names and strict JSON with useful error locations.
- Generate types only, without runtime converters, and load the engine on demand.
- Debounce editing and ignore stale generation results; clearing or invalid input
  must remove old output and disable copying.
- Verify clipboard actions, directory/mobile registration, both themes, and
  responsive layouts; run inference, JSON, and SQL tests before pausing for commit.

## Increment 4 Acceptance Checks

- Convert in both directions using YAML 1.2 core schema and strict JSON parsing.
- Preserve nested values, root scalars/collections, and arbitrarily large integer
  values. Fractional numbers use JavaScript precision; non-finite/out-of-range
  floating-point values are rejected.
- Expand aliases and merge keys with an alias-expansion limit of 100; reject cycles,
  non-string mapping keys, unsupported tags/value types, and duplicate keys.
- Accept one document only; reject explicit YAML 1.1 documents.
- Document that comments, scalar styles, and anchor names are not preserved. JSON
  represents the expanded values, not the original YAML notation.
- Switching directions uses valid output as the next input. Offer two-/four-space
  indentation, examples, clearing, and copy controls; invalid input clears output.
- Verify local processing, error recovery, directory/mobile registration, both
  themes, and responsive layouts. Run all tool tests before the commit pause.

## Increment 5 Acceptance Checks

- Convert Unix seconds (up to three decimal places) and whole milliseconds without
  rounding; support epoch zero, negative timestamps, and native Date range limits.
- Convert calendar input in explicitly selected UTC or browser-local time. Reject
  invalid calendar dates, unsupported date syntax, and nonexistent local DST times;
  use the earlier occurrence for ambiguous local times.
- Preserve the selected instant when changing units or time zone. Calendar input
  uses `YYYY-MM-DDTHH:mm:ss.SSS` without a time-zone suffix; seconds are optional.
- Show copyable seconds, milliseconds, ISO UTC, and browser-local results.
- Show a client-side live Unix clock without overwriting user input. Include Now,
  Epoch, and Clear actions, and clean up timers when leaving the page.
- Invalid or cleared input must remove converted results rather than leave stale
  values available for copying. The independent current-time readout stays active.
- Verify clipboard actions, selectors, both themes, directory/mobile registration,
  and responsive layouts. Run the entire tool test suite before the commit pause.

## Increment 6 Acceptance Checks

- Render Markdown live using an established parser, including GFM tables,
  strikethrough, task lists, block quotes, and fenced code blocks.
- Sanitize generated HTML before both rendering and copying. Remove scripts,
  executable embeds, event handlers, inline styles, and unsafe URL schemes.
- Open non-fragment links with `noopener noreferrer nofollow`; disallow
  protocol-relative links. Task checkboxes remain disabled.
- Block images by default. Allow only explicit HTTP(S) image URLs after opt-in,
  with lazy loading and no-referrer requests; keep relative/data URLs blocked.
- Provide Preview/HTML tabs, copying, examples, and clearing. Empty input must
  remove old output and disable copying.
- Keep typed content local and unpersisted; disclose when remote image requests
  are enabled.
- Verify sanitization in the browser, zero default image requests, opt-in loading,
  long-content containment, both themes, directory/mobile links, and responsive
  layouts. Run all tool tests before the commit pause.

## Increment 7 Acceptance Checks

- Compare two editable texts with line and word views using an established diff
  library. Display line numbers, addition/removal markers, and inline word changes.
- Offer exact spaces, trimmed line edges, and ignored spaces/tabs, plus optional
  case-insensitive comparison. Preserve input values; normalize CRLF/CR to LF for
  comparison. Line numbers and copied patches describe the compared text.
- Generate copyable unified patches and verify they apply to the compared input.
- Include Swap, Example, and Clear actions. Debounce edits and remove stale patch
  output while recomputing, after errors, or when inputs are cleared.
- Bound input to 100,000 characters per side, edit distance to 2,000, each diff
  calculation to 250ms, and line-view results to 3,000 rows. Explain exceeded limits.
- Render all diff content as plain Vue text; pasted HTML must not execute.
- Verify clipboard actions, selectors, long-text containment, both themes,
  directory/mobile registration, and responsive layouts. Run all tests and the
  production build before pausing for commit.

## Increment 8 Acceptance Checks

- Use native JavaScript RegExp only in disposable Web Workers, never execute a
  user pattern on the UI thread, and terminate each run after one second.
- Debounce edits, terminate prior workers on changes/unmount, ignore stale messages,
  and clear match output and copying while testing or after errors.
- Support global, ignore-case, multiline, dot-all, Unicode, sticky, indices, and
  Unicode-set flags. Keep `u`/`v` mutually exclusive; report unsupported flags using
  the browser's native error.
- Display safe text highlights, full matches, positional/named captures, unmatched
  and empty captures, and optional indices. Offsets are UTF-16 code-unit positions.
- Advance zero-length global matches safely, respecting Unicode surrogate pairs.
- Bound input to 5,000 pattern characters and 100,000 test-text characters. Limit
  results to 1,000 matches, 200,000 captured characters, and 5,000 capture entries;
  show a truncation warning when those output limits are reached.
- Provide Run, Example, Clear, and copyable match JSON. Empty pattern input means
  no expression; use an explicit empty expression such as `(?:)` to test empty matches.
- Verify a real pathological pattern times out while the browser stays responsive,
  recovery/cancellation, safe markup handling, flags, captures, both themes,
  directory/mobile registration, and responsive layouts. Run the full suite and
  production build before pausing for the final commit.

## Increment 9 Acceptance Checks

- Generate linear, radial, and mesh CSS using validated settings, with 2-8 stops or points,
  editable 3-/6-digit hex colors, positions, and individual opacity.
- Offer angle controls for linear gradients and circle/ellipse shapes and center
  controls for radial gradients. Sort output stops without mutating editor order;
  retain equal-position stops for hard transitions.
- Include presets, Add/Remove, Reverse, Reset, and copied CSS. Bound positions and
  opacity to 0-100 and reject non-finite numeric values or arbitrary CSS input.
- Match the live preview to the generated shorthand declarations for linear/radial
  gradients. Mesh output uses an independent background color and ordered radial
  background-image layers. Show a checkerboard behind transparent gradients.
- Invalid settings clear copied output rather than leave stale CSS available.
- Keep processing local and styles scoped. Extend shared toolbar labels only with
  defaults that preserve existing tools' Clear behavior.
- Verify browser CSS support, selectors/sliders, the mobile color picker, stop
  limits, both themes, directory/mobile registration, responsive layouts, and the
  existing JSON tool's Clear action. Run all tests and the production build.
- Mesh points expose color, opacity, X/Y position, and 1-100% spread. Preserve
  front-to-back layer order; Reverse layers changes paint order, not coordinates.
- Default to a three-color pastel mesh. Keep mesh state independent from
  linear/radial stops when switching modes.
- Provide numbered color dots on the mesh preview for mouse/touch positioning,
  pointer capture, 0-100% clamping, and synchronized X/Y sliders and CSS. Arrow keys
  move one percent; Shift+Arrow moves ten percent. Keep edge dots fully reachable
  and clear drag state when capture ends or the dragged point is removed/reset.
- Extend the shared overlay to linear/radial color stops with resize-aware guides.
  Lock linear dragging to the selected CSS angle; radial stops follow an outward
  guide from the configured center. Project off-axis pointer motion onto the guide,
  clamp positions to 0-100%, and synchronize sliders and generated CSS. Support
  mouse/touch, arrows, Shift+Arrow, and Home/End without changing mesh behavior.
- Reuse `GradientColorInput` for stops, points, and the mesh background; verify the
  new point controls, base color, copied CSS, min/max counts, and mobile picker.
