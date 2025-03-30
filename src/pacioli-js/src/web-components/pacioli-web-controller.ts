/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
