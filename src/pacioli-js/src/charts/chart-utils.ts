/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023-2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { UOM, SIBase, SIUnit } from "uom-ts";
import { PacioliContext } from "../context";
import { getNumber, getCOONumbers } from "../values/numbers";
import * as d3 from "d3";
import { PacioliValue } from "../boxing";
import { PacioliMatrix } from "../values/matrix";
import { PacioliCoordinates } from "../values/coordinates";
import { PacioliTuple } from "../values/tuple";

/**
 * Coord = PacioliCoordinate | string
 * Entry: {coord: Coord, value: number}
 * of meer praktich
 * Entry: {coord?: PacioliCoordinate, name: string, value: number}
 *
 * Scatter/Line List(Tuple(Entry, Entry))
 * Bar/Pie List(Entry)
 * Histogram List(Entry)
 */

interface ChartEntry {
  x: number;
  y: number;
  coordinates?: PacioliCoordinates;
}
/**
 * Datastructure for scatter and line plot.
 */
export interface PairList {
  values: ChartEntry[];
  // coordinates?: PacioliCoordinates[];
  // labels?: [string, string][];
  // rowNameX?: string;
  xUnit: SIUnit;
  yUnit: SIUnit;
  xLower: number;
  xUpper: number;
  yLower: number;
  yUpper: number;
}

export interface DefaultChartOptions {
  width?: number;
  height?: number;
  margin?: { left: number; top: number; right: number; bottom: number };
}

export function dataUnit(data: PacioliValue): UOM<SIBase> {
  switch (data.kind) {
    case "list":
      const items = data as any as PacioliValue[];
      var content = items[0];
      if (content.kind === "matrix") {
        return content.shape.unitAt(0, 0);
      } else {
        throw "exptected a list of numbers but got a list of " + data.kind;
      }
    case "matrix":
      return data.shape.unitAt(0, 0);
    default:
      throw "exptected a vector or a list of numbers but got a " + data.kind;
  }
}

function pairsFromMatrices(
  left: PacioliMatrix,
  right: PacioliMatrix
): PairList | null {
  const n = Math.min(left.shape.nrRows(), right.shape.nrRows());

  if (n === 0) {
    return null;
  } else {
    const vals: ChartEntry[] = [];

    let xLower = left.getNum(0, 0);
    let xUpper = left.getNum(0, 0);
    let yLower = right.getNum(0, 0);
    let yUpper = right.getNum(0, 0);

    for (let i = 0; i < n; i++) {
      const leftNumber = left.getNum(i, 0);
      const rightNumber = right.getNum(i, 0);

      // should equal right coordinates
      const leftCoord = left.shape.rowCoordinates(i); //.shortText;

      vals.push({
        x: leftNumber,
        y: rightNumber,
        coordinates: leftCoord,
      });

      xLower = Math.min(xLower, leftNumber);
      xUpper = Math.max(xUpper, leftNumber);
      yLower = Math.min(yLower, rightNumber);
      yUpper = Math.max(yUpper, rightNumber);
    }

    return {
      values: vals,
      xUnit: left.shape.multiplier, // assume uniform units
      yUnit: right.shape.multiplier, // assume uniform units
      // rowNameX: left.shape.rowName(),
      xLower,
      xUpper,
      yLower,
      yUpper,
    };
  }
}

function pairsFromLists(
  left: PacioliValue[],
  right: PacioliValue[]
): PairList | null {
  const n = Math.min(left.length, right.length);

  if (n === 0) {
    return null;
  } else {
    const vals: ChartEntry[] = [];

    // todo: check this cast
    const l = left as PacioliMatrix[];
    const r = right as PacioliMatrix[];

    let xLower = l[0].getNum(0, 0);
    let xUpper = l[0].getNum(0, 0);
    let yLower = r[0].getNum(0, 0);
    let yUpper = r[0].getNum(0, 0);

    for (let i = 0; i < n; i++) {
      const leftNumber = l[i].getNum(0, 0);
      const rightNumber = r[i].getNum(0, 0);

      vals.push({ x: leftNumber, y: rightNumber });

      xLower = Math.min(xLower, leftNumber);
      xUpper = Math.max(xUpper, leftNumber);
      yLower = Math.min(yLower, rightNumber);
      yUpper = Math.max(yUpper, rightNumber);
    }

    return {
      values: vals,
      xUnit: l[0].shape.multiplier, // assume uniform units
      yUnit: r[0].shape.multiplier, // assume uniform units
      xLower,
      xUpper,
      yLower,
      yUpper,
    };
  }
}

