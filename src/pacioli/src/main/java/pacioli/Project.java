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
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.apache.commons.io.FilenameUtils;
import org.jgrapht.Graph;
import org.jgrapht.graph.AsSubgraph;
import org.jgrapht.graph.DefaultDirectedGraph;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.traverse.DepthFirstIterator;
import org.jgrapht.traverse.TopologicalOrderIterator;

import pacioli.CompilationSettings.Target;
import pacioli.Progam.Phase;
import pacioli.symboltable.PacioliTable;

public class Project {

    private final PacioliFile file;
    private final List<File> libs;
    private final DefaultDirectedGraph<PacioliFile, DefaultEdge> graph;

    Project(PacioliFile file, List<File> libs, DefaultDirectedGraph<PacioliFile, DefaultEdge> graph) throws Exception {
        this.file = file;
        this.libs = libs;
        this.graph = graph;
    }

    public Path bundlePath(Target target) {
        return bundlePath(file.getFile(), target);
    }

    public static Path bundlePath(File file, Target target) {
        return Paths.get(FilenameUtils.removeExtension(file.getPath()) + "." + PacioliFile.targetFileExtension(target));
    }

    public static Project load(PacioliFile file, List<File> libs) throws Exception {
        return new Project(file, libs, projectGraph(file, libs));
    }

    static DefaultDirectedGraph<PacioliFile, DefaultEdge> projectGraph(PacioliFile file, List<File> libs)
            throws Exception {

        // The graph that will be build up
        DefaultDirectedGraph<PacioliFile, DefaultEdge> graph = new DefaultDirectedGraph<>(DefaultEdge.class);

        // Main loop variables. List todo contains include files still to process.
        // List done contains all processed files to avoid duplicates and cycles.
        List<PacioliFile> todo = new ArrayList<PacioliFile>();
        List<PacioliFile> done = new ArrayList<PacioliFile>();

        // Obsolete way to get the base directory
        // Path d = Paths.get(file.getFile().getAbsolutePath()).getParent();

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
                    // for (String lib : program.imports()) {

                    // Locate the include file
                    // PacioliFile pacioliFile = PacioliFile.findLibrary(lib, libs);
                    // if (pacioliFile == null) {
                    // throw new RuntimeException(String.format("Import '%s' for file '%s' not found
                    // in directories %s",
                    // lib, current, libs));
                    // }

                    // Add the include files to the todo list
                    if (!done.contains(pacioliFile) && !todo.contains(pacioliFile)) {
                        todo.add(pacioliFile);
                    }

                    // Add the included file to the graph if not already a member
                    if (!graph.containsVertex(pacioliFile)) {
                        graph.addVertex(pacioliFile);
                    }

                    // Add an edge for the include relation
                    //graph.addEdge(current, pacioliFile);
                    graph.addEdge(pacioliFile, current);

                }

                for (String include : program.includes()) {

                    // Locate the include file
                    // PacioliFile pacioliFile = PacioliFile.findInclude(d, current, include);
                    // PacioliFile pacioliFile = current.findInclude2(program.getModule(), include);
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
                    //graph.addEdge(current, pacioliFile);
                    graph.addEdge(pacioliFile, current);

                }

