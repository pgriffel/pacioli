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

import * as d3 from "d3";
import type { PacioliValue } from "../boxing";
import type {
  DefaultChartOptions} from "./chart-utils";
import {
  appendChartCaption,
  appendEmptyChartMessage,
  combineMargins,
  displayChartError,
  parseMargin,
  ToolTip,
} from "./chart-utils";
import type { LinearChartData} from "./chart-data";
import { linearChartData } from "./chart-data";
import type { PacioliContext } from "./../context";
import { DimNum } from "uom-ts";
import { parseUnit } from "../api";

/**
 * Options for the Pacioli line chart
 */
export interface LineChartOptions extends DefaultChartOptions {
  decimals?: number;
  unit?: string;
  xunit?: string;
  yunit?: string;
  convert?: boolean;
  xlabel: string;
  ylabel: string;
  norm?: number;
  ylower?: number;
  yupper?: number;
  xticks?: number;
  yticks?: number;
  rotate?: boolean;
  smooth?: boolean;
  zeros?: boolean;
  onclick?: (x: DimNum, y: DimNum, options: LineChartOptions) => void;
  tooltip?: (x: DimNum, y: DimNum, options: LineChartOptions) => string;
  tooltipOffset: { dx: number; dy: number };
}

const DEFAULT_CHART_MARGIN = { left: 64, top: 32, right: 16, bottom: 40 };

/**
 * Default options for the Pacioli line chart.
 */
const DEFAULT_LINE_CHART_OPTIONS = {
  width: 640,
  height: 360,
  decimals: 2,
  xlabel: "x",
  ylabel: "y",
  rotate: false,
  smooth: false,
  zeros: true,
  convert: true,
  onclick: lineChartClickHandler,
  tooltip: lineChartTooltip,
  tooltipOffset: { dx: 16, dy: -64 },
};

/**
 * A line chart for Pacioli
 *
 * Adds css classes pacioli-ts-chart and pacioli-ts-line-chart to the chart svg.
 *
 * Adds css classes x and axis to the chart's x-axis.
 *
 * Adds css classes y and axis to the chart's y-axis.
 *
 * Adds css class data to the chart's path.
 */
export class LineChart {
  public readonly options: LineChartOptions;

  constructor(
    public readonly data: PacioliValue,
    private readonly context: PacioliContext,
    options: Partial<LineChartOptions>
  ) {
    this.options = { ...DEFAULT_LINE_CHART_OPTIONS, ...options };
  }

  public draw(parent: HTMLElement) {
    try {
      const unit =
        this.options.unit && this.options.unit !== ""
          ? parseUnit(this.options.unit)
          : undefined;

      const xunit =
        this.options.xunit && this.options.xunit !== ""
          ? parseUnit(this.options.xunit)
          : undefined;

      const yunit =
        this.options.yunit && this.options.yunit !== ""
          ? parseUnit(this.options.yunit)
          : undefined;

      // Transform the data to a usable format
      const data = linearChartData(
        this.context,
        this.data,
        xunit || unit,
        yunit || unit
      );

      // Make the parent node empty
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      // Define dimensions of graph
      const m = combineMargins(
        DEFAULT_CHART_MARGIN,
        parseMargin(this.options.margin)
      );

      const w = this.options.width - m.left - m.right;
      const h = this.options.height - m.top - m.bottom;

      // Add an SVG element with the desired dimensions and margin.
      const svg = d3
        .select(parent)
        .append("svg")
        .attr("width", w + m.left + m.right)
        .attr("height", h + m.top + m.bottom)
        .attr("class", "pacioli chart line-chart");

      if (data !== null) {
        // Add a group to allow attr's to apply to everything in the group
        const group = svg
          .append("g")
          .attr("width", w)
          .attr("height", h)
          .attr("transform", "translate(" + m.left + "," + m.top + ")");

        appendLineChart(group, data, w, h, this.options);
      } else {
        appendEmptyChartMessage(svg, "No data", this.options);
      }

      // Add the caption above all other elements
      appendChartCaption(svg, this.options);
    } catch (err) {
      console.log(err);
      displayChartError(
        parent,
        "While drawing line chart '" + this.options.ylabel + "':",
        err
      );
    }
  }
}

/**
 * Default click handler for the line chart.
 *
 * @param label
 * @param number
 * @param options
 */
function lineChartClickHandler(
  label: DimNum,
  number: DimNum,
  options: LineChartOptions
) {
  alert(
    `${options.xlabel} = ${label.toText()}\n${
      options.ylabel
    } = ${number.toText()}`
  );
}

/**
 * Default tooltip for the line chart.
 *
 * @param label
 * @param number
 * @param options
 * @returns
 */
function lineChartTooltip(
  label: DimNum,
  number: DimNum,
  options: LineChartOptions
) {
  return `${options.xlabel} = ${label.toFixed(options.decimals)} <br> ${
    options.ylabel
  } = ${number.toFixed(options.decimals)}`;
}

/**
 * Appends a d3 line chart to a svg group
 *
 * @param group
 * @param data
 * @param w
 * @param h
 * @param options
 */
