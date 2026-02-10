---
title: Scatter Plot
---

# Scatter Plot

The Scatter Plot web component displays a scatter olot for a collection of numbers.

## The pacioli-scatter-plot Component

The `pacioli-scatter-plot` element adds a Pacioli scatter plot to a web page.

    <pacioli-scatter-plot definition="..."></pacioli-scatter-plot>

## Common

<dl>

{% include common-web-component-attributes.md %}

{% include common-number-component-attributes.md %}

</dl>

## Scatter Plot

<dl>
  <dt>caption</dt>
  <dd>A title for the chart</dd>
  
  <dt>unit</dt>
  <dd>Unit of measurement to display the value in. Must be compatible with the value's unit.</dd>
  
  <dt>xunit</dt>
  <dd>Unit of measurement in the x-direction. Overrides unit.</dd>

  <dt>yunit</dt>
  <dd>Unit of measurement in the y-direction. Overrides unit.</dd>

  <dt>trendline</dt>
  <dd>Adds a tendline to the chart</dd>

  <dt>xlower</dt>
  <dd>Start of the x-axis range</dd>

  <dt>xupper</dt>
  <dd>End of the x-axis range</dd>

  <dt>ylower</dt>
  <dd>Start of the y-axis range</dd>

  <dt>yupper</dt>
  <dd>End of the y-axis range</dd>

  <dt>xticks</dt>
  <dd>Ticks on the x-axis</dd>

  <dt>yticks</dt>
  <dd>Ticks on the y-axis</dd>

  <dt>radius</dt>
  <dd>Radius of the dot</dd>
</dl>
