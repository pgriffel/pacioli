---
title: Matrix Type
---

{% include mathjax.html %}

# Pacioli's Matrix Type

Pacioli's matrix type is based on the structure of [units of measurement in matrices](uom-in-matrices).

Any numerical value in Pacioli is a matrix. A scalar is a 1x1 matrix
and a vector a nx1 or 1xn matrix. All these matrix values are typed by
the matrix type.

Just as the structure of units of measurement in matrices is based on unit vectors, the matrix type and its
notation are also based on unit vectors.

## Unit Vector Notation

Pacioli's type rules combines a rules for shape and a rule for units. This is achieved with special notation for unit vectors that combines a shape and a unit identifier into one.

<!-- The notation with shape identifers is possible because Pacioli indexes matrices and vectors with general index sets instead of the commonly used integers. -->
<!-- A vector is a map $P\to\mathbb{R}$ with units $P\to\mathbb{U}$ instead of the common $\mathbb{N}\to\mathbb{R}$ with units $\mathbb{N}\to\mathbb{U}$.. -->
<!-- A vector is a map $P\to\mathbb{R}$ instead of the common $\\{1,\ldots,n\\}\to\mathbb{R}$ with units $\mathbb{N}\to\mathbb{U}$. Similarly a unit vector is a map $P\to\mathbb{U}$. -->

Vectors and matrices in Pacioli are not indixed by numbers but by any index set.
A vector is a map $P\to\mathbb{R}$ with units $P\to\mathbb{U}$. The index set $P$ can be any ste instead of the common natural
numbers.

<!-- The index set $P$ can be any matrix isn't a map $\mathbb{N}\times\mathbb{N}\to\mathbb{R}$ but the more general. -->

<!-- We write $\mathbb{R}^{P\times Q}$ for such generalized matrices. -->

Say vector $\textbf{x}$ has units $\textbf{u}$ of the form $P\to \mathbb{U}$.
In Pacioli's type system this is written as `x :: P!u`. The notation with the exclamation mark combines the unit vector's index set with the unit vector's name. On the left of the exclamation mark is the unit vector' index set. On the right a name for the unit vector.

Dimensionless vectors are written with just the index set name as in `P!` and `Q!`. For every index set
there is one such vector.

## The Matrix Type

Remember that a matrix has units $a\textbf{u}$ per $\textbf{v}$ with

$\quad\displaystyle (a\textbf{u} \text{ per } \textbf{v})
_{ij} =
 a\cdot\frac{
    {\textbf{u}}
    _{i}
}
{
    \textbf{v}
    _{j}
}$

In Pacioli's notation a general matrix $a\textbf{u}$ per $\textbf{v}$ is written as

    a*P!u per Q!v

The combination of a
scalar unit `a`, the row units `P!u`, and the column units `Q!v`
matches any matrix type.

The row and column units `P!u` and `Q!v` represent a unit expression. These expression can also be 1, leading to
a all kinds of shapes.
The next table lists some common ones.

If the column unit is 1 the `per 1` part can be omitted. This shorthand makes the notation a proper
extension of scalar unit notation.

<table>
  <tr>
    <th>Type</th>
    <th>Shorthand</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>1 per 1</td>
    <td>1</td>
    <td>dimensionless scalar</td>
  </tr>
  <tr>
    <td>a per 1</td>  
    <td>a</td>
    <td>dimensioned scalar</td>
  </tr>
  <tr>
    <td>P! per 1</td>
    <td>P!</td>
    <td>dimensionless column vector</td>
  </tr>
  <tr>
    <td>P!u per 1</td>  
    <td>P!u</td>
    <td>dimensioned column vector</td>
  </tr>
  <tr>
    <td>a*P! per 1</td>
    <td>a*P!</td>
    <td>homogeneous dimensioned column vector</td>
  </tr>
  <tr>
    <td>1 per Q!v</td>
    <td></td>
    <td>dimensioned row vector</td>
  </tr>
  <tr>
    <td>P! per Q!</td>
    <td></td>
    <td>dimensionless rectangular matrix</td>
  </tr>
  <tr>
    <td>P!u per P!v</td>
    <td></td>
    <td>square matrix</td>
  </tr>
  <tr>
    <td>P!u per P!u</td>
    <td></td>
    <td>even more square matrix</td>
  </tr>
  <tr>
    <td>P!u^2 per P!u^2</td>
    <td></td>
    <td>matrix with squared units</td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td>...</td>
  </tr>
</table>

## Index and Unit Variables

Besides type variables, Pacioli knows index set and unit variables.
Index set variables are introduced with keyword `for_index`.
Unit variables are introduced with keyword `for_unit`.

A unit variable can denote a scalar unit, but also a vector unit. Unit variables include the index set. The compound name `P!u` is a single
unit identifier and is also declared like that. For example

    declare foo :: for_index P: for_unit a, P!u: ...

Index set variables are not just used as part of the matrix type, but they are also used
on there own to denote index set elements. For example function `row_domain` is declared as

    row_domain(A) :: for_index P,Q: for_unit a, P!u, Q!v:
        (a*P!u per Q!v) -> List(P);

