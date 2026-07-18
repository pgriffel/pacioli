
# Iquileslez' blog Avoiding trigonometry
We take Iquileslez' blog as a starting point for the investigation into the unit-aware version to see what we learn. First, we identify
two ways for computing the unit-aware cross product, either a closed cross product or a cross product thas has a quadratic unit.
Second, there are two ways to normalize a vector, the resulting unit vector can be either dimensionless or have a unit. Third, we
represent a rotation as a product of a dimensionless rotor with a dimensioned rotee.
The blog https://iquilezles.org/articles/noacos/ explains that trigonometric functions can be removed from computations, and moreover
that the use of these functions is unnecessary and ugly. The dot and cross products encode all information we need for orientation related
operations. The trigonometric function acosinus can be avoided, and the same goes for angles in general.
He rewrites a function to align two vectors that returns a 3d matrix. In stead of a radian input the input consists of two vectors that
must be aligned. After that he removes the acosinus step from the computation.
The resulting 3d matrix essentially is a rotor.

We start with a problem statement and then explain how the dot and cross products encode all information for orientation related operations. 
After that we implement his approach and functions in Pacioli to see how this transates to a unit-aware version of these functions.

# Problem statement
When making unit-aware functions we run into the computation of products of vectors, and the products of matrices.
A straightforward computation of a product of two vectors that are represented as |metre| units would lead to the result |metre|^2.
Thus the product does not represent a closed operation. At the same time we see that geometrically we require an invariant result |metre|,
in case of a rotation operation. The rotation operation requires a product that consists of a rotor (represented as a matrix) and a
rotee (a matrix or a vector) where the resulting vector again has unit |metre|. This leads to an asymmetric product of a dimensionless
rotor and a dimensioned (|metre|) rotee and resulting product vector.

Something similar occurs in the cross product, but here the geometric situation is not as clear as in the situation of the rotation.
There are use cases for the cross product resulting in a perpendicular vector, and there are use cases for the result to represent an area.
In case of the cross product of two vectors with unit |metre|, the resulting vector can be defined as having unit |metre|, or
as having unit |metre|^2. Only in the first case we obtain a closed operation.


# Extending geometric operations with units of measurement
In this text we add units of measurement to vector and matrix based computations.
We start with the vector space V, in this paper V is a three-dimensional vector space.
To this vector space we associate a unit a, and we write V(a), which means that the elements of V carry unit a.
In Pacioli V(a) is written as a*Geom3!.
A geometric operator Op can be characterised as

    Op: V x V -> V.

We encounter the following situations:

    Op: V(a) x V(a) -> V(a) - This is a closed operation. An example is the addition operator of vectors.
        or
    Op: V(a) x V(b) -> V(ab) - This is any product situation.


## Unit-aware products are not closed
As stated above a product leads to the following unit-aware type:

    *: V(a) x V(b) -> V(ab)

The product is a not-closed operator because the result is an element of the space V(ab) that differs from the spaces V(a) and V(b) of both operands.

If one of the operands is dimensionless - has unit 1 - we obtain a special situation in which the result is an element of the space V(a) or V(b) respectively.
These special situations apply to the rotation operators by means of a rotor and a rotee:
    *: V(a) x V(1) -> V(a) - This is the rotee * rotor product situation
            or
    *: V(1) x V(a) -> V(a) - This is the rotor * rotee product situation
        or


## The unit-aware cross product in Pacioli
The problem of the cross product can then be characterised as a choice between two types:

    cross: V(a) x V(a) -> V(a)
        or
    cross: V(a) x V(b) -> V(ab)

Pacioli defines the cross product in de second way, this results in:

    declare cross ::
        for_unit a,b: (a*Geom3!, b*Geom3!) -> a*b*Geom3!;

The reason for this choice in Pacioli comes from use cases in physics modelling, such as:

declare torque ::
    (metre*Geom3!, newton*Geom3!) -> metre*newton*Geom3!;

define torque(position, force) = 
    cross(position, force);

declare angular_momentum ::
    (metre*Geom3!, kilo:gram*metre/second*Geom3!) -> kilo:gram*metre^2/second*Geom3!;

define angular_momentum(position, linear_momentum) = 
    cross(position, linear_momentum);



## The functions norm and normalized in Pacioli
At various places we will need a unit vector, the question is how to do that in a unit-aware way.
A unit vector can be obtained from a vector in two ways. When vector v is split into scalar c and unit vector u such that v=cu and u has length one,
then we can couple the unit with the scalar or with the unit vector, but not with both. We have to pick one.
In the first case we obtain a dimensionless unit vector, in the second case we obtain the dimensioned unit vector.
By using the function normalized we create a unit vector that is dimensioned, by using a division by the norm we create a dimensionless unit vector.
For a vector v, function normalized creates a vector in the same direction as v with the same units but with norm one.

    declare norm :: for_index P: for_unit a: (a*P!) -> a;

    define norm(x) = sqrt(inner(x,x));


    declare normalized :: for_index P: for_unit a: (a*P!) -> a*P!;

    define normalized(x) = x '/.' magnitude(norm(x));


