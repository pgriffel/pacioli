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

{% include common-web-component-attributes.md %}

{% include common-number-component-attributes.md %}

</dl>

## Pacioli Value Attributes

<dt>ascii</dt>
<dd>Display tables in ascii format.</dd>

<dt>clipboard</dt>
<dd>Display tables in clipboard format.</dd>
