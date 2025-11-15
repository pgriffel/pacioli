---
title: Matrix Type
---

# Matrix Type

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

<code>
(x per y)[i,j] = x[i] / y[j]
</code>

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
