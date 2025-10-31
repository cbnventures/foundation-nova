import { CHARACTER_PIPE, LINEBREAK_CRLF_OR_LF, PATTERN_ANSI } from '@/lib/regex.js';
import type {
  MarkdownTableAddRowReturns,
  MarkdownTableAddRowRow,
  MarkdownTableComputeColumnWidthsReturns,
  MarkdownTableConstructorHeaders,
  MarkdownTableConstructorOptions,
  MarkdownTableEscapeCellReturns,
  MarkdownTableEscapeCellValue,
  MarkdownTableFormatDelimiterColumnWidths,
  MarkdownTableFormatDelimiterReturns,
  MarkdownTableFormatRowCells,
  MarkdownTableFormatRowReturns,
  MarkdownTableFormatRowWidths,
  MarkdownTableHeaders,
  MarkdownTableMinimumColumnWidth,
  MarkdownTablePadCellReturns,
  MarkdownTablePadCellString,
  MarkdownTablePadCellWidth,
  MarkdownTablePadDelimiterRow,
  MarkdownTableRenderReturns,
  MarkdownTableRows,
  MarkdownTableStripAnsiColorsReturns,
  MarkdownTableStripAnsiColorsString,
} from '@/types/toolkit/markdown-table.d.ts';

/**
 * Markdown Table.
 *
 * @since 1.0.0
 */
export default class MarkdownTable {
  /**
   * Markdown Table - Headers.
   *
   * @since 1.0.0
   */
  readonly #headers: MarkdownTableHeaders;

  /**
   * Markdown Table - Minimum column width.
   *
   * @since 1.0.0
   */
  readonly #minimumColumnWidth: MarkdownTableMinimumColumnWidth;

  /**
   * Markdown Table - Pad delimiter row.
   *
   * @since 1.0.0
   */
  readonly #padDelimiterRow: MarkdownTablePadDelimiterRow;

  /**
   * Markdown Table - Rows.
   *
   * @since 1.0.0
   */
  readonly #rows: MarkdownTableRows;

  /**
   * Markdown Table - Constructor.
   *
   * @param {MarkdownTableConstructorHeaders} headers   - Headers.
   * @param {MarkdownTableConstructorOptions} [options] - Options.
   *
   * @since 1.0.0
   */
  public constructor(headers: MarkdownTableConstructorHeaders, options?: MarkdownTableConstructorOptions) {
    if (!Array.isArray(headers) || headers.length === 0) {
      throw new Error('"headers" must be a non-empty array');
    }

    // In case you need to think about it, each array is panned out like a row.
    this.#headers = headers.map((header) => String(header));
    this.#minimumColumnWidth = Math.max(3, options?.minimumColumnWidth ?? 3);
    this.#padDelimiterRow = options?.padDelimiterRow ?? false;
    this.#rows = [];
  }

  /**
   * Markdown Table - Add row.
   *
   * @param {MarkdownTableAddRowRow} row - Row.
   *
   * @returns {MarkdownTableAddRowReturns}
   *
   * @since 1.0.0
   */
  public addRow(row: MarkdownTableAddRowRow): MarkdownTableAddRowReturns {
    if (this.#headers.length !== row.length) {
      throw new Error('Length of "rows" must equal length of "headers"');
    }

    this.#rows.push(row);

    // Allows the "addRow" method to be continuously chained.
    return this;
  }

