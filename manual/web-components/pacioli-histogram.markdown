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
  <dt>caption</dt>
  <dd>A title for the chart</dd>

  <dt>unit</dt>
  <dd>Unit of measurement to display the value in. Must be compatible with the value's unit.</dd>

  <dt>heuristic</dt>
  <dd>Method to determine the number of bins. One of 'd3', 'sturges', 'freedman-diaconis', or 'seaborn'.</dd>
  
  <dt>xlabel</dt>
  <dd>Label on the x-axis</dd>

  <dt>ylabel</dt>
  <dd>Label on the y-axis</dd>

  <dt>lower</dt>
  <dd>Start of the x-axis range</dd>

  <dt>upper</dt>
  <dd>End of the x-axis range</dd>

  <dt>bins</dt>
  <dd>Number of bins. </dd>

   <dt>ylower</dt>
  <dd>Start of the y-axis range</dd>

  <dt>yupper</dt>
  <dd>End of the y-axis range</dd>

  <dt>xticks</dt>
  <dd>Ticks on the x-axis</dd>

  <dt>yticks</dt>
  <dd>Ticks on the y-axis</dd>

  <dt>gap</dt>
  <dd>Gap between the bars</dd>
</dl>
