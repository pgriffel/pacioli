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

import {
  computeWebComponentValue,
  addParametersObserver,
  setParameterNodes,
} from "./utils";
import type { PacioliValue } from "../boxing";
import type {
  Callable,
  ErrorOutput,
  PacioliWebComponentBase,
} from "./interfaces";

const TEMPLATE = document.createElement("template");

TEMPLATE.innerHTML = `
  <style>
    .error-root {
      background: yellow;
      color: red;
      padding: 8pt;
    }
  </style>
  <div class="error-root">
    <div class="error-content"></div>
    <button class="close-button">Close</button>
  </div>
  <div class="content">
  </div>
`;

/**
 * Abstract base class for Pacioli web components.
 *
 */
export abstract class PacioliWebComponent
  extends HTMLElement
  implements PacioliWebComponentBase, Callable, ErrorOutput
{
  set definition(value: string) {
    this.setStringAttribute("definition", value);
  }

  get definition(): string {
    return this.getStringAttribute("definition");
  }

  set width(value: number) {
    this.setNumberAttribute("width", value);
  }

  get width(): number {
    return this.getNumberAttribute("width", 0);
  }

  set height(value: number) {
    this.setNumberAttribute("height", value);
  }

  get height(): number {
    return this.getNumberAttribute("height", 0);
  }

  get margin(): string {
    return this.getStringAttribute("margin");
  }

  set margin(value: string) {
    this.setStringAttribute("margin", value);
  }

  set decimals(value: number) {
    this.setNumberAttribute("decimals", value);
  }

  get decimals(): number {
    return this.getNumberAttribute("decimals", 0);
  }

  set ignoreDecimals(value: boolean) {
    this.setBooleAttribute("ignoredecimals", value);
  }

  get ignoreDecimals(): boolean {
    return this.getBooleAttribute("ignoredecimals");
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    try {
      // Add the content
      this.rootElement().appendChild(TEMPLATE.content.cloneNode(true));

      // Make the close button close the error pane
      this.errorCloseButton().addEventListener("click", () => {
        this.clearErrors();
      });

      // Make sure the error output pane is hidden
      this.clearErrors();

      // Schedule a call to parametersChanged. It must be delayed until the DOM children exist.
      // We need the children so we can get the parameter values.
      setTimeout(() => {
        try {
          this.parametersChanged();

          // Add an observer that calls 'parametersChanged' when a parameter child node changes.
          addParametersObserver(this);
        } catch (err: unknown) {
          this.displayError(err instanceof Error ? err.message : String(err));
        }
      }, 1); // On FireFox 0 is sufficient. Chrome requires > 0.
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Implementation of the PacioliWebComponent api. Abstract method. Must return
   * the component root element.
   */
  abstract rootElement(): HTMLElement;

  /**
   * Implementation of the PacioliWebComponent api.
   */
  contentParent(): HTMLElement {
    const element = this.rootElement().querySelector(".content");

    if (element === null) {
      throw Error(`Cannot find content parent`);
    }

    return element as HTMLElement;
  }

  /**
   * Implementation of the PacioliWebComponent api.
   */
  clearContent() {
    const parent = this.contentParent();
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  /**
   *Implementation for PacioliWebComponentBase
   */
  findElement(selectors: string): HTMLElement {
    const element = this.rootElement().querySelector(selectors);

    if (element === null) {
      throw Error(`Cannot find element '${selectors}'`);
    }

    return element as HTMLElement;
  }

  /**
   * Implementation of the Callable api. Does nothing.
   */
  parametersChanged(): void {}

  /**
   * Implementation of the Callable api.
   */
  setParameters(values: string[]) {
    setParameterNodes(this, values);
    try {
      this.parametersChanged();
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Implementation of the Callable api.
   */
  fetchData(): PacioliValue {
    return computeWebComponentValue(this);
  }

  /**
   * Implementation of the Followed api. Always false.
   */
  isBusy(): boolean {
    return false;
  }

  /**
   * Implementation of the ErrorOutput api.
   */
  displayError(message: string) {
    try {
      const root = this.errorRoot();
      const content = this.errorContentParent();

      root.hidden = false;
      content.innerText = message + "\n\n" + content.innerText;
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);

      console.log(
        `Error: ${message}.\n\nThe error is displayed in the console because of the following: ${errMessage}`
      );
    }
  }

  /**
   * Implementation of the ErrorOutput api.
   */
  clearErrors() {
    try {
      this.errorContentParent().innerText = "";
      this.errorRoot().hidden = true;
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);

      console.log(`Error while clearing the errors: ${errMessage}`);
    }
  }

  private errorRoot(): HTMLElement {
    const root = this.rootElement().querySelector(".error-root");

    if (root === null) {
      throw Error("Error root element does not exist");
    } else {
      // If it exists, we know it is an HTMLElement
      return root as HTMLElement;
    }
  }

  private errorContentParent(): HTMLElement {
    const content = this.rootElement().querySelector(".error-content");

    if (content === null) {
      throw Error("Error content element does not exist");
    } else {
      // If it exists, we know it is an HTMLElement
      return content as HTMLElement;
    }
  }

  private errorCloseButton(): HTMLButtonElement {
    const element = this.rootElement().querySelector(".close-button");

    if (element === null) {
      throw Error("Error close button element does not exist");
    } else {
      // If it exists, we know it is an HTMLButtonElement
      return element as HTMLButtonElement;
    }
  }

  /**
   * Helper to reflect a numeric attribute to a property
   *
   * @param attribute
   * @param value
   */
  protected setNumberAttribute(attribute: string, value: number | undefined) {
    if (value === undefined) {
      this.removeAttribute(attribute);
    } else {
      this.setAttribute(attribute, value.toString());
    }
  }

  protected getNumberAttribute(
    attribute: string,
    defaultValue: number = 0
  ): number {
    const att = this.getAttribute(attribute);
    return Number(att === null ? defaultValue : att);
  }

  protected setStringAttribute(attribute: string, value: string | undefined) {
    if (value === undefined) {
      this.removeAttribute(attribute);
    } else {
      this.setAttribute(attribute, value);
    }
  }

  protected getStringAttribute(
    attribute: string,
    defaultValue: string = ""
  ): string {
    const att = this.getAttribute(attribute);
    return att === null ? defaultValue : att;
  }

  protected setBooleAttribute(attribute: string, value: boolean | undefined) {
    if (value === true) {
      this.setAttribute(attribute, "");
    } else {
      this.removeAttribute(attribute);
    }
  }

  protected getBooleAttribute(attribute: string): boolean {
    return this.hasAttribute(attribute);
  }
}
