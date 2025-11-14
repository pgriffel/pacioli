---
title: Units of Measurement in Matrices
---

{% include mathjax.html %}

# Units of Measurement in Matrices

Just as a dimensioned number is written as the product of a magnitude and a unit,
a dimensioned matrix $\textbf{A}$ can be written as the product $\textbf{M} \times \textbf{U}$ of a magnitude matrix $\textbf{M}$ and unit matrix $\textbf{U}$. We say that matrix $\textbf{A}$ has units $\textbf{U}$, or $\text{unit}(\textbf{A}) = \textbf{U}$.

The units of measurement in a matrix follow from the linear transformation that the
matrix defines. This gives structure to $\textbf{U}$. It is a rank-1 matrix, but with an 'outer division' instead of an outer product.

A consequence of the rank-1 structure is that unit vectors are sufficient to denote the units in a matrix. Since a rank-1 matrix can be written as an outer product between two vectors, there is no need for additional primitives when describing the units in a dimensioned matrix.

This note examines how unit vectors describe the structure of units of measurement in dimensioned matrices. We will derive how the units behave in a matrix product and finish with a basic set of rules for reasoning about units of measurement in matrices.

## Notation

Matrices and vectors are written in bold. Indexing is written with subscripts, for example $\textbf{A}_{ij}$ and $\textbf{v}_i$ denote a matrix and a vector element.
The transpose of a matrix is written as $\textbf{A}^T$.

When working with units of measurement we encounter element-wise operators regularly. Therefore it is important to distinguish between the linear algebra operators and the element-wise ones.
We write the matrix product between matrices $\textbf{A}$ and $\textbf{B}$ as $\textbf{AB}$, and write the element-wise product as $\textbf{A}\times\textbf{B}$.
For exponents it is usually clear from the context which product is intended. If not, it will be stated explicilty. For vectors we write $\textbf{vw}$ for the element-wise product since it isn't a valid matrix prodct and $\textbf{v}\times\textbf{w}$ would be confusing with the cross product. Similarly $\textbf{v}^{-1}$ means the reciprocal of a vector and not the inverse.

## Lifting units to vectors

Units of measurement are constructed from base unit with mulitplication and division. For
example $\text{kilogram} \times \text{metre} \times \text{second}^{-2}$. We write $\mathbb{U}$ for the units of measurement.

Unit operations are lifted to element-wise operators on vectors from $\mathbb{U}^n$.
Say we have unit vectors $\textbf{m}$, $\textbf{s}$ and $\textbf{t}$ from $\mathbb{U}^2$, for mass, displacement and time.

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

We can then say some vector $\textbf{x}$ has units $\textbf{m}\textbf{s}\textbf{t}^{-2}$. The unit vector operations in this expression are element-wise:

$\textbf{m}\textbf{s}\textbf{t}^{-2}$

$=\begin{bmatrix}
 \text{kilogram} \\\ \text{pound} 
\end{bmatrix} 
\begin{bmatrix}
 \text{metre} \\\ \text{feet}
\end{bmatrix} 
\begin{bmatrix}
 \text{hour} \\\ \text{second} 
\end{bmatrix}^{-2}$

$=\begin{bmatrix}
 \text{kilogram}\times\text{metre}\times\text{hour}^{-2} \\\ \text{pound} \times\text{feet}\times\text{second}^{-2}
\end{bmatrix}$

With unit vectors we can express units of measurement at the vector level. Expressions like $\textbf{m}\textbf{s}\textbf{t}^{-2}$ give an index-free notation for units of measurement in vectors.

In the next sections we will see unit vectors are also sufficient to denote the units in matrices. The reason is that units in a dimensioned matrix form a rank-1 matrix.

## Units in a Linear Transformation

We can immediately state some rules for dimensioned matrices.
Say matrix $\textbf{A}$ has units $\textbf{U}$, and matrix $\textbf{B}$ has units $\textbf{V}$ and scalar $c$ has unit $w$ then

- $\textbf{A} + \textbf{B}$ is only valid if $\textbf{U} = \textbf{V}$. It has units $\textbf{U}$ (or $\textbf{V}$)
- $\textbf{A} \times \textbf{B}$ has units $\textbf{U} \times \textbf{V}$
- $c \textbf{A}$ has units $w\textbf{U}$

