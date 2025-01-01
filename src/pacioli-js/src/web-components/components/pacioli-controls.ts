import { PacioliWebController } from "../pacioli-web-controller";
import { PacioliSceneComponent } from "./pacioli-scene";

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
  <div class="pacioli-controls-animation">
    <button class="run">Run</button>
    <button class="step">Step</button>
    <button class="reset">Reset</button>
  </div>
  <div class="pacioli-controls-configuration">
    <label class="axis" for="">axis
      <input type="checkbox"></input>
    </label>
    <label class="grid" for="">grid
      <input type="checkbox"></input>
    </label>
    <label class="labels" for="">labels
      <input type="checkbox"></input>
    </label>
    <label class="rotate" for="">rotate
      <input type="checkbox"></input>
    </label>
  </div>
`;

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
   * Web component field.
   */
  static observedAttributes = ["for"];

  /**
   * Auto-rotation speed
   */
  static SECONDS_PER_ROTATION = 30;

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string | null, next: string) {
    switch (name) {
      case "for": {
        // Only handle changes after the initial construction. Initial
        // construction is done in connectedCallback.
        if (this.isConnected) {
          this.unfollow();
          this.follow(next, () => this.updateControls());
          this.updateControls();
        }
        break;
      }
    }
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    super.connectedCallback();

    // Create the content from the template
    this.contentParent().appendChild(TEMPLATE.content.cloneNode(true));

    // Connect all event handlers to the content elements
    this.addEventListeners();

    // Set the CSS styles
    this.contentParent().className = "pacioli-controls-content";

    // Make sure the proper buttons are shown and enabled
    this.updateControls();

    // If we are connected to a scene, then we need to keep the
    // state of the buttons synchronized with the scene animation.
    if (this.attachedComponent()) {
      this.followAttached(() => this.updateControls());
    }
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
   * Helper for connectedCallback. Call only once!
   */
  private addEventListeners() {
    this.addButtonEventListener(".run", () => this.startButtonClicked());
    this.addButtonEventListener(".step", () => this.stepButtonClicked());
    this.addButtonEventListener(".reset", () => this.resetButtonClicked());

    this.addCheckBoxEventListener(".axis", (checked) =>
      this.axisCheckBoxClicked(checked)
    );
    this.addCheckBoxEventListener(".grid", (checked) =>
      this.gridCheckBoxClicked(checked)
    );
    this.addCheckBoxEventListener(".labels", (checked) =>
      this.labelsCheckBoxClicked(checked)
    );
    this.addCheckBoxEventListener(".rotate", (checked) =>
      this.autoRotateCheckboxClicked(checked)
    );
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
   * Handler for the labels checkbox
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
   * Handler for the grid checkbox
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
   * Handler for the auto-rotate checkbox
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
   * Set the disabled and hidden state of the controls. Also set the
   * button labels for the animation buttons.
   */
  private updateControls() {
    const animationElement = this.findElement(".pacioli-controls-animation");

    const runButton = this.animationButton(".run");
    const stepButton = this.animationButton(".step");
    const resetButton = this.animationButton(".reset");

    const scene = this.sceneElement();

    if (scene && scene.space) {
      // If we get here the space must have been created
      const space = scene.space!;

      this.configurationCheckbox(".axis").checked = space.hasAxis();
      this.configurationCheckbox(".grid").checked = space.hasGrid();
      this.configurationCheckbox(".labels").checked = space.hasLabels();
      this.configurationCheckbox(".rotate").checked =
        space.autoRotateSpeed() > 0;

      // Distinguish animations and static scenes
      if (space.isAnimation()) {
        const isRunning = space.isRunning();

        animationElement.style.display = "";
        runButton.hidden = false;
        stepButton.hidden = false;

        runButton.innerText = isRunning ? "Pause" : "Run";
        stepButton.innerText = "Step " + space.runningTime().toFixed(2) + "s";

        runButton.disabled = false;
        stepButton.disabled = isRunning;
        resetButton.disabled = isRunning;
      } else {
        animationElement.style.display = "none";
      }
    } else {
      // No scene, just disable the animation buttons
      runButton.disabled = true;
      stepButton.disabled = true;
      resetButton.disabled = true;
    }
  }

  private animationButton(className: string): HTMLButtonElement {
    return this.findElement(
      `.pacioli-controls-animation ${className}`
    ) as HTMLButtonElement;
  }

  private configurationLabel(className: string): HTMLLabelElement {
    return this.findElement(
      `.pacioli-controls-configuration ${className}`
    ) as HTMLLabelElement;
  }

  private configurationCheckbox(className: string): HTMLInputElement {
    return this.configurationLabel(className).children[0] as HTMLInputElement;
  }

  private addButtonEventListener(className: string, handler: () => void) {
    this.animationButton(className).addEventListener("click", handler);
  }

  private addCheckBoxEventListener(
    className: string,
    handler: (_: boolean) => void
  ) {
    this.configurationLabel(className).addEventListener(
      "change",
      (event: Event) => {
        handler((event.target as HTMLInputElement).checked);
      }
    );
  }
}

customElements.define("pacioli-controls", PacioliControlsComponent);
