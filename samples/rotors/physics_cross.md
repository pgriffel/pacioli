
## The unit-aware cross product in Pacioli
The cross product can be characterised as a not closed operation:

    cross: V(a) x V(b) -> V(ab)

Pacioli defines the cross product as:

    declare cross ::
        for_unit a,b: (a*Geom3!, b*Geom3!) -> a*b*Geom3!;

Example use cases in physics modelling are:

declare torque ::
    (metre*Geom3!, newton*Geom3!) -> metre*newton*Geom3!;

define torque(position, force) = 
    cross(position, force);

declare angular_momentum ::
    (metre*Geom3!, kilo:gram*metre/second*Geom3!) -> kilo:gram*metre^2/second*Geom3!;

define angular_momentum(position, linear_momentum) = 
    cross(position, linear_momentum);