These rules follow directly from the rules for scalar units of measurement and commutativity of the element-wise product.

For the non-commutative matrix product $\textbf{AB}$ it is not so straightforward.
This is the topic of the remainder of this text. We will introduce the proper rule in the final section, when rank-1 matrices and scalar factors have been discussed.

To get an insight into the units of measurement in a matrix we look at a typical
matrix transformation

$(1)\quad \textbf{y} = \textbf{Ax}$

If we look at the 2 by 2 case we get

$\quad\begin{bmatrix}
 y_0 \\\ y_1
\end{bmatrix}=
\begin{bmatrix}
 a & b \\\ c & d
\end{bmatrix}
\begin{bmatrix}
 x_0 \\\ x_1
\end{bmatrix}$

or equivalently

- $y_0 = ax_0 + bx_1$ and
- $y_1 = cx_0 + dx_1$

To make the sums unit correct we need the following for the matrix entries:

- $\text{unit}(a) = \text{unit}(y_0) / \text{unit}(x_0)$
- $\text{unit}(b) = \text{unit}(y_0) / \text{unit}(x_1)$
- $\text{unit}(c) = \text{unit}(y_1) / \text{unit}(x_0)$
- $\text{unit}(d) = \text{unit}(y_1) / \text{unit}(x_1)$

Generalizing for any $m$ by $n$ matrix we get Hart's rule for units of measurement in a matrix [Hart94, Hart95]

$(2)\quad\displaystyle
\text{If } \textbf{y} \text{ has units } \textbf{u} \text{, and }\textbf{x} \text{ has units } \textbf{v} \text{ in (1) then }
\textbf{A}_{ij} \text{ has unit } \frac{\textbf{u}_i }{\textbf{v}_j}$

The units in matrix $\textbf{A}$ in (1) are completely determined by the units of vectors $\textbf{x}$ and $\textbf{y}$.

### Exercise 1)

Finish the matrix units in the following equation

$\begin{bmatrix}
 \text{metre} \\\ \text{litre}
\end{bmatrix}=
\begin{bmatrix}
 ... & ... \\\ ... & ...
\end{bmatrix}
\begin{bmatrix}
 \text{second} \\\ \text{metre}^2
\end{bmatrix}$

### Exercise 2)

Give a rule like (2), but for the units of measurement in a matrix transpose

$\text{unit}(\textbf{A}^T_{ij}) = ...$

## Units are a Rank-1 Matrix

Equation (2) can be written with a rank-1 matrix. This gives us an index-free notation. However, to get co- and contra-variance right we need the concept of an 'outer division'.

A rank-1 matrix is an outer product $\textbf{vw}^T$ between two vectors. It satisfies

$(3)\quad (\textbf{vw}^T)_{ij} = \textbf{v}_i \cdot \textbf{w}_j$

However, equation (2) tells us that we want a division instead of a product. To achieve that we multiply with the
reciprocal.
Multiplying with the reciprocal is the same as element-wise division.

In index free form we can now write $\textbf{A}$ has units $\textbf{u}{\textbf{v}^{-1}}^T$ in (2).

We introduce a notation for this 'outer division'. The 'per' operator combines
the outer product with a reciprocal.

$(5)\quad\displaystyle (\textbf{v} \text{ per } \textbf{w})
_{ij} =
 \frac{
    {\textbf{v}}
    _{i}
}
{
    \textbf{w}
    _{j}
}$

Now we can write (2) as

$(6)\quad \text{If } \textbf{y} \text{ has units } \textbf{u} \text{, and }\textbf{x} \text{ has units  } \textbf{v} \text{ in (1) then }
    \textbf{A} \text{ has units } \textbf{u}\ \text{per}\ \textbf{v}$

The unit vector $\textbf{u}$ is the units in the row-dimension, and $\textbf{v}$ the units in the column dimension.

Unit matrix $\textbf{u}\ \text{per}\ \textbf{v}$ is a rank-1 matrix. Matrix $\textbf{A}$ transforms vectors with units $\textbf{v}$ into vectors with units $\textbf{u}$. With this notation unit vectors are sufficient to denote the units in a matrix.

### Co- and contra-variance

