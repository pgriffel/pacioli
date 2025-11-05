---
title: Matrix Type
layout: default
---

{% include mathjax.html %}

# Pacioli's Matrix Type

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

In this notation a general matrix $a\textbf{u}$ per $\textbf{v}$ is written as $\texttt{a*P!u per Q!v}$

With the notation we can describe a variety of shapes:

TABEL OPNEMEN
