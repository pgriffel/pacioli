---
title: Line Chart
---

# Line Chart

The line chart web component plots a value as a line.

## The pacioli-line-chart Component

The `pacioli-line-chart` element adds a Pacioli line chart to a web page.

    <pacioli-line-chart definition="..."></pacioli-line-chart>

## Common

<dl>

{% include common-web-component-attributes.md %}

{% include common-number-component-attributes.md %}

</dl>

## Line Chart

<dl>
  <dt>caption</dt>
  <dd>A title for the chart</dd>

  <dt>unit</dt>
  <dd>Unit of measurement to display the value in. Must be compatible with the value's unit.</dd>

  <dt>xunit</dt>
  <dd>Unit of measurement in the x-direction. Overrides unit.</dd>

  <dt>yunit</dt>
  <dd>Unit of measurement in the y-direction. Overrides unit.</dd>

  <dt>label</dt>
  <dd>Label on the y-axis</dd>

  <dt>xlabel</dt>
  <dd>Label on the x-axis</dd>

  <dt>ylower</dt>
  <dd>Start of the y-axis range</dd>

  <dt>yupper</dt>
  <dd>End of the y-axis range</dd>

  <dt>rotate</dt>
  <dd>Rotate the labels on the x-axis</dd>

  <dt>smooth</dt>
  <dd>Smoothen the line</dd>

  <dt>norm</dt>
  <dd>If present a horizontal line at the given line is drawn</dd>

  <dt>xticks</dt>
  <dd>Ticks on the x-axis</dd>

  <dt>yticks</dt>
  <dd>Ticks on the y-axis</dd>
</dl>
