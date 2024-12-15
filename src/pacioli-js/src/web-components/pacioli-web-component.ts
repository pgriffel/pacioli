import { callWebComponentFunction, parameterNodes } from "./utils";
import { PacioliValue } from "../value";

/**
 * Abstract class for web components displaying some computed PacioliValue.
 *
 * Implements
 * 1) Reading parameter values from the DOM and calling some script function with them
 * 2) Displaying errors
 *
 */
export class PacioliWebComponent extends HTMLElement {
  // Parameters for function that computes the PacioliValue.
  script?: string;
  function?: string;

  // HTML element to display errors.
  errorDiv = document.createElement("div");
  errorText = document.createElement("div");
  closeErrorButton = document.createElement("button");

  constructor() {
    super();
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    // Append the error elements
    this.appendErrorDivs(this.rootElement());

    // Delay loading the space until the DOM children exist. We need the children so we can get
    // the parameter values.
    setTimeout(() => {
      try {
        this.dataAvailable(this.fetchData());
      } catch (error: any) {
        this.displayError(error);
      }
    }, 1);
  }

  /**
   * Abstract method. Called when the function return value is available.
   *
   * @param _ The PacioliValue to display.
   */
  dataAvailable(_: PacioliValue) {}

  /**
   * Abstract method. Must erturn the component root element.
   */
  rootElement(): HTMLElement {
    throw Error("Method rootElement must be overridden!");
  }

  /**
   * Set the parameter values programmatically. Updates the values in the DOM children. Only sets the
   * magnitudes. The units are fixed.
   *
   * @param {*} values The parameter values. List of objects with a 'value' field, one for each
   * script function parameter. Must match the parameter child nodes.
   */
  setParameters(values: string[]) {
    const children = parameterNodes(this);

    for (let i = 0; i < children.length; i++) {
      children[i].innerText = values[i];
    }
  }

  /**
   * Calls the script function
   *
   * @returns A PacioliValue
   */
  fetchData(): PacioliValue {
    return callWebComponentFunction(this);
  }

  /**
   * Adds DOM elements for error output
   *
   * @param parent The component parent to which the elements are added
   */
  appendErrorDivs(parent: HTMLElement) {
    this.errorDiv.style.color = "red";
    this.errorDiv.style.background = "yellow";
    this.errorDiv.style.padding = "8pt";
    this.errorDiv.hidden = true;

    this.closeErrorButton.innerText = "Close";
    this.closeErrorButton.onclick = (_: Event) => this.clearErrors();

    parent.appendChild(this.errorDiv);

    this.errorDiv.appendChild(this.errorText);
    this.errorDiv.appendChild(this.closeErrorButton);
  }

  /**
   * Adds a line to the error output. Makes sure the error element is unhidden.
   *
   * @param message The text to add
   */
  displayError(message: string) {
    console.log(message);
    this.errorDiv.hidden = false;
    this.errorText.innerText = message + "\n\n" + this.errorText.innerText;
  }

  /**
   * Clears the text of the error output and hides the error element.
   */
  clearErrors() {
    this.errorText.innerText = "";
    this.errorDiv.hidden = true;
  }
}
