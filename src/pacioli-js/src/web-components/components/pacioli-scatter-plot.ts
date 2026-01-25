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

import type { PacioliValue } from "../../values/pacioli-value";
import type { ScatterPlotOptions } from "../../charts/d3-scatter-plot";
import { ScatterPlot } from "../../charts/d3-scatter-plot";
import { PacioliContext } from "../../context";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes, optionsFromScript } from "../utils";

/**
 * Attribues supported by the scatter plot component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["label", "caption", "xunit", "yunit"],
  booleans: ["trendline"],
  numbers: [
    "width",
    "height",
    "xlower",
    "xupper",
    "ylower",
    "yupper",
    "xticks",
    "yticks",
    "radius",
    "decimals",
  ],
};

/**
 * Style sheet for the scatter plot chart
 */
const STYLES = `

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


.dot {
    fill: lightblue !important ;
    stroke: darkgray;
}`;

/**
 * Web component for a line chart. A wrapper around the ScatterPlot class.
 */
export class PacioliScatterPlotComponent extends PacioliShadowTreeComponent {
  /**
   * Unit of the domain values
   */
  get xunit(): string {
    return this.getStringAttribute("xunit", "");
  }

  set xunit(value: string | undefined) {
    this.setStringAttribute("xunit", value);
  }

  /**
   * Unit of the range values
   */
  get yunit(): string {
    return this.getStringAttribute("yunit", "");
  }

  set yunit(value: string | undefined) {
    this.setStringAttribute("yunit", value);
  }

  /**
   * Lower bound for the domain
   */
  get xlower(): number {
    return this.getNumberAttribute("xlower", 0);
  }

  set xlower(value: number) {
    this.setNumberAttribute("xlower", value);
  }

  /**
   * Upper bound for the domain
   */
  get xupper(): number {
    return this.getNumberAttribute("xupper", 1);
  }

  set xupper(value: number) {
    this.setNumberAttribute("xupper", value);
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
   * The scatter plot
   */
  chart?: ScatterPlot;

  /**
   * The Pacioli value displayed in the chart.
   */
  data?: PacioliValue;

  /**
   * Web component field.
   */
  static observedAttributes = [
    "definition",
    "xunit",
    "yunit",
    "xlower",
    "xupper",
    "ylower",
    "yupper",
    "xticks",
    "yticks",
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
    this.data = this.evaluateDefinition();

    this.drawChart(this.data);
  }

  drawChart(data: PacioliValue): void {
    this.clearContent();
    this.clearErrors();

    const options = {
      ...optionsFromScript<ScatterPlotOptions>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<ScatterPlotOptions>(this, SUPPORTED_ATTRIBUTES),
    };

    this.chart = new ScatterPlot(data, PacioliContext.si(), options);
    this.chart.draw(this.contentParent());
  }
}

customElements.define("pacioli-scatter-plot", PacioliScatterPlotComponent);
