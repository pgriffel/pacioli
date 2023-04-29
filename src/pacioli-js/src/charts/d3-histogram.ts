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

import { DefaultChartOptions, ToolTip } from "./chart-utils";
import { DimNum, SIUnit } from "uom-ts";
import { PacioliValue } from "../value";
import { PacioliContext } from "../context";
import { dataUnit, displayChartError, transformData } from "./chart-utils";
import { Matrix } from "../values/matrix";
import * as d3 from "d3";

export interface HistogramOptions extends DefaultChartOptions {
  unit?: SIUnit;
  convert?: boolean;
  label?: string;
  bins?: number;
  lower?: number;
  upper?: number;
  zeros?: boolean;
  decimals?: number;
  gap?: number;
  onclick?: (
    value: Matrix,
    frequency: DimNum,
    lower: DimNum,
    upper: DimNum
  ) => void;
  tooltip?: (
    value: Matrix,
    frequency: DimNum,
    lower: DimNum,
    upper: DimNum
  ) => string;
  tooltipOffset?: { dx: number; dy: number };
}

/**
 * Histogram for Pacioli.
 *
 * Adds css classes pacioli-ts-chart and pacioli-ts-histogram to the chart svg.
 *
 * Adds css classes x and axis to the chart's x-axis.
 *
 * Adds css classes y and axis to the chart's y-axis.
 *
 * Adds css class bar to the chart's bars.
 */
export class Histogram {
  options: {
    width: number;
    height: number;
    margin: { left: number; top: number; right: number; bottom: number };
    unit?: SIUnit;
    convert: boolean;
    label: string;
    bins?: number;
    lower?: number;
    upper?: number;
    zeros: boolean;
    decimals: number;
    gap: number;
    onclick?: (
      value: Matrix,
      frequency: DimNum,
      lower: DimNum,
      upper: DimNum
    ) => void;
    tooltip?: (
      value: Matrix,
      frequency: DimNum,
      lower: DimNum,
      upper: DimNum
    ) => string;
    tooltipOffset: { dx: number; dy: number };
  };

  readonly defaultOptions = {
    width: 640,
    height: 360,
    margin: { left: 40, top: 20, right: 20, bottom: 50 },
    label: "",
    zeros: false,
    convert: true,
    decimals: 2,
    gap: 1,
    onclick: this.defaultClickHanler.bind(this),
    tooltip: this.defaultTooltip.bind(this),
    tooltipOffset: { dx: 0, dy: -50 },
  };

  defaultClickHanler(
    value: Matrix,
    frequency: DimNum,
    lower: DimNum,
    upper: DimNum
  ) {
    const text =
      "There are " +
      frequency.toFixed(0) +
      " values in the range " +
      lower.toFixed(this.options.decimals) +
      " to " +
      upper.toFixed(this.options.decimals);
    const data = value.keyValueList();
    const mat = data.values.map(
      (value) =>
        `\n${value.row.toString()}  ${value.column.toString()}  ${value.value.toFixed(
          this.options.decimals
        )} `
    );
    alert(text + mat);
  }

  defaultTooltip(
    _: Matrix,
    frequency: DimNum,
    lower: DimNum,
    upper: DimNum
  ): string {
    return `${lower.toFixed(this.options.decimals)}..${upper.toFixed(
      this.options.decimals
    )}: ${frequency.toFixed(0)}`;
  }

  constructor(
    private data: PacioliValue,
    public context: PacioliContext,
    options: HistogramOptions
  ) {
    this.options = { ...this.defaultOptions, ...options };
  }

