/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
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

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.Location;
import pacioli.types.ast.TypeNode;

public class MultiDeclaration extends AbstractNode implements Definition {

    public final List<IdentifierNode> ids;
    public final TypeNode node;

    public MultiDeclaration(Location location, List<IdentifierNode> ids, TypeNode node) {
        super(location);
        this.ids = ids;
        this.node = node;
    }

    @Override
    public String name() {
        throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
    }
}
