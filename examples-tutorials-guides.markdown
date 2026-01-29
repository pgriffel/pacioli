---
title: Examples, Tutorials and Guides
---

# Examples, Tutorials and Guides

## Introduction

The basics of dimensioned matrices can be found in [Units of Measurement in Matrices][uom-in-matrices]. It also contains some litereature references. An explanation of dimensioned matrices in Pacioli is in the [introduction to Pacioli's Matrix Type][matrix-type].

## Examples

Various examples that demonstrate different use cases. See the samples and test directories in the [GitHub project][home] for more examples.

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

- [Creating matrices](/tutorials/creating-matrices) \
  The basics of matrices in Pacioli.

- [Working with matrices I - Kirchhof](/tutorials/kirchhof) \
  This case on the equilibrium in an eletrical network explains matrices with uniform units of measurement

- [Working with matrices II - Curiosity](/tutorials/curiosity) \
  Gives some details on Pacioli's type system. It is about the power consumption of Nasa's curiosity rover and involves vectors with non-uniform units of measurement.

- [Working with tables](/tutorials/tables)\
  Explains how to add tables to a web page.

- [Working with charts](/tutorials/charts)\
  Explains how to add charts to a web page.

- [Working with 3D graphics](/tutorials/graphics)\
  Creating 3D scenes and animations with web components.

<!--
## Guides

- [Javascript API][pacioli-js]\
  Access values and create charts and 3D graphics with lower level javascript apis.

- [Grapics][graphics]\
  3D graphics with pacioli-js

- [Extending Pacioli][extending-pacioli]\
  Some hints and tips for adding custom primitives and new functionality.
-->

[home]: https://github.com/pgriffel/pacioli
[uom-in-matrices]: uom-in-matrices
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
[graphics]: /guides/graphics
[extending-pacioli]: /guides/extending-pacioli
