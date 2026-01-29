---
title: Matrix Definition
---

# Matrix Definition

A matrix definition is syntactic sugar to define matrix literals at the
top level.

The syntax of a matrix definition is

    defmatrix name :: type = {
        name, name -> number,
        ...
    };

This syntactic sugar for a `make_matrix` call. For example,

    defmatrix my_matrix :: X!u per Y!v = {
        foo, bar -> 123,
        foo, baz -> 456,
        ...
    };

combines the following declaration and definition

    declare my_matrix :: X!u per Y!v;

    define my_matrix =
        make_matrix([
            tuple(X@foo, Y@bar, 123),
            tuple(X@foo, Y@baz, 456)
        ]) * |X!u per Y!v|;
