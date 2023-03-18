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
import pacioli.ast.expression.LambdaNode;
import pacioli.symboltable.ValueInfo;

public class ValueDefinition extends AbstractDefinition {

    public final IdentifierNode id;
    public ExpressionNode body;

    public ValueDefinition(Location location, IdentifierNode id, ExpressionNode body) {
        super(location);
        this.id = id;
        this.body = body;
    }

    public Node transform(ExpressionNode body) {
        return new ValueDefinition(getLocation(), id, body);
    }

    public boolean isFunction() {
        return (body instanceof LambdaNode);
    }

    @Override
    public String localName() {
        return id.getName();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void addToProgr(Progam program, boolean fromProgram) throws PacioliException {

        String name = localName();
        
        ValueInfo info = new ValueInfo(name, program.getModule(), true, false, getLocation(), fromProgram);
        info.setDefinition(this);
        
        ValueInfo oldInfo = program.values.lookup(name);
        if (oldInfo != null) {
            info = oldInfo.includeOther(info);
        }
            
        program.values.put(name, info);
    }

}
