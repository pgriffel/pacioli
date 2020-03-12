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
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.io.FilenameUtils;
import org.jgrapht.graph.DefaultDirectedGraph;
import org.jgrapht.graph.DefaultEdge;

import mvm.MVMException;
import mvm.Machine;
import pacioli.CompilationSettings.Target;
import pacioli.Progam.Phase;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;

public class Pacioli {

    public static int verbosity = 1;
    private static boolean warnings = false;
    private static boolean debug = false;
    private static boolean traceAll = false;
    private static final List<String> tracedFunctions = new ArrayList<String>();
    private static boolean atLineStart = false;

    public static void main(String[] args) throws Exception {
        try {
            handleArgs(args);
        } catch (PacioliException ex) {
            logln("\nPacioli error:\n\n%s\n", ex.getLocatedMessage());
        } catch (RuntimeException ex) {
            if (ex.getCause() == null) {
                logln("\nUnexpected error:\n\n");
                ex.printStackTrace();
            } else {
                Throwable cause = ex.getCause();
                if (cause instanceof PacioliException) {
                    logln("\nPacioli error:\n\n%s\n", ((PacioliException) cause).getLocatedMessage());
                } else if (cause instanceof MVMException) {
                    logln("\nMVM error:\n\n%s\n", cause.getMessage());
                } else {
                    logln("\nUnexpected error:\n\n");
                    cause.printStackTrace();
                }
            }
        } catch (MVMException ex) {
            logln("\nMVM error:\n\n%s\n", ex.getMessage());
        } catch (Exception ex) {
            logln("\nUnexpected error:\n\n");
            ex.printStackTrace();
        }
    }

    private static void handleArgs(String[] args) throws Exception {

        if (args.length == 0) {
            displayError("expected a command");
        } else {

            String command = "";
            List<String> files = new ArrayList<String>();
            CompilationSettings settings = new CompilationSettings();
            
            String target = "mvm";
            String kind = "bundle";
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
                        target = args[i++];
                        if (target.equals("javascript")) {
                            settings.setTarget(Target.JS);
                        } else if (target.equals("matlab")) {
                            settings.setTarget(Target.MATLAB);
                        } else if (target.equals("html")) {
                            throw new RuntimeException("Compilation target html is obsolete.");
                        } else if (target.equals("mvm")) {
                            settings.setTarget(Target.MVM);
                        } else {
                            throw new RuntimeException("Compilation target " + target + " unknown. Expected javascript, matlab or mvm.");
                        }
                    } else {
                        displayError("Expected 'mvm', 'javascript' or 'matlab' after -target. Ignoring target option.");
                    }
                } else if (arg.equals("-kind")) {
                    if (i < args.length) {
                        kind = args[i++];
                    } else {
                        displayError("Expected 'single', 'recursive' or 'bundle' after -kind. Ignoring kind option.");
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
            //CompilationSettings settings = new CompilationSettings(compileDebug, traceAll, tracedFunctions);

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
                    compileCommand(file, target, kind, libs, settings);
                }
            } else if (command.equals("clean")) {
                if (files.isEmpty()) {
                    displayError("No files to clean.");
                }
                for (String file : files) {
                    cleanCommand(file, target, kind, libs, settings);
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
                    typesCommand(file, libs);
                }
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

        logln("");
    }

    /*
     * Commands
     */

    private static void parseCommand(String fileName, List<File> libs)
            throws Exception {

        File file = locatePacioliFile(fileName, libs).getAbsoluteFile();

        if (file == null) {
            throw new PacioliException("Cannot parse: file '%s' does not exist.", fileName);    
        } else {
            Pacioli.logln1("Parsing file '%s'", file);
            Progam program = loadProgram(file, libs, Phase.parsed);
            Pacioli.logln("%s", program.pretty());
        }
    }
    
    private static void desugarCommand(String fileName, List<File> libs)
            throws Exception {

        File file = locatePacioliFile(fileName, libs).getAbsoluteFile();

        if (file == null) {
            throw new PacioliException("Cannot desugar: file '%s' does not exist.", fileName);    
        } else {
            Pacioli.logln1("Desugaring file '%s'", file);
            Progam program = loadProgram(file, libs, Phase.desugared);
            Pacioli.logln("%s", program.pretty());
        }
    }
    
