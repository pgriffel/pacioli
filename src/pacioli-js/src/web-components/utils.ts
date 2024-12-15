import { si, SIUnit } from "uom-ts";
import { PacioliString } from "../values/string";
import { Matrix } from "../values/matrix";
import { fun, num, string } from "../api";
import { PacioliFunction } from "../values/function";
import { PacioliValue } from "../value";

/**
 * Types for the parsed PacioliSceneComponent parameters. The parameters are passed via
 * child DOM elements.
 */
export type PacioliParameter = NumberParameter | StringParameter;

export type NumberParameter = {
  type: "number";
  label: string;
  value: string;
  unit: string;
  pacioliValue: Matrix;
  pacioliUnit: SIUnit;
};

export type StringParameter = {
  type: "string";
  label: string;
  value: string;
  pacioliValue: PacioliString;
};

/**
 * Wrapper around api function 'fun' with a PacioliScene specific error message if the
 * function is not found.
 */
export function pacioliFunction(script: string, func: string): PacioliFunction {
  try {
    return fun(script, func);
  } catch (error: any) {
    console.log(error);
    throw Error(
      `function '${func}' from script '${script}' is unknown.\n\n Please give a valid Pacioli filename in the 'script' attribute, and a valid function name in the 'function' attribute, and check that the compiled file is included.`
    );
  }
}

// export class WebComponentFunction {
//   private readonly fun = pacioliFunction(this.script, this.file);

//   constructor(public readonly script: string, public readonly file: string) {}

//   apply(args: PacioliValue[]): PacioliValue {
//     return this.fun.apply(args);
//   }

//   call(element: HTMLElement): PacioliValue {
//     const params = parseParameters(currentParameters(element));
//     return this.fun.apply(params.map((p) => p.pacioliValue));
//   }
// }

// export interface PacioliWebComponent extends HTMLElement {
//   script?: string;
//   function?: string;
// }

export function callWebComponentFunction(element: HTMLElement): PacioliValue {
  const script = element.getAttribute("script");
  const fun = element.getAttribute("function");

  if (script === null || fun === null) {
    throw new Error(
      `script function is unknown.\n\n Please give a 'script' attribute with the Pacioli filename, and a 'function' attribute with the scene function name.`
    );
  }

  const pacioliFun = pacioliFunction(script, fun);
  const params = parameterNodes(element).map(parseParameterNode);
  return pacioliFun.apply(params.map((p) => p.pacioliValue));
}

/**
 * The element's DOM children. They contain the parameters for the scene function.
 */
export function parameterNodes(element: HTMLElement): HTMLElement[] {
  return Array.from(element.childNodes).filter(
    (child) => child.nodeName === "PARAMETER"
  ) as HTMLElement[];
}

/**
 * Collect the parameter label, type, unit and value for the DOM children.
 */
export function currentParameters(element: HTMLElement): {
  label: string;
  type: string;
  unit: string;
  value: string;
}[] {
  return parameterNodes(element).map((child) => ({
    label: child.getAttribute("label") || "n/a",
    type: child.getAttribute("type") || "number",
    unit: child.getAttribute("unit") || "1",
    value: child.innerText,
  }));
}

/**
 * Turns the raw parameter attribues from the PacioliSceneComponent child nodes
 * into PacioliParameter objects.
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
        const dimNum = si.parseDimNum(value + " * " + unit);

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

      default: {
        throw new Error(
          `unexpected parameter type '${type}' for parameter '${label}'. Expected 'string' or 'number'.`
        );
      }
    }
  } catch (error: any) {
    throw Error(
      `cannot read value ${value} for ${type} parameter ${label}:\n\n ${error}.`
    );
  }
}

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
