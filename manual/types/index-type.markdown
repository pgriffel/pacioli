---
title: Index Type
---

# Index Type <a id="indices"/>

Matrices in Pacioli are indexed by general index sets, not necessarily
integers. Indices are first class language members. They are
accessible via functions `row_domain` and `column_domain` or via
literal syntax _x_`@`_y_, with _x_ an index set and _y_ an index
key. For example `Foo@key13` or `Bar@item42`.

A consequence of the matricization of tensors is that a matrix can
have any number of row indices and any number of column indices. A
row key or column key is a combination of items from possibly multiple
index sets. Compound literal indices are constructed with the `%`
symbol. For example `Foo@key13%Bar@item42`. The index type lists all
index sets. In this case:

    Index(Foo, Bar)

Special key `_` is the only element of the index of zero index sets:

    _ :: Index()

It is used to index the empty row and column domains of scalars and
vectors.

## The Matrix Type

Any numerical value in Pacioli is a matrix. A scalar is a 1x1 matrix
and a vector a nx1 or 1xn matrix. All these matrix values are typed by
the matrix type.

The most general matrix type is `a*P!u per Q!v`. The combination of a
scalar unit `a`, the row units `P!u`, and the column units `Q!v`
matches any matrix type. The next table lists some common specific
ones.

<table>
  <tr>
    <th>Type</th>
    <th>Shorthand</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>1 per 1</td>
    <td>1</td>
    <td>dimensionless scalar</td>
  </tr>
  <tr>
    <td>a per 1</td>  
    <td>a</td>
    <td>dimensioned scalar</td>
  </tr>
  <tr>
    <td>P! per 1</td>
    <td>P!</td>
    <td>dimensionless column vector</td>
  </tr>
  <tr>
    <td>P!u per 1</td>  
    <td>P!u</td>
    <td>dimensioned column vector</td>
  </tr>
  <tr>
    <td>a*P! per 1</td>
    <td>a*P!</td>
    <td>homogeneous dimensioned column vector</td>
  </tr>
  <tr>
    <td>1 per Q!v</td>
    <td></td>
    <td>dimensioned row vector</td>
  </tr>
  <tr>
    <td>P! per Q!</td>
    <td></td>
    <td>dimensionless rectangular matrix</td>
  </tr>
  <tr>
    <td>P!u per P!v</td>
    <td></td>
    <td>square matrix</td>
  </tr>
  <tr>
    <td>P!u per P!u</td>
    <td></td>
    <td>even more square matrix</td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td>...</td>
  </tr>
</table>
