import type { LogLevel, LogOptions } from '@/types/shared.d.ts';

/**
 * Logger - Customize.
 *
 * @since 1.0.0
 */
export type LoggerCustomizeOptions = LogOptions;

export type LoggerCustomizeReturns = {
  debug(...message: LoggerDebugMessage): LoggerDebugReturns;
  info(...message: LoggerInfoMessage): LoggerInfoReturns;
  warn(...message: LoggerWarnMessage): LoggerWarnReturns;
  error(...message: LoggerErrorMessage): LoggerErrorReturns;
};

/**
 * Logger - Debug.
 *
 * @since 1.0.0
 */
export type LoggerDebugMessage = unknown[];

export type LoggerDebugReturns = void;

/**
 * Logger - Emit.
 *
 * @since 1.0.0
 */
export type LoggerEmitLevel = LogLevel;

export type LoggerEmitOptions = LogOptions;

export type LoggerEmitMessage = unknown[];

export type LoggerEmitReturns = void;

/**
 * Logger - Error.
 *
 * @since 1.0.0
 */
export type LoggerErrorMessage = unknown[];

export type LoggerErrorReturns = void;

/**
 * Logger - Info.
 *
 * @since 1.0.0
 */
export type LoggerInfoMessage = unknown[];

export type LoggerInfoReturns = void;

/**
 * Logger - Prefix.
 *
 * @since 1.0.0
 */
export type LoggerPrefixLevel = LogLevel;

export type LoggerPrefixOptions = LogOptions;

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
 * Logger - Strip ansi colors.
 *
 * @since 1.0.0
 */
export type LoggerStripAnsiColorsValue = string;

export type LoggerStripAnsiColorsReturns = string;

/**
 * Logger - Warn.
 *
 * @since 1.0.0
 */
export type LoggerWarnMessage = unknown[];

export type LoggerWarnReturns = void;
