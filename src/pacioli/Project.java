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

import org.apache.commons.io.FilenameUtils;
import org.jgrapht.graph.DefaultDirectedGraph;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.traverse.DepthFirstIterator;

import pacioli.CompilationSettings.Target;
import pacioli.Progam.Phase;

public class Project {

    private final PacioliFile file;
    private final List<File> libs;
    private final DefaultDirectedGraph<PacioliFile, DefaultEdge> graph;
    
    Project (PacioliFile file, List<File> libs, DefaultDirectedGraph<PacioliFile, DefaultEdge> graph) throws Exception {
        this.file = file;
        this.libs = libs;
        this.graph = graph;
    }


    public Path bundlePath(Target target) {
        return bundlePath(file.getFile(), target);
    }
    
    public static Path bundlePath(File file, Target target) {
        return Paths.get(FilenameUtils.getBaseName(file.getName()) + "." + PacioliFile.targetFileExtension(target));
    }
    
    public static Project load(PacioliFile file, List<File> libs) throws Exception {
        return new Project(file, libs, projectGraph(file, libs));
    }
    
    static DefaultDirectedGraph<PacioliFile, DefaultEdge> projectGraph(PacioliFile file, List<File> libs) throws Exception {

        // The graph that will be build up
        DefaultDirectedGraph<PacioliFile, DefaultEdge> graph = new DefaultDirectedGraph<>(DefaultEdge.class);
       
        // Main loop variables. List todo contains include files still to process.
        // List done contains all processed files to avoid duplicates and cycles.
        List<PacioliFile> todo = new ArrayList<PacioliFile>();
        List<PacioliFile> done = new ArrayList<PacioliFile>();

        // Obsolete way to get the base directory
        Path d = Paths.get(file.getFile().getAbsolutePath()).getParent();
        
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
    
    PacioliFile root () {
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
    
    void printInfo() {
        Pacioli.logln("\nProject graph:");
        for (DefaultEdge edge: graph.edgeSet()) {
            Pacioli.logln("- edge %s\n    -> %s", graph.getEdgeSource(edge), graph.getEdgeTarget(edge));
        }
        
        Pacioli.logln("\nProject files depth first:");
        Iterator<PacioliFile> iterator = new DepthFirstIterator<>(graph, root());
        while (iterator.hasNext()) {
            PacioliFile file = iterator.next();
            Pacioli.logln("- %s", file);
        }
        Pacioli.logln("\n");
    }
    
    public Path bundle(CompilationSettings settings, Target target) throws Exception {
        
        Pacioli.logln1("Creating bundle for file '%s'", file);
        
        //printInfo();
        
        Progam mainProgram = Progam.load(file, libs, Phase.TYPED);
        
        // Setup a writer for the output file
        Path dstPath = bundlePath(target);
        PrintWriter writer = null;       
        
        try {
            
            // Open the writer
            writer = new PrintWriter(new BufferedWriter(new FileWriter(dstPath.toFile())));
            
            for (String lib : PacioliFile.defaultIncludes) {
                Boolean isStandard = lib.equals("standard");
                    PacioliFile libFile = PacioliFile.findLibrary(lib, libs);
                    Progam prog = new Progam(libFile, libs);
                    prog.loadTillHelper(Progam.Phase.TYPED, isStandard, false);
                    Pacioli.logln("Bundling default file %s", libFile);
                    mainProgram.includeOther(prog);
                
            }
            
            Iterator<PacioliFile> iterator = new DepthFirstIterator<>(graph, root());
         
            // Hack to avoid doing main twice
            iterator.next();
            
            while (iterator.hasNext()) {
                
                PacioliFile current = iterator.next();
                
                Pacioli.logln("Bundling file %s", current);
                
                // Add the program to the main program creating the entire bundle
                Progam program = Progam.load(current, libs, Phase.TYPED);
                mainProgram.includeOther(program);
            }
            
            // Generate the code for the entire bundle
            mainProgram.generateCode(writer, settings);
            
        } finally {
            
            // Close the writer
            if (writer != null) {
                writer.close();
            }
        }
        Pacioli.logln("Created bundle '%s'", dstPath);
        
        return dstPath;
    }


    public boolean targetOutdated(Target target) {
        for (PacioliFile file: graph.vertexSet()) {
            if (file.getFile().lastModified() > bundlePath(target).toFile().lastModified()) {
                return true;
            }
        }        
        return false;
    }
}
