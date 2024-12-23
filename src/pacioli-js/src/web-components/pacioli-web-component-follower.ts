import { Follower, PacioliWebComponentBase } from "./interfaces";
import { PacioliWebComponent } from "./pacioli-web-component";
import {
  attachedPacioliWebComponent,
  getPacioliWebComponentById,
} from "./utils";

/**
 * Web component with controls for the PacioliScene web component.
 *
 *
 * @example
 * <pacioli-scene id="my_scene" ... >
 *    <parameter> ... </parameter>
 *    ...
 * </pacioli-scene>
 *
 * <pacioli-inputs for="my_scene"></pacioli-inputs>
 */
export abstract class PacioliWebComponentFollower
  extends HTMLElement
  implements PacioliWebComponentBase, Follower
{
  private readonly parentDiv: HTMLDivElement = document.createElement("div");

  /**
   * Callback to sync with the Pacioli web component. It is stored
   * so we can unregister it later.
   */
  private callback?: () => void;

  /**
   * Id of the Pacioli web component that we follow
   */
  private followedComponentId?: string;

  constructor() {
    super();
  }

  connectedCallback() {
    // The parent to which elements will be added
    // const parent = this.rootElement();

    // Alternative that uses a shadow DOM with its own style sheet.
    // How can we use the shadow DOM and still allow overriding the
    // style of the controls?

    // const parent = this.attachShadow({ mode: "open" });
    // const sheet = new CSSStyleSheet();
    // sheet.replaceSync("button { color: red; border: 2px dotted black;}");
    // parent.adoptedStyleSheets = [sheet];

    // Add the parent elements
    this.rootElement().appendChild(this.contentParent());
  }

  rootElement(): HTMLElement {
    return this;
  }

  /**
   * Element to append content.
   */
  contentParent(): HTMLElement {
    return this.parentDiv;
  }

  /**
   * Makes the parent element (not the root) empty.
   */
  clearContent(): void {}

  attachedComponent(): PacioliWebComponent | null {
    return attachedPacioliWebComponent(this);
  }

  followAttached(callback: () => void) {
    this.follow(this.getAttribute("for") || "", callback);
  }

  follow(id: string, callback: () => void) {
    this.unfollow();

    const element = getPacioliWebComponentById(id);

    if (element) {
      this.followedComponentId = id;
      this.callback = callback;
      element.registerCallback(callback);
    } else {
      throw Error(`Could not subscribe Pacioli web component follower ${id}`);
    }
  }

  unfollow() {
    const id = this.followedComponentId;

    if (id) {
      const element = getPacioliWebComponentById(id);

      if (element && this.callback) {
        element.unregisterCallback(this.callback);
      } else {
        console.warn(
          `Could not unsubscribe Pacioli web component follower ${id}`
        );
      }
    }
  }
}
