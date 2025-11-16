---
title: Unit Alias Definition
---

# Unit Alias Definition

A unit alias can be defined with keyword `defalias`

    defalias name = unit_expression;

Using an alias can make it easier to change the units later on. For example

    defalias dist_unit = inch;

allows one to change to e.g. metre easily. Beware that this makes literal numbers of that unit invalid!
