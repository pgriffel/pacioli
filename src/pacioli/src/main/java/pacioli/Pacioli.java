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
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

import org.apache.commons.io.FilenameUtils;

import mvm.MVMException;
import mvm.Machine;
import pacioli.compiler.Bundle;
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.PacioliException;
import pacioli.compiler.PacioliFile;
import pacioli.compiler.PrimitivesDocumentation;
import pacioli.compiler.Program;
import pacioli.compiler.Project;
import pacioli.compiler.CompilationSettings.Target;

/**
 * The main entry point of the compiler.
 *
 * The code mainly handles PacioliFile, Program and Project objects.
 */
public class Pacioli {

    // Constants
    private static String OPTIONS_FILE = "compiler.options";
    private static String VERSION = "v0.5.0-SNAPSHOT";

    // Internal settings for log messages. Actual values depend on values in the
    // options file.
    public static class Options {
        public static boolean trace = false;
        public static boolean showFileLoads = false;
        public static boolean showSymbolTableAdditions = false;
        public static boolean showResolvingDetails = false;
        public static boolean showIncludeSearches = false;
        public static boolean showTypeInference = false;
        public static boolean showTypeInferenceDetails = false;
        public static boolean showTypeReductions = false;
        public static boolean showClassRewriting = false;
        public static boolean dumpOnMVMError = true;
        public static boolean showGeneratingCode = false;
        public static boolean showModifiedFiles = false;
        public static boolean printTypesAsString = false;
        public static boolean wrapTypes = false;
        public static boolean rewriteTypes = false;
        public static boolean includePrivate = true;
    }

    // Remember if user output is at the beginning of a line. Used when printing
    // output.
    private static boolean atLineStart = true;

    /**
     * Main entry point
     */
    public static void main(String[] args) throws Exception {
        try {
            handleArgs(args);
        } catch (PacioliException ex) {
            println("\nPacioli error:\n\n%s\n", ex.messageWithLocation());
        } catch (RuntimeException ex) {
            if (ex.getCause() == null) {
                println("\nUnexpected error:\n\n");
                ex.printStackTrace();
            } else {
                Throwable cause = ex.getCause();
                if (cause instanceof PacioliException) {
                    println("\nPacioli error:\n\n%s\n\n%s\n", ex.getLocalizedMessage(),
                            ((PacioliException) cause).messageWithLocation());
                } else if (cause instanceof MVMException) {
                    println("\nMVM error:\n\n%s\n", cause.getMessage());
                } else {
                    println("\nUnexpected error:\n\n");
                    cause.printStackTrace();
                }
            }
        } catch (MVMException ex) {
            println("\nMVM error:\n\n%s\n", ex.getMessage());
        } catch (Exception ex) {
            println("\nUnexpected error:\n\n");
            ex.printStackTrace();
        }
    }

