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

import { PieChart, PieChartOptions } from "../../charts/d3-pie-chart";
import { PacioliContext } from "../../context";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes, optionsFromScript } from "../utils";
import { PacioliValue } from "../../boxing";

/**
 * Attribues supported by the pie chart component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["unit", "caption", "label"],
  booleans: [],
  numbers: ["width", "height", "decimals", "radius", "labelOffset"],
};

/**
 * Style sheet for the pie chart
 */
const STYLES = `

`;

/**
 * Web component for a line chart. A wrapper around the PieChart class.
 */
export class PacioliPieChartComponent extends PacioliShadowTreeComponent {
  /**
   * Label
   */
  get label(): string {
    return this.getStringAttribute("label", "");
  }

  set label(value: string | undefined) {
    this.setStringAttribute("label", value);
  }

  /**
   * The unit of measurement. Is derived from the data if no unit attribute
   * is given.
   */
  get unit(): String {
    return this.getStringAttribute("unit");
  }

  set unit(value: string | undefined) {
    this.setStringAttribute("unit", value);
  }

  /**
   * Radius of the pie chart circle
   */
  get radius(): number {
    return this.getNumberAttribute("radius", 0);
  }

  set radius(value: number) {
    this.setNumberAttribute("radius", value);
  }

  /**
   * The pie chart
   */
  chart?: PieChart;

  /**
   * The Pacioli value displayed in the chart.
   */
  data?: PacioliValue;

  /**
   * Web component field.
   */
  static observedAttributes = [
    "definition",
    "decimals",
    "unit",
    "radius",
    "margin",
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
      // Reload the data if the definition changes. The initial load is done in
      // parametersChanged.
      if (name === "definition" && this.data !== undefined) {
        this.data = this.fetchData();
      }

      if (this.contentParent() && this.data) {
        this.drawChart(this.data);
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
      this.data = this.fetchData();

      this.drawChart(this.data);
    } catch (err: any) {
      this.displayError(err);
    }
  }

  drawChart(data: PacioliValue): void {
    this.clearContent();
    this.clearErrors();

    const options = {
      ...optionsFromScript<PieChartOptions>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<PieChartOptions>(this, SUPPORTED_ATTRIBUTES),
    };

    this.chart = new PieChart(data, PacioliContext.si(), options);

    this.chart.draw(this.contentParent());
  }
}

customElements.define("pacioli-pie-chart", PacioliPieChartComponent);
