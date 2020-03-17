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

package pacioli.ast.definition;

import java.util.List;

import mvm.values.matrix.IndexSet;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.symboltable.IndexSetInfo;

public class IndexSetDefinition extends AbstractDefinition {

    public final IdentifierNode id;
    public final List<String> items;

    public IndexSetDefinition(Location location, IdentifierNode id, List<String> items) {
        super(location);
        this.id = id;
        this.items = items;
    }

    @Override
    public void addToProgr(Progam program) throws PacioliException {
        IndexSetInfo info = new IndexSetInfo(localName(), program.getModule(), true, getLocation());
        info.setDefinition(this);
        program.addInfo(info);
        
    }

    public IndexSet getIndexSet() {
        return new IndexSet(localName(), items);
    }

    @Override
    public String localName() {
        return id.getName();
    }

    @Override
    public String compileToMATLAB() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}
