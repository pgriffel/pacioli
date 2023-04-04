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
import org.jgrapht.traverse.DepthFirstIterator;
import org.jgrapht.traverse.TopologicalOrderIterator;

import pacioli.CompilationSettings.Target;
import pacioli.Progam.Phase;
import pacioli.symboltable.PacioliTable;

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
     * @param target A compilation terget
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
            Optional<DefaultEdge> optionalIncoming = graph.incomingEdgesOf(file).stream().findAny();
            while (optionalIncoming.isPresent()) {
                file = graph.getEdgeSource(optionalIncoming.get());
                optionalIncoming = graph.incomingEdgesOf(file).stream().findAny();
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

    /**
     * Print the project graph. For debugging.
     */
    public void printInfo() {
        Pacioli.println("\nProject graph:");
        for (DefaultEdge edge : graph.edgeSet()) {
            Pacioli.println("- edge %s\n    -> %s", graph.getEdgeSource(edge), graph.getEdgeTarget(edge));
        }

        AsSubgraph<PacioliFile, DefaultEdge> includesOnly = new AsSubgraph<PacioliFile, DefaultEdge>(graph,
                graph.vertexSet(), graph.edgeSet().stream().filter(edge -> graph.getEdgeTarget(edge).isInclude())
                        .collect(Collectors.toSet()));

        for (PacioliFile node : graph.vertexSet().stream()
                .collect(Collectors.filtering(x -> x.isLibrary() && !x.isInclude(), Collectors.toSet()))) {
            Pacioli.println("%-40s %-40s", node.getModule(), node.getFile());
            Iterator<PacioliFile> iterator = new DepthFirstIterator<>(includesOnly, node);
            while (iterator.hasNext()) {
                PacioliFile file = iterator.next();
                // Pacioli.logln("- %s", file);
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
     * @param settings Compiler settings
     * @return The path where the bundle was saved.
     * @throws Exception
     */
    public Path bundle(CompilationSettings settings) throws Exception {

        Path dstPath = bundlePath(settings.getTarget());

        Pacioli.log("Creating bundle for file '%s'", file);

        Bundle bundle = Bundle.empty(file, libs);

        Pacioli.trace("Adding primitives");
        bundle.addPrimitiveTypes();

        for (String lib : PacioliFile.defaultIncludes) {
            Pacioli.trace("Loading default include'%s'", lib);
            PacioliFile libFile = PacioliFile.requireLibrary(lib, libs);
            Progam prog = Progam.load(libFile, libs, Phase.DESUGARED);
            prog.loadRest(libFile, new PacioliTable(bundle.valueTable, bundle.typeTable));
            bundle.load(prog);
        }

        try (PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(dstPath.toFile())))) {

            for (PacioliFile current : orderedFiles()) {
                Progam program = Progam.load(current, libs, Phase.DESUGARED);
                program.loadRest(current, new PacioliTable(bundle.valueTable, bundle.typeTable));
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
     * @param file The root file.
     * @param libs The paths where libraries are installed
     * @return The constructed project
     * @throws Exception
     */
    public static Project load(PacioliFile file, List<File> libs) throws Exception {
        return new Project(file, libs, projectGraph(file, libs));
    }

    /**
     * Constructs the project graph
     * 
     * @param file The root file.
     * @param libs The paths where libraries are installed
     * @return The graph
     * @throws Exception
     */
    private static DefaultDirectedGraph<PacioliFile, DefaultEdge> projectGraph(PacioliFile file, List<File> libs)
            throws Exception {

        // The graph that will be build up
        DefaultDirectedGraph<PacioliFile, DefaultEdge> graph = new DefaultDirectedGraph<>(DefaultEdge.class);

        // Main loop variables. List todo contains include files still to process.
        // List done contains all processed files to avoid duplicates and cycles.
        List<PacioliFile> todo = new ArrayList<PacioliFile>();
        List<PacioliFile> done = new ArrayList<PacioliFile>();

        todo.add(file);

        // Loop over the todo list, adding new include files when found
        while (!todo.isEmpty()) {

            // Take the first element of the todo list to process next
            PacioliFile current = todo.get(0);
            todo.remove(0);

            // Process the current file if not already done
            if (!done.contains(current)) {

                // Load the current file
                Progam program = Progam.load(current, libs, Phase.PARSED);

                // Add the current file if not already found by some include
                if (!graph.containsVertex(current)) {
                    graph.addVertex(current);
                }

                for (PacioliFile pacioliFile : program.findImports(libs)) {

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

                for (String include : program.includes()) {

                    // Locate the include file
                    PacioliFile pacioliFile = current.findInclude2(current.modulePath, include);
                    if (pacioliFile == null) {
                        throw new RuntimeException(
                                String.format("Include '%s' for file '%s' not found in directories %s",
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
                    graph.addEdge(pacioliFile, current);

                }

                // Remember that this include was processed.
                done.add(current);
            }
        }

        return graph;
    }

}
