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

package pacioli;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import pacioli.types.TypeBase;
import uom.Base;
import uom.Unit;

public class Utils {

    private static int counter;

    public static String intercalate(String seperator, List<String> strings) {
        StringBuilder builder = new StringBuilder();
        String sep = "";
        for (String string : strings) {
            builder.append(sep);
            builder.append(string);
            sep = seperator;
        }
        return builder.toString();
    }

    private String escapeString(String in) {
        // Quick fix for the debug option for string literals
        return in.replaceAll("\"", "\\\\\"");
    }

    public static String intercalateText(String seperator, List<? extends Printable> printables) {
        List<String> strings = new ArrayList<String>();
        for (Printable printable : printables) {
            strings.add(printable.toText());
        }
        return intercalate(seperator, strings);
    }

    public static String freshName() {
        return "fresh_" + counter++;
    }

    public static List<String> freshNames(List<String> names) {
        List<String> fresh = new ArrayList<String>();
        for (String name : names) {
            fresh.add("fresh_" + name + counter);
        }
        return fresh;
    }

    // http://stackoverflow.com/questions/326390/how-to-create-a-java-string-from-the-contents-of-a-file
    public static String readFile(File path) throws IOException {
        FileInputStream stream = new FileInputStream(path);
        try {
            FileChannel fc = stream.getChannel();
            MappedByteBuffer bb = fc.map(FileChannel.MapMode.READ_ONLY, 0, fc.size());
            /* Instead of using default, pass in a decoder. */
            return Charset.defaultCharset().decode(bb).toString();
        } finally {
            stream.close();
        }
    }

    // Got to find a good place for the following two functions

    public static String compileUnitToJS(Unit unit) {
        String product = "";
        int n = 0;
        for (Base base : unit.bases()) {
            TypeBase typeBase = (TypeBase) base;
            String baseText = typeBase.compileToJS() + ".expt(" + unit.power(base) + ")";
            product = n == 0 ? baseText : baseText + ".mult(" + product + ")";
            n++;
        }
        if (n == 0) {
            return "Pacioli.ONE";
        } else {
            return product;
        }

    }

    public static String compileUnitToMVM(Unit unit) {
        String product = "";
        int n = 0;
        for (Base base : unit.bases()) {
            TypeBase typeBase = (TypeBase) base;
            String baseText = "unit_expt(" + typeBase.compileToMVM() + ", " + unit.power(base) + ")";
            product = n == 0 ? baseText : "unit_mult(" + baseText + ", " + product + ")";
            n++;
        }
        if (n == 0) {
            return "unit(\"\")";
        } else {
            return product;
        }

    }
}
