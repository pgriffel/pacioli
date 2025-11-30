# Linear algebra decompositions

Linear algebra decompositions based on the NIST JAMA library.

These implementations give better results than the implementations from the 'numeric' NPM package.

## Decompositions

The linear-algebra directory contains TypeScript implementations of the following common linear algebra decompositions that are available in Pacioli.

- Singular value decomposition
- PLU decomposition
- QR decomposition
- Eigen value decomposition
- Cholesky decomposition

## Origin

The code is ported from Javascript versions of the original JAMA Java implementations. The Javascript was translated from Java with JSweet. As source the 'jama' NPM package was used. The Javascript code is kept in comments in the Typescript file.

## Porting

Porting was basically three steps:

- Turn the code into a class
- Add private class members and add type declarations
- Apply utility functions like zeroMatrix and copyMatrix where applicable
