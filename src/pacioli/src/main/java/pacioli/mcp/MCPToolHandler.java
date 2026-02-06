package pacioli.mcp;

import com.google.gson.JsonObject;
import pacioli.mcp.tools.AnalyzeTool;
import pacioli.mcp.tools.ListSymbolsTool;

public class MCPToolHandler {
    private final MCPResourceManager resources;
    private final AnalyzeTool analyzeTool;
    private final ListSymbolsTool listSymbolsTool;

    public MCPToolHandler(MCPResourceManager resources) {
        this.resources = resources;
        this.analyzeTool = new AnalyzeTool(resources);
        this.listSymbolsTool = new ListSymbolsTool(resources);
    }

    public JsonObject callTool(JsonObject params) throws MCPException {
        String name = params.has("name") ? params.get("name").getAsString() : null;
        JsonObject args = params.has("arguments") ? params.getAsJsonObject("arguments") : new JsonObject();
        if ("analyze_file".equals(name)) {
            return analyzeTool.call(args);
        } else if ("list_symbols".equals(name)) {
            return listSymbolsTool.call(args);
        } else {
            throw new MCPException("Unknown tool: " + name);
        }
    }
}
