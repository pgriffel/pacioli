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

package pacioli;

import java.io.PrintWriter;
import pacioli.types.PacioliType;

public class Typing extends AbstractPrintable {

    private final PacioliType type;
    private final ConstraintSet constraints;
    
    public Typing(PacioliType type) {
        this.type = type;
        this.constraints = new  ConstraintSet();
    }

    public void addConstraint(PacioliType lhs, PacioliType rhs, String text) {
        constraints.addConstraint(lhs, rhs, text);
    }

    public void addConstraints(Typing other) {
        constraints.addConstraints(other.constraints);
    }

    public PacioliType getType() {
        return type;
    }
    
    @Override
    public void printText(PrintWriter out) {
        type.printText(out);
        out.print(" with\n");
        constraints.printText(out);
    }

    public PacioliType solve() throws PacioliException {
        return constraints.solve().apply(type);
    }
}
