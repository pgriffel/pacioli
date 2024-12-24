import { PacioliValue } from "../value";
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
   * Makes the parent element (not the root) empty.
   */
  clearContent(): void;
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
   * Calls the function identified by the 'script' and the 'function' attributes
   * using the current parameter values.
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
