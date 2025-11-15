---
title: Pacioli Manual
layout: default
---

# Pacioli Manual

Manual for Pacioli 0.4

---

## Values <a id="datatypes"/></a>

Pacioli supports numbers, booleans, lists, tuples, functions and
incides.

### Indices <a id="indices"/></a>

DUBBEL!! zie matrix

Matrices in Pacioli are indexed by general index sets, not necessarily
integers. Indices are first class language members. They are
accessible via functions `row_domain` and `column_domain` or via
literal syntax _x_`@`_y_, with _x_ an index set and _y_ an index
key. For example `Foo@key13` or `Bar@item42`.

A consequence of the matricization of tensors is that a matrix can
have any number of row indices and any number of column indices. A
row key or column key is a combination of items from possibly multiple
index sets. Compound literal indices are constructed with the `%`
symbol. For example `Foo@key13%Bar@item42`. The index type lists all
index sets. In this case:

    Index(Foo, Bar)

Special key `_` is the only element of the index of zero index sets:

    _ :: Index()

It is used to index the empty row and column domains of scalars and
vectors.

### Booleans <a id="booleans"/></a>

A Boolean is one of the logical values `true` or `false`.

The type of a boolean is `Boole()`.

## Expressions <a id="expressions"/></a>

### Constants <a id="constants"/></a>

Literal constants are numbers, or the Boolean values `true` or `false`.

### Variables <a id="variables"/></a>

A variable is an identifier built from alphanumeric characters and
undercores. A variable can be local or it can refer to a defined value
or function.

### Unit Expressions <a id="unitexpressions"/></a>

A matrix type surrounded by pipes is a unit expression. For example
`|metre|` or `|Foo!unit per Foo!|`.

### Operators <a id="operators"/></a>

Operators grouped by precedence

    -               negative
    ^T              transpose
    ^R              reciprocal
    ^D              dim_inv

    '^'             mexpt
    ^               expt

    per             dim_div

    '.*'            scale
    '*.'            rscale
    '/.'            scale_down
    './'            lscale_down
    *               multiply
    /               divide
    \               left_divide
    '*'             mmult
    '/'             right_division
    '\'             left_division

    +               sum
    -               minus

    <               less
    <=              less_eq
    >               greater
    >=              greater_eq
    =               equal
    !=              not_equal

    and             and
    or              or
    <=>             equal
    ==>             implies
    <==             follows_from

### Function Application <a id="functionapplication"/></a>

A function application is of the form

<code>
foo(<a href="#expressions">expression</a>, <a href="#expressions">expression</a>, ... )
</code>

### Lambda <a id="lambdas"/></a>

An anonymous function is of the form

<code>
lambda (x, y, ... ) <a href="#expressions">expression</a> end
</code>