function appendLineChart(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: LinearChartData,
  w: number,
  h: number,
  options: LineChartOptions
) {
  const yMin = options.ylower !== undefined ? options.ylower : data.yLower;
  const yMax = options.yupper !== undefined ? options.yupper : data.yUpper;
  const xMin = data.xLower;
  const xMax = data.xUpper;

  // Determine data ranges
  const xScale = d3.scaleLinear([xMin, xMax], [0, w]);
  const yScale = d3.scaleLinear([yMin, yMax], [h, 0]);

  // Create the x axis
  // const mod = options.xticks
  // ? Math.ceil(data.values.length / options.xticks)
  // : 1;
  const xAxis = d3.axisBottom(xScale).tickSize(-h); //.ticks(20, "s");
  // .tickValues(
  //   xScale.domain().filter(function (_, i) {
  //     return !(i % mod);
  //   })
  // );

  const xElt = group
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")");

  xElt.append("g").call(xAxis);

  if (options.rotate) {
    xElt
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)");
  } else {
    xElt.selectAll("text").attr("transform", "translate(0, 5)");
  }

  xElt
    .append("text")
    .attr("x", w)
    .attr("y", 24)
    .attr("dy", "0.71em")
    .style("text-anchor", "end")
    .text(
      options.xlabel +
        " [" +
        data.xUnit.toText() +
        "] (n=" +
        data.values.length +
        ")"
    );

  // create y axis
  const yAxisLeft = d3.axisLeft(yScale).ticks(options.yticks);

  const yAxisElt = group
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)");

  yAxisElt.append("g").call(yAxisLeft);

  yAxisElt
    .append("text")
    .attr("x", -16)
    .attr("y", -16)
    .style("text-anchor", "begin")
    .text((_) => options.ylabel + " [" + data.yUnit.toText() + "]");

  // Add a norm line if requested
  const norm = options.norm;
  if (norm && data !== null) {
    const normline = d3
      .line()
      .x(([i, _]) => {
        // return xScale(data.labels[i]) || 0;
        return xScale(i) || 0;
      }) // is xScale correct? not used anywhere else. below is different!!!
      .y(function (_) {
        return yScale(norm);
      });
    group
      .append("path")
      .attr("d", normline(data.values.map((entry, i) => [i, entry.y]))) // TODO: check this
      .attr("class", "")
      .attr("stroke", "green");
  }

  // Create a line function that converts the data into x and y points
  const line = d3
    .line()
    .x(([i, _]) => xScale(i))
    .y(([_, d]) => yScale(d));

  // Make the line smooth if requested
  if (options.smooth) {
    line.curve(d3.curveCardinal);
  }

  // Add lines AFTER the axes above so that the line is above the tick-lines
  group
    .append("path")
    .attr("d", line(data.values.map((entry) => [entry.x, entry.y])))
    .attr("class", "data");

  // Create a tooltip parent with default styling.
  const tooltipDot = group
    .append("circle")
    .attr("r", 3)
    .style("display", "none")
    // .style("position", "absolute")
    .style("fill", "grey");
  // .style("border", "solid 1pt darkgrey")
  // .style("border-radius", "4pt")
  // .style("padding", "4pt")
  // .style("display", "none")
  // .attr("class", "pacioli-ts-line-chart")

  const tooltip = new ToolTip("pacioli tooltip line-chart");

  const xdelta = data.xUpper - data.xLower;
  const xwidth = xdelta === 0 ? 0 : w / xdelta;

  group
    .selectAll(".hitbox")
    .data(data.values)
    .enter()
    .append("rect")
    .attr("x", (entry) => (entry.x - 0) * xwidth)
    // .attr("y", ([_, d]) => yScale(d))
    .attr("y", 0)
    .attr("width", xwidth - 1)
    .attr("height", h)
    .style("fill", "none")
    .style("pointer-events", "all")
    // .style("display", "none")
    .on("click", (_, entry) => {
      if (options.onclick) {
        tooltip.hide();
        tooltipDot.style("display", "none");
        // Without the timeout the display: none does not have an effect
        setTimeout(() => {
          options.onclick!(
            DimNum.fromNumber(entry.x, data.xUnit),
            DimNum.fromNumber(entry.y, data.yUnit),
            options
          );
        }, 0);
      }
    })
    .on("mouseover", (event, entry) => {
      if (options.tooltip) {
        // Call the tooltip callback to get the HTML to display
        tooltip.show(
          options.tooltip(
            DimNum.fromNumber(entry.x, data.xUnit),
            DimNum.fromNumber(entry.y, data.yUnit),
            options
          ),
          event.pageX + options.tooltipOffset.dx,
          event.pageY + options.tooltipOffset.dy
        );

        // Show the dot on the graph's line
        tooltipDot.attr("cx", (entry.x - 0) * xwidth);
        tooltipDot.attr("cy", yScale(entry.y));
        tooltipDot.style("display", null);
      }
    })
    .on("mouseout", () => {
      tooltip.hide();
      // Set the display style to none to make the dot disappear
      tooltipDot.style("display", "none");
    });
}
