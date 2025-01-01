import { si, SIUnit } from "uom-ts";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes } from "../utils";
import { DOMTable } from "../../dom";

/**
 * Attribues supported by the bar chart component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["zero"],
  booleans: ["nozeros", "totals"],
  numbers: ["decimals"],
};

/**
 * Style sheet for the bar chart
 */
const STYLES = ` 

border-spacing: 0;
border-collapse: collapse;

tr {
   height: 28px;
}

td, th {
  NOborder: solid lightgrey;
  border: solid white;
}

td {
  background-color: $table-bg;
  border-bottom: solid lightgrey;
}

th {
  font-weight: normal;
  border-width: 1px 1px 1px 1px;
  background-color: $app-toolbar-color;
  Nocolor: white;
  padding-left: 1em;
  padding-right: 1em;
}

td.key {
  padding-left: 1em;
  padding-right: 0.25em;
  border-width: 1px 1px 1px 1px;
}

td.value {
  padding-left: 1em;
  border-width: 1px 0px 1px 1px;
  text-align: right;
}

td.unit {
  padding-left: 0.25em;
  padding-right: 0.25em;
  border-width: 1px 1px 1px 0px;
  text-align: left;
  white-space: nowrap;
}

td.total {
  padding-left: 1em;
  border-width: 1px 0px 1px 1px;
  text-align: right;
  font-weight: bold;
} 
`;

/**
 * Web component for a bar chart. A wrapper around the Table class.
 */
export class PacioliTableComponent extends PacioliShadowTreeComponent {
  /**
   * The unit of measurement. Is derived from the data if no unit attribute
   * is given.
   */
  unit?: SIUnit;

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
      // if (this.unit === undefined) {
      //   this.unit = dataUnit(data);
      // }

      if (data.kind === "tuple") {
        const items = data as any;
        // Refresh the chart
        this.clearContent();
        const columns = items.map((item: any) => ({
          title: item[0].value,
          value: item[1],
          decimals: 2,
        }));
        this.contentParent().appendChild(DOMTable(columns));
      } else {
        throw Error(`Expected a list of columns.`);
      }
    } catch (err: any) {
      this.displayError(err);
    }
  }

  /**
   * Creates an options for the chart from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  chartOptions(): Partial<{
    decimals: number;
    zero?: string;
    zeroRows: boolean;
    totalsRow?: boolean;
  }> {
    return {
      // unit: this.unit || UOM.ONE,
      ...optionsFromAttributes<{
        decimals: number;
        zero?: string;
        zeroRows: boolean;
        totalsRow?: boolean;
      }>(this, SUPPORTED_ATTRIBUTES),
    };
  }
}

customElements.define("pacioli-table", PacioliTableComponent);
