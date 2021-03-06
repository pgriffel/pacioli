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

package mvm.values;

import java.io.PrintWriter;
import java.util.List;
import mvm.Environment;
import mvm.MVMException;
import mvm.ast.expression.Expression;

public class Closure extends AbstractPacioliValue implements Callable {

    public final List<String> arguments;
    public final Expression code;
    public final Environment environment;

    public Closure(List<String> args, Expression expression, Environment env) {
        arguments = args;
        code = expression;
        environment = env;
    }

    @Override
    public PacioliValue apply(List<PacioliValue> params) throws MVMException {
        Environment frame = new Environment(arguments, params);
        return code.eval(frame.pushUnto(environment));
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("|some closure|");
    }
}
