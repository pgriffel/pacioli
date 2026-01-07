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

import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import {
  addButtonEventListener,
  addCheckBoxEventListener,
  attachedPacioliWebComponent,
} from "../utils";
import type { PacioliSceneComponent } from "./pacioli-scene";

const TEMPLATE = document.createElement("template");

TEMPLATE.innerHTML = `
  <style>
   
    :host {
      display: block;
    }
    
    .content {
      display: flex;
      flex-direction: row;
      gap: 8pt;
      align-items: left;
      flex-wrap: wrap;
      padding: 8pt;
    }

    .animation {
      display: flex;
      flex-direction: row;
      gap: 8pt;
      flex-wrap: wrap;
    }

    .configuration {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8pt;
    }

    button {
      width: 80pt;
    }
    
    input[type="checkbox"]
    {
        vertical-align: middle;
        margin-right: 0pt;
    }
  </style>

  <div class="configuration" part="configuration">
    <label class="axis">
      <input type="checkbox" part="input axis"></input>
      axis
    </label>
    <label class="grid">
      <input type="checkbox" part="input grid"></input>
      grid
    </label>
    <label class="labels">
      <input type="checkbox" part="input labels"></input>
      labels
    </label>
    <label class="rotate">
      <input type="checkbox" part="input rotate"></input>
      rotate
    </label>
  </div>
  
  <div class="animation" part="animation">
    <button class="run" part="button run">Run</button>
    <button class="step" part="button step">Step</button>
    <button class="reset" part="button reset">Reset</button>
    <button class="snapshot" part="button snapshot">Snapshot</button>
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
export class PacioliControlsComponent extends PacioliShadowTreeComponent {
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
  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    _newValue: string
  ) {
    switch (name) {
      case "for": {
        // Only handle changes after the initial construction. Initial
        // construction is done in connectedCallback.
        if (this.isConnected) {
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

    // Make sure the proper buttons are shown and enabled
    // this.updateControls();
    setTimeout(() => {
      this.updateControls();
    }, 1);
  }

  /**
   * The PacioliScene element to which this element is connected via the id in
   * the 'for' field.
   *
   * @returns The connected PacioliScene, or undefined if no connected scene exists.
   */
  sceneElement(): PacioliSceneComponent | undefined {
    const component = attachedPacioliWebComponent(this);
    return component ? (component as PacioliSceneComponent) : undefined;
  }

  /**
   * Helper for connectedCallback. Call only once!
   */
  private addEventListeners() {
    addButtonEventListener(this.animationButton('[part="button run"]'), () => {
      this.startButtonClicked();
    });
    addButtonEventListener(this.animationButton('[part="button step"]'), () => {
      this.stepButtonClicked();
    });
    addButtonEventListener(
      this.animationButton('[part="button reset"]'),
      () => {
        this.resetButtonClicked();
      }
    );

    addCheckBoxEventListener(this.configurationLabel(".axis"), (checked) => {
      this.axisCheckBoxClicked(checked);
    });
    addCheckBoxEventListener(this.configurationLabel(".grid"), (checked) => {
      this.gridCheckBoxClicked(checked);
    });
    addCheckBoxEventListener(this.configurationLabel(".labels"), (checked) => {
      this.labelsCheckBoxClicked(checked);
    });
    addCheckBoxEventListener(this.configurationLabel(".rotate"), (checked) => {
      this.autoRotateCheckboxClicked(checked);
    });
    addButtonEventListener(this.animationButton(".snapshot"), () => {
      this.snapshotButtonClicked();
    });
  }

  /**
   * Handler for the start button
   */
  private startButtonClicked() {
    const scene = this.sceneElement();

    if (scene) {
      try {
        const isRunning = scene.isRunning();

        if (isRunning !== undefined) {
          scene.setRunning(!isRunning);

          this.updateControls();
        }
      } catch (err: unknown) {
        scene.displayError(err instanceof Error ? err.message : String(err));
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
      } catch (err: unknown) {
        scene.displayError(err instanceof Error ? err.message : String(err));
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
      } catch (err: unknown) {
        scene.displayError(err instanceof Error ? err.message : String(err));
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
      } catch (err: unknown) {
        scene.displayError(err instanceof Error ? err.message : String(err));
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
      } catch (err: unknown) {
        scene.displayError(err instanceof Error ? err.message : String(err));
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
      } catch (err: unknown) {
        scene.displayError(err instanceof Error ? err.message : String(err));
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
      } catch (err: unknown) {
        scene.displayError(err instanceof Error ? err.message : String(err));
      }
    }
  }

  /**
   * Handler for the snapshot button
   */
  private snapshotButtonClicked() {
    const followedId = this.getAttribute("for");
    const scene = this.sceneElement();
    if (scene && followedId !== null) {
      scene.openImage(followedId);
    } else {
      if (scene) {
        scene.displayError("No scene to take snapshot of");
      } else {
        alert("No scene to take snapshot of");
      }
    }
  }

  /**
   * Set the disabled and hidden state of the controls. Also set the
   * button labels for the animation buttons.
   */
  private updateControls() {
    // const animationElement = this.findElement(".animation");

    const runButton = this.animationButton(".run");
    const stepButton = this.animationButton(".step");
    const resetButton = this.animationButton(".reset");

    const scene = this.sceneElement();

    if (scene && scene.space) {
      // If we get here the space must have been created
      const space = scene.space;

      this.configurationCheckbox(".axis").checked = space.hasAxis();
      this.configurationCheckbox(".grid").checked = space.hasGrid();
      this.configurationCheckbox(".labels").checked = space.hasLabels();
      this.configurationCheckbox(".rotate").checked =
        space.autoRotateSpeed() > 0;

      // Distinguish animations and static scenes
      if (scene.isAnimation()) {
        const isRunning = space.isRunning();

        // animationElement.style.display = "";
        runButton.style.display = "";
        stepButton.style.display = "";
        resetButton.style.display = "";

        runButton.innerText = isRunning ? "Pause" : "Run";
        stepButton.innerText = "Step " + space.runningTime().toFixed(2) + "s";

        runButton.disabled = false;
        stepButton.disabled = isRunning;
        resetButton.disabled = isRunning;
      } else {
        runButton.style.display = "none";
        stepButton.style.display = "none";
        resetButton.style.display = "none";
      }
    } else {
      // No scene, just enable the animation buttons
      runButton.style.display = "";
      stepButton.style.display = "";
      resetButton.style.display = "";

      runButton.disabled = false;
      stepButton.disabled = false;
      resetButton.disabled = false;
    }
  }

  private animationButton(className: string): HTMLButtonElement {
    return this.findElement(className) as HTMLButtonElement;
  }

  private configurationLabel(className: string): HTMLLabelElement {
    return this.findElement(`.configuration ${className}`) as HTMLLabelElement;
  }

  private configurationCheckbox(className: string): HTMLInputElement {
    return this.configurationLabel(className).children[0] as HTMLInputElement;
  }
}

customElements.define("pacioli-controls", PacioliControlsComponent);
