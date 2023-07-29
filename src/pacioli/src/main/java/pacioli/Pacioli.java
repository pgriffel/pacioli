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
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.io.FilenameUtils;

import mvm.MVMException;
import mvm.Machine;
import pacioli.ast.ProgramNode;
import pacioli.misc.CompilationSettings;
import pacioli.misc.PacioliException;
import pacioli.misc.PacioliFile;
import pacioli.misc.PrimitivesDocumentation;
import pacioli.misc.Progam;
import pacioli.misc.Project;
import pacioli.misc.CompilationSettings.Target;
import pacioli.parser.Parser;
import pacioli.symboltable.ValueInfo;

/**
 * The main entry point of the compiler.
 *
 * The code mainly handles PacioliFile, Program and Project objects.
 */
public class Pacioli {

    // Internal settings for log messages. Actual values depend on verbosity.
    public static class Options {
        public static boolean trace = false;
        public static boolean showFileLoads = false;
        public static boolean showSymbolTableAdditions = false;
        public static boolean showResolvingDetails = false;
        public static boolean showIncludeSearches = false;
        public static boolean logTypeInference = false;
        public static boolean logTypeInferenceDetails = false;
        public static boolean showTypeReductions = false;
        public static boolean showClassRewriting = true;
        public static boolean dumpOnMVMError = true;
        public static boolean logGeneratingCode = false;
        public static boolean showModifiedFiles = false;
        public static boolean wrapTypes = false;
    }

