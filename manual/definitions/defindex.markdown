---
title: Index Set Definition
---

# Index Set Definition

An index set definition starts with keyword `defindex` followed by a
name, the equal sign, and a set of names.

    defindex Foo = {foo, bar, baz};

The defined names are used in the row and column dimensions of a matrix types.

For example

    declare foo :: Foo! per Foo!;

declares foo as a square three by three matrix with the elements indexed
by keys foo, bar or baz.
