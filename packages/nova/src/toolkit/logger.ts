import * as util from 'node:util';

import chalk from 'chalk';

import { LINEBREAK_CRLF_OR_LF, PATTERN_ANSI } from '@/lib/regex.js';
import { currentTimestamp } from '@/lib/utility.js';
import type {
  LoggerCustomizeOptions,
  LoggerCustomizeReturns,
  LoggerDebugMessage,
  LoggerDebugReturns,
  LoggerEmitLevel,
  LoggerEmitMessage,
  LoggerEmitOptions,
  LoggerEmitReturns,
  LoggerErrorMessage,
  LoggerErrorReturns,
  LoggerInfoMessage,
  LoggerInfoReturns,
  LoggerPrefixLevel,
  LoggerPrefixOptions,
  LoggerPrefixReturns,
  LoggerShouldLogCurrentLogLevel,
  LoggerShouldLogLevel,
  LoggerShouldLogReturns,
  LoggerShouldLogWeights,
  LoggerStripAnsiColorsReturns,
  LoggerStripAnsiColorsValue,
  LoggerWarnMessage,
  LoggerWarnReturns,
} from '@/types/toolkit/logger.d.ts';

/**
 * Logger.
 *
 * @since 1.0.0
 */
export default class Logger {
  /**
   * Logger - Info.
   *
   * @param {LoggerInfoMessage} message - Message.
   *
   * @returns {LoggerInfoReturns}
   *
   * @since 1.0.0
   */
  public static info(...message: LoggerInfoMessage): LoggerInfoReturns {
    Logger.emit('info', {}, ...message);
  }

  /**
   * Logger - Warn.
   *
   * @param {LoggerWarnMessage} message - Message.
   *
   * @returns {LoggerWarnReturns}
   *
   * @since 1.0.0
   */
  public static warn(...message: LoggerWarnMessage): LoggerWarnReturns {
    Logger.emit('warn', {}, ...message);
  }

  /**
   * Logger - Error.
   *
   * @param {LoggerErrorMessage} message - Message.
   *
   * @returns {LoggerErrorReturns}
   *
   * @since 1.0.0
   */
  public static error(...message: LoggerErrorMessage): LoggerErrorReturns {
    Logger.emit('error', {}, ...message);
  }

  /**
   * Logger - Debug.
   *
   * @param {LoggerDebugMessage} message - Message.
   *
   * @returns {LoggerDebugReturns}
   *
   * @since 1.0.0
   */
  public static debug(...message: LoggerDebugMessage): LoggerDebugReturns {
    Logger.emit('debug', {}, ...message);
  }

  /**
   * Logger - Customize.
   *
   * @param {LoggerCustomizeOptions} options - Options.
   *
   * @returns {LoggerCustomizeReturns}
   *
   * @since 1.0.0
   */
  public static customize(options: LoggerCustomizeOptions): LoggerCustomizeReturns {
    return {
      debug(...message: LoggerDebugMessage): LoggerDebugReturns {
        Logger.emit('debug', options, ...message);
      },
      info(...message: LoggerInfoMessage): LoggerInfoReturns {
        Logger.emit('info', options, ...message);
      },
      warn(...message: LoggerWarnMessage): LoggerWarnReturns {
        Logger.emit('warn', options, ...message);
      },
      error(...message: LoggerErrorMessage): LoggerErrorReturns {
        Logger.emit('error', options, ...message);
      },
    };
  }

