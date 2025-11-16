---
title: Scalar Units
---

# Scalar Units

This section is about scalar units. Unit vectors are discussed as part of the matrix type.

---

## Base units

A unit of measurement is build from base units by multiplication and division. A base unit
has a name and a symbol. It is defined as follows

    defunit name symbol_string;

For example

    defunit metre "m";

## Derived units

Derived units are build from base units.

    defunit name symbol_string = unit_expression;

For example

    defunit mile "mi" = 1609.344 * metre;

    defunit foot "ft" = 0.3048 * metre;

    defunit newton "N" = kilo:gram*metre/second^2;

It is good practice to define units for dimensionless quantities. For example
the number of cars could be given unit `car`:

    defunit car "car" = 1;

Note that this differs from a base unit. A base unit cannot be converted, while
this unit can.

## Conversions

A conversion between units can be defined with keyword `defconv`. The following

    defconv mile2foot :: foot/mile;

make `mile2foot` the conversion factor 5280.00ft/mi.

More on conversions in the matrix type sections.
