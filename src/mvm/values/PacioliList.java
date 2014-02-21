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
import java.util.Collections;
import java.util.List;
import mvm.AbstractPrintable;
import mvm.MVMException;

public class PacioliList extends AbstractPacioliValue {

    private final List<PacioliValue> items;

    public PacioliList() {
        items = new ArrayList<PacioliValue>();
    }

    public PacioliList(PacioliValue value) {
        items = new ArrayList<PacioliValue>();
        items.add(value);
    }

    public PacioliList(List<PacioliValue> values) {
        items = values;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("[");
        out.print(AbstractPrintable.intercalateText(", ", items));
        out.print("]");
    }

    public List<PacioliValue> items() {
        return items;
    }

    public PacioliValue append(PacioliList y) {
        ArrayList<PacioliValue> accu = new ArrayList<PacioliValue>();
        accu.addAll(items);
        accu.addAll(y.items);
        return new PacioliList(accu);
    }

    @Override
    public int hashCode() {
        return items.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof PacioliList)) {
            return false;
        }
        PacioliList otherList = (PacioliList) other;
        return items.equals(otherList.items);
    }

    public PacioliValue zip(PacioliList other) {
        ArrayList<PacioliValue> accu = new ArrayList<PacioliValue>();
        int size = Math.min(items.size(), other.items.size());
        for (int i = 0; i < size; i++) {
            List<PacioliValue> pair = new ArrayList<PacioliValue>();
            pair.add(items.get(i));
            pair.add(other.items.get(i));
            accu.add(new PacioliTuple(pair));
        }
        return new PacioliList(accu);
    }

    public PacioliValue cons(PacioliValue x, PacioliList y) {
        ArrayList<PacioliValue> accu = new ArrayList<PacioliValue>();
        accu.add(x);
        accu.addAll(y.items);
        return new PacioliList(accu);
    }

    public PacioliValue addMut(PacioliValue x) {
        items.add(x);
        return this;
    }

    public PacioliValue nth(int n) throws MVMException {
        if (n < items.size()) {
            return items.get(n);
        } else {
            throw new MVMException("Index %s for function 'nth' out of bounds. List size is %s", n, items.size());
        }
    }
    
    public PacioliValue head() throws MVMException {
        if (items.isEmpty()) {
            throw new MVMException("function 'head' called on empty list");
        } else {
            return items.get(0);
        }
    }

	public PacioliValue reverse() {
		ArrayList<PacioliValue> accu = new ArrayList<PacioliValue>(items);
		Collections.reverse(accu);
        return new PacioliList(accu);
	}
}
