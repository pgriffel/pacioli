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
    // Add the content
    this.rootElement().appendChild(TEMPLATE.content.cloneNode(true));

    // Make the close button close the error pane
    this.closeErrorOutputButton().addEventListener("click", () =>
      this.clearErrors()
    );

    // Make sure the error output pane is hidden
    this.clearErrors();

    // Schedule a call to parametersChanged. It must be delayed until the DOM children exist.
    // We need the children so we can get the parameter values.
    setTimeout(() => {
      this.parametersChanged();

      // Add an observer that calls 'parametersChanged' when a parameter child node changes.
      addParametersObserver(this);
    }, 1); // On FireFox 0 is sufficient. Chrome requires > 0.
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
    return this.rootElement().querySelector(".content")!;
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
    return this.rootElement().querySelector(selectors)!;
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
    this.parametersChanged();
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
    const root = this.errorRoot();
    const content = this.errorContentParent();

    if (root) {
      root.hidden = false;
    }

    if (content) {
      content.innerText = message + "\n\n" + content.innerText;
    } else {
      console.log(message);
    }
  }

  /**
   * Implementation of the ErrorOutput api.
   */
  clearErrors() {
    this.errorContentParent().innerText = "";
    this.errorRoot().hidden = true;
  }

  private errorRoot(): HTMLElement {
    return this.rootElement().querySelector(".error-root")!;
  }

  private errorContentParent(): HTMLElement {
    return this.rootElement().querySelector(".error-content")!;
  }

  private closeErrorOutputButton(): HTMLElement {
    return this.rootElement().querySelector(".close-button")!;
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
      this.setAttribute(attribute, Number(value).toString());
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
    if (value) {
      this.setAttribute(attribute, "");
    } else {
      this.removeAttribute(attribute);
    }
  }

  protected getBooleAttribute(attribute: string): boolean {
    return this.hasAttribute(attribute);
  }
}
