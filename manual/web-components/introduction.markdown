---
title: Web Components
---

# Web Components

Manual for Web components.

Pacioli values can be incorporated into a website with web components.

## Web Components Kinds

The following
components are available to display values:

- pacioli-value
- pacioli-table

Charts are

- pacioli-bar-chart
- pacioli-pie-chart
- pacioli-histogram
- pacioli-line-chart
- pacioli-scatter-plot

For 3D programming the following web components are available.

- pacioli-scene
- pacioli-input
- pacioli-controls

In addition there is a control for parameter inputs, and a control especially for
the pacioli-scene element:

## Preliminaries

    <script type="text/javascript" src="pacioli-0.5.1.bundle.js"></script>
    <script type="text/javascript" src="my_math_lib.js"></script>

## Common Attritubes

- `definition`
- `caption`
- `width`
- `height`
- `margin`
- `decimals`

## The Definition Attribute

The components that display a value fetches indicate what is displayed with the `definition` attribute.
The script points to a compiled Pacioli file and the value to
a value in that file. If the value is a function, then it is called with the components's
parameters.

A component's parameters are specified with the `parameter` attribute.

Say we have a file my_math_lib.pacioli with a definition of function `pythagoras`

    define pythagoras(a, b) =
        sqrt(a^2 + b^2);

After compiling the code to javascript the following HTML fragment

    <pacioli-value definition="my_math_lib:pythagoras">
        <parameter label="parameter a" unit="metre">3</parameter>
        <parameter label="parameter b" unit="metre">4</parameter>
    </pacioli-value>

calls function `pythagoras` with arguments 3m and 4m, and displays the resulting value as
text "5.00m".

## Valid Chart Inputs
