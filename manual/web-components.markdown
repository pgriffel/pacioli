---
title: Web Components
---

# Web Components

Manual for Web components.

Pacioli values can be incorporated into a website with web components. The following
components are available to display values:

- pacioli-value
- pacioli-table
- pacioli-bar-chart
- pacioli-pie-chart
- pacioli-histogram
- pacioli-line-chart
- pacioli-scatter-plot
- pacioli-scene

In addition there is a control for parameter inputs, and a control especially for
the pacioli-scene element:

- pacioli-input
- pacioli-controls

## Preliminaries

    <script type="text/javascript" src="pacioli-0.5.0.bundle.js"></script>
    <script type="text/javascript" src="my_math_lib.js"></script>

## Obtaining values

The components that display a value fetches indicate what is displayed with a `script` and
a `value` attribute. The script points to a compiled Pacioli file and the value to
a value in that file. If the value is a function, then it is called with the components's
parameters.

A component's parameters are specified with the `parameter` attribute.

Say we have a file my_math_lib.pacioli with a definition of function `pythagoras`

    define pythagoras(a, b) =
        sqrt(a^2 + b^2);

After compiling the code to javascript the following HTML fragment

    <pacioli-value script="my_math_lib" value="pythagoras">
        <parameter label="parameter a" unit="metre">3</parameter>
        <parameter label="parameter b" unit="metre">4</parameter>
    </pacioli-value>

calls function `pythagoras` with arguments 3m and 4m, and displays the resulting value as
text "5.00m".

## pacioli-value

The `pacioli-value` component displays any Pacioli value. How it is displayed
depends on the value.

A scalar is displayed inline as was shown in the example in the previous section about
parameters.

A matrix is displayed as a table.

A tuple is displayed as an unordered list.

A list is displayed as an ordered list.

A string is displayed as is.

A boolean is displayed as "true" or "false"

## pacioli-table

Displays multiple vectors in a table. Each column is a vector.

## pacioli-bar-chart

Displays a vector or a list of key value pairs as a bar chart.

    <pacioli-bar-chart>
    </pacioli-bar-chart>

## pacioli-pie-chart

Displays a vector or a list of key value pairs as a pie chart.

## pacioli-histogram

Displays a vector or a list of key value pairs as a histogram.

## pacioli-line-chart

Displays a vector or a list of key value pairs as a line chart.

## pacioli-scatter-plot

Displays two vectors or two list of key value pairs as a bar scatter plot.

## pacioli-scene

Adds a 3D scene. See the [page on 3D graphics](graphics) for details.