  public draw(parent: HTMLElement) {
    try {
      // Transform the data to a usable format
      const unit = this.options.unit || dataUnit(this.data);
      const data = transformData(
        this.context,
        this.data,
        unit,
        this.options.zeros,
        this.options.convert
      );

      // Determine the drawing dimensions
      var margin = this.options.margin;
      var width = this.options.width - margin.left - margin.right;
      var height = this.options.height - margin.top - margin.bottom;

      // Check the existence of options for the bin calculation
      const hasLower = typeof this.options.lower === "number";
      const hasUpper = typeof this.options.upper === "number";
      const hasBins = typeof this.options.bins === "number";

      // Determine the value bounds. The effective bounds are not necessarily
      // the data bounds. If no bounds are given then the data bounds are rounded
      // to give nicer bins.
      const dataLower = hasLower ? (this.options.lower as number) : data.min;
      const dataUpper = hasUpper ? (this.options.upper as number) : data.max;
      const lower = hasLower ? dataLower : Math.floor(dataLower);
      const upper = hasUpper ? dataUpper : Math.ceil(dataUpper);

      // Create an array with the bin tresholds. The d3 library does not create bins
      // of uniform size. See
      //   https://dev.to/kevinlien/d3-histograms-and-fixing-the-bin-problem-4ac5
      // You can however pass a tresholds array instead of the number of bins to d3's
      // bin() function. Therefore we calculate the bin tresholds ourselves. If no
      // bins are given as option we use d3's bin() function to create bins and use
      // that amount as the number of bins. The actual bin array is discarded.
      const nrBins = hasBins
        ? (this.options.bins as number)
        : d3.bin().domain([lower, upper])(data.values).length;
      const binWidth = (upper - lower) / nrBins;
      const tresholds = [...Array(nrBins)].map((_, i) => i * binWidth + lower);
      const histogram = d3.bin().domain([lower, upper]).thresholds(tresholds);
      const binArray = histogram(data.values);

      const domain: d3.ScaleLinear<number, number, never> = d3
        .scaleLinear()
        .domain([lower, upper])
        .range([0, width]);

      // TODO: check empty array instead of cast
      const maxFrequency = d3.max(binArray, function (d) {
        return d.length;
      }) as number;
      var range = d3.scaleLinear().domain([0, maxFrequency]).range([height, 0]);

      // Create the axes
      // var xAxis = d3.axisBottom(domain);
      // var yAxis = d3.axisLeft(range);

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
        .attr("class", "pacioli-ts-chart pacioli-ts-histogram");

      const group = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Add the x axis
      const xAxisElt = group
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis");

      xAxisElt.append("g").call(d3.axisBottom(domain));

      const label = this.options.label || data.label;
      xAxisElt
        .append("text")
        .attr("x", width)
        .attr("y", 26)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(label + " [" + unit.toText() + "]");

      // var label = this.options.label || this.data.type.param.rowName() //vector.shape.rowSets.map(function (x) {return x.name})
      // svg.append("g")
      //   .attr("class", "x axis")
      //   .attr("transform", "translate(0," + height + ")")
      //   .call(xAxis)
      //   .append("text")
      //   .attr("x", width)
      //   .attr("y", 26)
      //   .attr("dy", ".71em")
      //   .style("text-anchor", "end")
      //   .text(label + " [" + unit.symbolized().toText() + "]");

      // Add the x axis
      const yAxisElt = group
        .append("g")
        .attr("transform", "translate(0," + "0" + ")")
        .attr("class", "y axis");

      yAxisElt.append("g").call(d3.axisLeft(range));

      yAxisElt
        .append("text")
        .attr("x", -25)
        .attr("dy", "-.71em")
        .style("text-anchor", "left")
        .text("Frequency");

      // Create a tooltip with a unique css class name for the histogram charts.
      const tooltip = new ToolTip("pacioli-ts-histogram");

      // Add the histogram bars
      group
        .selectAll(".bar")
        .data(binArray)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function (d) {
          return (
            "translate(" + domain(d.x0 as number) + "," + range(d.length) + ")"
          );
        })
        .append("rect")
        .attr("x", this.options.gap)
        // .attr("width", binWidth)
        .attr("width", (d) => {
          return (
            (d3.max([
              0,
              domain(d.x1 as number) - domain(d.x0 as number),
            ]) as number) -
            2 * this.options.gap +
            1
          );
        })
        .attr("height", function (d) {
          return height - range(d.length);
        })
        .on("click", (_, d) => {
          if (this.options.onclick) {
            tooltip.hide();
            const dat = this.binData(d.x0 || 0, d.x1 || 0, data.max, d.length);
            // Without the timeout the tooltip.hide() does not have an effect
            setTimeout(() => {
              this.options.onclick!(
                dat.value,
                dat.frequency,
                dat.lower,
                dat.upper
              );
            }, 0);
          }
        })
        .on("mouseover", (event, d) => {
          if (this.options.tooltip) {
            // Determine the data in the clicked bin
            const dat = this.binData(
              d.x0 as number,
              d.x1 as number,
              data.max,
              d.length
            );

            // Call the tooltip callback to get the HTML to display, add it to the DOM and
            // move it the proper position. Use the event's pageX and pageY properties to
            // determine the mouse position on the screen
            tooltip.show(
              this.options.tooltip(
                dat.value,
                dat.frequency,
                dat.lower,
                dat.upper
              ),
              event.pageX + this.options.tooltipOffset.dx,
              event.pageY + this.options.tooltipOffset.dy
            );
          }
        })
        .on("mouseout", () => tooltip.hide());
    } catch (err) {
      displayChartError(
        parent,
        "While drawing histogram '" + this.options.label + "':",
        err
      );
    }

    return this;
  }

  /**
   * Helper for draw(). Besides the frequency, and the range of a bin it
   * filters the input Pacioli vector to only the values in a bin.
   */
  private binData(
    lower: number,
    upper: number,
    max: number,
    frequency: number
  ): {
    value: Matrix;
    frequency: DimNum;
    lower: DimNum;
    upper: DimNum;
  } {
    var result: Matrix;
    const unit = this.options.unit || dataUnit(this.data);

    if (this.data.kind === "matrix") {
      result = this.data
        .convertUnit(unit, this.context.unitContext)
        .filter(
          (num) =>
            lower <= num && (num < upper || (num === max && upper === max))
        );
    } else if (this.data.kind === "list") {
      throw new Error("TODO: histogram for list");

      // // Todo: convert to chart unit of measurement. See vector case above.
      // var factor = this.data.type.param.param.multiplier.conversionFactor(unit)
      // var filtered = []
      // for (var i = 0; i < this.data.value.length; i++) {
      //   var num = Pacioli.getNumber(this.data.value[i], 0, 0) * factor
      //   if (lower <= num && (num < upper || (num === max && upper === max))) {
      //     filtered.push(this.data.value[i])
      //   }
      // }
      // filtered.kind = this.data.value.kind
      // result = new Pacioli.Box(this.data.type, filtered)
      // //console.log(this.data)
      // //console.log(result)
    } else {
      throw new Error(
        `Histrogram values must be a matrix or a list, not a ${this.data.kind}`
      );
    }

    // Show the filtered vector in a popup window
    return {
      value: result,
      frequency: DimNum.dimless(frequency),
      lower: new DimNum(lower, unit),
      upper: new DimNum(upper, unit),
    };
  }
}
