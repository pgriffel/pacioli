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
import { PieArcDatum } from "d3";
import { PacioliValue } from "../boxing";
import { PacioliContext } from "../context";
import { DefaultChartOptions, displayChartError, ToolTip } from "./chart-utils";
import { BandChartData, bandChartData } from "./chart-data";
import { DimNum, SIUnit } from "uom-ts";

export interface PieChartOptions extends DefaultChartOptions {
  radius?: number;
  unit?: SIUnit;
  convert?: boolean;
  label?: string;
  labelOffset?: number;
  decimals?: number;
  zeros: boolean;

  /**
   * Callback for mouse clicks. Parameter number is the value of the clicked
   * part, label is the name of the index set element of the clicked part, and
   * fraction is the percentage of the value of the total value.
   */
  onclick?: (
    number: DimNum,
    label: string,
    fraction: number,
    options: PieChartOptions
  ) => void;
  tooltip?: (
    number: DimNum,
    label: string,
    fraction: number,
    options: PieChartOptions
  ) => string;
  tooltipOffset: { dx: number; dy: number };
}

const DEFAULT_PIE_CHART_OPTIONS = {
  width: 640,
  height: 360,
  margin: {
    left: 10,
    top: 10,
    right: 10,
    bottom: 10,
  },
  radius: 100,
  label: "",
  labelOffset: 0.5,
  decimals: 2,
  zeros: false,
  convert: true,
  onclick: pieChartClickHandler,
  tooltip: pieChartTooltip,
  tooltipOffset: { dx: 0, dy: -50 },
};

function pieChartClickHandler(
  number: DimNum,
  label: string,
  fraction: number,
  options: PieChartOptions
) {
  alert(
    `${options.label}: value for ${label} is ${number.toFixed(
      options.decimals
    )} (${(fraction * 100).toFixed(0)}%)`
  );
}

function pieChartTooltip(
  number: DimNum,
  label: string,
  fraction: number,
  options: PieChartOptions
) {
  return `${label}: ${number.toFixed(options.decimals)} (${(
    fraction * 100
  ).toFixed(0)}%)`;
}

/**
 * A pie chart for Pacioli
 *
 * Adds css classes pacioli-ts-chart and pacioli-ts-pie-chart to the chart svg.
 */
export class PieChart {
  options: PieChartOptions;

  constructor(
    public data: PacioliValue,
    private context: PacioliContext,
    options: Partial<PieChartOptions>
  ) {
    this.options = { ...DEFAULT_PIE_CHART_OPTIONS, ...options };
  }

  public draw(parent: HTMLElement) {
    try {
      const input = bandChartData(
        this.context,
        this.data,
        this.options.zeros,
        this.options.unit
      );

      // Make the parent node empty
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      const width = this.options.width;
      const height = this.options.height;

      const svg = d3
        .select(parent)
        .append("svg")
        .attr("class", "pacioli chart pie-chart")
        .attr("width", width)
        .attr("height", height);

      const group = svg.append("g");

      appendPieChart(group, input, this.options);
    } catch (err) {
      displayChartError(
        parent,
        "While drawing pie chart '" + this.options.label + "':",
        err
      );
    }
  }
}

function appendPieChart(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: BandChartData,
  options: PieChartOptions
) {
  const width = options.width;
  const height = options.height;
  //var radius = Math.min(width, height) / 2
  // const radius = this.options.radius;

  // group.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  group.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  const size = Math.min(width, height);
  const fourth = size / 4;
  // const half = size / 2;
  const labelOffset = fourth * 1.4;
  const total = data.entries.reduce((acc, cur) => acc + cur.value, 0);
  // const container = group //d3.select(selector);

  // const chart = container.append('svg')
  //   .style('width', '100%')
  //   .attr('viewBox', `0 0 ${size} ${size}`);

  const plotArea = group.append("g");
  // .attr('transform', `translate(${half}, ${half})`);

  const color = d3
    .scaleOrdinal<string>()
    .domain(data.entries.map((d) => d.label))
    .range(d3.schemeAccent);

  const pie = d3
    .pie<{ value: number; name: string }>()
    .sort(null)
    .value((d) => d.value);

  const arcs = pie(
    data.entries.map((entry) => {
      return {
        name: entry.label,
        value: entry.value,
      };
    })
  );

  const arc = d3
    .arc<PieArcDatum<{ value: number; name: string }>>()
    .innerRadius(0)
    .outerRadius(fourth);

  const arcLabel = d3
    .arc<PieArcDatum<{ value: number; name: string }>>()
    .innerRadius(labelOffset)
    .outerRadius(labelOffset);

  // Create a tooltip parent with default styling.
  const tooltip = new ToolTip("pacioli tooltip pie-chart");

  plotArea
    .selectAll(null)
    .data(arcs)
    .enter()
    .append("path")
    .attr("class", "slice")
    .attr("fill", (d) => color(d.data.name))
    .attr("d", arc)
    .on("click", (_, d) => {
      if (options.onclick) {
        tooltip.hide();
        // Without the timeout the display: none does not have an effect
        setTimeout(() => {
          options.onclick!(
            DimNum.fromNumber(d.data.value, data.unit),
            d.data.name,
            d.data.value / total,
            options
          );
        }, 0);
      }
    })
    .on("mouseover", (event, d) => {
      if (options.tooltip) {
        tooltip.show(
          options.tooltip(
            DimNum.fromNumber(d.data.value, data.unit),
            d.data.name,
            d.data.value / total,
            options
          ),
          event.pageX + options.tooltipOffset.dx,
          event.pageY + options.tooltipOffset.dy
        );
      }
    })
    .on("mouseout", () => tooltip.hide());

  const labels = plotArea
    .selectAll("text")
    .data(arcs)
    .enter()
    .append("text")
    .style("text-anchor", "middle")
    .style("alignment-baseline", "middle")
    .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`);

  labels
    .append("tspan")
    .attr("y", "-0.6em")
    .attr("x", 0)
    .text((d) => `${d.data.name}`);

  // labels.append('tspan')
  //   .attr('y', '0.6em')
  //   .attr('x', 0)
  //   .text(d => `${d.data.value} (${Math.round(d.data.value / total * 100)}%)`);

  return;
}
