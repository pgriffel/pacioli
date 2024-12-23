import { PacioliWebComponentBase } from "./pacioli-web-component-base";

/**
 * Pacioli web component that uses a shadow DOM.
 *
 * Abstract class for web components displaying some computed PacioliValue.
 */
export abstract class PacioliShadowTreeComponent extends PacioliWebComponentBase {
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
