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

package pacioli.compiler;

import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.apache.commons.io.FilenameUtils;

import pacioli.Pacioli;
import pacioli.compiler.CompilationSettings.Target;

/**
 * A wrapper around a file path that stores extra information about the file's
 * role in a program or project.
 */
public class PacioliFile extends AbstractPrintable {

    private final File fsFile;
    private final String modulePath;
    private final String moduleName;
    private final Integer version;
    private final Boolean isInclude;
    private final Boolean isLibrary;

    /**
     * A private constructor. The static get methods are the public constructors.
     * They determine the
     * module and check that the file exists.
     */
    private PacioliFile(
            File file,
            String modulePath,
            String moduleName,
            Integer version,
            Boolean isInclude,
            Boolean isLibrary) {
        assert (!moduleName.contains("."));
        this.fsFile = file.getAbsoluteFile();
        this.modulePath = modulePath;
        this.moduleName = moduleName;
        this.version = version;
        this.isInclude = isInclude;
        this.isLibrary = isLibrary;
    }

    /**
     * Constructor for the PacioliFile class. Use findInclude or findLibrary to
     * construct a PacioliFile
     * for an include or library.
     * 
     * @param file    The file
     * @param version The file version
     * @return A PacioliFile for the file path, or null if file does not exist.
     */
    public static Optional<PacioliFile> get(File file, Integer version) {
        if (file.exists()) {
            return Optional.of(new PacioliFile(file.getAbsoluteFile(), "usr", FilenameUtils.getBaseName(file.getName()),
                    version, false, false));
        } else {
            return Optional.empty();
        }
    }

    /**
     * Constructor for the PacioliFile class. Use findInclude or findLibrary to
     * construct a PacioliFile
     * for an include or library.
     * 
     * @param file    The file name
     * @param version The file version
     * @return A PacioliFile for the file path, or null if file does not exist.
     */
    public static Optional<PacioliFile> get(String file, Integer version) {
        return get(new File(file), version);
    }

    public String module() {
        return modulePath.isEmpty() ? moduleName : modulePath + "_" + moduleName;
    }

    public Integer version() {
        return version;
    }

    public File fsFile() {
        return fsFile;
    }

    public Boolean isInclude() {
        return isInclude;
    }

    public Boolean isLibrary() {
        return isLibrary;
    }

    static String targetFileExtension(Target target) {
        switch (target) {
            case MVM:
                return "mvm";
            case JS:
                return "js";
            case MATLAB:
                return "m";
            case PYTHON:
                return "py";
            default:
                throw new RuntimeException("Unknown target");
        }
    }

    public static final List<String> defaultIncludes = new ArrayList<String>(
            Arrays.asList("base", "standard"));

    public Optional<PacioliFile> findInclude(String name) {
        File include = new File(fsFile.getParentFile(), name + ".pacioli");

        if (include.exists()) {
            String[] parts = name.split("/");
            // String nm = parts[parts.length - 1];
            String modulePath = parts.length == 1 ? this.modulePath
                    : (this.modulePath.isEmpty() ? parts[0] : this.modulePath + "_" + parts[0]);
            for (int i = 1; i < parts.length - 1; i++) {
                modulePath += "_" + parts[i];
            }
            // String module = file.getModule() + "/" + name;
            String module = parts[parts.length - 1]; // name; //baseDir + "_" + name;
                                                     // //FilenameUtils.removeExtension(relative.toString());
            // String modulePath = path; //this.modulePath.isEmpty() ? "" : "";

            module = module.replaceAll("\\\\", "_");
            module = module.replaceAll("/", "_");

            return Optional.of(new PacioliFile(include, modulePath, module, 0, true, isLibrary));
        } else {
            return Optional.empty();
        }
    }

    public static PacioliFile requireLibrary(String name, List<File> libs) {
        Optional<PacioliFile> library = findLibrary(name, libs);
        if (library.isPresent()) {
            return library.get();
        } else {
            throw new RuntimeException(String.format("Library '%s' not found in directories %s", name, libs));
        }
    }

    public static Optional<PacioliFile> findLibrary(String name, List<File> libs) {

        File theFile = null;

        // Generate a list of candidates
        List<File> candidates = new ArrayList<File>();
        for (File dir : libs) {
            File libdir = new File(dir, name);
            candidates.add(new File(libdir, libdir.getName() + ".pacioli"));
        }

        // See if a candidate exists
        for (File candidate : candidates) {
            if (candidate.exists()) {
                Pacioli.logIf(Pacioli.Options.showIncludeSearches, "Library '%s' found in file '%s'", name, candidate);
                if (theFile == null) {
                    theFile = candidate;
                } else {
                    Pacioli.logIf(Pacioli.Options.showIncludeSearches, "Shadowed '%s' library '%s' is ignored", name,
                            candidate);
                }
            } else {
                Pacioli.logIf(Pacioli.Options.showIncludeSearches, "Library candidate '%s' does not exist", candidate);
            }
        }

        if (theFile == null) {
            return Optional.empty();
        } else {
            return Optional.of(
                    new PacioliFile(theFile, "lib_" + name.replace("/", "_"), name.replace("/", "_"), 0, false, true));
        }
    }

    /**
     * Hack for generating the base lib API
     */
    public static PacioliFile libHack(File file, String path, String module, boolean isInclude) {
        return new PacioliFile(file, path, module, 0, isInclude, true);
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
                moduleName,
                version,
                fsFile);
    }

    @Override
    public int hashCode() {
        return fsFile.hashCode();
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
        return this.fsFile.equals(otherPacioliFile.fsFile);
    }
}
