---
title: Record Definition
---

# Record Definition

A poor man's implementation of records based on tuples. A stub for a proper record type.

## Syntax

A record definition has the following form

    defrecord quantifiers typeapp as basename where
        field1: type,
        field2: type,
        ...
    end;

where typeapp is a type application

For example

    defrecord for_unit a: ComplexNumber(a) as complex where
        real_part: a,
        imaginary_part: a;

    define complex_sum(x, y) =
        make_complex(
            complex_real_part(x) + complex_real_part(y),
            complex_imaginary_part(x) + complex_imaginary_part(y));
