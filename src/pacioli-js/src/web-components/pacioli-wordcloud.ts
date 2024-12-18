import { WordCloud, WordCloudOptions } from "../charts/d3-wordcloud";
import { PacioliValue } from "../value";
import { Matrix } from "../values/matrix";
import { getNumber } from "../values/numbers";
import { PacioliShadowTreeComponent } from "./pacioli-shadow-tree-component";
import {
  optionalBooleanAttributes,
  optionalNumberAttributes,
  optionalStringAttributes,
} from "./utils";

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

  /**
   * Web component life-cycle event.
   */
  override dataAvailable(data: PacioliValue) {
    const words = data as unknown as [any, Matrix][];
    const words2 = words.map(
      (word) =>
        [word[0].value, getNumber(word[1].numbers, 0, 0)] as unknown as [
          string,
          number
        ]
    );
    this.chart = new WordCloud(words2, this.chartOptions());
    this.chart.draw(this.rootElement());
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, _2: string) {
    switch (name) {
    }
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
    return `   
    
.pacioli-pie-chart {

}

.pacioli-pie-chart path.slice {
	stroke-width:2px;
}


.pacioli-pie-chart polyline {
	opacity: .3;
	stroke: black;
	stroke-width: 2px;
	fill: none;
}

.pacioli-ts-chart path {
    stroke-width: 1;
    fill: none;
}

.data {
    stroke: steelblue;
}
			
.axis {
    shape-rendering: crispEdges;
}

.axis {
    OLDfont: 10px sans-serif;
    font: 10px;
}
    
.axis path,
.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}

.x.axis line { 
    stroke: lightgrey;
}

.x.axis .minor {
    stroke-opacity: .5;
}

.x.axis path {
    /*display: none;*/
}

.x.axis path {
    display: none;
}
			
.x.axis text {
    font-size: 10px;
}

.y.axis line, .y.axis path {
    stroke: lightgrey;
    stroke-opacity: .5;
    fill: none;
    /*stroke: #000;*/
}

.y.axis text {
    font-size: 10px;
}


.dot {
    fill: lightblue !important ;
    stroke: darkgray;
}
`;
  }
}

customElements.define("pacioli-wordcloud", PacioliWordCloudComponent);
