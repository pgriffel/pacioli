import { PacioliWebComponentBase } from "./pacioli-web-component-base";

/**
 * Custom Pacioli web component. Does not use a shadow DOM.
 *
 * Abstract class for web components displaying some computed PacioliValue.
 */
export abstract class PacioliCustomElement extends PacioliWebComponentBase {
  constructor() {
    super();
  }

  override rootElement(): HTMLElement {
    return this;
  }
}
