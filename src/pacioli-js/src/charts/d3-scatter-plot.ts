/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023 Paul Griffioen
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

import * as d3 from "d3";
import { DimNum, SIBase, UOM } from "uom-ts";
import { PacioliValue } from "../value";
import { getCOONumbers } from "../values/numbers";
import { dataUnit, displayChartError } from "./chart-utils";
import { PacioliContext } from "./../context";
import { Coordinates } from "../values/coordinates";
import { SIUnit } from "uom-ts";
import { DefaultChartOptions, ToolTip } from "./chart-utils";

/**
 * Options for Pacioli's ScatterPlot.
 */
export interface ScatterPlotOptions extends DefaultChartOptions {
  xunit?: SIUnit;
  yunit?: SIUnit;
  convert?: boolean;
  // xuom?: SIUnit,
  // yuom?: SIUnit,
  xlower?: number;
  xupper?: number;
  ylower?: number;
  yupper?: number;
  xlabel?: string;
  ylabel?: string;
  radius?: number;
  trendline?: boolean;
  decimals?: number;
  onclick?: (data: { x: DimNum; y: DimNum; element: Coordinates }) => void;
  tooltip?: (valueX: DimNum, valueY: DimNum, element: Coordinates) => string;
  tooltipOffset?: { dx: number; dy: number };
}

/**
 * A scatter plot for Pacioli
 *
 * Adds css classes pacioli-ts-chart and pacioli-ts-scatter-plot to the chart svg.
 *
 * Adds css classes x and axis to the chart's x-axis.
 *
 * Adds css classes y and axis to the chart's y-axis.
 *
 * Adds css class dot to the chart's circles.
 */
export class ScatterPlot {
  /**
   * Declaration of all ScatterPlot options. They are set in the constructor.
   */
  options: {
    width: number;
    height: number;
    margin: { left: number; top: number; right: number; bottom: number };
    xunit?: SIUnit;
    yunit?: SIUnit;
    convert: boolean;
    // xuom?: SIUnit,
    // yuom?: SIUnit,
    xlower?: number;
    xupper?: number;
    ylower?: number;
    yupper?: number;
    xlabel: string;
    ylabel: string;
    radius: number;
    trendline: boolean;
    decimals: number;
    onclick?: (data: { x: DimNum; y: DimNum; element: Coordinates }) => void;
    tooltip?: (valueX: DimNum, valueY: DimNum, element: Coordinates) => string;
    tooltipOffset: { dx: number; dy: number };
  };

  /**
   * Default options for the ScatterPlot
   */
  readonly defaultOptions = {
    width: 640,
    height: 360,
    margin: { left: 40, top: 20, right: 20, bottom: 50 },
    xlabel: "",
    ylabel: "",
    radius: 5,
    trendline: false,
    decimals: 2,
    convert: true,
    onclick: this.clickHandler.bind(this),
    tooltip: this.defaultTooltip.bind(this),
    tooltipOffset: { dx: -50, dy: -120 },
  };

  public defaultTooltip(x: DimNum, y: DimNum, element: Coordinates): string {
    return `${element.names}:<br>
    ${this.options.xlabel} = ${x.toFixed(this.options.decimals)}
    <br>
    ${this.options.ylabel} = ${y.toFixed(this.options.decimals)}`;
  }

  public clickHandler(data: { x: DimNum; y: DimNum; element: Coordinates }) {
    const indexSets = data.element.indexSets.map(function (x: any) {
      return x.name;
    });
    alert(`Values for element ${data.element.names} of index ${indexSets} are
  ${this.options.xlabel} = ${data.x.toFixed(this.options.decimals)}
  ${this.options.ylabel} = ${data.y.toFixed(this.options.decimals)}`);
  }

  constructor(
    private dataX: PacioliValue,
    private dataY: PacioliValue,
    private context: PacioliContext,
    options: ScatterPlotOptions
  ) {
    this.options = { ...this.defaultOptions, ...options };
  }

