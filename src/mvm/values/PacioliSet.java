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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import mvm.AbstractPrintable;


public class PacioliSet extends AbstractPacioliValue {

    private final Set<PacioliValue> items;

    public PacioliSet() {
        items = new HashSet<PacioliValue>();
    }

    public PacioliSet(PacioliValue item) {
        items = new HashSet<PacioliValue>();
        items.add(item);
    }

    public PacioliSet union(PacioliSet other) {
        PacioliSet union = new PacioliSet();
        union.items.addAll(items);
        union.items.addAll(other.items);
        return union;
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
        if (!(other instanceof PacioliSet)) {
            return false;
        }
        PacioliSet otherSet = (PacioliSet) other;
        return items.equals(otherSet.items);
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("{");
        out.print(AbstractPrintable.intercalateText(", ", new ArrayList(items)));
        out.print("}");
    }

    public List<PacioliValue> items() {
        return new ArrayList<PacioliValue>(items);
    }

    public PacioliValue adjoinMut(PacioliValue y) {
//		if (!items.contains(y)) {
//			items.add(y);
//		}
        items.add(y);
        return this;
    }
}
