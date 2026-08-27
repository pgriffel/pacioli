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

package mvm;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import mvm.values.matrix.Matrix;

public interface Printable {

    /**
     * String representation of an MVM object.
     * 
     * Intended for reading by the user.
     * 
     * @return The object as string
     */
    default public String toText() {
        StringWriter out = new StringWriter();
        printText(new PrintWriter(out));
        return out.toString();
    }

    /**
     * String representation of an MVM object with a given number of decimals.
     * 
     * Intended for reading by the user.
     * 
     * @return The object as string
     */
    default public String toText(int nrDecimals) {
        int currentNrDecimals = Matrix.nrDecimals;
        Matrix.nrDecimals = nrDecimals;
        StringWriter out = new StringWriter();
        try {
            printText(new PrintWriter(out));
        } finally {
            Matrix.nrDecimals = currentNrDecimals;
        }
        return out.toString();
    }

    /**
     * String representation of an MVM object suitable for programmers.
     * 
     * Intended for display in the terminal.
     * 
     * @return The object as string
     */
    default public String toTerminalText() {
        StringWriter out = new StringWriter();
        printTerminalText(new PrintWriter(out));
        return out.toString();
    }

    /**
     * Prints the object to the output stream.
     * 
     * Implementations of this interface must implmement this method. The toText
     * method uses this method to create a string.
     * 
     * @param out An output stream
     */
    public void printText(PrintWriter out);

    /**
     * Prints the object to the output stream.
     * 
     * The toTerminalText method uses this method to create a string.
     * 
     * The default implementaton calls printText.
     * 
     * @param out An output stream
     */
    default public void printTerminalText(PrintWriter out) {
        printText(out);
    };

    public static String joinText(String seperator, List<? extends Printable> printables) {
        List<String> strings = new ArrayList<String>();
        for (Printable printable : printables) {
            strings.add(printable.toText());
        }
        return String.join(seperator, strings);
    }

    public static String joinTerminalText(String seperator, List<? extends Printable> printables) {
        List<String> strings = new ArrayList<String>();
        for (Printable printable : printables) {
            strings.add(printable.toTerminalText());
        }
        return String.join(seperator, strings);
    }
}
