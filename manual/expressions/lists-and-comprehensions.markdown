---
title: Lists and Conmprehensions
---

# Lists and Comprehensions

## Lists

A list is a collection of values of the same type. A list literal is written as `[...]`

The type of a list is `List(type)`.

## Comprehensions

A list comprehension is of the form

    [ expression | clause, clause, ... ]

where each clause is

- a generator `var <- expression or (var, ..., var) <- expression`

- a filter expression

- or an assignment `var := expression`

Each var can also be a list of variables surrounded by parenthesis to destructure a tuple.

Examples

    []                                      # The empty list
    ["foo"]                                 # A singleton list containing string "foo"
    [1*|metre|, 2*|metre|, 3*|metre|]       # A list with three numbers of unit metre
    [[1,2], [3,4]]                          # A list of lists of dimensionless numbers

The types of above examples are

    for_type t: List(t)
    List(String)
    List(metre)
    List(List(1))