Co- and contra-variance is about how a quantity changes when the quantity's units
of measurement change. When a quantity is scaled up, the co-variant units also
scale up, while the contra-variant units scale down. For example in quantity
`200 km/hr` The unit `km` is contra-variant, and the `hr` unit is co-variant.

Equation (2) shows the well-known fact that the row-dimension of a matrix is
contra-variant and the column-dimension is co-variant. It is the reason we get an outer division.

### The Dimensional Inverse

Hart defines postfix operator $^\sim$ for ${^{-1}}^T$ and calls it the dimensional inverse. Unit matrix $\textbf{u}$ per $\textbf{v}$ is then written as $\textbf{u}\textbf{v}^\sim$
The per notation is used in the Pacioli language because it is syntactically more convenient. The dimensional inverse is written as $\textbf{A}^D$

### Exercise 3)

Which of the following matrices have valid units of measurement? If valid, write
the matrix as a rank-1 matrix.

i)

$\begin{bmatrix}
    \text{litre}/\text{second} & \text{litre}/\text{second}^2 \\\ \text{gram}/\text{second}  &  \text{gram}/\text{second}^2 
\end{bmatrix}$

ii)

$\begin{bmatrix}
    \text{litre}/\text{second} & \text{litre}/\text{second} \\\ \text{gram}/\text{second}  & \text{gram}/\text{second}^2
\end{bmatrix}$

iii)

$\begin{bmatrix}
    \text{litre} \times \text{metre}/\text{second}^2 & \text{litre} \times \text{metre}/\text{second}^3 \\\ \text{gram}/\text{metre}/\text{second} & \text{gram}/\text{metre}/\text{second}^2
\end{bmatrix}$

### Exercise 4)

Derive an index-free form for the transpose rule from exercise 2.

### Exercise 5)

Show that $\textbf{u}$ per $\textbf{v} = \textbf{u}\textbf{v}^\sim$

### Matrix Product

With the 'per' notation from the previous section we can conveniently write a rule for
matrix multiplication with correct units of measurement.

The rule for units of measurement is similar to the usual rule for matrix shapes.

$(M_1)\quad \displaystyle
\frac{
    \textbf{A} \text{ is a } \mathbb{R}^{m\times k} \text{ matrix,}
    \quad
    \textbf{B} \text{ is a } \mathbb{R}^{k\times n} \text{ matrix,}
}
{
    \textbf{AB} \text{ is a } \mathbb{R}^{m\times n} \text{ matrix}
}$

Multiplying a $\mathbb{R}^{m\times k}$ matrix with a $\mathbb{R}^{l\times n}$ matrix,
requires that $k = l$ and it produces a $\mathbb{R}^{m\times n}$ matrix.

For units of measurement we get a similar rule.

$(M_2)\quad \displaystyle
\frac{
    \textbf{A} \text{ has units } \textbf{u} \text{ per } \textbf{v},
    \quad
    \textbf{B} \text{ has units } \textbf{v} \text{ per } \textbf{w}
}
{
    \textbf{AB} \text{ has units } \textbf{u} \text{ per } \textbf{w}
}$

Multiplying a $\textbf{u}$ per $\textbf{k}$ matrix with a
$\textbf{l}$ per $\textbf{w}$ matrix requires that $\textbf{k} = \textbf{l}$ and
it produces a matrix with units $\textbf{u}$ per $\textbf{w}$.

The product rule is expressed in unit vectors only. This shows again that unit vectors are sufficient to describe the structure of units in a dimensioned matrix.

With a rule for the matrix product we have the basics for units of measurement in dimensioned matrices. This rule is the basis for reasoning about units in linear algebra expressions. It allows automated [dimensional analysis][1], and is the core of Pacioli's type system \[Grif19]. The only extra refinement is for scalar factors in the final section.

[1]: https://en.wikipedia.org/wiki/Dimensional_analysis

### Exercise 6)

What is the condition for $\textbf{A}^2$ to exist? What are the units of $\textbf{A}^2$ ?

### Exercise 7)

What are the units of an identity matrix? Distinguish a left and a right identity matrix. When
are the left and right identity the same?

### Exercise 8)

What are the units of the matrix inverse? Distinguish a left and a right inverse. When
are the left and right inverse the same?

### Exercise 9)

Give a law for the element-wise product.

### Exercise 10)

Say

