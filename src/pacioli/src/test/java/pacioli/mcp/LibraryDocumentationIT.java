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
class LibraryDocumentationIT {

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
        arguments.addProperty("name", "geometry");
        JsonObject listResp = testConnection.callTool("library_documentation", arguments);

        // Then the call should succeed
        assertNotNull(listResp, "No response to library_documentation");
        assertTrue(listResp.has("result"));

        // And the result should contain property 'libraries'
        JsonObject r = listResp.getAsJsonObject("result");
        assertTrue(r.has("content"));

        JsonObject c = r.get("content").getAsJsonArray().get(0).getAsJsonObject();

        JsonArray contents = r.getAsJsonArray("content");
        assertEquals(1, contents.size());

        String text = contents.get(0).getAsJsonObject().get("text").getAsString();

        assertTrue(text.startsWith("# The geometry library"));
        assertTrue(text.contains("Area of the triangle given by three position vectors."));

        // assertTrue(text.startsWith("{\"content\":[{\"type\":\"text\",\"text\":\"{\\\"name\\\":\\\"base\\\","));
        // assertTrue(text.endsWith("naturals(5) = [0, 1, 2, 3, 4]\\\\n )\\\\n ]);
        // \\\\n</pre>\\\"}\"}]}"));

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
