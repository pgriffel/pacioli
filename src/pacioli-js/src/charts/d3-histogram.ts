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

import {
  appendChartCaption,
  appendEmptyChartMessage,
  DefaultChartOptions,
  ToolTip,
} from "./chart-utils";
import { DimNum, SIUnit } from "uom-ts";
import { PacioliValue } from "../boxing";
import { PacioliContext } from "../context";
import { displayChartError } from "./chart-utils";
import { BandChartData, bandChartData } from "./chart-data";
import * as d3 from "d3";

export interface HistogramOptions extends DefaultChartOptions {
  unit?: SIUnit;
  convert: boolean;
  label?: string;
  bins?: number;
  lower?: number;
  upper?: number;
  zeros: boolean;
  decimals?: number;
  gap: number;
  heuristic: string;
  onclick?: (
    values: { keys: string[]; value: string }[],
    frequency: DimNum,
    lower: DimNum,
    upper: DimNum,
    options: HistogramOptions
  ) => void;
  tooltip?: (
    frequency: DimNum,
    lower: DimNum,
    upper: DimNum,
    options: HistogramOptions
  ) => string;
  tooltipOffset: { dx: number; dy: number };
}

const DEFAULT_HISTOGRAM_OPTIONS: HistogramOptions = {
  width: 640,
  height: 360,
  margin: { left: 48, top: 32, right: 16, bottom: 64 },
  label: "",
  zeros: false,
  convert: true,
  decimals: 2,
  gap: 1,
  heuristic: "d3",
  onclick: histogramClickHanler,
  tooltip: histogramTooltip,
  tooltipOffset: { dx: 16, dy: -64 },
};

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
  options: HistogramOptions;

  params?: {
    lower: number;
    upper: number;
    nrBins: number;
  };

  constructor(
    private data: PacioliValue,
    public context: PacioliContext,
    options: Partial<HistogramOptions>
  ) {
    this.options = { ...DEFAULT_HISTOGRAM_OPTIONS, ...options };
  }

  public draw(parent: HTMLElement) {
    try {
      // Transform the data to a usable format
      // const unit = this.options.unit || dataUnit(this.data);

      const data = bandChartData(
        this.context,
        this.data,
        this.options.zeros,
        this.options.unit
      );

      // Determine the drawing dimensions
      var margin = this.options.margin;
      var width = this.options.width - margin.left - margin.right;
      var height = this.options.height - margin.top - margin.bottom;

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
        .attr("class", "pacioli chart histogram");

      if (data !== null) {
        const group = svg
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        // Check the existence of options for the bin calculation.
        const hasLower = typeof this.options.lower === "number";
        const hasUpper = typeof this.options.upper === "number";
        const hasBins = typeof this.options.bins === "number";

        // Determine the value bounds. The effective bounds are not necessarily
        // the data bounds. If no bounds are given then the data bounds are rounded
        // to give nicer bins.
        const lower = hasLower
          ? (this.options.lower as number)
          : Math.floor(data.min);
        const upper = hasUpper
          ? (this.options.upper as number)
          : Math.floor(data.max) + 1;

        let nrBins = hasBins
          ? (this.options.bins as number)
          : binSize(data.entries, lower, upper, this.options.heuristic);

        if (nrBins <= 0) {
          throw Error(`number of bins ${nrBins} must be a positive number`);
        }

        if (upper < lower) {
          throw Error(
            `upper limit ${upper} must at least as large as the lower limit ${upper}`
          );
        }

        // Store the params for the methods below
        this.params = {
          lower,
          upper,
          nrBins,
        };

        appendHistogram(
          group,
          data,
          lower,
          upper,
          nrBins,
          data.unit,
          this.options
        );
      } else {
        appendEmptyChartMessage(svg, "No data", this.options);
      }

      // Add the caption above all other elements
      appendChartCaption(svg, this.options);
    } catch (err) {
      displayChartError(
        parent,
        "While drawing histogram '" + this.options.label + "':",
        err
      );
    }
  }

  nrBins(): number | undefined {
    return this.params?.nrBins;
  }

  lower(): number | undefined {
    return this.params?.lower;
  }

  upper(): number | undefined {
    return this.params?.upper;
  }
}

function histogramClickHanler(
  values: { keys: string[]; value: string }[],
  frequency: DimNum,
  lower: DimNum,
  upper: DimNum,
  options: HistogramOptions
) {
  const text =
    "There are " +
    frequency.toFixed(0) +
    " values in the range " +
    lower.toFixed(options.decimals) +
    " to " +
    upper.toFixed(options.decimals);
  const mat = values.map(
    (value) => `\n${value.keys.toString()}  ${value.value} `
  );
  alert(text + mat);
}

function histogramTooltip(
  frequency: DimNum,
  lower: DimNum,
  upper: DimNum,
  options: HistogramOptions
): string {
  return `${lower.toFixed(options.decimals)}..${upper.toFixed(
    options.decimals
  )}: ${frequency.toFixed(0)}`;
}

