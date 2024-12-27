import { callWebComponentFunction, setParameterNodes } from "./utils";
import { PacioliValue } from "../value";
import {
  Callable,
  ErrorOutput,
  Followed,
  PacioliWebComponentBase,
} from "./interfaces";

const TEMPLATE = document.createElement("template");

TEMPLATE.innerHTML = `
  <style>
    #error-root {
      background: yellow;
      color: red;
    }
    #close-button {
      margin: 5pt;
    }
  </style>
  <div id="error-root">
    <div id="error-content"></div>
    <button id="close-button">Close</button>
  </div>
  <div id="content">
  </div>
`;

/**
 * Abstract base class for Pacioli web components.
 *
 */
export abstract class PacioliWebComponent
  extends HTMLElement
  implements PacioliWebComponentBase, Callable, Followed, ErrorOutput
{
  /**
   * List of registered callbacks. The callback mechanism is used by connected controls and
   * input elements to get informed about relevant changes.
   */
  private callbacks: (() => void)[] = [];

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
    return this.rootElement().querySelector("#content")!;
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
    return callWebComponentFunction(this);
  }

  /**
   * Implementation of the Followed api.
   */
  registerCallback(callback: () => void) {
    this.callbacks.push(callback);
  }

  /**
   * Implementation of the Followed api.
   */
  unregisterCallback(callback: () => void) {
    this.callbacks = this.callbacks.filter((obj) => obj !== callback);
  }

  /**
   * Implementation of the Followed api.
   */
  callCallbacks() {
    for (let callback of this.callbacks) {
      callback();
    }
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
    console.log(message);

    // Delay displaying the errors for errors during DOM building (e.g. in
    // attributeChangedCallback) to increase the probability that the
    // error output pane exists.
    setTimeout(() => {
      this.errorRoot().hidden = false;

      const content = this.errorContentParent();
      content.innerText = message + "\n\n" + content.innerText;
    }, 1);
  }

  /**
   * Implementation of the ErrorOutput api.
   */
  clearErrors() {
    this.errorContentParent().innerText = "";
    this.errorRoot().hidden = true;
  }

  private errorRoot(): HTMLElement {
    return this.rootElement().querySelector("#error-root")!;
  }

  private errorContentParent(): HTMLElement {
    return this.rootElement().querySelector("#error-content")!;
  }

  private closeErrorOutputButton(): HTMLElement {
    return this.rootElement().querySelector("#close-button")!;
  }
}
