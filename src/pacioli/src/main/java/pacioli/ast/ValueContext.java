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

package pacioli.ast;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import pacioli.compiler.Printable;

public class ValueContext implements Printable {

    private final List<String> vars = new ArrayList<String>();
    private final List<String> refVars = new ArrayList<String>();
    private String statementResult;

    public ValueContext() {
    }

    @Override
    public void printPretty(PrintWriter out) {
        out.print("some value context");
    }

    public List<String> vars() {
        return vars;
    }

    public boolean containsVar(String var) {
        return vars.contains(var);
    }

    public boolean isRefVar(String var) {
        return refVars.contains(var);
    }

    public void addAll(ValueContext context) {
        addVars(context.vars);
        addRefVars(context.refVars);
    }

    public void addVars(List<String> vars) {
        for (String var : vars) {
            addVar(var);
        }
    }

    public void addRefVars(List<String> vars) {
        for (String var : vars) {
            addRefVar(var);
        }
    }

    public void addVar(String var) {
        vars.add(var);
    }

    public void addVar(String var, boolean isRef) {
        vars.add(var);
        if (isRef) {
            refVars.add(var);
        }
    }

    public void addRefVar(String var) {
        vars.add(var);
        refVars.add(var);
    }

    public String statementResult() {
        return statementResult;
    }

    public void setStatementResult(String string) {
        statementResult = string;
    }
}
