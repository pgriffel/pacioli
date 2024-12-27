import { WordCloud, WordCloudOptions } from "../../charts/d3-wordcloud";
import { PacioliValue } from "../../value";
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
    // Compute the words
    const words = wordData(this.fetchData());

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
