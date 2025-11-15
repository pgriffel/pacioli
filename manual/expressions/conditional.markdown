---
title: Conditional
layout: default
---

# Conditional (if then else)

A conditional expression is of the form

<pre><code>if <a href="#expressions">expression</a> then
  <a href="#expressions">expression</a>
else if <a href="#expressions">expression</a> then
  <a href="#expressions">expression</a>
...
else
  <a href="#expressions">expression</a>
end
</code></pre>

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
