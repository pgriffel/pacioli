---
title: Pacioli Value
---

# Pacioli Value

The `pacioli-value` component displays any Pacioli value.

## pacioli-value

The pacioli-value element adds a Pacioli value to a web page.

    <pacioli-value definition="..."></pacioli-value>

How it is displayed
depends on the value.

- A scalar is displayed inline.
- A (non-scalar) matrix is displayed as a table.
- A tuple is displayed as an unordered list.
- A list is displayed as an ordered list.
- A string is displayed as is.
- A boolean is displayed as "true" or "false"

## Common Attributes

<dl>
  <dt>definition</dt>
  <dd>Definition of the value. A string of the form "file:name". See the introduction for details.</dd>

  <dt>decimals</dt>
  <dd>Number of decimals for the numbers in the value.</dd>
</dl>

## Pacioli Value Attributes

No specific attributes.
