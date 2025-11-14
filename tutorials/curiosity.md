---
title: Matrix Tutorial
---

# Matrix Tutorial

An introduction to matrices in Pacioli

---

This tutorial demonstrates Pacioli's matrix features with some
simplistic calculations on the resource consumption of NASA's mars
rover Curiosity using dimensioned vector spaces for the rover's
actions and for its resources.

Create a module "Curiosity" and define two index sets

    defindex Action = {picture, sample, travel, laser};

    defindex Resource = {power, communication, time};

To keep the model small, the actions are limited to taking a picture,
taking a soil sample, traveling or firing the laser. This is not an
accurate model of Curiosity!

Now we can define the spaces. In this case the index sets and the
units are known at compile time, so we can define the spaces
directly. Before we do that we define the individual units that are
used throughout the tutorial:

    defunit sol "sol";
    defunit hour "hour" = 3600*second;
    defunit joule "J";
    defunit watt "W" = joule/second;
    defunit bit "b";
    defunit byte "B" = 8*bit;
    defunit workhour "workhour";
    defunit image "img";
    defunit sample "smpl";
    defunit shot "shot";

Define a dimensioned vector space for actions as follows.

    defunit Action!unit = {
        picture: image,
        sample: sample,
        travel: metre,
        laser: shot
    };

Traveling is measured in meters, the other actions are dimensionless.

For resources we define two spaces. One for the units in which the
actions are planned, and one for the system's units.

    defunit Resource!plan_unit = {
        power: watt*hour,
        communication: mega:bit,
        time: hour
    };

    defunit Resource!operating_unit = {
        power: joule,
        communication: byte,
        time: second
    };

With these dimensioned vector spaces defined we can define vectors and
matrices from these spaces.

The first matrix we define is the capacity vector. The numbers are
from [MSL Science Corner][scicorner].

    defmatrix capacity :: Resource!plan_unit/sol = {
        power -> 250,
        communication -> 250,
        time -> 6
    };

If you add a line `capacity;` to the script and run it you should see
output like

    Resource             Value
    --------------------------
    power            250.00000 hour*W/sol
    communication    250.00000 Mb/sol
    time               6.00000 hour/sol

This is the capacity vector in the proper units of measurement.

Next we define a matrix for resource consumption. This is a real
matrix in the sense that it is a linear transformation. It transforms
vectors from an action to a resource space.

A matrix that transforms vectors from the `Q!v` space to the `P!u` has
type `P!u per Q!v`. Define the consumption matrix as follows.

    defmatrix consumption :: Resource!operating_unit per Action!unit = {
        power, sample -> 2700000,
        power, laser -> 2520,
        power, travel -> 5000,
        communication, picture -> 150000,
        communication, sample -> 30000000,
        communication, laser -> 200000,
        time, sample -> 64800,
        time, laser -> 360,
        time, travel -> 120
    };

The numbers are roughly guessed from the [ChemCam fact
sheet][ChemCam_Fact_Sheet], the [Curiosity wiki][curiosity_wiki],
[NASA's raw images website][nasa_raw], and the [The Sample Analysis at
Mars Investigation and Instrument Suite
documentation][SAM_Mahaffy]. If you print the matrix it looks like:

    Resource, Action                      Value
    -------------------------------------------
    power, sample                 2700000.00000 J/smpl
    power, travel                    5000.00000 J/m
    power, laser                     2520.00000 J/shot
    communication, picture         150000.00000 B/img
    communication, sample        30000000.00000 B/smpl
    communication, laser           200000.00000 B/shot
    time, sample                    64800.00000 s/smpl
    time, travel                      120.00000 s/m
    time, laser                       360.00000 s/shot

Every combination of resource and action is in the proper unit.

The last matrix we define is the scientific plan. Define the plan as
follows.

    defmatrix plan :: Action!unit = {
        picture -> 30,
        travel -> 25,
        laser -> 10
    };

We plan to take thirty pictures, travel twenty-five meters, and fire
the laser ten times.

[scicorner]: http://msl-scicorner.jpl.nasa.gov/scienceplanning/
[ChemCam_Fact_Sheet]: http://www.psrd.hawaii.edu/Oct06/ChemCam_Fact_Sheet.pdf
[curiosity_wiki]: http://en.wikipedia.org/wiki/Curiosity_(rover)
[SAM_Mahaffy]: http://www-personal.umich.edu/~atreya/Articles/SAM_Mahaffy_2012.pdf
[nasa_raw]: http://mars.jpl.nasa.gov/msl/multimedia/raw/

## Conversion Matrices

With the available data we can compute how much resources the plan
uses.

    define usage = consumption '*' plan;

The `'*'` operator is the matrix product. The value of `usage` is

    Resource                Value
    -----------------------------
    power            150200.00000 J
    communication   6500000.00000 B
    time               6600.00000 s

The numbers are correct, but we would like to see them in plan
units. If we infer the types we see resource usage is in operating
unit.

    usage :: Resource!operating_unit

The consumption matrix transformed the `Action!unit` vector into a
`Resource!operating_unit` vector.

To convert from `Resource!operating_unit` to `Resource!plan_unit` we
can create a conversion matrix as follows:

    defconv conv :: Resource!plan_unit per Resource!operating_unit;

The defined matrix `conv` contains the proper conversion factors to
perform the desired transformation. We can get the resource usage in
plan units by

    define conv_usage = conv '*' usage;

It results in

    Resource             Value
    --------------------------
    power             41.72222 hour*W
    communication     52.00000 Mb
    time               1.83333 hour

This is the same resource usage, but now in plan units.

A different way to look at it is that the total transformation is
`conv '*' consumption`.

    define conv_consumption = conv '*' consumption;

