package pacioli.mcp;

import java.io.File;
import java.io.IOException;
import java.util.List;
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
                for (PacioliFile file : CompilerAPI.collectLibFiles(libs)) {
                    var lib = new JsonObject();

                    lib.addProperty("name", file.moduleName());
                    lib.addProperty("file", file.fsFile().toString());
                    try {
                        String docu = CompilerAPI.libraryDocumentation(file.docFile());
                        lib.addProperty("documentation", docu);
                    } catch (IOException e) {
                    }
                    arr.add(lib);
                }

            } catch (IOException e) {
                // TODO handle error
            }
            res.add("libraries", arr);
            return res;
        } else {
            throw new MCPException("Unknown tool: " + name);
        }
    }
}
