---
title: Namespaces
---

# Namespaces

A program provides two namespaces, `value` and `type`. The value namespace is for defined
values and functions. The type namespace is for index sets, units, unit vectors, and types.

By convention index sets and types start in upper case, and values, functions and units
of measurement in lower case. The generally prevents name clashes, but if an ambiguous name
is used the space's name can be put before the name to solve the ambiguity. For example

    defindex Foo = {a, b, c};

    define Foo = [1,2,3,4,5];

    doc value Foo
        "A value with an ambiguous name";

    doc type Foo
        "A type with an ambiguous name";

## Definitions and Declarations

A Pacioli program contains various kinds of definitions. Each has its own keyword. These definitions can only occur at the top-level of a program.

The following table gives the keyword for the definitions and declarations in the value namespace.

| Definition/Declaration | Keyword                                    |
| ---------------------- | ------------------------------------------ |
| Value or Function      | [define](/manual/definitions/define)       |
| Type Declaration       | [declare](/manual/definitions/declare)     |
| Conversion             | [defconv](/manual/definitions/defconv)     |
| Matrix                 | [defmatrix](/manual/definitions/defmatrix) |
| Record                 | [defrecord](/manual/definitions/defrecord) |
| Documentation          | [doc](/manual/definitions/doc)             |

The keyword `defrecord` is a special case that declares a type and various
functions. It is syntactic sugare for a poor man's record type based on
tuples.

The following table gives the keyword for the definitions and declarations in the type namespace.

| Definition/Declaration | Keyword                                  |
| ---------------------- | ---------------------------------------- |
| Index Set              | [defindex](/manual/definitions/defindex) |
| Unit                   | [defunit](/manual/definitions/defunit)   |
| Unit Alias             | [defalias](/manual/definitions/defalias) |
| Type Definition        | [deftype](/manual/definitions/deftype)   |
