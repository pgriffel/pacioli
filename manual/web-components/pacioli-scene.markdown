---
title: 3D Scene
---

# 3D Scene

The scene web component displays a 3D scene.

## The pacioli-scene Component

The `pacioli-scene` element adds a Pacioli 3D scene to a web page.

    <pacioli-scene definition="..."></pacioli-scene>

## Common

<dl>

{% include common-web-component-attributes.md %}

</dl>

## 3D Scene

<dl> 
  <dt>caption</dt>
  <dd>A title for the scene</dd>

  <dt>unit</dt>
  <dd>Unit of measurement for the three dimensions.</dd>

  <dt>unitx</dt>
  <dd>Unit of measurement in the x-direction. Overrides unit.</dd>

  <dt>unity</dt>
  <dd>Unit of measurement in the y-direction. Overrides unit.</dd>

  <dt>unitz</dt>
  <dd>Unit of measurement in the z-direction. Overrides unit.</dd>

  <dt>background</dt>
  <dd>Background color</dd>

  <dt>axisColorsX</dt>
  <dd>Color of the x-axis</dd>

  <dt>axisColorsY</dt>
  <dd>Color of the y-axis</dd>

  <dt>axisColorsZ</dt>
  <dd>Color of the z-axis</dd>

  <dt>gridColor</dt>
  <dd>Color of the grid. See grid.</dd>

  <dt>ambientColor</dt>
  <dd>Color of the ambient light</dd>

  <dt>labelColor</dt>
  <dd></dd>

  <dt>axis</dt>
  <dd>Add axis to the scene</dd>

  <dt>grid</dt>
  <dd>Add a grid in the x-y plane to the scene</dd>

  <dt>orthographic</dt>
  <dd>Use orthographic projection</dd>

  <dt>hideLabels</dt>
  <dd>Don't show labels. This includes the axis labels.</dd>

  <dt>autoRotation</dt>
  <dd>Turn on rotaton of the scene.</dd>

  <dt>axisSize</dt>
  <dd>Length of the axis</dd>

  <dt>ambientIntensity</dt>
  <dd>Intensity of the ambient light</dd>

  <dt>gridSize</dt>
  <dd>Size of the grid</dd>

  <dt>gridDivisions</dt>
  <dd>Number of gridlines</dd>

  <dt>cameraNear</dt>
  <dd>Maximum zoom-in level</dd>

  <dt>cameraFar</dt>
  <dd>Maximum zoom-out level</dd>

  <dt>cameraX</dt>
  <dd>x-coordinate of the camera position</dd>

  <dt>cameraY</dt>
  <dd>y-coordinate of the camera position</dd>

  <dt>cameraZ</dt>
  <dd>z-coordinate of the camera position</dd>

  <dt>secondsPerRotation</dt>
  <dd>Rotation speed. See autoRotation.</dd>

</dl>
