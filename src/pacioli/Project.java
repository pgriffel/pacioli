package pacioli;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.jgrapht.Graph;
import org.jgrapht.Graphs;
import org.jgrapht.graph.DefaultDirectedGraph;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.traverse.DepthFirstIterator;

import pacioli.Progam.Phase;

public class Project {

    private final File file;
    private final List<File> libs;
    private final DefaultDirectedGraph<PacioliFile, DefaultEdge> graph;
    
    Project (File file, List<File> libs, DefaultDirectedGraph<PacioliFile, DefaultEdge> graph) throws Exception {
        this.file = file;
        this.libs = libs;
        this.graph = graph;
        //this.graph = Pacioli.projectGraph(file, libs);
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
        while (iterator.hasNext()) {
            PacioliFile file = iterator.next();
            Pacioli.logln("- %s", file);
        }
        Pacioli.logln("\n");
    }
    
    public void bundle(List<File> libs, CompilationSettings settings, String target) throws Exception {
        
        Pacioli.logln1("Creating bundle for file '%s'", file);
        
        
        //Progam mainProgram = new Progam(file, Pacioli.libraryDirectories(libs));
        Progam mainProgram = Pacioli.loadProgram(file, libs, Phase.typed);//s new Progam(file, Pacioli.libraryDirectories(libs));
        //mainProgram.loadTill(Phase.typed);
        
        // Setup a writer for the output file
        String dstName = Progam.fileBaseName(file) + "." + Progam.targetFileExtension(target); 
        PrintWriter writer = null;       
        
        try {
            
            // Open the writer
            writer = new PrintWriter(new BufferedWriter(new FileWriter(dstName)));
            
            for (String lib : PacioliFile.defaultIncludes) {
                Boolean isStandard = lib.equals("standard");
                    //File includeFile = PacioliFile.findIncludeFile(include, libs, file.getParentFile());
                    PacioliFile libFile = PacioliFile.findLibrary(lib, libs);
                    Progam prog = new Progam(libFile, libs);
                    prog.loadTillHelper(Progam.Phase.typed, isStandard, false);
                    mainProgram.includeOther(prog);
                
            }
            
            Iterator<PacioliFile> iterator = new DepthFirstIterator<>(graph, root());
            iterator.next();
            while (iterator.hasNext()) {
                
                PacioliFile current = iterator.next();
                
                // Hack to avoid doing main twice
                if (true || iterator.hasNext()) {
                
                Pacioli.logln("Bundling file %s", current);
                
                // Load the current file
                //Progam program = new Progam(current, Pacioli.libraryDirectories(libs));
                //program.loadTill(Phase.typed);
                Progam program = Pacioli.loadProgramNew(current, libs, Phase.typed);

                // Add the loaded program to the main program creating the entire bundle
                mainProgram.includeOther(program);

                }
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
