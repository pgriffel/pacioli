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
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.StringBase;

public class TypeIdentifierNode extends AbstractTypeNode {

    public final String name;

    public TypeIdentifierNode(Location location, String name) {
        super(location);
        this.name = name;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print(name);
    }

    @Override
    public PacioliType eval(Dictionary dictionary, TypeContext context, boolean reduce) throws PacioliException {
        if (context.containsTypeVar(name)) {
            return new TypeVar("for_type", name);
        } else if (context.containsUnitVar(name)) {
            return new MatrixType(new TypeVar("for_unit", name));
        } else if (context.containsIndexVar(name)) {
            return new TypeVar("for_index", name);
        } else {
            if (dictionary.containsAlias(name)) {
                return new MatrixType(dictionary.getAlias(name));
            } else {
            return new MatrixType(new StringBase(name));
            }
        }
    }

	@Override
	public String compileToJS() {
		return "scalarShape('" + name + "')";
	}
}
