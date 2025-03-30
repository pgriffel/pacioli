/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
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

package pacioli.types.visitors;

import pacioli.compiler.Bundle;
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
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypePredicate;
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;

public class JSGenerator implements TypeVisitor {

    Printer out;

    public JSGenerator(Printer out) {
        this.out = out;
    }

    @Override
    public void visit(FunctionType type) {
        out.write("new Pacioli.FunctionType(");
        type.domain().accept(this);
        out.write(", ");
        type.range().accept(this);
        out.write(")");
    }

    @Override
    public void visit(Schema type) {
        type.type().accept(this);
    }

    @Override
    public void visit(IndexList type) {
        out.write("new Pacioli.IndexType([");
        String pre = "";
        for (int i = 0; i < type.indexSets().size(); i++) {
            out.write(pre);
            // out.write("Pacioli.fetchIndex('");
            out.write("'");
            out.write(type.indexSets().get(i).home());
            out.write("_");
            out.write(type.indexSets().get(i).name());
            // out.write("')");
            out.write("'");
            pre = ", ";
        }
        out.write("])");
    }

    @Override
    public void visit(IndexType type) {
        type.indexSet().accept(this);
    }

    @Override
    public void visit(MatrixType type) {

        out.write("Pacioli.createMatrixType(");
        out.write(TypeBase.compileUnitToJS(type.factor()));
        out.write(", ");
        // out.write(type.rowDimension.compileToJS());
        type.rowDimension().accept(this);
        // if (!type.rowDimension.isVar()) out.write(".param");
        out.write(", ");
        if (type.rowDimension().isVar() || type.rowDimension().width() > 0) {
            out.write(TypeBase.compileUnitToJS(type.rowUnit()));
        } else {
            out.write("Pacioli.ONE");
        }
        out.write(", ");
        // out.write(type.columnDimension.compileToJS());
        type.columnDimension().accept(this);
        // if (!type.columnDimension.isVar()) out.write(".param");
        out.write(", ");
        if (type.columnDimension().isVar() || type.columnDimension().width() > 0) {
            out.write(TypeBase.compileUnitToJS(type.columnUnit()));
        } else {
            out.write("Pacioli.ONE");
        }
        out.write(")");
    }

    @Override
    public void visit(IndexSetVar type) {
        out.write("'_" + type.pretty() + "_'");
    }

    @Override
    public void visit(ParametricType type) {
        String name = type.name();
        if (Bundle.PRIMITIVE_TYPES.contains(name)) {
            out.write("new Pacioli.GenericType(");
            out.write("\"" + name + "\", [");
            String sep = "";
            for (TypeObject arg : type.args()) {
                out.write(sep);
                arg.accept(this);
                sep = ", ";
            }
            out.write("])");
        } else {
            throw new RuntimeException("Parametric Type " + name + " unknown");
        }
    }

    @Override
    public void visit(ScalarUnitVar type) {
        out.write(type.asJS());
    }

    @Override
    public void visit(TypeVar type) {
        // out.write(type.asJS());
        out.write("Pacioli.typeFromVarName('_" + type.pretty() + "_')");
    }

    @Override
    public void visit(VectorUnitVar type) {
        out.write(type.asJS());
    }

    @Override
    public void visit(OperatorConst operatorConst) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

    @Override
    public void visit(OperatorVar operatorVar) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
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
