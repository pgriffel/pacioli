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

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.StringNode;
import pacioli.symboltable.ValueInfo;

public class Documentation extends AbstractDefinition {

    public final IdentifierNode id;
    public ExpressionNode body;

    public Documentation(Location location, IdentifierNode id, ExpressionNode body) {
        super(location);
        this.id = id;
        this.body = body;
    }

    @Override
    public String localName() {
        return id.getName();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public Node transform(ExpressionNode body) {
        return new Documentation(getLocation(), id, body);
    }

    @Override
    public void addToProgr(Progam program) throws PacioliException {

        String name = localName();
        ValueInfo oldInfo = program.values.lookup(name);

        if (oldInfo != null) {
            // It seems we already found a definition for this name. Check that there is no
            // declaration yet and add this one.
            if (oldInfo.getDocu().isEmpty()) {
                StringNode node = (StringNode) body;
                oldInfo.setDocu(node.valueString());
            } else {
                throw new PacioliException(body.getLocation(), "Duplicate docu for %s", name);
            }
        } else {
            ValueInfo info = new ValueInfo(name, program.file, true, false, getLocation(), true);
            StringNode node = (StringNode) body;
            info.setDocu(node.valueString());
            program.values.put(name, info);
        }
    }

}