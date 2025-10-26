# @cbnventures/foundation-nova

## 0.10.0

### Minor Changes

- Removed the `inspect` CLI command now that we decided not to wrap ESLint/TypeScript print-config.

### Patch Changes

- Updated the CLI "CURRENTLY RUNNING:" text to also include the base command used (`foundation-nova` or `nova`) for better debugging purposes.
- Renamed `CLIInitialize` and `CLIVersion` to their sub-folder `CLIUtility*` variants.
- Separated toolkit types into their own directory to prevent prefix collision.
- Rename `sync-pkg-manager` to `sync-pkg-mgr` to shorten already long commands, in addition to adding a "one-letter per word" alias.

## 0.9.0

### Minor Changes

- Prevent usage of `console` completely. Either use the `Logger` toolkit battery or write to the process directly. This is to prevent over-reliance of `console.log`.
- Align multi-line log payloads with prefix-aware indentation.
- Default production-browser logs to warn/error while keeping backend defaults.

### Patch Changes

- Refreshed docs and tooling stacks by bumping Docusaurus, React, TypeScript, ESLint, and related plugins/libs to their latest releases.
- Add a single-character ellipsis when CLI header text is truncated to fit the specified width.
- Add `CLIHeader` to the toolkit barrel export so consumers can import it via `@cbnventures/foundation-nova/toolkit`.
