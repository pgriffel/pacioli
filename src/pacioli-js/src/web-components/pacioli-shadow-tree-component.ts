import { PacioliWebComponent } from "./pacioli-web-component";

/**
 * Pacioli web component that uses a shadow DOM.
 *
 * Abstract class for web components displaying some computed PacioliValue.
 */
export class PacioliShadowTreeComponent extends PacioliWebComponent {
  root: ShadowRoot;

  constructor() {
    super();

    this.root = this.attachShadow({
      mode: "open",
    });
  }

  override rootElement(): HTMLElement {
    return this.root as unknown as HTMLElement;
  }
}
