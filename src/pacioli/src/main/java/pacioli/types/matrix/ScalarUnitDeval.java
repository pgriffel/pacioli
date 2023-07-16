// package pacioli.types.matrix;

// import pacioli.Location;
// import pacioli.types.ScalarUnitVar;
// import pacioli.types.TypeBase;
// import pacioli.types.ast.NumberTypeNode;
// import pacioli.types.ast.TypeDivideNode;
// import pacioli.types.ast.TypeIdentifierNode;
// import pacioli.types.ast.TypeMultiplyNode;
// import pacioli.types.ast.TypeNode;
// import pacioli.types.ast.TypePowerNode;
// import uom.Fraction;
// import uom.UnitFold;

// public class ScalarUnitDeval implements UnitFold<TypeBase, TypeNode> {

// Location location;

// public ScalarUnitDeval(Location location) {
// this.location = location;
// }

// @Override
// public TypeNode map(TypeBase base) {
// assert(base instanceof ScalarBase || base instanceof ScalarUnitVar);
// if (base instanceof ScalarUnitVar) {
// ScalarUnitVar var = (ScalarUnitVar) base;
// return new TypeIdentifierNode(location, var.pretty());
// } else {
// ScalarBase scalarBase = (ScalarBase) base;
// return new TypeIdentifierNode(location, scalarBase.pretty());
// }
// }

// @Override
// public TypeNode mult(TypeNode x, TypeNode y) {
// // Copied from VectorUnitDeval
// if (y instanceof TypePowerNode) {
// TypePowerNode right = (TypePowerNode) y;
// Fraction power = new Fraction(Integer.parseInt(right.power.number));
// if (power.intValue() < 0) {
// return new TypeDivideNode(x.getLocation().join(y.getLocation()), x,
// new TypePowerNode(right.getLocation(), right.base, new
// NumberTypeNode(right.getLocation(),
// power.negate().toString())));
// }
// }
// return new TypeMultiplyNode(x.getLocation().join(y.getLocation()), x, y);
// }

// @Override
// public TypeNode expt(TypeNode x, Fraction n) {
// return new TypePowerNode(x.getLocation(), x, new
// NumberTypeNode(x.getLocation(), n.toString()));
// }

// @Override
// public TypeNode one() {
// return new NumberTypeNode(location, "1");
// }
// }