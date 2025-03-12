import { SIUnit, UOM } from "uom-ts";
import { PieChart, PieChartOptions } from "../../charts/d3-pie-chart";
import { PacioliContext } from "../../context";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { dataUnit } from "../../charts/chart-utils";
import { optionsFromAttributes } from "../utils";
import { parseUnit } from "../../api";

/**
 * Attribues supported by the pie chart component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["label"],
  booleans: [],
  numbers: ["width", "height", "radius", "labelOffset", "decimals"],
};

/**
 * Style sheet for the pie chart
 */
const STYLES = `

`;

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
    this.adoptStyles(STYLES);
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    try {
      switch (name) {
        case "unit": {
          this.unit = parseUnit(newValue);
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
      this.chart = new PieChart(data, PacioliContext.si(), this.chartOptions());
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
  chartOptions(): Partial<PieChartOptions> {
    return {
      unit: this.unit || UOM.ONE,
      ...optionsFromAttributes<PieChartOptions>(this, SUPPORTED_ATTRIBUTES),
    };
  }
}

customElements.define("pacioli-pie-chart", PacioliPieChartComponent);
