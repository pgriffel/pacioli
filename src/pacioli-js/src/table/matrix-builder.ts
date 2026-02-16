/**
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { SIUnit } from "uom-ts";
import { DimNum } from "uom-ts";
import { NR_DECIMALS } from "../primitives";
import { stringifyCell } from "./util";
import type { PacioliMatrix } from "../values/matrix";
import type { MatrixShape } from "../values/matrix-shape";
import { getFullNumbers } from "../raw-values/numbers";
import type { NumberOptions } from "../web-components/pacioli-number-component";

/**
 * Options for MatrixBuilder
 */
export interface MatrixBuilderOptions extends NumberOptions {
  headers: boolean;
  nounits: boolean;
  headerunits: boolean;
  evenwidth: boolean;
  width?: number;
}

/**
 * The MatrixBuilder is an intermediate form between a matrix and tabular output
 * that avoids duplication of funcionality. A recurring issue is displaying a
 * matrix in table form. The output can be ascii or html or any other medium.
 * The intermediate form handles common issues besides collecting the data:
 *
 * - transforming to strings in the right number of decimals
 * - custom output for zero (e.g. "-" instead of "0")
 * - displaying headers
 * - ...
 *
 * Typical usage is a chain like:
 *
 * A matrix -> MatrixBuilder -> Ascii or DOM
 *
 * Currently no other input than a matrix is supported.
 */
export class MatrixBuilder {
  /**
   * The constructor arguments define the intermediate form. It should be general enough for
   * all users of this class to transform the input data to this form.
   * @param cells
   * @param rowNames
   * @param columnNames
   * @param options
   */
  constructor(
    public readonly cells: DimNum[][],
    public readonly rowNames: { names: string[]; unit: SIUnit }[],
    public readonly columnNames: { names: string[]; unit: SIUnit }[],
    public readonly options: Partial<MatrixBuilderOptions> = {},
  ) {}

  static fromMatrix(
    value: PacioliMatrix,
    options: Partial<MatrixBuilderOptions>,
  ): MatrixBuilder {
    return matrixBuilderFromMatrix(value, options);
  }

  private cellOptions(): {
    zeroString: string | undefined;
    omitDecimals: boolean;
    nrDecimals: number;
    exponential: boolean;
  } {
    return {
      zeroString: this.options.zero,
      omitDecimals: this.options.raw === true || false,
      nrDecimals: this.options.decimals ?? NR_DECIMALS,
      exponential: this.options.exponential === true || false,
    };
  }

  /**
   * Stringified representation of the input data. Should be general enough to allow all output
   * variants to be created from it.
   */
  stringifiedCells(): { num: DimNum; magnitude: string; unit: string }[][] {
    const out: { num: DimNum; magnitude: string; unit: string }[][] = [];

    if (this.cells.length === 0) return out;

    const options = this.cellOptions();

    const rowsCount = this.cells.length;
    const colsCount = this.cells[0].length;

    for (let i = 0; i < rowsCount; i++) {
      const row: { num: DimNum; magnitude: string; unit: string }[] = [];

      for (let j = 0; j < colsCount; j++) {
        const num = this.cells[i][j];
        const magnitude = stringifyCell(num, options);
        const unit = num.magnitude.isZero() ? "" : num.unit.toText();

        row.push({ num, magnitude, unit });
      }

      out.push(row);
    }

    return out;
  }

  rowHeaders(headerUnits: boolean) {
    return this.rowNames.map((entry) => {
      if (entry.names.length === 0) {
        return "";
      }

      const units = headerUnits ? ` [${entry.unit.toText()}]` : "";

      return entry.names.join(",") + units;
    });
  }

  columnHeaders(headerUnits: boolean) {
    return this.columnNames.map((entry) => {
      if (entry.names.length === 0) {
        return "";
      }

      const units = headerUnits ? ` [${entry.unit.toText()}]` : "";

      return entry.names.join(",") + units;
    });
  }

  dom(): HTMLElement {
    return createMatrixTable(
      this.stringifiedCells(),
      this.rowHeaders(this.options.headerunits === true),
      this.columnHeaders(this.options.headerunits === true),
      this.options.headers === true,
      this.options.evenwidth === true,
      this.options.nounits !== true,
      this.options.width,
    );
  }

  ascii(): string {
    return buildAsciiMatrix(
      this.stringifiedCells(),
      this.rowHeaders(this.options.headerunits === true),
      this.columnHeaders(this.options.headerunits === true),
      this.options.headers === true,
      this.options.evenwidth === true,
      this.options.nounits !== true,
    );
  }

  public clipboardText(): string {
    return "TODO: clipboardText for MatrixBuilder";
  }
}

