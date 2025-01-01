import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes } from "../utils";
import { DOM } from "../../dom";

/**
 * Attribues supported by the Pacioli value component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["zero"],
  booleans: ["nozeros"],
  numbers: ["decimals"],
};

/**
 * Style sheet for the Pacioli value component
 */
const STYLES = `
.pacioli-matrix {


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


  NOwidth: 100%;

  th.key {
    text-align: left;
  }

  th.value {
    text-align: center;
  }

  td.value {
    text-align: right;
    // padding-right: 0.25em;
  }

  td.unit {
    text-align: left;
    padding-left: 0pt;  
  }

} `;

/**
 * Web component for a Pacioli value. A wrapper around the DOM function.
 */
export class PacioliValueComponent extends PacioliShadowTreeComponent {
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

      // Refresh the html
      this.clearContent();
      this.contentParent().appendChild(DOM(data));
    } catch (err: any) {
      this.displayError(err);
    }
  }

  /**
   * Creates an options for the value from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  chartOptions(): Partial<{
    decimals?: number;
    zero?: string;
    zeroRows?: boolean;
  }> {
    return optionsFromAttributes<{
      decimals?: number;
      zero?: string;
      zeroRows?: boolean;
    }>(this, SUPPORTED_ATTRIBUTES);
  }
}

customElements.define("pacioli-value", PacioliValueComponent);
