## The possible unit-aware cross product definitions

Gibbs defines the cross product - that is also named skew product and vector product - as follows:

[Gibbs, "Vector analysis", a text-book for the use of students of mathematics and physics, founded upon the lectures of J. Willard Gibbs]; 1929,
New Haven: Yale University Press

"Definition: The skew product of the vector A into the vector B is the vector quantity C whose direction is the normal upon that side of the plane of A and B on which rotation from A to B through an angle of less than one hundred and eighty degrees appears positive or counter clockwise ; and whose magnitude is obtained by multiplying the product of the magnitudes of A and B by the sine of the angle from A to B." (p61)

====
How to compute the perpendicular?
Wolfram: the normal of the plane f = ax + by + cz + d = 0 is (a b c)^T = ai + bj + ck.
Stel d=1
Snijpunten met x, y, z as: (-1/a, 0, 0), (0, -1/b, 0), (0, 0, -1/c).
Vectoren zijn z-x en z-y, dus (1/a, 0, -1/c) en (0, 1/b, -1/c), ofwel 1/a*i -1/c*k en 1/b*j-1/c*k.
This plane has vectors (-1/a 0 1/c)^T and (0 -1/b 1/c)^T.
The cross product of these is (1/bc 1/ac 1/ab)^T, ofwel 1/bc*jk + 1/ac*ik + 1/ab*ij = 1/bc*i + 1/ac*j + 1/ab*k.
In de laatste stap worden de units van jk, ik en ij weggepoetst, en bijven de units van i,j en k over.
(1/bc 1/ac 1/ab)^T . abc = (a b c)^T
The perpendicular moet een constante x het cross product zijn en in dezelfde richting liggen als het cross product.
Bijvoorbeeld (a b c)^T wanneer het cross product met de scalar abc is vermenigvuldigd is.
Als de vectoren z-x rn x-y in meters zijn dan zijn 1/a, 1/b en 1/c in meter. De factor abc is dan meter^-3 en
het resultaat is in meter^-1.
Echter de normaal (a b c)^T zou in dezelfde ruimte moeten liggen dus in meter moeten zijn.

Conclusie is dat de normaal berekening met het cross product geen goede units oplevert.
