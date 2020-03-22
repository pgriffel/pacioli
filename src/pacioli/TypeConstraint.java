/*
 * Copyright (c) 2013 - 2014 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pacioli;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import pacioli.types.IndexSetVar;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.Var;
import pacioli.types.VectorUnitVar;
import pacioli.types.ast.BangTypeNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;

public class TypeConstraint extends AbstractPrintable {

    private final TypeApplicationNode lhs;
    private final PacioliType rhs;

    public TypeConstraint(TypeApplicationNode lhs, PacioliType rhs) {
        this.lhs = lhs;
        this.rhs = rhs;
    }

    public PacioliType reduce(ParametricType type) throws PacioliException {
        if (lhs.getArgs().size() != type.args.size()) {
            throw new PacioliException("Type function %s expects %s arguments but found %s", type.name,
                    lhs.getArgs().size(), type.args.size());
        }
        Map<Var, Object> map = new HashMap<Var, Object>();
        for (int i = 0; i < lhs.getArgs().size(); i++) {
            TypeNode var = lhs.getArgs().get(i);
            PacioliType arg = type.args.get(i);
            if (var instanceof TypeIdentifierNode) {
                PacioliType varType = var.evalType(true);
                if (varType instanceof Var) {
                    map.put((Var) varType, arg);
                } else if (varType instanceof IndexType) {
                    if (arg instanceof IndexType) {
                        map.put((Var) ((IndexType) varType).getIndexSet(), ((IndexType) arg).getIndexSet());
                    } else {
                        throw new PacioliException(var.getLocation(),
                                "Type definitions's parameter is quantified as index, but is given '%s'", arg.pretty());
                    }
                } else if (varType instanceof MatrixType) {
                    if (arg instanceof MatrixType) {
                        map.put((Var) ((MatrixType) varType).getFactor(), ((MatrixType) arg).getFactor());
                    } else {
                        throw new PacioliException(var.getLocation(),
                                "Type definitions's parameter is quantified as unit, but is given '%s'", arg.pretty());
                    }
                } else {
                    throw new PacioliException(var.getLocation(),
                            "Type definitions's parameter should type, index or unit");
                }
            } else if (var instanceof BangTypeNode) {
                if (arg instanceof MatrixType) {
                    BangTypeNode bang = (BangTypeNode) var;
                    MatrixType argMat = (MatrixType) arg;
                    map.put(new IndexSetVar(bang.indexSetName()), argMat.rowDimension.getIndexSet());
                    map.put(new VectorUnitVar("for_unit", bang.indexSetName() + "!" + bang.unitVecName()), argMat.rowUnit);
                } else {
                    throw new PacioliException(var.getLocation(),
                            "Type definitions's parameter is quantified as unit vector, but is given '%s'",
                            arg.pretty());
                }
            } else {
                throw new PacioliException(var.getLocation(),
                        "Type definitions's parameter should be a variable or a unitvec %s");
            }
        }
        return rhs.applySubstitution(new Substitution(map)).reduce();
    }

    @Override
    public void printPretty(PrintWriter out) {
        out.format("type constraint %s = %s", lhs.pretty(), rhs.pretty());
    }
}
