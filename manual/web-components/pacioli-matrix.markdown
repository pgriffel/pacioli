---
title: Pacioli Matrix
---

# Pacioli Matrix

The matrix web component displays a matrix.

## The pacioli-matrix Component

The `pacioli-matrix` element adds a Pacioli matrix to a web page.
The appearance can be changed with various options.

    <pacioli-matrix definition="..."></pacioli-matrix>

The definition refers to a Pacioli matrix.

## Common

<dl>

{% include common-web-component-attributes.md %}

{% include common-number-component-attributes.md %}

</dl>

## Matrix

<dl>
  <dt>headers</dt>
  <dd>Add rows and columns with headers</dd>
  
  <dt>headerunits</dt>
  <dd>Show units in the headers</dd>

  <dt>nounits</dt>
  <dd>Dont's display units of measurement</dd>

  <dt>evenwidth</dt>
  <dd>Give all columns the same width</dd>

  <dt>order</dt>
  <dd>Tensor order. For example order="2,0"</dd>
    
  <dt>ascii</dt>
  <dd>Display the table in ascii format.</dd>

  <dt>clipboard</dt>
  <dd>Display the table in clipboard format.</dd>
</dl>
