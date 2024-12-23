import { PacioliWebController } from "../pacioli-web-controller";
import { PacioliSceneComponent } from "./pacioli-scene";

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
export class PacioliControlsComponent extends PacioliWebController {
  /**
   * Auto-rotation speed
   */
  static SECONDS_PER_ROTATION = 30;

  // The controls are divided into animation controls and configuration
  // controls
  animationElement: HTMLDivElement = document.createElement("div");
  configurationElement: HTMLDivElement = document.createElement("div");

  // The buttons
  stepButton = createButton("Step", () => this.stepButtonClicked());
  startButton = createButton("Run", () => this.startButtonClicked());
  resetButton = createButton("Reset", () => this.resetButtonClicked());
  axisCheckBox = createCheckBox("axis", (checked) =>
    this.axisCheckBoxClicked(checked)
  );
  gridCheckBox = createCheckBox("grid", (checked) =>
    this.gridCheckBoxClicked(checked)
  );
  labelsCheckBox = createCheckBox("labels", (checked) =>
    this.labelsCheckBoxClicked(checked)
  );
  autoRotateButton = createCheckBox("rotate", (checked) =>
    this.autoRotateCheckboxClicked(checked)
  );

  constructor() {
    super();
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    super.connectedCallback();

    // The parent to which elements will be added
    const parent = this.contentParent();

    // Set the CSS styles
    this.contentParent().className = "pacioli-controls-content";
    this.animationElement.className = "pacioli-controls-animation";
    this.configurationElement.className = "pacioli-controls-configuration";

    // Add the parent elements
    parent.appendChild(this.animationElement);
    parent.appendChild(this.configurationElement);

    // Add the new elements to the parent
    this.animationElement.appendChild(this.startButton);
    this.animationElement.appendChild(this.stepButton);
    this.animationElement.appendChild(this.resetButton);

    this.configurationElement.appendChild(this.axisCheckBox);
    this.configurationElement.appendChild(this.gridCheckBox);
    this.configurationElement.appendChild(this.labelsCheckBox);
    this.configurationElement.appendChild(this.autoRotateButton);

    // Make sure the proper buttons are shown and enabled
    this.updateControls();

    // If we are connected to a scene, then we need to keep the
    // state of the buttons synchronized with the scene animation.
    this.followAttached(() => this.updateControls());
  }

  /**
   * The PacioliScene element to which this element is connected via the id in
   * the 'for' field.
   *
   * @returns The connected PacioliScene, or undefined if no connected scene exists.
   */
  sceneElement(): PacioliSceneComponent | undefined {
    const component = this.attachedComponent();
    return component ? (component as PacioliSceneComponent) : undefined;
  }

  /**
   * Handler for the start button
   */
  private startButtonClicked() {
    const scene = this.sceneElement();
    if (scene) {
      try {
        scene.setRunning(!scene.isRunning());
        this.updateControls();
      } catch (error: any) {
        scene.displayError(error);
      }
    }
  }

  /**
   * Handler for the step button
   */
  private stepButtonClicked() {
    const scene = this.sceneElement();
    if (scene) {
      try {
        scene.step();
        this.updateControls();
      } catch (error: any) {
        scene.displayError(error);
      }
    }
  }

  /**
   * Handler for the reset button
   */
  private resetButtonClicked() {
    const scene = this.sceneElement();
    if (scene) {
      try {
        // scene.setParameters(this.inputs.map((input) => input.element.value));
        scene.reset();
        this.updateControls();
      } catch (error: any) {
        scene.displayError(error);
      }
    }
  }

  /**
   * Handler for the axis checkbox
   */
  private axisCheckBoxClicked(checked: boolean) {
    const scene = this.sceneElement();
    if (scene && scene.space) {
      try {
        if (checked) {
          scene.space.showAxis();
        } else {
          scene.space.hideAxis();
        }
      } catch (error: any) {
        scene.displayError(error);
      }
    }
  }

  /**
   * Handler for the axis checkbox
   */
  private labelsCheckBoxClicked(checked: boolean) {
    const scene = this.sceneElement();
    if (scene && scene.space) {
      try {
        if (checked) {
          scene.space.showLabels();
        } else {
          scene.space.hideLabels();
        }
      } catch (error: any) {
        scene.displayError(error);
      }
    }
  }

  /**
   * Handler for the axis checkbox
   */
  private gridCheckBoxClicked(checked: boolean) {
    const scene = this.sceneElement();
    if (scene && scene.space) {
      try {
        if (checked) {
          scene.space.showGrid();
        } else {
          scene.space.hideGrid();
        }
      } catch (error: any) {
        scene.displayError(error);
      }
    }
  }

  /**
   * Handler for the auto-rotate button
   */
  private autoRotateCheckboxClicked(checked: boolean) {
    const scene = this.sceneElement();
    if (scene && scene.space) {
      try {
        if (checked) {
          scene.space.startAutoRotation(
            PacioliControlsComponent.SECONDS_PER_ROTATION
          );
        } else {
          scene.space.stopAutoRotation();
        }
      } catch (error: any) {
        scene.displayError(error);
      }
    }
  }

  /**
   * Set the disabled and hidden state of the buttons. Also set the
   * button labels for the animation buttons.
   */
  private updateControls() {
    const scene = this.sceneElement();

    if (scene && scene.space) {
      // If we get here the space must have been created
      const space = scene.space!;

      const box = this.axisCheckBox.children[0] as HTMLInputElement;
      box.checked = space.hasAxis();

      const gridCheckBox = this.gridCheckBox.children[0] as HTMLInputElement;
      gridCheckBox.checked = space.hasGrid();

      const labelsCheckBox = this.labelsCheckBox
        .children[0] as HTMLInputElement;
      labelsCheckBox.checked = space.hasLabels();

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
        this.animationElement.hidden = true;
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

/**
 * Creates a HTML button. De buttons has css class 'pacioli-controls-button'.
 *
 * @param label The text on the button
 * @param callback Function called when the button is clicked
 * @returns The new button
 */
function createButton(label: string, callback: () => void) {
  let buttonElement = document.createElement("button");

  buttonElement.innerText = label;
  buttonElement.className = "pacioli-controls-button";
  buttonElement.onclick = callback;

  return buttonElement;
}

/**
 * Creates a HTML checkbox (a label with nested input). De checkbox has css
 * class 'pacioli-controls-checkbox'.
 *
 * @param label The text on the checkbox
 * @param callback Function called when the checkbox is changed
 * @returns The new checkbox
 */
function createCheckBox(label: string, callback: (checked: boolean) => void) {
  let labelElement = document.createElement("label");
  let checkboxElement = document.createElement("input");

  labelElement.innerText = label;
  checkboxElement.type = "checkbox";
  labelElement.className = "pacioli-controls-checkbox";
  checkboxElement.onchange = (event) =>
    callback((event.target as HTMLInputElement).checked);

  labelElement.appendChild(checkboxElement);
  return labelElement;
}

customElements.define("pacioli-controls", PacioliControlsComponent);
