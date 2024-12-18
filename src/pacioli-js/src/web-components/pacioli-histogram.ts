import { si, SIUnit, UOM } from "uom-ts";
import { PacioliContext } from "../context";
import { Histogram, HistogramOptions } from "../charts/d3-histogram";
import { PacioliValue } from "../value";
import { PacioliShadowTreeComponent } from "./pacioli-shadow-tree-component";
import {
  optionalStringAttributes,
  optionalBooleanAttributes,
  optionalNumberAttributes,
} from "./utils";
import { dataUnit } from "../charts/chart-utils";

/**
 * Web component for a bar chart. A wrapper around the Histogram class.
 */
export class PacioliHistogramComponent extends PacioliShadowTreeComponent {
  // The unit of measurement. Is derived from the data if no unit attribute
  // is given.
  unit?: SIUnit;

  // The bar chart
  chart?: Histogram;

  // Web component field.
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
  override dataAvailable(data: PacioliValue) {
    if (this.unit === undefined) {
      this.unit = dataUnit(data);
    }
    this.chart = new Histogram(data, PacioliContext.si(), this.chartOptions());
    this.chart.draw(this.rootElement());
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
  chartOptions(): Partial<HistogramOptions> {
    return {
      unit: this.unit || UOM.ONE,
      ...optionalStringAttributes(this, ["label"]),
      ...optionalBooleanAttributes(this, ["smooth"]),
      ...optionalNumberAttributes(this, ["width", "height", "bins"]),
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

.bar {
      fill: steelblue;
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

customElements.define("pacioli-histogram", PacioliHistogramComponent);
