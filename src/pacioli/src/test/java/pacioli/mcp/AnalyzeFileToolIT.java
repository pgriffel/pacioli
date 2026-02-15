package pacioli.mcp;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.junit.jupiter.api.Test;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * Tests the 'analyze_file' tool.
 */
class AnalyzeFileToolIT {

    static final List<File> LIBS = TestEnvironment.LIBS;

    @Test
    void callAnalyzeFileTool() throws Exception {

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

        // When the 'analyze_file' tool is called
        JsonObject arguments = new JsonObject();
        arguments.addProperty("filepath", LIBS.get(0).toString() + "/petri_net/petri_net.pacioli");
        JsonObject analyzeResp = testConnection.callTool("analyze_file", arguments);

        // Then the call should succeed
        assertNotNull(analyzeResp, "No response to analyze_file");
        assertTrue(analyzeResp.has("result"));

        // And the result should contain 'symbols'
        JsonObject r = analyzeResp.getAsJsonObject("result");
        assertTrue(r.has("content"));

        // And the number of symbols should be correct
        assertEquals(1, r.getAsJsonArray("content").size());

        JsonObject parsedText = JsonParser
                .parseString(r.getAsJsonArray("content").get(0).getAsJsonObject().get("text").getAsString())
                .getAsJsonObject();

        // And the first symbol (eigenvalue_decomposition) should have correct
        // properties
        JsonObject record0 = parsedText.getAsJsonArray("symbols").get(0).getAsJsonObject();

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
