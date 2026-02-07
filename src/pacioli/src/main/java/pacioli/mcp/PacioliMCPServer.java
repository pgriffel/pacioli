package pacioli.mcp;

import java.io.File;
import java.util.List;

import com.google.gson.JsonObject;

public class PacioliMCPServer {
    private final List<File> libs;
    private final MCPResourceManager resources;
    private final MCPToolHandler tools;
    private final MCPTransport transport;

    public PacioliMCPServer(List<File> libs) {
        this(libs, new MCPTransport());
    }

    public PacioliMCPServer(List<File> libs, MCPTransport transport) {
        this.libs = libs;
        this.resources = new MCPResourceManager(libs);
        this.tools = new MCPToolHandler(resources);
        this.transport = transport;
    }

    public void start() throws Exception {
        transport.start(this::handleMessage);
    }

    public void stop() {
        transport.close();
    }

    private void handleMessage(JsonObject message) {
        try {
            String method = message.has("method") ? message.get("method").getAsString() : null;
            if ("initialize".equals(method)) {
                JsonObject resp = new JsonObject();
                resp.addProperty("jsonrpc", "2.0");
                resp.add("result", new JsonObject());
                if (message.has("id"))
                    resp.add("id", message.get("id"));
                transport.send(resp);
                return;
            }
            if ("tools/list".equals(method)) {
                JsonObject result = listTools();
                JsonObject resp = new JsonObject();
                resp.addProperty("jsonrpc", "2.0");
                resp.add("result", result);
                if (message.has("id"))
                    resp.add("id", message.get("id"));
                transport.send(resp);
                return;
            }
            if ("tools/call".equals(method)) {
                JsonObject params = message.getAsJsonObject("params");
                JsonObject result = tools.callTool(params);
                JsonObject resp = new JsonObject();
                resp.addProperty("jsonrpc", "2.0");
                resp.add("result", result);
                if (message.has("id"))
                    resp.add("id", message.get("id"));
                transport.send(resp);
                return;
            }
            // Unknown method: respond with method not found
            JsonObject errResp = new JsonObject();
            errResp.addProperty("jsonrpc", "2.0");
            JsonObject error = new JsonObject();
            error.addProperty("code", -32601);
            error.addProperty("message", "Method not found");
            errResp.add("error", error);
            if (message.has("id"))
                errResp.add("id", message.get("id"));
            transport.send(errResp);
        } catch (Exception e) {
            JsonObject resp = new JsonObject();
            resp.addProperty("jsonrpc", "2.0");
            JsonObject error = new JsonObject();
            error.addProperty("code", -32603);
            error.addProperty("message", "Internal error: " + e.getMessage());
            resp.add("error", error);
            if (message.has("id"))
                resp.add("id", message.get("id"));
            transport.send(resp);
        }
    }

    private JsonObject listTools() {
        com.google.gson.JsonArray toolsArray = new com.google.gson.JsonArray();

        // analyze_file tool
        JsonObject analyzeTool = new JsonObject();
        analyzeTool.addProperty("name", "analyze_file");
        analyzeTool.addProperty("description",
                "Parse and analyze a Pacioli file, returning symbols, types, and diagnostics");
        JsonObject analyzeSchema = new JsonObject();
        analyzeSchema.addProperty("type", "object");
        com.google.gson.JsonObject analyzeProps = new com.google.gson.JsonObject();
        com.google.gson.JsonObject filepathProp = new com.google.gson.JsonObject();
        filepathProp.addProperty("type", "string");
        filepathProp.addProperty("description", "Path to the Pacioli file to analyze");
        analyzeProps.add("filepath", filepathProp);
        com.google.gson.JsonObject libdirProp = new com.google.gson.JsonObject();
        libdirProp.addProperty("type", "string");
        libdirProp.addProperty("description", "Path to the library directory");
        analyzeProps.add("libdir", libdirProp);
        analyzeSchema.add("properties", analyzeProps);
        com.google.gson.JsonArray analyzeRequired = new com.google.gson.JsonArray();
        analyzeRequired.add("filepath");
        analyzeRequired.add("libdir");
        analyzeSchema.add("required", analyzeRequired);
        analyzeTool.add("inputSchema", analyzeSchema);
        toolsArray.add(analyzeTool);

        // list_symbols tool
        JsonObject listSymbolsTool = new JsonObject();
        listSymbolsTool.addProperty("name", "list_symbols");
        listSymbolsTool.addProperty("description", "Extract all public symbols from a module (API listing)");
        JsonObject listSymbolsSchema = new JsonObject();
        listSymbolsSchema.addProperty("type", "object");
        com.google.gson.JsonObject listSymbolsProps = new com.google.gson.JsonObject();
        com.google.gson.JsonObject filepathProp2 = new com.google.gson.JsonObject();
        filepathProp2.addProperty("type", "string");
        filepathProp2.addProperty("description", "Path to the Pacioli module file");
        listSymbolsProps.add("filepath", filepathProp2);
        com.google.gson.JsonObject libdirProp2 = new com.google.gson.JsonObject();
        libdirProp2.addProperty("type", "string");
        libdirProp2.addProperty("description", "Path to the library directory");
        listSymbolsProps.add("libdir", libdirProp2);
        listSymbolsSchema.add("properties", listSymbolsProps);
        com.google.gson.JsonArray listSymbolsRequired = new com.google.gson.JsonArray();
        listSymbolsRequired.add("filepath");
        listSymbolsRequired.add("libdir");
        listSymbolsSchema.add("required", listSymbolsRequired);
        listSymbolsTool.add("inputSchema", listSymbolsSchema);
        toolsArray.add(listSymbolsTool);

        // list_libraries tool
        JsonObject listLibrariesTool = new JsonObject();
        listLibrariesTool.addProperty("name", "list_libraries");
        listLibrariesTool.addProperty("description", "List all available Pacioli libraries");
        JsonObject listLibrariesSchema = new JsonObject();
        listLibrariesSchema.addProperty("type", "object");
        com.google.gson.JsonObject listLibrariesProps = new com.google.gson.JsonObject();
        com.google.gson.JsonObject libdirProp3 = new com.google.gson.JsonObject();
        libdirProp3.addProperty("type", "string");
        libdirProp3.addProperty("description", "Path to the library directory");
        listLibrariesProps.add("libdir", libdirProp3);
        listLibrariesSchema.add("properties", listLibrariesProps);
        com.google.gson.JsonArray listLibrariesRequired = new com.google.gson.JsonArray();
        listLibrariesRequired.add("libdir");
        listLibrariesSchema.add("required", listLibrariesRequired);
        listLibrariesTool.add("inputSchema", listLibrariesSchema);
        toolsArray.add(listLibrariesTool);

        JsonObject result = new JsonObject();
        result.add("tools", toolsArray);
        return result;
    }
}
