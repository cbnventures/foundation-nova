import type { BorderStyle, TextAlign } from '@/types/shared.d.ts';

/**
 * CLI Header - Align.
 *
 * @since 1.0.0
 */
export type CLIHeaderAlignAlign = TextAlign;

export type CLIHeaderAlignString = string;

export type CLIHeaderAlignWidth = number;

export type CLIHeaderAlignReturns = string;

/**
 * CLI Header - Border chars.
 *
 * @since 1.0.0
 */
export type CLIHeaderBorderCharsStyle = BorderStyle;

export type CLIHeaderBorderChars = {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  horizontal: string;
  vertical: string;
};

/**
 * CLI Header - Pad to width.
 *
 * @since 1.0.0
 */
export type CLIHeaderPadToWidthString = string;

export type CLIHeaderPadToWidthWidth = number;

export type CLIHeaderPadToWidthReturns = string;

/**
 * CLI Header - Render.
 *
 * @since 1.0.0
 */
export type CLIHeaderRenderTexts = string[];

export type CLIHeaderRenderOptionsAlign = TextAlign;

export type CLIHeaderRenderOptionsMarginTop = number;

export type CLIHeaderRenderOptionsMarginBottom = number;

export type CLIHeaderRenderOptionsPaddingX = number;

export type CLIHeaderRenderOptionsPaddingY = number;

export type CLIHeaderRenderOptionsStyle = BorderStyle;

export type CLIHeaderRenderOptionsWidth = number;

export type CLIHeaderRenderOptions = {
  align?: CLIHeaderRenderOptionsAlign;
  marginTop?: CLIHeaderRenderOptionsMarginTop;
  marginBottom?: CLIHeaderRenderOptionsMarginBottom;
  paddingX?: CLIHeaderRenderOptionsPaddingX;
  paddingY?: CLIHeaderRenderOptionsPaddingY;
  style?: CLIHeaderRenderOptionsStyle;
  width?: CLIHeaderRenderOptionsWidth;
};

export type CLIHeaderRenderReturns = string;

/**
 * CLI Header - Truncate.
 *
 * @since 1.0.0
 */
export type CLIHeaderTruncateString = string;

export type CLIHeaderTruncateMax = number;

export type CLIHeaderTruncateReturns = string;

/**
 * CLI Header - Visible length.
 *
 * @since 1.0.0
 */
export type CLIHeaderVisibleLengthString = string;

export type CLIHeaderVisibleLengthReturns = number;
