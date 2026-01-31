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

import java.util.List;

import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.ClassInfo;
import pacioli.types.ConstraintSet;
import pacioli.types.TypeVisitor;

public class TypePredicate implements TypeObject {

    private final ClassInfo classInfo;
    private final List<TypeObject> args;

    public TypePredicate(ClassInfo classInfo, List<TypeObject> args) {
        this.classInfo = classInfo;
        this.args = args;
    }

    @Override
    public String toString() {
        return "TypePredicate [classInfo=" + classInfo + ", args=" + args + "]";
    }

    @Override
    public String description() {
        return "type predicate";
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

    public String id() {
        return this.classInfo.name();
    }

    public List<TypeObject> arguments() {
        return this.args;
    }

}
