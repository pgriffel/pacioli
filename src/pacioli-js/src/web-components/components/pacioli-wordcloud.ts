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
} from "../utils/attributes";

/**
 * Attribues supported by the word cloud component
 */
const WORDCLOUD_ATTRIBUTES = {
  strings: [],
  booleans: [],
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

  /**
   * The word cloud
   */
  chart?: WordCloud;

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
          const words = wordData(
            this.evaluateDefinition() as unknown as WordCloudData,
          );

          this.chart = new WordCloud(words, this.chartOptions());
        }

        this.chart.draw(this.contentParent());
      }
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged() {
    // Compute the words.
    const words = wordData(
      this.evaluateDefinition() as unknown as WordCloudData,
    );

    // Add a new word cloud to the content parent
    this.clearContent();
    this.chart = new WordCloud(words, this.chartOptions());
    this.chart.draw(this.contentParent());
  }

  /**
   * Creates an options for the chart from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  chartOptions(): Partial<WordCloudOptions> {
    return optionsFromAttributes<WordCloudOptions>(this, SUPPORTED_ATTRIBUTES);
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
