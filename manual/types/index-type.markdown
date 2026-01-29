---
title: Index Type
---

# Index Type <a id="indices"/>

Matrices in Pacioli are indexed by general index sets, not necessarily
integers. Indices are first class language members. They are
accessible via functions `row_domain` and `column_domain` or via
literal syntax _x_`@`_y_, with _x_ an index set and _y_ an index
key. For example `Foo@key13` or `Bar@item42`.

The type of an element from index set X is `Index(X)`. For example

    Foo@key13 :: Index(Foo)
    Bar@item42 :: Index(Bar)

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
