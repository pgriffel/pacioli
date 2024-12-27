import { si, SIUnit, UOM } from "uom-ts";
import { LineChart, LineChartOptions } from "../../charts/d3-line-chart";
import { PacioliContext } from "../../context";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { dataUnit } from "../../charts/chart-utils";
import { optionsFromAttributes } from "../utils";

/**
 * Attribues supported by the histogram component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["label", "xlabel"],
  booleans: ["smooth", "rotate"],
  numbers: ["decimals", "norm", "ymin", "ymax", "xticks", "yticks"],
};

/**
 * Style sheet for the line chart
 */
const STYLES = `

.data {
  stroke: steelblue;
  stroke-width: 1;
  fill: none;
}
    
.axis {
  shape-rendering: crispEdges;
}

.axis text {
  font-size: 10pt;
}

.axis path,
.axis line {
  stroke-opacity: .5;
  stroke: lightgrey;
}

.x.axis path {
  display: none;
}

.dot {
  fill: lightblue !important ;
  stroke: darkgray;
}
`;

/**
 * Web component for a line chart. A wrapper around the LineChart class.
 */
export class PacioliLineChartComponent extends PacioliShadowTreeComponent {
  /**
   * The unit of measurement. Is derived from the data if no unit attribute
   * is given.
   */
  unit?: SIUnit;

  /**
   * The line chart
   */
  chart?: LineChart;

  /**
   * Web component field.
   */
  static observedAttributes = ["unit"];

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    try {
      switch (name) {
        case "unit": {
          this.unit = si.parseDimNum(newValue).unit;
          break;
        }
      }
    } catch (err: any) {
      this.displayError(err);
    }
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged(): void {
    try {
      // Compute the data using the new parameter values
      const data = this.fetchData();

      // If no unit is known, then derive it from the data. Set it before it
      // is used in the chartOptions call below.
      if (this.unit === undefined) {
        this.unit = dataUnit(data);
      }

      // Refresh the chart
      this.clearContent();
      this.chart = new LineChart(
        data,
        PacioliContext.si(),
        this.chartOptions()
      );
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
  chartOptions(): Partial<LineChartOptions> {
    return {
      unit: this.unit || UOM.ONE,
      ...optionsFromAttributes<LineChartOptions>(this, SUPPORTED_ATTRIBUTES),
    };
  }
}

customElements.define("pacioli-line-chart", PacioliLineChartComponent);