## The dot and cross products encode all information we need for orientation related operations
The calculation of cosinus and sinus without trigonometric computations depends on the relation of cosinus on the inner product, and of sinus on the cross product:

    cos(θ) = (a · b) / (|a| |b|)
    sin(θ) = |a × b| / (|a| |b|).

For the implementation of cos_from_vectors we calculate the |a| and |b| by taking the norm of a and b respectively. And by dividing inner(a,b) by these norms
we obtain the unit type 1:

    define cos_from_vectors(a, b) =
        inner(a, b) / (norm(a) * norm(b));

For the implementation of sin_from_vectors we have to take the norm of the cross product of a and b to calculate |a × b|, and then divide by the norms of a an b, respectively:

    define sin_from_vectors(a, b) =
        norm(cross(a, b)) / (norm(a) * norm(b));

Note that these functions look alike, but are not quite symmetric. Whereas sin_from_vectors takes the norm(cross(a,b)), cos_from_vectors takes only the inner(a, b) - no norm is needed in the nominator.

In Pacioli, both the cos and sin functions are dimensionless functions, and have unit type 1. Therefore, the functions to compute cosinus and sinus without trigonometric computations must also have unit type 1. This compiler derives the following functions types:

    declare cos_from_vectors :: for_index C: for_unit a, b: (a*C!, b*C!) -> 1;

    declare sin_from_vectors :: for_unit a, b: (a*Geom3!, b*Geom3!) -> 1;

We see that indeed the resulting unit type is 1, this is obtained by the division of norm(a) and norm(b), as well as the norm of the cross product.
Note that the compiler derives the general unit types a and b for both functions, whereas in practice both arguments are of the same unit type a.






## Rotating with an axis and angle

A unit-aware version of the starting point of the blog leads to questions about the cross product, because it uses a rotation axis.
In this step we have a function that computes a matrix that rotates vectors around a given axis k by an amount a radians.
The function uses trigonometric functions sin and cos to compute the resulting matrix, which in fact is a rotor.
The pacioli compiler derives the declared type of the function; it has dimensionless parameters and returns a dimensionless matrix.
To call this function, the rotation axis k must be computed, Iquilezles in his second function uses a cross product to do this.
However, a cross product does not deliver a dimensionless vector.
The rotation_align_iquilezles1 function is the pacioli version of the first function appearing in the blogpost https://iquilezles.org/articles/noacos/ .

    declare rotation_align_iquilezles1 :: (Geom3!, radian) -> Geom3! per Geom3!;

    define rotation_align_iquilezles1(k, a) = 
        let
            si = sin(a),
            co = cos(a),
            ic = 1 - co,
            (k_x, k_y, k_z) = values3d(k)
        in
            matrix3d(
                k_x*k_x*ic + co,      k_y*k_x*ic - si*k_z,  k_z*k_x*ic + si*k_y,
                k_x*k_y*ic + si*k_z,  k_y*k_y*ic + co,      k_z*k_y*ic - si*k_x,
                k_x*k_z*ic - si*k_y,  k_y*k_z*ic + si*k_x,  k_z*k_z*ic + co)
        end;

The parameter k and variables si, co and ic are all of unit 1 dimension. The matrix3d input values contain sums and products of the values k_x, k_y, k_z, si, co and ic
which are only allowed if the unit types are all 1. As expected the resulting matrix as a rotor is dimensionless.



## Rotating with two vectors that are aligned

The rotation_align_iquilezles2 
This step leads to the question of normalization of the rotation axis k. 
In this step we rewrite the function to a variant that takes two input vectors that must be aligned instead of a vector and a radian.
Here the cross product is introduced for determining the rotation axis k, which also is normalized. As we have seen, in a unit-aware variant this leads to the question
of how to normalize. If we mindlessly choose the function normalized for normalizing the cross product of the input vectors d and z, we obtain unit types a and 1/a of the input vectors d an z.


    declare rotation_align_iquilezles2 :: for_unit a: (a*Geom3!, 1/a*Geom3!) -> Geom3! per Geom3!;

    define rotation_align_iquilezles2(d, z) =
        let
            k = normalized(cross(z, d)),
            ang = acos(cos_from_vectors(z, d)),
            co = cos(ang),
            si = sin(ang),
            ic = 1 - co,
            (k_x, k_y, k_z) = values3d(k)
        in
            matrix3d(
                k_x*k_x*ic + co,      k_y*k_x*ic - si*k_z,  k_z*k_x*ic + si*k_y,
                k_x*k_y*ic + si*k_z,  k_y*k_y*ic + co,      k_z*k_y*ic - si*k_x,
                k_x*k_z*ic - si*k_y,  k_y*k_z*ic + si*k_x,  k_z*k_z*ic + co)
        end;

