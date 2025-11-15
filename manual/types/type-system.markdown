---
title: Type System
---

# The Type System

A type judgement states that an expression is of some type. It is of
the form

<code>
<a href="#expressions">expression</a> :: <a href="#schema">schema</a>
</code>

Type judgements are used as input in definitions and declarations to
declare a type, and as output by the compiler when the inferred types
are displayed.

The type schema introduces type variables. A type schema is can
introduce ordinary type varibles, index variables, or unit varibles.

<pre><code>
for_type a,b,...: <a href="#typesystem">type</a>   
for_index P,Q,...: <a href="#typesystem">type</a>   
for_unit u,v,...: <a href="#typesystem">type</a>
</code></pre>

Index variables are written in uppercase by convention.

A type is one of the two special types for functions and matrices, or
the generic parametric type. The [function](#functions) and
[matrix](#matrices) type are described in the next section. A
parametric type is of the form

<code>
Foo(<a href="#typesystem">type</a>, <a href="#typesystem">type</a>, ...)
</code>

Built in types List, Tuple and Boole are parametric types.

## Values <a id="datatypes"/></a>

Pacioli supports numbers, booleans, lists, tuples, functions and
incides.

# Design considerations

Pacioli's type system's design is driven by the goal of incorporating dimensioned vector spaces into
a polymorphic type system.

Pacioli's matrix type enables type inference of linear algebra expressions.
It is able to infer dimensioned vector spaces. But this requires an extension of the type inference
engine. Polymorphic type systems cannot handle dimensioned vector spaces. It can only handle
uniform vectors and matrices. Vectors and matrices can however have non-uniform units of measyrement.

### No assumptions about individual units at compile time

### A matrix is a linear transformation

Pacioli uses matrices strictly as linerr transformations. The term matrix is used differently
in different contexts. A more strict definition restricts matrices to linear transformation. But
a matrix can also be viewed as just a 2-dimensional array of numbers. Pacioli uses the first strict
definition. In Pacioli a matrix denotes a linear transformation.

### Levels of runtime support
