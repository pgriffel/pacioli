package pacioli.mcp;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.google.gson.JsonObject;

import pacioli.compiler.PacioliFile;
import pacioli.mcp.tools.AnalyzeTool;
import pacioli.mcp.tools.ListSymbolsTool;

public class MCPToolHandler {
    private final MCPResourceManager resources;
    private final AnalyzeTool analyzeTool;
    private final ListSymbolsTool listSymbolsTool;
    private List<File> libs;

    public MCPToolHandler(List<File> libs, MCPResourceManager resources) {
        this.libs = libs;
        this.resources = resources;
        this.analyzeTool = new AnalyzeTool(libs, resources);
        this.listSymbolsTool = new ListSymbolsTool(libs, resources);
    }

    public JsonObject callTool(JsonObject params) throws MCPException {
        String name = params.has("name") ? params.get("name").getAsString() : null;
        JsonObject args = params.has("arguments") ? params.getAsJsonObject("arguments") : new JsonObject();
        if ("analyze_file".equals(name)) {
            return analyzeTool.call(args);
        } else if ("list_symbols".equals(name)) {
            return listSymbolsTool.call(args);
        } else if ("list_libraries".equals(name)) {
            // Return list of library directories
            var res = new com.google.gson.JsonObject();
            var arr = new com.google.gson.JsonArray();
            try {
                for (PacioliFile file : collectLibFiles(libs)) {
                    var lib = new JsonObject();

                    lib.addProperty("name", file.moduleName());
                    lib.addProperty("file", file.fsFile().toString());
                    try {
                        String docu = libraryDocumentation(file.docFile());
                        lib.addProperty("documentation", docu);
                    } catch (IOException e) {
                    }
                    // String docu = libraryDocumentation(file.docFile());
                    // lib.addProperty("documentation", docu);

                    arr.add(lib);
                }

                // for (Path f : collectLibraries(libs)) {
                // String title = f.getFileName().toString();

                // Optional<PacioliFile> libFile = PacioliFile.findLibrary(title, libs);

                // var lib = new JsonObject();

                // lib.addProperty("name", title);
                // lib.addProperty("file", f.toString());
                // libFile.ifPresent(l -> {
                // try {
                // String docu = libraryDocumentation(l.docFile());
                // lib.addProperty("documentation", docu);
                // } catch (IOException e) {
                // }
                // });

                // arr.add(lib);
                // }
            } catch (IOException e) {
                // TODO handle error
            }
            res.add("libraries", arr);
            return res;
        } else {
            throw new MCPException("Unknown tool: " + name);
        }
    }

    String libraryDocumentation(File docFile) throws IOException {
        List<String> read = Files.readAllLines(docFile.toPath());
        return String.join("\n", read);
    }

    static List<Path> collectLibraries(List<File> libs) throws IOException {
        var libraries = new ArrayList<Path>();

        Files.walkFileTree(libs.get(0).toPath(), new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                libraries.add(dir);
                return super.preVisitDirectory(dir, attrs);
            }
        });

        libraries.remove(0);

        return libraries;
    }

    static List<PacioliFile> collectLibFiles(List<File> libs) throws IOException {
        var libraries = new ArrayList<PacioliFile>();

        Files.walkFileTree(libs.get(0).toPath(), new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                PacioliFile
                        .findLibrary(dir.getFileName().toString(), libs)
                        .ifPresent(libraries::add);

                return super.preVisitDirectory(dir, attrs);
            }
        });

        libraries.remove(0);

        return libraries;
    }
}
