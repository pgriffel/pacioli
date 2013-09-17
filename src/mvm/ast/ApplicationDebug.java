/*
 * Copyright (c) 2013 Paul Griffioen
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

package mvm.ast;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import mvm.Machine;
import mvm.AbstractPrintable;
import mvm.ControlTransfer;
import mvm.Environment;
import mvm.MVMException;
import mvm.values.Callable;
import mvm.values.PacioliValue;

/**
 *
 * @author Administrator
 */
public class ApplicationDebug extends AbstractPrintable implements Expression {

    private final Expression function;
    private final List<Expression> arguments;
    private final String stackText;
    private final String fullText;
    private final boolean trace;

    public ApplicationDebug(String stackText, String fullText, boolean trace, Expression fun, List<Expression> args) {
        this.stackText = stackText;
        this.fullText = fullText;
        this.trace = trace;
        function = fun;
        arguments = args;
    }

    @Override
    public PacioliValue eval(Environment env) throws MVMException {

        Callable fun = (Callable) function.eval(env);
        Machine.pushFrame(fullText);
        
        try {
            List<PacioliValue> params = new ArrayList<PacioliValue>();
            for (Expression exp : arguments) {
                params.add(exp.eval(env));
            }
            if (trace) {
                Machine.logln("\nCalling %s with arguments (%s)", stackText, AbstractPrintable.intercalateText(", ", params));
            }
            PacioliValue result = fun.apply(params);
            if (trace) {
                Machine.logln("\nReturn from %s with value %s", stackText, result.toText());
            }
            Machine.popFrame();
            return result;
        } catch (ControlTransfer ex) {
            Machine.popFrame();
            throw ex;
        }

    }

    @Override
    public void printText(PrintWriter out) {
        out.print("application_debug(");
        function.printText(out);
        for (Expression arg : arguments) {
            out.print(", ");
            arg.printText(out);
        }
        out.print(")");
    }
}
