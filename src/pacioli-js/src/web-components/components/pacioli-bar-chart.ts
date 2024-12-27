import { si, SIUnit, UOM } from "uom-ts";
import { PacioliContext } from "../../context";
import { BarChart, BarChartOptions } from "../../charts/d3-bar-chart";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes } from "../utils";
import { dataUnit } from "../../charts/chart-utils";

/**
 * Attribues supported by the bar chart component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["label"],
  booleans: [],
  numbers: ["width", "height", "ymin", "ymax", "decimals", "padding"],
};

/**
 * Style sheet for the bar chart
 */
const STYLES = ` 
  .bar {
    fill: steelblue;
  }`;

/**
 * Web component for a bar chart. A wrapper around the BarChart class.
 */
export class PacioliBarChartComponent extends PacioliShadowTreeComponent {
  /**
   * The unit of measurement. Is derived from the data if no unit attribute
   * is given.
   */
  unit?: SIUnit;

  /**
   * The bar chart
   */
  chart?: BarChart;

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
    // Compute the data using the new parameter values
    const data = this.fetchData();

    // If no unit is known, then derive it from the data. Set it before it
    // is used in the chartOptions call below.
    if (this.unit === undefined) {
      this.unit = dataUnit(data);
    }

    // Refresh the chart
    this.clearContent();
    this.chart = new BarChart(data, PacioliContext.si(), this.chartOptions());
    this.chart.draw(this.contentParent());
  }

  /**
   * Creates an options for the chart from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  chartOptions(): Partial<BarChartOptions> {
    return {
      unit: this.unit || UOM.ONE,
      ...optionsFromAttributes<BarChartOptions>(this, SUPPORTED_ATTRIBUTES),
    };
  }
}

customElements.define("pacioli-bar-chart", PacioliBarChartComponent);