function appendHistogram(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: BandChartData,
  lower: number,
  upper: number,
  nrBins: number,
  unit: SIUnit,
  options: HistogramOptions
) {
  // Determine the drawing dimensions
  var margin = options.margin;
  var width = options.width - margin.left - margin.right;
  var height = options.height - margin.top - margin.bottom;

  const dataRange = upper - lower;

  const binWidth = dataRange / nrBins;

  const tresholds = [...Array(nrBins)].map(
    (_, i) => (i + 1) * binWidth + lower
  );
  const histogram = d3.bin().domain([lower, upper]).thresholds(tresholds);
  const binArray = histogram(data.entries.map((entry) => entry.value));

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

  // Add the x axis
  const xAxisElt = group
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x axis");

  xAxisElt.append("g").call(d3.axisBottom(domain));

  const label = options.label || data.label;
  xAxisElt
    .append("text")
    .attr("x", width)
    .attr("y", 24)
    // .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(label + " [" + unit.toText() + "]");

  // var label = options.label || data.type.param.rowName() //vector.shape.rowSets.map(function (x) {return x.name})
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
    .attr("x", -16)
    .attr("y", -16)
    // .attr("dy", "-.71em")
    .style("text-anchor", "left")
    .text("Frequency");

  // Create a tooltip with a unique css class name for the histogram charts.
  const tooltip = new ToolTip("pacioli tooltip histogram");

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
    .attr("x", options.gap)
    // .attr("width", binWidth)
    .attr("width", (d) => {
      return (
        (d3.max([
          0,
          domain(d.x1 as number) - domain(d.x0 as number),
        ]) as number) -
        2 * options.gap +
        1
      );
    })
    .attr("height", function (d) {
      return height - range(d.length);
    })
    .on("click", (_, d) => {
      if (options.onclick) {
        tooltip.hide();
        const dat = binData(d, data, options.decimals || 2);
        // Without the timeout the tooltip.hide() does not have an effect
        setTimeout(() => {
          options.onclick!(
            dat.value,
            dat.frequency,
            dat.lower,
            dat.upper,
            options
          );
        }, 0);
      }
    })
    .on("mouseover", (event, d) => {
      if (options.tooltip) {
        // Determine the data in the clicked bin
        const dat = binData(d, data, options.decimals || 2);

        // Call the tooltip callback to get the HTML to display, add it to the DOM and
        // move it the proper position. Use the event's pageX and pageY properties to
        // determine the mouse position on the screen
        tooltip.show(
          options.tooltip(dat.frequency, dat.lower, dat.upper, options),
          event.pageX + options.tooltipOffset.dx,
          event.pageY + options.tooltipOffset.dy
        );
      }
    })
    .on("mouseout", () => tooltip.hide());
}

function binSize(
  entries: { label: string; value: number }[],
  lower: number,
  upper: number,
  heuristic: string
): number {
  const values = entries.map((entry) => entry.value);

  switch (heuristic) {
    case "d3": {
      return d3.bin().domain([lower, upper])(values).length;
    }
    case "sturges": {
      return sturges(values);
    }
    case "freedman-diaconis": {
      return freedmanDiaconis(values, lower, upper);
    }
    case "seaborn": {
      return Math.max(sturges(values), freedmanDiaconis(values, lower, upper));
    }
    default: {
      throw Error(
        `bin size heuristic '${heuristic}' unknown. Expected one of 'd3', 'sturges', 'freedman-diaconis', or 'seaborn'`
      );
    }
  }
}

function sturges(values: number[]) {
  return Math.ceil(Math.log2(values.length));
}

function freedmanDiaconis(
  values: number[],
  lower: number,
  upper: number
): number {
  const perc25 = d3.quantile(values, 0.25);
  const perc75 = d3.quantile(values, 0.75);
  if (perc25 && perc75) {
    const h = (2 * (perc75 - perc25)) / values.length ** (1 / 3);
    return h === 0 ? 1 : Math.ceil((upper - lower) / h);
  } else {
    throw Error("cannot compute Freedman-Diaconis. Is the data valid?");
  }
}

/**
 * Helper for draw(). Besides the frequency, and the range of a bin it
 * filters the input Pacioli vector to only the values in a bin.
 */
function binData(
  bin: d3.Bin<number, number>,
  data: BandChartData,
  decimals: number
): {
  value: { keys: string[]; value: string }[];
  frequency: DimNum;
  lower: DimNum;
  upper: DimNum;
} {
  const lower = bin.x0 || 0; // TODO: better undefined handling
  const upper = bin.x1 || 0; // TODO: better undefined handling
  const frequency = bin.length;

  var result: { keys: string[]; value: string }[] = [];

  for (let i = 0; i < data.entries.length; i++) {
    const num = data.entries[i].value;
    if (lower <= num && num < upper) {
      result.push({
        keys: [data.entries[i].label],
        value: num.toFixed(decimals),
      });
    }
  }

  return {
    value: result,
    frequency: DimNum.fromNumber(frequency),
    lower: DimNum.fromNumber(lower, data.unit),
    upper: DimNum.fromNumber(upper, data.unit),
  };
}
