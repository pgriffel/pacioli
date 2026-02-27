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

import * as d3 from "d3";
import { DimNum } from "uom-ts";
import type { PacioliValue } from "../values/pacioli-value";
import {
  appendChartCaption,
  appendEmptyChartMessage,
  combineMargins,
  parseMargin,
  ToolTip,
} from "./chart-utils";
import type { LinearChartData } from "./chart-data";
import { linearChartData } from "./chart-data";
import type { PacioliContext } from "./../context";
import type { PacioliCoordinates } from "../values/coordinates";
import type { DefaultChartOptions } from "./chart-utils";

import { parseUnit } from "../api";

/**
 * Options for Pacioli's ScatterPlot.
 */
export interface ScatterPlotOptions extends DefaultChartOptions {
  xunit?: string;
  yunit?: string;
  convert: boolean;
  xlower?: number;
  xupper?: number;
  ylower?: number;
  yupper?: number;
  xticks?: number;
  yticks?: number;
  xlabel: string;
  ylabel: string;
  radius: number;
  trendline: boolean;
  decimals: number;
  tooltipOffset: { dx: number; dy: number };
}

export type ScatterPlotEvent = CustomEvent<{
  x: DimNum;
  y: DimNum;
  element?: PacioliCoordinates;
  options: ScatterPlotOptions;
}>;

const DEFAULT_CHART_MARGIN = { left: 48, top: 32, right: 24, bottom: 48 };

/**
 * Default options for the ScatterPlot
 */
const DEFAULT_SCATTER_PLOT_OPTIONS = {
  width: 640,
  height: 360,
  xlabel: "x",
  ylabel: "y",
  radius: 5,
  trendline: false,
  decimals: 2,
  convert: true,
  tooltipOffset: { dx: 16, dy: -64 },
};

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
   * The ScatterPlot options. Is initialized with DEFAULT_SCATTER_PLOT_OPTIONS and
   * the options provided in the constructor call.
   */
  public readonly options: ScatterPlotOptions;

  public clickHandler?: (event: ScatterPlotEvent) => void =
    scatterPlotClickHandler;

  public tooltipText?: (event: ScatterPlotEvent) => string = scatterPlotTooltip;

  constructor(
    private readonly data: PacioliValue,
    private readonly context: PacioliContext,
    options: Partial<ScatterPlotOptions>,
  ) {
    this.options = { ...DEFAULT_SCATTER_PLOT_OPTIONS, ...options };
  }

  public draw(parent: HTMLElement) {
    // Determine the data
    const data = linearChartData(
      this.context,
      this.data,
      this.options.convert && this.options.xunit !== undefined
        ? parseUnit(this.options.xunit)
        : undefined,
      this.options.convert && this.options.yunit !== undefined
        ? parseUnit(this.options.yunit)
        : undefined,
    );

    const margin = combineMargins(
      DEFAULT_CHART_MARGIN,
      parseMargin(this.options.margin),
    );

    // Determine the drawing dimensions
    const width = this.options.width - margin.left - margin.right;
    const height = this.options.height - margin.top - margin.bottom;

    // Make the parent node empty
    while (parent.firstChild) {
      parent.firstChild.remove();
    }

    // Create an svg element under the parent
    const svg = d3
      .select(parent)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "pacioli chart scatter-plot");

    // Append the scatterplot
    if (data === null) {
      appendEmptyChartMessage(svg, "No data", this.options);
    } else {
      const group = svg
        .append("g")
        .attr(
          "transform",
          `translate(${margin.left.toString()},${margin.top.toString()})`,
        );

      appendScatterPlot(
        group,
        data,
        width,
        height,
        this.options,
        this.clickHandler,
        this.tooltipText,
      );
    }

    // Add the caption above all other elements
    appendChartCaption(svg, this.options);
  }
}

function scatterPlotTooltip(event: ScatterPlotEvent): string {
  const { x, y, options, element } = event.detail;
  const xNum = x.toFixed(options.decimals);
  const yNum = y.toFixed(options.decimals);
  const eltText = element ? `${element.names.join(",")}:<br>` : "";
  return `${eltText}${options.xlabel} = ${xNum}
      <br>
      ${options.ylabel} = ${yNum}`;
}

function scatterPlotClickHandler(event: ScatterPlotEvent) {
  const { x, y, options, element } = event.detail;
  const xNum = x.toText();
  const yNum = y.toText();
  const eltText = element ? `${element.names.join(",")}\n` : "";
  alert(`${eltText}${options.xlabel} = ${xNum}\n${options.ylabel} = ${yNum}`);
}

