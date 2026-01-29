---
title: Creating Matrices
---

# Creating Matrices

An introduction to Pacioli's dimensioned matrices.

## Creating Matrices

Constructing matrices with the right units of measurement requires some care as a results of Pacioli's emphasis on index-free operations. This holds especially for non-uniform units of measurement, because the type system does not take individual units in unit vectors into account.
As explained in [Pacioli's matrix type](/matrix-type), the parametric type system restricts non-index-free operations to uniform units of measurement. This means that for example putting the matrix elements in a list is not possible, because the list type
expects all elements to have the same type.

Primitives to construct matrices are

- unit notation `|...|`
- functions `make_matrix` and `delta`
- toplevel `defmatrix`

Let's see how these primitives could be used to create vectors in a three-dimensional space. Define the following to setup a space with coordinates x,y and z.

    import si;

    defindex Space = {x, y, z};

    defunit Space!unit = {
        x: inch,
        y: foot,
        z: metre
    };

The `Space!unit` vector defines a unit vector with non-uniform units of measurement. The unit is different in each direction.

### Unit Notation

Unit notation creates a number with the given unit and magnitude 1. Multiplying it with a magnitude allows constructing any dimensioned number. For example

    define velocity = 30*|kilo:metre/hour|;

For units vectors we can de the same. The unit notation accepts any matrix type. Add the following definition and toplevel.

    define velocity_unit = |Space!unit/hour|;

    velocity_unit;

This defines `velocity_unit` as a vector with magnitude 1 for each entry.
Evaluating the file shows

    Geom3       | Value
    ------------+-----------
    x           | 1.00 "/hr
    y           | 1.00 ft/hr
    z           | 1.00 m/hr

Now we only need to make dimensionless or uniform magnitude matrices. Then we can make any dimensioned matrix by multiplying the magnitude and the unit matrices, just as we did for scalars. Creating dimensionless or uniform can be done with function `make_matrix` or with function `delta`.

### Functions `make_matrix` and `delta`

With function `make_matrix` a vector is constructed from a list of individual entries. The polymorphic list type restricts this to uniform-units of measurement.

The function expects a list of tiples. Each triple contains a row coordinate, a column coordinate and a value.

For example the following fragment creates a dimensionless magnitude vector `m` and dimensioned vectors `start_position`.

    define start_position =
        let
            mag = make_matrix([tuple(Space@x, _, 10), tuple(Space@y, _, 10)])
        in
            mag * |Space!unit|
        end;

If we evaluate

    start_position;

we get

    Geom3       | Value
    ------------+---------
    x           | 10.00 "
    y           | 10.00 ft
    z           |  0.00 m

Another way to create dimensionless matrices is function `delta`. It creates a dimensionless vector with magnitude 1 at the given index, and 0 everywhere else. The vector can be created with it as follows:

    define start_position_alt =
        let
            mag = 10 '.*' delta(Space@x) + 10 '.*' delta(Space@y)
        in
            mag * |Space!unit|
        end;

Note that for the geometry library this is more typically written using a basis as follows

    let (ex, ey, ez) = basid3d in
        (10 '.*' ex + 10 '.*' ey) * |Geom3!unit|
    end;

The basis provides the delta vectors.

### Toplevel `defmatrix`

Toplevel `defmatrix` is syntactic sugar for the previous constructions with functions `make_matrix` and `delta`. The following definition

    defmatrix foo :: Space!unit = {
        x -> 10,
        y -> 10
    }

is equivalent to the previous contructions. It creates a dimensioned matrix of the declared type.

When a matrix or a vector can be defined at the toplevel, this is a convenient form.

## Safe non-uniform matrix constructors

We could define a convenience function to hide the constuction of dimensioned vectors as follows.

    define space_vector(x, y, z) =
        make_matrix([
            tuple(Geom3@x, _, x),
            tuple(Geom3@y, _, y),
            tuple(Geom3@z, _, z)]) * |Space!unit|;

This works, but the type of `space_vector` shows that it expects three arguments with the same units.

    space_vector :: for_unit a: (a, a, a) -> a * Space!unit;

A space vector is created as follows

    space_vector(10, 10, 0);

This is correct, but it doesn't show the units. Sometimes we would like to make the units explicit.

We can make the units explicit if we force the arugments to be of the correct unit with a type declaration. If we want the units in the calls we can create a safe constructor with the following definition:

    declare space_vector :: (inch, foot, metre) -> Space!unit;

    define space_vector(x, y, z) =
        make_matrix([
            tuple(Space@x, _, magnitude(x)),
            tuple(Space@y, _, magnitude(y)),
            tuple(Space@z, _, magnitude(z))]) * |Space!unit|;

It works because we take the magnitudes of the function arguments `x`,`y` and `z`.

Using this contructor is safe, but it is up to the programmer to ensure that
the parameters match the unit definition. The compiler cannot provide support
here because it does not look at the individual units in a unit vector like
`Space!unit`.

The custom constructor can be used like

    space_vector(10*|inch|, 10*|foot|, 0*|metre|);

The compiler checks the units againts the declaration.
