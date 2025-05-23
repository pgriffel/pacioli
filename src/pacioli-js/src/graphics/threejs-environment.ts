/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023-2025 Paul Griffioen
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
import { getNumber } from "../values/numbers";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { createGridHelper, makeLabelObject } from "./threejs";
import { addMesh, disposeMesh, updateMesh } from "./mesh";
import { addPath, disposePath } from "./path";
import { addArrow, updateArrow } from "./arrow";
import { SpaceOptions } from "./space";
import { PacioliScene } from "./scene";
import { addSpotLight } from "./lights";
import { addLabel } from "./text";

/**
 * A facade for a threejs scene. Renders 3D elements, and renders
 * labels on top of the 3D scene.
 *
 * Use the root element to append it to the DOM.
 */
export class ThreeJsEnvironment {
  // Element to attach to the DOM. Container for the threejs renderers.
  private readonly root: HTMLDivElement;

  // Fixed Three.js elements
  private readonly renderer: THREE.WebGLRenderer;
  private readonly labelRenderer: CSS2DRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.Camera;
  private readonly body: THREE.Object3D<THREE.Event>;
  private readonly controls: OrbitControls;

  // Dynamic Three.js elements
  private axis?: THREE.AxesHelper;
  private axisLabels: CSS2DObject[] = [];
  private grid?: THREE.GridHelper;
  private ambientLight?: THREE.AmbientLight;

  // The space's units. Passed in from the options.
  private units: { x: SIUnit; y: SIUnit; z: SIUnit };

  /**
   * Constructs an empty scene, ready to be attached to the DOM.
   *
   * @param options Configuration options
   */
  constructor(public readonly options: SpaceOptions) {
    // Store the space units from the options in a convenient form
    this.units = {
      x: options.unitX,
      y: options.unitY,
      z: options.unitZ,
    };

    // Create a 3D WebGL renderer and a label renderer. The label renderer
    // is placed exactly on top of the WebGL renderer.
    this.renderer = createWebGLRenderer(options.width, options.height);
    this.labelRenderer = createLabelRenderer(options.width, options.height);

    // Create the root element and attach the renderers
    this.root = createRootElement(
      this.renderer.domElement,
      this.labelRenderer.domElement
    );

    // Create the remaining elements
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(options.background);

    this.camera = createCamera(options);
    this.scene.add(this.camera);

    this.controls = createOrbitControls(this.camera, this.root, options);
    this.controls.addEventListener("change", this.onChangeOrbit.bind(this));

    this.body = new THREE.Object3D();
    this.scene.add(this.body);

    // Let the camera look at the body
    this.camera.position.set(options.cameraX, options.cameraY, options.cameraZ);
    this.camera.lookAt(this.body.position);
    this.controls.update();
  }

  /**
   * Root HTML element for the Threejs scene. Add this to the DOM.
   *
   * @returns A HTML element
   */
  getRoot(): HTMLElement {
    return this.root;
  }

  /**
   * Creates threejs elements for all PacioliScene elements and adds them to the
   * three js scene.
   *
   * @param scene The scene to load
   */
  loadScene(scene: PacioliScene) {
    const [_, arrows, meshes, paths, lights, ambientLight, labels] = scene;

    for (const mesh of meshes) {
      addMesh(this.body, mesh, this.units);
    }

    for (const arrow of arrows) {
      addArrow(this.body, arrow, this.units, this.options.labelColor);
    }

    for (const path of paths) {
      addPath(this.body, path, this.units);
    }

    for (const light of lights) {
      addSpotLight(this.body, light, this.units);
    }

    for (const label of labels) {
      addLabel(this.body, label, this.units);
    }

    // Don't overrule light that is set via options. This allows
    // the web components to change the ambient light.
    this.setAmbientLight(
      this.options.ambientColor || ambientLight[0].value,
      this.options.ambientIntensity || getNumber(ambientLight[1].numbers, 0, 0)
    );
  }

