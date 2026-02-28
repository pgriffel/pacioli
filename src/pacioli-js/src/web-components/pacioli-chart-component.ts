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

import type { PacioliValue } from "../values/pacioli-value";
import type {
  NumberAttributes} from "./pacioli-number-component";
import {
  PacioliNumberComponent,
} from "./pacioli-number-component";

/**
 * Attributes shared by all Pacioli chart components.
 */
export const CHART_ATTRIBUTES = {
  strings: ["margin"],
  booleans: ["nopopup", "notooltip"],
  numbers: [],
};

/**
 * Types for the chart attributes
 */
export interface ChartsAttributes extends NumberAttributes {
  margin: string;
}

/**
 * Abstract class for web components displaying a chart.
 *
 * Introduces the drawChart method.
 */
export abstract class PacioliChartComponent extends PacioliNumberComponent {
  get margin(): string | undefined {
    return this.getStringAttribute("margin");
  }

  set margin(value: string | undefined) {
    this.setStringAttribute("margin", value);
  }

  /**
   * Suppress the default popup alert on click
   */
  get nopopup(): boolean {
    return this.getBooleAttribute("nopopup");
  }

  set nopopup(value: boolean) {
    this.setBooleAttribute("nopopup", value);
  }

  /**
   * Disable the tooltip entirely
   */
  get notooltip(): boolean {
    return this.getBooleAttribute("notooltip");
  }

  set notooltip(value: boolean) {
    this.setBooleAttribute("notooltip", value);
  }

  /**
   * The Pacioli value displayed in the chart.
   */
  data?: PacioliValue;

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

  protected abstract drawChart(data: PacioliValue): void;
}
