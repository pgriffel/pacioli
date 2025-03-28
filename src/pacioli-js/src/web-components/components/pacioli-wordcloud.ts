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

import { WordCloud, WordCloudOptions } from "../../charts/d3-wordcloud";
import { PacioliValue } from "../../boxing";
import { Matrix } from "../../values/matrix";
import { getNumber } from "../../values/numbers";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes } from "../utils";

/**
 * Attribues supported by the word cloud component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: [],
  booleans: [],
  numbers: ["width", "height"],
};

/**
 * Style sheet for the word cloud component
 */
const STYLES = ``;

/**
 * Web component for a line chart. A wrapper around the WordCloud class.
 */
export class PacioliWordCloudComponent extends PacioliShadowTreeComponent {
  /**
   * The word cloud
   */
  chart?: WordCloud;

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged() {
    try {
      // Compute the words
      const words = wordData(this.fetchData());

      // Add a new word cloud to the content parent
      this.clearContent();
      this.chart = new WordCloud(words, this.chartOptions());
      this.chart.draw(this.contentParent());
    } catch (err: any) {
      this.displayError(err);
    }
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
function wordData(data: PacioliValue): [string, number][] {
  const words = data as unknown as [any, Matrix][];
  return words.map(
    (word) =>
      [word[0].value, getNumber(word[1].numbers, 0, 0)] as unknown as [
        string,
        number
      ]
  );
}

customElements.define("pacioli-wordcloud", PacioliWordCloudComponent);
