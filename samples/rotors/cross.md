
## The possible unit-aware cross product definitions

Gibbs defines the cross product - that is also named skew product and vector product - as follows:

[Gibbs, "Vector analysis", a text-book for the use of students of mathematics and physics, founded upon the lectures of J. Willard Gibbs]; 1929, 
    New Haven: Yale University Press

"Definition: The skew product of the vector A into the vector B is the vector quantity C whose direction is the normal upon that side of the plane of A and B on which rotation from A to B through an angle of less than one hundred and eighty degrees appears positive or counter clockwise ; and whose magnitude is obtained by multiplying the product of the magnitudes of A and B by the sine of the angle from A to B." (p61)

"The vector product is by definition

C = A x B = A B sin (A,B)c, (9)

when A and B are the magnitudes of A and B respectively and where c is a unit vector in the direction of C." (p62)

@@@ TODO: definitie uit wikipedia overnemen.

There are two ways to construct the unit type:
1) the unit vector is dimensionless
2) the unit vector carries the unit.

Let a and b be the units of A and B, and c the unit of C
In the first case, multiplication of the magnitude of A x B yields as unit type: (a, b) -> ab.
In the second case the unit vector c leads to an additional unit: (a, b) -> abc.

Alternative computation according to Gibbs:
let  v=v1i+v2j+v3k and w=w1i+w2j+w3k where i, j, k are unit vectors:
v×w=(v2w3−v3w2)i+(v3w1−v1w3)j+(v1w2−v2w1)k

1) If i, j, k are dimensionless then v1,v2,v3 and w1,w2,w3 carry a unit.
The resulting unit type is: (a, b) -> ab.

2) If i, j, k carry dimension c then v1,v2,v3 and w1,w2,w3 are dimensionless.
The resulting unit type is: (c, c) -> c.

Some observations:
in case the unit vector is dimensionless we obtain the same unit type of the cross product when comparing both formulas, (a,b) -> ab.
in case the unit vector carries a unit however we obtain different unit types when comparing both formulas, (a,b) -> abc versus (c,c) -> c.
the unit type (a,b) -> abc introduces c where c is a function from a and b; c = f(a,b). Here there are multiple possibilities:
- a=b=c is we assume a homogeneous space. In this case the resulting unit type is (c,c) -> c^3
- (a,b) -> ab. In this case the resulting unit type is (a,b) -> a^2b^2
- (a,b) -> 1. In this case the resulting unit type is (a,b) -> ab.
- a=b and c=1/a. In this case the resulting unit type is (a,a) -> a. Only in this case we obtain the same unit types.

The formulas ixj=k, jxk=i and kxi=j lead to the conclusion that we can only have dimensionless unit vectors.
Therefore we are in situation 1 and the resulting unit type is (a,b) -> ab.

The dimensionless unit vectors i,j,k form an orthonormal basis in a dimensionless vector space.

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

