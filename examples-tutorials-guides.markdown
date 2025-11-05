---
title: Examples, Tutorials and Guides
layout: default
---

# Examples, Tutorials and Guides

## Introduction

The basics of dimensioned matrices can be found in [Units of Measurement in Matrices][uom-in-matrices].
It also contains some litereature references. An explanation of dimensioned matrices in Pacioli is in
the [introduction to Pacioli's Matrix Type][matrix-type].

## Examples

Various examples that demonstrate different use cases. See the samples directory in the [GitHub project][home]
for more examples.

- [Bill of Material][bom]\
  Computations with a bill of material. The matrices are visualized with dot/graphviz.

- [Petri Nets][petri]\
  Dimensioned Petri nets. The nets are visualized with dot/graphviz.

- [Parametric surfaces][surfaces]\
  Examples of parametric surfaces, like ellipsoids and paraboloids. Demonstrates the integration
  with three.js

- [Shells][shells] \
  The shells example illustrates many aspectes of the
  language. It demonstrates vectors and matrices, units of measurement,
  deployment via the web, charts and other features. Another example of integration with three.js.

## Tutorials

- [Unit inference][inference] \
  A short introduction to units of measurements in Pacioli

- [Creating matrices](/tutorials/matrix-basics) \
  The basics of matrices in Pacioli.

- [Working with matrices I - Kirchhof](/tutorials/kirchhof) \
  This case on the equilibrium in an eletrical network explains matrices with uniform units of measurement

- [Working with matrices II - Curiosity](/tutorials/matrices) \
  Gives some details on Pacioli's type system. It is about the power consumption
  of Nasa's curiosity rover and involves vectors with non-uniform units of measurement.

- [Working with 3D graphics](/tutorials/space)\
  Creating 3D scenes and animations.

- [Working with charts and tables](/tutorials/charts)\
  Explains how to add charts and tables to a web page.

## Guides

- [Javascript API][pacioli-js]\
  Working with lower level apis for the web and javascript

- [Web Components][web-components]\
  Implementing web components with pacioli-js

- [Extending Pacioli][extending-pacioli]\
  Some hints and tips for adding custom primitives and new functionality.

[home]: https://github.com/pgriffel/pacioli
[uom-in-matrices]: /uom-in-matrices
[matrix-type]: /matrix-type
[surfaces]: /samples/parametric_surfaces/surfaces
[bom]: /samples/bom/bom-sample
[petri]: /samples/net/petri-sample
[shells]: /samples/shells/shells-example
[inference]: tutorials/unit-inference
[matrices]: /tutorials/matrices
[kirchhof]: tutorials/kirchhof
[space]: tutorials/space
[charts]: tutorials/charts
[pacioli-js]: /guides/pacioli-js
[web-components]: /guides/web-components
[extending-pacioli]: /guides/extending-pacioli
