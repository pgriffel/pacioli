---
title: Type Variables
---

# Type Variables

A type judgement states that an expression is of some type. It is of
the form

    expression :: schema

Type judgements are used as input in definitions and declarations to
declare a type, and as output by the compiler when the inferred types
are displayed.

The type schema introduces type variables. A type schema is can
introduce ordinary type varibles, index variables, or unit varibles.

    for_type a,b,...: type
    for_index P,Q,...: type
    for_unit u,v,...: type

Index variables are written in uppercase by convention.
