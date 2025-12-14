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
import { BarChart, BarChartOptions } from "../../charts/d3-bar-chart";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes } from "../utils";
import { parseUnit } from "../../api";

/**
 * Attribues supported by the bar chart component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["caption", "label"],
  booleans: [],
  numbers: ["width", "height", "ymin", "ymax", "decimals", "padding"],
};

/**
 * Style sheet for the bar chart
 */
const STYLES = ` 
  .bar {
    fill: steelblue;
  }`;

/**
 * Web component for a bar chart. A wrapper around the BarChart class.
 */
export class PacioliBarChartComponent extends PacioliShadowTreeComponent {
  /**
   * The unit of measurement. Is derived from the data if no unit attribute
   * is given.
   */
  unit?: SIUnit;

  /**
   * The bar chart
   */
  chart?: BarChart;

  /**
   * Web component field.
   */
  static observedAttributes = ["unit"];

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    try {
      switch (name) {
        case "unit": {
          this.unit = parseUnit(newValue);
          break;
        }
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
      const data = this.fetchData();

      // Refresh the chart
      this.clearContent();
      this.chart = new BarChart(data, PacioliContext.si(), this.chartOptions());
      this.chart.draw(this.contentParent());
    } catch (err: any) {
      this.displayError(err);
    }
  }

  /**
   * Creates an options for the chart from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  chartOptions(): Partial<BarChartOptions> {
    return {
      unit: this.unit,
      ...optionsFromAttributes<BarChartOptions>(this, SUPPORTED_ATTRIBUTES),
    };
  }
}

customElements.define("pacioli-bar-chart", PacioliBarChartComponent);
