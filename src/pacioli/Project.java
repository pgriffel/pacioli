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
import org.jgrapht.Graph;
import org.jgrapht.Graphs;
import org.jgrapht.graph.DefaultDirectedGraph;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.graph.EdgeReversedGraph;
import org.jgrapht.traverse.DepthFirstIterator;

import pacioli.Progam.Phase;

public class Project {

    private final PacioliFile file;
    private final List<File> libs;
    private final DefaultDirectedGraph<PacioliFile, DefaultEdge> graph;
    
    Project (PacioliFile file, List<File> libs, DefaultDirectedGraph<PacioliFile, DefaultEdge> graph) throws Exception {
        this.file = file;
        this.libs = libs;
        this.graph = graph;
        //this.graph = Pacioli.projectGraph(file, libs);
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
/*        
        // Initialize the loop by adding the file to the todo list
        Integer fileVersion = 0;
        String base = FilenameUtils.getBaseName(file.getName());
        File dir = file.getParentFile();
        Path p = Paths.get(file.getAbsolutePath());
        Path d = p.getParent();
        Path b = d.relativize(p);
        Pacioli.logln("rel p=%s b=%s", p, b);
                
        todo.add(new PacioliFile(file.getAbsoluteFile(), base, fileVersion, false, false));
  */      
        // Obsolete way to get the base directory
        Path p = Paths.get(file.getFile().getAbsolutePath());
        Path d = p.getParent();
        
        todo.add(file);
        // Loop over the todo list, adding new include files when found
        while (!todo.isEmpty()) {

            // Take the first element of the todo list to process next
            PacioliFile current = todo.get(0);
            todo.remove(0);
            
            // Process the current file if not already done
            if (!done.contains(current)) {
                
                // Load the current file
                Progam program = Pacioli.loadProgramNew(current, libs, Phase.parsed);
                
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
                Pacioli.logln("Doing %s", file);
                
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
        //Iterator<PacioliFile> iterator = new DepthFirstIterator<>(new EdgeReversedGraph<>(graph), root());
        while (iterator.hasNext()) {
            PacioliFile file = iterator.next();
            Pacioli.logln("- %s", file);
        }
        Pacioli.logln("\n");
    }
    
    public void bundle(CompilationSettings settings, String target) throws Exception {
        
        Pacioli.logln1("Creating bundle for file '%s'", file);
        
        //printInfo();
        
        Progam mainProgram = Pacioli.loadProgramNew(file, libs, Phase.typed);
        
        // Setup a writer for the output file
        String dstName = Progam.fileBaseName(file.getFile()) + "." + Progam.targetFileExtension(target);  // todo: get the dst name from somewhere else 
        PrintWriter writer = null;       
        
        try {
            
            // Open the writer
            writer = new PrintWriter(new BufferedWriter(new FileWriter(dstName)));
            
            for (String lib : PacioliFile.defaultIncludes) {
                Boolean isStandard = lib.equals("standard");
                    PacioliFile libFile = PacioliFile.findLibrary(lib, libs);
                    Progam prog = new Progam(libFile, libs);
                    prog.loadTillHelper(Progam.Phase.typed, isStandard, false);
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
                Progam program = Pacioli.loadProgramNew(current, libs, Phase.typed);
                mainProgram.includeOther(program);
            }
            
            // Generate the code for the entire bundle
            mainProgram.generateCode(writer, settings, target);
            
        } finally {
            
            // Close the writer
            if (writer != null) {
                writer.close();
            }
        }
        Pacioli.logln("Created bundle '%s'", dstName);
    }
}
