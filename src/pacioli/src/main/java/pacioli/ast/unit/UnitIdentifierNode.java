/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
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

package pacioli.ast.unit;

import java.util.Optional;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;
import pacioli.symboltable.info.UnitInfo;
import pacioli.types.ast.TypeIdentifierNode;

public class UnitIdentifierNode extends AbstractNode implements UnitNode {

    public final TypeIdentifierNode name;
    public final String prefix;

    public UnitInfo info;

    public UnitIdentifierNode(Location location, TypeIdentifierNode name) {
        super(location);
        this.name = name;
        this.prefix = null;
    }

    public UnitIdentifierNode(Location location, String prefix, TypeIdentifierNode name) {
        super(location);
        this.prefix = prefix;
        this.name = name;
    }

    public String name() {
        return name.name();
    }

    public Optional<String> prefix() {
        return Optional.ofNullable(prefix);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
