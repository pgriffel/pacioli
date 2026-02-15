package pacioli.mcp;

import java.io.File;
import java.io.IOException;
import java.util.List;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import pacioli.mcp.tools.AnalyzeTool;
import pacioli.mcp.tools.InferTypesTool;
import pacioli.mcp.tools.ListLibrariesTool;
import pacioli.mcp.tools.ListSymbolsTool;

public class MCPToolHandler {

    private final AnalyzeTool analyzeTool;
    private final ListSymbolsTool listSymbolsTool;
    private final InferTypesTool inferTypesTool;
    private final ListLibrariesTool listLibrariesTool;

    public MCPToolHandler(List<File> libs) {
        this.analyzeTool = new AnalyzeTool(libs);
        this.listSymbolsTool = new ListSymbolsTool(libs);
        this.inferTypesTool = new InferTypesTool(libs);
        this.listLibrariesTool = new ListLibrariesTool(libs);
    }

    public JsonObject callTool(JsonObject params) throws MCPException, IOException {
        return mpcCallToolResult(dispatch(params));
    }

    JsonObject mpcCallToolResult(String text) {
        JsonArray contentArray = new JsonArray();

        var entry = new JsonObject();
        entry.addProperty("type", "text");
        entry.addProperty("text", text);

        contentArray.add(entry);

        var result = new JsonObject();

        result.add("content", contentArray);
        // result.add("structuredContent", toolResult);

        return result;
    }

    public String dispatch(JsonObject params) throws MCPException, IOException {
        String name = params.has("name") ? params.get("name").getAsString() : null;
        JsonObject args = params.has("arguments") ? params.getAsJsonObject("arguments") : new JsonObject();
        if ("analyze_file".equals(name)) {
            return analyzeTool.call(args).toString();
        } else if ("list_symbols".equals(name)) {
            return listSymbolsTool.call(args).toString();
        } else if ("infer_types".equals(name)) {
            return inferTypesTool.call(args).toString();
        } else if ("list_libraries".equals(name)) {
            return listLibrariesTool.call(args);
        } else {
            throw new MCPException("Unknown tool: " + name);
        }
    }
}
