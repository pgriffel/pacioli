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

package pacioli.types.visitors;

import pacioli.types.Substitution;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.ParametricType;
import pacioli.types.type.ScalarUnitVar;
import pacioli.types.type.Schema;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;

public class SubstituteVisitor extends TransformType {

    private Substitution substitution;

    public SubstituteVisitor(Substitution substitution) {
        this.substitution = substitution;
    }

    @Override
    public void visit(Schema type) {
        Substitution reduced = new Substitution(substitution);
        reduced.removeAll(type.variables());
        returnTypeNode(new Schema(type.variables(), type.applySubstitution(reduced), type.conditions()));
    }

    @Override
    public void visit(MatrixType type) {
        returnTypeNode(
                new MatrixType(
                        substitution.apply(type.factor()),
                        (IndexType) typeNodeAccept(type.rowDimension()),
                        substitution.apply(type.rowUnit()),
                        (IndexType) typeNodeAccept(type.columnDimension()),
                        substitution.apply(type.columnUnit())));
    }

    @Override
    public void visit(IndexSetVar type) {
        returnTypeNode(substitution.apply((TypeObject) type));
    }

    @Override
    public void visit(TypeVar type) {
        returnTypeNode(substitution.apply((TypeObject) type));
    }

    @Override
    public void visit(OperatorVar type) {
        TypeObject substituted = substitution.apply((TypeObject) type);
        if (substituted instanceof ParametricType) {
            returnTypeNode(substitution.apply((TypeObject) type));
        } else {
            returnTypeNode(substituted);
        }
    }

    @Override
    public void visit(ScalarUnitVar type) {
        returnTypeNode(substitution.apply((TypeObject) type));
    }

    @Override
    public void visit(VectorUnitVar type) {
        returnTypeNode(substitution.apply((TypeObject) type));
    }

}
