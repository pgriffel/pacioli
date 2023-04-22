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

import java.util.List;

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.symboltable.VectorBaseInfo;
import pacioli.types.ast.TypeIdentifierNode;

public class UnitVectorDefinition extends AbstractDefinition {

    public final TypeIdentifierNode indexSetNode;
    public final TypeIdentifierNode unitNode;
    public final List<UnitDecl> items;

    public static class UnitDecl {

        public IdentifierNode key;
        public UnitNode value;

        public UnitDecl(IdentifierNode key, UnitNode value) {
            this.key = key;
            this.value = value;
        }
    }

    public UnitVectorDefinition(Location location, TypeIdentifierNode indexSet, TypeIdentifierNode unit,
            List<UnitDecl> items) {
        super(location);
        this.indexSetNode = indexSet;
        this.unitNode = unit;
        this.items = items;
    }

    @Override
    public String localName() {
        return indexSetNode.getName() + "!" + unitNode.getName();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void addToProgr(Progam program) throws PacioliException {
        VectorBaseInfo info = new VectorBaseInfo(localName(), program.file, program.getModule(), true, getLocation());
        info.setDefinition(this);
        info.setItems(items);
        program.addInfo(info);
    }

}
