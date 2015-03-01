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

package pacioli.types.ast;

import java.io.PrintWriter;
import java.util.HashSet;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.expression.IdentifierNode;
import pacioli.types.PacioliType;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVar;
import pacioli.types.matrix.BangBase;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import uom.Unit;

public class BangTypeNode extends AbstractTypeNode {

    private final TypeIdentifierNode indexSet;
    private final TypeIdentifierNode unit;

    public BangTypeNode(Location location, TypeIdentifierNode indexSet) {
        super(location);
        this.indexSet = indexSet;
        this.unit = null;
    }

    public BangTypeNode(Location location, TypeIdentifierNode indexSet, TypeIdentifierNode unit) {
        super(location);
        this.indexSet = indexSet;
        this.unit = unit;
        assert (unit == null || !unit.getName().contains("!"));
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("%s!%s", indexSet.getName(), unit == null ? "" : unit.getName());
    }

    @Override
    public PacioliType eval(boolean reduce) throws PacioliException {
    	assert(indexSet.isResolved());
    	if (unit != null) {
    		assert(unit.isResolved());
    	}
    	String indexSetName = indexSet.getName();
    	TypeIdentifier indexSetId = indexSet.typeIdentifier();
        if (unit == null) {
            if (indexSet.isVariable()) {
                return new MatrixType(new IndexType(new TypeVar("for_index", indexSetName)), Unit.ONE);
            } else  {
                return new MatrixType(new IndexType(indexSetId), Unit.ONE);
            }
        } else {
        	String unitName = unit.getName();
        	assert (!unitName.isEmpty());
            Unit rowUnit;
            if (unit.isVariable()) {
                //rowUnit = new TypeVar("for_unit", unitName);
            	rowUnit = new TypeVar("for_unit", indexSet.getName() + "!" + unitName);
            } else {
                rowUnit = new BangBase(indexSet.typeIdentifier(), unit.typeIdentifier(), 0);
            }
            if (indexSet.isVariable()) {
            	if (unit.isVariable()) {
            		return new MatrixType(new IndexType(new TypeVar("for_index", indexSetName)), rowUnit);
            	} else {
                    throw new RuntimeException(String.format("Index set '%s' is variable while unit vector '%s' is not", indexSetName, unitName));
                } 
            } else {
                return new MatrixType(new IndexType(indexSetId), rowUnit);
            }
        }
    }

	@Override
	public String compileToJS() {
		return String.format("Pacioli.bangShape('%s', '%s', '%s', '%s')", 
				indexSet.getDefinition().getModule().getName(), 
				indexSet.getName(), 
				unit == null ? "" : unit.getDefinition().getModule().getName(),
				unit == null ? "" : unit.getName());
	}
	
	@Override
	public String compileToMVM(CompilationSettings settings) {
		return String.format("bang_shape(\"%s\", \"%s\")", 
				indexSet.getDefinition().globalName(),
				unit == null ? "" : unit.getDefinition().localName());
	}

	@Override
	public Set<Definition> uses() {
		Set<Definition> set = new HashSet<Definition>();
        set.addAll(indexSet.uses());
        if (unit != null) {
        	set.addAll(unit.uses());
        }
        return set;
	}

	@Override
	public TypeNode resolved(Dictionary dictionary, TypeContext context)
			throws PacioliException {
		return new BangTypeNode(
				getLocation(), 
				indexSet.resolveAsIndex(dictionary, context),
				unit == null ? null : unit.resolveAsUnitVector(indexSet.getName(), dictionary, context));
	}
}
