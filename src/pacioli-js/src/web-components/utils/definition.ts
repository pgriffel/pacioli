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

import type { SIUnit } from "uom-ts";
import type { PacioliString } from "../../values/string";
import type { PacioliMatrix } from "../../values/matrix";
import { num, parseDimNum, value } from "../../api";
import { PacioliFunction } from "../../values/function";
import type { PacioliValue } from "../../values/pacioli-value";
import type { PacioliWebComponent } from "../pacioli-web-component";
import type { PacioliBoole } from "../../values/boole";
import { pacioliFalse, pacioliTrue } from "../../values/boole";
import { string } from "../../cache";
import { PacioliError } from "../../pacioli-error";

/**
 * Types for the parsed PacioliSceneComponent parameters. The parameters are passed via
 * child DOM elements.
 */
export type PacioliParameter =
  | NumberParameter
  | StringParameter
  | BooleParameter;

export type NumberParameter = {
  type: "number";
  label: string;
  value: string;
  unit: string;
  pacioliValue: PacioliMatrix;
  pacioliUnit: SIUnit;
};

export type StringParameter = {
  type: "string";
  label: string;
  value: string;
  pacioliValue: PacioliString;
};

export type BooleParameter = {
  type: "boole";
  label: string;
  value: string;
  pacioliValue: PacioliBoole;
};

/**
 * Returns the Pacioli value corresponding with the element's 'definition'
 * attribute. If the defined value is a Pacioli function then the
 * function is called with the element's parameter values. If it is not
 * a function then the defined value is returned as is.
 *
 * @param element An HTML web element, typically a web component
 * @returns The computed Pacioli value
 */
export function evaluateWebComponentDefinition(
  element: HTMLElement,
  attribute: string = "definition",
): PacioliValue {
  // Get the element's 'script' and 'definition' attributes
  let script = null;
  let definition = null;

  const attValue = element.getAttribute(attribute);

  if (attValue !== null) {
    const parts = attValue.split(":");

    if (parts.length === 2) {
      script = parts[0];
      definition = parts[1];
    } else if (parts.length === 3 && parts[0] === "lib") {
      script = "$" + parts[1] + "_" + parts[1];
      definition = parts[2];
    } else {
      throw new Error(
        `definition ${attValue} is invalid. Expected a string of the form 'script:definition'.`,
      );
    }
  }

  // Check that they exist
  if (script === null || definition === null) {
    throw new Error(
      `definition not found.\n\n Please give a 'definition' attribute of the form 'script:definition' with a valid value or function name.`,
    );
  }

  // Compute the value
  const pacioliValue = value(script, definition);

  if (pacioliValue instanceof PacioliFunction) {
    // If it is a function then we need the parameter values
    const params = parameterNodes(element)
      .map((element) => parseParameterNode(element))
      .map((p) => p.pacioliValue);

    // Call the function with the parameters
    return pacioliValue.apply(params);
  } else {
    // Not a function, just return the value.
    return pacioliValue;
  }
}

/**
 * The element's DOM children. They contain the parameters for the scene function.
 */
export function parameterNodes(element: HTMLElement): HTMLElement[] {
  return [...element.children].filter(
    (child) => child.nodeName === "PARAMETER",
  ) as HTMLElement[];
}

export function setParameterNodes(element: HTMLElement, values: string[]) {
  const children = parameterNodes(element);

  if (children.length !== values.length) {
    const definition = element.getAttribute("definition");

    throw new Error(
      `invalid number of arugments for definition '${
        definition ?? "unknown"
      }'. Expected ${children.length.toString()}, but got ${values.length.toString()}.`,
    );
  }

  for (const [i, child] of children.entries()) {
    child.innerText = values[i];
  }
}

/**
 * Adds a MutationObserver to an element. The observer triggers 'parametersChanged' when
 * a parameter child node changes.
 *
 * @param element The HTML element
 * @returns the new MutationObserver
 */
export function addParametersObserver(
  element: PacioliWebComponent,
): MutationObserver {
  const observer = new MutationObserver(() => {
    try {
      element.parametersChanged();
    } catch (err: unknown) {
      element.displayError(err instanceof Error ? err.message : String(err));
    }
  });

  observer.observe(element, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  return observer;
}

/**
 * Turns the raw parameter attribues from a PacioliWebComponent parameter child node
 * into a PacioliParameter object.
 *
 * @param parameters List of attribute values for the scene parameters
 * @returns A list of parsed parameters.
 */
export function parseParameterNode(
  parameterNode: HTMLElement,
): PacioliParameter {
  const label = parameterNode.getAttribute("label") ?? "n/a";
  const type = parameterNode.getAttribute("type") ?? "number";
  const unit = parameterNode.getAttribute("unit") ?? "1";
  const value = parameterNode.innerText;

  try {
    switch (type) {
      case "string": {
        // Create a StringParameter
        return {
          type: "string",
          label: label,
          value: value,
          pacioliValue: string(value),
        };
      }

      case "number": {
        // Browsers give an empty string on invalid input. This gives a
        // unclear error message in si.parseDimNum below.
        if (value === "") {
          throw new Error(`invalid value for ${type} parameter ${label}`);
        }

        // Parse the number and the unit
        const dimNum = parseDimNum(value + " * " + unit);

        // Create a NumberParameter
        return {
          type: "number",
          label: label,
          value: value,
          unit: unit,
          pacioliUnit: dimNum.unit,
          pacioliValue: num(Number(dimNum.magnitude), dimNum.unit),
        };
      }

      case "boole": {
        // Create a BooleParameter
        return {
          type: "boole",
          label: label,
          value: value,
          pacioliValue: value === "true" ? pacioliTrue : pacioliFalse,
        };
      }

      default: {
        throw new Error(
          `unexpected parameter type '${type}' for parameter '${label}'. Expected 'string', 'number', or 'boole'.`,
        );
      }
    }
  } catch (error: unknown) {
    throw new Error(
      `cannot read value ${value} for ${type} parameter ${label}:\n\n ${
        error instanceof Error ? error.message : String(error)
      }.`,
    );
  }
}

/**
 * The HTML elements that are referenced by an element's 'for' attribute. The attribute
 * can be a comma separated list.
 *
 * @param element The element with the 'for' attribute
 * @returns The referenced elements.
 */
export function targetElements(element: HTMLElement): HTMLElement[] {
  const elementId = element.getAttribute("for");
  if (elementId === null) {
    throw new PacioliError(
      "No 'for' attribute found. Provide a 'for' attribute with the target's element id as value.",
    );
  } else {
    const components: HTMLElement[] = [];

    for (const id of elementId.split(",")) {
      const trimmed = id.trim();
      const component = document.getElementById(trimmed);
      if (component === null) {
        throw new PacioliError(
          `Could not find element '${trimmed}'. Provide a valid element id in the 'for' attribute.`,
        );
      } else {
        components.push(component);
      }
    }
    return components;
  }
}
