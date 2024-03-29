package pacioli.compiler;

import java.io.File;
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

import pacioli.Pacioli;
import pacioli.ast.ImportNode;
import pacioli.ast.IncludeNode;
import pacioli.ast.ProgramNode;
import pacioli.compiler.CompilationSettings.Target;
import pacioli.parser.Parser;
import pacioli.symboltable.PacioliTable;

/**
 * The Project class's purpose is to compile and bundle a file with all its
 * includes and dependencies. It finds all directly and indirectly dependent
 * files and builds a Bundle from all definitions in them.
 */
public class Project {

    private final PacioliFile file;
    private final List<File> libs;
    private final DefaultDirectedGraph<PacioliFile, DefaultEdge> graph;

    private Project(PacioliFile file, List<File> libs, DefaultDirectedGraph<PacioliFile, DefaultEdge> graph)
            throws Exception {
        this.file = file;
        this.libs = libs;
        this.graph = graph;
    }

    public File findDocFile() {
        return this.file.findDocFile();
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
        return Paths.get(FilenameUtils.removeExtension(this.file.fsFile().getPath()) + "."
                + PacioliFile.targetFileExtension(target));
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
            if (file.fsFile().lastModified() > bundlePath(target).toFile().lastModified()) {
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
    public PacioliFile root() {
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

    public Iterable<PacioliFile> includeTree(PacioliFile root) {
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
            Pacioli.println("%-40s %-40s", node.module(), node.fsFile());
            Iterator<PacioliFile> iterator = new DepthFirstIterator<PacioliFile, DefaultEdge>(
                    new EdgeReversedGraph<PacioliFile, DefaultEdge>(includesOnly), node);
            while (iterator.hasNext()) {
                PacioliFile file = iterator.next();
                Pacioli.println("- %-40s %-10s %-10s", file.module(), file.isLibrary() ? "lib" : "usr",
                        file.fsFile());

            }
            Pacioli.println("\n");
        }

        Pacioli.println("\nProject files depth first:");
        orderedFiles().forEach(file -> {
            Pacioli.println("- %-40s %-10s %-10s", file.module(), file.isLibrary() ? "lib" : "usr", file.fsFile());
        });

        Pacioli.println("\n");
    }

    public Bundle loadBundle() throws Exception {

        Pacioli.trace("Loading module '%s'", this.file.moduleName());

        Bundle bundle = Bundle.empty(file, libs);

        bundle.addPrimitiveTypes();

        for (PacioliFile current : orderedFiles()) {

            // Parse the file
            Program program = Program.load(current).desugar();

            // Filter the bundle's total symbol tables for the directly used modules of the
            // program
            PacioliTable env = bundle.visibleInfos(
                    importedModules(program.ast()),
                    includedModules(current, program.ast()));

            // Analyze the code and add the result to the bundle
            bundle.load(program.analyze(env), current.equals(file));
        }

        return bundle;
    }

    private List<String> importedModules(ProgramNode programNode) {

        List<String> modules = new ArrayList<String>();

        // Collect all libraries
        ArrayList<PacioliFile> allLibs = new ArrayList<PacioliFile>();
        allLibs.add(PacioliFile.requireLibrary("base", libs));
        allLibs.add(PacioliFile.requireLibrary("standard", libs));
        for (PacioliFile pacioliFile : findImports(programNode, libs)) {
            allLibs.add(pacioliFile);
        }

        // Locate all files in the libraries and collect the module names
        for (PacioliFile lib : graph.vertexSet().stream()
                .collect(Collectors.filtering(x -> allLibs.contains(x), Collectors.toSet()))) {
            for (PacioliFile file : includeTree(lib)) {
                modules.add(file.module());
            }
        }

        return modules;
    }

    private List<String> includedModules(PacioliFile file, ProgramNode programNode) {

        List<String> modules = new ArrayList<String>();

        // Locate all included files and collect the module names
        for (PacioliFile include : findIncludes(file, programNode)) {
            modules.add(include.module());
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
                ProgramNode programNode = Parser.parseFile(current.fsFile());

                // Add the current file to the graph if not already found by some include
                if (!graph.containsVertex(current)) {
                    graph.addVertex(current);
                }

                // Locate the imports. Add the base lib unless this is the base lib. Add the
                // standard lib unless this is the base lib or the standard lib
                ArrayList<PacioliFile> allLibs = new ArrayList<PacioliFile>(findImports(programNode, libs));
                boolean isBase = current.fsFile().toPath().startsWith(base.fsFile().getParentFile().toPath());
                boolean isStandard = current.fsFile().toPath().startsWith(standard.fsFile().getParentFile().toPath());
                if (!isBase) {
                    allLibs.add(base);
                }
                // if (!current.equals(standard) && !current.equals(base)) {
                if (!isStandard && !isBase) {
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
        for (ImportNode node : program.imports()) {
            String name = node.name.valueString();
            Optional<PacioliFile> library = PacioliFile.findLibrary(name, libs);
            if (!library.isPresent()) {
                throw new PacioliException(node.location(),
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
        for (IncludeNode node : program.includes()) {
            String name = node.name.valueString();
            Optional<PacioliFile> pacioliFile = file.findInclude(name);
            if (!pacioliFile.isPresent()) {
                throw new PacioliException(node.location(),
                        "Include '%s' for file '%s' not found",
                        name, file);
            } else {
                includes.add(pacioliFile.get());
            }

        }
        return includes;
    }

}
