package pacioli;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.io.FilenameUtils;
import org.jgrapht.graph.AsSubgraph;
import org.jgrapht.graph.DefaultDirectedGraph;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.graph.EdgeReversedGraph;
import org.jgrapht.traverse.DepthFirstIterator;
import org.jgrapht.traverse.TopologicalOrderIterator;

import pacioli.CompilationSettings.Target;
import pacioli.ast.ImportNode;
import pacioli.ast.IncludeNode;
import pacioli.ast.ProgramNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.parser.Parser;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.TypeSymbolInfo;
import pacioli.symboltable.ValueInfo;

/**
 * The Project class's purpose is to compile and bundle a file with all its
 * includes and dependencies.
 */
public class Project {

    public static Path bundlePath(File file, Target target) {
        return Paths.get(FilenameUtils.removeExtension(file.getPath()) + "." + PacioliFile.targetFileExtension(target));
    }

    private final PacioliFile file;
    private final List<File> libs;
    private final DefaultDirectedGraph<PacioliFile, DefaultEdge> graph;

    private Project(PacioliFile file, List<File> libs, DefaultDirectedGraph<PacioliFile, DefaultEdge> graph)
            throws Exception {
        this.file = file;
        this.libs = libs;
        this.graph = graph;
    }

    /**
     * Constructor for a project.
     * 
     * @param file
     *             The root file.
     * @param libs
     *             The paths where libraries are installed
     * @return The constructed project
     * @throws Exception
     */
    public static Project load(PacioliFile file, List<File> libs) throws Exception {
        return new Project(file, libs, projectGraph(file, libs));
    }

    /**
     * Path of the target file for the project bundle.
     * 
     * @param target
     *               A compilation terget
     * @return The path corresponding with the target
     */
    public Path bundlePath(Target target) {
        return bundlePath(file.getFile(), target);
    }

    /**
     * Checks the modified date of all project files and returns the files that are
     * older than the previously generated bundle. TODO: handle case when no bundle
     * exists!
     * 
     * @param target The type of bundle that is generated (MVM, JavaScript, etc.)
     * @return All modified files
     */
    public List<PacioliFile> modifiedFiles(Target target) {
        List<PacioliFile> files = new ArrayList<>();
        for (PacioliFile file : graph.vertexSet()) {
            if (file.getFile().lastModified() > bundlePath(target).toFile().lastModified()) {
                files.add(file);
            }
        }
        return files;
    }

    /**
     * The root file of the project.
     * 
     * @return The root file.
     */
    PacioliFile root() {
        Optional<PacioliFile> optionalFile = graph.vertexSet().stream().findAny();
        if (optionalFile.isPresent()) {
            PacioliFile file = optionalFile.get();
            Optional<DefaultEdge> optionalOutgoing = graph.outgoingEdgesOf(file).stream().findAny();
            while (optionalOutgoing.isPresent()) {
                file = graph.getEdgeTarget(optionalOutgoing.get());
                optionalOutgoing = graph.outgoingEdgesOf(file).stream().findAny();
            }
            return file;
        } else {
            throw new RuntimeException("Cannot find project root. Project graph is empty.");
        }
    }

    /**
     * The root file of the project.
     * 
     * @return The root file.
     */
    PacioliFile libRoot(PacioliFile include) {
        Optional<PacioliFile> optionalFile = graph.vertexSet().stream().findAny();
        if (!include.isLibrary()) {
            throw new RuntimeException("Cannot find lib root.");
        }
        if (optionalFile.isPresent()) {
            AsSubgraph<PacioliFile, DefaultEdge> includesOnly = new AsSubgraph<PacioliFile, DefaultEdge>(graph,
                    graph.vertexSet(), graph.edgeSet().stream().filter(edge -> graph.getEdgeSource(edge).isInclude())
                            .collect(Collectors.toSet()));
            PacioliFile file = optionalFile.get();
            Optional<DefaultEdge> optionalOutgoing = includesOnly.outgoingEdgesOf(file).stream().findAny();
            while (optionalOutgoing.isPresent()) {
                file = graph.getEdgeTarget(optionalOutgoing.get());
                optionalOutgoing = graph.outgoingEdgesOf(file).stream().findAny();
            }
            return file;
        } else {
            throw new RuntimeException("Cannot find lib root.");
        }
    }

