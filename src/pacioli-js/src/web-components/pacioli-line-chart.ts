import { si, SIUnit, UOM } from "uom-ts";
import { LineChart, LineChartOptions } from "../charts/d3-line-chart";
import { PacioliContext } from "../context";
import { PacioliShadowTreeComponent } from "./pacioli-shadow-tree-component";
import { dataUnit } from "../charts/chart-utils";
import {
  optionalBooleanAttributes,
  optionalNumberAttributes,
  optionalStringAttributes,
} from "./utils";

/**
 * Web component for a line chart. A wrapper around the LineChart class.
 */
export class PacioliLineChartComponent extends PacioliShadowTreeComponent {
  // The unit of measurement. Is derived from the data if no unit attribute
  // is given.
  unit?: SIUnit;

  // The bar chart
  chart?: LineChart;

  // Web component field.
  static observedAttributes = ["unit"];

  constructor() {
    super();

    // Set the style sheet
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(this.styleSheet());
    this.root.adoptedStyleSheets = [sheet];
  }

  override parametersChanged(): void {
    const data = this.fetchData();

    if (this.unit === undefined) {
      this.unit = dataUnit(data);
    }

    this.clearParentDiv();

    this.chart = new LineChart(data, PacioliContext.si(), this.chartOptions());
    this.chart.draw(this.parentDiv());
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
   * Creates an options for the chart from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  chartOptions(): Partial<LineChartOptions> {
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

customElements.define("pacioli-line-chart", PacioliLineChartComponent);
