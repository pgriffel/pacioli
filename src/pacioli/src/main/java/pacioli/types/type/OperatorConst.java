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

package pacioli.types.type;

import java.util.Optional;

import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.types.ConstraintSet;
import pacioli.types.TypeVisitor;

// Const
public final class OperatorConst implements Operator {

    private final TypeIdentifier id;
    private final ParametricInfo info;

    public OperatorConst(TypeIdentifier id, ParametricInfo info) {
        this.id = id;
        this.info = info;
    }

    @Override
    public String description() {
        return "type operator";
    }

    @Override
    public String toString() {
        return String.format("<Op %s>", id);
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String name() {
        return id.name();
    }

    @Override
    public Optional<ParametricInfo> info() {
        return Optional.ofNullable(this.info);
    }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        if (!id.name().equals(((OperatorConst) other).id.name())) {
            throw new PacioliException("Type operators '%s and '%s' differ", this.pretty(),
                    other.pretty());
        }
        ConstraintSet constraints = new ConstraintSet();
        // constraints.addConstraint(id, ((OperatorConst) other).id,
        // String.format("Function range's type must match"));
        return constraints;
    }
}
