import { SIUnit, UOM } from "uom-ts";
import { ScatterPlot, ScatterPlotOptions } from "../../charts/d3-scatter-plot";
import { PacioliContext } from "../../context";
import { PacioliValue } from "../../boxing";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { dataUnit } from "../../charts/chart-utils";
import { optionsFromAttributes } from "../utils";
import { parseUnit } from "../../api";

/**
 * Attribues supported by the scatter plot component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["label"],
  booleans: ["trendline"],
  numbers: ["width", "height", "xlower", "ylower", "radius", "decimals"],
};

/**
 * Style sheet for the scatter plot chart
 */
const STYLES = `

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


.dot {
    fill: lightblue !important ;
    stroke: darkgray;
}`;

/**
 * Web component for a line chart. A wrapper around the ScatterPlot class.
 */
export class PacioliScatterPlotComponent extends PacioliShadowTreeComponent {
  /**
   * The unit of measurement in the x direction. Is derived from the data if no
   * unit attribute is given.
   */
  xunit?: SIUnit;

  /**
   * The unit of measurement in the y direction. Is derived from the data if no
   * unit attribute is given.
   */
  yunit?: SIUnit;

  /**
   * The scatter plot
   */
  chart?: ScatterPlot;

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
        case "xunit": {
          this.xunit = parseUnit(newValue);
          break;
        }
        case "yunit": {
          this.yunit = parseUnit(newValue);
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

      // Extract the x and y values
      if (data.kind !== "tuple") {
        throw Error("data must be a pair");
      }
      const tuple = data as unknown as PacioliValue[];
      const xdata = tuple[0];
      const ydata = tuple[1];

      // Derive unknown units from the data. Set them before they
      // are used in the chartOptions call below.
      if (this.xunit === undefined) {
        this.xunit = dataUnit(xdata);
      }
      if (this.yunit === undefined) {
        this.yunit = dataUnit(ydata);
      }

      // Refresh the chart
      this.clearContent();
      this.chart = new ScatterPlot(
        xdata,
        ydata,
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
  chartOptions(): Partial<ScatterPlotOptions> {
    return {
      xunit: this.xunit || UOM.ONE,
      yunit: this.yunit || UOM.ONE,
      ...optionsFromAttributes<ScatterPlotOptions>(this, SUPPORTED_ATTRIBUTES),
    };
  }
}

customElements.define("pacioli-scatter-plot", PacioliScatterPlotComponent);
