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
import com.google.gson.JsonObject;

public class InitializationFlowIT {

    @Test
    public void completeInitializationHandshake() throws Exception {
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

        // Step 1: Send initialize request
        JsonObject init = new JsonObject();
        init.addProperty("jsonrpc", "2.0");
        init.addProperty("id", 1);
        init.addProperty("method", "initialize");
        JsonObject params = new JsonObject();
        params.addProperty("protocolVersion", "2024-11-05");
        init.add("params", params);

        writer.write(gson.toJson(init) + "\n");
        writer.flush();

        // Step 2: Receive initialize response
        String respLine = reader.readLine();
        assertNotNull(respLine, "No response to initialize");
        JsonObject initResp = gson.fromJson(respLine, JsonObject.class);
        assertTrue(initResp.has("result"), "Initialize response should have result");

        // Step 3: Send notifications/initialized (client is ready)
        JsonObject initialized = new JsonObject();
        initialized.addProperty("jsonrpc", "2.0");
        initialized.addProperty("method", "notifications/initialized");
        // Note: notifications don't have an id field per MCP spec

        writer.write(gson.toJson(initialized) + "\n");
        writer.flush();

        // Step 4: Server should acknowledge initialization silently (no response)
        // and be ready for tools/list or tools/call requests

        // Step 5: Send tools/list request to verify server is ready
        JsonObject listRequest = new JsonObject();
        listRequest.addProperty("jsonrpc", "2.0");
        listRequest.addProperty("id", 2);
        listRequest.addProperty("method", "tools/list");

        writer.write(gson.toJson(listRequest) + "\n");
        writer.flush();

        // Step 6: Receive tools/list response
        String listRespLine = reader.readLine();
        assertNotNull(listRespLine, "No response to tools/list after initialization");
        JsonObject listResp = gson.fromJson(listRespLine, JsonObject.class);
        assertTrue(listResp.has("result"), "tools/list should have result");
        assertTrue(listResp.getAsJsonObject("result").has("tools"), "Result should have tools");

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