function matrixBuilderFromMatrix(
  matrix: PacioliMatrix,
  options: Partial<MatrixBuilderOptions>,
): MatrixBuilder {
  const values: DimNum[][] = [];

  const shape: MatrixShape = matrix.shape;

  const nrRows = shape.nrRows();
  const nrColumns = shape.nrColumns();

  if (nrRows === 0 || nrColumns === 0) {
    throw new Error("No rows and columns?");
  } else {
    const numbers = getFullNumbers(matrix.numbers);

    // Add the data rows
    for (let i = 0; i < nrRows; i++) {
      const rowNums: DimNum[] = [];

      for (let j = 0; j < nrColumns; j++) {
        const num = numbers[i][j];

        const dimNum = DimNum.fromNumber(num, shape.unitAt(i, j));
        rowNums.push(dimNum);
      }

      values.push(rowNums);
    }
  }
  return new MatrixBuilder(
    values,
    shape.rowIndices(),
    shape.columnIndices(),
    options,
  );
}

function buildAsciiMatrix(
  data: { num: DimNum; magnitude: string; unit: string }[][],
  rowHeaders: string[],
  columnHeaders: string[],
  headers: boolean,
  evenWidth: boolean,
  units: boolean,
): string {
  const nrRows = data.length;
  const nrColumns = nrRows === 0 ? 0 : data[0].length;

  if (nrRows === 0 || nrColumns === 0) {
    return "";
  }

  // Compute the maximum widths for the magnitudes and for the units
  const maxMagnitudeWidths: number[] = columnHeaders.map((_) => 0);
  const maxUnitWidths: number[] = columnHeaders.map((_) => 0);

  for (const row of data) {
    for (const [j, element] of row.entries()) {
      maxMagnitudeWidths[j] = Math.max(
        maxMagnitudeWidths[j],
        element.magnitude.length,
      );
      maxUnitWidths[j] = Math.max(maxUnitWidths[j], element.unit.length);
    }
  }

  // The column width is the maximum of the header width and the magnitude
  // plus unit width (plus 1 space)
  const columnWidths = columnHeaders.map((header, i) => {
    const headerLength = headers ? header.length : 0;
    return units
      ? Math.max(headerLength, maxMagnitudeWidths[i] + maxUnitWidths[i] + 1)
      : Math.max(headerLength, maxMagnitudeWidths[i]);
  });

  // Set all column widths to the maximum if event width is requested
  if (evenWidth) {
    columnWidths.fill(columnWidths.reduce((x, y) => Math.max(x, y), 0));
  }

  // The index column width is independent from the rest
  const maxRowIndexWidth = rowHeaders
    .map((name) => name.length)
    .reduce((x, y) => Math.max(x, y), 0);

  let output = "";

  // Print a header row if requested
  if (headers) {
    output += "".padStart(maxRowIndexWidth);

    const headerRow = columnHeaders.map((header, i) =>
      header.padEnd(columnWidths[i]),
    );

    output += " " + headerRow.join(" ") + "\n";
  }

  // Print the matrix
  for (const [i, row] of data.entries()) {
    const line: string[] = [];

    if (headers) {
      line.push(rowHeaders[i].padEnd(maxRowIndexWidth));
    }

    for (const [i, element] of row.entries()) {
      const magnitudeWidth = units
        ? columnWidths[i] - maxUnitWidths[i] - 1
        : columnWidths[i];
      const unitWidth = maxUnitWidths[i];

      line.push(element.magnitude.padStart(magnitudeWidth));

      if (units) {
        line.push(element.unit.padEnd(unitWidth));
      }
    }

    output += line.join(" ") + "\n";
  }

  return output;
}

function createMatrixTable(
  data: { num: DimNum; magnitude: string; unit: string }[][],
  rowHeaders: string[],
  columnHeaders: string[],
  headers: boolean,
  evenwidth: boolean,
  units: boolean,
  width: number | undefined,
): HTMLTableElement {
  const table = document.createElement("table");
  table.className = evenwidth ? "fixed" : "";
  table.part = "table";
  if (width !== undefined) {
    table.style.width = `${width.toString()}px`;
  }

  if (headers) {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.part = "header row";

    const corner = document.createElement("th");
    corner.className = "key";
    corner.part = "header key";
    corner.innerHTML = "";
    headerRow.appendChild(corner);

    for (const header of columnHeaders) {
      const th = document.createElement("th");

      th.className = "value";
      th.part = "header value";
      th.innerHTML = header;

      if (units) {
        th.colSpan = 2;
      }

      headerRow.appendChild(th);
    }

    table.appendChild(thead);
    thead.appendChild(headerRow);
  }

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  for (const [i, row] of data.entries()) {
    const rowElt = document.createElement("tr");
    rowElt.part = "body row";

    if (headers) {
      const rowHeader = document.createElement("th");
      rowHeader.className = "key";
      rowHeader.part = "body key";
      rowHeader.innerHTML = rowHeaders[i];
      rowElt.appendChild(rowHeader);
    }

    for (const cell of row) {
      const valueCell = document.createElement("td");

      valueCell.className = "value";
      valueCell.part = "body value";
      valueCell.innerHTML = cell.magnitude;

      rowElt.appendChild(valueCell);

      if (units) {
        const unitCell = document.createElement("td");

        unitCell.className = "unit";
        unitCell.part = "body unit";
        unitCell.appendChild(document.createTextNode(cell.unit));

        rowElt.appendChild(unitCell);
      }
    }

    tbody.appendChild(rowElt);
  }

  return table;
}
