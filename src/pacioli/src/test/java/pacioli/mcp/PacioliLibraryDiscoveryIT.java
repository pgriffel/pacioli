package pacioli.mcp;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.junit.jupiter.api.Test;

import com.google.gson.JsonObject;

class PacioliLibraryDiscoveryIT {

    static final List<File> LIBS = List.of(new File("D:\\code\\pacioli\\lib\\"));

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

        // initialize
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

        // call list_libraries
        JsonObject call = new JsonObject();
        call.addProperty("jsonrpc", "2.0");
        call.addProperty("id", 2);
        call.addProperty("method", "tools/call");
        JsonObject callParams = new JsonObject();
        callParams.addProperty("name", "list_libraries");
        call.add("params", callParams);

        testConnection.writeln(call);

        JsonObject listResp = testConnection.readJson();
        assertNotNull(listResp, "No response to list_libraries");

        assertTrue(listResp.has("result") || listResp.has("error"));

        if (listResp.has("result")) {
            JsonObject r = listResp.getAsJsonObject("result");
            assertTrue(r.has("libraries"));

            // TODO: assert contents
        }

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
