import { PacioliWebComponent } from "./pacioli-web-component";

/**
 * Custom Pacioli web component. Does not use a shadow DOM.
 *
 * Abstract class for web components displaying some computed PacioliValue.
 */
export abstract class PacioliCustomElement extends PacioliWebComponent {
  override rootElement(): HTMLElement {
    return this;
  }
}
