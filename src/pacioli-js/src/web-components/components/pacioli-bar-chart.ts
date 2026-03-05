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
import { BarChart } from "../../charts/d3-bar-chart";
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
 * Attribues supported by the bar chart component
 */
export const BAR_CHART_ATTRIBUTES = {
  strings: ["xlabel", "ylabel", "unit"],
  booleans: [],
  numbers: ["ylower", "yupper", "padding"],
};

/**
 * Types for the bar chart attributes
 */
export interface BarChartsAttributes extends ChartsAttributes {
  xlabel: string;
  ylabel: string;
  unit: string;
  ylower: number;
  yupper: number;
  padding: number;
}

const SUPPORTED_ATTRIBUTES = mergeAttributeSpecs(
  COMMON_ATTRIBUTES,
  NUMBER_ATTRIBUTES,
  CHART_ATTRIBUTES,
  BAR_CHART_ATTRIBUTES,
);

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
export class PacioliBarChartComponent extends PacioliChartComponent {
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
   * Web component field.
   */
  static readonly observedAttributes =
    collectAllAttributes(SUPPORTED_ATTRIBUTES);

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  override drawChart(data: PacioliValue) {
    this.clearContent();
    this.clearErrors();

    const options = {
      ...optionsFromScript<BarChartsAttributes>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<BarChartsAttributes>(this, SUPPORTED_ATTRIBUTES),
    };

    const chart = new BarChart(data, PacioliContext.si(), options);

    // Intercept the click handler and dispatch the clicks as events.
    // The default click handler can be turned of by the 'nopopup'
    // attribute.
    const defaultHandler = chart.clickHandler;
    chart.clickHandler = (event) => {
      this.dispatchEvent(event);
      if (!this.nopopup && defaultHandler) {
        defaultHandler(event);
      }
    };

    // Disable the tooltip if asked
    if (this.notooltip) {
      chart.tooltipText = undefined;
    }

    // Store the chart and draw it
    this.chart = chart;

    this.chart.draw(this.contentParent());
  }
}

customElements.define("pacioli-bar-chart", PacioliBarChartComponent);
