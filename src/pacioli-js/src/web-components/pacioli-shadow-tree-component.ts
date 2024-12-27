import { PacioliWebComponent } from "./pacioli-web-component";

/**
 * Pacioli web component that uses a shadow DOM.
 *
 * Abstract class for web components displaying some computed PacioliValue.
 */
export abstract class PacioliShadowTreeComponent extends PacioliWebComponent {
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

  /**
   * Sets the adoptedStyleSheets of the component's shadow root to the
   * given styles.
   *
   * @param styles A string with CSS styles
   */
  adoptStyles(styles: string) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    this.root.adoptedStyleSheets = [sheet];
  }
}
