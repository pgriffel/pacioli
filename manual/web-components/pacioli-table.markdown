---
title: Pacioli Table
---

# Pacioli Table

The table web component displays a table.

## The pacioli-table Component

The `pacioli-table` element adds a Pacioli table to a web page.

A table has one more index columns, and zero or more value columns.
Each row display the values corresponding with the key(s) in the index
column(s).

    <pacioli-table>
      <column header="..." definition="..."></column>
      <column header="..." definition="..."></column>
      ...
    </pacioli-table>

or

    <pacioli-table definition="..."></pacioli-table>

With the second form the columns are defined in Pacioli code. Type `Column` provides
some convience functions to create columns.

## Columns

Each column child element of a table specifies a column in the table.

All columns in the table must have the same keys. The keys can come from an index set,
or can be natural numbers, depending on the whether the column data comes from vectors,
or from lists. When the data comes from vectors, the vectors must have the same index set.
When the data comes from list, they must have the same length.

## Input Data

The value for a column must be one of:

- vector
- list of numbers
- list of (key, value) pairs
- list of ((key, key, ...), value)

A key is a string, a coordinate or a number (or anything really).

When the columns are defined in Pacioli the value must be a tuple of column values.

## Common

<dl>

{% include common-web-component-attributes.md %}

{% include common-number-component-attributes.md %}

</dl>

## Table

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

## Column

<dl>  
  <dt>nozerorows</dt>
  <dd>Don't show rows with all zeros</dd>

  <dt>totals</dt>
  <dd>Add a row with totals</dd>

  <dt>ascii</dt>
  <dd>Display the table in ascii format.</dd>

  <dt>clipboard</dt>
  <dd>Display the table in clipboard format.</dd>
</dl>
