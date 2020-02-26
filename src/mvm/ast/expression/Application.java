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
import java.util.ArrayList;
import java.util.List;
import mvm.AbstractPrintable;
import mvm.Environment;
import mvm.MVMException;
import mvm.Machine;
import mvm.values.Callable;
import mvm.values.PacioliValue;

public class Application extends AbstractPrintable implements Expression {

    private final Expression function;
    private final List<Expression> arguments;

    public Application(Expression fun, List<Expression> args) {
        function = fun;
        arguments = args;
    }

    @Override
    public PacioliValue eval(Environment environment) throws MVMException {
        /*
        if (function instanceof Identifier) {
            Identifier id = (Identifier) function;
            Machine.logln("\nCalling %s with arguments", id.getName());
        }
        */
        Callable fun = (Callable) function.eval(environment);
        List<PacioliValue> params = new ArrayList<PacioliValue>();
        for (Expression exp : arguments) {
            params.add(exp.eval(environment));
        }
        /*
        if (function instanceof Identifier) {
            for (PacioliValue param : params) {
                Machine.logln("\n- %s", param.toText());
            }
        }*/
        PacioliValue result = fun.apply(params);
        
        return result;
    }


    @Override
    public void printText(PrintWriter out) {
        out.print("application(");
        function.printText(out);
        for (Expression arg : arguments) {
            out.print(", ");
            arg.printText(out);
        }
        out.print(")");
    }
}