It is the composition of the conversion and the consumption
matrix. The type of this matrix is

    conv_consumption :: Resource!plan_unit per Action!unit

It makes the total transformation from action units to
resource plan units in one step. The matrix is:

    Resource, Action                      Value
    -------------------------------------------
    power, sample                     750.00000 hour*W/smpl
    power, travel                       1.38889 hour*W/m
    power, laser                        0.70000 hour*W/shot
    communication, picture              1.20000 Mb/img
    communication, sample             240.00000 Mb/smpl
    communication, laser                1.60000 Mb/shot
    time, sample                       18.00000 hour/smpl
    time, travel                        0.03333 hour/m
    time, laser                         0.10000 hour/shot

## Scalar Unit Factors

Now that we can convert between the different resource spaces we can
compare the capacity with the plan. The difference between the
capacity and value `conv_usage` from the previous section is the
remaining resources. The converted usage and the capacity are both in
plan units so they should be comparable. However, the following fails:

    capacity - conv_usage;

It correctly complains that the capacity is per sol and that the usage
isn't.

    During inference at line 94

    capacity - conv_usage;
    ^^^^^^^^^^^^^^^^^^^^^
    the infered type must match known types:

    (Resource!plan_unit/sol, Resource!plan_unit) -> a
     =
    (a*D!b per E!c, a*D!b per E!c) -> a*D!b per E!c


    Function domain's types must match:

    Tuple(Resource!plan_unit/sol, Resource!plan_unit)
     =
    Tuple(a*D!b per E!c, a*D!b per E!c)


    Tuple arugment 2 must match:

    Resource!plan_unit
     =
    Resource!plan_unit/sol


    Cannot unify units 1 and 1/sol

The type of the usage is `Resource!plan_unit` while the capacity
vector has type `Resource!plan_unit/sol`. The capacity needs to be
scaled by a number of sols to get to total plan units. The following
definition computes the remaining capacity:

    define remaining_capacity = capacity '*.' |sol| - conv_usage;

The value is

    Resource             Value
    --------------------------
    power            208.27778 hour*W
    communication    198.00000 Mb
    time               4.16667 hour

Unit factors like `|sol|` can usually be moved around easily in
expressions. For instance, the following matrix types are all
equivalent

    a*(P!u per Q!v) = (a*P!u) per Q!v = P!u per (Q!v/a) = (P!u per Q!v)*a

Note how the factor's reciprocal appears when it is moved to the
co-variant column dimension.

## The Dimensional Inverse

The reverse conversion from plan units to operating units requires the
dimensional inverse of the conversion matrix. The dimensional inverse
operator makes a conversion go in the opposite direction. For example
to convert the capacity from plan units to operating units would
require a `Resource!operating_unit per Resource!plan_unit` matrix. We
could define such a conversion, but it is just the inverse of matrix
`conv`. We can convert the capacity vector with the dimensional
inverse operator as follows:

    conv^D '*' capacity;

It gives the capacity in operating units

    Resource                 Value
    ------------------------------
    power             900000.00000 J/sol
    communication   31250000.00000 B/sol
    time               21600.00000 s/sol

The dimensional inverse swaps the row and column dimension, but also
takes the reciprocal. It has property `x^D = x^R^T = x^T^R`. The
combination of the transpose and the reciprocal is exactly what is
needed to invert a conversion matrix.

The dimensional inverse together with the transpose and the reciprocal
form a strongly connected triple of functions. They have very useful
properties in the context of dimensioned vector spaces. For example
`x^D^D = x`, just as with transposes and reciprocals. Also the earlier
`x^D = x^R^T` is true for any permutation of `D`, `R` and `T`.

Say we are interested in the work time for the Curiosity operators and
we have the following (completely made up) productivity numbers:

    defmatrix productivity :: Resource!operating_unit/workhour = {
        power -> 10000,
        communication -> 500000,
        time -> 1000
    };

For the purpose of illustration let's assume the work is linearly
related to these imaginary productivity numbers. First we take the
reciprocal

    define worktime = productivity^R;

It has the desired unit `workhour/Resource!operating_unit` and value

    Resource             Value
    --------------------------
    power              0.00010 workhour/J
    communication      0.00000 workhour/B
    time               0.00100 workhour/s

We can multiply it with the usage to get the amount of work for a plan

    usage * worktime;

The value is

    Resource             Value
    --------------------------
    power             15.02000 workhour
    communication     13.00000 workhour
    time               6.60000 workhour

Or we can get take the inner product

    inner(usage, worktime);

to get total

    34.62000workhour

To see how many work is required to operate Curiosity at full capacity compute

    define conv_capacity = conv^D '*' capacity;

    worktime * conv_capacity;

It gives

    Resource             Value
    --------------------------
    power             90.00000 workhour/sol
    communication     62.50000 workhour/sol
    time              21.60000 workhour/sol

This used the conversed capacity. We can also convert the worktime
from operating units to plan units.

    conv^R '*' worktime;

This conversion requires the reciprocal. It gives

    Resource             Value
    --------------------------
    power              0.36000 workhour/hour/W
    communication      0.25000 workhour/Mb
    time               3.60000 workhour/hour

The following equivalent formulations to compute the total worktime at
full capacity may help explain the reciprocal.

    inner(worktime, conv_capacity);
    worktime^T '*' conv_capacity;
    worktime^T '*' conv^D '*' capacity;
    (worktime^T '*' conv^D)^T^T '*' capacity;
    (conv^D^T '*' worktime^T^T)^T '*' capacity;
    (conv^R '*' worktime)^T '*' capacity;
    inner(conv^R '*' worktime, capacity);

All lines give the total value `174.100000workhour/sol`.
