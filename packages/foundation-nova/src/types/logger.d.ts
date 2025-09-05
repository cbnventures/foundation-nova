import type { LogLevel } from '@/types/shared.d.ts';

/**
 * Logger - Debug.
 *
 * @since 1.0.0
 */
export type LoggerDebugMessage = unknown;

export type LoggerDebugReturns = void;

/**
 * Logger - Emit.
 *
 * @since 1.0.0
 */
export type LoggerEmitLevel = LogLevel;

export type LoggerEmitName = string | undefined;

export type LoggerEmitMessage = unknown;

export type LoggerEmitReturns = void;

/**
 * Logger - Error.
 *
 * @since 1.0.0
 */
export type LoggerErrorMessage = unknown;

export type LoggerErrorReturns = void;

/**
 * Logger - Info.
 *
 * @since 1.0.0
 */
export type LoggerInfoMessage = unknown;

export type LoggerInfoReturns = void;

/**
 * Logger - Name.
 *
 * @since 1.0.0
 */
export type LoggerNameName = string;

export type LoggerNameReturns = {
  debug(message: LoggerDebugMessage): LoggerDebugReturns;
  info(message: LoggerInfoMessage): LoggerInfoReturns;
  warn(message: LoggerWarnMessage): LoggerWarnReturns;
  error(message: LoggerErrorMessage): LoggerErrorReturns;
};

/**
 * Logger - Pad left.
 *
 * @since 1.0.0
 */
export type LoggerPadLeftNumber = number;

export type LoggerPadLeftWidth = number;

export type LoggerPadLeftReturns = string;

/**
 * Logger - Prefix.
 *
 * @since 1.0.0
 */
export type LoggerPrefixLevel = LogLevel;

export type LoggerPrefixName = string;

export type LoggerPrefixReturns = string;

/**
 * Logger - Should log.
 *
 * @since 1.0.0
 */
export type LoggerShouldLogLevel = LogLevel;

export type LoggerShouldLogReturns = boolean;

export type LoggerShouldLogCurrentLogLevel = LogLevel;

export type LoggerShouldLogWeights = Record<LogLevel, number>;

/**
 * Logger - Warn.
 *
 * @since 1.0.0
 */
export type LoggerWarnMessage = unknown;

export type LoggerWarnReturns = void;
