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

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;
import java.util.function.Function;

import pacioli.Pacioli;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.ParametricInfo;
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

public class ReduceTypes implements TypeVisitor {

    private Stack<TypeObject> nodeStack = new Stack<TypeObject>();
    Function<? super ParametricInfo, ? extends Boolean> reduceCallback;

    public ReduceTypes(Function<? super ParametricInfo, ? extends Boolean> reduceCallback) {
        this.reduceCallback = reduceCallback;
    }

    public TypeObject typeNodeAccept(TypeObject child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return nodeStack.pop();
    }

    public void returnTypeNode(TypeObject value) {
        // Pacioli.logln("return: %s", value.getClass());
        nodeStack.push(value);
    }

    @Override
    public void visit(FunctionType type) {
        TypeObject domainType = typeNodeAccept(type.domain());
        TypeObject rangeType = typeNodeAccept(type.range());
        returnTypeNode(new FunctionType(domainType, rangeType));
    }

    @Override
    public void visit(Schema type) {
        returnTypeNode(new Schema(type.variables(), typeNodeAccept(type.type()), type.conditions()));
    }

    @Override
    public void visit(IndexList type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(IndexType type) {
        returnTypeNode(typeNodeAccept(type.indexSet()));
    }

    @Override
    public void visit(MatrixType type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(IndexSetVar type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(ParametricType type) {
        List<TypeObject> items = new ArrayList<TypeObject>();
        for (TypeObject arg : type.args()) {
            items.add(typeNodeAccept(arg));
        }
        try {
            ParametricType opType = new ParametricType(type.location(), type.definition().orElse(null), type.op(),
                    items); // TODO: check orElse
            boolean reduce = type.definition().isPresent() && reduceCallback.apply(type.op().info().get());

            if (!reduce) {
                returnTypeNode(opType);
            } else {
                TypeObject reduced = type.definition().get().constaint().reduce(opType).reduce(reduceCallback);

                if (Pacioli.Options.showTypeReductions) {
                    Pacioli.log("Reduced %s to %s", type.pretty(), reduced.pretty());
                }

                returnTypeNode(type.definition().get().constaint().reduce(opType).reduce(reduceCallback));
            }
        } catch (PacioliException e) {
            throw new RuntimeException("Type error", e);
        }
    }

    @Override
    public void visit(ScalarUnitVar type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(TypeVar type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(VectorUnitVar type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(OperatorConst type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(OperatorVar type) {
        returnTypeNode(type);
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
