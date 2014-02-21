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

package mvm.values.matrix;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import mvm.values.AbstractPacioliValue;

public class Key extends AbstractPacioliValue {

	private final List<String> names;
	private final int position;
    private final MatrixDimension dimension;

    public Key() {
        this.names = new ArrayList<String>();
        this.dimension = new MatrixDimension();
        this.position = dimension.ElementPos(names);
    }

    public Key(List<String> names, MatrixDimension dimension) {
        this.names = names;
        this.dimension = dimension;
        this.position = dimension.ElementPos(names);
    }
    
    public Key(int position, MatrixDimension dimension) {
        this.names = dimension.ElementAt(position);
        this.dimension = dimension;
        this.position = position;
    }

    public MatrixDimension dimension() {
        return dimension;
    }
    
    public int position() {
        return position;
    }
    
    public List<String> projectNames(List<Integer> columns) {
    	List<String> projected = new ArrayList<String>();
    	for (int column: columns) {
    		projected.add(names.get(column));
    	}
        return projected;
    }
    
    @Override
    public void printText(PrintWriter out) {
        if (names.isEmpty()) {
            out.print("_");
            return;
        }
        String text = "";
        String sep = "";
        for (String name : names) {
            text += sep + name;
            sep = "%";
        }
        out.print(text);
    }

    @Override
    public int hashCode() {
        return names.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof Key)) {
            return false;
        }
        Key otherKey = (Key) other;
        return this.position == otherKey.position && this.dimension.equals(otherKey.dimension);
    }
}
