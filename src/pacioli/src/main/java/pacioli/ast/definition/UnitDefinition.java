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

import java.util.Optional;

import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.compiler.Location;
import pacioli.types.type.TypeBase;
import uom.DimensionedNumber;

public class UnitDefinition extends AbstractDefinition {

    public final IdentifierNode id;
    public final String symbol;
    public final Optional<UnitNode> body;

    public UnitDefinition(Location location, IdentifierNode id, String symbol) {
        super(location);
        this.id = id;
        this.symbol = symbol;
        this.body = Optional.empty();
    }

    public UnitDefinition(Location location, IdentifierNode id, String symbol, UnitNode body) {
        super(location);
        this.id = id;
        this.symbol = symbol;
        this.body = Optional.of(body);
    }

    // Make Optional or exception!!!
    public DimensionedNumber<TypeBase> evalBody() {
        return body.isPresent() ? body.get().evalUnit() : null;
    }

    @Override
    public String name() {
        return id.name();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