    /**
     * The bundle graph's nodes in toplogical order. Can only be user once!
     * 
     * The iterator wrapper allows for loops, etc.
     * 
     * @return An iterator
     */
    Iterable<PacioliFile> orderedFiles() {
        Iterator<PacioliFile> iterator = new TopologicalOrderIterator<>(graph);
        Iterable<PacioliFile> iter = new Iterable<PacioliFile>() {
            public Iterator<PacioliFile> iterator() {
                return iterator;
            }
        };
        return iter;
    }

    Iterable<PacioliFile> includeTree(PacioliFile root) {
        AsSubgraph<PacioliFile, DefaultEdge> includesOnly = new AsSubgraph<PacioliFile, DefaultEdge>(graph,
                graph.vertexSet(), graph.edgeSet().stream().filter(edge -> graph.getEdgeSource(edge).isInclude())
                        .collect(Collectors.toSet()));
        Iterator<PacioliFile> iterator = new DepthFirstIterator<PacioliFile, DefaultEdge>(
                new EdgeReversedGraph<PacioliFile, DefaultEdge>(includesOnly), root);
        Iterable<PacioliFile> iter = new Iterable<PacioliFile>() {
            public Iterator<PacioliFile> iterator() {
                return iterator;
            }
        };
        return iter;
    }

