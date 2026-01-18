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

import { PacioliContext } from "../../context";
import type { BarChartOptions } from "../../charts/d3-bar-chart";
import { BarChart } from "../../charts/d3-bar-chart";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes, optionsFromScript } from "../utils";
import type { PacioliValue } from "../../values/pacioli-value";

/**
 * Attribues supported by the bar chart component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["caption", "xlabel", "ylabel", "unit", "margin"],
  booleans: [],
  numbers: ["width", "height", "decimals", "ylower", "yupper", "padding"],
};

/**
 * Style sheet for the bar chart
 */
const STYLES = ` 
  .bar {
    fill: steelblue;
  }
  .bar:hover {
    fill: brown;
  }`;

/**
 * Web component for a bar chart. A wrapper around the BarChart class.
 */
export class PacioliBarChartComponent extends PacioliShadowTreeComponent {
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
  get unit(): string {
    return this.getStringAttribute("unit");
  }

  set unit(value: string | undefined) {
    this.setStringAttribute("unit", value);
  }

  /**
   * Lower bound of the y-axis
   */
  get ylower(): number {
    return this.getNumberAttribute("ylower", 0);
  }

  set ylower(value: number) {
    this.setNumberAttribute("ylower", value);
  }

  /**
   * Upper bound of the y-axis
   */
  get yupper(): number {
    return this.getNumberAttribute("yupper", 1);
  }

  set yupper(value: number) {
    this.setNumberAttribute("yupper", value);
  }

  /**
   * ?
   */
  get padding(): number {
    return this.getNumberAttribute("padding", 1);
  }

  set padding(value: number) {
    this.setNumberAttribute("padding", value);
  }

  /**
   * The bar chart
   */
  chart?: BarChart;

  /**
   * The Pacioli value displayed in the chart.
   */
  data?: PacioliValue;

  /**
   * Web component field.
   */
  static readonly observedAttributes = [
    "definition",
    "decimals",
    "xlabel",
    "ylabel",
    "unit",
    "margin",
    "ylower",
    "yupper",
    "padding",
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
          this.data = this.fetchData();
        }

        this.drawChart(this.data);
      }
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged(): void {
    this.data = this.fetchData();

    this.drawChart(this.data);
  }

  private drawChart(data: PacioliValue) {
    this.clearContent();
    this.clearErrors();

    const options = {
      ...optionsFromScript<BarChartOptions>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<BarChartOptions>(this, SUPPORTED_ATTRIBUTES),
    };

    this.chart = new BarChart(data, PacioliContext.si(), options);

    this.chart.draw(this.contentParent());
  }
}

customElements.define("pacioli-bar-chart", PacioliBarChartComponent);
