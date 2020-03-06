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

package pacioli.types.ast;

import pacioli.Location;
import pacioli.ast.Visitor;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.UnitInfo;

public class BangTypeNode extends AbstractTypeNode {

    public final TypeIdentifierNode indexSet;
    public final TypeIdentifierNode unit;
    public IndexSetInfo indexSetInfo;
    public UnitInfo unitInfo;

    public BangTypeNode(Location location, TypeIdentifierNode indexSet) {
        super(location);
        this.indexSet = indexSet;
        this.unit = null;
    }

    public BangTypeNode(Location location, TypeIdentifierNode indexSet, TypeIdentifierNode unit) {
        super(location);
        this.indexSet = indexSet;
        this.unit = unit;
        assert (unit == null || !unit.getName().contains("!"));
    }

    public String indexSetName() {
        return indexSet.getName();
    }

    public String unitVecName() {
        return unit == null ? "" : unit.getName();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
