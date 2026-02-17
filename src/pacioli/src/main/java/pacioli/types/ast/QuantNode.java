/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.types.ast;

import java.util.ArrayList;
import java.util.List;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class QuantNode extends AbstractNode implements TypeNode {

    public final TypeIdentifierNode.Kind kind;
    public final List<TypeIdentifierNode> ids;
    public final List<TypePredicateNode> conditions;

    public QuantNode(
            Location location,
            TypeIdentifierNode.Kind kind,
            List<TypeIdentifierNode> ids,
            List<TypePredicateNode> conditions) {
        super(location);
        this.kind = kind;
        this.ids = ids;
        this.conditions = conditions;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.accept(this);
    }

    public QuantNode withoutConditions() {
        return new QuantNode(location(), this.kind, this.ids, new ArrayList<>());
    }
}