function pairsFromListofScalars(items: PacioliValue[]): PairList {
  var values: ChartEntry[] = [];
  var labels: [string, string][] = [];
  var min;
  var max;

  const includeZeros = true;

  for (var i = 0; i < items.length; i++) {
    var value = (items[i] as PacioliMatrix).getNum(0, 0);

    if (includeZeros || value !== 0) {
      values.push({ x: i, y: value });
      labels.push([i.toString(), i.toString()]);
      if (max === undefined || max < value) max = value;
      if (min === undefined || value < min) min = value;
    }
  }

  // var content = items[0];

  return {
    values,
    // labels,
    xLower: 0,
    xUpper: items.length,
    yLower: min || 0, // todo
    yUpper: max || 1, // todo
    xUnit: UOM.ONE,
    yUnit: (items[0] as PacioliMatrix).getUnit(0, 0), // assume uniform units
  };
}

function pairsFromVector(data: PacioliMatrix): PairList {
  var values: ChartEntry[] = [];
  // var coordinates: PacioliCoordinates[] = [];
  var min;
  var max;

  var numbers = data.numbers;
  var shape = data.shape;

  const includeZeros = true;

  for (var i = 0; i < numbers.length; i++) {
    var factor = 1;
    var value = getNumber(numbers, i, 0) * factor;
    if (includeZeros || value !== 0) {
      values.push({ x: i, y: value, coordinates: shape.rowCoordinates(i) });
      // coordinates.push(shape.rowCoordinates(i));
      if (max === undefined || max < value) max = value;
      if (min === undefined || value < min) min = value;
    }
  }

  return {
    values,
    // coordinates,
    xLower: 0,
    xUpper: numbers.length,
    yLower: min || 0, // todo
    yUpper: max || 1, // todo
    xUnit: UOM.ONE,
    yUnit: shape.unitAt(0, 0), // of multiplier? overal gelijktrekken!
  };
}

/**
 * Attempts to create a list of pairs suitable for display in charts from a PacioliValue.
 *
 * Returns null if the data is empty. Throws an error if the data is not of the right form.
 *
 * Converts the data to the asked unit. (Could be made optional arguments)
 *
 * @param context
 * @param data
 * @param xUnit
 * @param yUnit
 * @param includeZeros
 * @param convert
 * @returns
 */
export function pairListToJs(
  context: PacioliContext,
  data: PacioliValue,
  xUnit?: SIUnit,
  yUnit?: SIUnit
): PairList | null {
  const xConv = xUnit
    ? (x: PacioliMatrix) => x.convertUnit(xUnit, context.unitContext)
    : (x: PacioliMatrix) => x;
  const yConv = yUnit
    ? (y: PacioliMatrix) => y.convertUnit(yUnit, context.unitContext)
    : (x: PacioliMatrix) => x;

  switch (data.kind) {
    case "tuple":
      if (data.length !== 2) {
        throw Error(
          `exptected a pair, but got a tuple of length (${data.length}`
        );
      }

      const left = data[0];
      const right = data[1];

      if (left.kind === "matrix" && right.kind === "matrix") {
        return pairsFromMatrices(xConv(left), yConv(right));
      }

      if (left.kind === "list" && right.kind === "list") {
        const leftEltKind = left[0].kind;
        const rightEltKind = right[0].kind;

        if (leftEltKind !== "matrix") {
          throw Error(
            `exptected a list of numbers in the pair's first list, but got a list of ${leftEltKind}`
          );
        }

        if (rightEltKind !== "matrix") {
          throw Error(
            `exptected a list of numbers in the pair's second list, but got a list of ${rightEltKind}`
          );
        }

        return pairsFromLists(
          (left as PacioliMatrix[]).map(xConv),
          (right as PacioliMatrix[]).map(yConv)
        );
      }

      throw Error(
        `exptected a tuple of vectors or a tuple of number lists, but got a (${left.kind}, ${right.kind}) tuple`
      );

    case "list":
      if (data.length === 0) {
        return null;
      }

      var firstElt = data[0];

      if (firstElt.kind === "matrix") {
        return pairsFromListofScalars((data as PacioliMatrix[]).map(yConv));
      }

      if (firstElt.kind === "tuple") {
        const tuples = data as PacioliTuple[];

        return pairsFromLists(
          tuples.map((x) => x[0]),
          tuples.map((x) => x[1])
        );
      }

      throw "exptected a list of numbers but got a list of " + firstElt.kind;

    case "matrix":
      return pairsFromVector(data);

    default:
      throw "exptected a vector or a list of numbers but got a " + data.kind;
  }
}

