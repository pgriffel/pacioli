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

import pacioli.ast.visitors.CountNodes;
import pacioli.ast.visitors.DesugarVisitor;
import pacioli.ast.visitors.JSGenerator;
import pacioli.ast.visitors.LiftStatements;
import pacioli.ast.visitors.MVMGenerator;
import pacioli.ast.visitors.MatlabGenerator;
import pacioli.ast.visitors.PrintVisitor;
import pacioli.ast.visitors.ResolveVisitor;
import pacioli.ast.visitors.RewriteOverloads;
import pacioli.ast.visitors.UsesVisitor;
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliFile;
import pacioli.compiler.Printable;
import pacioli.compiler.Printer;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.Info;
import pacioli.symboltable.info.ValueInfo;

public interface Node extends Printable {

    public Location location();

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

    default public void rewriteOverloads() {
        // return new RewriteOverloads().accept(this);
        accept(new RewriteOverloads());
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
    default public void resolve(PacioliFile file, PacioliTable environment) {
        accept(new ResolveVisitor(file, environment));
    }

    /**
     * All used identifiers. Calls the UsesVisitor. Returns the info for each
     * identifier.
     * 
     * The node must have been resolved.
     * 
     * @return The info for each used identifier
     */
    default public Set<Info> uses() {
        return new UsesVisitor().idsAccept(this);
    }

    default public Node liftStatements(PacioliFile file, PacioliTable prog, PacioliTable env) {
        return new LiftStatements(file, prog, env).nodeAccept(this);
    }

    default public <N extends Node> N liftStatements(PacioliFile file, PacioliTable program, PacioliTable env,
            Class<N> targetClass) {
        return targetClass.cast(liftStatements(file, program, env));
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
        Set<Info> uses = new HashSet<Info>();
        for (Info info : node.uses()) {
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
