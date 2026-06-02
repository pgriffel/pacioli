/*
 * Copyright 2026 Paul Griffioen
 */
package pacioli.types.visitors;

import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.ScalarUnitVar;
import pacioli.types.matrix.TypeBase;
import pacioli.types.matrix.VectorUnitVar;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.TypeVar;
import pacioli.types.type.TypeObject;
import pacioli.types.type.Var;
import uom.Unit;

/**
 * Visitor that returns a copy of a TypeObject with all variables marked as
 * grounded (immutable copy via Var.setGround(true)).
 */
public class GroundVarsVisitor extends TransformType {

    @Override
    public void visit(IndexSetVar type) {
        Var v = type.setGround(true);
        returnTypeNode((TypeObject) v);
    }

    @Override
    public void visit(TypeVar type) {
        Var v = ((Var) type).setGround(true);
        returnTypeNode((TypeObject) v);
    }

    @Override
    public void visit(ScalarUnitVar type) {
        Var v = ((Var) type).setGround(true);
        returnTypeNode((TypeObject) v);
    }

    @Override
    public void visit(VectorUnitVar type) {
        Var v = ((Var) type).setGround(true);
        returnTypeNode((TypeObject) v);
    }

    @Override
    public void visit(OperatorVar type) {
        Var v = ((Var) type).setGround(true);
        returnTypeNode((TypeObject) v);
    }

    @Override
    public void visit(MatrixType type) {
        // Map units so that any unit base Var becomes grounded
        Unit<TypeBase> factor = type.factor();
        Unit<TypeBase> newFactor = factor.flatMap(base -> {
            if (base instanceof Var var) {
                return Unit.from((TypeBase) var.setGround(true));
            } else if (base instanceof Unit) {
                return (Unit<TypeBase>) base;
            } else {
                return Unit.from((TypeBase) base);
            }
        });

        Unit<TypeBase> rowUnit = type.rowUnit().flatMap(base -> {
            if (base instanceof Var var) {
                return Unit.from((TypeBase) var.setGround(true));
            } else if (base instanceof Unit) {
                return (Unit<TypeBase>) base;
            } else {
                return Unit.from((TypeBase) base);
            }
        });

        Unit<TypeBase> columnUnit = type.columnUnit().flatMap(base -> {
            if (base instanceof Var var) {
                return Unit.from((TypeBase) var.setGround(true));
            } else if (base instanceof Unit) {
                return (Unit<TypeBase>) base;
            } else {
                return Unit.from((TypeBase) base);
            }
        });

        TypeObject rowDim = typeNodeAccept(type.rowDimension());
        TypeObject colDim = typeNodeAccept(type.columnDimension());

        returnTypeNode(new MatrixType(newFactor, (IndexType) rowDim, rowUnit, (IndexType) colDim, columnUnit));
    }

}
