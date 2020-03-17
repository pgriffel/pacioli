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
import pacioli.Printer;
import pacioli.Progam;
import pacioli.symboltable.SymbolInfo;
import pacioli.visitors.DesugarVisitor;
import pacioli.visitors.JSGenerator;
import pacioli.visitors.LiftStatements.Lifted;
import pacioli.visitors.MVMGenerator;
import pacioli.visitors.PrintVisitor;
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
    public void printPretty(PrintWriter out) {
        //BufferedWriter out = new BufferedWriter(new FileWriter(baseName() + ".mvm"));

        PrintWriter writer = null;
        try {
            writer = new PrintWriter(out);
            PrintVisitor visitor = new PrintVisitor(new Printer(writer));
            this.accept(visitor);
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
    }
    
    @Override
    public Node desugar() {
        return new DesugarVisitor().nodeAccept(this);
    }
    
    @Override
    public Lifted liftStatements() {
        return null;//new LiftStatements().nodeAccept(this);
    }
    
    @Override
    public String compileToMVM(CompilationSettings settings) {
        StringWriter outputStream = new StringWriter();
        accept(new MVMGenerator(new Printer(new PrintWriter(outputStream)), settings));
        return outputStream.toString();
    }
    
    @Override
    public String compileToJS(CompilationSettings settings, boolean boxed) {
        StringWriter outputStream = new StringWriter();
        
        this.accept(new JSGenerator(new Printer(new PrintWriter(outputStream)), settings, boxed));
        return outputStream.toString();
    }
    
    @Override
    public void compileToJS(Printer writer, CompilationSettings settings, boolean boxed) {
        this.accept(new JSGenerator(writer, settings, boxed));;
    }

    @Override
    public void resolve(Progam prog) {
        accept(new ResolveVisitor(prog));
    }

    @Override
    public Set<SymbolInfo> uses() {
        return new UsesVisitor().idsAccept(this);
    }
}
