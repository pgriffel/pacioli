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
import java.io.PrintWriter;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.io.FilenameUtils;

public class PacioliFile extends AbstractPrintable {

    private final File file;
    private final String module;
    private final Integer version;
    private final Boolean isInclude;
    private final Boolean isLibrary;
    
    public PacioliFile(File file, String module, Integer version, Boolean isInclude, Boolean isLibrary) {
        this.file = file.getAbsoluteFile();
        this.module = module;
        this.version = version;
        this.isInclude = isInclude;
        this.isLibrary = isLibrary;
    }

    public static PacioliFile get(File file, Integer version) {
        return new PacioliFile(file.getAbsoluteFile(), FilenameUtils.getBaseName(file.getName()), version, false, false);
    }
    
    public String getModule() {
        return module;
    }
    
    public Integer getVersion() {
        return version;
    }
    
    public File getFile() {
        return file;
    }
    
    public Boolean isInclude() {
        return isInclude;
    }
    
    public Boolean isLibrary() {
        return isLibrary;
    }
    
    public static final List<String> defaultIncludes = new ArrayList<String>(
            Arrays.asList("primitives", "list", "matrix", "string", "standard"));
    public static final List<String> defaultsToCompile = new ArrayList<String>(
            Arrays.asList("primitives", "list", "matrix", "string", "standard"));
    public static final List<String> debugablePrimitives = new ArrayList<String>(
            Arrays.asList("primitives", "list", "matrix", "string"));
    
    public static PacioliFile findIncludeOrLibrary(Path baseDir, PacioliFile file, String name, List<File> libs) {
        PacioliFile include = findInclude(baseDir, file, name);
        if (include == null) {
            return findLibrary(name, libs);
        } else {
            return include;
        }
    }
    
    public static PacioliFile findInclude(Path baseDir, PacioliFile file, String name) {
        File include = new File(file.getFile().getParentFile(), name + ".pacioli");
        
        Path includePath = Paths.get(include.getPath());
        Path relative = baseDir.relativize(includePath);
        
        
        if (include.exists()) {
            //String module = file.getModule() + "/" + name;
            String module = FilenameUtils.removeExtension(relative.toString());
            module = module.replaceAll("_", "_x");
            module = module.replaceAll("\\\\", "_y");
            module = module.replaceAll("/", "_z");
            Pacioli.logln("module=%s", module);
            
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
