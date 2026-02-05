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

import { evaluateWebComponentDefinition } from "./definition";

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
  attributes: string[],
) {
  let object = {};
  for (const attribute of attributes) {
    const value = element.getAttribute(attribute);
    if (value !== null) {
      object = { ...object, [attribute]: value };
    }
  }
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
  attributes: string[],
) {
  let object = {};
  for (const attribute of attributes) {
    const value = element.getAttribute(attribute);
    if (value !== null) {
      const num = Number(value);
      if (Number.isFinite(num)) {
        object = { ...object, [attribute]: num };
      } else {
        throw new Error(`Invalid number ${value} for attritube ${attribute}`);
      }
    }
  }
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
  attributes: string[],
) {
  let object = {};
  for (const attribute of attributes) {
    object = { ...object, [attribute]: element.hasAttribute(attribute) };
  }
  return object;
}

/**
 * Unfinished experiment to check the validity of encountered web-component attributes.
 */
const FLAG_EXPERIMENT_CHECK_ATTRIBUTES: boolean = false;

export function optionsFromAttributes<Options>(
  element: HTMLElement,
  supportedAttributes: {
    strings: string[];
    booleans: string[];
    numbers: string[];
  },
): Partial<Options> {
  if (FLAG_EXPERIMENT_CHECK_ATTRIBUTES) {
    const SYSTEM_ATTRIBUTES = ["id", "definition"];

    for (const attribute of element.getAttributeNames()) {
      if (
        !SYSTEM_ATTRIBUTES.includes(attribute) &&
        !supportedAttributes.strings.includes(attribute) &&
        !supportedAttributes.booleans.includes(attribute) &&
        !supportedAttributes.numbers.includes(attribute)
      ) {
        console.warn(`Skipping unknown attribute ${attribute}`);
      }
    }
  }

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
  },
): Partial<Options> {
  if (!element.hasAttribute("options")) {
    return {};
  }

  const optionValue = evaluateWebComponentDefinition(element, "options");
  // TODO: accept tuples?! Zie random_vec_histogram_options in web_components.pacioli
  if (optionValue.kind === "list") {
    const table = new Map<string, string | null>();

    for (const item of optionValue) {
      if (item.kind !== "tuple") {
        throw new Error(
          `found a ${item.kind} in the options instead of a tuple. Chart options must be pairs (tuple) of strings.`,
        );
      }
      if (item[0].kind !== "string") {
        throw new Error(
          `chart option key must be a string, got a ${item[0].kind}`,
        );
      }
      if (item[1].kind !== "string") {
        throw new Error(
          `chart option value for ${item[0].value} must be a string, got a ${item[1].kind}`,
        );
      }
      if (table.has(item[0].value)) {
        console.warn(`Duplicate chart attribute ${item[0].value}`);
      }
      const key = item[0].value;
      const value = item[1].value;
      table.set(key, value);
    }

    let object = {};

    for (const attribute of supportedAttributes.strings) {
      if (table.has(attribute)) {
        object = { ...object, [attribute]: table.get(attribute) };
        table.set(attribute, null);
      }
    }

    for (const attribute of supportedAttributes.booleans) {
      if (table.has(attribute)) {
        object = { ...object, [attribute]: table.get(attribute) === "true" };
        table.set(attribute, null);
      }
    }

    for (const attribute of supportedAttributes.numbers) {
      if (table.has(attribute)) {
        const value = table.get(attribute);
        const num = Number(value);
        if (Number.isFinite(num)) {
          object = { ...object, [attribute]: num };
          table.set(attribute, null);
        } else {
          throw new Error(
            `invalid number ${num.toString()} for attritube ${attribute}`,
          );
        }
      }
    }

    for (const key of table.keys()) {
      if (table.get(key) !== null) {
        console.warn(`Ignoring unknown chart option '${key}'`);
      }
    }

    return object;
  } else {
    throw new Error(
      `attribute options must be a list, got a ${optionValue.kind}`,
    );
  }
}

export function addInputEventListener(
  inputElement: HTMLInputElement,
  handler: (value: string) => void,
) {
  inputElement.addEventListener("change", (event: Event) => {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    handler(target.value);
  });
}

export function addButtonEventListener(
  element: HTMLButtonElement,
  handler: () => void,
) {
  element.addEventListener("click", (event: Event) => {
    handler();
    event.preventDefault();
  });
}

export function addCheckBoxEventListener(
  element: HTMLElement,
  handler: (checked: boolean) => void,
) {
  element.addEventListener("change", (event: Event) => {
    event.preventDefault();
    handler((event.target as HTMLInputElement).checked);
  });
}

//  Helpers to reflect a numeric attribute to a property
//
// three cases
// boolean -> always true or false. Maps to present or absent
// string -> string | undefined
// number -> always number. absent maps to NaN

export function getNumberAttribute(
  element: HTMLElement,
  attribute: string,
  defaultValue: number = 0,
): number {
  const att = element.getAttribute(attribute);
  return Number(att ?? defaultValue);
}

export function setNumberAttribute(
  element: HTMLElement,
  attribute: string,
  value: number | undefined,
) {
  if (value === undefined) {
    element.removeAttribute(attribute);
  } else {
    element.setAttribute(attribute, value.toString());
  }
}

export function getStringAttribute(
  element: HTMLElement,
  attribute: string,
  defaultValue: string,
): string;

export function getStringAttribute(
  element: HTMLElement,
  attribute: string,
  defaultValue?: undefined,
): string | undefined;

/* eslint-disable */
export function getStringAttribute(
  element: any,
  attribute: any,
  defaultValue?: any,
): any {
  return element.getAttribute(attribute) ?? defaultValue;
}
/* eslint-enable */

export function setStringAttribute(
  element: HTMLElement,
  attribute: string,
  value: string | undefined,
) {
  if (value === undefined) {
    element.removeAttribute(attribute);
  } else {
    element.setAttribute(attribute, value);
  }
}

export function getBooleAttribute(
  element: HTMLElement,
  attribute: string,
): boolean {
  return element.hasAttribute(attribute);
}

export function setBooleAttribute(
  element: HTMLElement,
  attribute: string,
  value: boolean | undefined,
) {
  if (value === true) {
    element.setAttribute(attribute, "");
  } else {
    element.removeAttribute(attribute);
  }
}

export type AttributeSpec = {
  strings: string[];
  booleans: string[];
  numbers: string[];
};

export function mergeAttributeSpecs(...specs: AttributeSpec[]): AttributeSpec {
  return specs.reduce(
    (spec, other) => {
      return {
        strings: [...spec.strings, ...other.strings],
        booleans: [...spec.booleans, ...other.booleans],
        numbers: [...spec.numbers, ...other.numbers],
      };
    },
    {
      strings: [],
      booleans: [],
      numbers: [],
    },
  );
}

export function collectAllAttributes(spec: AttributeSpec): string[] {
  return [...spec.strings, ...spec.booleans, ...spec.numbers];
}
