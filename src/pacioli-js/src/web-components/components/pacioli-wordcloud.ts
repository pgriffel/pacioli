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

import { WordCloud } from "../../charts/d3-wordcloud";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import type { CommonAttributes } from "../pacioli-web-component";
import { COMMON_ATTRIBUTES } from "../pacioli-web-component";
import {
  mergeAttributeSpecs,
  collectAllAttributes,
  optionsFromAttributes,
  optionsFromScript,
} from "../utils/attributes";
import type { PacioliValue } from "../../values/pacioli-value";

/**
 * Attribues supported by the word cloud component
 */
const WORDCLOUD_ATTRIBUTES = {
  strings: [],
  booleans: ["nopopup", "notooltip"],
  numbers: [],
};

/**
 * Attribues for Pacioli's word cloud component.
 */
export interface WordCloudAttributes extends CommonAttributes {
  nopopup: boolean;
  notooltip: boolean;
}

const SUPPORTED_ATTRIBUTES = mergeAttributeSpecs(
  COMMON_ATTRIBUTES,
  WORDCLOUD_ATTRIBUTES,
);

/**
 * Style sheet for the word cloud component
 */
const STYLES = ``;

/**
 * Web component for a line chart. A wrapper around the WordCloud class.
 */
export class PacioliWordCloudComponent extends PacioliShadowTreeComponent {
  get nopopup(): boolean {
    return this.getBooleAttribute("nopopup");
  }

  set nopopup(value: boolean) {
    this.setBooleAttribute("nopopup", value);
  }

  get notooltip(): boolean {
    return this.getBooleAttribute("notooltip");
  }

  set notooltip(value: boolean) {
    this.setBooleAttribute("notooltip", value);
  }

  /**
   * Web component field.
   */
  static readonly observedAttributes =
    collectAllAttributes(SUPPORTED_ATTRIBUTES);

  /**
   * The word cloud
   */
  chart?: WordCloud;

  data?: PacioliValue;

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
  override parametersChanged() {
    this.data = this.evaluateDefinition();

    this.drawChart(this.data);
  }

  private drawChart(data: PacioliValue) {
    this.clearContent();

    const options = {
      ...optionsFromScript<WordCloudAttributes>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<WordCloudAttributes>(this, SUPPORTED_ATTRIBUTES),
    };

    const chart = new WordCloud(data, options);

    const defaultHandler = chart.clickHandler;
    chart.clickHandler = (event) => {
      this.dispatchEvent(event);
      if (!this.nopopup && defaultHandler) {
        defaultHandler(event);
      }
    };

    if (this.notooltip) {
      chart.tooltipText = undefined;
    }

    this.chart = chart;

    this.chart.draw(this.contentParent());
  }
}

customElements.define("pacioli-wordcloud", PacioliWordCloudComponent);
