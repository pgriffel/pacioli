/*
 * Copyright (c) 2025 Paul Griffioen
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

package pacioli.ast.expression;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeKroneckerNode;
import pacioli.types.ast.TypeMultiplyNode;
import pacioli.types.ast.TypeNode;
import pacioli.types.ast.TypePerNode;

/**
 * Definition of the data that can be queried from a data source. It
 * defines the data's type and additionally a name for each dimension
 * in the type. These names can be used in data queries.
 */
public class DataDefinitionNode extends AbstractNode implements ExpressionNode {

    public static class Binding {

        public final IdentifierNode id;
        public final TypeNode dimType;

        public Binding(IdentifierNode id, TypeNode dimType, Location location) {
            this.id = id;
            this.dimType = dimType;
        }
    }

    public final TypeNode type;
    public final List<Binding> bindings;

    /**
     * The implicitly declared type that follows from the data definition.
     * 
     * Gets updated during resolving.
     */
    public final TypeNode declaredType;

    public DataDefinitionNode(
            Location location,
            TypeNode type,
            List<Binding> bindings) {
        super(location);
        this.type = type;
        this.bindings = bindings;
        this.declaredType = this.deriveType();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    /**
     * Derive the data definition's type by substituting the bindings into
     * the definition's type node.
     * 
     * @return The data type
     */
    private TypeNode deriveType() {
        Map<String, TypeNode> map = new HashMap<>();
        for (Binding binding : this.bindings) {
            map.put(binding.id.name(), binding.dimType);
        }
        return substitute(this.type, map);
    }

    /**
     * Checks that the type node is build from just identifiers and the %, * or per
     * operation, and substitutes all identifiers with type nodes from the map.
     * 
     * @param node The data definition's type node
     * @param map  The names to be substituted
     * @return A type node with all identifiers in the map substituted.
     */
    static private TypeNode substitute(TypeNode node, Map<String, TypeNode> map) {
        if (node instanceof TypeMultiplyNode n) {
            return n.transform(substitute(n.left, map), substitute(n.right, map));
        } else if (node instanceof TypeKroneckerNode n) {
            return n.transform(substitute(n.left, map), substitute(n.right, map));
        } else if (node instanceof TypePerNode n) {
            return n.transform(substitute(n.left, map), substitute(n.right, map));
        } else if (node instanceof TypeIdentifierNode n) {
            return map.getOrDefault(n.name(), n);
        } else {
            throw new PacioliException(node.location(), "Expected a %%, * or per operation");
        }
    }

}