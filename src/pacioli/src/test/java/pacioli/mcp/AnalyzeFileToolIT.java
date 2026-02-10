package pacioli.mcp;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.junit.jupiter.api.Test;

import com.google.gson.JsonObject;

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
        arguments.addProperty("filepath", LIBS.get(0).toString() + "/planets/planets.pacioli");
        JsonObject analyzeResp = testConnection.callTool("analyze_file", arguments);

        // Then the call should succeed
        assertNotNull(analyzeResp, "No response to analyze_file");
        assertTrue(analyzeResp.has("result"));

        // And the result should contain 'symbols'
        JsonObject r = analyzeResp.getAsJsonObject("result");
        assertTrue(r.has("symbols"));

        // And the number of symbols should be correct
        assertEquals(273, r.getAsJsonArray("symbols").size());

        // And the first symbol (eigenvalue_decomposition) should have correct
        // properties
        JsonObject record0 = r.getAsJsonArray("symbols").get(0).getAsJsonObject();

        assertEquals("eigenvalue_decomposition", record0.get("name").getAsString());
        assertEquals("$base_matrix", record0.get("module").getAsString());
        assertEquals(true, record0.get("isPublic").getAsBoolean());
        assertEquals(true, record0.get("isGlobal").getAsBoolean());
        assertEquals(false, record0.get("isUserDefined").getAsBoolean());
        assertEquals(false, record0.get("hasDefinition").getAsBoolean());
        assertEquals(false, record0.get("hasInferredType").getAsBoolean());
        assertEquals("for_unit a, P!u: for_index P: (a*P!u per P!u) -> Tuple(a*P!u per P!u, a*P!u per P!u)",
                record0.get("type").getAsString());

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
