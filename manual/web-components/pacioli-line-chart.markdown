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

  <dt>unit</dt>
  <dd>Unit of measurement to display the value in. Must be compatible with the value's unit.</dd>
  
  <dt>gap</dt>
  <dd>Distance between the bars. Dimensionless?</dd>
  
  <dt>xlabel</dt>
  <dd>Label on the x-axis</dd>

  <dt>ylabel</dt>
  <dd>Label on the y-axis</dd>

  <dt>ylower</dt>
  <dd>Start of the y-axis range</dd>

  <dt>yupper</dt>
  <dd>End of the y-axis range</dd>
</dl>
