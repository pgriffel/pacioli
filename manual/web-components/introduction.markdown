---
title: Web Components
---

# Web Components

A web-component display a Pacioli value in a webpage. The display can be text, a
chart or a 3D environment.

## Web Components Kinds

The following components are available to display values in textual form.

- pacioli-value
- pacioli-table

The following charts are supported.

- pacioli-bar-chart
- pacioli-pie-chart
- pacioli-histogram
- pacioli-line-chart
- pacioli-scatter-plot

For 3D programming the following web components are available.

- pacioli-scene
- pacioli-input
- pacioli-controls

The `pacioli-input` and `pacioli-controls` do not display a value, but support
the `pacioi-scene`.

## Common Attritubes

The following attributes are available for all web-components that display a value.
The exact meaning depends on the component.

- `definition`
- `caption`
- `width`
- `height`
- `margin`
- `decimals`

Besides these common attributes, each component has its own specific
attributes.

## The Definition Attribute

The `definition` attribute specifies the value that the web-component displays.

The attribute must be of the form "file:name". The file parts points to a compiled
Pacioli file (without the extension) and the name to a definition in that file.

The accepted value depends on the component. Components are permissive in the
values they accept. An invalid value is reported as error at runtime.

If the value is a function, then it is called with the components's
parameters.

A component's parameters are specified with `parameter` elements. This element
accepts attributes `label` and `unit`. The label is used by the `pacioli-input`
element. The unit is automatically converted to the values unit.

## An Example

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
