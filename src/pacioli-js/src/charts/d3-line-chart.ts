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
import { PacioliValue } from "../value";
import {
  dataUnit,
  DefaultChartOptions,
  displayChartError,
  ToolTip,
  transformData,
} from "./chart-utils";
import { PacioliContext } from "./../context";
import { DimNum, SIUnit } from "uom-ts";

export interface LineChartOptions extends DefaultChartOptions {
  /**
   * Number of decimals used for numbers. Default is 2.
   */
  decimals?: number;

  unit?: SIUnit;
  convert?: boolean;
  label?: string;
  xlabel?: string;
  norm?: number;
  ymin?: number;
  ymax?: number;
  xticks?: number;
  yticks?: number;
  rotate?: boolean;
  smooth?: boolean;
  zeros?: boolean;
  onclick?: (number: DimNum, label: string) => void;
  tooltip?: (number: DimNum, label: string) => string;
  tooltipOffset?: { dx: number; dy: number };
}

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
  options: {
    width: number;
    height: number;
    margin: { left: number; top: number; right: number; bottom: number };
    decimals: number;
    unit?: SIUnit;
    convert: boolean;
    label: string;
    xlabel: string;
    norm?: number;
    ymin?: number;
    ymax?: number;
    xticks: number;
    yticks: number;
    rotate: boolean;
    smooth: boolean;
    zeros: boolean;
    onclick?: (number: DimNum, label: string) => void;
    tooltip?: (number: DimNum, label: string) => string;
    tooltipOffset: { dx: number; dy: number };
  };

  readonly defaultOptions = {
    width: 640,
    height: 360,
    decimals: 2,
    margin: { left: 60, top: 20, right: 10, bottom: 30 },
    label: "",
    xlabel: "",
    xticks: 5,
    yticks: 5,
    rotate: false,
    smooth: false,
    zeros: true,
    convert: true,
    onclick: this.defaultClickHandler.bind(this),
    tooltip: this.defaultTooltip.bind(this),
    tooltipOffset: { dx: 0, dy: -50 },
  };

  defaultClickHandler(number: DimNum, label: string) {
    alert(
      `${this.options.label}: value for ${label} is ${number.toFixed(
        this.options.decimals
      )}`
    );
  }

  defaultTooltip(number: DimNum, label: string) {
    return `${label}: ${number.toFixed(this.options.decimals)}`;
  }

  constructor(
    public data: PacioliValue,
    private context: PacioliContext,
    options: LineChartOptions
  ) {
    this.options = { ...this.defaultOptions, ...options };
  }

  public draw(parent: HTMLElement) {
    try {
      // Transform the data to a usable format
      var unit = this.options.unit || dataUnit(this.data);
      var data = transformData(
        this.context,
        this.data,
        unit,
        this.options.zeros,
        this.options.convert
      );

      // Make the parent node empty
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      // Define dimensions of graph
      var m = this.options.margin;
      var w = this.options.width - m.left - m.right;
      var h = this.options.height - m.top - m.bottom;

      // The bounds for the y-axis. Cannot be undefined because data is not empty.
      var yMin =
        this.options.ymin !== undefined
          ? this.options.ymin
          : (d3.min(data.values) as number);
      var yMax =
        this.options.ymax !== undefined
          ? this.options.ymax
          : (d3.max(data.values) as number);

      // Add an SVG element with the desired dimensions and margin.
      const svg = d3
        .select(parent)
        .append("svg:svg")
        .attr("width", w + m.left + m.right)
        .attr("height", h + m.top + m.bottom)
        .attr("class", "pacioli-ts-chart pacioli-ts-line-chart");

      // Add a group to allow attr's to apply to everything in the group
      const group = svg
        .append("svg:g")
        .attr("width", w)
        .attr("height", h)
        .attr("transform", "translate(" + m.left + "," + m.top + ")");

      // Determine data ranges
      const xScale = d3.scaleBand(data.labels, [0, w]);
      const yScale = d3.scaleLinear([yMin, yMax], [h, 0]);

      // Create the x axis
      const mod = this.options.xticks
        ? Math.ceil(data.values.length / this.options.xticks)
        : 1;
      const xAxis = d3
        .axisBottom(xScale)
        .tickSize(-h)
        .tickValues(
          xScale.domain().filter(function (_, i) {
            return !(i % mod);
          })
        );

      const xElt = group
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

      if (this.options.rotate) {
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
        .attr("y", 20)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text(this.options.xlabel);

      // create y axis
      var yAxisLeft = d3.axisLeft(yScale).ticks(this.options.yticks);

      const yAxisElt = group
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)");

      yAxisElt.append("g").call(yAxisLeft);

      yAxisElt
        .append("text")
        .attr("x", -30)
        .attr("y", -10)
        .style("text-anchor", "begin")
        .text((_) => this.options.label + " [" + unit.toText() + "]");

      // Add a norm line if requested
      const norm = this.options.norm;
      if (norm) {
        var normline = d3
          .line()
          .x(([i, _]) => {
            return xScale(data.labels[i]) || 0;
          }) // is xScale correct? not used anywhere else. below is different!!!
          .y(function (_) {
            return yScale(norm);
          });
        group
          .append("svg:path")
          .attr("d", normline(data.values.map((x, i) => [i, x])))
          .attr("class", "")
          .attr("stroke", "green");
      }

      // Create a line function that converts the data into x and y points
      const line = d3
        .line()
        .x(([i, _]) => (i / data.values.length) * w)
        .y(([_, d]) => yScale(d));

      // Make the line smooth if requested
      if (this.options.smooth) {
        line.curve(d3.curveCardinal);
      }

      // Add lines AFTER the axes above so that the line is above the tick-lines
      group
        .append("path")
        .attr("d", line(data.values.map((x, i) => [i, x])))
        .attr("class", "data");
      // .on('click', () => { alert('hi') });

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

      const tooltip = new ToolTip("pacioli-ts-line-chart");

      const xwidth = w / data.values.length;

      group
        .selectAll(".hitbox")
        .data(data.values.map((x, i) => [i, x]))
        .enter()
        .append("rect")
        .attr("x", ([i, _]) => (i - 0.5) * xwidth)
        // .attr("y", ([_, d]) => yScale(d))
        .attr("y", 0)
        .attr("width", xwidth - 1)
        .attr("height", h)
        .style("fill", "none")
        .style("pointer-events", "all")
        // .style("display", "none")
        .on("click", (_, [i, d]) => {
          if (this.options.onclick) {
            tooltip.hide();
            tooltipDot.style("display", "none");
            // Without the timeout the display: none does not have an effect
            setTimeout(() => {
              this.options.onclick!(new DimNum(d, unit), data.labels[i]);
            }, 0);
          }
        })
        .on("mouseover", (event, [i, num]) => {
          if (this.options.tooltip) {
            // Call the tooltip callback to get the HTML to display
            tooltip.show(
              this.options.tooltip(new DimNum(num, unit), data.labels[i]),
              event.pageX + this.options.tooltipOffset.dx,
              event.pageY + this.options.tooltipOffset.dy
            );

            // Show the dot on the graph's line
            tooltipDot.style("cx", (i - 0) * xwidth);
            tooltipDot.style("cy", yScale(num));
            tooltipDot.style("display", null);
          }
        })
        .on("mouseout", () => {
          tooltip.hide();
          // Set the display style to none to make the dot disappear
          tooltipDot.style("display", "none");
        });
    } catch (err) {
      console.log(err);
      displayChartError(
        parent,
        "While drawing line chart '" + this.options.label + "':",
        err
      );
    }

    return this;
  }
}
