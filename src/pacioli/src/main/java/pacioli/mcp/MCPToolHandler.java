package pacioli.mcp;

import com.google.gson.JsonObject;

public class MCPToolHandler {
    private final MCPResourceManager resources;

    public MCPToolHandler(MCPResourceManager resources) {
        this.resources = resources;
    }

    public JsonObject callTool(JsonObject params) throws MCPException {
        String name = params.has("name") ? params.get("name").getAsString() : null;
        JsonObject args = params.has("arguments") ? params.getAsJsonObject("arguments") : new JsonObject();
        if ("analyze_file".equals(name)) {
            JsonObject res = new JsonObject();
            res.addProperty("message", "analyze_file not yet implemented");
            return res;
        } else if ("list_symbols".equals(name)) {
            JsonObject res = new JsonObject();
            res.addProperty("message", "list_symbols not yet implemented");
            return res;
        } else {
            throw new MCPException("Unknown tool: " + name);
        }
    }
}
