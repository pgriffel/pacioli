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

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import mvm.values.matrix.IndexSet;
import pacioli.Location;
import pacioli.Progam;
import pacioli.Utils;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.symboltable.GenericInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.types.TypeIdentifier;

public class IndexSetDefinition extends AbstractDefinition {

    public final IdentifierNode id;
    public final List<String> items;

    public IndexSetDefinition(Location location, IdentifierNode id, List<String> items) {
        super(location);
        this.id = id;
        this.items = items;
    }

    @Override
    public void addToProgr(Progam program, GenericInfo generic) {
        IndexSetInfo info = program.ensureIndexSetRecord(id.getName());
        info.generic = generic;
        info.definition = this;
    }

    public String globalName() {
        return String.format("index_%s_%s", getModule().getName(), localName());
    }

    public IndexSet getIndexSet() {
        return new IndexSet(localName(), items);
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("todo: indexSetDefinition");
    }

    @Override
    public String localName() {
        return id.getName();
    }

    public TypeIdentifier typeIdentifier() {
        return new TypeIdentifier(getModule().getName(), id.getName());
    }

    @Override
    public String compileToJS(boolean boxed) {
        String output = String.format("\nPacioli.compute_%s = function () {return Pacioli.makeIndexSet('%s', [",
                globalName(), localName());
        List<String> quotedItems = new ArrayList<String>();
        for (String item : items) {
            quotedItems.add(String.format("\"%s\"", item));
        }
        output += Utils.intercalate(",", quotedItems);
        output += "])}\n";
        return output;
    }

    @Override
    public String compileToMATLAB() {
        throw new UnsupportedOperationException("Not supported yet."); // To change body of generated methods, choose
                                                                       // Tools | Templates.
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}
