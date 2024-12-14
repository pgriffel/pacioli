import { si } from "uom-ts";
import { LineChart } from "../charts/d3-line-chart";
import { PacioliContext } from "../context";
import { PacioliWebComponent } from "./pacioli-web-component";
import { PacioliValue } from "../value";

/**
 * Web component for a line chart. A wrapper around the LineChart class.
 *
 * Say we have a scene function foo from file bar.pacioli, and the function takes
 * a parameter for an object shape and one for mass, then
 *
 * @example
 * declare foo :: (String, gram) -> Scene(metre)
 *
 * define foo(shape, mass) = ...
 *
 * <pacioli-scene script="bar" function="foo" kind="scene">
 *       <parameter label="shape" type="string">sphere</parameter>
 *       <parameter label="mass" unit="gram">10</parameter>
 * </pacioli-scene>
 */
export class PacioliLineChartComponent extends PacioliWebComponent {
  // Options for the Pacioli space.
  unit = "metre";

  // The Pacioli space
  chart?: LineChart;

  // Web component field.
  static observedAttributes = ["unit"];

  // shadow: ShadowRoot;

  constructor() {
    super();
  }

  /**
   * Web component life-cycle event.
   */
  override dataAvailable(data: PacioliValue) {
    const value = data;
    const chart = new LineChart(value, PacioliContext.si(), {});
    chart.draw(this as unknown as HTMLElement);
    this.chart = chart;
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    switch (name) {
      case "unit": {
        this.unit = newValue;
        break;
      }
    }
  }

  /**
   * The unit for the scene's 3D space. The default is unit 'metre'.
   */
  parsedUnit() {
    try {
      return si.parseDimNum(this.unit || "metre").unit;
    } catch (error: any) {
      throw Error(`failed to parse scene unit '${this.unit}'`);
    }
  }
}

customElements.define("pacioli-line-chart", PacioliLineChartComponent);
