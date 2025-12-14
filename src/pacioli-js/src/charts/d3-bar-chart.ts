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
import { DimNum, SIUnit } from "uom-ts";
import { PacioliValue } from "../boxing";
import { PacioliContext } from "../context";
import { DefaultChartOptions, displayChartError } from "./chart-utils";
import { BandChartData, bandChartData } from "./chart-data";
import { ToolTip } from "./chart-utils";

/**
 * Options for Pacioli's BarChart.
 */
export interface BarChartOptions extends DefaultChartOptions {
  /**
   * The unit in which numbers are displayed. If necessary the charts
   * converts the chart values to this unit. An error is thrown if
   * the unit conversion fails.
   */
  unit?: SIUnit;

  /**
   * Should the input be converted? Undocumented feature.
   */
  convert?: boolean;

  /**
   * Start of the y-axis. Defaults to the minimum data value.
   */
  ymin?: number;

  /**
   * End of the y-axis. Defaults to the maximum data value.
   */
  ymax?: number;

  /**
   * Label for the chart itself. Displayed above the chart.
   */
  label?: string;

  /**
   * Number of decimals used for numbers. Default is 2.
   */
  decimals?: number;

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

const DEFAULT_BAR_CHART_OPTIONS = {
  width: 640,
  height: 360,
  margin: { left: 10, top: 10, right: 10, bottom: 10 },
  label: "",
  zeros: true,
  convert: true,
  decimals: 2,
  padding: 0.05,
  onclick: barChartClickHandler,
  tooltip: barChartTooltip,
  tooltipOffset: { dx: 0, dy: -50 },
};

function barChartClickHandler(
  number: DimNum,
  label: string,
  options: BarChartOptions
) {
  alert(
    `${options.label}: value for ${label} is ${number.toFixed(
      options.decimals
    )}`
  );
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
      // Transform the data to a usable format
      var input = bandChartData(
        this.context,
        this.data,
        this.options.zeros,
        this.options.unit
      );

      // Make the parent node empty
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      // Add an svg element
      var svg = d3
        .select(parent)
        .append("svg")
        .attr("width", this.options.width)
        .attr("height", this.options.height)
        .attr("class", "pacioli chart bar-chart");

      // Create a margin object following the D3 convention
      var margin = {
        left: 40 + this.options.margin.left,
        top: 20 + this.options.margin.top,
        right: 10 + this.options.margin.right,
        bottom: 50 + this.options.margin.bottom,
      };

      var width = this.options.width - margin.left - margin.right;
      var height = this.options.height - margin.top - margin.bottom;

      // Add an inner group according to the margins
      var inner = svg.append("g");
      inner.attr(
        "transform",
        "translate(" + margin.left + "," + margin.top + ")"
      );

      appendBarChart(inner, input, width, height, this.options);
    } catch (err) {
      displayChartError(
        parent,
        "While drawing bar chart '" + this.options.label + "':",
        err
      );
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
  width: number,
  height: number,
  options: BarChartOptions
): void {
  // Determine the min and max data values. Cannot be undefined because data is not empty.
  // TODO: why do data.min and data.max not work? Bars get shifted.
  var yMin = Math.min(
    0,
    options.ymin ||
      (d3.min(data.entries, function (d) {
        return d.value;
      }) as number)
  );
  var yMax = Math.max(
    0,
    options.ymax ||
      (d3.max(data.entries, function (d) {
        return d.value;
      }) as number)
  );

  // Create the x and y scales
  var x = d3.scaleBand();
  x.rangeRound([0, width])
    .padding(options.padding)
    .domain(
      data.entries.map(function (d) {
        return d.label;
      })
    );

  var y = d3.scaleLinear();
  y.range([height, 0]).domain([yMin, yMax]); // related to above todo: why end at 0?

  // Create an x and y axis for the inner group
  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y);
  yAxis.ticks(5);

  // Add the x axis to the inner group
  inner
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (_) {
      return "rotate(-65)";
    });

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
      return x(d.label)!;
    })
    .attr("width", x.bandwidth)
    .attr("y", (d) => {
      return Math.min(y(0), y(d.value)); // related to above todo: why min with 0?
    })
    .attr("height", (d) => {
      return Math.abs(y(0) - y(d.value)); // idem
    })
    .on("click", (_, d) => {
      if (options.onclick) {
        tooltip.hide();
        // Without the timeout the display: none does not have an effect
        setTimeout(() => {
          options.onclick!(
            DimNum.fromNumber(d.value, data.unit),
            d.label,
            options
          );
        }, 0);
      }
    })
    .on("mouseover", (event, d) => {
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
    .on("mouseout", () => tooltip.hide());

  // Add the y axis label to the inner group
  const yUnitText = data.unit.toText();
  yAxisElt
    .append("text")
    .attr("dx", "0.5em")
    .style("text-anchor", "start")
    .text(options.label + (yUnitText === "1" ? "" : " [" + yUnitText + "]"));
}
