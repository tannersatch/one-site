# Developer Tools Roadmap

Implement one tool per increment. After each increment, run its tests, formatting,
production build, and desktop/mobile browser checks. Stop for review and a user
commit before starting the next increment. Do not commit automatically.

| Increment | Tool                  | Scope                                                                   | Status                         |
| --------- | --------------------- | ----------------------------------------------------------------------- | ------------------------------ |
| 1         | JSON formatter        | Strict validation, format/minify, indentation, copy, lossless numbers   | Committed                      |
| 2         | SQL formatter         | SQL dialect selection, format, copy, examples                           | Complete; awaiting user commit |
| 3         | JSON to TypeScript    | Root type name, nested objects/arrays, generated types, copy            | Pending                        |
| 4         | YAML / JSON converter | Both directions, parser errors, copy; document YAML-to-JSON limitations | Pending                        |
| 5         | Unix timestamp        | Seconds/milliseconds, UTC/local dates, current time, copy               | Pending                        |
| 6         | Markdown previewer    | Live preview, sanitized HTML, safe external links                       | Pending                        |
| 7         | Diff checker          | Two inputs, line/word changes, whitespace options                       | Pending                        |
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
