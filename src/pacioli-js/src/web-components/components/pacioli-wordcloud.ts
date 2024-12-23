import { WordCloud, WordCloudOptions } from "../../charts/d3-wordcloud";
import { PacioliValue } from "../../value";
import { Matrix } from "../../values/matrix";
import { getNumber } from "../../values/numbers";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import {
  optionalBooleanAttributes,
  optionalNumberAttributes,
  optionalStringAttributes,
} from "../utils";

/**
 * Web component for a line chart. A wrapper around the WordCloud class.
 */
export class PacioliWordCloudComponent extends PacioliShadowTreeComponent {
  // The bar chart
  chart?: WordCloud;

  // Web component field.
  static observedAttributes = [];

  constructor() {
    super();

    // Set the style sheet
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(this.styleSheet());
    this.root.adoptedStyleSheets = [sheet];
  }

  override parametersChanged() {
    // Compute the words
    const words = wordData(this.fetchData());

    this.clearContent();

    // Add a new word cloud to the fresh DIV
    this.chart = new WordCloud(words, this.chartOptions());
    this.chart.draw(this.contentParent());
  }

  /**
   * Creates an options for the chart from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  chartOptions(): Partial<WordCloudOptions> {
    return {
      ...optionalStringAttributes(this, [""]),
      ...optionalBooleanAttributes(this, [""]),
      ...optionalNumberAttributes(this, ["width", "height"]),
    };
  }

  /**
   * Style sheet for the bar chart
   *
   * @returns A style sheet string
   */
  styleSheet(): string {
    return ``;
  }
}

customElements.define("pacioli-wordcloud", PacioliWordCloudComponent);

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
