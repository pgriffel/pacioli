/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
        boolean hasLocateReferencesTool = false;
        boolean hasProductGraphTool = false;

        for (var toolElem : tools) {
            JsonObject tool = toolElem.getAsJsonObject();

            // And each tool should have a name, description and inputSchema
            assertTrue(tool.has("name"), "Tool should have 'name'");
            assertTrue(tool.has("description"), "Tool should have 'description'");
            assertTrue(tool.has("inputSchema"), "Tool should have 'inputSchema'");

            String toolName = tool.get("name").getAsString();

            if ("locate_references".equals(toolName)) {
                hasLocateReferencesTool = true;

                JsonObject schema = tool.getAsJsonObject("inputSchema");

                // And the 'analyze_file' tools should have property 'filepath'
                assertTrue(schema.has("properties"), "Schema should have 'properties'");
                assertTrue(schema.getAsJsonObject("properties").has("name"),
                        "library_documentation should have name property");

            } else if ("project_graph".equals(toolName)) {
                hasProductGraphTool = true;
            }
        }

        // And tools 'locate_references' and 'project_graph' should exist
        assertTrue(hasLocateReferencesTool, "Should have locate_references tool");
        assertTrue(hasProductGraphTool, "Should have project_graph tool");

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