/**
 * Appends a d3 scatter plot to an svg element.
 *
 * Helper for the scatter plot chart.
 *
 * @param group
 * @param data
 * @param width
 * @param height
 * @param options
 */
function appendScatterPlot(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: LinearChartData,
  width: number,
  height: number,
  options: ScatterPlotOptions,
  clickHandler?: (event: ScatterPlotEvent) => void,
  tooltipText?: (event: ScatterPlotEvent) => string,
) {
  const unitX = data.xUnit;
  const unitY = data.yUnit;
  const values = data.values;

  // Determine the chart's bounds
  const lowerX = options.xlower ?? data.xLower;
  const upperX = options.xupper ?? data.xUpper;
  const lowerY = options.ylower ?? data.yLower;
  const upperY = options.yupper ?? data.yUpper;

  // Create x and y scales mapping the scatterplot layout to the drawing dimensions
  const xScale = d3.scaleLinear().domain([lowerX, upperX]).range([0, width]);
  const yScale = d3.scaleLinear().domain([lowerY, upperY]).range([height, 0]);

  // Create the axes
  const xAxis = d3.axisBottom(xScale).ticks(options.xticks);
  const yAxis = d3.axisLeft(yScale).ticks(options.yticks);

  // Add the x axis
  const xAxisElt = group
    .append("g")
    .attr("transform", `translate(0,${height.toString()})`)
    .attr("class", "x axis");

  xAxisElt.append("g").call(xAxis);

  const labelX = options.xlabel;

  xAxisElt
    .append("text")
    .attr("x", width)
    .attr("y", 32)
    .style("text-anchor", "end")
    .text(`${labelX} [${unitX.toText()}] (n=${values.length.toString()})`);

  // Add the y axis
  const labelY = options.ylabel;
  const yAxisGroup = group.append("g").attr("class", "y axis");

  yAxisGroup
    .append("g")
    // .attr("class", "y axis")
    .call(yAxis);

  yAxisGroup
    .append("text")
    .attr("x", -16)
    .attr("y", -16)
    //.style("text-anchor", "centers")
    .text(labelY + " [" + unitY.toText() + "]");

  // Create a tooltip parent with default styling.
  const tooltip = new ToolTip("pacioli tooltip scatter-plot");

  // Add dots for the data
  // https://htmlcssjavascript.com/web/mastering-svg-bonus-content-a-d3-line-chart/
  // https://stackoverflow.com/questions/44354851/array-map-vs-d3-selectall-data-enter

  group
    .selectAll(null)
    .data(values)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", options.radius)
    .attr("cx", function (d) {
      return xScale(d.x);
    })
    .attr("cy", function (d) {
      return yScale(d.y);
    })
    .on("click", (_, d) => {
      tooltip.hide();
      if (clickHandler) {
        setTimeout(() => {
          const evt = new CustomEvent("onclick", {
            detail: {
              x: DimNum.fromNumber(d.x, unitX),
              y: DimNum.fromNumber(d.y, unitY),
              options: options,
              element: d.coordinates,
            },
          });
          clickHandler(evt);
        }, 0);
      }
    })
    .on("mouseover", (event: MouseEvent, d) => {
      if (tooltipText) {
        tooltip.show(
          tooltipText(
            new CustomEvent("tooltip", {
              detail: {
                x: DimNum.fromNumber(d.x, unitX),
                y: DimNum.fromNumber(d.y, unitY),
                options: options,
                element: d.coordinates,
              },
            }),
          ),
          event.pageX + options.tooltipOffset.dx,
          event.pageY + options.tooltipOffset.dy,
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

  if (options.trendline && values.length > 0) {
    const xs = [];
    const ys = [];
    let max = values[0].x;
    let min = values[0].y;
    for (const value of values) {
      const xi = value.x;
      const yi = value.y;
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
}

// from http://trentrichardson.com/2010/04/06/compute-linear-regressions-in-javascript/
function linearRegression(x: number[], y: number[]) {
  const n = y.length;

  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;
  let sum_yy = 0;

  for (const [i, element] of y.entries()) {
    sum_x += x[i];
    sum_y += element;
    sum_xy += x[i] * element;
    sum_xx += x[i] * x[i];
    sum_yy += element * element;
  }

  const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);

  return {
    slope: slope,
    intercept: (sum_y - slope * sum_x) / n,
    r2: Math.pow(
      (n * sum_xy - sum_x * sum_y) /
        Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)),
      2,
    ),
  };
}
