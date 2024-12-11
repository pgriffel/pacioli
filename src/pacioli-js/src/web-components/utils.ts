import { si, SIUnit } from "uom-ts";
import { PacioliScene, Space, Animation, StatefulAnimation } from "../space";
import { fun, num, string } from "../api";
import { PacioliString } from "../values/string";
import { Matrix } from "../values/matrix";
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
 * Turns the raw parameter attribues from the PacioliSceneComponent child nodes
 * into PacioliParameter objects.
 *
 * @param parameters List of attribute values for the scene parameters
 * @returns A list of parsed parameters.
 */
export function parseParameters(
  parameters: {
    label: string;
    type: string;
    unit: string;
    value: string;
  }[]
): PacioliParameter[] {
  return parameters.map((node) => {
    try {
      switch (node.type) {
        case "string": {
          // Create a StringParameter
          return {
            type: "string",
            label: node.label,
            value: node.value,
            pacioliValue: string(node.value),
          };
        }

        case "number": {
          // Browsers give an empty string on invalid input. This gives a
          // unclear error message in si.parseDimNum below.
          if (node.value === "") {
            throw Error(
              `invalid value for ${node.type} parameter ${node.label}`
            );
          }

          // Parse the number and the unit
          const dimNum = si.parseDimNum(node.value + " * " + node.unit);

          // Create a NumberParameter
          return {
            type: "number",
            label: node.label,
            value: node.value,
            unit: node.unit,
            pacioliUnit: dimNum.unit,
            pacioliValue: num(Number(dimNum.magnitude), dimNum.unit),
          };
        }

        default: {
          throw new Error(
            `unexpected parameter type '${node.type}' for parameter '${node.label}'. Expected 'string' or 'number'.`
          );
        }
      }
    } catch (error: any) {
      throw Error(
        `cannot read value ${node.value} for ${node.type} parameter ${node.label}:\n\n ${error}.`
      );
    }
  });
}

/**
 * Create HTML input elements for the PacioliSceneComponent parameters
 *
 * @param parsedParameters The parsed scene parameters
 * @param enterKeyCallback A function that is called when the enter key is pressed
 * @returns A list of objects with a 'parameter' and a 'element' field
 */
export function createParameterInputs(
  parsedParameters: PacioliParameter[],
  enterKeyCallback?: () => void
): {
  parameter: PacioliParameter;
  element: HTMLInputElement;
}[] {
  return parsedParameters.map((parameter) => {
    // Create an input element for each parameter
    const inputElement = document.createElement("input");
    inputElement.className = "pacioli-controls-input";
    inputElement.value = parameter.value;
    inputElement.type = parameter.type;

    // Add a callback for the enter key. Needed to make the return
    // key reset the animation
    if (enterKeyCallback) {
      inputElement.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          enterKeyCallback();
        }
      });
    }

    return { parameter, element: inputElement };
  });
}

/**
 * Create a HMTML table for the PacioliSceneComponent parameters
 *
 * @param inputs A list of objects with a 'parameter' and a 'element' field
 * @returns A HTML table
 */
export function createParameterTable(
  inputs: {
    parameter: PacioliParameter;
    element: HTMLInputElement;
  }[]
) {
  // Create a HTML table
  const table = document.createElement("table");
  table.className = "pacioli-controls-table";

  for (const input of inputs) {
    // Create a row with a label, a value and a unit entry
    const row = document.createElement("tr");
    const labelEntry = document.createElement("td");
    const valueEntry = document.createElement("td");
    const unitEntry = document.createElement("td");

    // Set the label
    labelEntry.innerText = input.parameter.label;

    // Append the input to the value entry
    valueEntry.appendChild(input.element);

    // Set the unit
    switch (input.parameter.type) {
      case "string": {
        unitEntry.innerText = "";
        break;
      }
      case "number": {
        unitEntry.innerText = input.parameter.pacioliUnit.toText();
        break;
      }
    }

    // Append the entries to the row
    row.appendChild(labelEntry);
    row.appendChild(valueEntry);
    row.appendChild(unitEntry);

    // Append the row to the table
    table.appendChild(row);
  }

  return table;
}

/**
 * Calls the script function and loads the result into a space. The function must
 * return a Pacioli scene, animation or stateful animation.
 *
 * Here we pass from static to the dynamic typing. Loading will crash if the
 * parameter types do no match the function's type.
 */
export function loadPacioliSpace(
  space: Space,
  script: string,
  func: string,
  kind: "scene" | "animation" | "stateful-animation",
  parameters: PacioliParameter[]
) {
  // Lookup the Pacioli function and apply it to the parameter values
  const params: PacioliValue[] = parameters.map((param) => param.pacioliValue);
  const scene: PacioliValue = pacioliFunction(script, func).apply(params);

  // Cast the PacioliValue to the expected type and hope it works out at runtime.
  // TODO: Improve error handling with runtime checks on the returned value
  switch (kind) {
    case "scene": {
      space.loadScene(scene as unknown as PacioliScene);
      break;
    }
    case "animation": {
      space.loadAnimation(scene as unknown as Animation);
      break;
    }
    case "stateful-animation": {
      space.loadStatefulAnimation(scene as unknown as StatefulAnimation);
      break;
    }
  }
}

/**
 * Wrapper around api function 'fun' with a PacioliScene specific error message if the
 * function is not found.
 */
function pacioliFunction(script: string, func: string): PacioliFunction {
  try {
    return fun(script, func);
  } catch (error: any) {
    console.log(error);
    throw Error(
      `function '${func}' from script '${script}' is unknown.\n\n Please give a valid Pacioli filename in the 'script' attribute, and a valid function name in the 'function' attribute, and check that the compiled file is included.`
    );
  }
}
