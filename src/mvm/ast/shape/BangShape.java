package mvm.ast.shape;

import java.io.PrintWriter;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.values.matrix.MatrixBase;
import mvm.values.matrix.MatrixDimension;
import mvm.values.matrix.MatrixShape;
import mvm.values.matrix.UnitVector;
import uom.Unit;

public class BangShape extends AbstractPrintable implements ShapeNode {

    private String entity;
    private String unit;

    public BangShape(String entity, String unit) {
        this.entity = entity;
        this.unit = unit;
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("bang_shape(%s, %s)", entity, unit);
    }

    @Override
    public MatrixShape eval(Machine machine) throws MVMException {
        MatrixShape shape;
        if (unit.isEmpty()) {
            if (!machine.indexSets.containsKey(entity)) {
                throw new MVMException("Index set '%s' unnown", entity);
            }
            shape = new MatrixShape(Unit.ONE, new MatrixDimension(machine.indexSets.get(entity)), Unit.ONE,
                    new MatrixDimension(), Unit.ONE);
        } else {
            String name = unit;
            if (!machine.unitVectors.containsKey(name)) {
                throw new MVMException("Unit vector '%s' unnown", name);
            }
            UnitVector vector = machine.unitVectors.get(name);
            shape = new MatrixShape(Unit.ONE, new MatrixDimension(vector.indexSet), new MatrixBase(vector, 0),
                    new MatrixDimension(), Unit.ONE);
        }
        return shape;
    }
}
