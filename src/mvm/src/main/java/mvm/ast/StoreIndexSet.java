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

package mvm.ast;

import java.io.PrintWriter;
import java.util.List;

import mvm.MVMException;
import mvm.Machine;
import mvm.values.matrix.IndexSet;

public class StoreIndexSet implements Instruction {

    private String full;
    private String name;
    private List<String> values;

    public StoreIndexSet(String full, String name, List<String> values) {
        this.full = full;
        this.name = name;
        this.values = values;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("todo: print storeindexset");
    }

    @Override
    public void eval(Machine machine) throws MVMException {
        if (machine.indexSets.containsKey(full)) {
            throw new MVMException("Redefining index set '%s'", name);
        }
        machine.indexSets.put(full, new IndexSet(name, values));
    }

}