    /**
     * Create a bundle from the project files.
     * 
     * @param settings
     *                 Compiler settings
     * @return The path where the bundle was saved.
     * @throws Exception
     */
    public Path bundle(CompilationSettings settings) throws Exception {

        Path dstPath = bundlePath(settings.getTarget());

        Pacioli.log("Creating bundle for file '%s'", file);

        Bundle bundle = loadBundle();

        try (PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(dstPath.toFile())))) {

            bundle.generateCode(writer, settings);

        }

        Pacioli.log("Created bundle '%s'", dstPath);

        return dstPath;
    }

    public void printTypes(boolean rewriteTypes, boolean includePrivate, boolean showDoc) throws Exception {
        Bundle bundle = loadBundle();
        bundle.printTypes(rewriteTypes, includePrivate, showDoc);
    }

    public void generateAPI(String version) throws Exception {
        Bundle bundle = loadBundle();
        List<File> includes = new ArrayList<>();
        includeTree(file).forEach(x -> {
            includes.add(x.getFile());
        });
        bundle.printAPI(includes, version);
    }

    /**
     * Hack to generate API for base. In base there are no definitions.
     * 
     * TODO: come up with a hack for the function parameters. Just generate a, b, c,
     * ... of sufficient length? Project.load(file, libs).generateBaseAPI("dev"); //
     * 
     * @param version
     * @throws Exception
     */
    public void generateBaseAPI(String version) throws Exception {
        Progam program = Progam.load(PacioliFile.findLibrary("base", libs).get());
        DocumentationGenerator generator = new DocumentationGenerator("base", version);
        for (ValueInfo info : program.values.allInfos()) {
            if (info.isPublic()) {
                generator.addFunction(info.name(), List.of(), info.getDeclaredType().get().pretty(),
                        info.getDocu().orElse(""));
            }
        }
        generator.generate();
    }

    /**
     * Print the project graph. For debugging.
     */
    public void printInfo() {
        Pacioli.println("\nProject graph:");
        for (DefaultEdge edge : graph.edgeSet()) {
            Pacioli.println("- edge %s\n    -> %s", graph.getEdgeSource(edge), graph.getEdgeTarget(edge));
        }

        AsSubgraph<PacioliFile, DefaultEdge> includesOnly = new AsSubgraph<PacioliFile, DefaultEdge>(graph,
                graph.vertexSet(), graph.edgeSet().stream().filter(edge -> graph.getEdgeSource(edge).isInclude())
                        .collect(Collectors.toSet()));

        Pacioli.println("\nProject root = %s", root());

        Pacioli.println("\nLibrary dependencies:");
        for (PacioliFile node : graph.vertexSet().stream()
                .collect(Collectors.filtering(x -> x.isLibrary() && !x.isInclude(), Collectors.toSet()))) {
            Pacioli.println("%-40s %-40s", node.getModule(), node.getFile());
            Iterator<PacioliFile> iterator = new DepthFirstIterator<PacioliFile, DefaultEdge>(
                    new EdgeReversedGraph<PacioliFile, DefaultEdge>(includesOnly), node);
            while (iterator.hasNext()) {
                PacioliFile file = iterator.next();
                Pacioli.println("- %-40s %-10s %-10s", file.getModule(), file.isLibrary() ? "lib" : "usr",
                        file.getFile());

            }
            Pacioli.println("\n");
        }

        Pacioli.println("\nProject files depth first:");
        orderedFiles().forEach(file -> {
            Pacioli.println("- %-40s %-10s %-10s", file.getModule(), file.isLibrary() ? "lib" : "usr", file.getFile());
        });

        Pacioli.println("\n");
    }

    private Bundle loadBundle() throws Exception {

        Bundle bundle = Bundle.empty(file, libs);

        bundle.addPrimitiveTypes();

        for (PacioliFile current : orderedFiles()) {

            Progam program = Progam.load(current);

            // Filter the bundle's total symbol tables for the directly used modules of the
            // program
            List<String> importedModules = importedModules(program);
            List<String> includedModules = includedModules(program);
            Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Imported modules = %s", importedModules);
            Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Included modules = %s", includedModules);
            SymbolTable<ValueInfo> vTable = bundle.programValueTable(importedModules, includedModules);
            SymbolTable<TypeSymbolInfo> tTable = bundle.programTypeTable(importedModules, includedModules);

            // Analyse the code given the imported and included infos
            program.loadRest(new PacioliTable(vTable, tTable));

            // Add the program's info's to the bundle's total symbol tables
            bundle.load(program, current.equals(file));
        }

        return bundle;
    }

    private List<String> importedModules(Progam program) {

        List<String> modules = new ArrayList<String>();

        // Collect all libraries
        ArrayList<PacioliFile> allLibs = new ArrayList<PacioliFile>();
        allLibs.add(PacioliFile.requireLibrary("base", libs));
        allLibs.add(PacioliFile.requireLibrary("standard", libs));
        for (PacioliFile pacioliFile : findImports(program.program, libs)) {
            allLibs.add(pacioliFile);
        }

        // Locate all files in the libraries and collect the module names
        for (PacioliFile lib : graph.vertexSet().stream()
                .collect(Collectors.filtering(x -> allLibs.contains(x), Collectors.toSet()))) {
            for (PacioliFile file : includeTree(lib)) {
                modules.add(file.getModule());
            }
        }

        return modules;
    }

    private List<String> includedModules(Progam program) {

        List<String> modules = new ArrayList<String>();

        // Locate all included files and collect the module names
        for (PacioliFile include : findIncludes(program.file, program.program)) {
            modules.add(include.getModule());
        }

        return modules;
    }

    /**
     * Constructs the project graph
     * 
     * @param file
     *             The root file.
     * @param libs
     *             The paths where libraries are installed
     * @return The graph
     * @throws Exception
     */
    private static DefaultDirectedGraph<PacioliFile, DefaultEdge> projectGraph(PacioliFile file, List<File> libs)
            throws Exception {

        // The libraries to include in each file
        PacioliFile standard = PacioliFile.requireLibrary("standard", libs);
        PacioliFile base = PacioliFile.requireLibrary("base", libs);

        // The graph that will be build up
        DefaultDirectedGraph<PacioliFile, DefaultEdge> graph = new DefaultDirectedGraph<>(DefaultEdge.class);

        // Main loop variables. List todo contains include files still to process.
        // List done contains all processed files to avoid duplicates and cycles.
        List<PacioliFile> todo = new ArrayList<PacioliFile>();
        List<PacioliFile> done = new ArrayList<PacioliFile>();

        todo.add(file);

        while (!todo.isEmpty()) {

            PacioliFile current = todo.get(0);
            todo.remove(0);

            // Process the current file if not already done
            if (!done.contains(current)) {

                // Load the current file
                ProgramNode programNode = Parser.parseFile(current.getFile());

                // Add the current file to the graph if not already found by some include
                if (!graph.containsVertex(current)) {
                    graph.addVertex(current);
                }

                // Locate the imports. Add the base lib unless this is the base lib. Add the
                // standard lib unless this is the base lib or the standard lib
                ArrayList<PacioliFile> allLibs = new ArrayList<PacioliFile>(findImports(programNode, libs));
                if (!current.equals(base)) {
                    allLibs.add(base);
                }
                // if (!current.equals(standard) && !current.equals(base)) {
                if (!current.getFile().toPath().startsWith(standard.getFile().getParentFile().toPath())
                        && !current.equals(base)) {
                    allLibs.add(standard);
                }

                for (PacioliFile pacioliFile : allLibs) {

                    // Add the include files to the todo list
                    if (!done.contains(pacioliFile) && !todo.contains(pacioliFile)) {
                        todo.add(pacioliFile);
                    }

                    // Add the included file to the graph if not already a member
                    if (!graph.containsVertex(pacioliFile)) {
                        graph.addVertex(pacioliFile);
                    }

                    // Add an edge for the include relation
                    graph.addEdge(pacioliFile, current);

                }

                for (PacioliFile pacioliFile : findIncludes(current, programNode)) {

                    // Add the include files to the todo list
                    if (!done.contains(pacioliFile) && !todo.contains(pacioliFile)) {
                        todo.add(pacioliFile);
                    }

                    // Add the included file to the graph if not already a member
                    if (!graph.containsVertex(pacioliFile)) {
                        graph.addVertex(pacioliFile);
                    }

                    // Add an edge for the include relation
                    graph.addEdge(pacioliFile, current);

                }

                // Remember that this include was processed.
                done.add(current);
            }
        }

        return graph;
    }

    /**
     * Locates all direct import in the program. Throws an exception if an imported
     * library cannot be found.
     * 
     * @param libs
     *             The directories where libraries are located
     * @return A list of files
     * @throws PacioliException
     */
    private static List<PacioliFile> findImports(ProgramNode program, List<File> libs) throws PacioliException {
        List<PacioliFile> libraries = new ArrayList<PacioliFile>();
        for (ImportNode node : program.imports) {
            String name = node.name.valueString();
            Optional<PacioliFile> library = PacioliFile.findLibrary(name, libs);
            if (!library.isPresent()) {
                throw new PacioliException(node.getLocation(),
                        "Import '%s' not found in directories %s",
                        name, libs);
            } else {
                libraries.add(library.get());
            }

        }
        return libraries;
    }

    /**
     * Locates all direct includes in the program. Throws an exception if an
     * included
     * file cannot be found.
     * 
     * @return A list of files
     * @throws PacioliException
     */
    private static List<PacioliFile> findIncludes(PacioliFile file, ProgramNode program) throws PacioliException {
        List<PacioliFile> includes = new ArrayList<PacioliFile>();
        for (IncludeNode node : program.includes) {
            String name = node.name.valueString();
            Optional<PacioliFile> pacioliFile = file.findInclude(name);
            if (!pacioliFile.isPresent()) {
                throw new PacioliException(node.getLocation(),
                        "Include '%s' for file '%s' not found",
                        name, file);
            } else {
                includes.add(pacioliFile.get());
            }

        }
        return includes;
    }

}
