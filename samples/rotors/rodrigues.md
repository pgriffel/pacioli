# Iquileslez' blog
The blog https://iquilezles.org/articles/noacos/ explains that trigonometric functions can be removed from computations, and moreover
that the use of these functions is unnecessary and ugly. The dot and cross products encode all information we need for orientation related
operations. The trigonometric function acosinus can be avoided, and the same goes for angles in general.
He rewrites a function to align two vectors that returns a 3d matrix. In stead of a radian input the input consists of two vectors that
must be aligned. After that he removes the acosinus step from the computation.
The resulting 3d matrix essentially is a rotor.

We implement his approach and functions in Pacioli to see how this transates to a unit-aware version of these functions.
This leads to three functions which are named after the blogpost name.

The straighforward approach leads to the following function type:

    rotation_align :: for_unit a: (a*Geom3!, 1/a*Geom3!) -> Geom3! per Geom3!;

The units a and 1/a in the argument list are not what we want, instead we want both types to be a.

We develop a series of intermediate functions to investigate the source and possible fix of this situation.

Also we switch in this series of functions from a vector and angle input to a pair of vectors input.

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


## The resulting 3d matrix essentially is a rotor
@@@ Uitleg rotor dimensionless @@@


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



@@@ Hier verder gaan in het verhaal - moet dit stuk voor de Rodrigues functions ?? @@@

<kernzin>
The rotation_align_iquilezles1 function takes a vector and an angle as input and returns a rotor (matrix). As expected both inputs and outputs are dimensionless.
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



The rotation_align_iquilezles2 
In this step we rewrite the function to a variant that takes two input vectors that must be aligned instead of a vector and a radian.
We introduce a problem in the unit types a and 1/a of the input vectors. Also we use both acosinus, cosinus and sinus in the computation.

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

The function definition deviates from the original in the use of the function cos_from_vectors, we do not need a 'clamp' function.

Note that the input unit types are a and 1/a - these types are derived from the way the computation is set up. The function cross has as function type

    declare cross :: for_unit a, b: (a*Geom3!, b*Geom3!) -> a*b*Geom3!;

and the variable k must have unit type 1 because its 3d values k_x, k_y and k_z are multiplied and summed in the matrix3d computation and are therefore
forced to have unit 1. Because of the cross function type input parameters z and d must have reciprocal unit types a and 1/a.


In this step we seek to fix the input units a and 1/a and to remove use of the acosinus function.
There is a difference in the use of normalized(cross...) and dividing cross by the norm. This is caused by the function types of cross and norm

    declare norm :: for_index P: for_unit a: (a*P!) -> a;

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

    declare sin_from_vectors :: for_unit a, b: (a*Geom3!, b*Geom3!) -> 1;

    define sin_from_vectors(a, b) =
        norm(cross(a, b)) / (norm(a) * norm(b));
        
(For cos_from_vectors, see above.)



