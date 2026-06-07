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
import pacioli.types.type.FunctionType;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.OperatorConst;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.ParametricType;
import pacioli.types.type.Quant;
import pacioli.types.type.Schema;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypePredicate;
import pacioli.types.type.TypeVar;
import pacioli.types.type.UnitVar;
import pacioli.types.type.Var;
import pacioli.types.type.matrix.IndexList;
import pacioli.types.type.matrix.IndexType;
import pacioli.types.type.matrix.MatrixBase;
import pacioli.types.type.matrix.MatrixType;
import pacioli.types.type.matrix.ScalarBase;
import pacioli.types.type.matrix.ScalarUnitVar;
import pacioli.types.type.matrix.VectorBase;
import pacioli.types.type.matrix.VectorUnitVar;
import uom.Unit;

public class SimplificationParts implements TypeVisitor {

    private Stack<List<Unit<MatrixBase>>> nodeStack = new Stack<List<Unit<MatrixBase>>>();

    public List<Unit<MatrixBase>> partsAccept(TypeObject child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return nodeStack.pop();
    }

    public void returnParts(List<Unit<MatrixBase>> value) {
        // Pacioli.logln("return: %s", value.getClass());
        nodeStack.push(value);
    }

    @Override
    public void visit(FunctionType type) {
        List<Unit<MatrixBase>> all = new ArrayList<Unit<MatrixBase>>();
        all.addAll(partsAccept(type.domain()));
        all.addAll(partsAccept(type.range()));
        returnParts(all);
    }

    @Override
    public void visit(Schema type) {
        List<Unit<MatrixBase>> freeVars2 = new ArrayList<>();
        // List<Var> freeVars = new ArrayList<>(type.type.typeVars());
        for (Var var : type.type().typeVars()) {
            UnitVar unitVar = (UnitVar) var;
            if (!type.variables().contains(unitVar)) {
                freeVars2.add(Unit.from(unitVar));
            }
        }
        // freeVars.removeAll(type.variables);
        returnParts(freeVars2);
    }

    @Override
    public void visit(IndexList type) {
        returnParts(new ArrayList<Unit<MatrixBase>>());
    }

    @Override
    public void visit(IndexType type) {
        returnParts(partsAccept(type.indexSet()));
    }

    @Override
    public void visit(MatrixType type) {
        List<Unit<MatrixBase>> parts = new ArrayList<Unit<MatrixBase>>();
        parts.add(type.factor().map(x -> (ScalarBase) x));
        if (type.rowDimension().isVar() || type.rowDimension().width() > 0) {
            parts.add(type.rowUnit().map(x -> (VectorBase) x));
        }
        if (type.columnDimension().isVar() || type.columnDimension().width() > 0) {
            parts.add(type.columnUnit().map(x -> (VectorBase) x));
        }
        returnParts(parts);
    }

    public static List<Unit<MatrixBase>> unitVars(Unit<MatrixBase> unit) {
        List<Unit<MatrixBase>> all = new ArrayList<Unit<MatrixBase>>();
        for (MatrixBase base : unit.bases()) {
            if (base instanceof UnitVar var) {
                all.add(Unit.from(var));
            }
        }
        return all;
    }

    @Override
    public void visit(IndexSetVar type) {
        returnParts(new ArrayList<Unit<MatrixBase>>());
    }

    @Override
    public void visit(ParametricType type) {
        List<Unit<MatrixBase>> all = new ArrayList<Unit<MatrixBase>>();
        for (TypeObject arg : type.args()) {
            all.addAll(partsAccept(arg));
        }
        returnParts(all);
    }

    @Override
    public void visit(ScalarUnitVar type) {
        returnParts(new ArrayList<Unit<MatrixBase>>());
    }

    @Override
    public void visit(TypeVar type) {
        returnParts(new ArrayList<Unit<MatrixBase>>());
    }

    @Override
    public void visit(VectorUnitVar type) {
        returnParts(new ArrayList<Unit<MatrixBase>>());
    }

    @Override
    public void visit(OperatorConst operatorConst) {
        returnParts(new ArrayList<Unit<MatrixBase>>());
    }

    @Override
    public void visit(OperatorVar operatorVar) {
        returnParts(new ArrayList<Unit<MatrixBase>>());
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
