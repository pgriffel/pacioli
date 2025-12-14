/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2025 Paul Griffioen
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

import { SIUnit } from "uom-ts";
import { PacioliContext } from "../../context";
import { Histogram, HistogramOptions } from "../../charts/d3-histogram";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes, optionsFromScript } from "../utils";
import { PacioliValue } from "../../boxing";
import { parseUnit } from "../../api";

/**
 * Attribues supported by the histogram component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["label", "heuristic"],
  booleans: [],
  numbers: ["width", "height", "bins", "lower", "upper", "decimals", "gap"],
};

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
export class PacioliHistogramComponent extends PacioliShadowTreeComponent {
  /**
   * The unit of measurement. Is derived from the data if no unit attribute
   * is given.
   */
  unit?: SIUnit;

  /**
   * The histogram
   */
  chart?: Histogram;

  /**
   * The data displayed in the histogram
   */
  data?: PacioliValue;

  /**
   * Web component field.
   */
  static observedAttributes = ["unit", "bins", "lower", "upper", "heuristic"];

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    try {
      // Store the unit as soon as it gets known. Otherwise it will be
      // derived from the data.
      if (name === "unit") {
        this.unit = parseUnit(newValue);
      }

      // Refresh the chart if this is an update and we have data to display
      if (this.data) {
        this.updateChart(this.data);
      }
    } catch (err: any) {
      this.displayError(err);
    }
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged(): void {
    try {
      // Compute the data using the new parameter values
      this.data = this.fetchData();

      // Refresh the chart
      this.updateChart(this.data);
    } catch (err: any) {
      this.displayError(err);
    }
  }

  /**
   * Creates an options for the chart from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  chartOptions(): Partial<HistogramOptions> {
    return {
      unit: this.unit,
      ...optionsFromScript<HistogramOptions>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<HistogramOptions>(this, SUPPORTED_ATTRIBUTES),
    };
  }

  /**
   * The actual number of bins of the displayed chart, or undefined if no
   * chart is displayed.
   *
   * @returns The number of bins
   */
  nrBins(): number | undefined {
    return this.chart?.nrBins();
  }

  /**
   * The actual lower bound of the displayed chart, or undefined if no
   * chart is displayed.
   *
   * @returns The lower bound
   */
  lower(): number | undefined {
    return this.chart?.lower();
  }

  /**
   * The actual upper bound of the displayed chart, or undefined if no
   * chart is displayed.
   *
   * @returns The upper bound
   */
  upper(): number | undefined {
    return this.chart?.upper();
  }

  /**
   * Removed any existing chart and creates a new one with the current settings.
   *
   * Calls the callbacks.
   *
   * @param data The data to display in the chart
   */
  private updateChart(data: PacioliValue) {
    this.clearContent();
    this.chart = new Histogram(data, PacioliContext.si(), this.chartOptions());
    this.chart.draw(this.contentParent());

    // Nr bins etc. might have been updated
    this.callCallbacks();
  }
}

customElements.define("pacioli-histogram", PacioliHistogramComponent);
