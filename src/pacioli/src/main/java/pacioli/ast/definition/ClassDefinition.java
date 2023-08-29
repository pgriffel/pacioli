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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import pacioli.ast.Visitor;
import pacioli.compiler.Location;
import pacioli.types.ast.QuantNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypePredicateNode;

public class ClassDefinition extends AbstractDefinition {

    /**
     * The type of the type class
     */
    public final TypePredicateNode type;

    /**
     * The quantified variables of the typeclass. Possibly contain conditions.
     */
    public final List<QuantNode> quantNodes;

    /**
     * The overloaded function types
     */
    public final List<TypeAssertion> members;

    /**
     * SchemaNode per member. These SchemaNodes are set during resolving.
     */
    private Map<String, SchemaNode> memberSchemas;

    public ClassDefinition(
            Location location,
            TypePredicateNode type,
            List<QuantNode> quantNodes,
            List<TypeAssertion> members) {
        super(location);
        this.type = type;
        this.quantNodes = quantNodes;
        this.members = members;
        this.memberSchemas = new HashMap<>();

        // Create a schema for each overloaded function. This schema is mutated
        // during resolving.
        for (TypeAssertion assertion : members) {
            List<QuantNode> combinedquantNodes = new ArrayList<>();
            combinedquantNodes.addAll(this.quantNodesWithoutConditions());
            combinedquantNodes.addAll(assertion.quantNodes);
            this.memberSchemas.put(
                    assertion.id.name(),
                    new SchemaNode(assertion.location(), combinedquantNodes, assertion.type));
        }
    }

    @Override
    public String name() {
        return type.id.name();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public List<String> memberNames() {
        List<String> names = new ArrayList<>();
        for (TypeAssertion assertion : members) {
            names.add(assertion.id.name());
        }
        return names;
    }

    public SchemaNode memberSchemaNode(String name) {
        SchemaNode node = memberSchemas.get(name);
        if (node == null) {
            throw new RuntimeException(String.format("Class member %s not found", name));
        } else {
            return node;
        }
    }

    public List<QuantNode> quantNodesWithoutConditions() {
        List<QuantNode> stripped = new ArrayList<>();
        for (QuantNode node : this.quantNodes) {
            stripped.add(node.withoutConditions());
        }
        return stripped;
    }
}
