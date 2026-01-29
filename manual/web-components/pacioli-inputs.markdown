---
title: Pacioli Inputs
---

# Pacioli Inputs

The `pacioli-inputs` component sets parameter values.

## pacioli-value

The `pacioli-inputs` component adds a panel to edit web-component
parameters.

    <pacioli-inputs for="..."></pacioli-inputs>

The value of the `for` atrribute is the id of the element to control.

The element is any element that can have `parameter` children. These
are all Pacioli web-components and the `column` child element of the
`pacioli-table` component.

Use a comma-separated list of element ids to combine multiple panels
into one.

## Common Attributes

No common attributes.

## Pacioli Inputs Attributes

<dl>
  <dt>for</dt>
  <dd>Element id or comma-separated list of element ids</dd>
</dl>
