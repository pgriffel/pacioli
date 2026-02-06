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
}
