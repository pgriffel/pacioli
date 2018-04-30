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
import java.util.ArrayList;
import java.util.List;
import mvm.MVMException;
import mvm.values.matrix.Key;
import mvm.values.matrix.Matrix;

public abstract class Primitive extends AbstractPacioliValue implements Callable {

    private final String name;

    public Primitive(String name) {
        this.name = name;
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("|%s|", name);
    }

    public void checkNrArgs(List<PacioliValue> args, int size) throws MVMException {
        if (args.size() != size) {
            throw new MVMException("function '%s' expects %s argument(s) but got %s", name, size, args.size());
        }
    }

    public void checkListArg(List<PacioliValue> args, int i) throws MVMException {
        if (!(args.get(i) instanceof PacioliList)) {
            throw new MVMException("Argument %s to function '%s' must be a list", i + 1, name);
        }
    }

    public void checkSetArg(List<PacioliValue> args, int i) throws MVMException {
        if (!(args.get(i) instanceof PacioliSet)) {
            throw new MVMException("Argument %s to function '%s' must be a set", i + 1, name);
        }
    }

    public void checkTupleArg(List<PacioliValue> args, int i) throws MVMException {
        if (!(args.get(i) instanceof PacioliTuple)) {
            throw new MVMException("Argument %s to function '%s' must be a tuple", i + 1, name);
        }
    }

    public void checkStringArg(List<PacioliValue> args, int i) throws MVMException {
        if (!(args.get(i) instanceof PacioliString)) {
            throw new MVMException("Argument %s to function '%s' must be a string", i + 1, name);
        }
    }

    public void checkCallableArg(List<PacioliValue> args, int i) throws MVMException {
        if (!(args.get(i) instanceof Callable)) {
            throw new MVMException("Argument %s to function '%s' must be callable", i + 1, name);
        }
    }

    public void checkBooleArg(List<PacioliValue> args, int i) throws MVMException {
        if (!(args.get(i) instanceof Boole)) {
            throw new MVMException("Argument %s to function '%s' must be a Boolean", i + 1, name);
        }
    }

    public void checkMatrixArg(List<PacioliValue> args, int i) throws MVMException {
        if (!(args.get(i) instanceof Matrix)) {
            throw new MVMException("Argument %s to function '%s' must be a matrix", i + 1, name);
        }
    }

    public void checkKeyArg(List<PacioliValue> args, int i) throws MVMException {
        if (!(args.get(i) instanceof Key)) {
            throw new MVMException("Argument %s to function '%s' must be a key", i + 1, name);
        }
    }

    public void checkReferenceArg(List<PacioliValue> args, int i) throws MVMException {
        if (!(args.get(i) instanceof Reference)) {
            throw new MVMException("Argument %s to function '%s' must be a reference", i + 1, name);
        }
    }

    public PacioliValue applyToTwo(Callable fun, PacioliValue arg0, PacioliValue arg1) throws MVMException {
        List<PacioliValue> temp = new ArrayList<PacioliValue>();
        temp.add(arg0);
        temp.add(arg1);
        return fun.apply(temp);
    }

    public PacioliValue applyToThree(Callable fun, PacioliValue arg0, PacioliValue arg1, PacioliValue arg2)
            throws MVMException {
        List<PacioliValue> temp = new ArrayList<PacioliValue>();
        temp.add(arg0);
        temp.add(arg1);
        temp.add(arg2);
        return fun.apply(temp);
    }
}
