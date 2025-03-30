/*
 * Copyright (c) 2018 - 2025 Paul Griffioen
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
import java.util.HashMap;
import java.util.List;

import mvm.Environment;
import mvm.MVMException;
import mvm.values.PacioliValue;
import mvm.values.matrix.IndexSet;
import mvm.values.matrix.Key;
import mvm.values.matrix.MatrixDimension;

public class LitKey implements Expression {

    private List<String> entities;
    private List<String> items;

    public LitKey(List<String> entities, List<String> items) {
        this.entities = entities;
        this.items = items;
    }

    @Override
    public PacioliValue eval(Environment environment) throws MVMException {
        List<IndexSet> sets = new ArrayList<IndexSet>();
        HashMap<String, IndexSet> indexSets = environment.machine().indexSets;
        for (String entity : entities) {
            if (indexSets.containsKey(entity)) {
                sets.add(indexSets.get(entity));
            } else {
                throw new MVMException("Index set '%s' unnown", entity);
            }
        }
        return new Key(items, new MatrixDimension(sets));
    }

    @Override
    public void printText(PrintWriter out) {

    }
}