    // User settings for log messages. See the various methods for printing and
    // logging.
    private static int verbosity = 1;
    private static boolean warnings = true;

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
            println("\nPacioli error:\n\n%s\n", ex.getLocatedMessage());
        } catch (RuntimeException ex) {
            if (ex.getCause() == null) {
                println("\nUnexpected error:\n\n");
                ex.printStackTrace();
            } else {
                Throwable cause = ex.getCause();
                if (cause instanceof PacioliException) {
                    println("\nPacioli error:\n\n%s\n\n%s\n", ex.getLocalizedMessage(),
                            ((PacioliException) cause).getLocatedMessage());
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
            boolean rewriteTypes = false;
            boolean includePrivate = true;

            // Collect the command line info
            int i = 0;
            while (i != args.length) {
                String arg = args[i++];
                if (arg.equals("-verbosity")) {
                    if (i < args.length) {
                        String verbosityArg = args[i++];
                        try {
                            verbosity = Integer.valueOf(verbosityArg);
                        } catch (Exception ex) {
                            displayError(String.format("invalid verbosity number: '%s'. Ignoring verbosity option.",
                                    verbosityArg));
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
                } else if (arg.equals("-rewrite")) {
                    rewriteTypes = !rewriteTypes;
                } else if (arg.equals("-private")) {
                    includePrivate = !includePrivate;
                } else if (arg.equals("-warnings")) {
                    warnings = !warnings;
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

            // Set options given the verbosity
            if (verbosity > 1) {
                Options.showFileLoads = true;
                Options.showModifiedFiles = true;
            }
            if (verbosity > 2) {
                Options.trace = true;
            }
            if (verbosity > 3) {
                Options.showSymbolTableAdditions = true;
                Options.showResolvingDetails = true;
                Options.showIncludeSearches = true;
                Options.logTypeInference = true;
                Options.logTypeInferenceDetails = true;
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
                    typesCommand(file, libs, rewriteTypes, includePrivate);
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
            } else if (command.equals("test")) {
                testCommand(libs, settings);
            } else if (command.equals("info")) {
                infoCommand(libs);
            } else {
                displayError(String.format("Command '%s' unknown", command));
            }
        }

        log("");
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
            ProgramNode program = Parser.parseFile(file.getFile());
            println("%s", program.pretty());
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
            Progam program = Progam.load(file.get());
            println("%s", program.pretty());
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

        log("Displaying types for file '%s'\n", file.getFile());

        try {
            Project.load(file, libs).printTypes(rewriteTypes, includePrivate, true);
            // Project.load(file, libs).printCode(rewriteTypes, includePrivate, true);

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
            Project.load(file, libs).generateAPI("dev"); // TODO: version, see above
        } catch (IOException e) {
            println("\nError: cannot display types in file '%s':\n\n%s", fileName, e);
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
        String kind = settings.getKind();

        if (!optionalFile.isPresent()) {
            throw new PacioliException("Cannot compile: file '%s' does not exist.", fileName);
        } else {
            PacioliFile file = optionalFile.get();
            if (kind.equals("bundle")) {
                Project project = Project.load(file, libs);
                project.bundle(settings);
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

            List<PacioliFile> modifiedFiles = project.modifiedFiles(settings.getTarget());
            if (modifiedFiles.size() > 0) {
                Pacioli.logIf(Pacioli.Options.showModifiedFiles, "Found modified files");
                for (PacioliFile modified : modifiedFiles) {
                    Pacioli.logIf(Pacioli.Options.showModifiedFiles, "    %s", modified.getFile());
                }
                log("Compiling file '%s'", file.get().getFile());
                project.bundle(settings);
            }
            Path mvmFile = project.bundlePath(Target.MVM);
            log("Running mvm file '%s'\n", mvmFile);
            interpretMVMText(mvmFile.toFile(), libs);

        } catch (IOException e) {
            throw new PacioliException("Cannot run file '%s':\n\n%s", file.get().getFile().getPath(), e);
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

            log("Displaying symbol tables for file '%s'", file.getFile());

            try {
                Project project = Project.load(file, libs);
                project.printInfo();
                project.printSymbolTables();
            } catch (IOException e) {
                println("\nError while printing info and symbol tables for file '%s':\n\n%s", fileName, e);
            }
        }

    }

    private static void infoCommand(List<File> libs) {

        println("Pacioli v0.5.0-SNAPSHOT");

        println("\nSettings");
        println("  verbosity=%s", 1);
        println("  warnings=%s", warnings);

        println("\nLibrary paths");
        for (File file : libs) {
            println("  %s", file);
            File[] files = file.listFiles(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    return name.toLowerCase().endsWith(".pacioli");
                }
            });
            for (File lib : files) {
                println("    %s", lib.getName());
            }

        }
        println("\nPaul Griffioen 2013 - 2023");
    }

    private static void helpCommand() {

        println("\nSyntax: pacioli COMMAND [OPTION]...FILE...  with COMMAND one of:");
        println("   run           runs a pacioli file");
        println("   compile       compiles a pacioli file");
        println("   interpret     interprets an mvm file compiled earlier from a pacioli file");
        println("   types         displays inferred types for a pacioli file or library");
        println("   info          displays information about this compiler and installation");
        println("   help          displays this help information");
        println("\n");
        println("Options (where applicable)");
        println("   -lib X        Adds directory X to the library paths");
        println("   -target       sets the compilation target to one of 'mvm' (default) 'javascript' or 'matlab'");
        println("   -verbosity X  sets the verbosity to X (default 1)");
        println("                   0 - no messages");
        println("                   1 - progress messages");
        println("                   2 - detailed messages");
        println("                   3 - too detailed messages");
        println("   -debug        toggles stack traces on or off");
        println("   -trace X      turns tracing on for function X");
        println("   -traceall     toggles tracing of all functions on or off");
        println("   -warnings     toggles compiler warnings on or off");
    }

    private static void testCommand(List<File> libs, CompilationSettings settings) throws Exception {

        checkPrimitives(libs);

        String dir = "E:/code/private/pacioli-samples/";

        List<String> samples = Arrays.asList(
                "abstract-resource/abstract-resource.pacioli",
                "adt/adt.pacioli",
                "adt/adt_use.pacioli",
                "alias/alias.pacioli",
                "apply_mag/apply_mag.pacioli",
                // "biglist/biglist.pacioli", // okay but slow
                // "blas/blas.pacioli", // experiment
                "blocks/blocks.pacioli",
                "bom/bom.pacioli",
                "commodity/commodity.pacioli",
                "convolution/convolution.pacioli",
                "dice/dice.pacioli",
                "do/do.pacioli",
                "empty/empty.pacioli",
                "envelope/envelope.pacioli",
                "fourier-motzkin/fourier_motzkin.pacioli",
                "fourier-motzkin/quad.pacioli",
                "gcd/gcd.pacioli",
                "gcd/gcd_test.pacioli",
                // "geom/geom.pacioli", // experiment with type app in type literal
                "good/good.pacioli",
                "grass/grass.pacioli",
                "hello_world/hello_world.pacioli",
                // "holtzman/holtzman.pacioli", // obsolete
                "indexing/indexing.pacioli",
                "intro/intro.pacioli",
                "kirchhof/kirchhof.pacioli",
                "klein/klein.pacioli",
                "krylov/krylov.pacioli",
                // "loop/loop.pacioli", // Problem resolving and lifting nested statements!!!
                "magic/magic.pacioli",
                "math/math.pacioli",
                "minijava/minijava.pacioli",
                "net/net.pacioli",
                // "oops/oops.pacioli",
                "power/power.pacioli",
                "precedence/precedence.pacioli",
                "queue/queue.pacioli",
                "random/random.pacioli",
                "resource/resource.pacioli",
                "runtime_types/runtime_types.pacioli",
                "series/series.pacioli",
                "service/service.pacioli",
                // "shock_tube/shock_tube.pacioli", // works, but slow
                // "soda/soda.pacioli", // obsolete
                "solver/solver.pacioli",
                // "statement/statement.pacioli",
                // "test/test.pacioli",
                "shells/shells.pacioli",
                "numpy/numpy_test.pacioli");

        // samples = Arrays.asList("inference/inference.pacioli");

        for (String sample : samples) {
            println(sample);
            println("--------------------------------------------------------------------------------");
            try {
                String fileName = dir + sample;

                Integer version = 0;
                Optional<PacioliFile> file = PacioliFile.get(fileName, version);
                assert (file.isPresent());
                Project project = Project.load(file.get(), libs);

                // project.printInfo();
                // settings.setTarget(Target.PYTHON);
                // project.bundle(settings);

                settings.setTarget(Target.MVM);
                project.bundle(settings);

                Path binName = project.bundlePath(Target.MVM);

                // todo: load rest
                Progam.load(project.root()).printTypes();
                ;
                log("Running file %s", binName);
                interpretMVMText(binName.toFile(), libs);

            } catch (IOException e) {
                println("\nError in sample '%s':\n\n%s", sample, e);
            }

            println("--------------------------------------------------------------------------------");
        }
    }

    /*
     * Helpers
     */

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

    private static void checkPrimitives(List<File> libs) throws Exception {

        PacioliFile libFile = PacioliFile.requireLibrary("base", libs);
        Progam program = Progam.load(libFile);
        List<ValueInfo> allInfos = program.values.allInfos();
        List<String> names = new ArrayList<String>();
        for (ValueInfo info : allInfos) {
            if (info.generalInfo().getModule().equals("base")) {
                names.add(info.globalName());
            }
        }

        Machine vm = new Machine();
        vm.init();
        Set<String> keys = vm.store.keySet();
        List<String> keyList = new ArrayList<String>(keys);

        List<String> keyListCopy = new ArrayList<String>(keyList);
        keyList.removeAll(names);

        names.removeAll(keyListCopy);

        Collections.sort(names);
        Collections.sort(keyList);

        println("\nMissing in base.pacioli:");
        for (String key : keyList) {
            println("%s", key);
        }

        println("\nMissing in machine:");
        for (String key : names) {
            println("%s", key);
        }

        log("\nDone");
    }

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
        if (verbosity > 0) {
            println(string, args);
        }
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
        logIf(Options.trace, string, args);
    }

    /**
     * Display a warning to the user if the warning options is on. Does not
     * display the message if verbosity is zero.
     * 
     * @param string
     *               A format string
     * @param args
     *               Format arguments
     */
    public static void warn(String string, Object... args) {
        if (warnings) {
            log("Warning: ");
            log(string, args);
        }
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
