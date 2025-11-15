---
title: Type Definitions
layout: default
---

# Type Definitions

A type definition defines a new generic type. The syntax is

    deftype quantifiers name(parameters) = type;

The quantifiers are the same as for a declaration. The parameters are type
parameters introduced in the quantifiers.

For example

    deftype for_type s, t: Pair(s, t) = Tuple(s, t);

defines type Pair as a tuple of two elements, each with its own type.

Another example is the definition of a uniform vector. Given type definition

    deftype for_unit a, for_index X: UniformVector(a, X!) = a*X!;

the following fails

    declare foo :: UniformVector(metre, Geom3!);

    define foo =
        vector3d(1, 2, 3);

Function `vector3d` creates vectors with uniform unit of measurement, but no
units are provided. The actual derived type is `UniformVector(1, Geom3!)`.
A proper definition is

    define foo =
        vector3d(1*|metre|, 2*|metre|, 3*|metre|);