It gives the elements in index set `P`.

## Unit Rules as Type Rules

Say $\textbf{A}$ is a $P\times Q$ matrix and $\textbf{B}$ is a $Q\times R$ matrix in
the rule for the matrix product.

$(R_2)\quad\displaystyle
\frac{
    \textbf{A} \text{ has units } a\textbf{u} \text{ per } \textbf{v},
    \quad
    \textbf{B} \text{ has units } b\textbf{v} \text{ per } \textbf{w}
}
{
    \textbf{AB} \text{ has units } ab\textbf{u} \text{ per } \textbf{w}
}$

In Pacioil matrix multiplication is called `mmult`. The type declaration is

    mmult :: for_index P, Q, R: for_unit a, b, P!u, Q!v, R!w:
        (a*P!u per Q!v, b*Q!v per R!w) -> a*b*P!u per R!w;

It combines the shape and unit rule for matrix multiplication.

## Dimensionless and Uniform Vectors

An important class is vectors with uniform units of measurement, because uniform units correspond
with parametric types. In a parametric type system the elements of a container type like `List` or
`Arary` necessarily have the same units of measurement. We could define something like `Vector(a)`,
but that would restrict the vectors elements to the same unit.

The key to Pacioli's ability to type matrices with non-uniform units is that
unit vectors are completely opaque to the type system. The type system checks that unit operations are
correct, no matter what units are in the unit vectors. This only works for index-free operations. Functions
that use indices, like getting a matrix entry, cannot produce the unit. They can only type uniform units.

A uniform matrix has the same unit everywhere.
A special case is the dimensionless matrices.
A dimensionless matrix has unit 1 everywhere.

A uniform matrix is the product of a scalar unit with a dimensionless matrix.
For example `a*P! per Q!` is a `P` by `Q` matrix with every entry of unit `a`.

An example of a uniform function is the `get` function:

    get :: for_index P, Q: for_unit a: (a*P! per Q!, P, Q) -> a;

The function is restricted to matrices with uniform units of measurement.

## Functions `magnitude` and `unit`

With functions `magnitude` and `unit` we can sidestep the safety of the unit rules.
These functions split a matrix into its magnitude and its units.

    A = magnitude(A) * unit(A);

Function `magnitude` gives a matrix of the same shape, but dimensionless.
Function `unit` gives the units of the input matrix.

    magnitude :: for_index P, Q: for_unit a, P!u, Q!v: (a*P!u per Q!v) -> P! per Q!

    unit :: for_index P, Q: for_unit a, P!u, Q!v: (a*P!u per Q!v) -> a*P!u per Q!v

After splitting of the magnitude we can operate on it without any unit restrictions.

An example of the application of the magnitude function is function `get_num`. This
unsafe function gives the magnitude of a matrix element.

    get_num :: for_index P, Q: for_unit a, P!u, Q!v: (a*P!u per Q!v, P, Q) -> 1

It can be defined as

    get_num(A, x, y) = get(magnitude(A), x, y);

The type shows that it gives dimensionless numbers, but it accepts matrices with any units.
This is in contrast to function `get` where the input must be uniform.

Functions like `get_num` allow us to operate on the magnitude of a matrix. If we multiply
with the units afterwards we have a way to sidestep unit safety.

Multiplying a dimensionless magnitude matrix with a unit matrix is also the way to
construct matrices with non-uniform matrices.
See the [tutorial on creating matrices](/tutorials/creating-matrices) for details.

## A Concrete Example

As an example, consider the unit vectors $\textbf{m}$, $\textbf{s}$ and $\textbf{t}$ for mass, displacement and time
from the [units of measurement in matrices](uom-in-matrices) text.
This does not involve index or unit variables, but involves actual index sets and unit vectors.

$\textbf{m} =\begin{bmatrix}
 \text{kilogram} \\\ \text{pound} 
\end{bmatrix}$,
$\quad\textbf{s} =\begin{bmatrix}
 \text{metre} \\\ \text{feet}
\end{bmatrix}$
,
$\quad\textbf{t} =\begin{bmatrix}
 \text{hour} \\\ \text{second} 
\end{bmatrix}$

Let the index sets for these vectors be `{foo, bar}`.

To define the unit vectors in Pacioli we first define the index set. Let's call it `Foo`.

    defindex Foo = {foo, bar};

We deliberately use long descriptive names. Convention is to uses single character identifers for index and unit variables. The unit vectors are defined as follows.

    defunit Foo!mass = {
        foo -> kilo:gram,
        bar -> pound
    }

    defunit Foo!displacement = {
        foo -> metre,
        bar -> feet
    }

    defunit Foo!time = {
        foo -> hour,
        bar -> second
    }

So instead of $\textbf{m}$ we write $\texttt{Foo!mass}$.
This compound identifier combines the index set name $\texttt{Foo}$ with unit identifier $\texttt{mass}$.
Unit vector $\textbf{ms}\textbf{t}^{-2}$ is written as

    Foo!mass * Foo!displacement * Foo!time^-2

This coordinate-free unit vector expression is Pacioli's way to write the vector type.
