import { si, SIUnit, UOM } from "uom-ts";
import { PacioliContext } from "../context";
import { BarChart, BarChartOptions } from "../charts/d3-bar-chart";
import { PacioliValue } from "../value";
import { PacioliShadowTreeComponent } from "./pacioli-shadow-tree-component";
import {
  optionalStringAttributes,
  optionalBooleanAttributes,
  optionalNumberAttributes,
} from "./utils";
import { dataUnit } from "../charts/chart-utils";

/**
 * Web component for a bar chart. A wrapper around the BarChart class.
 */
export class PacioliBarChartComponent extends PacioliShadowTreeComponent {
  // The unit of measurement. Is derived from the data if no unit attribute
  // is given.
  unit?: SIUnit;

  // The bar chart
  chart?: BarChart;

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
    this.chart = new BarChart(data, PacioliContext.si(), this.chartOptions());
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

  chartOptions(): BarChartOptions {
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
    .bar {
      fill: steelblue;
    }`;
  }
}

customElements.define("pacioli-bar-chart", PacioliBarChartComponent);
