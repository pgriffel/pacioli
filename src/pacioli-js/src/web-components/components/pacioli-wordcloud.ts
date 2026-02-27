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

import type { WordCloudOptions } from "../../charts/d3-wordcloud";
import { WordCloud } from "../../charts/d3-wordcloud";
import type { PacioliMatrix } from "../../values/matrix";
import { getNumber } from "../../raw-values/raw-matrix";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import type { PacioliString } from "../../values/string";
import { COMMON_ATTRIBUTES } from "../pacioli-web-component";
import {
  mergeAttributeSpecs,
  collectAllAttributes,
  optionsFromAttributes,
  optionsFromScript,
} from "../utils/attributes";

/**
 * Attribues supported by the word cloud component
 */
const WORDCLOUD_ATTRIBUTES = {
  strings: [],
  booleans: ["nopopup", "notooltip"],
  numbers: [],
};

const SUPPORTED_ATTRIBUTES = mergeAttributeSpecs(
  COMMON_ATTRIBUTES,
  WORDCLOUD_ATTRIBUTES,
);

/**
 * Pacioli format for wordcloud data. A list of tuples.
 */
type WordCloudData = [PacioliString, PacioliMatrix][];

/**
 * Style sheet for the word cloud component
 */
const STYLES = ``;

/**
 * Web component for a line chart. A wrapper around the WordCloud class.
 */
export class PacioliWordCloudComponent extends PacioliShadowTreeComponent {
  /**
   * Web component field.
   */
  static readonly observedAttributes =
    collectAllAttributes(SUPPORTED_ATTRIBUTES);

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
   * The word cloud
   */
  chart?: WordCloud;

  data: [string, number][] = [];

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    try {
      if (this.chart !== undefined) {
        // Reload the data if the definition changes. The initial load is done in
        // parametersChanged.
        if (name === "definition") {
          this.data = wordData(
            this.evaluateDefinition() as unknown as WordCloudData,
          );
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
    this.data = wordData(this.evaluateDefinition() as unknown as WordCloudData);

    this.drawChart(this.data);
  }

  private drawChart(data: [string, number][]) {
    this.clearContent();

    const options = {
      ...optionsFromScript<WordCloudOptions>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<WordCloudOptions>(this, SUPPORTED_ATTRIBUTES),
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

/**
 * Transforms word cloud data from Pacioli format to the word cloud
 * format.
 *
 * @param data word cloud data in Pacioli format
 * @returns word cloud data in word cloud component format
 */
function wordData(data: WordCloudData): [string, number][] {
  return data.map(([key, value]) => [
    key.value,
    getNumber(value.numbers, 0, 0),
  ]);
}

customElements.define("pacioli-wordcloud", PacioliWordCloudComponent);
