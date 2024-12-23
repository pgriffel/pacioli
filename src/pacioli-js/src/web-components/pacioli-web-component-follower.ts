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

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    this.rootElement().appendChild(this.contentParent());
  }

  /**
   * Implementation for PacioliWebComponentBase
   */
  rootElement(): HTMLElement {
    return this;
  }

  /**
   * Implementation for PacioliWebComponentBase
   */
  contentParent(): HTMLElement {
    return this.parentDiv;
  }

  /**
   * Makes the parent element (not the root) empty.
   */
  clearContent(): void {
    const parent = this.parentDiv;
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  /**
   * Implementation for Follower
   */
  attachedComponent(): PacioliWebComponent | null {
    return attachedPacioliWebComponent(this);
  }

  /**
   * Implementation for Follower
   */
  followAttached(callback: () => void) {
    this.follow(this.getAttribute("for") || "", callback);
  }

  /**
   * Implementation for Follower
   */
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

  /**
   * Implementation for Follower
   */
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