                // Remember that this include was processed.
                done.add(current);
            }
        }

        return graph;
    }

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
     * The iterator wrapper allows forEach, etc.
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

    public Path bundle(CompilationSettings settings) throws Exception {

        Path dstPath = bundlePath(settings.getTarget());

        Pacioli.log("Creating bundle for file '%s'", file);

        Bundle bundle = Bundle.empty(file, libs);

        Pacioli.log("Adding primitives");
        bundle.addPrimitiveTypes();

        for (String lib : PacioliFile.defaultIncludes) {
            Pacioli.log("Loading default include'%s'", lib);
            PacioliFile libFile = PacioliFile.requireLibrary(lib, libs);
            Progam prog = Progam.load(libFile, libs, Phase.DESUGARED);
            Pacioli.log("Resolving default include '%s'", lib);
            prog.resolve2(new PacioliTable(bundle.valueTable, bundle.typeTable));
            Pacioli.log("Lifting statements '%s'", lib);
            prog.liftStatements();
            Pacioli.log("Resolving default include '%s'", lib);
            prog.resolve2(new PacioliTable(bundle.valueTable, bundle.typeTable));
            Pacioli.log("Inferring types '%s'", lib);
            prog.inferTypes(new PacioliTable(bundle.valueTable, bundle.typeTable));
        Pacioli.log("Loading '%s'", lib);
            bundle.load(prog);
        }

        Pacioli.log("Creating bundle for file '%s'", file);

        try (PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(dstPath.toFile())))) {

            for (PacioliFile current : orderedFiles()) {
                Progam program = Progam.load(current, libs, Phase.DESUGARED);
                Pacioli.log("Resolving include '%s'", current);
                program.resolve2(new PacioliTable(bundle.valueTable, bundle.typeTable));
                Pacioli.log("Lifting statements '%s'", current);
                program.liftStatements();
                Pacioli.log("Resolving include '%s'", current);
                program.resolve2(new PacioliTable(bundle.valueTable, bundle.typeTable));
                Pacioli.log("Inferring types '%s'", current);
                program.inferTypes(new PacioliTable(bundle.valueTable, bundle.typeTable));
                Pacioli.log("Loading '%s'", current);
                bundle.load(program);
            }

            Pacioli.log("Creating bundle for file '%s'!!!!!!!!!!!", file);

            bundle.generateCode(writer, settings);

            // orderedFiles().forEach(current -> {
            //     Pacioli.log("Bundling file %s [%s]", current, current.getModule());

            //     // Add the program to the main program creating the entire bundle
            //     Progam program;
            //     try {
            //         program = Progam.load(current, libs, Phase.DESUGARED);
            //         Pacioli.log("Resolving include '%s'", current);
            //         program.resolve2(new PacioliTable(bundle.valueTable, bundle.typeTable));
            //         Pacioli.log("Loading '%s'", current);
            //         bundle.load(program);
            //     } catch (Exception e) {
            //         // TODO Auto-generated catch block
            //         e.printStackTrace();
            //     }
                
            // });

            // Iterator<PacioliFile> iterator = new DepthFirstIterator<>(graph, root());

            // // Hack to avoid doing main twice
            // iterator.next();

            // while (iterator.hasNext()) {

            //     PacioliFile current = iterator.next();

            //     Pacioli.log("Bundling file %s [%s]", current, current.getModule());

            //     // Add the program to the main program creating the entire bundle
            //     Progam program = Progam.load(current, libs, Phase.DESUGARED);
            //     Pacioli.log("Resolving include '%s'", current);
            //     program.resolve2(new PacioliTable(bundle.valueTable, bundle.typeTable));
            //     Pacioli.log("Loading '%s'", current);
            //     bundle.load(program);
            // }
            // // mainProgram.liftStatements();

            // // mainProgram.inferTypes();

            // // // Generate the code for the entire bundle
            // // mainProgram.generateCode(writer, settings);

        }

        // // Progam mainProgram = Progam.load(file, libs, Phase.RESOLVED);
        // Progam mainProgram = Progam.empty(file, libs);

        // // Setup a writer for the output file

        // try (PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(dstPath.toFile())))) {

        //     for (String lib : PacioliFile.defaultIncludes) {

        //         PacioliFile libFile = PacioliFile.requireLibrary(lib, libs);
        //         Progam prog = Progam.load(libFile, libs, Phase.RESOLVED);
        //         prog.liftStatements();
        //         Pacioli.log("Bundling default file %s", libFile);
        //         mainProgram.includeOther(prog);

        //     }

        //     Iterator<PacioliFile> iterator = new DepthFirstIterator<>(graph, root());

        //     // Hack to avoid doing main twice
        //     iterator.next();

        //     while (iterator.hasNext()) {

        //         PacioliFile current = iterator.next();

        //         Pacioli.log("Bundling file %s [%s]", current, current.getModule());

        //         // Add the program to the main program creating the entire bundle
        //         Progam program = Progam.load(current, libs, Phase.RESOLVED);
        //         program.liftStatements();
        //         mainProgram.includeOther(program);
        //     }
        //     mainProgram.liftStatements();

        //     mainProgram.inferTypes();

        //     // Generate the code for the entire bundle
        //     mainProgram.generateCode(writer, settings);

        // }

        Pacioli.log("Created bundle '%s'", dstPath);

        return dstPath;
    }

    public boolean targetOutdated(Target target) {
        for (PacioliFile file : graph.vertexSet()) {
            if (file.getFile().lastModified() > bundlePath(target).toFile().lastModified()) {
                return true;
            }
        }
        return false;
    }
}
