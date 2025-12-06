---
title: Matrix Type
---

# Matrix Type

Pacioli's type system's design is driven by the goal of incorporating dimensioned vector spaces into
a polymorphic type system.

Pacioli's matrix type enables type inference of linear algebra expressions.
It is able to infer dimensioned vector spaces. But this requires an extension of the type inference
engine. Polymorphic type systems cannot handle dimensioned vector spaces. It can only handle
uniform vectors and matrices. Vectors and matrices can however have non-uniform units of measyrement.

Any numerical value is a matrix. A scalar is a 1x1 matrix. A vector
is a 1xN or a Nx1 matrix.

The type of a <a href="#matrices">matrix</a> is of the form `dim per
dim`. The row and column types are expressions on units and unit
vectors with operators `*`, `/`, `^` and `%`. The grammar of the matrix
type's dimensions is

    dim ::= dim * dim                          dimensional multiplication
          | dim / dim                          dimensional division
          | dim ^ integer                      dimensional power
          | dim % dim                          dimensional Kronecker
          | term                               matrix type terminal

    term ::= identifier ! identifier           dimensioned vector
           | identifier !                      dimensionless vector
           | identifier                        dimensioned number
           | 1                                 dimensionless number

A terminal in a row or column type expression is the name of a scalar
unit or the name of a dimensioned vector space. A unit scalar is the
dimensionless 1 or a unit like a `gram` or a `metre`. A dimensioned
vector space is distinguished from a scalar by an exclamation
mark. The exclamation mark indicates a vector space and is always
preceded by the name of the space's index set.

The matrix type is interpreted at runtime as a unit matrix. For each
dimensioned vector space the representative unit vector is assumed to
be available. Each entry in a matrix type is then given by

      (x per y)[i,j] = x[i] / y[j]

The runtime contents of non-terminals is defined inductively, starting
from the contents of the unit vector terminals. Let `v` and `w` be
unit vectors

<pre><code>
(v * w)[i] = v[i] * w[i]  
(v / w)[i] = v[i] / w[i]  
(v^n)[i] = v[i]^n  
(v % w)[i%j] = v[i] * v[j]
</code></pre>

The pair `i%j` in the last rule is a compound index. Tensors are
matricized with the Kronecker product. This makes multi-dimensional
data transparent for matrices and addresses the issue in the
indices. Multi-dimensional data is indexed with compound indices
instead of multiple row or column indices. See [Indices](index-type).

## Some Principles and Properties

### A matrix is a linear transformation

Pacioli uses matrices strictly as linerr transformations. The term matrix is used differently
in different contexts. A more strict definition restricts matrices to linear transformation. But
a matrix can also be viewed as just a 2-dimensional array of numbers. Pacioli uses the first strict
definition. In Pacioli a matrix denotes a linear transformation.

### No assumptions about individual units at compile time

The type is valid for any content of the unit vectors.

### Dimensioned Operations are Index-free

Operations like `get` only work on matrices with uniform units of measurement.

### Units at Runtime are Optional

Different levels of runtime support for units of measurement are possible.

### Functions `magnitude` and `unit` give an Escape Hatch

Escape always possible by splitting a dimensioned matrix into a dimensionless magnitude matrix and a unit matrix.

      A = magnitude(A) * unit(A)
