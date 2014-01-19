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

package pacioli.ast.definition;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import mvm.values.matrix.IndexSet;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.PacioliException;
import pacioli.Program;
import pacioli.Utils;
import pacioli.ast.expression.IdentifierNode;

public class IndexSetDefinition extends AbstractDefinition {

    private final IdentifierNode id;
    private final List<String> items;

    public IndexSetDefinition(Location location, IdentifierNode id, List<String> items) {
        super(location);
        this.id = id;
        this.items = items;
    }

	@Override
	public void addToProgram(Program program, PacioliFile module) {
		setModule(module);
		program.addIndexSetDefinition(this, module);
		
	}
	public String globalName() {
        return String.format("index_%s_%s", getModule().getName(), localName());
    }
	
    public IndexSet getIndexSet() {
        return new IndexSet(localName(), items);
    }

    @Override
    public void printText(PrintWriter out) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public String localName() {
        return id.getName();
    }

    @Override
    public void resolve(Dictionary dictionary) throws PacioliException {
    }

    @Override
    public Set<Definition> uses() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        String output = String.format("\nindexset \"%s\" \"%s\" list(", globalName(), localName());
        List<String> quotedItems = new ArrayList<String>();
        for (String item : items) {
            quotedItems.add(String.format("\"%s\"", item));
        }
        output += Utils.intercalate(",", quotedItems);
        output += ");";
        return output;
    }

    @Override
    public String compileToJS() {
        String output = String.format("\nfunction compute_%s () {return makeIndexSet('%s', [", 
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
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

}
