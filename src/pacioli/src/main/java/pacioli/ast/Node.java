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

import java.util.HashSet;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.Printable;
import pacioli.Printer;
import pacioli.Progam;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.TypeSymbolInfo;
import pacioli.symboltable.ValueInfo;

public interface Node extends Printable {

    public Location getLocation();

    public void accept(Visitor visitor);

    public Set<SymbolInfo> uses();

    public Node desugar();

    public void resolve(Progam prog);

    public void resolve2(PacioliFile file, PacioliTable pacioliTable);

    public Node liftStatements(Progam prog);

    public String compileToMVM(CompilationSettings settings);

    public String compileToJS(CompilationSettings settings, boolean boxed);

    public void compileToJS(Printer writer, CompilationSettings settings, boolean boxed);

    public String compileToMATLAB(CompilationSettings settings);

    /**
     * For the nodes that bind variables (Let, Lambda and Statement). These
     * nodes have a symbol table.
     * 
     * @param node
     *            A Let, Lambda or Statement node
     * @param table
     *            The node's table
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

}
