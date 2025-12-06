---
title: Function Type
---

# Function Type

Functions are first class values. Functions are globally
defined in a module or anonymous.

The type of a function is

    (type,...,type) -> type

This is shorthand for `Tuple(type,...,type) -> type`. A function expects a
tuple of arugments, and maps it to a value.
