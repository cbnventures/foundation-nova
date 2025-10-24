# @cbnventures/foundation-nova

## 0.9.0

### Minor Changes

- Prevent usage of `console` completely. Either use the `Logger` toolkit battery or write to the process directly. This is to prevent over-reliance of `console.log`.
- Align multi-line log payloads with prefix-aware indentation.
- Default production-browser logs to warn/error while keeping backend defaults.

### Patch Changes

- Refreshed docs and tooling stacks by bumping Docusaurus, React, TypeScript, ESLint, and related plugins/libs to their latest releases.
- Add a single-character ellipsis when CLI header text is truncated to fit the specified width.
- Add `CLIHeader` to the toolkit barrel export so consumers can import it via `@cbnventures/foundation-nova/toolkit`.
