---
title: Base Unit Definition
---

# Base Unit Definition

A unit definition starts with keyword `defunit`. It can define a base
unit, a derived unit, or a unit vector.

A base unit definition requires a name and a string to be used in
output.

    defunit metre "m";

A derived unit requires an additonal unit expression. This is an
expression with operators `*`, `/` and `^` on base units or other
derived units.

    defunit knot "kn" = 0.51444444*metre/second;

A unit vector is defined for an index set by specifying a unit for
each index key. An exclamation mark seperates the index set name from
the unit vector name.

    defunit Foo!unit = {foo: metre, bar: knot, ...};

Unit vectors are used in matrix types.
