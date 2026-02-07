package pacioli.mcp;

import static org.junit.jupiter.api.Assertions.*;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.junit.jupiter.api.Test;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class ToolsListIT {

    @Test
    public void toolsListReturnsAvailableTools() throws Exception {
        // Wire piped streams between client and server
        PipedOutputStream clientToServerPos = new PipedOutputStream();
        PipedInputStream serverIn = new PipedInputStream(clientToServerPos);

        PipedOutputStream serverToClientPos = new PipedOutputStream();
        PipedInputStream clientIn = new PipedInputStream(serverToClientPos);

        MCPTransport transport = new MCPTransport(serverIn, serverToClientPos);

        File libDir = new File("D:\\code\\pacioli\\lib\\");
        List<File> libs = List.of(libDir);

        PacioliMCPServer server = new PacioliMCPServer(libs, transport);

        ExecutorService exec = Executors.newSingleThreadExecutor();
        var future = exec.submit(() -> {
            try {
                server.start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(clientToServerPos));
        BufferedReader reader = new BufferedReader(new InputStreamReader(clientIn));

        Gson gson = new Gson();

        // Initialize
        JsonObject init = new JsonObject();
        init.addProperty("jsonrpc", "2.0");
        init.addProperty("id", 1);
        init.addProperty("method", "initialize");
        JsonObject params = new JsonObject();
        params.addProperty("protocolVersion", "2024-11-05");
        init.add("params", params);

        writer.write(gson.toJson(init) + "\n");
        writer.flush();

        String respLine = reader.readLine();
        assertNotNull(respLine, "No response to initialize");

        // Call tools/list
        JsonObject listRequest = new JsonObject();
        listRequest.addProperty("jsonrpc", "2.0");
        listRequest.addProperty("id", 2);
        listRequest.addProperty("method", "tools/list");

        writer.write(gson.toJson(listRequest) + "\n");
        writer.flush();

        String listRespLine = reader.readLine();
        assertNotNull(listRespLine, "No response to tools/list");

        JsonObject listResp = gson.fromJson(listRespLine, JsonObject.class);
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

        // Stop server gracefully and wait for thread completion
        server.stop();

        clientToServerPos.close();
        serverToClientPos.close();

        writer.close();
        reader.close();

        exec.shutdown();
        try {
            future.get(5, TimeUnit.SECONDS);
        } catch (TimeoutException te) {
            fail("Server did not terminate within timeout");
        }
    }
}
