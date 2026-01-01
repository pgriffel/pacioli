---
title: Pacioli Value
---

# Pacioli Value

Manual for Web components.

## pacioli-value

The `pacioli-value` element adds any Pacioli value to a web page.

    <pacioli-value definition="..."></pacioli-value>

The `pacioli-value` component displays any Pacioli value. How it is displayed
depends on the value.

A scalar is displayed inline as was shown in the example in the previous section about
parameters.

A matrix is displayed as a table.

A tuple is displayed as an unordered list.

A list is displayed as an ordered list.

A string is displayed as is.

A boolean is displayed as "true" or "false"

## Common

<dl>
  <dt>definition</dt>
  <dd>Name of the value or function to display</dd>

  <dt>unit</dt>
  <dd>Unit of measurement to display the value in. Must be compatible with the value's unit.</dd>
</dl>

## Value

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
