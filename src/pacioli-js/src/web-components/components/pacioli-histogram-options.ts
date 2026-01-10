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

import { PacioliWebController } from "../pacioli-web-controller";
import {
  addButtonEventListener,
  addInputEventListener,
  attachedPacioliWebComponent,
} from "../utils";
import type { PacioliHistogramComponent } from "./pacioli-histogram";

const TEMPLATE = document.createElement("template");

TEMPLATE.innerHTML = `
  <style>
    .pacioli-controls-animation {
      background: var(--bg-color);
    }

    .pacioli-controls-configuration {
      background: var(--bg-color);
    }
  </style>
  <div class="buttons">
    <button class="dot">Dot</button>
    <button class="sturges">Sturges</button>
    <button class="freedman-diaconis">FD</button>
    <button class="custom">Custom</button>
  </div>
  <div class="inputs">
    <label class="bins">nr. bins
      <input type="number"></input>
    </label>
    <label class="lower">lower
      <input type="number"></input>
    </label>
    <label class="upper">upper
      <input type="number"></input>
    </label>
  </div>
`;

/**
 * The 'pacioli-histogram-options' web component. A web component with
 * controls for the 'pacioli-histogram' web component.
 *
 * The chart's options are changed by manipulating the chart's attributes
 * in the DOM.
 *
 * @example
 * <pacioli-histogram id="my_histogram" ... >
 *    <parameter> ... </parameter>
 *    ...
 * </pacioli-histogram>
 *
 * <pacioli-histogram-options for="my_histogram"></pacioli-histogram-options>
 */
export class PacioliHistogramOptionsComponent extends PacioliWebController {
  /**
   * Web component field.
   */
  static observedAttributes = ["for"];

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    super.connectedCallback();

    // Create the content from the template
    this.contentParent().appendChild(TEMPLATE.content.cloneNode(true));
    this.contentParent().className = "pacioli histogram options";

    // Connect all event handlers to the content elements
    this.addEventListeners();

    // Set the inputs initially to the values from the heuristic. After initial
    // construction we don't touch the users input. Delay the call to make sure
    // the inputs exist.
    setTimeout(() => {
      this.updateInputs();
    }, 1);
  }

  /**
   * The histogram web component to which this element is connected via the id in
   * the 'for' field.
   *
   * @returns The connected histogram, or undefined if no connected histogram exists.
   */
  histogramElement(): PacioliHistogramComponent | undefined {
    const component = attachedPacioliWebComponent(this);
    return component ? (component as PacioliHistogramComponent) : undefined;
  }

  /**
   * Helper for connectedCallback. Call only once!
   */
  private addEventListeners() {
    const inputElements = [
      [".bins input", "bins"],
      [".lower input", "lower"],
      [".upper input", "upper"],
    ];

    // Add event handlers to the inputs. Update the chart's attributes
    // from the new input values.
    inputElements.forEach(([className, attribute]) => {
      addInputEventListener(this.inputElement(className), (value) => {
        if (value === "") {
          this.histogramElement()?.removeAttribute(attribute);
        } else {
          this.histogramElement()?.setAttribute(attribute, value);
        }
      });
    });

    // Add an event handler to the custom button. It sets or unsets
    // the 'bins' attribute. The bounds don't need to be set, because
    // they are not changed by the heuristics.
    addButtonEventListener(this.buttonElement(".custom"), () => {
      const value = this.inputElement(".bins input").value;
      if (value === "") {
        this.histogramElement()?.removeAttribute("bins");
      } else {
        this.histogramElement()?.setAttribute("bins", value);
      }
    });

    const heuristics = [
      [".dot", "dot"],
      [".sturges", "sturges"],
      [".freedman-diaconis", "freedman-diaconis"],
    ];

    // Add an event handler to the heuristic buttons. It must remove
    // the 'bins' attribute, otherwise it would have no effect.
    heuristics.forEach(([className, heuristic]) => {
      addButtonEventListener(this.buttonElement(className), () => {
        this.histogramElement()?.removeAttribute("bins");
        this.histogramElement()?.setAttribute("heuristic", heuristic);
      });
    });
  }

  /**
   * Sets the input values from the actual chart values.
   */
  private updateInputs() {
    const nrBinsInput = this.inputElement(".bins input");
    const lowerBoundInput = this.inputElement(".lower input");
    const upperBoundInput = this.inputElement(".upper input");

    const histogram = this.histogramElement();

    if (histogram) {
      const nrBins = histogram.getAttribute("nrBins");
      if (nrBins !== null) {
        nrBinsInput.value = nrBins;
      }
      const lower = histogram.getAttribute("lower");
      if (lower !== null) {
        lowerBoundInput.value = lower;
      }
      const upper = histogram.getAttribute("upper");
      if (upper !== null) {
        upperBoundInput.value = upper;
      }
    }
  }

  private inputElement(className: string): HTMLInputElement {
    return this.findElement(className) as HTMLInputElement;
  }

  private buttonElement(className: string): HTMLButtonElement {
    return this.findElement(className) as HTMLButtonElement;
  }
}

customElements.define(
  "pacioli-histogram-options",
  PacioliHistogramOptionsComponent
);
