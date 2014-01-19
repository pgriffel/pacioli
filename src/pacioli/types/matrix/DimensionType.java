/*
 * Copyright (c) 2013 Paul Griffioen
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

package pacioli.types.matrix;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.Utils;
import pacioli.types.AbstractType;
import pacioli.types.PacioliType;
import pacioli.types.TypeVar;
import uom.Unit;

public class DimensionType extends AbstractType {

    private final List<String> indexSets;

    public DimensionType(List<String> indexSets) {
        this.indexSets = indexSets;
    }

    public DimensionType(String indexSet) {
        indexSets = new ArrayList<String>();
        indexSets.add(indexSet);
    }

    public DimensionType() {
        this.indexSets = new ArrayList<String>();
    }

    @Override
    public int hashCode() {
        return indexSets.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof DimensionType)) {
            return false;
        }
        DimensionType otherDimension = (DimensionType) other;
        if (!indexSets.equals(otherDimension.indexSets)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return String.format("%s%s", super.toString(), indexSets);
    }

    public List<String> getIndexSets() {
        return indexSets;
    }

    public int width() {
        return indexSets.size();
    }

    public String nthIndexSet(int n) {
        return indexSets.get(n);
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("Index(");
        out.print(Utils.intercalate(", ", indexSets));
        out.print(")");
    }

    public String indexText() {
        if (indexSets.size() == 1) {
            return indexSets.get(0);
        } else {
            String out = "(";
            out += Utils.intercalate(", ", indexSets);
            out += ")";
            return out;
        }
    }

    @Override
    public Set<TypeVar> typeVars() {
        Set<TypeVar> vars = new LinkedHashSet<TypeVar>();
        return vars;

    }

    @Override
    public ConstraintSet unificationConstraints(PacioliType other) throws PacioliException {
        if (!equals(other)) {
            throw new PacioliException("Dimensions not equal.");
        } else {
            return new ConstraintSet();
        }
    }

    @Override
    public String description() {
        return "matrix dimension type";
    }

    @Override
    public List<Unit> simplificationParts() {
        List<Unit> parts = new ArrayList<Unit>();
        return parts;
    }

    @Override
    public PacioliType applySubstitution(Substitution subs) {
        return this;
    }

    DimensionType kronecker(DimensionType other) {
        List<String> sets = new ArrayList<String>();
        sets.addAll(indexSets);
        sets.addAll(other.indexSets);
        return new DimensionType(sets);
    }

	public PacioliType project(List<Integer> columns) {
		List<String> sets = new ArrayList<String>();
        for (Integer column: columns) {
        	sets.add(indexSets.get(column.intValue()));
        }
        return new DimensionType(sets);
	}
}