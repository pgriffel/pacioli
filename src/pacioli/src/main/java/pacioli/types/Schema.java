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

package pacioli.types;

import java.util.List;
import java.util.Set;

import pacioli.compiler.PacioliException;
import pacioli.types.ast.ContextNode;

public class Schema extends AbstractType {

    private final List<ContextNode> contextNodes;
    private final Set<Var> variables;
    private final TypeObject type;

    public Schema(Set<Var> context, TypeObject type, List<ContextNode> contextNodes) {
        this.variables = context;
        this.type = type;
        this.contextNodes = contextNodes;
    }

    @Override
    public String description() {
        return "schema";
    }

    @Override
    public String toString() {
        return String.format("<Schema %s %s>", variables, type);
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }

    public List<ContextNode> contextNodes() {
        return contextNodes;
    }

    public Set<Var> variables() {
        return variables;
    }

    public TypeObject type() {
        return type;
    }

    @Override
    public TypeObject instantiate() {
        Substitution map = new Substitution();
        for (Var var : variables) {
            map = map.compose(new Substitution(var, var.fresh()));
        }
        return type.applySubstitution(map);
    }

    @Override
    public Schema generalize() {
        throw new RuntimeException("Cannot generalize a schema");
    }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

}