    private static void handleArgs(String[] args) throws Exception {

        if (args.length == 0) {
            displayError("expected a command");
        } else {

            // Command line info that is passed to the command handlers
            String command = "";
            List<String> files = new ArrayList<String>();
            List<File> libs = new ArrayList<File>();
            CompilationSettings settings = new CompilationSettings();

            // Load options first
            loadOptionsFile();

            // Collect the command line info
            int i = 0;
            while (i != args.length) {
                String arg = args[i++];
                if (arg.equals("-lib")) {
                    if (i < args.length) {
                        libs.add(new File(args[i++]));
                    } else {
                        displayError("Expected path after -lib. Ignoring lib option.");
                    }
                } else if (arg.equals("-target")) {
                    if (i < args.length) {
                        String target = args[i++];
                        if (target.equals("javascript")) {
                            settings.setTarget(Target.JS);
                        } else if (target.equals("matlab")) {
                            settings.setTarget(Target.MATLAB);
                        } else if (target.equals("mvm")) {
                            settings.setTarget(Target.MVM);
                        } else if (target.equals("python")) {
                            settings.setTarget(Target.PYTHON);
                        } else {
                            throw new RuntimeException(
                                    "Compilation target " + target + " unknown. Expected javascript, matlab or mvm.");
                        }
                    } else {
                        displayError("Expected 'mvm', 'javascript' or 'matlab' after -target. Ignoring target option.");
                    }
                } else if (arg.equals("-kind")) {
                    if (i < args.length) {
                        settings.setKind(args[i++]);
                    } else {
                        displayError("Expected 'single', 'recursive' or 'bundle' after -kind. Ignoring kind option.");
                    }
                } else if (arg.equals("-trace")) {
                    if (i < args.length) {
                        settings.traceName(args[i++]);
                    } else {
                        displayError("Expected function name after -trace. Ignoring trace option.");
                    }
                } else if (arg.equals("-traceall")) {
                    settings.toggleTraceAll();
                } else if (arg.equals("-debug")) {
                    settings.toggleDebug();
                    ;
                } else if (command.isEmpty()) {
                    command = arg;
                } else {
                    files.add(arg);
                }
            }

            // Check that the passed library directories exist
            for (File lib : libs) {
                if (!lib.isDirectory()) {
                    displayError(String.format("Library directory '%s' does not exist", lib));
                }
            }

            // Handle the command
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
                    interpretCommand(file, libs);
                }
            } else if (command.equals("compile")) {
                if (files.isEmpty()) {
                    displayError("No files to compile.");
                }
                for (String file : files) {
                    compileCommand(file, libs, settings);
                }
            } else if (command.equals("clean")) {
                if (files.isEmpty()) {
                    displayError("No files to clean.");
                }
                for (String file : files) {
                    cleanCommand(file, libs, settings);
                }
            } else if (command.equals("parse")) {
                if (files.isEmpty()) {
                    displayError("No files to parse.");
                }
                for (String file : files) {
                    parseCommand(file, libs);
                }
            } else if (command.equals("desugar")) {
                if (files.isEmpty()) {
                    displayError("No files to desugar.");
                }
                for (String file : files) {
                    desugarCommand(file, libs);
                }
            } else if (command.equals("types")) {
                if (files.isEmpty()) {
                    displayError("No files to read.");
                }
                for (String file : files) {
                    typesCommand(file, libs, Options.rewriteTypes, Options.includePrivate);
                }
            } else if (command.equals("api")) {
                if (files.isEmpty()) {
                    displayError("No files to read.");
                }
                for (String file : files) {
                    apiCommand(file, libs);
                }
            } else if (command.equals("baseapi")) {
                if (files.isEmpty()) {
                    displayError("No files to read.");
                }
                for (String file : files) {
                    baseApiCommand(file, libs);
                }
            } else if (command.equals("graph") || command.equals("symbols")) {
                debugCommand(command, files, libs);
            } else if (command.equals("help")) {
                helpCommand();
            } else if (command.equals("info")) {
                infoCommand(libs);
            } else {
                displayError(String.format("Command '%s' unknown", command));
            }
        }

        log("");
    }

    private static void loadOptionsFile() {

        try (FileInputStream fis = new FileInputStream(OPTIONS_FILE)) {
            Properties prop = new Properties();
            prop.load(fis);
            prop.forEach((k, v) -> {
                String key = (String) k;
                String value = (String) v;
                if (key.equals("trace")) {
                    Options.trace = Boolean.parseBoolean(value);
                } else if (key.equals("showFileLoads")) {
                    Options.showFileLoads = Boolean.parseBoolean(value);
                } else if (key.equals("showSymbolTableAdditions")) {
                    Options.showSymbolTableAdditions = Boolean.parseBoolean(value);
                } else if (key.equals("showResolvingDetails")) {
                    Options.showResolvingDetails = Boolean.parseBoolean(value);
                } else if (key.equals("showTypeInferenceDetails")) {
                    Options.showTypeInferenceDetails = Boolean.parseBoolean(value);
                } else if (key.equals("showIncludeSearches")) {
                    Options.showIncludeSearches = Boolean.parseBoolean(value);
                } else if (key.equals("showModifiedFiles")) {
                    Options.showModifiedFiles = Boolean.parseBoolean(value);
                } else if (key.equals("showGeneratingCode")) {
                    Options.showGeneratingCode = Boolean.parseBoolean(value);
                } else if (key.equals("showTypeInference")) {
                    Options.showTypeInference = Boolean.parseBoolean(value);
                } else if (key.equals("printTypesAsString")) {
                    Options.printTypesAsString = Boolean.parseBoolean(value);
                } else if (key.equals("showTypeReductions")) {
                    Options.showTypeReductions = Boolean.parseBoolean(value);
                } else if (key.equals("includePrivate")) {
                    Options.includePrivate = Boolean.parseBoolean(value);
                } else if (key.equals("dumpOnMVMError")) {
                    Options.dumpOnMVMError = Boolean.parseBoolean(value);
                } else if (key.equals("showClassRewriting")) {
                    Options.showClassRewriting = Boolean.parseBoolean(value);
                } else if (key.equals("rewriteTypes")) {
                    Options.rewriteTypes = Boolean.parseBoolean(value);
                } else {
                    println("Skipping unknown option '%s'", key);
                }
            });
        } catch (FileNotFoundException ex) {
        } catch (IOException ex) {
            String s = Paths.get("").toAbsolutePath().toString();
            println("Error while loading file 'compiler.options' in directory '%s'", s);
            println(ex.getLocalizedMessage());
        }
    }

    /*
     * Commands
     */

    private static void parseCommand(String fileName, List<File> libs)
            throws Exception {

        Integer version = 0; // todo
        Optional<PacioliFile> optionalFile = PacioliFile.get(fileName, version);

        if (!optionalFile.isPresent()) {
            throw new PacioliException("Cannot parse: file '%s' does not exist.", fileName);
        } else {
            PacioliFile file = optionalFile.get();
            log("Parsing file '%s'", file);
            Program program = Program.load(file);
            println("%s", program.ast().pretty());
        }
    }

    private static void desugarCommand(String fileName, List<File> libs)
            throws Exception {

        Integer version = 0; // todo
        Optional<PacioliFile> file = PacioliFile.get(fileName, version);

        if (!file.isPresent()) {
            throw new PacioliException("Cannot desugar: file '%s' does not exist.", fileName);
        } else {
            log("Desugaring file '%s'", file);
            Program program = Program.load(file.get());
            println("%s", program.desugar().ast().pretty());
        }
    }

    private static void typesCommand(String fileName, List<File> libs, boolean rewriteTypes, boolean includePrivate)
            throws Exception {

        Integer version = 0; // todo
        Optional<PacioliFile> optionalFile = PacioliFile.get(fileName, version);

        if (!optionalFile.isPresent()) {
            optionalFile = PacioliFile.findLibrary(FilenameUtils.removeExtension(new File(fileName).getName()), libs);
        }

        if (!optionalFile.isPresent()) {
            throw new PacioliException("Error: file '%s' does not exist.", fileName);
        }

        PacioliFile file = optionalFile.get();

        log("Displaying types for file '%s'\n", file.fsFile());

        try {
            Project.load(file, libs).loadBundle().printTypes(rewriteTypes, includePrivate, false);

        } catch (IOException e) {
            println("\nError: cannot display types in file '%s':\n\n%s", fileName, e);
        }

    }

    private static void apiCommand(String fileName, List<File> libs)
            throws Exception {

        Integer version = 0; // TODO, see below
        Optional<PacioliFile> optionalFile = PacioliFile.get(fileName, version);

        if (!optionalFile.isPresent()) {
            optionalFile = PacioliFile.findLibrary(FilenameUtils.removeExtension(new File(fileName).getName()), libs);
        }

        if (!optionalFile.isPresent()) {
            throw new PacioliException("Error: file '%s' does not exist.", fileName);
        }

        PacioliFile file = optionalFile.get();

        try {
            Project project = Project.load(file, libs);
            List<File> includes = new ArrayList<>();
            project.includeTree(file).forEach(x -> {
                includes.add(x.fsFile());
            });
            project.loadBundle().printAPI(includes, "dev"); // TODO: version, see above

        } catch (IOException e) {
            println("\nError: cannot generate api for file '%s':\n\n%s", fileName, e);
        }

    }

    private static void baseApiCommand(String dirName, List<File> libs)
            throws Exception {
        new PrimitivesDocumentation(dirName, libs).generate();
    }

    private static void cleanCommand(String fileName, List<File> libs, CompilationSettings settings)
            throws Exception {
        throw new RuntimeException("Todo: clean command");
    }

    private static void compileCommand(String fileName, List<File> libs, CompilationSettings settings)
            throws Exception {

        Integer version = 0;
        Optional<PacioliFile> optionalFile = PacioliFile.get(fileName, version);
        String kind = settings.kind();

        if (!optionalFile.isPresent()) {
            throw new PacioliException("Cannot compile: file '%s' does not exist.", fileName);
        } else {
            PacioliFile file = optionalFile.get();
            if (kind.equals("bundle")) {
                log("Creating bundle for file '%s'", file);
                Project project = Project.load(file, libs);
                bundle(project, settings);
            } else if (kind.equals("single")) {
                compile(file, libs, settings);
            } else if (kind.equals("recursive")) {

            } else {
                throw new PacioliException("Cannot compile: kind '%s' is not one of single, recursive or bundle.",
                        kind);
            }
        }
    }

    private static void interpretCommand(String fileName, List<File> libs) throws Exception {

        File file = new File(fileName).getAbsoluteFile();

        if (!file.exists()) {
            throw new MVMException("Error: file '%s' does not exist.", fileName);
        }

        log("Interpreting file '%s'", fileName);

        interpretMVMText(new File(fileName), libs);
    }

    private static void runCommand(String fileName, List<File> libs, CompilationSettings settings) throws Exception {

        log("Running file '%s'", fileName);

        // Locate the file
        Integer version = 0; // todo
        Optional<PacioliFile> file = PacioliFile.get(fileName, version);

        // Check that it exists
        if (!file.isPresent()) {
            throw new PacioliException("Error: file '%s' does not exist.", fileName);
        }

        // If so, compile and run it
        try {
            Project project = Project.load(file.get(), libs);

            List<PacioliFile> modifiedFiles = project.modifiedFiles(settings.target());
            if (modifiedFiles.size() > 0) {
                Pacioli.logIf(Pacioli.Options.showModifiedFiles, "Found modified files");
                for (PacioliFile modified : modifiedFiles) {
                    Pacioli.logIf(Pacioli.Options.showModifiedFiles, "    %s", modified.fsFile());
                }
                log("Compiling file '%s'", file.get().fsFile());
                bundle(project, settings);
            }
            Path mvmFile = project.bundlePath(Target.MVM);
            log("Running mvm file '%s'\n", mvmFile);
            interpretMVMText(mvmFile.toFile(), libs);

        } catch (IOException e) {
            throw new PacioliException("Cannot run file '%s':\n\n%s", file.get().fsFile().getPath(), e);
        }
    }

    private static void debugCommand(String command, List<String> fileNames, List<File> libs) throws Exception {

        for (String fileName : fileNames) {

            Integer version = 0; // todo
            Optional<PacioliFile> optionalFile = PacioliFile.get(fileName, version);

            if (!optionalFile.isPresent()) {
                optionalFile = PacioliFile.findLibrary(FilenameUtils.removeExtension(new File(fileName).getName()),
                        libs);
            }

            if (!optionalFile.isPresent()) {
                throw new PacioliException("Error: file '%s' does not exist.", fileName);
            }

            PacioliFile file = optionalFile.get();

            log("Displaying symbol tables for file '%s'", file.fsFile());

            try {
                Project project = Project.load(file, libs);
                project.printInfo();
                project.loadBundle().printSymbolTables();
            } catch (IOException e) {
                println("\nError while printing info and symbol tables for file '%s':\n\n%s", fileName, e);
            }
        }

    }

    private static void infoCommand(List<File> libs) {

        println("Pacioli %s", VERSION);

        println("\nLibraries passed with the -lib option are:");
        for (File file : libs) {
            println("  %s", file);

            File[] libraries = file.listFiles(File::isDirectory);
            for (File lib : libraries) {
                println("    %s", lib.getName());
            }

        }

        String s = Paths.get("").toAbsolutePath().toString();
        println("\nThe compiler looks for dev options in file 'compiler.options' in directory %s. The current options are:",
                s);

        println("trace=%s", Options.trace);
        println("showFileLoads=%s", Options.showFileLoads);
        println("showSymbolTableAdditions=%s", Options.showSymbolTableAdditions);
        println("showResolvingDetails=%s", Options.showResolvingDetails);
        println("showIncludeSearches=%s", Options.showIncludeSearches);
        println("showTypeInference=%s", Options.showTypeInference);
        println("showTypeInferenceDetails=%s", Options.showTypeInferenceDetails);
        println("showTypeReductions=%s", Options.showTypeReductions);
        println("showClassRewriting=%s", Options.showClassRewriting);
        println("dumpOnMVMError=%s", Options.dumpOnMVMError);
        println("showGeneratingCode=%s", Options.showGeneratingCode);
        println("showModifiedFiles=%s", Options.showModifiedFiles);
        println("showModifiedFiles=%s", Options.showModifiedFiles);
        println("printTypesAsString=%s", Options.printTypesAsString);
        println("rewriteTypes=%s", Options.rewriteTypes);
        println("includePrivate=%s", Options.includePrivate);

        println("\nPaul Griffioen 2013 - 2023");
    }

    private static void helpCommand() {

        println("\nSyntax: pacioli COMMAND [OPTION]...FILE...  with COMMAND one of:");
        println("   run           runs a pacioli file");
        println("   compile       compiles a pacioli file");
        println("   interpret     interprets an mvm file compiled earlier from a pacioli file");
        println("   types         displays inferred types for a pacioli file or library");
        println("   parse         prints the code as it is parsed");
        println("   desugar       prints the code as it is parsed and desugared");
        println("   api           generates documentation");
        println("   info          displays information about this compiler and installation");
        println("   help          displays this help information");
        println("\n");
        println("Options (where applicable)");
        println("   -lib X        Adds directory X to the library paths");
        println("   -target       sets the compilation target to one of 'mvm' (default) 'javascript' or 'matlab'");
        println("   -debug        toggles stack traces on or off");
        println("   -trace X      turns tracing on for function X");
        println("   -traceall     toggles tracing of all functions on or off");
    }

    /*
     * Helpers
     */

    /**
     * Create a bundle from the project files.
     * 
     * @param settings
     *                 Compiler settings
     * @return The path where the bundle was saved.
     * @throws Exception
     */
    private static Path bundle(Project project, CompilationSettings settings) throws Exception {

        Path dstPath = project.bundlePath(settings.target());

        Bundle bundle = project.loadBundle();

        try (PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(dstPath.toFile())))) {

            bundle.generateCode(writer, settings);

        }

        return dstPath;
    }

    public static void compile(PacioliFile file, List<File> libs, CompilationSettings settings) throws Exception {

        log("Compiling file '%s'", file);

        // Load the file
        // Progam program = Progam.load(file, Phase.TYPED);

        // TODO: move to load!?
        // program.liftStatements();

        // Generate the code
        StringWriter s = new StringWriter();
        try (PrintWriter writer = new PrintWriter(s)) {
            // TODO: replace by bundle generate code
            // program.generateCode(writer, settings);
        }
        print("%s", s.toString());
    }

    private static void interpretMVMText(File file, List<File> libs) throws Exception {

        Machine vm = new Machine();
        try {
            vm.init();
            vm.run(file, System.out, libs);
        } catch (Exception ex) {
            if (Options.dumpOnMVMError) {
                println("\nState when error occured:");
                vm.dumpTypes();
                vm.dumpState();
            }
            throw ex;
        }
    }

    // private static void checkPrimitives(List<File> libs) throws Exception {

    // PacioliFile libFile = PacioliFile.requireLibrary("base", libs);
    // Progam program = Progam.load(libFile);
    // List<ValueInfo> allInfos = program.values.allInfos();
    // List<String> names = new ArrayList<String>();
    // for (ValueInfo info : allInfos) {
    // if (info.generalInfo().getModule().equals("base")) {
    // names.add(info.globalName());
    // }
    // }

    // Machine vm = new Machine();
    // vm.init();
    // Set<String> keys = vm.store.keySet();
    // List<String> keyList = new ArrayList<String>(keys);

    // List<String> keyListCopy = new ArrayList<String>(keyList);
    // keyList.removeAll(names);

    // names.removeAll(keyListCopy);

    // Collections.sort(names);
    // Collections.sort(keyList);

    // println("\nMissing in base.pacioli:");
    // for (String key : keyList) {
    // println("%s", key);
    // }

    // println("\nMissing in machine:");
    // for (String key : names) {
    // println("%s", key);
    // }

    // log("\nDone");
    // }

    /**
     * Primitive for user output. Used by println, log, logIf, trace and warn.
     */
    public static void print(String string, Object... args) {

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

    /**
     * Display a message to the user. Starts with a newline if needed. Contrary to
     * the log function, te message is always displayed, even if verbosity is zero.
     * 
     * @param string
     *               A format string
     * @param args
     *               Format arguments
     */
    public static void println(String string, Object... args) {

        if (!atLineStart) {
            print("\n");
            atLineStart = true;
        }

        print(string, args);
        print("\n");
        atLineStart = true;
    }

    /**
     * Display a log message to the user. Starts with a newline if needed. Does not
     * display the message if verbosity is zero.
     * 
     * @param string
     *               A format string
     * @param args
     *               Format arguments
     */
    public static void log(String string, Object... args) {
        println(string, args);
    }

    /**
     * Conditionally display a message to the user. Starts with a newline if needed.
     * Does not display the message if verbosity is zero.
     * 
     * @param show
     *               Show the message if true
     * @param string
     *               A format string
     * @param args
     *               Format arguments
     */
    public static void logIf(boolean show, String string, Object... args) {
        if (show) {
            log(string, args);
        }
    }

    /**
     * Logs a line if the trace option is on. Show detailed compiler actions for
     * debugging purposes. Does not display the message if verbosity is zero.
     * 
     * @param string
     *               A format string
     * @param args
     *               Format arguments
     */
    public static void trace(String string, Object... args) {
        logIf(Options.trace,
                "[TRACE "
                        + new SimpleDateFormat("HH:mm:ss.SSS").format(Calendar.getInstance().getTime())
                        + "] "
                        + string,
                args);
    }

    /**
     * Local utility for displaying command line errors to the user.
     * 
     * @param text
     *             The messaeg to display
     */
    private static void displayError(String text) {
        println("Invalid command: %s", text);
        println("\nType 'pacioli help' for help");
    }

}
