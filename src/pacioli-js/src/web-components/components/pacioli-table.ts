import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes } from "../utils";
import { DOMTable } from "../../dom";

/**
 * Attribues supported by the table component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["zero"],
  booleans: ["nozeros", "totals"],
  numbers: ["decimals"],
};

/**
 * Style sheet for the table component
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
 * Web component for a table. A wrapper around the DOMTable function.
 */
export class PacioliTableComponent extends PacioliShadowTreeComponent {
  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged(): void {
    try {
      // Compute the data using the new parameter values
      const data = this.fetchData();

      if (data.kind === "tuple") {
        const items = data as any;
        // Refresh the table
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
   * Creates an options for the table from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  chartOptions(): Partial<{
    decimals: number;
    zero?: string;
    zeroRows: boolean;
    totalsRow?: boolean;
  }> {
    return optionsFromAttributes<{
      decimals: number;
      zero?: string;
      zeroRows: boolean;
      totalsRow?: boolean;
    }>(this, SUPPORTED_ATTRIBUTES);
  }
}

customElements.define("pacioli-table", PacioliTableComponent);
