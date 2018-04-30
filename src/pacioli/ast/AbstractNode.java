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

package pacioli.ast;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Set;

import pacioli.AbstractPrintable;
import pacioli.CompilationSettings;
import pacioli.Location;
import pacioli.Progam;
import pacioli.symboltable.SymbolInfo;
import pacioli.visitors.DesugarStatements;
import pacioli.visitors.DesugarVisitor;
import pacioli.visitors.MVMGenerator;
import pacioli.visitors.ResolveVisitor;
import pacioli.visitors.UsesVisitor;

public abstract class AbstractNode extends AbstractPrintable implements Node {

    private final Location location;

    public AbstractNode(Location location) {
        this.location = location;
    }

    @Override
    public Location getLocation() {
        return location;
    }

    public String sourceDescription() {
        if (location == null) {
            return "No source location available";
        } else {
            return location.description();
        }
    }
    
    @Override
    public Node desugar() {
    	DesugarVisitor visitor = new DesugarVisitor();
    	return visitor.nodeAccept(this);
    }
    
    @Override
    public Node desugarStatements(Progam prog) {
    	DesugarStatements visitor = new DesugarStatements(prog);
    	return visitor.nodeAccept(this);
    }
    
    @Override
    public String compileToMVM(CompilationSettings settings) {
    	StringWriter outputStream = new StringWriter();
		MVMGenerator gen = new MVMGenerator(new PrintWriter(outputStream), settings);
		this.accept(gen);
		return outputStream.toString();
    }
    

    @Override
    public void resolve(Progam prog) {
    	ResolveVisitor visitor = new ResolveVisitor(prog);
    	accept(visitor);
    }
    
    @Override
    public Set<SymbolInfo> uses() {
    	UsesVisitor visitor = new UsesVisitor();
    	Set<SymbolInfo> ids = visitor.idsAccept(this);
    	return ids;
    }
}