  /**
   * Logger - Emit.
   *
   * @param {LoggerEmitLevel}   level   - Level.
   * @param {LoggerEmitOptions} options - Options.
   * @param {LoggerEmitMessage} message - Message.
   *
   * @private
   *
   * @returns {LoggerEmitReturns}
   *
   * @since 1.0.0
   */
  private static emit(level: LoggerEmitLevel, options: LoggerEmitOptions, ...message: LoggerEmitMessage): LoggerEmitReturns {
    if (!Logger.shouldLog(level)) {
      return;
    }

    const padTop = '\n'.repeat(Math.max(0, options.padTop ?? 0));
    const padBottom = '\n'.repeat(Math.max(0, options.padBottom ?? 0));

    const stream = (level === 'warn' || level === 'error') ? process.stderr : process.stdout;
    const formattedMessage = (message.length > 0) ? util.format(...message) : '';

    if (padTop.length > 0) {
      stream.write(padTop);
    }

    const prefix = Logger.prefix(level, options);
    const prefixVisibleLength = Logger.stripAnsiColors(prefix).length;
    const indent = ' '.repeat(prefixVisibleLength + 1);
    const alignedMessage = formattedMessage.replace(new RegExp(LINEBREAK_CRLF_OR_LF, 'g'), `$&${indent}`);

    const payload = (formattedMessage.length > 0) ? `${prefix} ${alignedMessage}` : prefix;

    stream.write(`${payload}\n`);

    if (padBottom.length > 0) {
      stream.write(padBottom);
    }
  }

  /**
   * Logger - Should log.
   *
   * @param {LoggerShouldLogLevel} level - Level.
   *
   * @private
   *
   * @returns {LoggerShouldLogReturns}
   *
   * @since 1.0.0
   */
  private static shouldLog(level: LoggerShouldLogLevel): LoggerShouldLogReturns {
    const weights: LoggerShouldLogWeights = {
      debug: 10,
      info: 20,
      warn: 30,
      error: 40,
    };

    const isBrowser = typeof globalThis === 'object' && Reflect.has(globalThis, 'window');
    const nodeEnv = process.env['NODE_ENV'] ?? 'production';

    const currentLogLevel = (process.env['LOG_LEVEL'] ?? '').toLowerCase();
    const defaultLogLevel = (isBrowser && nodeEnv === 'production') ? 'warn' : (nodeEnv === 'development') ? 'debug' : 'info';
    const preferredLogLevel = Object.keys(weights).includes(currentLogLevel as LoggerShouldLogCurrentLogLevel) ? (currentLogLevel as LoggerShouldLogCurrentLogLevel) : defaultLogLevel;

    return weights[level] >= weights[preferredLogLevel];
  }

  /**
   * Logger - Prefix.
   *
   * @param {LoggerPrefixLevel}   level   - Level.
   * @param {LoggerPrefixOptions} options - Options.
   *
   * @private
   *
   * @returns {LoggerPrefixReturns}
   *
   * @since 1.0.0
   */
  private static prefix(level: LoggerPrefixLevel, options: LoggerPrefixOptions): LoggerPrefixReturns {
    const levelLabelUpper = level.toUpperCase();
    const nameLabel = (options.name) ? ` ${chalk.dim(`[${options.name}]`)}` : '';

    let coloredLevelLabel;

    switch (level) {
      case 'debug':
        coloredLevelLabel = chalk.grey(levelLabelUpper);
        break;
      case 'info':
        coloredLevelLabel = chalk.blue(levelLabelUpper);
        break;
      case 'warn':
        coloredLevelLabel = chalk.yellow(levelLabelUpper);
        break;
      case 'error':
        coloredLevelLabel = chalk.red(levelLabelUpper);
        break;
      default:
        coloredLevelLabel = chalk.white(levelLabelUpper);
        break;
    }

    // Show log timestamp if the "LOG_TIME" environment variable is seen.
    if (process.env['LOG_TIME'] && process.env['LOG_TIME'] === 'true') {
      return `${chalk.dim(currentTimestamp())} ${coloredLevelLabel}${nameLabel}`;
    }

    return `${coloredLevelLabel}${nameLabel}`;
  }

  /**
   * Logger - Strip ansi colors.
   *
   * @param {LoggerStripAnsiColorsValue} value - Value.
   *
   * @private
   *
   * @returns {LoggerStripAnsiColorsReturns}
   *
   * @since 1.0.0
   */
  private static stripAnsiColors(value: LoggerStripAnsiColorsValue): LoggerStripAnsiColorsReturns {
    return value.replace(new RegExp(PATTERN_ANSI, 'g'), '');
  }
}
