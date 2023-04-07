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
import pacioli.Progam.Phase;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.TypeSymbolInfo;
import pacioli.symboltable.ValueInfo;

/**
 * The Project class's purpose is to compile and bundle a file with all its
 * includes and dependencies.
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

    /**
     * Path of the target file for the project bundle.
     * 
     * @param target
     *            A compilation terget
     * @return The path corresponding with the target
     */
    public Path bundlePath(Target target) {
        return bundlePath(file.getFile(), target);
    }

    public boolean targetOutdated(Target target) {
        for (PacioliFile file : graph.vertexSet()) {
            if (file.getFile().lastModified() > bundlePath(target).toFile().lastModified()) {
                return true;
            }
        }
        return false;
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

    private List<String> usedModules(Progam program) {

        List<String> modules = new ArrayList<String>();

        // Collect all libraries
        ArrayList<PacioliFile> allLibs = new ArrayList<PacioliFile>();
        allLibs.add(PacioliFile.requireLibrary("base", libs));
        allLibs.add(PacioliFile.requireLibrary("standard", libs));
        for (PacioliFile pacioliFile : program.findImports(libs)) {
            allLibs.add(pacioliFile);
        }

        // Locate all files in the libraries and collect the module names
        for (PacioliFile lib : graph.vertexSet().stream()
                .collect(Collectors.filtering(x -> allLibs.contains(x), Collectors.toSet()))) {
            for (PacioliFile file : includeTree(lib)) {
                modules.add(file.getModule());
            }
        }

        // Locate all included files and collect the module names
        for (PacioliFile include : program.findIncludes()) {
            modules.add(include.getModule());
        }

        return modules;
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

    /**
     * Create a bundle from the project files.
     * 
     * @param settings
     *            Compiler settings
     * @return The path where the bundle was saved.
     * @throws Exception
     */
    public Path bundle(CompilationSettings settings) throws Exception {

        Path dstPath = bundlePath(settings.getTarget());

        Pacioli.log("Creating bundle for file '%s'", file);

        Bundle bundle = Bundle.empty(file, libs);

        Pacioli.trace("Adding primitives");
        bundle.addPrimitiveTypes();

        try (PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(dstPath.toFile())))) {

            for (PacioliFile current : orderedFiles()) {

                Progam program = Progam.load(current, Phase.DESUGARED);

                // Filter the bundle's total symbol tables for the directly used modules of the
                // program
                List<String> useModules = usedModules(program);
                SymbolTable<ValueInfo> vTable = bundle.programValueTable(useModules);
                SymbolTable<TypeSymbolInfo> tTable = bundle.programTypeTable(useModules);

                // Analyse the code given the imported and included infos
                program.loadRest(current, new PacioliTable(vTable, tTable));

                // Add the program's info's to the bundle's total symbol tables
                bundle.load(program);
            }

            bundle.generateCode(writer, settings);

        }

        Pacioli.log("Created bundle '%s'", dstPath);

        return dstPath;
    }

    public static Path bundlePath(File file, Target target) {
        return Paths.get(FilenameUtils.removeExtension(file.getPath()) + "." + PacioliFile.targetFileExtension(target));
    }

    /**
     * Constructor for a project.
     * 
     * @param file
     *            The root file.
     * @param libs
     *            The paths where libraries are installed
     * @return The constructed project
     * @throws Exception
     */
    public static Project load(PacioliFile file, List<File> libs) throws Exception {
        return new Project(file, libs, projectGraph(file, libs));
    }

    /**
     * Constructs the project graph
     * 
     * @param file
     *            The root file.
     * @param libs
     *            The paths where libraries are installed
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
                Progam program = Progam.load(current, Phase.PARSED);

                // Add the current file to the graph if not already found by some include
                if (!graph.containsVertex(current)) {
                    graph.addVertex(current);
                }

                // Locate the imports. Add the base lib unless this is the base lib. Add the
                // standard lib unless this is the base lib or the standard lib
                ArrayList<PacioliFile> allLibs = new ArrayList<PacioliFile>(program.findImports(libs));
                if (!program.file.equals(base)) {
                    allLibs.add(base);
                }
                if (!program.file.equals(standard) && !program.file.equals(base)) {
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
                    // graph.addEdge(current, pacioliFile);
                    graph.addEdge(pacioliFile, current);

                }

                for (PacioliFile pacioliFile : program.findIncludes()) {

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

    public void printTypes() throws Exception {

        Bundle bundle = Bundle.empty(file, libs);

        Pacioli.trace("Adding primitives");
        bundle.addPrimitiveTypes();

        for (PacioliFile current : orderedFiles()) {

            Progam program = Progam.load(current, Phase.DESUGARED);

            // Filter the bundle's total symbol tables for the directly used modules of the
            // program
            List<String> useModules = usedModules(program);
            SymbolTable<ValueInfo> vTable = bundle.programValueTable(useModules);
            SymbolTable<TypeSymbolInfo> tTable = bundle.programTypeTable(useModules);

            // Analyse the code given the imported and included infos
            program.loadRest(current, new PacioliTable(vTable, tTable));

            // Add the program's info's to the bundle's total symbol tables
            bundle.load(program);
        }

        bundle.printTypes();

    }

}
