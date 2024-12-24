import { si, SIUnit, UOM } from "uom-ts";
import { ScatterPlot, ScatterPlotOptions } from "../../charts/d3-scatter-plot";
import { PacioliContext } from "../../context";
import { PacioliValue } from "../../value";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { dataUnit } from "../../charts/chart-utils";
import {
  optionalBooleanAttributes,
  optionalNumberAttributes,
  optionalStringAttributes,
} from "../utils";

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
        this.xunit = si.parseDimNum(newValue).unit;
        break;
      }
    }
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged(): void {
    const data = this.fetchData();

    if (data.kind !== "tuple") {
      throw Error("data must be a pair");
    }

    const tuple = data as unknown as PacioliValue[];

    const xdata = tuple[0];
    const ydata = tuple[1];

    if (this.xunit === undefined) {
      this.xunit = dataUnit(xdata);
    }
    if (this.yunit === undefined) {
      this.yunit = dataUnit(ydata);
    }

    this.chart = new ScatterPlot(
      xdata,
      ydata,
      PacioliContext.si(),
      this.chartOptions()
    );
    this.chart.draw(this.contentParent());
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

customElements.define("pacioli-scatter-plot", PacioliScatterPlotComponent);
