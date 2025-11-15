---
title: Lists and Conmprehensions
layout: default
---

# Lists and Comprehensions

## Lists

A list is a collection of values of the same type. A list literal is written as `[...]`

    []                                      # The empty list
    ["foo"]                                 # A singleton list containing string "foo"
    [1*|metre|, 2*|metre|, 3*|metre|]       # A list with three numbers of unit metre
    [[1,2], [3,4]]                          # A list of lists of dimensionless numbers

The type of a list is `List(`[type](types)`)`. The types of above examples are

    for_type t: List(t)
    List(String)
    List(metre)
    List(List(1))

### Comprehensions <a id="comprehensions"/></a>

A list comprehension is of the form

<code>
[ <a href="#expressions">expression</a> | clause, clause, ... ]
</code>
 
where each clause is

- a generator
  <code>
  var <- <a href="#expressions">expression</a>
  </code>
  or `(var, ..., var) <- `[expression](expression)

- a filter
  <code>
  <a href="#expressions">expression</a>
  </code>

- or an assignment
  <code>
  var := <a href="#expressions">expression</a>
  </code>

Each var can also be a list of variables surrounded by parenthesis to
destructure a tuple.
