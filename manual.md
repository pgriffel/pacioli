---
title: Pacioli Manual
layout: default
---

Pacioli Manual
==============

Manual for Pacioli 0.2

--------------------------------------------------------------------------------

Contents
--------
    
* [Pacioli](#pacioli)
* [Values](#datatypes)
* [Expressions]("#expressions")
* [Statements](#statements)



Pacioli <a id="pacioli"/></a>
------------------------

A Paciolo program consists of definitions organized in modules.


### Modules <a id="modules"/></a>

A module is a collection of definitions and expressions that is
compiled as a unit.

Each module is stored in its own file and starts with keyword `module`
followed by the module name. A module can include other modules with
an `include`.

<pre><code>module Example;

include si;
include geometry;
include my_libs/some_lib;

...
</code></pre>

A module provides namespaces for

- values and functions
- index sets
- units and unit vectors
- types

After the definitions have been processed, the toplevel expressions in
a module are evaluated in the order they appear in the file.

    
### Toplevel Definitions <a id="toplevel"/></a>


#### Definitions <a id="definitions"/></a>

A definition starts with keyword `define` followed by a name, the
equal sign, and an [expression](#expressions). A value is
defined like
<pre><code>define x = [expression](#expressions);
</code></pre>

and a function like
<pre><code>define f(x, y, ..., z) = [expression](#expressions);
</code></pre>


#### Declarations <a id="declarations"/></a>

A definition can be accompanied by a type declaration. A declaration
starts with keyword `declare` followed by a name, a pair of colons,
and a type.
<pre><code>declare x :: [type](#typesystem);
</code></pre>

Declarations are optional, except for recursive functions. If a type
is declared then it is checked against the definition's infered
type. A declaration may restrict the type, but not generalize or
contradict it.


#### Matrix Definitions <a id="matrixdefinition"/></a>
    
Syntax is

<code>
defmatrix x :: [matrix type](#matrices) = {foo, bar -> ..., ...};
</code>

A matrix of the declared type with the given numbers is defined.


#### Conversion Definitions <a id="conversiondefinition"/></a>
    
Syntax is same as declaration

<code>
defconv foo :: [matrix type](#typesystem);
</code>

A conversion matrix of the declared type is defined as value.


#### Projection Definitions <a id="projectiondefinition"/></a>
    
Syntax is same as declaration

<code>
defproj foo :: [matrix type](#typesystem);
</code>

A projection matrix of the declared type is defined as value.


#### Index Definitions <a id="indexdefinition"/></a>

An index set definition starts with keyword `defindex` followed by a
name, the equal sign, and a set of names.

<code>
defindex Foo = {foo, bar, baz};
</code>

The defined name is used in [matrix](#matrices) types.


#### Unit Definitions <a id="unitdefinition"/></a>
    
A unit definition starts with keyword `defunit` and can define a base
unit, a derived unit, or a unit vector.

A base unit definition requires a name and a string to be used in
output.  

<code>
defunit metre "m";
</code>

A derived unit requires an additonal unit expression. This is an
expression with operators `*`, `/` and `^` on base units or other
derived units.

<code>
defunit knot "kn" = 0.51444444*metre/second;
</code>

A unit vector is defined for an [index set](#indexdefinition) by
specifying a unit for each index key. An exclamation mark seperates
the index set name from the unit vector name.

<code>
defunit Foo!unit = {foo: metre, bar: knot, ...};
</code>

Unit vectors are used in [matrix](#matrices) types.


#### Type Definitions <a id="typedefinition"/></a>
    
Syntax is

<code>
deftype [type](#typesystem) = [type](#typesystem);
</code>

The defined type must be a parametric type.



### The Type System <a name="typesystem"/></a>

A type judgement states that an expression is of some type. It is of
the form

<code>
[expression](#expressions) :: [schema](#schema)
</code>

Type judgements are used as input in definitions and declarations to
declare a type, and as output by the compiler when the inferred types
are displayed.

The type schema introduces type variables. A type schema is can
introduce ordinary type varibles, index variables, or unit varibles.

<code>
for\_type a,b,...: [type](#typesystem)  
for\_index P,Q,...: [type](#typesystem)  
for\_unit u,v,...: [type](#typesystem)
</code>

Index variables are written in uppercase by convention.

A type is one of the two special types for functions and matrices, or
the generic parametric type. The [function](#functions) and
[matrix](#matrices) type are described in the next section. A
parametric type is of the form

<code>
Foo([type](#typesystem), [type](#typesystem), ...)
</code>

Built in types List, Tuple and Boole are parametric types.



Values <a id="datatypes"/></a>
--------------------------

Pacioli supports numbers, booleans, lists, tuples, functions and
incides.
    

### Matrices <a id="matrices"/></a>
    
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

<code>
(v * w)[i] = v[i] * w[i]  
(v / w)[i] = v[i] / w[i]  
(v^n)[i] = v[i]^n  
(v % w)[i%j] = v[i] * v[j]
</code>

The pair `i%j` in the last rule is a compound index. Tensors are
matricized with the Kronecker product. This makes multi-dimensional
data transparent for matrices and addresses the issue in the
indices. Multi-dimensional data is indexed with compound indices
instead of multiple row or column indices. See [Indices](#indices).


### Indices <a id="indices"/></a>

Matrices in Pacioli are indexed by general index sets, not necessarily
integers. Indices are first class language members. They are
accessible via functions `row_domain` and `column_domain` or via
literal syntax _x_`@`_y_, with _x_ an index set and _y_ an index
key. For example `Foo@key13` or `Bar@item42`.

A consequence of the matricization of tensors is that a matrix can
have any number of row indices and any number of column indices.  A
row key or column key is a combination of items from possibly multiple
index sets. Compound literal indices are constructed with the `%`
symbol. For example `Foo@key13%Bar@item42`. The index type lists all
index sets. In this case:

    Index(Foo, Bar)

Special key `_` is the only element of the index of zero index sets:

    _ :: Index()

It is used to index the empty row and column domains of scalars and
vectors.


### Booleans <a id="booleans"/></a>
    
A Boolean is one of the logical values `true` or `false`. 

The type of a boolean is `Boole()`.
    

### Tuples <a id="tuples"/></a>
    
A tuple is a fixed set of values of various types. Functions in
Pacioli expect a tuple of values as argument.
    
Use function `tuple` to create a tuple. It returns the tuple of
arguments. Use destructuring in a let or comprehension or use function
`apply` to retreive the elements of a tuple.

The type of a tuple is 

<code>
Tuple([type](#typesystem), [type](#typesystem), ...)
</code>


### Lists <a id="lists"/></a>
    
A list is a varying set of values of the same type.

The type of a list is 

<code>
List([type](#typesystem))
</code>


### Functions <a id="functions"/></a>
    
Functions are first class values. Functions are globally
[defined](#definitions) in a module or anonymous [lambdas](#lambdas).

The type of a function is

<code>
([type](#typesystem), [type](#typesystem), ...) -> [type](#typesystem)
</code>





Expressions <a id="expressions"/></a>
---------------------------------



### Constants <a id="constants"/></a>
          
Literal constants are numbers, or the Boolean values `true` or `false`.


### Variables <a id="variables"/></a>
          
A variable is an identifier built from alphanumeric characters and
undercores. A variable can be local or it can refer to a defined value
or function.


### Unit Expressions <a id="unitexpressions"/></a>
          
A matrix type surrounded by pipes is a unit expression. For example
`|metre|` or `|Foo!unit per Foo!|`.


### Operators <a id="operators"/></a>

Operators grouped by precedence

    -               negative
    ^T              transpose
    ^R              reciprocal
    ^D              dim_inv

    .^              power
    ^               expt

    per             dim_div

    c*              scale
    *c              rscale
    /c              scale_down
    c/              lscale_down
    *               multiply
    /               divide
    \               left_divide
    .*              dot
    ./              right_division
    .\              left_division

    +               sum
    -               minus

    <               less
    <=              less_eq
    >               greater
    >=              greater_eq
    =               equal
    !=              not_equal

    and             and
    or              or
    <=>             equal
    ==>             implies
    <==             follows_from


### Function Application <a id="functionapplication"/></a>
    
A function application is of the form 

<code>
foo([expression](#expressions), [expression](#expressions), ... )
</code>

    
### Lambda <a id="lambdas"/></a>

An anonymous function is of the form 

<code>
lambda (x, y, ... ) [expression](#expressions) end
</code>
          
          
### If <a id="if"/></a>

An if is of the form
<pre><code>if [expression](#expression) then
  [expression](#expression)
else if [expression](#expression) then
  [expression](#expression)
...
else
  [expression](#expression)
end
</code></pre>


### Let <a id="let"/></a>

A let is of the form 
<pre><code>let 
    foo = [expression](#expression),
    bar = [expression](#expression),
    ...
in
    [expression](#expression)
end
</code></pre>

Each variable can also be a list of variables surrounded by
parenthesis to destructure a tuple.


### Comprehensions <a id="comprehensions"/></a>
          
A list comprehension is of the form 

<code>
[ [expression](#expressions) | clause, clause, ... ]
</code>
 
where each clause is

* a generator 
  <code>
  var <- [expression](#expressions)
  </code>

* a filter 
  <code>
  [expression](#expressions)
  </code>

* or an assignment
  <code>
  var := [expression](#expressions)
  </code>

Each var can also be a list of variables surrounded by parenthesis to
destructure a tuple.



Statements <a id="statements"/></a>
-------------------------------

A statement is of the form 
<pre><code>
begin
  [statement](#statements)
  [statement](#statements)
  ...
end
</code></pre>

A [return](#return) leaves the block prematurely.


### Assignment <a id="assignment"/></a>
          
An assignment is of the form 

<code>
var := [expression](#expressions);
</code>

The value stored by variable `var` is changed to the value of the
expression. The variable can also be a list of variables surrounded by
parenthesis to destructure a tuple.


### Return <a id="return"/></a>
  
A return statement is of the form

<code>
return [expression](#expressions);
</code>

Execution of the surrounding `begin` `end` block is halted and the
returned value becomes the value of the block. The expression is
optional.


### While <a id="while"/></a>
  
A while statement is of the form
<pre><code>while [expression](#expressions) do
  [statements](#statements)
end
</code></pre>

The body of the while loop is executed as long the expression is true.


### If <a id="ifstatement"/></a>
  
An if statement is of the form
<pre><code>if [expression](#expressions) then
  [statements](#statements)
else if [expression](#expressions) then
  [statements](#statements)
...
else
  [statements](#statements)
end
</code></pre>

The `else` and `elseif` are optional. 

