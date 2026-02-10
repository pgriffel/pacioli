package pacioli.mcp;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.junit.jupiter.api.Test;

import com.google.gson.JsonObject;

class PacioliLibraryDiscoveryIT {

    static final List<File> LIBS = TestEnvironment.LIBS;

    @Test
    void libDiscoveryViaMCPServer() throws Exception {

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

        // Call 'list_libraries' tool
        JsonObject arguments = new JsonObject();
        JsonObject listResp = testConnection.callTool("list_libraries", arguments);

        // Call should succeed
        assertNotNull(listResp, "No response to analyze_file");
        assertTrue(listResp.has("result"));

        // Result should contain 'libraries' property
        JsonObject r = listResp.getAsJsonObject("result");
        assertTrue(r.has("libraries"));

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
