/*
 * Copyright 2026 Paul Griffioen
 */
package pacioli.types.visitors;

import pacioli.types.type.IndexSetVar;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.TypeVar;
import pacioli.types.type.TypeObject;
import pacioli.types.type.Var;
import pacioli.types.type.matrix.IndexType;
import pacioli.types.type.matrix.MatrixBase;
import pacioli.types.type.matrix.MatrixType;
import pacioli.types.type.matrix.ScalarUnitVar;
import pacioli.types.type.matrix.VectorUnitVar;
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
        Unit<MatrixBase> factor = type.factor();
        Unit<MatrixBase> newFactor = factor.flatMap(base -> {
            if (base instanceof Var var) {
                return Unit.from((MatrixBase) var.setGround(true));
            } else if (base instanceof Unit) {
                return (Unit<MatrixBase>) base;
            } else {
                return Unit.from((MatrixBase) base);
            }
        });

        Unit<MatrixBase> rowUnit = type.rowUnit().flatMap(base -> {
            if (base instanceof Var var) {
                return Unit.from((MatrixBase) var.setGround(true));
            } else if (base instanceof Unit) {
                return (Unit<MatrixBase>) base;
            } else {
                return Unit.from((MatrixBase) base);
            }
        });

        Unit<MatrixBase> columnUnit = type.columnUnit().flatMap(base -> {
            if (base instanceof Var var) {
                return Unit.from((MatrixBase) var.setGround(true));
            } else if (base instanceof Unit) {
                return (Unit<MatrixBase>) base;
            } else {
                return Unit.from((MatrixBase) base);
            }
        });

        TypeObject rowDim = typeNodeAccept(type.rowDimension());
        TypeObject colDim = typeNodeAccept(type.columnDimension());

        returnTypeNode(new MatrixType(newFactor, (IndexType) rowDim, rowUnit, (IndexType) colDim, columnUnit));
    }

}
