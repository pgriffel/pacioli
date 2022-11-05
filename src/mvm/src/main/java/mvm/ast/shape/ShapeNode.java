package mvm.ast.shape;

import mvm.MVMException;
import mvm.Machine;
import mvm.Printable;
import mvm.values.matrix.MatrixShape;

public interface ShapeNode extends Printable {

    public MatrixShape eval(Machine machine) throws MVMException;
}
