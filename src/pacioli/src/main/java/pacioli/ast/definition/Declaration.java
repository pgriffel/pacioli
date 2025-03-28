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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.compiler.Location;
import pacioli.types.ast.TypeNode;

public class Declaration extends AbstractNode implements Definition {

    public final IdentifierNode id;
    public final TypeNode typeNode;

    private final List<IdentifierNode> arguments; // can be null

    public Declaration(Location location, IdentifierNode id, TypeNode typeNode) {
        super(location);
        this.id = id;
        this.typeNode = typeNode;
        this.arguments = null;
    }

    public Declaration(Location location, IdentifierNode id, TypeNode typeNode, List<IdentifierNode> arguments) {
        super(location);
        this.id = id;
        this.typeNode = typeNode;
        this.arguments = arguments;
    }

    public Declaration transform(TypeNode node) {
        return new Declaration(location(), id, node, this.arguments);
    }

    @Override
    public String name() {
        return id.name();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public boolean isPrimitive() {
        return this.arguments == null;
    }

    public Optional<List<String>> arguments() {
        return Optional.ofNullable(this.arguments).map(args -> {
            List<String> arguments = new ArrayList<>();
            for (IdentifierNode arg : args) {
                arguments.add(arg.name());
            }
            return arguments;
        });
    }
}
