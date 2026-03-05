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

import type { PieChartOptions } from "../../charts/d3-pie-chart";
import { PieChart } from "../../charts/d3-pie-chart";
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
 * Attribues supported by the pie chart component
 */
const PIE_CHART_ATTRIBUTES = {
  strings: ["unit", "label"],
  booleans: [],
  numbers: ["radius", "labelOffset"],
};

/**
 * Types for the histogram attributes
 */
export interface PieChartAttributes extends ChartsAttributes {
  unit: string;
  label: string;
  radius: number;
  labelOffset: number;
}

const SUPPORTED_ATTRIBUTES = mergeAttributeSpecs(
  COMMON_ATTRIBUTES,
  NUMBER_ATTRIBUTES,
  CHART_ATTRIBUTES,
  PIE_CHART_ATTRIBUTES,
);

/**
 * Style sheet for the pie chart
 */
const STYLES = `

`;

/**
 * Web component for a line chart. A wrapper around the PieChart class.
 */
export class PacioliPieChartComponent extends PacioliChartComponent {
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
  get unit(): string | undefined {
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
      ...optionsFromScript<PieChartOptions>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<PieChartOptions>(this, SUPPORTED_ATTRIBUTES),
    };

    this.chart = new PieChart(data, PacioliContext.si(), options);

    // Intercept the click handler and dispatch the clicks as events.
    // The default click handler can be turned of by the 'nopopup'
    // attribute.
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

customElements.define("pacioli-pie-chart", PacioliPieChartComponent);
