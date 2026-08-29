# Products and dimensions

# Units of Measurement in Rotaties
Een typisch voorbeeld waar units misgaan is projectie van een vector v op een rotatie 
as n. Voor projectie wordt vaak de constructie n(n·v) gebruikt. De juiste formule
voor projectie is n(n·v/n·n), maar de n·n wordt vaak weggelaten in het geval dat n een
unit vector is (je kunt dit ook zien als m/(m·m)(n·v) met n = m/(m·m) de genormaliseerde
vector). Numeriek gaat dit goed want n·n is 1, maar de units gaan nu fout.

# Aanpak
De verschillende rotatie representaties in Pacioli programmeren en vergelijken.

De geometry library ondersteunt op dit moment alleen euler rotations. De functie 
'euler_rotation' is beschikbaar en heeft type:

    euler_rotation :: (radian, radian, radian) -> Geom3! per Geom3!
De rotatie matrix die het oplevert is een dimensieloze vierkante matrix. Dit is
het juiste type aaangezien geometrische ruimtes uniforme units of measurement hebben.

Aanpak voor de andere representaties is:
 1. Alle varianten coderen zonder units te corrigeren
 2. Een testset maken zodat de numerieke juistheid van elke variant getest kan worden
 3. Pin-pointen waar de ongewenste units ontstaan.
 4. Indien mogelijk de units fixen.



## Rotations, rotors and rotees

## Introduction

Rotors are dimensionless. The main point is that a the geometry of a rotation requires a rotor and a rotee, and that the rotor must be dimensionless in order to obtain a result that has the same unit as the rotee. We show how this idea works out in different number systems and representations.

## Rotors in complex numbers

1. Basis rotations and reflections of complex numbers. 
The result must moreover equal the complex product of rotor and rotee.



## Rotation matrices
Todo.






Just as quaternions complex numbers can be seen both as numbers and as rotating operators. We call the acting rotating operator the rotor; the rotor acts upon the 'rotee'. Both can be represented as either a quaternion or a complex number. A rotation is the product of a rotor and a rotee, however for complex numbers this is a commutative operation, so rotor(rotee) = rotee(rotor).
Finding is that only a dimensionless complex number as rotor leaves the unit of measurement of the rotee invariant.
Both a complex number represented as a 2x2 matrix and a complex number represented as a quaternion in which j and k are 0 are commutative (they form a normal subgroup). Therefore no sandwich formulas are needed for rotations.





