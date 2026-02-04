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
import type { HistogramOptions } from "../../charts/d3-histogram";
import { Histogram } from "../../charts/d3-histogram";
import { PacioliNumberComponent } from "../pacioli-number-component";
import { optionsFromAttributes, optionsFromScript } from "../utils";
import type { PacioliValue } from "../../values/pacioli-value";

/**
 * Attribues supported by the histogram component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["unit", "margin", "caption", "xlabel", "ylabel", "heuristic"],
  booleans: [],
  numbers: [
    "width",
    "height",
    "bins",
    "lower",
    "upper",
    "decimals",
    "gap",
    "ylower",
    "yupper",
    "xticks",
    "yticks",
  ],
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
export class PacioliHistogramComponent extends PacioliNumberComponent {
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
   * The data displayed in the histogram
   */
  data?: PacioliValue;

  /**
   * Web component field.
   */
  static observedAttributes = [
    "definition",
    "unit",
    "bins",
    "lower",
    "upper",
    "ylower",
    "yupper",
    "heuristic",
    "gap",
  ];

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    try {
      if (this.data !== undefined) {
        // Reload the data if the definition changes. The initial load is done in
        // parametersChanged.
        if (name === "definition") {
          this.data = this.evaluateDefinition();
        }

        this.updateChart(this.data);
      }
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged(): void {
    // Compute the data using the new parameter values
    this.data = this.evaluateDefinition();

    // Refresh the chart
    this.updateChart(this.data);
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
    this.clearErrors();

    const options = {
      ...optionsFromScript<HistogramOptions>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<HistogramOptions>(this, SUPPORTED_ATTRIBUTES),
    };

    this.chart = new Histogram(data, PacioliContext.si(), options);

    this.chart.draw(this.contentParent());
  }
}

customElements.define("pacioli-histogram", PacioliHistogramComponent);
