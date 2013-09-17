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

package mvm.values.matrix;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import mvm.AbstractPrintable;

public class IndexSet extends AbstractPrintable {

    public String name;
    private HashMap<String, Integer> positions;
    private String[] elements;

    public IndexSet(String name, List<String> elements) {

        this.name = name;
        int len = elements.size();

        this.elements = new String[len];
        this.positions = new HashMap<String, Integer>();

        int i = 0;
        for (String elt : elements) {
            this.elements[i] = elt;
            positions.put(elt, i);
            i++;
        }
    }

    public int size() {
        return elements.length;
    }

    public String ElementAt(int index) {
        return elements[index];
    }

    public int ElementPosition(String element) {
        if (positions.containsKey(element)) {
            return positions.get(element);
        } else {
            return -1;
        }
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("indexset(");
        out.print(name);
        out.print(")");
    }
    
    
}