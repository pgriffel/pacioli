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

package pacioli.types.matrix;

import java.util.Arrays;
import java.util.List;

import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.types.ConstraintSet;
import pacioli.types.TypeVisitor;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.TypeIdentifier;
import pacioli.types.type.TypeObject;
import pacioli.types.type.Var;

public class IndexType implements TypeObject {

    private final TypeObject indexSet;

    public IndexType(List<TypeIdentifier> indexSets, List<IndexSetInfo> indexSetInfos) {
        this.indexSet = new IndexList(indexSets, indexSetInfos);
    }

    public IndexType(TypeIdentifier indexSet, IndexSetInfo indexSetInfo) {
        this.indexSet = new IndexList(Arrays.asList(indexSet), Arrays.asList(indexSetInfo));
    }

    public IndexType() {
        this.indexSet = new IndexList();
    }

    public IndexType(IndexSetVar typeVar) {
        indexSet = typeVar;
    }

    public IndexType(TypeObject type) {
        if (!(type instanceof Var || type instanceof IndexList)) {
            throw new PacioliException(
                    String.format("Index type mixup. An index is mixed up with a %s",
                            type.description()));
        }
        indexSet = type;
    }

    public TypeObject indexSet() {
        return indexSet;
    }

    public boolean isVar() {
        return indexSet instanceof Var;
    }

    /**
     * TODO: Check: Is not always an IndexSetVar. Substitution can replace it with a
     * typevar! This happens with the delta function in the standard lib.
     */
    public Var getVar() {
        return (Var) indexSet;
    }

    public String varName() {
        return ((Var) indexSet).pretty();
    }

    public IndexList indexList() {
        if (isVar()) {
            throw new RuntimeException("Index list not available for an index variable");
        } else {
            return (IndexList) indexSet;
        }
    }

    @Override
    public String description() {
        return "index type";
    }

    @Override
    public String toString() {
        return "<idx " + indexSet.toString() + ">";
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public int hashCode() {
        return indexSet.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof IndexType)) {
            return false;
        }
        IndexType otherType = (IndexType) other;
        return indexSet.equals(otherType.indexSet);
    }

    public List<TypeIdentifier> getIndexSets() {
        if (isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return indexList().indexSets();
        }
    }

    public int width() {
        if (isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return indexList().width();
        }
    }

    public TypeIdentifier nthIndexSet(int n) {
        if (isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return indexList().nthIndexSet(n);
        }
    }

    public IndexSetInfo nthIndexSetInfo(int n) {
        if (isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return indexList().nthIndexSetInfo(n);
        }
    }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        IndexType otherType = (IndexType) other;
        ConstraintSet constraints = new ConstraintSet();
        constraints.addConstraint(indexSet, otherType.indexSet, "Index Set must be equal");
        return constraints;
    }

    public IndexType kronecker(IndexType other) {
        if (isVar() || other.isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return new IndexType(indexList().kronecker(other.indexList()));
        }
    }

    public IndexType project(List<Integer> columns) {
        if (isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return new IndexType(indexList().project(columns));
        }
    }

}
