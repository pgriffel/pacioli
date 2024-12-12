import { PacioliSceneComponent } from "./pacioli-scene";
import {
  createButton,
  createCheckBox,
  createParameterInputs,
  createParameterTable,
  PacioliParameter,
} from "./utils";

/**
 * Web component with controls for the PacioliScene web component.
 *
 *
 * @example
 * <pacioli-scene id="my_scene" ... >
 *    <parameter> ... </parameter>
 *    ...
 * </pacioli-scene>
 *
 * <pacioli-controls for="my_scene"></pacioli-controls>
 */
export class PacioliControlsComponent extends HTMLElement {
  // Auto-rotation speed
  static SECONDS_PER_ROTATION = 30;

  // Web component field
  static observedAttributes = ["for"];

  // Id of the connected PacioliScene
  for?: string;

  // The controls are divided into animation controls and configuration
  // controls
  animationElement: HTMLDivElement = document.createElement("div");
  configurationElement: HTMLDivElement = document.createElement("div");

  // Inputs for the scene parameters
  inputs?: {
    parameter: PacioliParameter;
    element: HTMLInputElement;
  }[];

  // Table of parameters inputs
  table?: HTMLTableElement;

  // The buttons
  stepButton = createButton("Step", () => this.stepButtonClicked());
  startButton = createButton("Run", () => this.startButtonClicked());
  resetButton = createButton("Reset", () => this.resetButtonClicked());
  autoRotateButton = createCheckBox("Rotate", (checked) =>
    this.autoRotateCheckboxClicked(checked)
  );
  axisCheckBox = createCheckBox("Axis", (checked) =>
    this.axisCheckBoxClicked(checked)
  );
  gridCheckBox = createCheckBox("Grid", (checked) =>
    this.gridCheckBoxClicked(checked)
  );

  constructor() {
    super();
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    // The parent to which elements will be added
    const parent = this;

    // Alternative that uses a shadow DOM with its own style sheet.
    // How can we use the shadow DOM and still allow overriding the
    // style of the controls?

    // const parent = this.attachShadow({ mode: "open" });
    // const sheet = new CSSStyleSheet();
    // sheet.replaceSync("button { color: red; border: 2px dotted black;}");
    // parent.adoptedStyleSheets = [sheet];

    // Add the parent elements
    this.animationElement.className = "pacioli-controls-animation";
    this.configurationElement.className = "pacioli-controls-configuration";

    parent.appendChild(this.animationElement);
    parent.appendChild(this.configurationElement);

    // Create a table of inputs for the scene parameters
    this.inputs = this.createInputs();
    this.table = createParameterTable(this.inputs);

    // Add the new elements to the parent
    this.animationElement.appendChild(this.startButton);
    this.animationElement.appendChild(this.stepButton);
    this.animationElement.appendChild(this.table);
    this.animationElement.appendChild(this.resetButton);

    this.configurationElement.appendChild(this.axisCheckBox);
    this.configurationElement.appendChild(this.gridCheckBox);
    this.configurationElement.appendChild(this.autoRotateButton);

    // Make sure the proper buttons are shown and enabled
    this.updateControls();

    // If we are connected to a scene, then we need to keep the
    // state of the buttons synchronized with the scene animation.
    const scene = this.sceneElement();
    if (scene) {
      scene.registerCallback(() => this.updateControls());
    }
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    switch (name) {
      case "for": {
        this.for = newValue;
        break;
      }
    }
  }

  /**
   * The PacioliScene element to which this element is connected via the id in
   * the 'for' field.
   *
   * @returns The connected PacioliScene, or undefined if no connected scene exists.
   */
  sceneElement(): PacioliSceneComponent | undefined {
    return this.for
      ? (document.getElementById(this.for) as PacioliSceneComponent)
      : undefined;
  }

  /**
   * Create inputs for the scene parameters
   *
   * @returns List of objects with a 'paramater' and a 'input' field.
   */
  private createInputs(): {
    parameter: PacioliParameter;
    element: HTMLInputElement;
  }[] {
    const scene = this.sceneElement();
    if (scene) {
      return createParameterInputs(scene.parsedParameters(), () =>
        this.resetButton.click()
      );
    } else {
      return [];
    }
  }

  /**
   * Handler for the start button
   */
  private startButtonClicked() {
    const scene = this.sceneElement();
    if (scene) {
      scene.setRunning(!scene.isRunning());
      this.updateControls();
    }
  }

  /**
   * Handler for the step button
   */
  private stepButtonClicked() {
    const scene = this.sceneElement();
    if (scene) {
      scene.step();
      this.updateControls();
    }
  }

  /**
   * Handler for the reset button
   */
  private resetButtonClicked() {
    const scene = this.sceneElement();
    if (scene && this.inputs) {
      scene.setParameters(
        this.inputs.map((input) => {
          return {
            value: input.element.value,
          };
        })
      );
      scene.reset();
      this.updateControls();
    }
  }

  /**
   * Handler for the axis checkbox
   */
  private axisCheckBoxClicked(checked: boolean) {
    const scene = this.sceneElement();
    if (scene && scene.space) {
      if (checked) {
        scene.space.showAxis();
        scene.space.draw();
      } else {
        scene.space.hideAxis();
        scene.space.draw();
      }
    }
  }

  /**
   * Handler for the axis checkbox
   */
  private gridCheckBoxClicked(checked: boolean) {
    const scene = this.sceneElement();
    if (scene && scene.space) {
      if (checked) {
        scene.space.showGrid();
        scene.space.draw();
      } else {
        scene.space.hideGrid();
        scene.space.draw();
      }
    }
  }

  /**
   * Handler for the auto-rotate button
   */
  private autoRotateCheckboxClicked(checked: boolean) {
    const scene = this.sceneElement();
    if (scene && scene.space) {
      if (checked) {
        scene.space.startAutoRotation(
          PacioliControlsComponent.SECONDS_PER_ROTATION
        );
      } else {
        scene.space.stopAutoRotation();
      }
    }
  }

  /**
   * Set the disabled and hidden state of the buttons. Also set the
   * button labels for the animation buttons.
   */
  private updateControls() {
    const scene = this.sceneElement();

    if (scene) {
      // If we get here the space must have been created
      const space = scene.space!;

      const box = this.axisCheckBox.children[0] as HTMLInputElement;
      box.checked = space.hasAxis();

      const gridCheckBox = this.gridCheckBox.children[0] as HTMLInputElement;
      gridCheckBox.checked = space.hasGrid();

      // Distinguish animations and static scenes
      if (space.isAnimation()) {
        const isRunning = space.isRunning();

        this.animationElement.hidden = false;
        this.stepButton.hidden = false;
        this.startButton.hidden = false;

        this.stepButton.innerText =
          "Step " + space.runningTime().toFixed(2) + "s";
        this.startButton.innerText = isRunning ? "Pause" : "Run";

        this.stepButton.disabled = isRunning;
        this.resetButton.disabled = isRunning;
        this.startButton.disabled = false;
      } else {
        this.animationElement.hidden =
          this.inputs === undefined || this.inputs.length === 0;

        this.stepButton.hidden = true;
        this.startButton.hidden = true;

        this.resetButton.disabled = false;
      }
    } else {
      // No scene, just disable the buttons
      this.resetButton.disabled = true;
      this.stepButton.disabled = true;
      this.startButton.disabled = true;
    }
  }
}

customElements.define("pacioli-controls", PacioliControlsComponent);