  /**
   * Updates the 3D scene by applying changes to all named elements.
   *
   * @param scene - The PacioliScene to update
   */
  updateScene(scene: PacioliScene) {
    const [, arrows, meshes] = scene;

    for (const arrow of arrows) {
      updateArrow(this.body, arrow, this.units);
    }

    for (const mesh of meshes) {
      updateMesh(this.body, mesh, this.units);
    }
  }

  /**
   * Renders the scene. Calls this after changing (loading, clearing or
   * updating) a scene.
   */
  public render() {
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);

    if (this.controls.autoRotate) {
      this.controls.update();
    }
  }

  /**
   * Removes all body elements that have been loaded previously.
   */
  clear() {
    while (0 < this.body.children.length) {
      const child = this.body.children[0];

      // Free used resources
      switch (child.type) {
        case "Mesh": {
          disposeMesh(
            child as THREE.Mesh<THREE.BufferGeometry, THREE.Material>
          );
          break;
        }
        case "Line": {
          disposePath(child as THREE.Line);
          break;
        }
      }

      this.body.remove(child);
    }
  }

  /**
   * Clears the scene and frees all resources. The object cannot be used
   * anymore after this call.
   */
  dispose() {
    this.clear();

    // this.renderer.renderLists.dispose();
    this.renderer.dispose();
    this.controls.dispose();
    this.axis?.dispose();
    this.grid?.dispose();
    this.ambientLight?.dispose();
  }

  resize(width: number, height: number) {
    // this.camera.aspect = width / height;
    // this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.labelRenderer.setSize(width, height);
  }

  hasLabels(): boolean {
    // The label renderer is the second renderer. Is it present?
    return this.root.childElementCount === 2;
  }

  showLabels() {
    if (!this.hasLabels()) {
      // The label renderer is the second renderer. Add it.
      this.root.appendChild(this.labelRenderer.domElement);
    }
  }

  hideLabels() {
    if (this.hasLabels()) {
      // The label renderer is the second renderer. Remove it.
      this.root.removeChild(this.labelRenderer.domElement);
    }
  }

  hasGrid(): boolean {
    return this.grid !== undefined;
  }

  showGrid() {
    if (this.grid === undefined) {
      this.grid = createGridHelper(
        this.options.gridSizeX,
        this.options.gridSizeY,
        this.options.gridColor
      );
      this.scene.add(this.grid);
    }
  }

  hideGrid() {
    if (this.grid) {
      this.scene.remove(this.grid);
      this.grid.dispose();
      this.grid = undefined;
    }
  }

  hasAxis(): boolean {
    return this.axis !== undefined;
  }

  showAxis() {
    if (this.axis === undefined) {
      this.axis = createAxis(
        this.options.axisSize,
        this.options.axisColorsX,
        this.options.axisColorsY,
        this.options.axisColorsZ
      );
      this.scene.add(this.axis);
    }

    // Create axis labels if requested
    if (!this.options.hideLabels) {
      this.showAxisLabels();
    }
  }

  hideAxis() {
    this.hideAxisLabels();

    if (this.axis) {
      this.scene.remove(this.axis);
      this.axis.dispose();
      this.axis = undefined;
    }
  }

  hasAxisLabels() {
    this.axisLabels.length > 0;
  }

  showAxisLabels() {
    if (this.axisLabels.length === 0) {
      this.axisLabels = createAxisLabels(
        this.units,
        this.options.axisSize,
        this.options.labelColor
      );

      this.axisLabels.forEach((label) => this.scene.add(label));
    }
  }

  hideAxisLabels() {
    this.axisLabels.forEach((label) => this.scene.remove(label));
    this.axisLabels = [];
  }

  /**
   * Starts auto rotation with the given speed. Uses the speed from the
   * options if no speed is given.
   *
   * @param secondsPerRotation Rotation speed in seconds per rotation.
   */
  startAutoRotation(secondsPerRotation?: number) {
    // Convert to THREE's unit of speed
    this.controls.autoRotateSpeed =
      60 / (secondsPerRotation ?? this.options.secondsPerRotation);

    // Turn on THREE's built-in auto rotation
    this.controls.autoRotate = true;
  }

  /**
   * Stops auto rotation
   */
  stopAutoRotation() {
    // Turn off THREE's built-in auto rotation
    this.controls.autoRotate = false;
  }

  /**
   * Is auto rotation on?
   */
  isAutoRotating(): boolean {
    return this.controls.autoRotate;
  }

  /**
   * Auto rotation speed.
   *
   * @returns The speed of the auto rotation in seconds per rotation.
   */
  autoRotateSpeed(): number {
    return this.controls.autoRotate ? 60 / this.controls.autoRotateSpeed : 0;
  }

  setAmbientLight(color: string, intensity: number) {
    if (this.ambientLight === undefined) {
      this.ambientLight = new THREE.AmbientLight();
      this.scene.add(this.ambientLight);
    }
    this.ambientLight.color = new THREE.Color(color);
    this.ambientLight.intensity = intensity;
  }

  private onChangeOrbit() {
    requestAnimationFrame(() => {
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
    });
  }
}

