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

import { SIUnit } from "uom-ts";
import type { PacioliContext } from "../context";
import { getNumber } from "../raw-values/raw-matrix";
import type { PacioliValue } from "../values/pacioli-value";
import type { PacioliMatrix } from "../values/matrix";
import type { PacioliCoordinates } from "../values/coordinates";
import type { PacioliTuple } from "../values/tuple";

interface LinearChartEntry {
  x: number;
  y: number;
  coordinates?: PacioliCoordinates;
}

/**
 * Datastructure for scatter and line plot.
 */
export interface LinearChartData {
  values: LinearChartEntry[];
  xUnit: SIUnit;
  yUnit: SIUnit;
  xLower: number;
  xUpper: number;
  yLower: number;
  yUpper: number;
}

/**
 * Attempts to create a list of pairs suitable for display in charts from a PacioliValue.
 *
 * Returns null if the data is empty. Throws an error if the data is not of the right form.
 *
 * Converts the data to the asked unit if provided.
 *
 * @param context
 * @param data
 * @param xUnit
 * @param yUnit
 * @param includeZeros
 * @param convert
 * @returns
 */
export function linearChartData(
  context: PacioliContext,
  data: PacioliValue,
  xUnit?: SIUnit,
  yUnit?: SIUnit
): LinearChartData | null {
  const xConv = xUnit
    ? (x: PacioliMatrix) => x.convertUnit(xUnit, context.unitContext)
    : (x: PacioliMatrix) => x;
  const yConv = yUnit
    ? (y: PacioliMatrix) => y.convertUnit(yUnit, context.unitContext)
    : (x: PacioliMatrix) => x;

  switch (data.kind) {
    case "tuple": {
      if (data.length !== 2) {
        throw Error(
          `exptected a pair, but got a tuple of length (${data.length.toString()}`
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
    }
    case "list": {
      if (data.length === 0) {
        return null;
      }

      const firstElt = data[0];

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

      throw Error(
        "exptected a list of numbers but got a list of " + firstElt.kind
      );
    }
    case "matrix": {
      return pairsFromVector(data);
    }
    default: {
      throw Error(
        "exptected a vector or a list of numbers but got a " + data.kind
      );
    }
  }
}

export interface BandChartEntry {
  label: string;
  value: number;
  coordinates?: PacioliCoordinates;
}

/**
 * Datastructure for bart charts, pie charts and histograms.
 */
export interface BandChartData {
  entries: BandChartEntry[];
  max: number;
  min: number;
  label: string;
  unit: SIUnit;
}

/**
 * Attempts to create data suitable for charts with a band scale. Used by the bar chart,
 * the pie chart, and the histogram.
 *
 * Returns null if the data is empty (TODO). Throws an error if the data is not of the right form.
 *
 * Converts the data to the asked unit if provided.
 *
 * TODO: allow empty data with type BandChartData | null
 *
 * @param context
 * @param data
 * @param includeZeros
 * @param unit
 * @returns
 */
export function bandChartData(
  context: PacioliContext,
  data: PacioliValue,
  includeZeros: boolean,
  unit?: SIUnit
): BandChartData | null {
  const convert = unit
    ? (x: PacioliMatrix) => x.convertUnit(unit, context.unitContext)
    : (x: PacioliMatrix) => x;

  switch (data.kind) {
    case "list":
      return bandChartDataFromList(data, includeZeros, convert);
    case "matrix":
      return bandChartDataFromVector(convert(data), includeZeros);
    default:
      throw Error(
        "exptected a vector or a list of numbers but got a " + data.kind
      );
  }
}

function pairsFromMatrices(
  left: PacioliMatrix,
  right: PacioliMatrix
): LinearChartData | null {
  const n = Math.min(left.shape.nrRows(), right.shape.nrRows());

  if (n === 0) {
    return null;
  } else {
    const vals: LinearChartEntry[] = [];

    let xLower = left.getNum(0, 0);
    let xUpper = left.getNum(0, 0);
    let yLower = right.getNum(0, 0);
    let yUpper = right.getNum(0, 0);

    for (let i = 0; i < n; i++) {
      const leftNumber = left.getNum(i, 0);
      const rightNumber = right.getNum(i, 0);

      // should equal right coordinates
      const leftCoord = left.shape.rowCoordinates(i);

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
): LinearChartData | null {
  const n = Math.min(left.length, right.length);

  if (n === 0) {
    return null;
  } else {
    const vals: LinearChartEntry[] = [];

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

function pairsFromListofScalars(
  items: PacioliValue[],
  includeZeros: boolean = true
): LinearChartData {
  const values: LinearChartEntry[] = [];
  let min;
  let max;

  for (let i = 0; i < items.length; i++) {
    const value = (items[i] as PacioliMatrix).getNum(0, 0);

    if (includeZeros || value !== 0) {
      values.push({ x: i, y: value });

      if (max === undefined || max < value) max = value;
      if (min === undefined || value < min) min = value;
    }
  }

  return {
    values,
    xLower: 0,
    xUpper: items.length,
    yLower: min ?? 0, // todo
    yUpper: max ?? 1, // todo
    xUnit: SIUnit.ONE,
    yUnit: (items[0] as PacioliMatrix).getUnit(0, 0), // assume uniform units
  };
}

function pairsFromVector(
  data: PacioliMatrix,
  includeZeros: boolean = true
): LinearChartData {
  const values: LinearChartEntry[] = [];
  let min;
  let max;

  const numbers = data.numbers;
  const shape = data.shape;

  for (let i = 0; i < numbers.length; i++) {
    const factor = 1;
    const value = getNumber(numbers, i, 0) * factor;
    if (includeZeros || value !== 0) {
      values.push({ x: i, y: value, coordinates: shape.rowCoordinates(i) });
      if (max === undefined || max < value) max = value;
      if (min === undefined || value < min) min = value;
    }
  }

  return {
    values,
    xLower: 0,
    xUpper: numbers.length,
    yLower: min ?? 0, // todo
    yUpper: max ?? 1, // todo
    xUnit: SIUnit.ONE,
    yUnit: shape.unitAt(0, 0),
  };
}

export function bandChartDataFromList(
  items: PacioliValue[],
  includeZeros: boolean,
  conv: (x: PacioliMatrix) => PacioliMatrix
): BandChartData | null {
  const values: BandChartEntry[] = [];
  let min;
  let max;

  if (items.length === 0) {
    return null;
  }

  const content = items[0];

  if (content.kind === "matrix") {
    for (let i = 0; i < items.length; i++) {
      const mat = conv(items[i] as PacioliMatrix);
      const value = getNumber(mat.numbers, 0, 0);

      if (includeZeros || value !== 0) {
        values.push({ value, label: i.toString() });

        if (max === undefined || max < value) max = value;
        if (min === undefined || value < min) min = value;
      }
    }

    return {
      entries: values,
      unit: conv(content).getUnit(0, 0),
      max: max ?? 0,
      min: min ?? 0,
      label: "", // TODO? Is this used?
    };
  } else if (content.kind === "tuple") {
    for (let i = 0; i < items.length; i++) {
      const tup = items[i] as PacioliTuple;

      if (tup[1].kind !== "matrix") {
        throw Error(
          `Second tuple element for chart data must be a matrix, not a ${tup[1].kind}`
        );
      }

      const mat: PacioliMatrix = conv(tup[1]);

      const value = getNumber(mat.numbers, 0, 0);

      if (includeZeros || value !== 0) {
        let label = (i + 1).toString();

        // TODO: Use toText here?
        if (tup[0].kind === "coordinates") {
          label = tup[0].shortText();
        } else if (tup[0].kind === "string") {
          label = tup[0].value;
        }

        values.push({ value, label });

        if (max === undefined || max < value) max = value;
        if (min === undefined || value < min) min = value;
      }
    }

    return {
      entries: values,
      unit: conv(content[1] as PacioliMatrix).getUnit(0, 0),
      max: max ?? 0,
      min: min ?? 0,
      label: "", // TODO? Is this used?
    };
  } else {
    throw Error(
      "exptected a list of numbers but got a list of " + content.kind
    );
  }
}

export function bandChartDataFromVector(
  data: PacioliMatrix,
  includeZeros: boolean
): BandChartData | null {
  const numbers = data.numbers;
  const shape = data.shape;
  const n = data.shape.nrRows();

  const values: BandChartEntry[] = [];
  let min;
  let max;

  for (let i = 0; i < n; i++) {
    const value = getNumber(numbers, i, 0);
    const coordinates = shape.rowCoordinates(i);

    if (includeZeros || value !== 0) {
      values.push({
        value,
        label: coordinates.shortText(),
        coordinates,
      });

      if (max === undefined || max < value) max = value;
      if (min === undefined || value < min) min = value;
    }
  }

  return {
    entries: values,
    unit: data.getUnit(0, 0),
    max: max ?? 0,
    min: min ?? 0,
    label: shape.rowName(),
  };
}
