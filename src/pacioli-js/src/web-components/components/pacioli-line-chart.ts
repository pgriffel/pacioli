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

import { LineChart } from "../../charts/d3-line-chart";
import { PacioliContext } from "../../context";
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
const LINE_CHART_ATTRIBUTES = {
  strings: ["label", "xlabel", "unit", "xunit", "yunit"],
  booleans: ["smooth", "rotate"],
  numbers: ["norm", "ylower", "yupper", "xticks", "yticks"],
};

/**
 * Types for the histogram attributes
 */
export interface LineChartAttributes extends ChartsAttributes {
  unit: string;
  label: string;
  xlabel: string;
  xunit: string;
  yunit: string;
  smooth: boolean;
  rotate: boolean;
  norm: number;
  ylower: number;
  yupper: number;
  xticks: number;
  yticks: number;
}

const SUPPORTED_ATTRIBUTES = mergeAttributeSpecs(
  COMMON_ATTRIBUTES,
  NUMBER_ATTRIBUTES,
  CHART_ATTRIBUTES,
  LINE_CHART_ATTRIBUTES,
);

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
export class PacioliLineChartComponent extends PacioliChartComponent {
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
   * The unit of measurement in the x direction. Is derived from the data if no
   * unit attribute is given.
   */
  get xunit(): string | undefined {
    return this.getStringAttribute("xunit");
  }

  set xunit(value: string | undefined) {
    this.setStringAttribute("xunit", value);
  }

  /**
   * The unit of measurement in the y direction. Is derived from the data if no
   * unit attribute is given.
   */
  get yunit(): string | undefined {
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
  override drawChart(data: PacioliValue) {
    this.clearContent();
    this.clearErrors();

    const options = {
      ...optionsFromScript<LineChartAttributes>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<LineChartAttributes>(this, SUPPORTED_ATTRIBUTES),
    };

    this.chart = new LineChart(data, PacioliContext.si(), options);

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

customElements.define("pacioli-line-chart", PacioliLineChartComponent);
