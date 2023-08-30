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
import mvm.MVMException;

public class PacioliArray extends AbstractPacioliValue {

    private final PacioliValue[] array;

    public PacioliArray(int size) {
        array = new PacioliValue[size];
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("<");
        if (array.length > 0) {
            PacioliValue item = array[0];
            out.print(item == null ? "-" : item.toText());
        }
        for (int i = 1; i < array.length; i++) {
            out.print(", ");
            PacioliValue item = array[i];
            out.print(item == null ? "-" : item.toText());
        }
        out.print(">");
    }

    @Override
    public int hashCode() {
        return array.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof PacioliArray)) {
            return false;
        }
        PacioliArray otherList = (PacioliArray) other;
        return array.equals(otherList.array);
    }

    public PacioliValue put(int index, PacioliValue value) throws MVMException {
        if (index < array.length) {
            array[index] = value;
        return this;
        } else {
            throw new MVMException("Index %s for function 'put' out of bounds. Array size is %s", index, array.length);
        }
    }

    public PacioliValue get(int n) throws MVMException {
        if (n < array.length) {
            return array[n];
        } else {
            throw new MVMException("Index %s for function 'get' out of bounds. Array size is %s", n, array.length);
        }
    }

    public int size() throws MVMException {
        return array.length;
    }

}
