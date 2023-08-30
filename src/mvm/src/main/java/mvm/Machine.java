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

package mvm;

import java.io.File;
import java.io.PrintStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import mvm.ast.Instruction;
import mvm.ast.expression.Expression;
import mvm.values.PacioliValue;
import mvm.values.matrix.IndexSet;
import mvm.values.matrix.Matrix;
import mvm.values.matrix.MatrixBase;
import mvm.values.matrix.UnitVector;
// import pacioli.Pacioli;
import uom.Prefix;
import uom.Unit;
import uom.UnitSystem;

public class Machine {

    public final Environment store;
    public final UnitSystem<MatrixBase> unitSystem;
    public final HashMap<String, IndexSet> indexSets;
    public final HashMap<String, UnitVector> unitVectors;
    private static final LinkedList<String> debugStack = new LinkedList<String>();
    private static boolean atLineStart = false;
    private final List<File> loadedFiles;

    public Machine() {
        store = new Environment(this);
        unitSystem = makeSI();
        indexSets = new HashMap<String, IndexSet>();
        unitVectors = new HashMap<String, UnitVector>();
        loadedFiles = new ArrayList<File>();
    }

    public static void pushFrame(String frame) {
        debugStack.push(frame);
    }

    public static void popFrame() {
        debugStack.pop();
    }

    public void storeCode(String name, Expression code) {
        store.putCode(name, code);
    }

    // public void storeValue(String name, PacioliValue value) {
    // store.put(name, value);
    // }

    public void storeUnit(String name, Unit<MatrixBase> unit) {
        unitSystem.addUnit(name, unit);
    }

    // public void storeBaseValue(String name, PacioliValue primitive) {
    // storeValue("lib_base_base_" + name, primitive);
    // }

    public void init() throws MVMException {
        Primitives.load(store);
    }

    /*
     * Utilities
     */
    public static void log(String string, Object... args) {

        String text = String.format(string, args);

        if (!text.isEmpty()) {
            atLineStart = false;
        }

        if (System.console() == null) {
            System.out.print(text);
            System.out.flush();
        } else {
            System.console().format("%s", text);
            System.console().flush();
        }
    }

    public static void logln(String string, Object... args) {

        if (!atLineStart) {
            // System.out.println();
            log("\n");
            atLineStart = true;
        }

        log(string, args);
    }

    public void dumpTypes() {
        logln("Store signature:");
        for (java.util.Map.Entry<String, PacioliValue> entry : store.entrySet()) {
            if (entry.getValue() instanceof Matrix) {
                logln("%s :: %s", entry.getKey(), ((Matrix) entry.getValue()).shape.toText());
            }

        }
    }

    public void dumpState() {
        logln("Store contents:");
        for (java.util.Map.Entry<String, PacioliValue> entry : store.entrySet()) {
            if (entry.getValue() instanceof Matrix) {
                logln("%s =%s", entry.getKey(), entry.getValue().toText());
            }
        }
        logln("\nStack:");
        int i = 1;
        for (Iterator<String> it = debugStack.descendingIterator(); it.hasNext();) {
            logln("\n%s) %s", i++, it.next());
        }
    }

    static public UnitSystem<MatrixBase> makeSI() {
        UnitSystem<MatrixBase> si = new UnitSystem<MatrixBase>();
        si.addPrefix("giga", new Prefix("G", new BigDecimal("1000000000")));
        si.addPrefix("mega", new Prefix("M", new BigDecimal("1000000")));
        si.addPrefix("kilo", new Prefix("k", new BigDecimal("1000")));
        si.addPrefix("hecto", new Prefix("h", new BigDecimal("100")));
        si.addPrefix("deca", new Prefix("da", new BigDecimal("10")));
        si.addPrefix("deci", new Prefix("d", new BigDecimal("0.1")));
        si.addPrefix("centi", new Prefix("c", new BigDecimal("0.01")));
        si.addPrefix("milli", new Prefix("m", new BigDecimal("0.001")));
        si.addPrefix("micro", new Prefix("μ", new BigDecimal("0.000001")));
        si.addPrefix("nano", new Prefix("n", new BigDecimal("0.000000001")));
        return si;
    }

    public void run(File file, PrintStream out, List<File> libs) throws Exception {
        //// for (String include : PacioliFile.defaultIncludes) {
        /// runRec(PacioliFile.findFile(include + ".mvm", libs, file.getParentFile()),
        //// out, libs);
        //// }
        runRec(file, out, libs);
    }

    public void runRec(File file, PrintStream out, List<File> libs) throws Exception {

        // Check if the file was already loaded
        if (!loadedFiles.contains(file)) {

            // Make sure the file is not loaded more than once
            loadedFiles.add(file);

            // Load the file
            mvm.ast.Program code = mvm.parser.Parser.parseFile(file);

            // Run the requires
            // for (String require : code.requires) {
            // runRec(PacioliFile.findFile(require + ".mvm", libs, file.getParentFile()),
            // out, libs);
            // }

            // Run the file itself
            // Pacioli.logln2("Running MVM file %s", file);
            for (Instruction instruction : code.instructions) {
                instruction.eval(this);
            }
        }
    }
}
