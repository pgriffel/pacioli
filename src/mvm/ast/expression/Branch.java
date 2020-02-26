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

package mvm.ast.expression;

import java.io.PrintWriter;
import mvm.AbstractPrintable;
import mvm.Environment;
import mvm.MVMException;
import mvm.values.Boole;
import mvm.values.PacioliValue;

public class Branch extends AbstractPrintable implements Expression {

    private final Expression test;
    private final Expression positive;
    private final Expression negative;

    public Branch(Expression test, Expression pos, Expression neg) {
        this.test = test;
        this.positive = pos;
        this.negative = neg;
    }

    @Override
    public PacioliValue eval(Environment environment) throws MVMException {
        Boole outcome = (Boole) test.eval(environment);
        if (outcome.positive()) {
            return positive.eval(environment);
        } else {
            return negative.eval(environment);
        }
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("if(");
        test.printText(out);
        out.print(", ");
        positive.printText(out);
        out.print(", ");
        negative.printText(out);
        out.print(")");
    }
}