// computeChartData
export function transformData(
  context: PacioliContext,
  data: PacioliValue,
  unit: UOM<SIBase>,
  includeZeros: boolean,
  convert: boolean
): {
  values: number[];
  labels: string[];
  max: number;
  min: number;
  label: string;
} {
  var values = [];
  var labels = [];
  var min;
  var max;
  let label = "";

  switch (data.kind) {
    case "list":
      const items = data as any as PacioliValue[];
      var content = items[0];
      if (content.kind === "matrix") {
        var factor = convert
          ? context.unitContext
              .conversionFactor(content.shape.multiplier, unit)
              .toNumber()
          : 1;
        for (var i = 0; i < items.length; i++) {
          var value =
            getNumber((items[i] as PacioliMatrix).numbers, 0, 0) * factor;
          if (includeZeros || value !== 0) {
            values.push(value);
            labels.push(i.toString());
            if (max === undefined || max < value) max = value;
            if (min === undefined || value < min) min = value;
          }
        }
      } else {
        throw "exptected a list of numbers but got a list of " + content.kind;
      }
      break;
    case "matrix":
      var numbers = data.numbers;
      var shape = data.shape;

      label = shape.rowName();

      if (false) {
        var nums = getCOONumbers(numbers);
        var rows = nums[0];
        // var columns = nums[1]
        var vals = nums[2];
        for (var i = 0; i < rows.length; i++) {
          var factor = context.unitContext
            .conversionFactor(shape.unitAt(rows[i], 0), unit)
            .toNumber();
          var value = vals[i] * factor;
          values.push(value);
          labels.push(shape.rowCoordinates(rows[i]).shortText());
          if (max === undefined || max < value) max = value;
          if (min === undefined || value < min) min = value;
        }
      } else {
        for (var i = 0; i < numbers.length; i++) {
          var factor = convert
            ? context.unitContext
                .conversionFactor(shape.unitAt(i, 0), unit)
                .toNumber()
            : 1;
          var value = getNumber(numbers, i, 0) * factor;
          if (includeZeros || value !== 0) {
            values.push(value);
            labels.push(shape.rowCoordinates(i).shortText());
            if (max === undefined || max < value) max = value;
            if (min === undefined || value < min) min = value;
          }
        }
      }
      break;
    default:
      throw "exptected a vector or a list of numbers but got a " + data.kind;
  }

  return {
    values: values,
    labels: labels,
    max: max || 0,
    min: min || 0,
    label,
  };
}

export function displayChartError(
  parent: HTMLElement,
  message: string,
  err: any
) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  parent.appendChild(document.createTextNode(message));
  const par = document.createElement("p");
  par.style.color = "red";
  parent.appendChild(par);
  par.appendChild(document.createTextNode(err));
}

// Tooltips in d3:
// https://observablehq.com/@d3/learn-d3-interaction?collection=@d3/learn-d3
// https://stackoverflow.com/questions/24827589/d3-appending-html-to-nodes
// http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

/**
 * Tooltips for Pacioli charts.
 *
 * A tooltip is a div appended to the page's body (not to the svg!). It is
 * only displayed when the mouse is above some element.
 *
 * This class is a facade for tooltip singletons. It creates a singleton
 * tooltip per css class name. Each chart has a unique class name, so there are
 * (at most) as many tooltips as there are chart types.
 *
 * Attach the tooltip's show and hide methods to the mouseover and mouseout
 * events of the chart elements.
 */
export class ToolTip {
  id: string;

  constructor(public className: string) {
    this.id = className
      .split(" ")
      .filter((x) => x !== "")
      .join(".");
  }

  private findDiv(): d3.Selection<HTMLDivElement, unknown, HTMLElement, any> {
    // See if a tooltip exists
    const tt: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> =
      d3.select("div." + this.id);

    // Return a tooltip parent with default styling. Create it if it does not exist yet.
    return tt.size() > 0
      ? tt
      : d3
          .select("body")
          .append("div")
          .style("position", "absolute")
          .style("background", "white")
          .style("border", "solid 1pt darkgrey")
          .style("border-radius", "4pt")
          .style("padding", "4pt")
          .style("display", "none")
          .attr("class", this.className);
  }

  public show(html: string, x: number, y: number) {
    // Find the tooltip
    const div = this.findDiv();

    // Set the html and the position
    div.html(html);
    div.style("left", x + "px");
    div.style("top", y + "px");

    // Remove the display none style (set initially and by hide) to make the tooltip appear
    div.style("display", null);
  }

  public hide() {
    // Set the display style to none to make the tooltip disappear
    const tt: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> =
      d3.select("div." + this.id);
    tt.style("display", "none");
  }
}

/**
 * Helper for the scatter plot
 *
 * @param dataX
 * @param unitX
 * @param dataY
 * @param unitY
 * @param context
 * @returns
 */
