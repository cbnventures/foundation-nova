import type { LogLevel } from '@/types/shared.d.ts';

/**
 * Logger - Debug.
 *
 * @since 1.0.0
 */
export type LoggerDebugMessage = unknown;

export type LoggerDebugOptionalParams = unknown[];

export type LoggerDebugReturns = void;

/**
 * Logger - Emit.
 *
 * @since 1.0.0
 */
export type LoggerEmitLevel = LogLevel;

export type LoggerEmitName = string | undefined;

export type LoggerEmitMessage = unknown;

export type LoggerEmitOptionalParams = unknown[];

export type LoggerEmitReturns = void;

/**
 * Logger - Error.
 *
 * @since 1.0.0
 */
export type LoggerErrorMessage = unknown;

export type LoggerErrorOptionalParams = unknown[];

export type LoggerErrorReturns = void;

/**
 * Logger - Info.
 *
 * @since 1.0.0
 */
export type LoggerInfoMessage = unknown;

export type LoggerInfoOptionalParams = unknown[];

export type LoggerInfoReturns = void;

/**
 * Logger - Name.
 *
 * @since 1.0.0
 */
export type LoggerNameName = string;

export type LoggerNameReturns = {
  debug(message: LoggerDebugMessage, ...optionalParams: LoggerDebugOptionalParams): LoggerDebugReturns;
  info(message: LoggerInfoMessage, ...optionalParams: LoggerInfoOptionalParams): LoggerInfoReturns;
  warn(message: LoggerWarnMessage, ...optionalParams: LoggerWarnOptionalParams): LoggerWarnReturns;
  error(message: LoggerErrorMessage, ...optionalParams: LoggerErrorOptionalParams): LoggerErrorReturns;
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

export type LoggerWarnOptionalParams = unknown[];

export type LoggerWarnReturns = void;
