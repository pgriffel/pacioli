import { PacioliWebComponent } from "./pacioli-web-component";

/**
 * Custom Pacioli web component. Does not use a shadow DOM.
 *
 * Abstract class for web components displaying some computed PacioliValue.
 */
export class PacioliCustomElement extends PacioliWebComponent {
  parent: HTMLElement;

  constructor() {
    super();

    this.parent = this;
  }

  override rootElement(): HTMLElement {
    return this;
  }
}
