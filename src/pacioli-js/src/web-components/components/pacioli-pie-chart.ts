import { si, SIUnit, UOM } from "uom-ts";
import { PieChart, PieChartOptions } from "../../charts/d3-pie-chart";
import { PacioliContext } from "../../context";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { dataUnit } from "../../charts/chart-utils";
import {
  optionalBooleanAttributes,
  optionalNumberAttributes,
  optionalStringAttributes,
} from "../utils";

/**
 * Web component for a line chart. A wrapper around the PieChart class.
 */
export class PacioliPieChartComponent extends PacioliShadowTreeComponent {
  /**
   * The unit of measurement. Is derived from the data if no unit attribute
   * is given.
   */
  unit?: SIUnit;

  /**
   * The pie chart
   */
  chart?: PieChart;

  /**
   * Web component field.
   */
  static observedAttributes = ["unit"];

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
  attributeChangedCallback(name: string, _: string, newValue: string) {
    switch (name) {
      case "unit": {
        this.unit = si.parseDimNum(newValue).unit;
        break;
      }
    }
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged(): void {
    const data = this.fetchData();

    if (this.unit === undefined) {
      this.unit = dataUnit(data);
    }

    this.clearContent();

    this.chart = new PieChart(data, PacioliContext.si(), this.chartOptions());
    this.chart.draw(this.contentParent());
  }

  /**
   * Creates an options for the chart from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  chartOptions(): Partial<PieChartOptions> {
    return {
      unit: this.unit || UOM.ONE,
      ...optionalStringAttributes(this, ["label"]),
      ...optionalBooleanAttributes(this, ["smooth"]),
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
	fill: blue;
}
.chart path {
    stroke-width: 1;
    fill: red;
}
    
.pacioli-ts-chart path {
    stroke-width: 1;
    NOfill: yellow;
}

`;
  }
}

customElements.define("pacioli-pie-chart", PacioliPieChartComponent);
