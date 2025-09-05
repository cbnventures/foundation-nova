import type { MarkdownTable } from '@/toolkit/markdown-table.ts';

/**
 * Markdown Table - Add row.
 *
 * @since 1.0.0
 */
export type MarkdownTableAddRowRow = string[];

export type MarkdownTableAddRowReturns = MarkdownTable;

/**
 * Markdown Table - Compute column widths.
 *
 * @since 1.0.0
 */
export type MarkdownTableComputeColumnWidthsReturns = number[];

/**
 * Markdown Table - Constructor.
 *
 * @since 1.0.0
 */
export type MarkdownTableConstructorHeaders = string[];

export type MarkdownTableConstructorOptionsMinimumColumnWidth = number;

export type MarkdownTableConstructorOptionsPadDelimiterRow = boolean;

export type MarkdownTableConstructorOptions = {
  minimumColumnWidth: MarkdownTableConstructorOptionsMinimumColumnWidth;
  padDelimiterRow: MarkdownTableConstructorOptionsPadDelimiterRow;
};

/**
 * Markdown Table - Escape cell.
 *
 * @since 1.0.0
 */
export type MarkdownTableEscapeCellValue = string;

export type MarkdownTableEscapeCellReturns = string;

/**
 * Markdown Table - Format delimiter.
 *
 * @since 1.0.0
 */
export type MarkdownTableFormatDelimiterColumnWidths = number[];

export type MarkdownTableFormatDelimiterReturns = string;

/**
 * Markdown Table - Format row.
 *
 * @since 1.0.0
 */
export type MarkdownTableFormatRowCells = string[];

export type MarkdownTableFormatRowWidths = number[];

export type MarkdownTableFormatRowReturns = string;

/**
 * Markdown Table - Headers.
 *
 * @since 1.0.0
 */
export type MarkdownTableHeaders = string[];

/**
 * Markdown Table - Minimum column width.
 *
 * @since 1.0.0
 */
export type MarkdownTableMinimumColumnWidth = number;

/**
 * Markdown Table - Pad cell.
 *
 * @since 1.0.0
 */
export type MarkdownTablePadCellString = string;

export type MarkdownTablePadCellWidth = number;

export type MarkdownTablePadCellReturns = string;

/**
 * Markdown Table - Pad delimiter row.
 *
 * @since 1.0.0
 */
export type MarkdownTablePadDelimiterRow = boolean;

/**
 * Markdown Table - Render.
 *
 * @since 1.0.0
 */
export type MarkdownTableRenderReturns = string;

/**
 * Markdown Table - Rows.
 *
 * @since 1.0.0
 */
export type MarkdownTableRows = string[][];

/**
 * Markdown Table - Strip ansi colors.
 *
 * @since 1.0.0
 */
export type MarkdownTableStripAnsiColorsString = string;

export type MarkdownTableStripAnsiColorsReturns = string;
