import chalk from 'chalk';

import type {
  LoggerDebugMessage,
  LoggerDebugReturns,
  LoggerEmitLevel,
  LoggerEmitMessage,
  LoggerEmitName,
  LoggerEmitReturns,
  LoggerErrorMessage,
  LoggerErrorReturns,
  LoggerInfoMessage,
  LoggerInfoReturns,
  LoggerNameName,
  LoggerNameReturns,
  LoggerPadLeftNumber,
  LoggerPadLeftReturns,
  LoggerPadLeftWidth,
  LoggerPrefixLevel,
  LoggerPrefixName,
  LoggerPrefixReturns,
  LoggerShouldLogCurrentLogLevel,
  LoggerShouldLogLevel,
  LoggerShouldLogReturns,
  LoggerShouldLogWeights,
  LoggerWarnMessage,
  LoggerWarnReturns,
} from '@/types/logger.d.ts';

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
  public static info(message: LoggerInfoMessage): LoggerInfoReturns {
    Logger.emit('info', undefined, message);
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
  public static warn(message: LoggerWarnMessage): LoggerWarnReturns {
    Logger.emit('warn', undefined, message);
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
  public static error(message: LoggerErrorMessage): LoggerErrorReturns {
    Logger.emit('error', undefined, message);
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
  public static debug(message: LoggerDebugMessage): LoggerDebugReturns {
    Logger.emit('debug', undefined, message);
  }

  /**
   * Logger - Name.
   *
   * @param {LoggerNameName} name - Name.
   *
   * @returns {LoggerNameReturns}
   *
   * @since 1.0.0
   */
  public static name(name: LoggerNameName): LoggerNameReturns {
    return {
      debug(message: LoggerDebugMessage): LoggerDebugReturns {
        Logger.emit('debug', name, message);
      },
      info(message: LoggerInfoMessage): LoggerInfoReturns {
        Logger.emit('info', name, message);
      },
      warn(message: LoggerWarnMessage): LoggerWarnReturns {
        Logger.emit('warn', name, message);
      },
      error(message: LoggerErrorMessage): LoggerErrorReturns {
        Logger.emit('error', name, message);
      },
    };
  }

  /**
   * Logger - Emit.
   *
   * @param {LoggerEmitLevel}   level   - Level.
   * @param {LoggerEmitName}    name    - Name.
   * @param {LoggerEmitMessage} message - Message.
   *
   * @private
   *
   * @returns {LoggerEmitReturns}
   *
   * @since 1.0.0
   */
  private static emit(level: LoggerEmitLevel, name: LoggerEmitName, message: LoggerEmitMessage): LoggerEmitReturns {
    if (!Logger.shouldLog(level)) {
      return;
    }

    const prefix = Logger.prefix(level, name);

    switch (level) {
      case 'debug':
        console.debug(prefix, message);
        break;
      case 'info':
        console.info(prefix, message);
        break;
      case 'warn':
        console.warn(prefix, message);
        break;
      case 'error':
        console.error(prefix, message);
        break;
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
    const currentLogLevel = (process.env['LOG_LEVEL'] ?? '').toLowerCase();
    const defaultLogLevel = (process.env['NODE_ENV'] === 'development') ? 'debug' : 'info';
    const preferredLogLevel = Object.keys(weights).includes(currentLogLevel as LoggerShouldLogCurrentLogLevel) ? (currentLogLevel as LoggerShouldLogCurrentLogLevel) : defaultLogLevel;

    return weights[level] >= weights[preferredLogLevel];
  }

  /**
   * Logger - Prefix.
   *
   * @param {LoggerPrefixLevel} level  - Level.
   * @param {LoggerPrefixName}  [name] - Name.
   *
   * @private
   *
   * @returns {LoggerPrefixReturns}
   *
   * @since 1.0.0
   */
  private static prefix(level: LoggerPrefixLevel, name?: LoggerPrefixName): LoggerPrefixReturns {
    const now = new Date();
    const year = now.getFullYear();
    const month = Logger.padLeft(now.getMonth() + 1);
    const day = Logger.padLeft(now.getDate());
    const hour = Logger.padLeft(now.getHours());
    const minute = Logger.padLeft(now.getMinutes());
    const second = Logger.padLeft(now.getSeconds());
    const millisecond = now.getMilliseconds().toString().padStart(3, '0');

    const timezoneOffsetMinutes = -now.getTimezoneOffset();
    const timezoneSign = (timezoneOffsetMinutes >= 0) ? '+' : '-';
    const timezoneAbs = Math.abs(timezoneOffsetMinutes);
    const timezoneHours = Logger.padLeft(Math.trunc(timezoneAbs / 60));
    const timezoneMinutes = Logger.padLeft(timezoneAbs % 60);

    const timestampText = `[${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond} ${timezoneSign}${timezoneHours}${timezoneMinutes}]`;

    const levelLabelUpper = level.toUpperCase();
    const nameLabel = name ? ' ' + chalk.dim(`[${name}]`) : '';

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

    return `${chalk.dim(timestampText)} ${coloredLevelLabel}${nameLabel}`;
  }

  /**
   * Logger - Pad left.
   *
   * @param {LoggerPadLeftNumber} number - Number.
   * @param {LoggerPadLeftWidth}  width  - Width.
   *
   * @private
   *
   * @returns {LoggerPadLeftReturns}
   *
   * @since 1.0.0
   */
  private static padLeft(number: LoggerPadLeftNumber, width: LoggerPadLeftWidth = 2): LoggerPadLeftReturns {
    let currentWidth = width;

    // Minimum width must be set to "2".
    if (width < 2) {
      currentWidth = 2;
    }

    return number.toString().padStart(currentWidth, '0');
  }
}
