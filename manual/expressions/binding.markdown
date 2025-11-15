---
title: Let Binding
layout: default
---

# Let Binding

A let binding is of the form

    let
        var = expression
    in
        expression
    end

or

    let
        (var,...,var) = expression
    in
        expression
    end

The first case evaluates the expression with the variable bound. The second case
destructures a tuple. The expression on the right hand side of the equation must
evaluate to a tuple, and the variables get bound to the values in the tuple.

A let binding can have multiple bindings.

    let
        var1 = expression1,
        var2 = expression2
    in
        expression
    end

is shorthand for

    let
        var1 = expression1
    in
        let
          var2 = expression2
        in
            expression
        end
    end
