/**
 * Character leading v.
 *
 * @since 1.0.0
 */
export const CHARACTER_LEADING_V = /^v/;

/**
 * Text line split.
 *
 * @since 1.0.0
 */
export const TEXT_LINE_SPLIT = /\r?\n/;

/**
 * Text parenthesis content.
 *
 * @since 1.0.0
 */
export const TEXT_PARENTHESIS_CONTENT = /\((.+)\)/;

/**
 * Text quoted string pattern.
 *
 * @since 1.0.0
 */
export const TEXT_QUOTED_STRING_PATTERN = /^"(.*)"$/;

/**
 * Text registry query line pattern.
 *
 * @since 1.0.0
 */
export const TEXT_REGISTRY_QUERY_LINE_PATTERN = /^\s*(\S+)\s+(REG_\S+)\s+(.*)$/;

/**
 * Text rustc version.
 *
 * @since 1.0.0
 */
export const TEXT_RUSTC_VERSION = /^rustc\s+(\d+\.\d+\.\d+)\s+\((\w+)\s+([\d-]+)\)\s+\(([^)]+)\)$/;
