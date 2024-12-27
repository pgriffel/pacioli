import { Follower, PacioliWebComponentBase } from "./interfaces";
import { PacioliWebComponent } from "./pacioli-web-component";
import {
  attachedPacioliWebComponent,
  getPacioliWebComponentById,
} from "./utils";

/**
 * Abstract base class for Pacioli web component controllers.
 */
export abstract class PacioliWebController
  extends HTMLElement
  implements PacioliWebComponentBase, Follower
{
  /**
   * The content div
   */
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
   *Implementation for PacioliWebComponentBase
   */
  clearContent(): void {
    const parent = this.contentParent();
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  /**
   *Implementation for PacioliWebComponentBase
   */

  findElement(selectors: string): HTMLElement {
    return this.rootElement().querySelector(selectors)!;
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
    const followedId = this.getAttribute("for");
    if (followedId) {
      this.follow(followedId, callback);
    } else {
      throw Error(
        `could not subscribe to Pacioli web component. No 'for' attribute found.`
      );
    }
  }

  /**
   * Implementation for Follower
   */
  follow(elementId: string, callback: () => void) {
    this.unfollow();

    const element = getPacioliWebComponentById(elementId);

    if (element) {
      this.followedComponentId = elementId;
      this.callback = callback;

      element.registerCallback(callback);
    } else {
      throw Error(
        `could not subscribe to Pacioli web component. Element '${elementId}' is not a known Pacioli web component.`
      );
    }
  }

  /**
   * Implementation for Follower
   */
  unfollow() {
    const followedId = this.followedComponentId;

    if (followedId) {
      const followedComponent = getPacioliWebComponentById(followedId);

      if (followedComponent && this.callback) {
        followedComponent.unregisterCallback(this.callback);
      } else {
        console.warn(
          `Could not unsubscribe from Pacioli web component. Element ${followedId} not found.`
        );
      }
    }
  }
}