  public draw(parent: HTMLElement) {
    try {
      // Determine the data
      const unitX = this.options.xunit || dataUnit(this.dataX);
      const unitY = this.options.yunit || dataUnit(this.dataY);
      const data = mergeData(
        this.dataX,
        unitX,
        this.dataY,
        unitY,
        this.context,
        this.options.convert
      );
      const values = data.values;

      // Create an array with the bin tresholds and generate a scatterplot layout from it for the data
      const lowerX =
        this.options.xlower === undefined
          ? (data.minX as number)
          : this.options.xlower;
      const upperX =
        this.options.xupper === undefined
          ? (data.maxX as number)
          : this.options.xupper;
      const lowerY =
        this.options.ylower === undefined
          ? (data.minY as number)
          : this.options.ylower;
      const upperY =
        this.options.yupper === undefined
          ? (data.maxY as number)
          : this.options.yupper;

      // Determine the drawing dimensions
      const margin = this.options.margin;
      const width = this.options.width - margin.left - margin.right;
      const height = this.options.height - margin.top - margin.bottom;

      // Create x and y scales mapping the scatterplot layout to the drawing dimensions
      const xScale = d3
        .scaleLinear()
        .domain([lowerX, upperX])
        .range([0, width]);
      const yScale = d3
        .scaleLinear()
        .domain([lowerY, upperY])
        .range([height, 0]);

      // Create the axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Make the parent node empty
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      // Create an svg element under the parent
      const svg = d3
        .select(parent)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "pacioli-ts-chart pacioli-ts-scatter-plot");

      const group = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Add the x axis
      const xAxisElt = group
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis");

      xAxisElt.append("g").call(xAxis);

      const labelX = this.options.xlabel || data.rowNameX;
      xAxisElt
        .append("text")
        .attr("x", width)
        .attr("y", 26)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(labelX + " [" + unitX.toText() + "] (n=" + values.length + ")");

      // Add the y axis
      const labelY = this.options.ylabel || data.rowNameY;
      const yAxisGroup = group.append("g").attr("class", "y axis");

      yAxisGroup
        .append("g")
        // .attr("class", "y axis")
        .call(yAxis);

      yAxisGroup
        .append("text")
        .attr("x", 2)
        .attr("dy", "-.71em")
        //.style("text-anchor", "centers")
        .text(labelY + " [" + unitY.toText() + "]");

      // Create a tooltip parent with default styling.
      const tooltip = new ToolTip("pacioli-ts-scatter-plot");

      // Add dots for the data
      // https://htmlcssjavascript.com/web/mastering-svg-bonus-content-a-d3-line-chart/
      // https://stackoverflow.com/questions/44354851/array-map-vs-d3-selectall-data-enter

      group
        .selectAll(null)
        .data(values)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", this.options.radius)
        .attr("cx", function (d) {
          return xScale(d.x);
        })
        .attr("cy", function (d) {
          return yScale(d.y);
        })
        .on("click", (_, data) => {
          tooltip.hide();
          if (this.options.onclick) {
            setTimeout(() => {
              this.options.onclick!({
                x: new DimNum(data.x, unitX),
                y: new DimNum(data.y, unitY),
                element: data.coordinates,
              });
            }, 0);
          }
        })
        .on("mouseover", (event, d) => {
          if (this.options.tooltip) {
            tooltip.show(
              this.options.tooltip(
                new DimNum(d.x, unitX),
                new DimNum(d.y, unitY),
                d.coordinates
              ),
              event.pageX + this.options.tooltipOffset.dx,
              event.pageY + this.options.tooltipOffset.dy
            );
          }
        })
        .on("mouseout", () => {
          tooltip.hide();
        });

      //  const legend = svg.selectAll(".legend")
      //      .data(color.domain())
      //    .enter().append("g")
      //      .attr("class", "legend")
      //      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      //  legend.append("rect")
      //      .attr("x", width - 18)
      //      .attr("width", 18)
      //      .attr("height", 18)
      //      .style("fill", color);
      //
      //  legend.append("text")
      //      .attr("x", width - 24)
      //      .attr("y", 9)
      //      .attr("dy", ".35em")
      //      .style("text-anchor", "end")
      //      .text(function(d) { return d; });

      if (this.options.trendline && values.length > 0) {
        const xs = [];
        const ys = [];
        let max = values[0].x;
        let min = values[0].x;
        for (let i = 0; i < values.length; i++) {
          const xi = values[i].x;
          const yi = values[i].y;
          xs.push(xi);
          ys.push(yi);
          if (max < xi) max = xi;
          if (xi < min) min = xi;
        }
        const lr = linearRegression(xs, ys);

        const x1 = min;
        const y1 = x1 * lr.slope + lr.intercept;
        const x2 = max;
        const y2 = x2 * lr.slope + lr.intercept;

        group
          .append("line")
          .attr("x1", xScale(x1))
          .attr("y1", yScale(y1))
          .attr("x2", xScale(x2))
          .attr("y2", yScale(y2))
          .attr("stroke", "#ccc")
          .attr("stroke-width", 1);
      }
    } catch (err) {
      displayChartError(
        parent,
        "While drawing scatter plot '" + this.options.xlabel + "':",
        err
      );
    }

    return this;
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
function mergeData(
  dataX: PacioliValue,
  unitX: UOM<SIBase>,
  dataY: PacioliValue,
  unitY: UOM<SIBase>,
  context: PacioliContext,
  convert: boolean
) {
  const values: { x: number; y: number; coordinates: Coordinates }[] = [];
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
            context.unitContext.conversionFactor(shapeX.unitAt(rowX, 0), unitX)
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
            context.unitContext.conversionFactor(shapeY.unitAt(rowY, 0), unitY)
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
            context.unitContext.conversionFactor(shapeX.unitAt(rowX, 0), unitX)
          : valsX[ptrX];
        const valueY = convert
          ? valsY[ptrY] *
            context.unitContext.conversionFactor(shapeY.unitAt(rowY, 0), unitY)
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
          context.unitContext.conversionFactor(shapeX.unitAt(rowX, 0), unitX)
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
          context.unitContext.conversionFactor(shapeY.unitAt(rowY, 0), unitY)
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

// from http://trentrichardson.com/2010/04/06/compute-linear-regressions-in-javascript/
function linearRegression(x: number[], y: number[]) {
  const n = y.length;

  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;
  let sum_yy = 0;

  for (let i = 0; i < y.length; i++) {
    sum_x += x[i];
    sum_y += y[i];
    sum_xy += x[i] * y[i];
    sum_xx += x[i] * x[i];
    sum_yy += y[i] * y[i];
  }

  const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);

  return {
    slope: slope,
    intercept: (sum_y - slope * sum_x) / n,
    r2: Math.pow(
      (n * sum_xy - sum_x * sum_y) /
        Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)),
      2
    ),
  };
}
