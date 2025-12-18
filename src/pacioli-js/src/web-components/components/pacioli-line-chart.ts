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

import { LineChart, LineChartOptions } from "../../charts/d3-line-chart";
import { PacioliContext } from "../../context";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes } from "../utils";
import { PacioliValue } from "../../boxing";

/**
 * Attribues supported by the histogram component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["caption", "margin", "label", "xlabel", "unit", "xunit", "yunit"],
  booleans: ["smooth", "rotate"],
  numbers: [
    "width",
    "height",
    "decimals",
    "norm",
    "ylower",
    "yupper",
    "xticks",
    "yticks",
  ],
};

/**
 * Style sheet for the line chart
 */
const STYLES = `

.data {
  stroke: steelblue;
  stroke-width: 1;
  fill: none;
}
    
.axis {
  shape-rendering: crispEdges;
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

.dot {
  fill: lightblue !important ;
  stroke: darkgray;
}
`;

/**
 * Web component for a line chart. A wrapper around the LineChart class.
 */
export class PacioliLineChartComponent extends PacioliShadowTreeComponent {
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
   * The unit of measurement in the x direction. Is derived from the data if no
   * unit attribute is given.
   */
  get xunit(): String {
    return this.getStringAttribute("xunit");
  }

  set xunit(value: string | undefined) {
    this.setStringAttribute("xunit", value);
  }

  /**
   * The unit of measurement in the y direction. Is derived from the data if no
   * unit attribute is given.
   */
  get yunit(): String {
    return this.getStringAttribute("yunit");
  }

  set yunit(value: string | undefined) {
    this.setStringAttribute("yunit", value);
  }

  /**
   * Lower bound for the range
   */
  get ylower(): number {
    return this.getNumberAttribute("ylower", 0);
  }

  set ylower(value: number) {
    this.setNumberAttribute("ylower", value);
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
   * Is the line interpolated to get a smooth result?
   */
  get smooth(): boolean {
    return this.getBooleAttribute("smooth");
  }

  set smooth(value: boolean) {
    this.setBooleAttribute("smooth", value);
  }

  /**
   * The line chart
   */
  chart?: LineChart;

  /**
   * The Pacioli value displayed in the chart.
   */
  data?: PacioliValue;
  /**
   * Web component field.
   */
  static observedAttributes = [
    "definition",
    "unit",
    "xunit",
    "yunit",
    "smooth",
    "ylower",
    "yupper",
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

  private drawChart(data: PacioliValue) {
    this.clearContent();
    this.clearErrors();

    this.chart = new LineChart(
      data,
      PacioliContext.si(),
      optionsFromAttributes<LineChartOptions>(this, SUPPORTED_ATTRIBUTES)
    );

    this.chart.draw(this.contentParent());
  }
}

customElements.define("pacioli-line-chart", PacioliLineChartComponent);
