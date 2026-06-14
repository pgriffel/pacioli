/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.types.ast;

import java.io.PrintWriter;
import pacioli.Pacioli;
import pacioli.compiler.PacioliException;
import pacioli.compiler.Printable;
import pacioli.types.Substitution;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.ParametricType;
import pacioli.types.type.TypeObject;
import pacioli.types.type.Var;
import pacioli.types.type.matrix.IndexType;
import pacioli.types.type.matrix.MatrixType;
import pacioli.types.type.matrix.ScalarBase;
import pacioli.types.type.matrix.VectorUnitVar;

public class TypeConstraint implements Printable {

    private final TypeApplicationNode lhs;
    private final TypeObject rhs;

    public TypeConstraint(TypeApplicationNode lhs, TypeObject rhs) {
        this.lhs = lhs;
        this.rhs = rhs;
    }

    public TypeObject reduce(ParametricType type) throws PacioliException {

        if (Pacioli.Options.showTypeReductions) {
            Pacioli.log("Reducing %s with %s and %s",
                    lhs.pretty(), rhs.pretty(), type.pretty());
        }

        if (lhs.arguments().size() != type.args().size()) {
            throw new PacioliException(type.location(), "Type function %s expects %s arguments but found %s",
                    type.name(),
                    lhs.arguments().size(), type.args().size());
        }

        var subs = new Substitution();

        for (int i = 0; i < lhs.arguments().size(); i++) {
            TypeNode var = lhs.arguments().get(i);
            TypeObject arg = type.args().get(i);
            if (var instanceof TypeIdentifierNode) {
                TypeObject varType = var.evalType();
                if (varType instanceof OperatorVar opVar) {
                    if (arg instanceof ParametricType parametricType) {
                        subs = subs.merge(new Substitution(opVar, parametricType.op()));
                    } else {
                        subs = subs.merge(new Substitution(opVar, arg));
                    }
                } else if (varType instanceof Var v) {
                    subs = subs.merge(new Substitution(v, arg));
                } else if (varType instanceof IndexType indexVar) {
                    if (arg instanceof IndexType indexType) {
                        subs = subs.merge(new Substitution((Var) indexVar.indexSet(), indexType.indexSet()));
                    } else {
                        throw new PacioliException(var.location(),
                                "Type definitions's parameter is quantified as index, but is given '%s'", arg.pretty());
                    }
                } else if (varType instanceof MatrixType matrixVar) {
                    if (arg instanceof MatrixType matrixArg) {
                        subs = subs.merge(
                                new Substitution(ScalarBase.unitAsVar(matrixVar.factor()), matrixArg.factor()));
                    } else {
                        throw new PacioliException(var.location(),
                                "Type definitions's parameter is quantified as unit, but is given '%s'", arg.pretty());
                    }
                } else {
                    throw new PacioliException(var.location(),
                            "Type definitions's parameter should type, index or unit");
                }
            } else if (var instanceof BangTypeNode bang) {
                if (arg instanceof MatrixType argMat) {
                    subs = subs.merge(
                            new Substitution(new IndexSetVar(bang.indexSetName()), argMat.rowDimension().indexSet()));
                    subs = subs.merge(new Substitution(
                            new VectorUnitVar(bang.indexSetName() + "!" + bang.unitVecName()), argMat.rowUnit()));
                } else {
                    throw new PacioliException(var.location(),
                            "Type definitions's parameter is quantified as unit vector, but is given '%s'",
                            arg.pretty());
                }
            } else {
                throw new PacioliException(var.location(),
                        "Type definitions's parameter should be a variable or a unitvec %s");
            }
        }

        if (Pacioli.Options.showTypeReductions) {
            Pacioli.log("  reduce: %s ", subs.pretty());
        }

        return rhs.applySubstitution(subs);
    }

    @Override
    public void printPretty(PrintWriter out) {
        out.format("type constraint %s = %s", lhs.pretty(), rhs.pretty());
    }
}
