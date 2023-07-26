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
import java.util.List;

import pacioli.ast.Visitor;
import pacioli.ast.expression.ExpressionNode;
import pacioli.misc.Location;
import pacioli.misc.PacioliException;
import pacioli.types.ast.ContextNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;

/**
 * AST node for a class instance definition.
 * 
 * The InstanceDefinition is not a Pacioli definition because it does not
 * end up in the symbol table. The name would clash with the class name.
 * Instead the instances are part of the class (and visited via the class).
 */
public class InstanceDefinition extends AbstractDefinition {

    /**
     * The type of the type instance
     */
    public final TypeApplicationNode type;

    /**
     * The quantified variables of the type instance. Possibly contain conditions.
     */
    public final List<ContextNode> contextNodes;

    /**
     * The overloaded function implementations
     */
    public final List<ValueEquation> members;

    public InstanceDefinition(
            Location location,
            TypeApplicationNode type,
            List<ContextNode> contextNodes,
            List<ValueEquation> members) {
        super(location);
        this.type = type;
        this.contextNodes = contextNodes;
        this.members = members;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String getName() {
        return type.op.getName();
    }

    public List<String> memberNames() {
        List<String> names = new ArrayList<>();
        for (ValueEquation assertion : members) {
            names.add(assertion.id.getName());
        }
        return names;
    }

    public ExpressionNode memberBody(String name) {
        for (ValueEquation assertion : members) {
            if (assertion.id.getName().equals(name)) {
                return assertion.body;
            }
        }
        throw new PacioliException(getLocation(), String.format("Instance member %s not found", name));
    }
}
