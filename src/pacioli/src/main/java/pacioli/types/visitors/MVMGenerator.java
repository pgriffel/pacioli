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

import pacioli.compiler.CompilationSettings;
import pacioli.compiler.Printer;
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
import pacioli.types.type.TypeBase;
import pacioli.types.type.TypePredicate;
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;

public class MVMGenerator implements TypeVisitor {

    Printer out;
    private CompilationSettings settings;

    public MVMGenerator(Printer out, CompilationSettings settings) {
        this.out = out;
        this.settings = settings;
    }

    @Override
    public void visit(FunctionType type) {
        throw new UnsupportedOperationException("can only compile matrix types to MVM at the moment");
    }

    @Override
    public void visit(Schema type) {
        type.type().accept(this);
    }

    @Override
    public void visit(IndexList type) {
        throw new UnsupportedOperationException("can only compile matrix types to MVM at the moment");
    }

    @Override
    public void visit(IndexType type) {
        type.indexSet().accept(this);
    }

    @Override
    public void visit(MatrixType type) {

        // UNITTODO

        String factorString = TypeBase.compileUnitToMVM(type.factor(), settings);
        String left = type.asMVMDimensionUnitPair(type.rowDimension(), type.rowUnit(), settings);
        String right = type.asMVMDimensionUnitPair(type.columnDimension(), type.columnUnit(), settings);

        boolean hasFactor = !factorString.isEmpty();
        boolean hasLeft = !left.isEmpty();
        boolean hasRight = !right.isEmpty();

        if (hasFactor && hasLeft && hasRight) {
            out.format("shape_binop(\"multiply\", %s, shape_binop(\"per\", %s, %s))", factorString, left, right);
        } else if (hasFactor && hasLeft) {
            out.format("shape_binop(\"multiply\", %s, %s)", factorString, left);
        } else if (hasFactor && hasRight) {
            out.format("shape_binop(\"multiply\", %s, %s)", factorString, right);
        } else if (hasFactor) {
            out.format("%s", factorString);
        } else if (hasLeft && hasRight) {
            out.format("shape_binop(\"per\", %s, %s)", left, right);
        } else if (hasLeft) {
            out.format("%s", left);
        } else if (hasRight) {
            out.format("shape_binop(\"per\", scalar_shape(unit(\"\")), %s)", right);
        } else {
            out.write("scalar_shape(unit(\"\"))");
        }
    }

    @Override
    public void visit(IndexSetVar type) {
        out.write("'_" + type.pretty() + "_'");
    }

    @Override
    public void visit(ParametricType type) {
        throw new UnsupportedOperationException("can only compile matrix types to MVM at the moment");
    }

    @Override
    public void visit(ScalarUnitVar type) {
        throw new UnsupportedOperationException("Is this used");
        // out.write(type.asJS());
    }

    @Override
    public void visit(TypeVar type) {
        throw new UnsupportedOperationException("can only compile matrix types to MVM at the moment");
    }

    @Override
    public void visit(VectorUnitVar type) {
        throw new UnsupportedOperationException("Is this used");
        // out.write(type.asJS());
    }

    @Override
    public void visit(OperatorConst operatorConst) {
        throw new UnsupportedOperationException("can only compile matrix types to MVM at the moment");
    }

    @Override
    public void visit(OperatorVar operatorVar) {
        throw new UnsupportedOperationException("can only compile matrix types to MVM at the moment");
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
