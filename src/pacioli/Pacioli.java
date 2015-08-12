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

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import mvm.MVMException;
import mvm.Machine;

public class Pacioli {

    private static int verbosity = 1;
    private static boolean warnings = false;
    private static boolean debug = false;
    private static boolean traceAll = false;
    private static final List<String> tracedFunctions = new ArrayList<String>();
    private static boolean atLineStart = false;

    public static void main(String[] args) {
        try {
            handleArgs(args);
        } catch (PacioliException ex) {
            logln("\nPacioli error:\n\n%s\n", ex.getLocatedMessage());
        } catch (MVMException ex) {
            logln("\nRuntime error:\n\n%s\n", ex.getLocalizedMessage());
        } catch (Exception ex) {
            logln("\nUnexpected error:\n\n%s\n\n", ex);
            ex.printStackTrace();
        }
    }

    private static void handleArgs(String[] args) throws PacioliException, MVMException {

        if (args.length == 0) {
            displayError("expected a command");
        } else {

            String command = "";
            List<String> files = new ArrayList<String>();
            String target = "mvm";
            List<File> libs = new ArrayList<File>();

            int i = 0;
            while (i != args.length) {
                String arg = args[i++];
                if (arg.equals("-verbosity")) {
                    if (i < args.length) {
                        String verbosityArg = args[i++];
                        try {
                            verbosity = Integer.valueOf(verbosityArg);
                        } catch (Exception ex) {
                            displayError(String.format("invalid verbosity number: '%s'. Ignoring verbosity option.", verbosityArg));
                        }
                    } else {
                        displayError("Expected number after -v. Ignoring verbosity option.");
                    }
                } else if (arg.equals("-lib")) {
                    if (i < args.length) {
                        libs.add(new File(args[i++]));
                    } else {
                        displayError("Expected path after -lib. Ignoring lib option.");
                    }
                } else if (arg.equals("-target")) {
                    if (i < args.length) {
                        target = args[i++];
                    } else {
                        displayError("Expected 'mvm', 'javascript' or 'matlab' after -target. Ignoring target option.");
                    }
                } else if (arg.equals("-trace")) {
                    if (i < args.length) {
                        tracedFunctions.add(args[i++]);
                    } else {
                        displayError("Expected function name after -trace. Ignoring trace option.");
                    }
                } else if (arg.equals("-traceall")) {
                    traceAll = !traceAll;
                } else if (arg.equals("-warnings")) {
                    warnings = !warnings;
                } else if (arg.equals("-debug")) {
                    debug = !debug;
                } else if (command.isEmpty()) {
                    command = arg;
                } else {
                    files.add(arg);
                }
            }

            boolean compileDebug = debug || traceAll || !tracedFunctions.isEmpty();
            CompilationSettings settings = new CompilationSettings(compileDebug, traceAll, tracedFunctions);

            if (command.equals("run")) {
                if (files.isEmpty()) {
                    displayError("No files to run.");
                }
                for (String file : files) {
                    runCommand(file, libs, settings);
                }
            } else if (command.equals("interpret")) {
                if (files.isEmpty()) {
                    displayError("No files to interpret.");
                }
                for (String file : files) {
                    interpretCommand(file);
                }
            } else if (command.equals("compile")) {
                if (files.isEmpty()) {
                    displayError("No files to compile.");
                }
                for (String file : files) {
                    compileCommand(file, target, libs, settings);
                }
            } else if (command.equals("types")) {
                if (files.isEmpty()) {
                    displayError("No files to read.");
                }
                for (String file : files) {
                    typesCommand(file, libs);
                }
            } else if (command.equals("help")) {
                helpCommand();
            } else if (command.equals("info")) {
                infoCommand(libs);
            } else {
                displayError(String.format("Command '%s' unknown", command));
            }
        }

        logln("");
    }

