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
 * Test for the 'list_libraries' tool. Should be a resource?!
 */
class ListLibrariesToolIT {

    static final List<File> LIBS = TestEnvironment.LIBS;

    @Test
    void listLibrariesTool() throws Exception {

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

        // When the 'list_libraries' tool is called
        JsonObject arguments = new JsonObject();
        JsonObject listResp = testConnection.callTool("list_libraries", arguments);

        // Then the call should succeed
        assertNotNull(listResp, "No response to analyze_file");
        assertTrue(listResp.has("result"));

        // And the result should contain property 'libraries'
        JsonObject r = listResp.getAsJsonObject("result");
        assertTrue(r.has("content"));

        JsonArray contents = r.getAsJsonArray("content");
        assertEquals(1, contents.size());

        String text = contents.get(0).getAsJsonObject().get("text").getAsString();

        // assertTrue(text.startsWith("{\"content\":[{\"type\":\"text\",\"text\":\"{\\\"name\\\":\\\"base\\\","));
        // assertTrue(text.endsWith("naturals(5) = [0, 1, 2, 3, 4]\\\\n )\\\\n ]);
        // \\\\n</pre>\\\"}\"}]}"));

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
