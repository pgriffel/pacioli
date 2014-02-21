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

import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.ast.definition.Definition;
import pacioli.types.FunctionType;
import pacioli.types.PacioliType;

public class FunctionTypeNode extends AbstractTypeNode {
    
    private final TypeNode domain;
    private final TypeNode range;

    public FunctionTypeNode(Location location, TypeNode domain, TypeNode range) {
        super(location);
        this.domain = domain;
        this.range = range;
    }

    @Override
    public void printText(PrintWriter out) {
    	domain.printText(out);
    	out.format(" -> ");
    	range.printText(out);
    }

    @Override
    public PacioliType eval(boolean reduce) throws PacioliException {
        return new FunctionType(domain.eval(reduce), range.eval(reduce));
    }

	@Override
	public Set<Definition> uses() {
		Set<Definition> set = new HashSet<Definition>();
        set.addAll(domain.uses());
        set.addAll(range.uses());
        return set;
	}

	@Override
	public TypeNode resolved(Dictionary dictionary, TypeContext context) throws PacioliException {
		return new FunctionTypeNode(
				getLocation(), 
				domain.resolved(dictionary, context), 
				range.resolved(dictionary, context));
	}
}