- matrix $\textbf{A}$ has units $\textbf{u}$ per $\textbf{v}$
- matrix $\textbf{B}$ has units $\textbf{u}$ per $\textbf{v}^{-1}$
- matrix $\textbf{C}$ has units $\textbf{u}$ per $\textbf{u}$
- matrix $\textbf{D}$ has units $\textbf{v}$ per $\textbf{v}$

Which of the following products is valid? Give the units of the result for the valid cases.

1. $\textbf{AB}$
2. $\textbf{AB}^T$
3. $\textbf{A}^T\textbf{B}$
4. $\textbf{A}^T\textbf{C}^T$
5. $\textbf{BD}$
6. $\textbf{D}\textbf{B}^T\textbf{A}$
7. $\textbf{D}(\textbf{CB})^T$

## Scalar factors

Say matrix $\textbf{A}$ has units $\textbf{u}$ per $\textbf{v}$. Vectors $\textbf{u}$ and $\textbf{v}$ are not unique.
For any scalar $c$ we see

$(c\textbf{u} \text{ per } c\textbf{v})_{ij}$

$= (c\textbf{u})_i \mathbin{/} (c\textbf{v})_j$

$= c\textbf{u}_i \mathbin{/} c\textbf{v}_j$

$= \textbf{u}_i \mathbin{/} \textbf{v}_j$

$= (\textbf{u} \text{ per } \textbf{v})_{ij}$

So, a matrix that transforms vectors with units $\textbf{v}$ into vectors with units $\textbf{u}$
will also transform vectors with units $c\textbf{v}$ into vectors with units $c\textbf{u}$. Hart calls $c\textbf{u}$ a dimensionally parallel space of $\textbf{u}$.

### bilinearity

The 'per' operator is bilinear, but we have to consider the co-variance in the column dimension. A scalar factor can be moved around freely, as long as a division is used in the column dimension. For
any scalar unit $a$ and unit matrix $\textbf{u}$ per $\textbf{v}$

$(7)\quad a(\textbf{u} \text{ per } \textbf{v}) 
= (a\textbf{u}) \text{ per } \textbf{v}
= \textbf{u} \text{ per } (\textbf{v}/a)
= (\textbf{u} \text{ per } \textbf{v})a$

As a convention we move scalar factors to the front and write $a\textbf{u} \text{ per } \textbf{v}$.

### Exercise 11)

Prove (7)

## Rules

With the properties of scalar unit factors from the previous section we have all ingredients to formulate a general set of rules for units of measurement in matrix operations.

Before we look at the rules for units, we first state the rules for the matrix shapes.
The unit rules assume the vectors have the proper shape. The unit rules are a refinement of the shape rules.

$(S_1)\quad\displaystyle
\frac{
    \textbf{A} \text{ has shape } \mathbb{R}^{m\times n},
    \quad
    \textbf{B} \text{ has shape } \mathbb{R}^{m\times n}
}
{
    \textbf{A+B} \text{ has shape } \mathbb{R}^{m\times n}
}$

$(S_2)\quad\displaystyle
\frac{
    \textbf{A} \text{ has shape } \mathbb{R}^{m\times k},
    \quad
    \textbf{B} \text{ has shape } \mathbb{R}^{k\times n}
}
{
    \textbf{AB} \text{ has shape } \mathbb{R}^{m\times n}
}$

$(S_3)\quad\displaystyle
\frac{
    \textbf{A} \text{ has shape } \mathbb{R}^{m\times n},
    \quad
    \textbf{B} \text{ has shape } \mathbb{R}^{m\times n}
}
{
    \textbf{A}\times\textbf{B} \text{ has shape } \mathbb{R}^{m\times n}
}$

$(S_4)\quad\displaystyle
\frac{
    c \text{ has shape } \mathbb{R},
    \quad
    \textbf{A} \text{ has shape } \mathbb{R}^{m\times n}
}
{
    c\textbf{A} \text{ has shape } \mathbb{R}^{m\times n}
}$

