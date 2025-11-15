---
title: Declaration
layout: default
---

# Declaration

A definition can be accompanied by a type declaration. A declaration
starts with keyword `declare` followed by a comma-separated list of
quantifiers, a name, a pair of colons, and a type.

    declare quantifiers name :: type;

A quantifier is one of

    for_unit ... :
    for_index ... :
    for_type ... :

- `for_unit ... :`,
- `for_index ... :`, or
- `for_type ... :`.

Declarations are optional, except for recursive functions.

If a type is declared then it is checked against the definition's infered
type. A declaration may restrict the type, but not generalize or
contradict it.

Example

    declare for_unit a, for_index X:
        foo :: (a, List(X!)) -> List(a*X!);

declares that `foo` is a list of vectors with index set `X` and uniform
units of measuremtn `a`.

Multiple value of the same type can be combined into one declartion. For example

    declare width, height :: metre;

declare that globals `width` and `height` have unit metre.