    /*
     *  Commands
     */
    private static void runCommand(String fileName, List<File> libs, CompilationSettings settings) throws PacioliException, MVMException {

        File file = new File(fileName);

        if (!file.exists()) {
            throw new PacioliException("Error: file '%s' does not exist.", fileName);
        }

        Pacioli.logln1("Running file '%s'", fileName);
        Program program = new Program(libraryDirectories(libs));

        try {

            Pacioli.logln2("Loading module '%s'", file.getPath());
            program.load(file);
        
            StringWriter outputStream = new StringWriter();
            try {

            	
                Pacioli.logln2("Compiling module '%s'", file.getPath());
                program.compileMVM(new PrintWriter(outputStream), settings);

                Pacioli.logln2("Interpreting module '%s'", file.getPath());
                interpretMVMText(outputStream.toString());

            } finally {
                outputStream.close();
            }

        } catch (IOException e) {
            throw new PacioliException("cannot run module '%s':\n\n%s", file.getPath(), e);
        }

    }

    private static void compileCommand(String fileName, String target, List<File> libs, CompilationSettings settings) throws PacioliException {

        File file = new File(fileName);

        if (!file.exists()) {
            throw new PacioliException("Error: file '%s' does not exist.", fileName);
        }

        Pacioli.logln1("Compiling file '%s'", fileName);

        Program program = new Program(libraryDirectories(libs));

        int idx = file.getName().lastIndexOf('.');
        String baseName = (idx > 0) ? file.getName().substring(0, idx) : file.getName();

        String extension;
        if (target.equals("javascript")) {
            extension = ".js";
        } else if (target.equals("matlab")) {
            extension = ".m";
        } else if (target.equals("html")) {
            extension = ".html";
        } else {
            extension = ".mvm";
        }
        File dstName = new File(file.getParent(), baseName + extension).getAbsoluteFile();

        try {

            program.load(file);
            BufferedWriter outputStream;
            outputStream = new BufferedWriter(new FileWriter(dstName));
            try {
                if (target.equals("javascript")) {
                    program.compileJS(new PrintWriter(outputStream), settings);
                } else if (target.equals("matlab")) {
                    program.compileMatlab(new PrintWriter(outputStream), settings);
                } else if (target.equals("html")) {
                    program.compileHtml(new PrintWriter(outputStream), settings);
                } else {
                    program.compileMVM(new PrintWriter(outputStream), settings);
                }

            } finally {
                outputStream.close();
            }

            Pacioli.logln("Written file '%s'", dstName);

        } catch (IOException e) {
            throw new PacioliException("cannot compile file '%s':\n\n%s", fileName, e);
        }

    }

    private static void interpretCommand(String fileName) throws MVMException {

        File file = new File(fileName);

        if (!file.exists()) {
            throw new MVMException("Error: file '%s' does not exist.", fileName);
        }

        Pacioli.logln1("Interpreting file '%s'", fileName);

        try {
            interpretMVMText(Utils.readFile(new File(fileName)));
        } catch (IOException e) {
            throw new MVMException("\nError: cannot interpret file '%s':\n\n%s", fileName, e);
        }

    }

    private static void typesCommand(String fileName, List<File> libs) throws PacioliException {

        File file = locatePacioliFile(fileName, libs);

        if (file == null) {
            throw new PacioliException("Error: file '%s' does not exist.", fileName);
        }

        Pacioli.logln1("Displaying types for file '%s'", file);
        Program program = new Program(libraryDirectories(libs));

        try {

            Pacioli.logln2("Loading module '%s'", file.getPath());
            program.load(file);
            Pacioli.logln2("Displaying types in module '%s'", file.getPath());
            program.checkTypes();

        } catch (IOException e) {
            Pacioli.logln("\nError: cannot display types in file '%s':\n\n%s", fileName, e);
        }

    }