We use both acosinus, cosinus and sinus in the computation, these functions are unit correct.
The function definition deviates from the original in the use of the function cos_from_vectors, we do not need a 'clamp' function.

Note that the input unit types are a and 1/a - these types are derived from the way the computation is set up by means of the function
normalized instead of the use of norm.

The variable k must have unit type 1 because its 3d values k_x, k_y and k_z are multiplied and summed in the matrix3d computation and are therefore
forced to have unit 1. Because of the cross function type input parameters z and d must have reciprocal unit types a and 1/a.



## Rotating with two vectors that are aligned - alternative normalization and no acosinus

In this step we seek to fix the input units a and 1/a and to remove use of the acosinus function.
There are two ways to represent a unit vector, one by using the normalize function and one that divides by the norm. Here we see that we need the
second variant. 

    declare rotation_align_no_acos :: for_index E: for_unit c, b, a: (a*Geom3!, b*Geom3!) -> (c*Geom3!) -> c*Geom3!;

    define rotation_align_no_acos(d, z) =
        let
            cr = cross(z, d),
            k = cr '/.' norm(cr),
            co = cos_from_vectors(z, d),
            si = sin_from_vectors(z, d),
            ic = 1 - co,
            (k_x, k_y, k_z) = values3d(k),
            M = matrix3d(
                k_x*k_x*ic + co,      k_y*k_x*ic - si*k_z,  k_z*k_x*ic + si*k_y,
                k_x*k_y*ic + si*k_z,  k_y*k_y*ic + co,      k_z*k_y*ic - si*k_x,
                k_x*k_z*ic - si*k_y,  k_y*k_z*ic + si*k_x,  k_z*k_z*ic + co)
        in
            (v) -> M '*' v
        end;

The input vectors have unit types a and b respectively. The variable cr takes the unit type a*b*Geom3! and hence its norm(cr) is a*b. The variable k has unit type
Geom3! . We use the functions cos_from_vectors and sin_from_vectors to compute the sinus and cosinus respectively.




# ######################

Directly porting the original code leads to the following function type:

    rotation_align :: for_unit a: (a*Geom3!, 1/a*Geom3!) -> Geom3! per Geom3!;

The units a and 1/a in the argument list are not what we want, instead we want both types to be a.

We develop a series of intermediate functions to investigate the source and possible fix of this situation.
We also switch in this series of functions from a vector and angle input to a pair of vectors input.

We conclude that we need the correct representation of the unit vector to fix the units of the to be aligned vectors:

    declare rotation_align_no_acos :: for_index E: for_unit c, b, a: (a*Geom3!, b*Geom3!) -> (c*Geom3!) -> c*Geom3!;



# Rodrigues

Rodrigues' rotation formula (from https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula) that computes the rotation by using the cross and inner products leads to a unit correct function.

The function takes a vector k and an angle as inputs and returns a function that rotates a vector v by the angle:


    define rodrigues_rotation(k, angle) =
        (v) -> 
            let 
                c = cos(angle),
                s = sin(angle)
            in
                v '*.' c + cross(k, v) '*.' s + k '*' inner(k, v) '*.' (1 - c)
            end;

In pacioli the compiler derives the function type:

    declare rodrigues_rotation :: for_unit a: (Geom3!, radian) -> (a*Geom3!) -> a*Geom3!;

The unit type in the argument and result is as we expect, since the vector and the rotated vector should live in the same space.


We transform the rodrigues_rotation function to a rodrigues_align function that takes two vectors d and z that must be aligned.
The resulting function has correct unit types, but uses the trigonometric function acosinus to compute the angle from the two input vectors.

    declare rodrigues_align :: for_unit a, b, c: (a*Geom3!, b*Geom3!) -> (c*Geom3!) -> c*Geom3!;

    define rodrigues_align(d, z) =
        let
            cr = cross(z, d),
            k = cr '/.' norm(cr),
            angle = acos(inner(z, d) / (norm(z) * norm(d)))
        in
            rodrigues_rotation(k, angle)
        end;

As the vector k must be a unit vector, we compute it by dividing the cross product of z and d by its norm. Also the unit type of cr is a*Geom3! and the unit type of 
norm(cr) is a, so that k has unit type Geom3! .The angle computation by means of acosinus and inner requires that inner must be divided by both norm(z) and norm(d) so that the input type 1 to the function acosinus results. 
So we see that we can make a rotate function that aligns two vectors with correct units, if we use the trigonometric function acosinus.
