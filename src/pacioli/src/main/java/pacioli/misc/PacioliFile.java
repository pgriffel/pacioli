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

package pacioli.misc;

import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.apache.commons.io.FilenameUtils;

import pacioli.Pacioli;
import pacioli.misc.CompilationSettings.Target;

/**
 * A wrapper around a file path that stores extra information about the file's
 * role in a program or project.
 */
public class PacioliFile extends AbstractPrintable {

    private final File file;
    public final String modulePath;
    public final String module;
    private final Integer version;
    private final Boolean isInclude;
    private final Boolean isLibrary;

    /**
     * A private constructor. The static get methods are the public constructors.
     * They determine the
     * module and check that the file exists.
     */
    private PacioliFile(File file, String modulePath, String module, Integer version, Boolean isInclude,
            Boolean isLibrary) {
        assert (!module.contains("."));
        this.file = file.getAbsoluteFile();
        this.modulePath = modulePath;
        this.module = module;
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

    public String getModule() {
        return modulePath.isEmpty() ? module : modulePath + "_" + module;
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
        File include = new File(file.getParentFile(), name + ".pacioli");

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

    // public static PacioliFile findInclude(Path baseDir, PacioliFile file, String
    // name) {
    // File include = new File(file.getFile().getParentFile(), name + ".pacioli");

    // Path includePath = Paths.get(include.getPath());
    // Path relative = baseDir.relativize(includePath);

    // if (include.exists()) {
    // //String module = file.getModule() + "/" + name;
    // String module = FilenameUtils.removeExtension(relative.toString());

    // // This replace fixes the problem that baseDir points to the wrong file.
    // // It should be the enclosing non-include file. It is however the project
    // // base dir. The result is that ..//.. etc appears in the path. This
    // // replace is a quick and dirty fix for that.
    // module = module.replaceAll("\\.", "_");

    // module = module.replaceAll("_", "_x");
    // module = module.replaceAll("\\\\", "_y");
    // module = module.replaceAll("/", "_z");

    // return new PacioliFile(include, "", module, 0, true, file.isLibrary);
    // } else {
    // return null;
    // }
    // }

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

    public boolean isSystemLibrary(String name) {
        // TODO: check that it is really a library. Check that filename points to lib
        // directory!
        return this.module.equals(name);
    }
}
