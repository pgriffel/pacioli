import { callWebComponentFunction, setParameterNodes } from "./utils";
import { PacioliValue } from "../value";
import {
  Callable,
  ErrorOutput,
  Followed,
  PacioliWebComponentBase,
} from "./interfaces";

/**
 * Abstract base class for Pacioli web components.
 *
 */
export abstract class PacioliWebComponent
  extends HTMLElement
  implements PacioliWebComponentBase, Callable, Followed, ErrorOutput
{
  /**
   * HTML elements to display errors
   */
  private errorElements = this.createErrorElements();

  /**
   * Parent HTML element for the component's content.
   */
  private contentDiv = document.createElement("div");

  /**
   * List of registered callbacks. The callback mechanism is used by connected controls and
   * input elements to get informed about relevant changes.
   */
  private callbacks: (() => void)[] = [];

  /**
   * Just the instantiation. The actual building is done in the connectedCallback
   * life cycle method.
   */
  constructor() {
    super();
    this.contentDiv.className = "pacioli-web-component-content";
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    const root = this.rootElement();

    // Append the error elements
    this.appendErrorDivs(root);
    root.appendChild(this.contentDiv);

    // Schedule a call to parametersChanged. It must be delayed until the DOM children exist.
    // We need the children so we can get the parameter values.
    setTimeout(() => {
      try {
        this.parametersChanged();
      } catch (error: any) {
        this.displayError(error);
      }
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
    return this.contentDiv;
  }

  /**
   * Implementation of the PacioliWebComponent api.
   */
  clearContent() {
    const parent = this.contentDiv;
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  /**
   * Implementation of the PacioliWebComponent api. Does nothing.
   */
  parametersChanged(): void {}

  /**
   * Implementation of the PacioliWebComponent api. Always false.
   */
  isBusy(): boolean {
    return false;
  }

  /**
   * Implementation of the PacioliWebComponent api.
   */
  setParameters(values: string[]) {
    setParameterNodes(this, values);
    this.parametersChanged();
  }

  /**
   * Implementation of the PacioliWebComponent api.
   */
  fetchData(): PacioliValue {
    return callWebComponentFunction(this);
  }

  /**
   * Implementation of the PacioliWebComponent api.
   */
  registerCallback(callback: () => void) {
    this.callbacks.push(callback);
  }

  /**
   * Implementation of the PacioliWebComponent api.
   */
  unregisterCallback(callback: () => void) {
    this.callbacks = this.callbacks.filter((obj) => obj !== callback);
  }

  /**
   * Implementation of the PacioliWebComponent api.
   */
  callCallbacks() {
    for (let callback of this.callbacks) {
      callback();
    }
  }

  /**
   * Implementation of the PacioliWebComponent api.
   */
  displayError(message: string) {
    console.log(message);
    this.errorElements.parent.hidden = false;
    this.errorElements.text.innerText =
      message + "\n\n" + this.errorElements.text.innerText;
  }

  /**
   * Clears the text of the error output and hides the error element.
   */
  clearErrors() {
    this.errorElements.text.innerText = "";
    this.errorElements.parent.hidden = true;
  }

  /**
   * Creates HTML elements for displaying errors.
   *
   * @returns The error output elements
   */
  private createErrorElements() {
    return {
      parent: document.createElement("div"),
      text: document.createElement("div"),
      closeButton: document.createElement("button"),
    };
  }

  /**
   * Adds DOM elements for error output
   *
   * @param parent The component parent to which the elements are added
   */
  private appendErrorDivs(parent: HTMLElement) {
    const parentElement = this.errorElements.parent;
    const text = this.errorElements.text;
    const closeButton = this.errorElements.closeButton;

    parentElement.style.color = "red";
    parentElement.style.background = "yellow";
    parentElement.style.padding = "8pt";
    parentElement.hidden = true;

    closeButton.innerText = "Close";
    closeButton.onclick = (_: Event) => this.clearErrors();

    parent.appendChild(parentElement);

    parentElement.appendChild(text);
    parentElement.appendChild(closeButton);
  }
}
