---
title: Histogram
---

# Histogram

The histogram web component displays a frequency count for a collection of numbers.

## The pacioli-histogram Component

The `pacioli-histogram` element adds a Pacioli histogram to a web page.

    <pacioli-histogram definition="..."></pacioli-histogram>

## Common

<dl>

{% include common-web-component-attributes.md %}

{% include common-number-component-attributes.md %}

</dl>

## Histogram

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
