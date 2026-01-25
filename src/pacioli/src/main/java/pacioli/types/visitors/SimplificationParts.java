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
import pacioli.types.type.UnitVar;
import pacioli.types.type.Var;
import pacioli.types.type.VectorUnitVar;
import uom.Unit;

public class SimplificationParts implements TypeVisitor {

    private Stack<List<Unit<TypeBase>>> nodeStack = new Stack<List<Unit<TypeBase>>>();

    public List<Unit<TypeBase>> partsAccept(TypeObject child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return nodeStack.pop();
    }

    public void returnParts(List<Unit<TypeBase>> value) {
        // Pacioli.logln("return: %s", value.getClass());
        nodeStack.push(value);
    }

    @Override
    public void visit(FunctionType type) {
        List<Unit<TypeBase>> all = new ArrayList<Unit<TypeBase>>();
        all.addAll(partsAccept(type.domain()));
        all.addAll(partsAccept(type.range()));
        returnParts(all);
    }

    @Override
    public void visit(Schema type) {
        List<Unit<TypeBase>> freeVars2 = new ArrayList<>();
        // List<Var> freeVars = new ArrayList<>(type.type.typeVars());
        for (Var var : type.type().typeVars()) {
            UnitVar unitVar = (UnitVar) var;
            if (!type.variables().contains(unitVar)) {
                freeVars2.add(unitVar);
            }
        }
        // freeVars.removeAll(type.variables);
        returnParts(freeVars2);
    }

    @Override
    public void visit(IndexList type) {
        returnParts(new ArrayList<Unit<TypeBase>>());
    }

    @Override
    public void visit(IndexType type) {
        returnParts(partsAccept(type.indexSet()));
    }

    @Override
    public void visit(MatrixType type) {
        List<Unit<TypeBase>> parts = new ArrayList<Unit<TypeBase>>();
        parts.add(type.factor());
        if (type.rowDimension().isVar() || type.rowDimension().width() > 0) {
            parts.add(type.rowUnit());
        }
        if (type.columnDimension().isVar() || type.columnDimension().width() > 0) {
            parts.add(type.columnUnit());
        }
        returnParts(parts);
    }

    public static List<Unit<TypeBase>> unitVars(Unit<TypeBase> unit) {
        List<Unit<TypeBase>> all = new ArrayList<Unit<TypeBase>>();
        for (TypeBase base : unit.bases()) {
            if (base instanceof UnitVar) {
                all.add((UnitVar) base);
            }
        }
        return all;
    }

    @Override
    public void visit(IndexSetVar type) {
        returnParts(new ArrayList<Unit<TypeBase>>());
    }

    @Override
    public void visit(ParametricType type) {
        List<Unit<TypeBase>> all = new ArrayList<Unit<TypeBase>>();
        for (TypeObject arg : type.args()) {
            all.addAll(partsAccept(arg));
        }
        returnParts(all);
    }

    @Override
    public void visit(ScalarUnitVar type) {
        returnParts(new ArrayList<Unit<TypeBase>>());
    }

    @Override
    public void visit(TypeVar type) {
        returnParts(new ArrayList<Unit<TypeBase>>());
    }

    @Override
    public void visit(VectorUnitVar type) {
        returnParts(new ArrayList<Unit<TypeBase>>());
    }

    @Override
    public void visit(OperatorConst operatorConst) {
        returnParts(new ArrayList<Unit<TypeBase>>());
    }

    @Override
    public void visit(OperatorVar operatorVar) {
        returnParts(new ArrayList<Unit<TypeBase>>());
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