function createRootElement(
  webGLElement: HTMLElement,
  labelElement: HTMLElement
) {
  const renderersDiv = document.createElement("div");

  renderersDiv.style.position = "relative";

  // Create the 3D WebGL renderer and append it to the given parent
  renderersDiv.appendChild(webGLElement);

  // Create the label renderer and append it to the given parent
  // It is placed exactly on top of the WebGL renderer.
  renderersDiv.appendChild(labelElement);

  return renderersDiv;
}

function createWebGLRenderer(
  width: number,
  height: number
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true, // Required for snaphshot images
  });

  renderer.setSize(width, height);

  return renderer;
}

function createLabelRenderer(width: number, height: number): CSS2DRenderer {
  const labelRenderer = new CSS2DRenderer();

  labelRenderer.setSize(width, height);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  labelRenderer.domElement.style.zIndex = "99";

  return labelRenderer;
}

function createOrbitControls(
  camera: THREE.Camera,
  domElement: HTMLElement,
  options: {
    zoomMin: number;
    zoomMax: number;
  }
) {
  const controls = new OrbitControls(camera, domElement);

  controls.minDistance = options.zoomMin;
  controls.maxDistance = options.zoomMax;
  controls.maxPolarAngle = Math.PI / 1;

  return controls;
}

function createCamera(options: {
  orthographic: boolean;
  width: number;
  height: number;
  perspectiveMax: number;
}) {
  const kind = options.orthographic ? "orthographic" : "perspective";

  switch (kind) {
    case "perspective": {
      return new THREE.PerspectiveCamera(
        50,
        options.width / options.height,
        0.1,
        options.perspectiveMax
      );
    }
    case "orthographic": {
      // This fudge factor makes the zoom more compatible with the
      // perspective camera. The orthographic works in 'pixel' units
      // instead of 'world' units. Is this what causes the mismatch?
      const fudge = 0.05;
      return new THREE.OrthographicCamera(
        (fudge * -options.width) / 2,
        (fudge * options.width) / 2,
        (fudge * options.height) / 2,
        (fudge * -options.height) / 2,
        -options.perspectiveMax,
        options.perspectiveMax
      );
    }
    default: {
      throw Error(`Camera kind $kind unknown`);
    }
  }
}

function createAxis(
  size: number,
  colorX: string,
  colorY: string,
  colorZ: string
): THREE.AxesHelper {
  const axis = new THREE.AxesHelper(size);

  axis.setColors(
    new THREE.Color(colorX),
    new THREE.Color(colorY),
    new THREE.Color(colorZ)
  );

  return axis;
}

function createAxisLabels(
  units: { x: SIUnit; y: SIUnit; z: SIUnit },
  axisSize: number,
  labelColor: string
) {
  const axisLabels = [];

  const unitx = units.x.toText();
  const unity = units.y.toText();
  const unitz = units.z.toText();

  const offset = axisSize * 1.05;

  axisLabels.push(makeLabelObject(`x[${unitx}]`, offset, 0, 0, labelColor));
  axisLabels.push(makeLabelObject(`z[${unitz}]`, 0, offset, 0, labelColor));
  axisLabels.push(makeLabelObject(`y[${unity}]`, 0, 0, offset, labelColor));

  return axisLabels;
}
