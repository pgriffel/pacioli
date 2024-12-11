import { si, SIUnit } from "uom-ts";
import { PacioliScene, Space, Animation, StatefulAnimation } from "../space";
import { fun, num, string } from "../api";
import { PacioliString } from "../values/string";
import { Matrix } from "../values/matrix";

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
          return {
            label: node.label,
            type: "string",
            value: node.value,
            pacioliValue: string(node.value),
          };
        }

        case "number": {
          // Browsers give an empty string on invalid input. This gives a
          // unclear error message in si.parseDimNum below.
          if (node.value === "") {
            throw Error(
              `invalid value for for ${node.type} parameter ${node.label}`
            );
          }

          const dimNum = si.parseDimNum(node.value + " * " + node.unit);

          return {
            label: node.label,
            type: "number",
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
 * @returns A list of objects with a 'parameter' and a 'input' field
 */
export function createParameterInputs(
  parsedParameters: PacioliParameter[],
  enterKeyCallback?: () => void
): {
  parameter: PacioliParameter;
  input: HTMLInputElement;
}[] {
  return parsedParameters.map((parameter) => {
    const inputElement = document.createElement("input");

    inputElement.className = "pacioli-controls-input";
    inputElement.value = parameter.value;
    inputElement.type = parameter.type;

    if (enterKeyCallback) {
      // Needed to make the return key reset the animation
      inputElement.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          enterKeyCallback();
        }
      });
    }

    return { parameter, input: inputElement };
  });
}

/**
 * Create a HMTML table for the PacioliSceneComponent parameters
 *
 * @param inputs A list of objects with a 'parameter' and a 'input' field
 * @returns A HTML table
 */
export function createParameterTable(
  inputs: {
    parameter: PacioliParameter;
    input: HTMLInputElement;
  }[]
) {
  const table = document.createElement("table");

  table.className = "pacioli-controls-table";

  for (const record of inputs) {
    const row = document.createElement("tr");
    const key = document.createElement("td");
    const value = document.createElement("td");
    const un = document.createElement("td");

    key.innerText = record.parameter.label;

    switch (record.parameter.type) {
      case "string": {
        un.innerText = "";
        break;
      }
      case "number": {
        un.innerText = record.parameter.pacioliUnit.toText();
        break;
      }
    }

    value.appendChild(record.input);

    row.appendChild(key);
    row.appendChild(value);
    row.appendChild(un);

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
  const params = parameters.map((parameter) => parameter.pacioliValue);

  const scene = fun(script, func).apply(params);

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
