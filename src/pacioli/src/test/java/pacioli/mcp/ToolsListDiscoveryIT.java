package pacioli.mcp;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.junit.jupiter.api.Test;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

/**
 * Test for the 'tools/list' discovery call.
 */
class ToolsListDiscoveryIT {

    static final List<File> LIBS = TestEnvironment.LIBS;

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
        testConnection.initialize();

        // When 'tools/list' is called
        JsonObject listResp = testConnection.call("tools/list", new JsonObject());

        // Then the response should be okay
        assertNotNull(listResp, "No response to tools/list");
        assertFalse(listResp.has("error"), "Response should not have error");
        assertTrue(listResp.has("result"), "Response should have result");

        // And the result should have a tools property
        JsonObject result = listResp.getAsJsonObject("result");
        assertTrue(result.has("tools"), "Result should have 'tools' array");

        // And the tools property should contain at least one tool
        JsonArray tools = result.getAsJsonArray("tools");
        assertTrue(tools.size() > 0, "Should return at least one tool");

        // Verify tools exists
        boolean hasLibraryDocumentationTool = false;
        boolean hasInferTypesTool = false;
        boolean hasListLibrariesTool = false;

        for (var toolElem : tools) {
            JsonObject tool = toolElem.getAsJsonObject();

            // And each tool should have a name, description and inputSchema
            assertTrue(tool.has("name"), "Tool should have 'name'");
            assertTrue(tool.has("description"), "Tool should have 'description'");
            assertTrue(tool.has("inputSchema"), "Tool should have 'inputSchema'");

            String toolName = tool.get("name").getAsString();

            if ("library_documentation".equals(toolName)) {
                hasLibraryDocumentationTool = true;

                JsonObject schema = tool.getAsJsonObject("inputSchema");

                // And the 'analyze_file' tools should have property 'filepath'
                assertTrue(schema.has("properties"), "Schema should have 'properties'");
                assertTrue(schema.getAsJsonObject("properties").has("name"),
                        "library_documentation should have name property");

            } else if ("infer_types".equals(toolName)) {
                hasInferTypesTool = true;
            } else if ("list_libraries".equals(toolName)) {
                hasListLibrariesTool = true;
            }
        }

        // And tools 'analyze_file', 'list_symbols' and 'list_libraries' should exist
        assertTrue(hasLibraryDocumentationTool, "Should have library_documentation tool");
        assertTrue(hasInferTypesTool, "Should have infer_types tool");
        assertTrue(hasListLibrariesTool, "Should have list_libraries tool");

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
