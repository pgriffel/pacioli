---
title: Bar Chart
---

# Bar Chart

The bar chart web component displays a vector or a list of key value pairs as a bar chart.

## The pacioli-bar-chart Component

The `pacioli-bar-chart` element adds a Pacioli bar chart to a web page.

    <pacioli-bar-chart definition="..."></pacioli-bar-chart>

The value can be

- a vector
- a list of (string, number) pairs

## Common Attritubes

<dl>
  <dt>definition</dt>
  <dd>Name of the value or function to display

  </dd>

  <dt>unit</dt>
  <dd>Unit of measurement to display the value in. Must be compatible with the value's unit.</dd>
</dl>

## Bar Chart Attritubes

<dl>
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
