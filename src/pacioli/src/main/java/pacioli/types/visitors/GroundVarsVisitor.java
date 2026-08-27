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
import pacioli.types.type.matrix.MatrixType;
import pacioli.types.type.matrix.ScalarBase;
import pacioli.types.type.matrix.ScalarUnitVar;
import pacioli.types.type.matrix.VectorBase;
import pacioli.types.type.matrix.VectorUnitVar;
import uom.Unit;

/**
 * Visitor that returns a copy of a TypeObject with all variables marked as
 * grounded (immutable copy via Var.setGround(this.grounded)).
 */
public class GroundVarsVisitor extends TransformType {

    private final boolean grounded;

    public GroundVarsVisitor(boolean grounded) {
        this.grounded = grounded;
    }

    @Override
    public void visit(IndexSetVar type) {
        IndexSetVar v = type.setGround(this.grounded);
        returnTypeNode(v);
    }

    @Override
    public void visit(TypeVar type) {
        TypeVar v = type.setGround(this.grounded);
        returnTypeNode(v);
    }

    @Override
    public void visit(ScalarUnitVar type) {
        Var v = ((Var) type).setGround(this.grounded);
        returnTypeNode((TypeObject) v);
    }

    @Override
    public void visit(VectorUnitVar type) {
        Var v = ((Var) type).setGround(this.grounded);
        returnTypeNode((TypeObject) v);
    }

    @Override
    public void visit(OperatorVar type) {
        Var v = ((Var) type).setGround(this.grounded);
        returnTypeNode((TypeObject) v);
    }

    @Override
    public void visit(MatrixType type) {
        // Map units so that any unit base Var becomes grounded
        Unit<ScalarBase> factor = type.factor();

        Unit<ScalarBase> newFactor = factor.map(base -> {
            if (base instanceof Var var) {
                return (ScalarBase) var.setGround(this.grounded);
            } else {
                return base;
            }
        });

        Unit<VectorBase> rowUnit = type.rowUnit().flatMap(base -> {
            if (base instanceof Var var) {
                return Unit.from((VectorBase) var.setGround(this.grounded));
            } else {
                return Unit.from((VectorBase) base);
            }
        });

        Unit<VectorBase> columnUnit = type.columnUnit().flatMap(base -> {
            if (base instanceof Var var) {
                return Unit.from((VectorBase) var.setGround(this.grounded));
            } else {
                return Unit.from((VectorBase) base);
            }
        });

        TypeObject rowDim = typeNodeAccept(type.rowDimension());
        TypeObject colDim = typeNodeAccept(type.columnDimension());

        returnTypeNode(new MatrixType(newFactor, (IndexType) rowDim, rowUnit, (IndexType) colDim, columnUnit));
    }

}
