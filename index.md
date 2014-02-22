---
title: Pacioli 
layout: default
---


Introduction
------------

The matrix language Pacioli adds type safety and dimensional anaylysis
to mathematical software. Its parametric type system infers vector and
matrix types based on dimensioned vector spaces.

Pacioli programs can be run directly via the command line, or compiled
to JavaScript and deployed via the web. The language isn't rich in
features yet, but easily extended.


Examples
--------


<a href="shells"><img src="shells.png" alt="Snapshot of a shell model" title="The Shells Case" style="float:left; width: 200px; margin-right: 25px"></a>
Many aspects of the language are demonstrated in the <a href="shells">shells example</a>. It demonstrates
units, deployment via the web, charts and other features. 
...  

The shell is computed in a <a href="shells">Pacioli script</a> and displayed on the page with <a
href="three.js">Three.js</a>

All computations are guaranteed unit correct and derived by the compiler. For example
<pre><code>define triangle area(x, y, z) =
    norm(cross(y - x, z - x)) / 2;
</code></pre>
has as derived type
<pre><code>triangle area :: for unit a: (a*Space!, a*Space!, a*Space!) → a^2
</code></pre>

See the tutorials in the documentation section below for more examples.


Documentation
-------------

Pacioli is described in the <a href="manual.html">manual</a>. The <a
href="specification.html">specification</a> lists the available
functions.

A short introduction to units of measurements in Pacioli is in the <a
href="unit-inference.html">tutorial on unit inference</a>. The <a
href="matrices.html">tutorial on matrices</a> gives some examples of
the use of matrices in Pacioli. The <a href="kirchhof.html">Kirchhof
case</a> on the equilibrium in an eletrical network explains the use
of matrices.

<a href="space.html">space examples</a>

Download and Installation
-------------------------

Install Pacioli from the GitHub project. You can also view more
samples there.
