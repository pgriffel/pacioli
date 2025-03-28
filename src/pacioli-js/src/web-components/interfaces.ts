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

import { PacioliValue } from "../boxing";
import { PacioliWebComponent } from "./pacioli-web-component";

/**
 * Base API for all Pacioli web components. This includes input components (controls) or
 * output components (charts, 3D scene).
 */
export interface PacioliWebComponentBase {
  /**
   * The web component root element. Use the contentParent to append content.
   */
  rootElement(): HTMLElement;

  /**
   * Element to append content.
   */
  contentParent(): HTMLElement;

  /**
   * Makes the content parent element (not the root element) empty.
   */
  clearContent(): void;

  /**
   * Convenience method to find elements in the component's tree.
   *
   * @param selectors A query selector string
   */
  findElement(selectors: string): HTMLElement;
}

/**
 * API for web components displaying some computed PacioliValue.
 *
 * Reads parameter values from the DOM and calls some script function with them.
 */
export interface Callable {
  /**
   * Set the parameter values programmatically. Updates the values in the DOM children.
   * Only sets the magnitudes. The units are fixed. Triggers method parametersChanged.
   *
   * @param values Array of the values. Must match the number of parameter DOM children.
   */
  setParameters(values: string[]): void;

  /**
   * Called when the parameters are changed. Also initially after construction.
   */
  parametersChanged(): void;

  /**
   * Computes the value or function identified by the 'script' and the 'definition'
   * attributes. For a function the current parameter values are used as arugments.
   *
   * @returns A PacioliValue
   */
  fetchData(): PacioliValue;
}

/**
 * General mechanism to display errors.
 */
export interface ErrorOutput {
  /**
   * Adds a line to the error output. Makes sure the error element is unhidden. Is deplayed
   * to give errors during DOM building a change to be displayed.
   *
   * @param message The text to add
   */
  displayError(message: string): void;

  /**
   * Clears the text of the error output and hides the error element.
   */
  clearErrors(): void;
}

/**
 * Facilities to synchronize inputs and controls with a web component.
 *
 * Is the counterpart of the Followed interface.
 */
export interface Follower {
  /**
   * Finds the Pacioli web component whose identifier matches this
   * element's 'for' field. Returns null if it is not found. Throws
   * an error if an element is found, but it is not a Pacioli
   * web component.
   */
  attachedComponent(): PacioliWebComponent | null;

  /**
   * Registers a callback with the attached Pacioli web component.
   *
   * Unfollows any previously followed component.
   *
   * @param callback The callback to register
   */
  followAttached(callback: () => void): void;

  /**
   * Registers a callback with the Pacioli web component with the given id.
   *
   * Unfollows any previously followed component.
   *
   * @param id The element id of the Pacioli web component
   * @param callback The callback to register
   */
  follow(id: string, callback: () => void): void;

  /**
   * Unregisters a previously registered callback. If no callback was
   * registered it does nothing.
   */
  unfollow(): void;
}

/**
 * Facilities to synchronize inputs and controls with a web component.
 *
 * Is the counterpart of the Follower interface.
 *
 * The followed component is responsible for calling the callbacks when
 * relevant changes occur.
 */
export interface Followed {
  /**
   * Register a callback. Called by followers.
   *
   * @param callback
   */
  registerCallback(callback: () => void): void;

  /**
   * Unregister a callback. Called by followers.
   *
   * @param callback
   */
  unregisterCallback(callback: () => void): void;

  /**
   * Call all registered callbacks.
   */
  callCallbacks(): void;

  /**
   * Is the element busy? Followers can use it as a hint to display status.
   */
  isBusy(): boolean;
}
