# Developer Tools Roadmap

Implement one tool per increment. After each increment, run its tests, formatting,
production build, and desktop/mobile browser checks. Stop for review and a user
commit before starting the next increment. Do not commit automatically.

| Increment | Tool                  | Scope                                                                   | Status                         |
| --------- | --------------------- | ----------------------------------------------------------------------- | ------------------------------ |
| 1         | JSON formatter        | Strict validation, format/minify, indentation, copy, lossless numbers   | Committed                      |
| 2         | SQL formatter         | SQL dialect selection, format, copy, examples                           | Committed                      |
| 3         | JSON to TypeScript    | Root type name, nested objects/arrays, generated types, copy            | Committed                      |
| 4         | JSON / YAML converter | Both directions, parser errors, copy; document YAML-to-JSON limitations | Committed                      |
| 5         | Unix timestamp        | Seconds/milliseconds, UTC/local dates, current time, copy               | Committed                      |
| 6         | Markdown previewer    | Live preview, sanitized HTML, safe external links                       | Committed                      |
| 7         | Diff checker          | Two inputs, line/word changes, whitespace options                       | Complete; awaiting user commit |
| 8         | Regex tester          | Flags, matches/groups, invalid expressions, worker timeout              | Pending                        |

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
