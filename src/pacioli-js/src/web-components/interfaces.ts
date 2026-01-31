/**
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { PacioliValue } from "../values/pacioli-value";

/**
 * Base API for all Pacioli web components. This includes input components (controls) or
 * output components (charts, 3D scene).
 */
export interface PacioliWebComponentBase {
  /**
   * The web component root element. Use the contentParent to append content.
   */
  rootElement(): HTMLElement | null;

  /**
   * Element to append content.
   */
  contentParent(): HTMLElement | null;

  /**
   * Makes the content parent element (not the root element) empty.
   */
  clearContent(): void;

  /**
   * Convenience method to find an HTMLElement in the component's element tree that is
   * expected to exist.
   *
   * Throws an error if the element does not exist.
   *
   * The selector must yield a HTMLElement (and not simply a Element).
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
   *
   * Calls to parametersChanged are surrounded by a try-catch that displays the
   * error. No need to add a try-catch unless this standard behaviour must be
   * overridden.
   */
  parametersChanged(): void;

  /**
   * Computes the value or function identified by the 'definition' attribute.
   * For a function the current parameter values are used as arugments.
   *
   * @returns A PacioliValue
   */
  evaluateDefinition(): PacioliValue;
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
