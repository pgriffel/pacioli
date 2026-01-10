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
import { DimNum } from "uom-ts";
import type { PacioliValue } from "../values/pacioli-value";
import type { PacioliContext } from "../context";
import type { DefaultChartOptions, Margin } from "./chart-utils";
import {
  appendChartCaption,
  appendEmptyChartMessage,
  combineMargins,
  displayChartError,
  parseMargin,
} from "./chart-utils";
import type { BandChartData } from "./chart-data";
import { bandChartData } from "./chart-data";
import { ToolTip } from "./chart-utils";
import { parseUnit } from "../api";

/**
 * Options for Pacioli's BarChart.
 */
export interface BarChartOptions extends DefaultChartOptions {
  /**
   * The unit in which numbers are displayed. If necessary the charts
   * converts the chart values to this unit. An error is thrown if
   * the unit conversion fails.
   */
  unit?: string;

  //Should the input be converted? Undocumented feature.
  convert?: boolean;

  /**
   * Start of the y-axis. Defaults to the minimum data value.
   */
  ylower?: number;

  /**
   * End of the y-axis. Defaults to the maximum data value.
   */
  yupper?: number;

  /**
   * Distance between the bars. See d3 band.
   */
  padding: number;

  /**
   * Callback for mouse clicks. Parameter number is the value of the clicked
   * bar and label is the name of the index set element of the clicked bar.
   */
  onclick?: (number: DimNum, label: string, options: BarChartOptions) => void;

  /**
   * Callback for tooltips. Parameter number is the value of the clicked bar and
   * label is the name of the index set element of the clicked bar.
   *
   * The callback must return a HTML string that is inserted into the DOM.
   *
   * The styling can be overwritten with the div.pacioli-ts-bar-chart css class using
   * the !important tag.
   *
   * Set the tooltip option to undefined to disable the default tooltip.
   */
  tooltip?: (number: DimNum, label: string, options: BarChartOptions) => string;

  /**
   * Offset of the tooltip from the mouse position
   */
  tooltipOffset: { dx: number; dy: number };

  /**
   * Are zero entries shown? Default is true.
   */
  zeros: boolean;
}

const DEFAULT_CHART_MARGIN = { left: 48, top: 32, right: 16, bottom: 64 };

const DEFAULT_BAR_CHART_OPTIONS = {
  width: 640,
  height: 360,
  label: "",
  zeros: true,
  convert: true,
  decimals: 2,
  padding: 0.05,
  onclick: barChartClickHandler,
  tooltip: barChartTooltip,
  tooltipOffset: { dx: 16, dy: -64 },
};

function barChartClickHandler(
  number: DimNum,
  label: string,
  options: BarChartOptions
) {
  const header = options.caption === undefined ? "Bar chart" : options.caption;

  alert(`${header}\n\n Value for ${label} is ${number.toText()}`);
}

function barChartTooltip(
  number: DimNum,
  label: string,
  options: BarChartOptions
) {
  return `${label}: ${number.toFixed(options.decimals)}`;
}

/**
 * Bar chart that displays a Pacioli vector
 *
 * Adds css classes pacioli-ts-chart and pacioli-ts-bar-chart to the chart svg.
 *
 * Adds css classes x and axis to the chart's x-axis.
 *
 * Adds css classes y and axis to the chart's y-axis.
 *
 * Adds css class bar to the chart's bars.
 */
export class BarChart {
  /**
   * Declaration of all BarChart options. They are set in the constructor.
   */
  options: BarChartOptions;

  constructor(
    public data: PacioliValue,
    private context: PacioliContext,
    options: Partial<BarChartOptions>
  ) {
    this.options = { ...DEFAULT_BAR_CHART_OPTIONS, ...options };
  }

  /**
   * Appends the chart to the parent element.
   *
   * Removes any other children of parent. There is no harm calling
   * it multiple times.
   *
   * Catches any errors and displays them.
   *
   * @param parent The element to which the chart is appended
   */
  public draw(parent: HTMLElement): void {
    try {
      const unit =
        this.options.unit !== undefined && this.options.unit !== ""
          ? parseUnit(this.options.unit)
          : undefined;

      // Transform the data to a usable format
      const input = bandChartData(
        this.context,
        this.data,
        this.options.zeros,
        unit
      );

      // Make the parent node empty
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      // Add an svg element
      const svg = d3
        .select(parent)
        .append("svg")
        .attr("width", this.options.width)
        .attr("height", this.options.height);
      // .attr("class", "pacioli chart bar-chart");

      if (input !== null) {
        const inner = svg.append("g");

        const margin = combineMargins(
          DEFAULT_CHART_MARGIN,
          parseMargin(this.options.margin)
        );

        inner.attr(
          "transform",
          `translate(${margin.left.toString()},${margin.top.toString()})`
        );

        appendBarChart(inner, input, margin, this.options);
      } else {
        appendEmptyChartMessage(svg, "No data", this.options);
      }

      // Add the caption above all other elements
      appendChartCaption(svg, this.options);
    } catch (err) {
      const labelText =
        this.options.caption === undefined ? "" : ` '${this.options.caption}'`;

      displayChartError(parent, `While drawing bar chart${labelText}:`, err);
    }
  }
}

