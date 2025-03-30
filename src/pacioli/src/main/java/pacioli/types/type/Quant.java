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

package pacioli.types.type;

import java.util.List;

import pacioli.compiler.PacioliException;
import pacioli.types.ConstraintSet;
import pacioli.types.TypeVisitor;
import pacioli.types.ast.TypeIdentifierNode;

public class Quant implements TypeObject {

    public final TypeIdentifierNode.Kind kind;
    public final TypeIdentifier id;
    public final List<TypePredicate> conditions;

    public Quant(TypeIdentifierNode.Kind kind, TypeIdentifier id, List<TypePredicate> conditions) {
        this.kind = kind;
        this.id = id;
        this.conditions = conditions;
    }

    @Override
    public String toString() {
        return "Quant [kind=" + kind + ", id=" + id + ", conditions=" + conditions + "]";
    }

    @Override
    public String description() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'description'");
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'unificationConstraints'");
    }

}
