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

import mvm.values.Boole;

public class PacioliFile extends AbstractPrintable {

    private final File file;
    private final String module;
    private final Integer version;
    private final Boolean isInclude;
    private final Boolean isLibrary;
    
    //private final String name;
    //private final List<String> includes;
    //private File file = null;
    //private boolean isDefault = false;

    public PacioliFile(File file, String module, Integer version, Boolean isInclude, Boolean isLibrary) {
        this.file = file;
        this.module = module;
        this.version = version;
        this.isInclude = isInclude;
        this.isLibrary = isLibrary;
    }
    
    String getModule() {
        return module;
    }
    
    Integer getVersion() {
        return version;
    }
    
    File getFile() {
        return file;
    }
    
    Boolean isInclude() {
        return isInclude;
    }
    
    Boolean isLibrary() {
        return isLibrary;
    }
    
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
    
    public static PacioliFile findIncludeOrLibrary(PacioliFile file, String name, List<File> libs) {
        PacioliFile include = findInclude(file, name);
        if (include == null) {
            return findLibrary(name, libs);
        } else {
            return include;
        }
    }
    
    public static PacioliFile findInclude(PacioliFile file, String name) {
        File include = new File(file.getFile().getParentFile(), name + ".pacioli");
        if (include.exists()) {
            String module = file.getModule() + "/" + name;
            return new PacioliFile(include, module, 0, true, file.isLibrary);
        } else {
            return null;
        }
    }
    
    public static PacioliFile findLibrary(String name, List<File> libs) {

        File theFile = null;

        // Generate a list of candidates
        List<File> candidates = new ArrayList<File>();
        for (File dir : libs) {
            candidates.add(new File(dir, name + ".pacioli"));
        }

        // See if a candidate exists
        for (File candidate : candidates) {
            if (candidate.exists()) {
                Pacioli.logln3("Library '%s' found in file '%s'", name, candidate);
                if (theFile == null) {
                    theFile = candidate;
                } else {
                    Pacioli.warn("Shadowed '%s' library '%s' is ignored", name, candidate);
                }
            } else {
                Pacioli.logln3("Library candidate '%s' does not exist", candidate);
            }
        }

        if (theFile == null) {
            //throw new FileNotFoundException(String.format("Library '%s' not found in directories %s", name, libs));
            return null;
        } else {
            return new PacioliFile(theFile, name, 0, false, true);    
        }
    }
/*
    public PacioliFile(String name) {
        this.name = name;
        this.includes = new ArrayList<String>();
    }
*/
  
/*
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
*/
    @Override
    public void printPretty(PrintWriter out) {
        out.print(toString());
    }

    @Override
    public String toString() {
        return String.format("%s %s %s v%s (%s)", 
                isLibrary ? "library" : "program", 
                        isInclude ? "include" : "file",
                        module, 
                        version,
                        file);
    }

    @Override
    public int hashCode() {
        return file.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof PacioliFile)) {
            return false;
        }
        PacioliFile otherPacioliFile = (PacioliFile) other;
        return this.file.equals(otherPacioliFile.file);
    }
}
