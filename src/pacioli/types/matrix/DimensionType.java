/*
 * Copyright (c) 2013 - 2014 Paul Griffioen
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
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.Utils;
import pacioli.types.AbstractType;
import pacioli.types.PacioliType;
import pacioli.types.TypeBase;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVar;
import uom.Base;
import uom.Unit;

public class DimensionType extends AbstractType {

    private final List<TypeIdentifier> indexSets;

    public DimensionType(List<TypeIdentifier> indexSets) {
        this.indexSets = indexSets;
    }

    public DimensionType(TypeIdentifier indexSet) {
        indexSets = new ArrayList<TypeIdentifier>();
        indexSets.add(indexSet);
    }

    public DimensionType() {
        this.indexSets = new ArrayList<TypeIdentifier>();
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

    public List<TypeIdentifier> getIndexSets() {
        return indexSets;
    }

    public int width() {
        return indexSets.size();
    }

    public TypeIdentifier nthIndexSet(int n) {
        return indexSets.get(n);
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("Index(");
        String sep = "";
        for (TypeIdentifier id: indexSets) {
        	out.print(sep);
        	out.print(id.name);
        	sep = ", ";
        }
        out.print(")");
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
        List<TypeIdentifier> sets = new ArrayList<TypeIdentifier>();
        sets.addAll(indexSets);
        sets.addAll(other.indexSets);
        return new DimensionType(sets);
    }

	public PacioliType project(List<Integer> columns) {
		List<TypeIdentifier> sets = new ArrayList<TypeIdentifier>();
        for (Integer column: columns) {
        	sets.add(indexSets.get(column.intValue()));
        }
        return new DimensionType(sets);
	}

	@Override
	public String compileToJS() {
		
		 StringBuilder out = new StringBuilder();
		 
		 out.append("new Pacioli.Type('coordinates', [");
		 String pre = "";
		 for (int i = 0; i < indexSets.size(); i++) {
			 out.append(pre);
			 out.append("Pacioli.fetchIndex('");
			 out.append(indexSets.get(i).home);
			 out.append("', '");
			 out.append(indexSets.get(i).name);
			 out.append("')");
			 pre = ", ";
		 }
		 out.append("])");
		 
		 return out.toString();
	}

	@Override
	public PacioliType reduce() {
		return this;
	}
}