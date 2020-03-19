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
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.io.FilenameUtils;

import mvm.MVMException;
import mvm.Machine;
import pacioli.CompilationSettings.Target;
import pacioli.Progam.Phase;
import pacioli.symboltable.ValueInfo;

/**
 * The main entry point of the compiler.
 *
 * The code mainly handles PacioliFile, Program and Project objects.
 */
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
                    logln("\nPacioli error:\n%s\n%s\n", ex, ((PacioliException) cause).getLocatedMessage());
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

            //boolean compileDebug = debug || traceAll || !tracedFunctions.isEmpty();
            //CompilationSettings settings = new CompilationSettings(compileDebug, traceAll, tracedFunctions);
            
            libs = libraryDirectories(libs);
            
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

        Integer version = 0;
        Optional<PacioliFile> optionalFile = PacioliFile.get(fileName, version);
        
        if (!optionalFile.isPresent()) {
            throw new PacioliException("Cannot parse: file '%s' does not exist.", fileName);    
        } else {
            PacioliFile file = optionalFile.get();
            Pacioli.logln1("Parsing file '%s'", file);            
            Progam program = Progam.load(file, libs, Phase.PARSED);
            Pacioli.logln("%s", program.pretty());
        }
    }
    
    private static void desugarCommand(String fileName, List<File> libs)
            throws Exception {

        Integer version = 0;
        Optional<PacioliFile> file = PacioliFile.get(fileName, version);

        if (!file.isPresent()) {
            throw new PacioliException("Cannot desugar: file '%s' does not exist.", fileName);    
        } else {
            Pacioli.logln1("Desugaring file '%s'", file);            
            Progam program = Progam.load(file.get(), libs, Phase.DESUGARED);
            Pacioli.logln("%s", program.pretty());
        }
    }
    
    private static void typesCommand(String fileName, List<File> libs) throws Exception {

        checkPrimitives(libs);
        
        Integer version = 0;
        Optional<PacioliFile> optionalFile = PacioliFile.get(fileName, version);

        if (!optionalFile.isPresent()) {
            optionalFile = PacioliFile.findLibrary(FilenameUtils.removeExtension(new File(fileName).getName()), libs);
        }
        
        if (!optionalFile.isPresent()) {
            throw new PacioliException("Error: file '%s' does not exist.", fileName);
        }

        PacioliFile file = optionalFile.get();
        
        //PacioliFile file = file.get
        Pacioli.logln1("Displaying types for file '%s'", file.getFile());

        try {
            
            Pacioli.logln2("Loading module '%s'", file.getFile());
            //Progam program = Progam.load(file, libs, Phase.TYPED);
            Progam program = Progam.load(file, libs, Phase.RESOLVED);

            program.printSymbolTable(program.values, "Values");
            Pacioli.logln("%s", program.pretty());
            
            Pacioli.logln2("Displaying types in module '%s'", file.getFile());
            //program.printTypes();
            
            

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

        Integer version = 0;
        Optional<PacioliFile> optionalFile = PacioliFile.get(fileName, version);
        
        if (!optionalFile.isPresent()) {
            throw new PacioliException("Cannot compile: file '%s' does not exist.", fileName);    
        } else {
            PacioliFile file = optionalFile.get();
            if (kind.equals("bundle")) {
                Project project = Project.load(file, libs);
                project.bundle(settings, settings.getTarget());
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

        Pacioli.logln1("Interpreting file '%s'", fileName);

        interpretMVMText(new File(fileName), libs);
    }
    
    private static void runCommand(String fileName, List<File> libs, CompilationSettings settings) throws Exception {
        
        Pacioli.logln1("Running file '%s'", fileName);

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
            
            if (project.targetOutdated(Target.MVM)) {
                Pacioli.logln1("Compiling file '%s'", file.get().getFile());
                project.bundle(settings, Target.MVM);
            }
            Path mvmFile = project.bundlePath(Target.MVM);
            Pacioli.logln1("Running mvm file '%s'", mvmFile);
            interpretMVMText(mvmFile.toFile(), libs);

        } catch (IOException e) {
            throw new PacioliException("Cannot run file '%s':\n\n%s", file.get().getFile().getPath(), e);
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
        for (File file : libs) {
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
                
                Integer version = 0;
                Optional<PacioliFile> file = PacioliFile.get(fileName, version);
                assert(file.isPresent());
                Project project = Project.load(file.get(), libs);
                
                //project.printInfo();
                project.bundle(settings, Target.MVM);
                
                Path binName = project.bundlePath(Target.MVM);
                
                Pacioli.logln("Running file %s", binName);
                interpretMVMText(binName.toFile(), libs);
                
            } catch (IOException e) {
                Pacioli.logln("\nError in sample '%s':\n\n%s", sample, e);
            }
            
            logln("--------------------------------------------------------------------------------");            
        }
    }

    /*
     * Helpers
     */
    
    static List<File> libraryDirectories(List<File> libs) {
        LinkedList<File> libDirs = new LinkedList<File>();
        for (File lib : libs) {
            if (lib.isDirectory()) {
                libDirs.add(lib);
            } else {
                Pacioli.warn("Skipping non existing library directory '%s'", lib);
            }
        }
        return libDirs;
    }

    public static void compile(PacioliFile file, List<File> libs, CompilationSettings settings) throws Exception {
        
        //Pacioli.logln1("Compiling file '%s'", file);
        
        // Load the file
        Progam program = Progam.load(file, libs, Phase.TYPED);
        
        // Setup a writer for the output file
        PrintWriter writer = null;       
        StringWriter s = new StringWriter();
        
        try {
            
            // Open the writer
            writer = new PrintWriter(s);
            
            // Generate the code for the entire bundle
            //Pacioli.logln2("Loading file '%s'", file);
            program.generateCode(writer, settings);
            
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
    
    private static void checkPrimitives(List<File> libs) throws Exception {
        
        PacioliFile libFile = PacioliFile.requireLibrary("base", libs);
        Progam program = new Progam(libFile, libs);
        program.loadTillHelper(Phase.RESOLVED, false, false);
        List<ValueInfo> allInfos = program.values.allInfos();
        List<String> names = new ArrayList<String>();
        for (ValueInfo info: allInfos) {
            //Pacioli.logln(name);
            if (info.generic().getModule().equals("base")) {
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
        
        
        logln("\nMissing in base.pacioli:");
        for (String key: keyList) {
            logln("%s", key);
        };
        logln("\nMissing in machine:");
        for (String key: names) {
            logln("%s", key);
        };
        logln("\nDone");
    }

    /*
     * Utilities
     */
    
    private static void displayError(String text) {
        logln("Invalid command: %s", text);
        logln("\nType 'pacioli help' for help");
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
