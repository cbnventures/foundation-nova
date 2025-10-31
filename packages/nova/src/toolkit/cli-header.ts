import { PATTERN_ANSI, PATTERN_ANSI_START } from '@/lib/regex.js';
import { Logger } from '@/toolkit/index.js';
import type {
  CLIHeaderAlignAlign,
  CLIHeaderAlignReturns,
  CLIHeaderAlignString,
  CLIHeaderAlignWidth,
  CLIHeaderBorderChars,
  CLIHeaderBorderCharsStyle,
  CLIHeaderPadToWidthReturns,
  CLIHeaderPadToWidthString,
  CLIHeaderPadToWidthWidth,
  CLIHeaderRenderOptions,
  CLIHeaderRenderReturns,
  CLIHeaderRenderTexts,
  CLIHeaderTruncateMax,
  CLIHeaderTruncateReturns,
  CLIHeaderTruncateString,
  CLIHeaderVisibleLengthReturns,
  CLIHeaderVisibleLengthString,
} from '@/types/toolkit/cli-header.d.ts';

/**
 * CLI Header.
 *
 * @since 1.0.0
 */
export default class CLIHeader {
  /**
   * CLI Header - Render.
   *
   * @param {CLIHeaderRenderTexts}   texts     - Texts.
   * @param {CLIHeaderRenderOptions} [options] - Options.
   *
   * @returns {CLIHeaderRenderReturns}
   *
   * @since 1.0.0
   */
  public static render(texts: CLIHeaderRenderTexts, options?: CLIHeaderRenderOptions): CLIHeaderRenderReturns {
    const align = options?.align ?? 'center';
    const marginTop = Math.max(0, options?.marginTop ?? 0);
    const marginBottom = Math.max(0, options?.marginBottom ?? 0);
    const paddingX = Math.max(0, options?.paddingX ?? 0);
    const paddingY = Math.max(0, options?.paddingY ?? 0);
    const style = options?.style ?? 'box';
    const width = Math.max(0, options?.width ?? process.stdout.columns);

    const topMargin = '\n'.repeat(marginTop);
    const bottomMargin = '\n'.repeat(marginBottom);

    const borderChars = CLIHeader.borderChars(style);
    const borderlessWidth = Math.max((2 * paddingX), width - 2);
    const topBorder = `${borderChars.topLeft}${'─'.repeat(borderlessWidth)}${borderChars.topRight}`;
    const bottomBorder = `${borderChars.bottomLeft}${'─'.repeat(borderlessWidth)}${borderChars.bottomRight}`;
    const contentWidth = Math.max(0, borderlessWidth - (2 * paddingX));

    const contentStrings: string[] = [];
    const displayStrings: string[] = [];

    // Text - Top vertical padding.
    for (let i = 0; i < paddingY; i += 1) {
      contentStrings.push(CLIHeader.align('', contentWidth, align));
    }

    // Text - Content.
    for (const text of texts) {
      const truncatedText = CLIHeader.truncate(text, contentWidth);

      contentStrings.push(CLIHeader.align(truncatedText, contentWidth, align));
    }

    // Text - Bottom vertical padding.
    for (let i = 0; i < paddingY; i += 1) {
      contentStrings.push(CLIHeader.align('', contentWidth, align));
    }

    // Build the displayable strings.
    for (const contentString of contentStrings) {
      const padded = `${' '.repeat(paddingX)}${contentString}${' '.repeat(paddingX)}`;

      displayStrings.push(`${borderChars.vertical}${CLIHeader.padToWidth(padded, borderlessWidth)}${borderChars.vertical}`);
    }

    return [
      ...(topMargin.length !== 0) ? [`${topMargin}${topBorder}`] : [topBorder],
      ...displayStrings,
      ...(bottomMargin.length !== 0) ? [`${bottomBorder}${bottomMargin}`] : [bottomBorder],
    ].join('\n');
  }

  /**
   * CLI Header - Border chars.
   *
   * @param {CLIHeaderBorderCharsStyle} style - Style.
   *
   * @private
   *
   * @returns {CLIHeaderBorderChars}
   *
   * @since 1.0.0
   */
  private static borderChars(style: CLIHeaderBorderCharsStyle): CLIHeaderBorderChars {
    switch (style) {
      case 'round':
        return {
          topLeft: '╭',
          topRight: '╮',
          bottomLeft: '╰',
          bottomRight: '╯',
          horizontal: '─',
          vertical: '│',
        };
      case 'thick':
        return {
          topLeft: '╔',
          topRight: '╗',
          bottomLeft: '╚',
          bottomRight: '╝',
          horizontal: '═',
          vertical: '║',
        };
      case 'box':
      default:
        return {
          topLeft: '┌',
          topRight: '┐',
          bottomLeft: '└',
          bottomRight: '┘',
          horizontal: '─',
          vertical: '│',
        };
    }
  }

