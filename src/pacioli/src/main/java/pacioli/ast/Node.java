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
import java.util.HashSet;
import java.util.Set;

import pacioli.misc.CompilationSettings;
import pacioli.misc.Location;
import pacioli.misc.PacioliFile;
import pacioli.misc.Printable;
import pacioli.misc.Printer;
import pacioli.misc.Progam;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.ValueInfo;
import pacioli.visitors.CountNodes;
import pacioli.visitors.DesugarVisitor;
import pacioli.visitors.JSGenerator;
import pacioli.visitors.LiftStatements;
import pacioli.visitors.MVMGenerator;
import pacioli.visitors.MatlabGenerator;
import pacioli.visitors.PrintVisitor;
import pacioli.visitors.ResolveVisitor;
import pacioli.visitors.UsesVisitor;

public interface Node extends Printable {

    public Location getLocation();

    public void accept(Visitor visitor);

    /**
     * Prints a nice human readable representation of the node to the given
     * writer. Calls the PrintVisitor.
     */
    default public void printPretty(PrintWriter out) {
        this.accept(new PrintVisitor(new Printer(out)));
    };

    /**
     * Desugars a node by calling the DesugarVisitor.
     * 
     * @return A copy of node with all syntactice sugar replaced
     */
    default public Node desugar() {
        return new DesugarVisitor().nodeAccept(this);
    }

    /**
     * Resolves all identifiers in a node by calling the ResolveVisitor. Resolving
     * means attaching the right SymbolInfo to each identifier.
     * 
     * TODO: is the file needed?
     * 
     * @param file         The file from which the node was loaded.
     * @param pacioliTable A table with the available identifiers to match each
     *                     identifiers againts
     */
    default public void resolve(PacioliFile file, PacioliTable pacioliTable) {
        accept(new ResolveVisitor(file, pacioliTable));
    }

    /**
     * All used identifiers. Calls the UsesVisitor. Returns the info for each
     * identifier.
     * 
     * The node must have been resolved.
     * 
     * @return The info for each used identifier
     */
    default public Set<SymbolInfo> uses() {
        return new UsesVisitor().idsAccept(this);
    }

    default public Node liftStatements(Progam prog, PacioliTable pacioliTable) {
        return new LiftStatements(prog, pacioliTable).nodeAccept(this);
    }

    default public String compileToMVM(CompilationSettings settings) {
        StringWriter outputStream = new StringWriter();
        accept(new MVMGenerator(new Printer(new PrintWriter(outputStream)), settings));
        return outputStream.toString();
    }

    default public String compileToJS(CompilationSettings settings, boolean boxed) {
        StringWriter outputStream = new StringWriter();
        this.accept(new JSGenerator(new Printer(new PrintWriter(outputStream)), settings, boxed));
        return outputStream.toString();
    }

    default public void compileToJS(Printer writer, CompilationSettings settings, boolean boxed) {
        this.accept(new JSGenerator(writer, settings, boxed));
    }

    default public String compileToMATLAB(CompilationSettings settings) {
        StringWriter outputStream = new StringWriter();
        this.accept(new MatlabGenerator(new Printer(new PrintWriter(outputStream)), settings));
        return outputStream.toString();
    }

    /**
     * For the nodes that bind variables (Let, Lambda and Statement). These
     * nodes have a symbol table.
     * 
     * @param node
     *              A Let, Lambda or Statement node
     * @param table
     *              The node's table
     * @return The free variables in the node's body (vars bound by the
     *         node are not in the result, only vars bound higher up that
     *         are not global and are used in the body).
     */
    static public Set<ValueInfo> freeVars(Node node, SymbolTable<ValueInfo> table) {

        // Determine the used local ids
        Set<SymbolInfo> uses = new HashSet<SymbolInfo>();
        for (SymbolInfo info : node.uses()) {
            if (!info.isGlobal()) {
                uses.add(info);
            }
        }

        // Determine the ids in scope that are used
        Set<ValueInfo> localsInScope = new HashSet<ValueInfo>();
        for (ValueInfo info : table.parent.allInfos()) {
            // if (!info.isGlobal() && uses.contains(info)) {
            if (!info.isGlobal()) {
                localsInScope.add(info);
            }
        }

        return localsInScope;
    }

    default public int countNodes() {
        return new CountNodes().accept(this);
    }
}
