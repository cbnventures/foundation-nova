/**
 * Text java version.
 *
 * @since 1.0.0
 */
export const TEXT_JAVA_VERSION = /^(?:openjdk|java)\s+(?<javaVersion>\d+(?:\.\d+){0,2})(?:\s+\d{4}-\d{2}-\d{2})?(?:\s+LTS)?[\s\S]*?(?:(?:Runtime Environment|SE Runtime Environment)\s+)?(?:(?<distro>Oracle GraalVM|GraalVM CE|GraalVM|Corretto|Temurin|Zulu|SapMachine|Microsoft|JBR|IBM Semeru Runtime Open Edition|Eclipse OpenJ9(?: VM)?|TencentKonaJDK|KonaJDK)(?:[-\s]?(?<distroVersion>[0-9][A-Za-z0-9.+-]*))?)?\s*\(build\s+(?<build>[^)]+)\)/mi;

/**
 * Text line split.
 *
 * @since 1.0.0
 */
export const TEXT_LINE_SPLIT = /\r?\n/;

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
export const TEXT_RUSTC_VERSION = /^rustc\s+(\d+\.\d+\.\d+)\s+\((\w+)\s+([\d-]+)\)(?:\s+\(([^)]+)\))?$/;

/**
 * Text semver.
 *
 * @since 1.0.0
 */
export const TEXT_SEMVER = /(?<semver>(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?)/;
