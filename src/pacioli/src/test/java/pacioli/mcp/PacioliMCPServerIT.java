package pacioli.mcp;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.junit.jupiter.api.Test;

import com.google.gson.JsonObject;

class PacioliMCPServerIT {

    static final List<File> LIBS = List.of(new File("D:\\code\\pacioli\\lib\\"));

    @Test
    void startServerAndCallAnalyze() throws Exception {

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

        JsonObject resp = testConnection.readJson();
        assertNotNull(resp, "No response to initialize");
        assertTrue(resp.has("result") || resp.has("error"));

        // call analyze_file on a known library file
        JsonObject call = new JsonObject();
        call.addProperty("jsonrpc", "2.0");
        call.addProperty("id", 2);
        call.addProperty("method", "tools/call");
        JsonObject callParams = new JsonObject();
        callParams.addProperty("name", "analyze_file");
        JsonObject arguments = new JsonObject();
        arguments.addProperty("filepath", "D:\\code\\pacioli\\lib\\planets\\planets.pacioli");
        callParams.add("arguments", arguments);
        call.add("params", callParams);

        testConnection.writeln(call);

        JsonObject analyzeResp = testConnection.readJson();
        assertNotNull(analyzeResp, "No response to analyze_file");
        assertTrue(analyzeResp.has("result") || analyzeResp.has("error"));

        // If we have a result, assert it contains symbols array
        if (analyzeResp.has("result")) {
            JsonObject r = analyzeResp.getAsJsonObject("result");
            assertTrue(r.has("symbols") || r.has("error"));

            assertEquals(254, r.getAsJsonArray("symbols").size());

            JsonObject record0 = r.getAsJsonArray("symbols").get(0).getAsJsonObject();

            assertEquals(254, r.getAsJsonArray("symbols").size());

            assertEquals("eigenvalue_decomposition", record0.get("name").getAsString());
            assertEquals("$base_matrix", record0.get("module").getAsString());
            assertEquals(true, record0.get("isPublic").getAsBoolean());
            assertEquals(true, record0.get("isGlobal").getAsBoolean());
            assertEquals(false, record0.get("isUserDefined").getAsBoolean());
            assertEquals(false, record0.get("hasDefinition").getAsBoolean());
            assertEquals(false, record0.get("hasInferredType").getAsBoolean());
            assertEquals("for_unit a, P!u: for_index P: (a*P!u per P!u) -> Tuple(a*P!u per P!u, a*P!u per P!u)",
                    record0.get("type").getAsString());
        }

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
