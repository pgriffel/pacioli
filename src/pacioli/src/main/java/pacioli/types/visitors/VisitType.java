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

import pacioli.types.TypeVisitor;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.FunctionType;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.OperatorConst;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.ParametricType;
import pacioli.types.type.Quant;
import pacioli.types.type.ScalarUnitVar;
import pacioli.types.type.Schema;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypePredicate;
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;

public class VisitType implements TypeVisitor {

    public VisitType() {
    }

    @Override
    public void visit(FunctionType type) {
        type.domain().accept(this);
        type.range().accept(this);
    }

    @Override
    public void visit(Schema type) {
        type.type().accept(this);
    }

    @Override
    public void visit(IndexList type) {
    }

    @Override
    public void visit(IndexType type) {
        type.indexSet().accept(this);
    }

    @Override
    public void visit(MatrixType type) {
        // type.factor.accept(this);
        type.rowDimension().accept(this);
        // type.rowUnit.accept(this);
        type.columnDimension().accept(this);
        // type.columnUnit.accept(this);
    }

    @Override
    public void visit(IndexSetVar type) {
    }

    @Override
    public void visit(ParametricType type) {
        type.op().accept(this);
        for (TypeObject arg : type.args()) {
            arg.accept(this);
        }
    }

    @Override
    public void visit(TypeVar type) {
    }

    @Override
    public void visit(ScalarUnitVar type) {
    }

    @Override
    public void visit(VectorUnitVar type) {
    }

    @Override
    public void visit(OperatorConst operatorConst) {
    }

    @Override
    public void visit(OperatorVar operatorVar) {
    }

    @Override
    public void visit(TypePredicate typePredicate) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

    @Override
    public void visit(Quant quant) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

}