    private static void typesCommand(String fileName, List<File> libs) throws Exception {

        File file = locatePacioliFile(fileName, libs);

        if (file == null) {
            throw new PacioliException("Error: file '%s' does not exist.", fileName);
        }
        
        file = file.getAbsoluteFile();

        Pacioli.logln1("Displaying types for file '%s'", file);

        try {

            Pacioli.logln2("Loading module '%s'", file.getPath());
            Progam program = loadProgram(file, libs, Phase.typed);

            Pacioli.logln2("Displaying types in module '%s'", file.getPath());
            program.printTypes();

        } catch (IOException e) {
            Pacioli.logln("\nError: cannot display types in file '%s':\n\n%s", fileName, e);
        }

    }
    
    private static void cleanCommand(String fileName, String target, String kind, List<File> libs, CompilationSettings settings)
            throws Exception {
        throw new RuntimeException("Todo: clean command");
    }
    
    private static void compileCommand(String fileName, String target, String kind, List<File> libs, CompilationSettings settings)
            throws Exception {

        File file = locatePacioliFile(fileName, libs).getAbsoluteFile();

        if (file == null) {
            throw new PacioliException("Cannot compile: file '%s' does not exist.", fileName);    
        } else {
            if (kind.equals("bundle")) {
                Project project = loadProject(file, libs);
                project.bundle(libs, settings, target);
            } else if (kind.equals("single")) {
                compile(file, libs, settings);
            } else if (kind.equals("recursive")) {
                /*
                Boolean force = false;
                Pacioli.logln1("Running file '%s'", fileName);
                Progam program = new Progam(file, libraryDirectories(libs));

                Pacioli.logln2("Compiling module '%s'", file.getPath());
                cleanStandardIncludes(libs, force);
                program.cleanMVMFiles(force);
                compileStandardIncludes(libs, settings);
                program.compileRec(settings, "mvm");

                Pacioli.logln2("Interpreting module '%s'", file.getPath());
                String mvmFile = program.baseName() + ".mvm";
                interpretMVMText(new File(mvmFile), libs); 
                */
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

        Pacioli.logln1("Interpreting file '%s'", fileName);

        interpretMVMText(new File(fileName), libs);
    }
    
    private static void runCommand(String fileName, List<File> libs, CompilationSettings settings) throws Exception {

        Pacioli.logln1("Running file '%s'", fileName);
        
        // Find the file
        File file = locatePacioliFile(fileName, libs);
        if (file == null || !file.exists()) {
            throw new PacioliException("Error: file '%s' does not exist.", fileName);
        }

        // Compile and run it
        try {
            
            Pacioli.logln1("Compiling file '%s'", file.getPath());
            
            Project project = loadProject(file, libs);
            project.bundle(libs, settings, "mvm");
            
            String mvmFile = Progam.fileBaseName(file) + "." + Progam.targetFileExtension("mvm");
            
            Pacioli.logln1("Running mvm file '%s'", mvmFile);
            
            interpretMVMText(new File(mvmFile), libs);

        } catch (IOException e) {
            throw new PacioliException("Cannot run file '%s':\n\n%s", file.getPath(), e);
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

    private static void testCommand(List<File> libs, CompilationSettings settings) throws Exception {

        String dir = "E:/code/private/pacioli-samples/";

        List<String> samples = Arrays.asList(
            "abstract-resource/abstract-resource.pacioli",
            "adt/adt.pacioli",
            "adt/adt_use.pacioli",
            //"alias/alias.pacioli",  // bugged, also in old version
            "apply_mag/apply_mag.pacioli",
            //"biglist/biglist.pacioli",  // okay but slow
            //"blas/blas.pacioli",  // bugged, also in old version
            "blocks/blocks.pacioli",
            "bom/bom.pacioli",
            "commodity/commodity.pacioli",
            "convolution/convolution.pacioli",
            "dice/dice.pacioli",
            "do/do.pacioli",
            //"empty/empty.pacioli",
            "envelope/envelope.pacioli",
            //"fourier-motzkin/fourier_motzkin.pacioli",
            //"fourier-motzkin/quad.pacioli",
            "gcd/gcd.pacioli",
            "gcd/gcd_test.pacioli",
            //"geom/geom.pacioli",  // bugged, also in old version
            "good/good.pacioli",
            "grass/grass.pacioli",
            "hello_world/hello_world.pacioli",
            "holtzman/holtzman.pacioli",
            //"huh/huh.pacioli",   // strange old bug
            "indexing/indexing.pacioli",
            "intro/intro.pacioli",
            //"kirchhof/kirchhof.pacioli",   // diagonal
            "klein/klein.pacioli",
            "krylov/krylov.pacioli",
            //"loop/loop.pacioli",  // bug introduced STATEMENTS
            "magic/magic.pacioli",
            "math/math.pacioli",
            "minijava/minijava.pacioli",
            //"net/net.pacioli",  // bug introduced MULTI LEVEL INCLUDES
            "oops/oops.pacioli",
            "power/power.pacioli",
            "precedence/precedence.pacioli",
            "queue/queue.pacioli",
            "random/random.pacioli",
            "resource/resource.pacioli",
            "runtime_types/runtime_types.pacioli",
            "series/series.pacioli",
            "service/service.pacioli",
            //"shock_tube/shock_tube.pacioli",  // works, but slow
            //"soda/soda.pacioli",
            //"solver/solver.pacioli",  // svd has changed
            //"statement/statement.pacioli",   // bugged, also in old version
            "test/test.pacioli",
            "shells/shells.pacioli"                
            );

        for (String sample : samples) {
            logln(sample);
            logln("--------------------------------------------------------------------------------");
            try {
                String fileName = dir + sample;
                File file = locatePacioliFile(fileName, libs).getAbsoluteFile();
                
                Project project = loadProject(file, libs);
                
                project.printInfo();
                project.bundle(libs, settings, "mvm");
                
                String binName = Progam.fileBaseName(file) + "." + Progam.targetFileExtension("mvm");
                Pacioli.logln("Running file %s", binName);
                interpretMVMText(new File(binName), libs);
                
            } catch (IOException e) {
                Pacioli.logln("\nError in sample '%s':\n\n%s", sample, e);
            }
            
            logln("--------------------------------------------------------------------------------");
        }
    }

    /*
     * Helpers
     */

    private static Project loadProject(File file, List<File> libs) throws Exception {
        return new Project(file, libs, projectGraph(file, libs));
    }
    
    static DefaultDirectedGraph<PacioliFile, DefaultEdge> projectGraph(File file, List<File> libs) throws Exception {

        // The graph that will be build up
        DefaultDirectedGraph<PacioliFile, DefaultEdge> graph = new DefaultDirectedGraph<>(DefaultEdge.class);
       
        // Main loop variables. List todo contains include files still to process.
        // List done contains all processed files to avoid duplicates and cycles.
        List<PacioliFile> todo = new ArrayList<PacioliFile>();
        List<PacioliFile> done = new ArrayList<PacioliFile>();
        
        // Initialize the loop by adding the file to the todo list
        Integer fileVersion = 0;
        String base = FilenameUtils.getBaseName(file.getName());
        File dir = file.getParentFile();
        Path p = Paths.get(file.getAbsolutePath());
        Path d = p.getParent();
        Path b = d.relativize(p);
        Pacioli.logln("rel p=%s b=%s", p, b);
                
        todo.add(new PacioliFile(file.getAbsoluteFile(), base, fileVersion, false, false));
        
        // Loop over the todo list, adding new include files when found
        while (!todo.isEmpty()) {

            // Take the first element of the todo list to process next
            PacioliFile current = todo.get(0);
            todo.remove(0);
            
            // Process the current file if not already done
            if (!done.contains(current)) {
                
                // Load the current file
                Progam program = loadProgramNew(current, libs, Phase.parsed);
                
                // Add the current file if not already found by some include
                if (!graph.containsVertex(current)) {
                    graph.addVertex(current);
                }
                
                for (String include : program.includes()) {
                    
                    // Locate the include file
                    PacioliFile pacioliFile = PacioliFile.findIncludeOrLibrary(d, current, include, libs);
                    if (pacioliFile == null) {
                        throw new RuntimeException(String.format("Include '%s' for file '%s' not found in directories %s", 
                                include, current, libs));
                    }
                    
                    // Add the include files to the todo list
                    if (!done.contains(pacioliFile) && !todo.contains(pacioliFile)) {
                        todo.add(pacioliFile);    
                    }
                    
                    // Add the included file to the graph if not already a member
                    if (!graph.containsVertex(pacioliFile)) {
                        graph.addVertex(pacioliFile);
                    }
                    
                    // Add an edge for the include relation
                    graph.addEdge(current, pacioliFile);
                    
                }

                // Remember that this include was processed.
                done.add(current);
            }
        }
        
        return graph;
    }    
    
    /* obsolete!!! */
    static Progam loadProgram(File file, List<File> libs, Phase phase) throws Exception {
        String base = FilenameUtils.getBaseName(file.getName());
        PacioliFile pacioliFile = new PacioliFile(file.getAbsoluteFile(), base, 0, false, false);
        Progam program = new Progam(pacioliFile, libraryDirectories(libs));
        program.loadTill(phase);
        return program;
    }
    
    static Progam loadProgramNew(PacioliFile file, List<File> libs, Phase phase) throws Exception {
        Progam program = new Progam(file, libraryDirectories(libs));
        program.loadTill(phase);
        return program;
    }
    
    /*
    private static void cleanStandardIncludes(List<File> libs, Boolean force) throws Exception {
        for (String include : PacioliFile.defaultsToCompile) {
            File file = PacioliFile.findIncludeFile(include, libs);
            Progam prog = new Progam(file, libs);
            prog.loadTill(Phase.parsed);
            prog.cleanMVMFiles(force);
        }
    }*/
/*
    private static void compileStandardIncludes(List<File> libs, CompilationSettings settings) throws Exception {
        for (String include : PacioliFile.defaultsToCompile) {
            File file = PacioliFile.findIncludeFile(include, libs);
            Progam prog = new Progam(file, libs);
            prog.loadTill(Phase.parsed);
            prog.compileRec(settings, "mvm");
        }
    }
*/
    static void printSymbolTable(SymbolTable<? extends SymbolInfo> table, String header) {
        Pacioli.logln("Begin %s table", header);
        for (String name : table.allNames()) {
            SymbolInfo info = table.lookup(name);
            Pacioli.logln("  %-25s %-15s %s %-50s %s", name, info.generic().getModule(),
                    info.generic().isExternal() ? "     " : "local", info.generic().file, info.getDefinition());
        }
        Pacioli.logln("End table");
    }

    public static void compile(File file, List<File> libs, CompilationSettings settings) throws Exception {
        
        //Pacioli.logln1("Compiling file '%s'", file);
        
        // Load the file
        //Pacioli.logln2("Loading file '%s'", file);
        Progam program = loadProgram(file, libs, Phase.typed);
        
        // Setup a writer for the output file
        PrintWriter writer = null;       
        StringWriter s = new StringWriter();
        
        try {
            
            // Open the writer
            writer = new PrintWriter(s);
            
            // Generate the code for the entire bundle
            //Pacioli.logln2("Loading file '%s'", file);
            program.generateCode(writer, settings, "yo");
            
        } finally {
            
            // Close the writer
            if (writer != null) {
                writer.close();
            }
        }
        //Pacioli.logln1("Created file '%s'", dstName);
        Pacioli.log("%s", s.toString());
    }
    
    private static void interpretMVMText(File file, List<File> libs) throws Exception {
        Machine vm = new Machine();
        try {
            vm.init();
            vm.run(file, System.out, libs);
        } catch (MVMException ex) {
            if (2 < verbosity || debug) {
                logln("\nState when error occured:");
                vm.dumpTypes();
                vm.dumpState();
            }
            throw ex;
        }
    }        

    /*
     * Utilities
     */
    
    private static void displayError(String text) {
        logln("Invalid command: %s", text);
        logln("\nType 'pacioli help' for help");
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

    static List<File> libraryDirectories(List<File> libs) {
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