    private static void infoCommand(List<File> libs) {

        logln("Pacioli v0.3.2");

        logln("\nSettings");
        logln("  verbosity=%s", verbosity);
        logln("  warnings=%s", warnings);
        logln("  debug=%s", debug);
        for (String fun : tracedFunctions) {
            logln("  trace=%s", fun);
        }
        logln("  traceall=%s", traceAll);
        logln("\nLibrary paths", warnings);
        for (File file : libraryDirectories(libs)) {
            logln("  %s", file);
            File[] files = file.listFiles(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    return name.toLowerCase().endsWith(".pacioli");
                }
            });
            for (File lib : files) {
                logln("    %s", lib.getName());
            }

        }
        logln("\nPaul Griffioen 2013 - 2015");
    }

    private static void helpCommand() {

        logln("\nSyntax: pacioli COMMAND [OPTION]...FILE...  with COMMAND one of:");
        logln("   run           runs a pacioli file");
        logln("   compile       compiles a pacioli file");
        logln("   interpret     interprets an mvm file compiled earlier from a pacioli file");
        logln("   types         displays infered types for a pacioli file or library");
        logln("   info          displays information about this compiler and installation");
        logln("   help          displays this help information");
        logln("\n");
        logln("Options (where applicable)");
        logln("   -lib X        Adds directory X to the library paths");
        logln("   -target       sets the compilation target to one of 'mvm' (default) 'javascript' or 'matlab'");
        logln("   -verbosity X  sets the verbosity to X (default 1)");
        logln("                   0 - no messages");
        logln("                   1 - progress messages");
        logln("                   2 - detailed messages");
        logln("                   3 - too detailed messages");
        logln("   -debug        toggles stack traces on or off");
        logln("   -trace X      turns tracing on for function X");
        logln("   -traceall     toggles tracing of all functions on or off");
        logln("   -warnings     toggles compiler warnings on or off");
    }

    /*
     * Utilities
     */
    private static void displayError(String text) {
        logln("Invalid command: %s", text);
        logln("\nType 'pacioli help' for help");
    }

    private static void interpretMVMText(String code) throws MVMException {
        Machine vm = new Machine();
        try {
            vm.init();
            vm.run(code, System.out);
        } catch (MVMException ex) {
            if (2 < verbosity || debug) {
                logln("\nState when error occured:");
                vm.dumpTypes();
                vm.dumpState();
            }
            throw ex;
        }
    }

    private static File locatePacioliFile(String fileName, List<File> directories) {

        File file = new File(fileName);
        if (file.exists()) {
            return file;
        } else {
            for (File dir : directories) {
                file = new File(dir, fileName);
                if (file.exists()) {
                    return file;
                }
                file = new File(dir, fileName + ".pacioli");
                if (file.exists()) {
                    return file;
                }
            }
        }
        return null;
    }

    private static List<File> libraryDirectories(List<File> libs) {
        LinkedList<File> libDirs = new LinkedList<File>();
        for (File lib : libs) {
            if (lib.isDirectory()) {
                libDirs.addFirst(lib);
            } else {
                Pacioli.warn("Skipping non existing library directory '%s'", lib);
            }
        }
        return libDirs;
    }

    public static void log(String string, Object... args) {

        String text = String.format(string, args);

        if (!text.isEmpty()) {
            atLineStart = false;
        }

        if (System.console() == null) {
            System.out.print(text);
        } else {
            System.console().format("%s", text);
        }
    }

    public static void logln(String string, Object... args) {

        if (!atLineStart) {
            log("\n");
            atLineStart = true;
        }

        log(string, args);
    }

    public static void log1(String string, Object... args) {
        if (1 <= verbosity) {
            log(string, args);
        }
    }

    public static void log2(String string, Object... args) {
        if (2 <= verbosity) {
            log(string, args);
        }
    }

    public static void log3(String string, Object... args) {
        if (3 <= verbosity) {
            log(string, args);
        }
    }

    public static void logln1(String string, Object... args) {
        if (1 <= verbosity) {
            logln(string, args);
        }
    }

    public static void logln2(String string, Object... args) {
        if (2 <= verbosity) {
            logln(string, args);
        }
    }

    public static void logln3(String string, Object... args) {
        if (3 <= verbosity) {
            logln(string, args);
        }
    }

    public static void warn(String string, Object... args) {
        if (warnings) {
            logln("Warning: ");
            log(string, args);
        }
    }
}
