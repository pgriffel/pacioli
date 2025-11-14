---
title: Matrix Type
---

{% include mathjax.html %}

# Pacioli's Matrix Type

Any numerical value in Pacioli is a matrix. A scalar is a 1x1 matrix
and a vector a nx1 or 1xn matrix. All these matrix values are typed by
the matrix type.

## Unit vectors

Pacioli's matrix type is based on the [structure of units of measurement in matrices](uom-in-matrices).

Pacioli's type rules combines a rules for shape and a rule for units. This is achieved with special notation for unit vectors that combines a shape and a unit identifier into one.

The notation with shape identifers is possible because Pacioli indexes matrices and vectors with general index sets instead of the commonly used integers. A key feature of Pacioli's matrix type is that matrices are not indixed by integers but by specific index sets. A matrix isn't a map $\mathbb{N}\times\mathbb{N}\to\mathbb{R}$ but the more general $P\times Q\to\mathbb{R}$. We write $\mathbb{R}^{P\times Q}$ for such generalized
matrices.

As an example, say we have unit vectors $\textbf{m}$, $\textbf{s}$ and $\textbf{t}$ for mass, displacement and time.

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

Let the index sets for these vectors be {$\text{foo}, \text{bar}$}.

To define the unit vectors in Pacioli we first define the index set. Let's call it Foo.

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

So instead of $\textbf{u}$ we write $\texttt{Foo!mass}$. This compound identifier combines the index set name $\texttt{Foo}$ with unit identifier $\texttt{mass}$. In this way we have the shape and unit information combined into one identifier.

$\textbf{ms}\textbf{t}^{-2}$

    Foo!mass * Foo!displacement * Foo!time^-2

## Uniform Vectors

An important class is vectors with uniform units of measurement. Bla bla

## Index and Unit Variables

    for_index P: for_unit a, P!u:

For example to define an inner product betweem uniform vectors

    declare inner :: for_index P: for_unit a, b:
        (a*P!, b*P!) -> a*b

    define inner(v, w) = v '*' w^T;

For example outer product

    define outer(v, w) = v^T '*' w;

This gives a matrix. Nice bridge to next section.

## The Matrix Type

Remember that a general matrix has units $a\textbf{u}$ per $\textbf{v}$ with

$\displaystyle (a\textbf{u} \text{ per } \textbf{v})
_{ij} =
 a\cdot\frac{
    {\textbf{u}}
    _{i}
}
{
    \textbf{v}
    _{j}
}$

In Pacioli's notation a general matrix $a\textbf{u}$ per $\textbf{v}$ is written as `a*P!u per Q!v`.The combination of a
scalar unit `a`, the row units `P!u`, and the column units `Q!v`
matches any matrix type.

The next table lists some common specific
ones.

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
    <td>...</td>
    <td></td>
    <td>...</td>
  </tr>
</table>

Example

    define mat_square(A) =
        A '*' A^T;

    for_index P, Q for_unit a, P!u:
        (a/P!u per Q!) -> a^2/P!u per P!u
