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

import { SIUnit } from "uom-ts";
import { PacioliString } from "../values/string";
import { PacioliMatrix } from "../values/matrix";
import { num, parseDimNum, value } from "../api";
import { PacioliFunction } from "../values/function";
import { PacioliValue } from "../boxing";
import { PacioliWebComponent } from "./pacioli-web-component";
import { PacioliBoole, pacioliFalse, pacioliTrue } from "../values/boole";
import { string } from "../cache";

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
 * Returns the Pacioli value corresponding with the element's 'script' and 'definition'
 * attribute values. If the defined value is a Pacioli function then the
 * function is called with the element's parameter values. If it is not
 * a function then the defined value is returned as is.
 *
 * @param element An HTML web element, typically a web component
 * @returns The computed Pacioli value
 */
export function computeWebComponentValue(
  element: HTMLElement,
  attribute: string = "definition"
): PacioliValue {
  // Get the element's 'script' and 'definition' attributes
  const script = element.getAttribute("script");
  const definition = element.getAttribute(attribute);

  // Check that they exist
  if (script === null || definition === null) {
    throw new Error(
      `definition not found.\n\n Please give a 'script' attribute with a valid Pacioli filename, and a 'definition' attribute with a valid value or function name.`
    );
  }

  // Compute the value
  const pacioliValue = value(script, definition);

  if (pacioliValue instanceof PacioliFunction) {
    // If it is a function then we need the parameter values
    const params = parameterNodes(element)
      .map(parseParameterNode)
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
  return Array.from(element.childNodes).filter(
    (child) => child.nodeName === "PARAMETER"
  ) as HTMLElement[];
}

export function setParameterNodes(element: HTMLElement, values: string[]) {
  const children = parameterNodes(element);

  if (children.length === values.length) {
  } else {
    const script = element.getAttribute("script");
    const definition = element.getAttribute("definition");

    throw Error(
      `invalid number of arugments for definition '${definition}' from script '${script}'. Expected ${children.length}, but got ${values.length}.`
    );
  }

  for (let i = 0; i < children.length; i++) {
    children[i].innerText = values[i];
  }
}

/**
 * Turns the raw parameter attribues from a PacioliWebComponent parameter child node
 * into a PacioliParameter object.
 *
 * @param parameters List of attribute values for the scene parameters
 * @returns A list of parsed parameters.
 */
export function parseParameterNode(
  parameterNode: HTMLElement
): PacioliParameter {
  const label = parameterNode.getAttribute("label") || "n/a";
  const type = parameterNode.getAttribute("type") || "number";
  const unit = parameterNode.getAttribute("unit") || "1";
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
          throw Error(`invalid value for ${type} parameter ${label}`);
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
          `unexpected parameter type '${type}' for parameter '${label}'. Expected 'string', 'number', or 'boole'.`
        );
      }
    }
  } catch (error: any) {
    throw Error(
      `cannot read value ${value} for ${type} parameter ${label}:\n\n ${error}.`
    );
  }
}

/**
 * The Pacioli web component that is referenced by an element's 'for' attribute. Returns
 * undefined if no such component is found.
 *
 * @param element The element with the 'for' attribute
 * @returns The referenced element, or undefined if it is not found.
 */
export function attachedPacioliWebComponent(
  element: HTMLElement
): PacioliWebComponent | null {
  const elementId = element.getAttribute("for");
  return elementId ? getPacioliWebComponentById(elementId) : null;
}

/**
 * The Pacioli web component that is referenced by an element's 'for' attribute. Returns
 * undefined if no such component is found.
 *
 * @param element The element with the 'for' attribute
 * @returns The referenced element, or undefined if it is not found.
 */
export function getPacioliWebComponentById(
  elementId: string
): PacioliWebComponent | null {
  const element = document.getElementById(elementId);

  if (element) {
    if ("setParameters" in element) {
      return element as PacioliWebComponent;
    } else {
      throw Error(
        `Id ${elementId} does not reference a Pacioli web component. Please provide a valid id.`
      );
    }
  } else {
    return null;
  }
}

/**
 * Collects existing string attribute values from an element.
 *
 * @param element A DOM element
 * @param attributes A list of attribute names
 * @returns An object with an entry for each attribute in argument attributes that exists
 * in element
 */
export function optionalStringAttributes(
  element: HTMLElement,
  attributes: string[]
) {
  let object = {};
  attributes.forEach((attribute) => {
    const value = element.getAttribute(attribute);
    if (value !== null) {
      object = { ...object, [attribute]: value };
    }
  });
  return object;
}

