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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import mvm.AbstractPrintable;

public class MatrixDimension extends AbstractPrintable {

    private final List<IndexSet> indexSets;
    private final Map<List<String>, Integer> positions; // Gebruik de hashmap op Entity en verwijder deze

    public MatrixDimension(List<IndexSet> sets) {
        this.indexSets = sets;
        this.positions = positionsMap();
    }

    public MatrixDimension(IndexSet set) {
        indexSets = new ArrayList<IndexSet>();
        indexSets.add(set);
        this.positions = positionsMap();
    }

    public MatrixDimension() {
        this.indexSets = new ArrayList<IndexSet>();
        this.positions = positionsMap();
    }

    @Override
    public int hashCode() {
        return indexSets.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof MatrixDimension)) {
            return false;
        }
        MatrixDimension otherDimension = (MatrixDimension) other;
        if (!indexSets.equals(otherDimension.indexSets)) {
            return false;
        }
        return true;
    }

    public MatrixDimension kronecker(MatrixDimension other) {
        List<IndexSet> sets = new ArrayList<IndexSet>();
        sets.addAll(indexSets);
        sets.addAll(other.indexSets);
        return new MatrixDimension(sets);
    }
    
    private Map<List<String>, Integer> positionsMap() {
        Map<List<String>, Integer> map = new HashMap<List<String>, Integer>();
        for (int i = 0; i < size(); i++) {
            map.put(ElementAt(i), i);
        }
        return map;
    }

    public List<IndexSet> getIndexSets() {
        return indexSets;
    }

    public int width() {
        return indexSets.size();
    }

    public int size() {
        int size = 1;
        for (IndexSet set : indexSets) {
            size = size * set.size();
        }
        return size;
    }

    public IndexSet nthIndexSet(int n) {
        return indexSets.get(n);
    }

    public int ElementPos(List<String> index) {
        if (positions.containsKey(index)) {
            return positions.get(index);
        } else {
            throw new RuntimeException(String.format("Element '%s' unknown", index));
        }
    }

    public int[] individualPositions(int position) {
        int[] positionArray = new int[width()];
        int p = position;
        for (int i = 0; i < width(); i++) {
            IndexSet set = indexSets.get(i);
            positionArray[i] = p % set.size();
            p = p / set.size();
        }
        return positionArray;
    }

    public List<String> ElementAt(int index) {
        ArrayList<String> list = new ArrayList<String>();
        int a = index;
        for (IndexSet set : indexSets) {
            list.add(set.ElementAt(a % set.size()));
            a = a / set.size();
        }
        return list;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("dim(");
        out.print(AbstractPrintable.intercalateText(",", indexSets));
        out.print(")");
    }
    
    public String indexText() {
    	List<String> names = new ArrayList<String>();
    	for (IndexSet set: indexSets) {
    		names.add(set.name);
    	}
        return AbstractPrintable.intercalate(",", names);
    }
}