  /**
   * CLI Header - Truncate.
   *
   * @param {CLIHeaderTruncateString} string - String.
   * @param {CLIHeaderTruncateMax}    max    - Max.
   *
   * @private
   *
   * @returns {CLIHeaderTruncateReturns}
   *
   * @since 1.0.0
   */
  private static truncate(string: CLIHeaderTruncateString, max: CLIHeaderTruncateMax): CLIHeaderTruncateReturns {
    if (max <= 0 || string === '') {
      return '';
    }

    Logger.customize({ name: 'CLIHeader.truncate::begin' }).debug(JSON.stringify(string));

    // First pass: Strip ANSI, record them in order.
    let rawIndex = 0;
    let plain = '';

    while (rawIndex < string.length) {
      const slice = string.slice(rawIndex);
      const matches = slice.match(PATTERN_ANSI_START);

      // Skips the ANSI portion.
      if (matches) {
        const code = matches[0];

        Logger.customize({ name: 'CLIHeader.truncate::strip' }).debug([
          `ANSI at rawIndex=${rawIndex}: ${JSON.stringify(code)}`,
        ].join(', '));

        rawIndex += code.length;

        continue;
      }

      const character = string[rawIndex]!;

      plain += character;

      Logger.customize({ name: 'CLIHeader.truncate::strip' }).debug([
        `Visible at rawIndex=${rawIndex}: ${JSON.stringify(character)}`,
        `plain so far: ${JSON.stringify(plain)}`,
      ].join(', '));

      rawIndex += 1;
    }

    Logger.customize({ name: 'CLIHeader.truncate::first-pass' }).debug(JSON.stringify(plain));

    const plainLength = plain.length;
    const needsEllipsis = plainLength > max;
    const visibleWidth = (needsEllipsis) ? Math.max(0, max - 1) : Math.min(max, plainLength);

    Logger.customize({ name: 'CLIHeader.truncate::width' }).debug(JSON.stringify({
      plainLength,
      needsEllipsis,
      visibleWidth,
    }));

    // Second pass: Rebuild truncated string, reinserting ANSI.
    let visibleIndex = 0;
    let output = '';

    rawIndex = 0;

    while (rawIndex < string.length && visibleIndex < visibleWidth) {
      const slice = string.slice(rawIndex);
      const matches = slice.match(PATTERN_ANSI_START);

      // Adds the ANSI portion back.
      if (matches) {
        const code = matches[0];

        output += code;

        Logger.customize({ name: 'CLIHeader.truncate::rebuild' }).debug([
          `ANSI at rawIndex=${rawIndex}: ${JSON.stringify(code)}`,
        ].join(', '));

        rawIndex += code.length;

        continue;
      }

      const character = string[rawIndex]!;

      output += character;

      visibleIndex += 1;

      Logger.customize({ name: 'CLIHeader.truncate::rebuild' }).debug([
        `Visible at rawIndex=${rawIndex}: ${JSON.stringify(character)}`,
        `visible count: ${JSON.stringify(visibleIndex)}`,
      ].join(', '));

      rawIndex += 1;
    }

    Logger.customize({ name: 'CLIHeader.truncate::second-pass' }).debug(JSON.stringify(output));

    if (needsEllipsis) {
      output += '…';

      Logger.customize({ name: 'CLIHeader.truncate::ellipsis' }).debug(JSON.stringify(output));
    }

    // If ANSI is detected in the output, add a hard reset at the end.
    if (output.includes('\x1b[')) {
      output += '\x1b[0m';
    }

    Logger.customize({ name: 'CLIHeader.truncate::end' }).debug(JSON.stringify(output));

    return output;
  }

  /**
   * CLI Header - Align.
   *
   * @param {CLIHeaderAlignString} string - String.
   * @param {CLIHeaderAlignWidth}  width  - Width.
   * @param {CLIHeaderAlignAlign}  align  - Align.
   *
   * @private
   *
   * @returns {CLIHeaderAlignReturns}
   *
   * @since 1.0.0
   */
  private static align(string: CLIHeaderAlignString, width: CLIHeaderAlignWidth, align: CLIHeaderAlignAlign): CLIHeaderAlignReturns {
    const stringLength = CLIHeader.visibleLength(string);
    const availableSpace = width - stringLength;
    const leftPadding = Math.floor(availableSpace / 2);
    const rightPadding = availableSpace - leftPadding;

    // If string is aligned to the left.
    if (align === 'left') {
      return `${string}${' '.repeat(availableSpace)}`;
    }

    // If string is aligned to the right.
    if (align === 'right') {
      return `${' '.repeat(availableSpace)}${string}`;
    }

    // If string is aligned to the center.
    return `${' '.repeat(leftPadding)}${string}${' '.repeat(rightPadding)}`;
  }

  /**
   * CLI Header - Visible length.
   *
   * @param {CLIHeaderVisibleLengthString} string - String.
   *
   * @private
   *
   * @returns {CLIHeaderVisibleLengthReturns}
   *
   * @since 1.0.0
   */
  private static visibleLength(string: CLIHeaderVisibleLengthString): CLIHeaderVisibleLengthReturns {
    return string.replace(new RegExp(PATTERN_ANSI, 'g'), '').length;
  }

  /**
   * CLI Header - Pad to width.
   *
   * @param {CLIHeaderPadToWidthString} string - String.
   * @param {CLIHeaderPadToWidthWidth}  width  - Width.
   *
   * @private
   *
   * @returns {CLIHeaderPadToWidthReturns}
   *
   * @since 1.0.0
   */
  private static padToWidth(string: CLIHeaderPadToWidthString, width: CLIHeaderPadToWidthWidth): CLIHeaderPadToWidthReturns {
    const visibleLength = CLIHeader.visibleLength(string);

    return `${string}${' '.repeat(Math.max(0, width - visibleLength))}`;
  }
}
