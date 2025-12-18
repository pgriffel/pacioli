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

import { ScatterPlot, ScatterPlotOptions } from "../../charts/d3-scatter-plot";
import { PacioliContext } from "../../context";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes } from "../utils";

/**
 * Attribues supported by the scatter plot component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["label", "caption", "xunit", "yunit"],
  booleans: ["trendline"],
  numbers: ["width", "height", "xlower", "ylower", "radius", "decimals"],
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
   * The scatter plot
   */
  chart?: ScatterPlot;

  /**
   * Web component field.
   */
  static observedAttributes = ["definition", "xunit", "yunit"];

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(
    _name: string,
    _oldValue: string,
    _newValue: string
  ) {
    try {
      if (this.contentParent()) {
        this.drawChart();
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
      this.drawChart();
    } catch (err: any) {
      this.displayError(err);
    }
  }

  drawChart(): void {
    // Refresh the chart
    this.clearContent();
    this.clearErrors();

    // Compute the data using the new parameter values
    const data = this.fetchData();

    this.chart = new ScatterPlot(
      data,
      PacioliContext.si(),
      optionsFromAttributes<ScatterPlotOptions>(this, SUPPORTED_ATTRIBUTES)
    );
    this.chart.draw(this.contentParent());
  }
}

customElements.define("pacioli-scatter-plot", PacioliScatterPlotComponent);
