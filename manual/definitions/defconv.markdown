---
title: Conversion Definition
---

# Conversion Definition

A conversion definition defines a diagonal matrix with proper conversion factors
to convert from one dimensioned vector space to another.

The syntax of a conversion is the same as a type declaration

    defconv name :: matrix_type;

A conversion matrix of the declared type is defined. The type's row and column dimension
must be the same.

Note that this also covers scalars. For example

    defconv mile_to_kilometer :: kilo:metre / mile;

defines mile_to_kilometer as the conversion factor from mile to kilometre. Expression

    50*|mile| * mile_to_kilometer;

gives 80.... km/hr.
