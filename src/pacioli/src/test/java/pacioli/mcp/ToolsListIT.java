package pacioli.mcp;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.junit.jupiter.api.Test;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

class ToolsListIT {

    static final List<File> LIBS = List.of(new File("D:\\code\\pacioli\\lib\\"));

    @Test
    void toolsListReturnsAvailableTools() throws Exception {
        // Setup
        TestConnection testConnection = new TestConnection();
        PacioliMCPServer server = MPCContainer.fromTransport(LIBS, testConnection.transport).server;
        ExecutorService exec = Executors.newSingleThreadExecutor();
        exec.submit(() -> {
            try {
                server.start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        // Initialize
        JsonObject init = new JsonObject();
        init.addProperty("jsonrpc", "2.0");
        init.addProperty("id", 1);
        init.addProperty("method", "initialize");
        JsonObject params = new JsonObject();
        params.addProperty("protocolVersion", "2024-11-05");
        init.add("params", params);

        testConnection.writeln(init);

        String respLine = testConnection.readString();
        assertNotNull(respLine, "No response to initialize");

        // Call tools/list
        JsonObject listRequest = new JsonObject();
        listRequest.addProperty("jsonrpc", "2.0");
        listRequest.addProperty("id", 2);
        listRequest.addProperty("method", "tools/list");

        testConnection.writeln(listRequest);

        JsonObject listResp = testConnection.readJson();
        assertNotNull(listResp, "No response to tools/list");
        assertTrue(listResp.has("result") || listResp.has("error"), "Response should have result or error");

        if (listResp.has("result")) {
            JsonObject result = listResp.getAsJsonObject("result");
            assertTrue(result.has("tools"), "Result should have 'tools' array");

            JsonArray tools = result.getAsJsonArray("tools");
            assertTrue(tools.size() > 0, "Should return at least one tool");

            // Verify analyze_file tool exists
            boolean hasAnalyzeTool = false;
            boolean hasListSymbolsTool = false;
            boolean hasListLibrariesTool = false;

            for (var toolElem : tools) {
                JsonObject tool = toolElem.getAsJsonObject();
                assertTrue(tool.has("name"), "Tool should have 'name'");
                assertTrue(tool.has("description"), "Tool should have 'description'");
                assertTrue(tool.has("inputSchema"), "Tool should have 'inputSchema'");

                String toolName = tool.get("name").getAsString();
                if ("analyze_file".equals(toolName)) {
                    hasAnalyzeTool = true;
                    JsonObject schema = tool.getAsJsonObject("inputSchema");
                    assertTrue(schema.has("properties"), "Schema should have 'properties'");
                    assertTrue(schema.getAsJsonObject("properties").has("filepath"),
                            "analyze_file should have filepath property");
                    assertTrue(schema.getAsJsonObject("properties").has("libdir"),
                            "analyze_file should have libdir property");
                } else if ("list_symbols".equals(toolName)) {
                    hasListSymbolsTool = true;
                } else if ("list_libraries".equals(toolName)) {
                    hasListLibrariesTool = true;
                }
            }

            assertTrue(hasAnalyzeTool, "Should have analyze_file tool");
            assertTrue(hasListSymbolsTool, "Should have list_symbols tool");
            assertTrue(hasListLibrariesTool, "Should have list_libraries tool");
        }

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
