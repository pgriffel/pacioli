---
title: Conditional
---

# Conditional (if then else)

A conditional expression is of the form

    if expression then
        expression
    else if expression then
        expression
    ...
    else
        expression
    end

An if then else expression returns the value from one of its branches depending on
the test expression. For example

    define max(a, b) =
        if a > b then a else b end;

An if can be written everywhere an expression is expected. For example

    let
        multiplier = if turbo = "yes" then 1.5 else 1 end
    in
        multiplier * base_velocity
    end
