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

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import pacioli.symboltable.info.TypeInfo;
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
import pacioli.types.type.Var;
import pacioli.types.type.matrix.IndexList;
import pacioli.types.type.matrix.IndexType;
import pacioli.types.type.matrix.MatrixBase;
import pacioli.types.type.matrix.MatrixType;
import pacioli.types.type.matrix.ScalarUnitVar;
import pacioli.types.type.matrix.VectorUnitVar;
import uom.Unit;

public class Uses implements TypeVisitor {

    private Set<TypeInfo> infos = new HashSet<TypeInfo>();

    public Set<TypeInfo> run(TypeObject child) {
        child.accept(this);
        return infos;
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
        this.infos.addAll(type.indexSetInfos());
    }

    @Override
    public void visit(IndexType type) {
        if (type.indexSet() instanceof Var v) {
            // nasty cast
            v.info().ifPresent(i -> infos.add((TypeInfo) i));
        }
        if (type.indexSet() instanceof IndexList il) {
            il.accept(this);
        }
    }

    @Override
    public void visit(MatrixType type) {
        // TODO: finish the recurtsion. This was copied from usesVars. Must collect all
        // infos instead.

        // Set<Var> all = new LinkedHashSet<Var>();
        // all.addAll(unitVars(type.factor().map(x -> (ScalarBase) x)));
        // if (type.rowDimension().isVar() || type.rowDimension().width() > 0) {
        // all.addAll(unitVars(type.rowUnit().map(x -> (VectorBase) x)));
        // }
        // if (type.columnDimension().isVar() || type.columnDimension().width() > 0) {
        // all.addAll(unitVars(type.columnUnit().map(x -> (VectorBase) x)));
        // }
        // all.addAll(varSetAccept(type.rowDimension()));
        // all.addAll(varSetAccept(type.columnDimension()));
        // returnTypeNode(all);

        type.rowDimension().accept(this);
        type.columnDimension().accept(this);
    }

    public static Set<Var> unitVars(Unit<MatrixBase> unit) {
        Set<Var> all = new LinkedHashSet<Var>();
        for (MatrixBase base : unit.bases()) {
            if (base instanceof Var) {
                all.add((Var) base);
            }
        }
        return all;
    }

    @Override
    public void visit(IndexSetVar type) {
        type.info().ifPresent(i -> this.infos.add(i));
    }

    @Override
    public void visit(ParametricType type) {
        type.op().info().ifPresent(i -> this.infos.add(i));

        for (TypeObject arg : type.args()) {
            arg.accept(this);
        }
    }

    @Override
    public void visit(ScalarUnitVar type) {
        type.info().ifPresent(i -> this.infos.add(i));
    }

    @Override
    public void visit(TypeVar type) {
        // nasty cast
        type.info().ifPresent(i -> this.infos.add((TypeInfo) i));
    }

    @Override
    public void visit(VectorUnitVar type) {
        // nasty cast
        type.info().ifPresent(i -> this.infos.add((TypeInfo) i));
    }

    @Override
    public void visit(OperatorConst type) {
        type.info().ifPresent(i -> this.infos.add(i));
    }

    @Override
    public void visit(OperatorVar type) {
        type.info().ifPresent(i -> this.infos.add(i));
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
