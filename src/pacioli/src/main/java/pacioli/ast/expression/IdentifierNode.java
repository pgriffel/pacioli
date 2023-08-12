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

package pacioli.ast.expression;

import java.util.Optional;

import pacioli.ast.Visitor;
import pacioli.misc.Location;
import pacioli.misc.PacioliException;
import pacioli.symboltable.info.ValueInfo;

public class IdentifierNode extends AbstractExpressionNode {

    public enum Kind {
        VALUE, TYPE
    };

    private final String name;
    private final Kind kind;

    // Set during resolving
    private ValueInfo info;

    private IdentifierNode(String name, Kind kind, Location location) {
        super(location);
        this.name = name;
        this.kind = kind;
    }

    public IdentifierNode(String name, Location location) {
        super(location);
        this.name = name;
        this.kind = null;
    }

    public IdentifierNode withKind(IdentifierNode id) {
        Kind kind;
        if (id.name.equals("value")) {
            kind = Kind.VALUE;
        } else if (id.name.equals("type")) {
            kind = Kind.TYPE;
        } else {
            throw new PacioliException(id.getLocation(), "Invalid qualifier: %s. Please change to 'value' or 'type'",
                    id.name);
        }
        IdentifierNode node = new IdentifierNode(this.name, kind, this.getLocation());
        node.info = this.info;
        return node;
    }

    public Optional<Kind> kind() {
        return Optional.ofNullable(this.kind);
    }

    public String getName() {
        return name;
    }

    public Boolean isResolved() {
        return this.hasInfo();
    }

    public Boolean hasInfo() {
        return this.info != null;
    }

    public ValueInfo getInfo() {
        if (this.info != null) {
            return this.info;
        } else {
            throw new RuntimeException(
                    new PacioliException(getLocation(), "Cannot get info, identifier '%s' has not been resolved.",
                            name));
        }
    }

    public void setInfo(ValueInfo info) {
        this.info = info;
    }

    public Boolean isGlobal() {
        if (info != null) {
            return info.isGlobal();
        } else {
            throw new RuntimeException(
                    new PacioliException(getLocation(), "Cannot get info, identifier '%s' has not been resolved.",
                            name));
        }
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public Kind determineKind(boolean valueExists, boolean typeExists) {

        String name = this.getName();
        Location location = this.getLocation();

        IdentifierNode.Kind kind;
        if (valueExists && typeExists && this.kind().isEmpty()) {
            throw new PacioliException(location,
                    "Ambiguous identifier. Please change to \n\n  value %s \n\nor to \n\n  type %s",
                    name, name);
        } else if (this.kind().isPresent()) {
            kind = this.kind().get();
            if (kind.equals(IdentifierNode.Kind.VALUE)) {
                if (!valueExists) {
                    throw new PacioliException(location,
                            "Identifier unknown. Name '%s' does not refer to a value.",
                            name, name);
                }
            } else {
                if (!typeExists) {
                    throw new PacioliException(location,
                            "Identifier unknown. Name '%s' does not refer to a type.",
                            name, name);
                }
            }
        } else if (valueExists) {
            kind = IdentifierNode.Kind.VALUE;
        } else if (typeExists) {
            kind = IdentifierNode.Kind.TYPE;
        } else {
            throw new PacioliException(location,
                    "Identifier unknown. Name '%s' does not refer to a value or a type.",
                    name, name);
        }
        return kind;
    }
}
