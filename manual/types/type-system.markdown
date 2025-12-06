---
title: Type System
---

# The Type System

Syntactically, there are three categories of types

- Matrix types a \* P!u per Q!v
- Function types Type -> Type
- Type applications C(Type, ..., Type)

where `C` is a type constructor.

The Tuple and Index type constructors are special. They do not have a fixed number of arguments.

In function types the Tuple can be omitted. Function type (t1, ..., tn) -> t is shorthand for Tuple(t1, ..., tn) -> t.

For type constructors without arugments the parenthesis can be omitted. C() is simply written as C. For example `Boole()` and `Boole` are synonymous.

## Type judgements

A type judgement states that an expression is of some type. It is of
the form

    expression :: schema

The schema is a quantified type expression.

Type judgements are used as input in definitions and declarations to
declare a type, and as output by the compiler when the inferred types
are displayed.
