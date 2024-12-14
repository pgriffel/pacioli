import { callWebComponentFunction } from "./utils";
import { PacioliValue } from "../value";

/**
 * Web component for a line chart. A wrapper around the LineChart class.
 *
 * Say we have a scene function foo from file bar.pacioli, and the function takes
 * a parameter for an object shape and one for mass, then
 *
 * @example
 * declare foo :: (String, gram) -> Scene(metre)
 *
 * define foo(shape, mass) = ...
 *
 * <pacioli-scene script="bar" function="foo" kind="scene">
 *       <parameter label="shape" type="string">sphere</parameter>
 *       <parameter label="mass" unit="gram">10</parameter>
 * </pacioli-scene>
 */
export class PacioliWebComponent extends HTMLElement {
  // Parameters for function loadPacioliSpace that computes the scene.
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
    // Delay loading the space until the DOM children exist. We need the children so we can get
    // the parameter values.
    setTimeout(() => {
      try {
        this.appendErrorDivs(this);

        const value = callWebComponentFunction(this);

        this.dataAvailable(value);
      } catch (error: any) {
        this.displayError(error);
      }
    }, 1);
  }

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

  dataAvailable(_: PacioliValue) {}

  /**
   * Adds a line to the error output. Makes sure the error element is unhidden.
   *
   * @param message The text to add
   */
  displayError(message: string) {
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
