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
import { ScatterPlot } from "../../charts/d3-scatter-plot";
import { PacioliContext } from "../../context";
import { NUMBER_ATTRIBUTES } from "../pacioli-number-component";
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
 * Attribues supported by the scatter plot component
 */
const SCATTER_PLOT_ATTRIBUTES = {
  strings: ["label", "xunit", "yunit"],
  booleans: ["trendline"],
  numbers: [
    "xlower",
    "xupper",
    "ylower",
    "yupper",
    "xticks",
    "yticks",
    "radius",
  ],
};

/**
 * Types for the histogram attributes
 */
export interface ScatterPlotAttributes extends ChartsAttributes {
  label: string;
  xunit: string;
  yunit: string;
  trendline: boolean;
  xlower: number;
  xupper: number;
  ylower: number;
  yupper: number;
  xticks: number;
  yticks: number;
  radius: number;
}

const SUPPORTED_ATTRIBUTES = mergeAttributeSpecs(
  COMMON_ATTRIBUTES,
  NUMBER_ATTRIBUTES,
  CHART_ATTRIBUTES,
  SCATTER_PLOT_ATTRIBUTES,
);

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
export class PacioliScatterPlotComponent extends PacioliChartComponent {
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
   * Web component field.
   */
  static readonly observedAttributes =
    collectAllAttributes(SUPPORTED_ATTRIBUTES);

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * ChartComponent method.
   */
  override drawChart(data: PacioliValue): void {
    this.clearContent();
    this.clearErrors();

    const options = {
      ...optionsFromScript<ScatterPlotAttributes>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<ScatterPlotAttributes>(
        this,
        SUPPORTED_ATTRIBUTES,
      ),
    };

    this.chart = new ScatterPlot(data, PacioliContext.si(), options);

    // intercept click handler and dispatch as event
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

customElements.define("pacioli-scatter-plot", PacioliScatterPlotComponent);
