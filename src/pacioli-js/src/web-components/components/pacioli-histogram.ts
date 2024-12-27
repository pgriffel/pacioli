import { si, SIUnit, UOM } from "uom-ts";
import { PacioliContext } from "../../context";
import { Histogram, HistogramOptions } from "../../charts/d3-histogram";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes } from "../utils";
import { dataUnit } from "../../charts/chart-utils";

/**
 * Attribues supported by the histogram component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["label"],
  booleans: [],
  numbers: ["width", "height", "bins", "lower", "upper", "decimals", "gap"],
};

/**
 * Style sheet for the histogram component
 */
const STYLES = ` 

.axis {
  shape-rendering: crispEdges;
}

.bar {
  fill: steelblue;
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

  `;

/**
 * Web component for a bar chart. A wrapper around the Histogram class.
 */
export class PacioliHistogramComponent extends PacioliShadowTreeComponent {
  /**
   * The unit of measurement. Is derived from the data if no unit attribute
   * is given.
   */
  unit?: SIUnit;

  /**
   * The histogram
   */
  chart?: Histogram;

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
      this.chart = new Histogram(
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
  chartOptions(): Partial<HistogramOptions> {
    return {
      unit: this.unit || UOM.ONE,
      ...optionsFromAttributes<HistogramOptions>(this, SUPPORTED_ATTRIBUTES),
    };
  }
}

customElements.define("pacioli-histogram", PacioliHistogramComponent);
