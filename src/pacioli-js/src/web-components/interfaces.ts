import { PacioliValue } from "../value";
import { PacioliWebComponent } from "./pacioli-web-component";

/**
 * API for web components displaying some computed PacioliValue.
 *
 * Extends the HTMLElement with
 * 1) Reading parameter values from the DOM and calling some script function with them
 * 2) Displaying errors
 * 3) A callback mechanism for synchronizing attached controls and inputs
 */
export interface PacioliWebComponentBase {
  /**
   * The web component root element. Has the error output and the content
   * as children. Use the parentDiv to append content.
   */
  rootElement(): HTMLElement;

  /**
   * Element to append content.
   */
  contentParent(): HTMLElement;

  /**
   * Makes the parent element (not the root) empty.
   */
  clearContent(): void;
}

/**
 * API for web components displaying some computed PacioliValue.
 *
 * Extends the HTMLElement with
 * 1) Reading parameter values from the DOM and calling some script function with them
 * 2) Displaying errors
 * 3) A callback mechanism for synchronizing attached controls and inputs
 */
export interface Callable {
  /**
   * Set the parameter values programmatically. Updates the values in the DOM children.
   * Only sets the magnitudes. The units are fixed.
   *
   * @param values
   */
  setParameters(values: string[]): void;

  /**
   * Called when the parameters are changed, also initially after construction.
   */
  parametersChanged(): void;

  /**
   * Calls the function identified by the 'script' and the 'function' attributes.
   *
   * @returns A PacioliValue
   */
  fetchData(): PacioliValue;
}

export interface ErrorOutput {
  /**
   * Adds a line to the error output. Makes sure the error element is unhidden.
   *
   * @param message The text to add
   */
  displayError(message: string): void;

  /**
   * Clears the text of the error output and hides the error element.
   */
  clearErrors(): void;
}

export interface Follower {
  attachedComponent(): PacioliWebComponent | null;

  followAttached(callback: () => void): void;

  follow(id: string, callback: () => void): void;

  unfollow(): void;
}

export interface Followed {
  /**
   *
   * @param callback
   */
  registerCallback(callback: () => void): void;

  /**
   *
   * @param callback
   */
  unregisterCallback(callback: () => void): void;

  /**
   *
   */
  callCallbacks(): void;

  /**
   *
   */
  isBusy(): boolean;
}