/**
 * Appends the chart to the parent element.
 *
 * Removes any other children of parent. There is no harm calling
 * it multiple times.
 *
 * Catches any errors and displays them.
 *
 * @param parent The element to which the chart is appended
 */
function appendBarChart(
  inner: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: BandChartData,
  margin: Margin,
  options: BarChartOptions
): void {
  const width = options.width - margin.left - margin.right;
  const height = options.height - margin.top - margin.bottom;

  // Determine the min and max data values. Cannot be undefined because data is not empty.
  // TODO: why do data.min and data.max not work? Bars get shifted.
  const yMin = Math.min(
    0,
    options.ylower ??
      (d3.min(data.entries, function (d) {
        return d.value;
      }) as number)
  );
  const yMax = Math.max(
    0,
    options.yupper ??
      (d3.max(data.entries, function (d) {
        return d.value;
      }) as number)
  );

  // Create the x and y scales
  const x = d3.scaleBand();

  // TODO: Without rangeRound we get artifacts (the bars get ugly) if the number of bars gets large. But with
  // rangeRound gaps appear on the left and the right side of the bars. Can we round ourselves below?
  // x.rangeRound([0, width])
  x.range([0, width])
    .padding(options.padding)
    .domain(
      data.entries.map(function (d) {
        return d.label;
      })
    );

  const y = d3.scaleLinear();
  y.range([height, 0]).domain([yMin, yMax]); // related to above todo: why end at 0?

  // Create an x and y axis for the inner group
  const xAxis = d3.axisBottom(x);

  const yAxis = d3.axisLeft(y);
  yAxis.ticks(5);

  // Add the x axis to the inner group
  const xAxisElt = inner
    .append("g")
    // .attr("class", "x axis")
    .attr("transform", `translate(0,${height.toString()})`)
    .attr("shape-rendering", "crispEdges");

  const rotation = 0;

  xAxisElt
    .append("g")
    .call(xAxis)
    .selectAll("text")
    // do this if rotation != 0?
    // .style("text-anchor", "end")
    .attr("transform", function (_) {
      return `rotate(${rotation.toString()})`;
    });

  const xlabel =
    options.xlabel === undefined ? data.label || "" : options.xlabel;

  inner
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .style("text-anchor", "middle")
    .text(xlabel);

  // Add the y axis to the inner group
  const yAxisElt = inner.append("g").attr("class", "y axis");

  yAxisElt.append("g").call(yAxis);

  // Create a tooltip with a unqiue css class name for bar charts
  const tooltip = new ToolTip("pacioli tooltip bar-chart");

  // Add the bars to the inner group
  inner
    .selectAll(".bar")
    .data(data.entries)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => {
      return x(d.label) ?? 0;
    })
    .attr("width", x.bandwidth())
    .attr("y", (d) => {
      return Math.min(y(0), y(d.value)); // related to above todo: why min with 0?
    })
    .attr("height", (d) => {
      return Math.abs(y(0) - y(d.value)); // idem
    })
    .on("click", (_, d) => {
      const handler = options.onclick;

      if (handler) {
        tooltip.hide();

        // Without the timeout the display: none does not have an effect
        setTimeout(() => {
          handler(DimNum.fromNumber(d.value, data.unit), d.label, options);
        }, 0);
      }
    })
    .on("mouseover", (event: MouseEvent, d) => {
      if (options.tooltip) {
        tooltip.show(
          options.tooltip(
            DimNum.fromNumber(d.value, data.unit),
            d.label,
            options
          ),
          event.pageX + options.tooltipOffset.dx,
          event.pageY + options.tooltipOffset.dy
        );
      }
    })
    .on("mouseout", () => {
      tooltip.hide();
    });

  // Add the y axis label to the inner group
  const labelText = options.ylabel === undefined ? "" : `${options.ylabel} `;
  const yUnitText = `[${data.unit.toText()}]`;

  yAxisElt
    .append("text")
    .attr("x", -16)
    .attr("y", -16)
    .style("text-anchor", "start")
    .text(labelText + yUnitText);
}
