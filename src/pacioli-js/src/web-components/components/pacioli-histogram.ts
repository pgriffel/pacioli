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

import { PacioliContext } from "../../context";
import { Histogram } from "../../charts/d3-histogram";
import { NUMBER_ATTRIBUTES } from "../pacioli-number-component";
import type { PacioliValue } from "../../values/pacioli-value";
import { COMMON_ATTRIBUTES } from "../pacioli-web-component";
import {
  mergeAttributeSpecs,
  collectAllAttributes,
  optionsFromScript,
  optionsFromAttributes,
} from "../utils/attributes";
import type {
  ChartsAttributes} from "../pacioli-chart-component";
import {
  CHART_ATTRIBUTES,
  PacioliChartComponent,
} from "../pacioli-chart-component";

/**
 * Attribues supported by the histogram component
 */
const HISTOGRAM_ATTRIBUTES = {
  strings: ["unit", "xlabel", "ylabel", "heuristic"],
  booleans: [],
  numbers: [
    "bins",
    "lower",
    "upper",
    "gap",
    "ylower",
    "yupper",
    "xticks",
    "yticks",
  ],
};

/**
 * Types for the histogram attributes
 */
export interface HistogramAttributes extends ChartsAttributes {
  unit: string;
  xlabel: string;
  ylabel: string;
  heuristic: string;
  bins: number;
  lower: number;
  upper: number;
  gap: number;
  ylower: number;
  yupper: number;
  xticks: number;
  yticks: number;
}

const SUPPORTED_ATTRIBUTES = mergeAttributeSpecs(
  COMMON_ATTRIBUTES,
  NUMBER_ATTRIBUTES,
  CHART_ATTRIBUTES,
  HISTOGRAM_ATTRIBUTES,
);

/**
 * Style sheet for the histogram component
 */
const STYLES = ` 

.axis {
  shape-rendering: crispEdges;
}

.bar {
  fill: steelblue;
}

.bar:hover {
  fill: brown;
}

.axis text {
  font-size: 10pt;
}

.axis path,
.axis line {
  stroke-opacity: .5;
  stroke: lightgrey;
}

.x.axis path {
  display: none;
}

  `;

/**
 * Web component for a histogram. A wrapper around the Histogram class.
 */
export class PacioliHistogramComponent extends PacioliChartComponent {
  /**
   * Label of the x-axis
   */
  get xlabel(): string {
    return this.getStringAttribute("xlabel", "");
  }

  set xlabel(value: string | undefined) {
    this.setStringAttribute("xlabel", value);
  }

  /**
   * Label of the y-axis
   */
  get ylabel(): string {
    return this.getStringAttribute("ylabel", "");
  }

  set ylabel(value: string | undefined) {
    this.setStringAttribute("ylabel", value);
  }

  /**
   * The unit of measurement. Is derived from the data if no unit attribute
   * is given.
   */
  get unit(): string | undefined {
    return this.getStringAttribute("unit");
  }

  set unit(value: string | undefined) {
    this.setStringAttribute("unit", value);
  }

  /**
   * The heuristic used for the number of bins.
   */
  get heuristic(): string | undefined {
    return this.getStringAttribute("heuristic");
  }

  set heuristic(value: string | undefined) {
    this.setStringAttribute("heuristic", value);
  }

  /**
   * Lower bound of the y-axis
   */
  get lower(): number {
    return this.getNumberAttribute("lower", 0);
  }

  set lower(value: number) {
    this.setNumberAttribute("lower", value);
  }

  /**
   * Gap between bars
   */
  get gap(): number {
    return this.getNumberAttribute("gap", 0);
  }

  set gap(value: number) {
    this.setNumberAttribute("gap", value);
  }

  /**
   * Upper bound for the range
   */
  get yupper(): number {
    return this.getNumberAttribute("yupper", 1);
  }

  set yupper(value: number) {
    this.setNumberAttribute("yupper", value);
  }

  /**
   * The histogram
   */
  chart?: Histogram;

  /**
   * Web component field.
   */
  static readonly observedAttributes =
    collectAllAttributes(SUPPORTED_ATTRIBUTES);

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Removed any existing chart and creates a new one with the current settings.
   *
   * Calls the callbacks.
   *
   * @param data The data to display in the chart
   */
  override drawChart(data: PacioliValue) {
    this.clearContent();
    this.clearErrors();

    const options = {
      ...optionsFromScript<HistogramAttributes>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<HistogramAttributes>(this, SUPPORTED_ATTRIBUTES),
    };

    this.chart = new Histogram(data, PacioliContext.si(), options);

    // Intercept the click handler and dispatch the clicks as events.
    // The default click handler can be turned of by the 'nopopup'
    // attribute.
    const defaultHandler = this.chart.clickHandler;
    this.chart.clickHandler = (event) => {
      this.dispatchEvent(event);

      if (!this.nopopup && defaultHandler) {
        defaultHandler(event);
      }
    };

    if (this.notooltip) {
      this.chart.tooltipText = undefined;
    }

    this.chart.draw(this.contentParent());
  }
}

customElements.define("pacioli-histogram", PacioliHistogramComponent);
