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

package pacioli.types.ast;

import java.io.PrintWriter;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.types.PacioliType;
import pacioli.types.TypeVar;
import pacioli.types.matrix.BangBase;
import pacioli.types.matrix.DimensionType;
import pacioli.types.matrix.MatrixType;
import uom.Unit;

public class BangTypeNode extends AbstractTypeNode {

    public String indexSetName;
    public String unitName;

    public BangTypeNode(Location location, String indexSetName) {
        super(location);
        this.indexSetName = indexSetName;
        unitName = "";

    }

    public BangTypeNode(Location location, String indexSetName, String unitName) {
        super(location);
        this.indexSetName = indexSetName;
        this.unitName = unitName;

    }

    @Override
    public void printText(PrintWriter out) {
        out.format("%s!%s", indexSetName, unitName);
    }

    @Override
    public PacioliType eval(Dictionary dictionary, TypeContext context, boolean reduce) throws PacioliException {
        if (unitName.isEmpty()) {
            if (context.containsIndexVar(indexSetName)) {
                return new MatrixType(new TypeVar("for_index", indexSetName), Unit.ONE);
            } else if (dictionary.containsIndexSetDefinition(indexSetName)) {
                return new MatrixType(new DimensionType(indexSetName), Unit.ONE);
            } else {
                throw new PacioliException(getLocation(), "Index set '%s' unknown", indexSetName);
            }
        } else {
            Unit un;
            if (context.containsUnitVar(unitName)) {
                un = new TypeVar("for_unit", unitName);
            } else {
                // todo: check voor unitName aan TypeContext toevoegen
                un = new BangBase(indexSetName, unitName, 0);
            }
            assert (!unitName.isEmpty());
            if (context.containsIndexVar(indexSetName) && !unitName.isEmpty() && !context.containsUnitVar(unitName)) {
                throw new PacioliException(getLocation(), "Index set '%s' is variable while unit vector '%s' is not", indexSetName, unitName);
            }
            if (context.containsIndexVar(indexSetName)) {
                return new MatrixType(new TypeVar("for_index", indexSetName), un);
            } else if (dictionary.containsIndexSetDefinition(indexSetName)) {
                return new MatrixType(new DimensionType(indexSetName), un);
            } else {
                throw new PacioliException(getLocation(), "Index set '%s' unknown", indexSetName);
            }
        }
    }
}