For the rules for units of measurement we add scalar factors to the rules discussed earlier. Scalar unit factors allow for more general rules in some cases.
According to rule $(M_2)$ for multiplying matrices, a matrix with units $\textbf{u}$ per $\textbf{v}$, can be multiplied with a matrix that has units $\textbf{v}$ per $\textbf{w}$.
However, a matrix with units $a\textbf{u}$ per $\textbf{v}$, can be multiplied with a matrix that has units $b\textbf{v}$ per $\textbf{w}$ with result $ab\textbf{u}$ per $\textbf{w}$. The second matrix units can be rewritten to $\textbf{v}$ per $\textbf{w}/b$ and the product is valid.

If we incorporate scalar factors into the rules for unit operations, we can formulate a general set of rules for reasoning about units of measurement in dimensioned matrices.
In the following rules scalars have been added.

$(R_1)\quad\displaystyle
\frac{
    \textbf{A} \text{ has units } a\textbf{u} \text{ per } \textbf{v},
    \quad
    \textbf{B} \text{ has units } a\textbf{u} \text{ per } \textbf{v}
}
{
    \textbf{A+B} \text{ has units } a\textbf{u} \text{ per } \textbf{v}
}$

$(R_2)\quad\displaystyle
\frac{
    \textbf{A} \text{ has units } a\textbf{u} \text{ per } \textbf{v},
    \quad
    \textbf{B} \text{ has units } b\textbf{v} \text{ per } \textbf{w}
}
{
    \textbf{AB} \text{ has units } ab\textbf{u} \text{ per } \textbf{w}
}$

$(R_3)\quad\displaystyle
\frac{
    \textbf{A} \text{ has units } a\textbf{u} \text{ per } \textbf{v},
    \quad
    \textbf{B} \text{ has units } b\textbf{w} \text{ per } \textbf{z}
}
{
    \textbf{A} \times \textbf{B} \text{ has units } ab\textbf{u}\textbf{w} \text{ per } \textbf{v}\textbf{z}
}$

$(R_4)\quad\displaystyle
\frac{
    c \text{ has unit } a
    \quad  \textbf{A} \text{ has units } b\textbf{u} \text{ per } \textbf{v},
}
{
    c\textbf{A} \text{ has units } ab\textbf{u} \text{ per } \textbf{v}
}$

The sum rule requires two matrices with the same units of measurement. In the matrix product both matrices can have different scalar unit factors, as long as the column dimension of the first matrix matches with the row dimension of the second matrix. The element-wise product and scaling don't have a restriction for the units of measurement.

Finally we give rules for the unary postfix operators. The transpose, dimensional inverse and the reciprocal are as follows.

$(R_5)\quad\displaystyle
\frac{
    \textbf{A} \text{ has units } a\textbf{u} \text{ per } \textbf{v},
}
{
    \textbf{A}^T \text{ has units } a\textbf{v}^{-1} \text{ per } \textbf{u}^{-1}
}$

$(R_6)\quad\displaystyle
\frac{
    \textbf{A} \text{ has units } a\textbf{u} \text{ per } \textbf{v},
}
{
    \textbf{A}^D \text{ has units } a^{-1}\textbf{v} \text{ per } \textbf{u}
}$

$(R_7)\quad\displaystyle
\frac{
    \textbf{A} \text{ has units } a\textbf{u} \text{ per } \textbf{v},
}
{
    \textbf{A}^{R} \text{ has units } a^{-1}\textbf{u}^{-1} \text{ per } \textbf{v}^{-1}
}$

Where $^{R}$ is Pacioli's notation the reciprocal, to avoid confusion with the inverse. The shapes for these rules are easily derived from the units.

### Exercise 12)

Refince your answers for exercises 6, 7, 8 and 9 with scalar factors.

## References

- [Hart94] Hart, George W. (1994), "The theory of dimensioned matrices", in Lewis, John G. (ed.), Proceedings of the Fifth SIAM Conference on Applied Linear Algebra, SIAM, pp. 186–190, ISBN 978-0-89871-336-7
- [Hart95] Hart, George W. (1995), Multidimensional Analysis: Algebras and Systems for Science and Engineering, Springer-Verlag, ISBN 978-0-387-94417-3
- \[Grif19]: Griffioen, P. (2019). A unit-aware matrix language and its application in control and auditing ([PDF][3]) (Thesis). University of Amsterdam. hdl:11245.1/fd7be191-700f-4468-a329-4c8ecd9007ba.

[3]: https://pure.uva.nl/ws/files/42206706/Thesis.pdf
