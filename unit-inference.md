---
title: Unit Inference
layout: default
---

Units of Measurement
====================

An introduction to unit inference in Pacioli

--------------------------------------------------------------------------------

### Unit Notation

Units of measurement are distinguished from other code by surrounding
them with pipes. For example `|metre|` or `|gram|`. Any unit
expression can occur between the pipes. This syntax embeds type
expressions into the language to give access to the units.

Create a file `intro.pacioli` with the following code:

    module "Intro";

    include "SI";

    10;
    11*|gram|;
    12*|metre|;

This creates a module `Intro` and includes the pre-defined units from
the `SI` module.

Run the file as follows:

    pacioli run intro.pacioli

This should produce output like

    Running file 'intro.pacioli'
    10.000000
    11.000000 g
    12.000000 m
    Ready in 59 ms

The three expressions are evaluated and the resulting values with the
proper units are printed.

To infer the types without running the file do:

    pacioli types intro.pacioli

This should produce output like

    Displaying types for file 'intro.pacioli'
    toplevel 1 :: 1
    toplevel 2 :: gram
    toplevel 3 :: metre
    
For each top-level expression the inferred type is displayed.


### Operations on Units

Units can always be multiplied

    |gram| * |gram|;
    |gram| * |metre| * |second| * |ampere| * |kelvin| * |mole| * |candela|;

This gives types:

    toplevel 1 :: gram^2
    toplevel 2 :: ampere*candela*gram*kelvin*metre*mole*second

The following code gives exactly the same type:

    |gram^2|;
    |ampere*candela*gram*kelvin*metre*mole*second|;

It shows how the pipes embed the type notation in the language and how
multiplication at the type level coincides with multiplication in the
language.

Units can not always be summed. 

    |gram| + |gram|;
    |gram| + |metre|;

The compiler output should be something like:

    toplevel 1 :: gram
    toplevel 2 :: 

    Pacioli error:
    
    During inference at line 6
    
    |gram| + |metre|;
    ^^^^^^^^^^^^^^^^
    
    [...]
    
    Cannot unify units metre and gram

For the first top-level expression the correct type `gram` is inferred
but the second leads to an error. For brevity some of the output has
been left out.

The type is semantic, the order of multiplication is irrelevant

    |gram|*|metre| + |gram * metre|;
    |gram|*|metre| + |metre|*|gram|;

The unit of both expressions is the same:

    Running file 'intro.pacioli'
    2.000000 g*m
    2.000000 g*m
    Ready in 72 ms


### Unit Inference

The type system infers the most general type. Define a function as
follows

    define f(x) = x*|metre| + |gram|*|metre|;

The type system infers that the unit of the function argument must be
a `gram`.

    f :: (gram) -> gram*metre

In this case the unit is uniquely determined, but that isn't the case
in function `g`:

    define g(x,y) = x*y + |gram|*|metre|;

Now the type system infers the following type:

    g :: for_unit a: (a, gram*metre/a) -> gram*metre

The type denotes an infinite class of functions. The first argument
can be any unit, as long as the second argument cancels it. Examples
of valid function types are:

    (gram, metre) -> gram*metre
    (metre, gram) -> gram*metre
    (metre^2, gram/metre) -> gram*metre
    (metre*second, gram/second) -> gram*metre
    etc.

The first of the following application of function `g` is okay but the
second one gives an error

    g(|metre|*|second|, |gram|/|second|);
    g(|metre|*|second|, |gram|*|second|);

The compiler output is:

    toplevel 1 :: gram*metre
    toplevel 2 :: 
    
    Pacioli error:
    
    During inference at line 8
    
    g(|metre|*|second|, |gram|*|second|);
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    the infered type must match known types:

    (metre*second, gram*second) -> a = (a, gram*metre/a) -> gram*metre


    Function domain's types must match:

    Tuple(metre*second, gram*second) = Tuple(a, gram*metre/a)


    Tuple arugment 2 must match:

    gram*second = gram/second

    
    Cannot unify units gram*second and gram/second