/**
 * Collects existing numeric attribute values from an element.
 *
 * @param element A DOM element
 * @param attributes A list of attribute names
 * @returns An object with an entry for each attribute in argument attributes that exists
 * in element
 */
export function optionalNumberAttributes(
  element: HTMLElement,
  attributes: string[]
) {
  let object = {};
  attributes.forEach((attribute) => {
    const value = element.getAttribute(attribute);
    if (value !== null) {
      const num = Number(value);
      if (Number.isFinite(num)) {
        object = { ...object, [attribute]: num };
      } else {
        throw Error(`Invalid number ${value} for attritube ${attribute}`);
      }
    }
  });
  return object;
}

/**
 * Collects boolean attribute values from an element.
 *
 * @param element A DOM element
 * @param attributes A list of attribute names
 * @returns An object with an entry for each attribute in argument attributes
 */
export function optionalBooleanAttributes(
  element: HTMLElement,
  attributes: string[]
) {
  let object = {};
  attributes.forEach((attribute) => {
    object = { ...object, [attribute]: element.hasAttribute(attribute) };
  });
  return object;
}

export function optionsFromAttributes<Options>(
  element: HTMLElement,
  supportedAttributes: {
    strings: string[];
    booleans: string[];
    numbers: string[];
  }
): Partial<Options> {
  return {
    ...optionalStringAttributes(element, supportedAttributes.strings),
    ...optionalBooleanAttributes(element, supportedAttributes.booleans),
    ...optionalNumberAttributes(element, supportedAttributes.numbers),
  };
}

export function optionsFromScript<Options>(
  element: HTMLElement,
  supportedAttributes: {
    strings: string[];
    booleans: string[];
    numbers: string[];
  }
): Partial<Options> {
  if (!element.hasAttribute("options")) {
    return {};
  }

  const optionValue = computeWebComponentValue(element, "options");
  if (optionValue.kind === "list") {
    const items = optionValue as any;
    const table = new Map<string, string | null>();

    items.forEach((item: any) => {
      if (item.kind !== "tuple") {
        throw Error(
          `found a ${item.kind} in the options instead of a tuple. Chart options must be pairs (tuple) of strings.`
        );
      }
      if (item[0].kind !== "string") {
        throw Error(`chart option key must be a string, got a ${item[0].kind}`);
      }
      if (item[1].kind !== "string") {
        throw Error(
          `chart option value for ${item[0].value} must be a string, got a ${item[1].kind}`
        );
      }
      if (table.has(item[0].value)) {
        console.warn(`Duplicate chart attribute ${item[0].value}`);
      }
      const key = item[0].value;
      const value = item[1].value;
      table.set(key, value);
    });

    let object = {};

    supportedAttributes.strings.forEach((attribute) => {
      if (table.has(attribute)) {
        object = { ...object, [attribute]: table.get(attribute) };
        table.set(attribute, null);
      }
    });

    supportedAttributes.booleans.forEach((attribute) => {
      if (table.has(attribute)) {
        object = { ...object, [attribute]: table.get(attribute) === "true" };
        table.set(attribute, null);
      }
    });

    supportedAttributes.numbers.forEach((attribute) => {
      if (table.has(attribute)) {
        const num = Number(table.get(attribute));
        if (Number.isFinite(num)) {
          object = { ...object, [attribute]: num };
          table.set(attribute, null);
        } else {
          throw Error(`invalid number ${value} for attritube ${attribute}`);
        }
      }
    });

    for (let key of table.keys()) {
      if (table.get(key) !== null) {
        console.warn(`Ignoring unknown chart option '${key}'`);
      }
    }

    return object;
  } else {
    throw Error(`attribute options must be a list, got a ${optionValue.kind}`);
  }
}

export function addInputEventListener(
  inputElement: HTMLInputElement,
  handler: (value: string) => void
) {
  inputElement.addEventListener("change", (event: Event) => {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    handler(target.value);
  });
}

export function addButtonEventListener(
  element: HTMLButtonElement,
  handler: () => void
) {
  element.addEventListener("click", (event: Event) => {
    handler();
    event.preventDefault();
  });
}

export function addCheckBoxEventListener(
  element: HTMLElement,
  handler: (checked: boolean) => void
) {
  element.addEventListener("change", (event: Event) => {
    event.preventDefault();
    handler((event.target as HTMLInputElement).checked);
  });
}