export function mergeData(
  dataX: PacioliValue,
  unitX: UOM<SIBase>,
  dataY: PacioliValue,
  unitY: UOM<SIBase>,
  context: PacioliContext,
  convert: boolean
) {
  const values: { x: number; y: number; coordinates: PacioliCoordinates }[] =
    [];
  const labels: string[] = []; // todo X and Y
  let minX, maxX, minY, maxY: number | undefined;

  if (dataX.kind === "matrix" && dataY.kind === "matrix") {
    // const convert: boolean = false;

    const numbersX = dataX.numbers;
    const numbersY = dataY.numbers;
    const shapeX = dataX.shape;
    const shapeY = dataY.shape;

    const numsX = getCOONumbers(numbersX);
    const rowsX = numsX[0];
    // const columnsX = numsX[1]
    const valsX = numsX[2];

    const numsY = getCOONumbers(numbersY);
    const rowsY = numsY[0];
    // const columnsY = numsY[1]
    const valsY = numsY[2];

    const m = rowsX.length;
    const n = rowsY.length;

    let ptrX = 0;
    let ptrY = 0;

    while (ptrX < m && ptrY < n) {
      const rowX: number = rowsX[ptrX];
      const rowY: number = rowsY[ptrY];
      if (rowX < rowY) {
        const valueX = convert
          ? valsX[ptrX] *
            context.unitContext
              .conversionFactor(shapeX.unitAt(rowX, 0), unitX)
              .toNumber()
          : valsX[ptrX];
        if (valueX !== 0) {
          values.push({
            x: valueX,
            y: 0,
            coordinates: shapeX.rowCoordinates(rowX),
          });
          if (minX === undefined || valueX < minX) minX = valueX;
          if (maxX === undefined || valueX > maxX) maxX = valueX;
        }
        ptrX++;
      } else if (rowX > rowY) {
        const valueY = convert
          ? valsY[ptrY] *
            context.unitContext
              .conversionFactor(shapeY.unitAt(rowY, 0), unitY)
              .toNumber()
          : valsY[ptrY];
        if (valueY !== 0) {
          values.push({
            x: 0,
            y: valueY,
            coordinates: shapeY.rowCoordinates(rowY),
          });
          if (minY === undefined || valueY < minY) minY = valueY;
          if (maxY === undefined || valueY > maxY) maxY = valueY;
        }
        ptrY++;
      } else {
        const valueX = convert
          ? valsX[ptrX] *
            context.unitContext
              .conversionFactor(shapeX.unitAt(rowX, 0), unitX)
              .toNumber()
          : valsX[ptrX];
        const valueY = convert
          ? valsY[ptrY] *
            context.unitContext
              .conversionFactor(shapeY.unitAt(rowY, 0), unitY)
              .toNumber()
          : valsY[ptrY];
        if (valueX !== 0 && valueY !== 0) {
          values.push({
            x: valueX,
            y: valueY,
            coordinates: shapeX.rowCoordinates(rowX),
          });
          if (minX === undefined || valueX < minX) minX = valueX;
          if (maxX === undefined || valueX > maxX) maxX = valueX;
          if (minY === undefined || valueY < minY) minY = valueY;
          if (maxY === undefined || valueY > maxY) maxY = valueY;
        }
        ptrX++;
        ptrY++;
      }
    }
    while (ptrX < m) {
      const rowX = rowsX[ptrX];
      const valueX = convert
        ? valsX[ptrX] *
          context.unitContext
            .conversionFactor(shapeX.unitAt(rowX, 0), unitX)
            .toNumber()
        : valsX[ptrX];
      if (valueX !== 0) {
        values.push({
          x: valueX,
          y: 0,
          coordinates: shapeX.rowCoordinates(rowX),
        });
        if (minX === undefined || valueX < minX) minX = valueX;
        if (maxX === undefined || valueX > maxX) maxX = valueX;
      }
      ptrX++;
    }
    while (ptrY < n) {
      const rowY = rowsY[ptrY];
      const valueY = convert
        ? valsY[ptrY] *
          context.unitContext
            .conversionFactor(shapeY.unitAt(rowY, 0), unitY)
            .toNumber()
        : valsY[ptrY];
      if (valueY !== 0) {
        values.push({
          x: 0,
          y: valueY,
          coordinates: shapeY.rowCoordinates(rowY),
        });
        if (minY === undefined || valueY < minY) minY = valueY;
        if (maxY === undefined || valueY > maxY) maxY = valueY;
      }
      ptrY++;
    }

    return {
      values: values,
      labels: labels,
      maxX: maxX,
      minX: minX,
      maxY: maxY,
      minY: minY,
      rowNameX: shapeX.rowName(),
      rowNameY: shapeY.rowName(),
    };
  } else {
    throw new Error("expected matrix value for scatter plot");
  }
}