  /**
   * Markdown Table - Render.
   *
   * @returns {MarkdownTableRenderReturns}
   *
   * @since 1.0.0
   */
  public render(): MarkdownTableRenderReturns {
    const columnWidths = this.computeColumnWidths();

    const header = this.formatRow(this.#headers, columnWidths);
    const delimiter = this.formatDelimiter(columnWidths);
    const body = this.#rows.map((row) => this.formatRow(row, columnWidths)).join('\n');

    return [header, delimiter, body].join('\n');
  }

  /**
   * Markdown Table - Escape cell.
   *
   * @param {MarkdownTableEscapeCellValue} value - Value.
   *
   * @private
   *
   * @returns {MarkdownTableEscapeCellReturns}
   *
   * @since 1.0.0
   */
  private escapeCell(value: MarkdownTableEscapeCellValue): MarkdownTableEscapeCellReturns {
    return value
      .replace(new RegExp(CHARACTER_PIPE, 'g'), '\\|')
      .replace(new RegExp(LINEBREAK_CRLF_OR_LF, 'g'), ' ');
  }

  /**
   * Markdown Table - Compute column widths.
   *
   * @private
   *
   * @returns {MarkdownTableComputeColumnWidthsReturns}
   *
   * @since 1.0.0
   */
  private computeColumnWidths(): MarkdownTableComputeColumnWidthsReturns {
    const columnsLength = this.#headers.length;
    const rows = [this.#headers, ...this.#rows];

    return Array.from(
      {
        length: columnsLength,
      },
      (_, columnIndex) => {
        // Return the column width that is the largest.
        return Math.max(this.#minimumColumnWidth, ...rows.map((row) => {
          return this.escapeCell(this.stripAnsiColors(row[columnIndex] ?? '')).length;
        }));
      },
    );
  }

  /**
   * Markdown Table - Pad cell.
   *
   * @param {MarkdownTablePadCellString} string - String.
   * @param {MarkdownTablePadCellWidth}  width  - Width.
   *
   * @private
   *
   * @returns {MarkdownTablePadCellReturns}
   *
   * @since 1.0.0
   */
  private padCell(string: MarkdownTablePadCellString, width: MarkdownTablePadCellWidth): MarkdownTablePadCellReturns {
    return `${string}${' '.repeat(Math.max(0, width - this.stripAnsiColors(string).length))}`;
  }

  /**
   * Markdown Table - Format row.
   *
   * @param {MarkdownTableFormatRowCells}  cells  - Cells.
   * @param {MarkdownTableFormatRowWidths} widths - Widths.
   *
   * @private
   *
   * @returns {MarkdownTableFormatRowReturns}
   *
   * @since 1.0.0
   */
  private formatRow(cells: MarkdownTableFormatRowCells, widths: MarkdownTableFormatRowWidths): MarkdownTableFormatRowReturns {
    const escapedCells = cells.map((cell, cellIndex) => {
      return this.padCell(this.escapeCell(cell), widths[cellIndex] ?? 0);
    });

    return `| ${escapedCells.join(' | ')} |`;
  }

  /**
   * Markdown Table - Format delimiter.
   *
   * @param {MarkdownTableFormatDelimiterColumnWidths} columnWidths - Column widths.
   *
   * @private
   *
   * @returns {MarkdownTableFormatDelimiterReturns}
   *
   * @since 1.0.0
   */
  private formatDelimiter(columnWidths: MarkdownTableFormatDelimiterColumnWidths): MarkdownTableFormatDelimiterReturns {
    const minimumWidth = this.#minimumColumnWidth;
    const usePaddedDelimiter = this.#padDelimiterRow;

    const columnCells = columnWidths.map((columnWidth) => {
      return '-'.repeat(columnWidth > minimumWidth ? columnWidth : minimumWidth);
    });

    const delimiter = (usePaddedDelimiter) ? ' | ' : '-|-';
    const rowBody = columnCells.join(delimiter);

    return (usePaddedDelimiter) ? `| ${rowBody} |` : `|-${rowBody}-|`;
  }

  /**
   * Markdown Table - Strip ansi colors.
   *
   * @param {MarkdownTableStripAnsiColorsString} string - String.
   *
   * @private
   *
   * @returns {MarkdownTableStripAnsiColorsReturns}
   *
   * @since 1.0.0
   */
  private stripAnsiColors(string: MarkdownTableStripAnsiColorsString): MarkdownTableStripAnsiColorsReturns {
    return string.replace(new RegExp(PATTERN_ANSI, 'g'), '');
  }
}
