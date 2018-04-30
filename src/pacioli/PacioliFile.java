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
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PacioliFile extends AbstractPrintable {

    private final String name;
    private final List<String> includes;
    private File file = null;
    private boolean isDefault = false;

    public static final List<String> defaultIncludes = new ArrayList<String>(
            Arrays.asList("primitives", "list", "matrix", "string", "standard"));
    public static final List<String> defaultsToCompile = new ArrayList<String>(
            Arrays.asList("primitives", "list", "matrix", "string", "standard"));
    public static final List<String> debugablePrimitives = new ArrayList<String>(
            Arrays.asList("primitives", "list", "matrix", "string"));

    public static File findIncludeFile(String include, List<File> libs) throws FileNotFoundException {
        return findIncludeFile(include, libs, null);
    }

    public static File findIncludeFile(String include, List<File> libs, File directory) throws FileNotFoundException {
        return findFile(include + ".pacioli", libs, directory);
    }

    public static File findFile(String file, List<File> libs, File directory) throws FileNotFoundException {

        File theFile = null;
        String includeName = file.toLowerCase();

        // Generate a list of candidates
        List<File> candidates = new ArrayList<File>();
        if (directory != null) {
            candidates.add(new File(directory, includeName));
        }
        for (File dir : libs) {
            candidates.add(new File(dir, includeName));
        }

        // See if a candidate exists
        for (File candidate : candidates) {
            if (candidate.exists()) {
                Pacioli.logln3("Include '%s' found in library file '%s'", file, candidate);
                if (theFile == null) {
                    theFile = candidate;
                } else {
                    Pacioli.warn("Shadowed include file '%s' is ignored", candidate);
                }
            } else {
                Pacioli.logln3("Include '%s' not found", candidate);
            }
        }

        if (theFile == null) {
            throw new FileNotFoundException(String.format("No file found for include '%s'", includeName));
        }

        return theFile;
    }

    public PacioliFile(String name) {
        this.name = name;
        this.includes = new ArrayList<String>();
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault() {
        isDefault = true;
    }

    public String getName() {
        return name;
    }

    public List<String> getIncludes() {
        return includes;
    }

    public void setFile(File file) {
        this.file = file;
    }

    public File getFile() {
        return file;
    }

    public File directory() {
        return file.getParentFile();
    }

    public void include(String name) {
        if (getIncludes().contains(name)) {
            Pacioli.warn("Module '%s' is already included", name);
        } else {
            getIncludes().add(name);
        }
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("module \"%s\";\n", name);
        for (String i : getIncludes()) {
            out.format("include \"%s\";\n", i);
        }
    }

}
