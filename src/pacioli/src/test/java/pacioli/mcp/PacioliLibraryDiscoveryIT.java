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

public class PacioliLibraryDiscoveryIT {

    @Test
    public void libDiscoveryViaMCPServer() throws Exception {
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

        // initialize
        JsonObject init = new JsonObject();
        init.addProperty("jsonrpc", "2.0");
        init.addProperty("id", 1);
        init.addProperty("method", "initialize");
        JsonObject params = new JsonObject();
        params.addProperty("protocolVersion", "2024-11-05");
        init.add("params", params);

        writer.write(gson.toJson(init) + "\n");
        writer.flush();

        String respLine = reader.readLine();
        assertNotNull(respLine, "No response to initialize");

        // call list_libraries
        JsonObject call = new JsonObject();
        call.addProperty("jsonrpc", "2.0");
        call.addProperty("id", 2);
        call.addProperty("method", "tools/call");
        JsonObject callParams = new JsonObject();
        callParams.addProperty("name", "list_libraries");
        call.add("params", callParams);

        writer.write(gson.toJson(call) + "\n");
        writer.flush();

        String listRespLine = reader.readLine();
        assertNotNull(listRespLine, "No response to list_libraries");
        JsonObject listResp = gson.fromJson(listRespLine, JsonObject.class);
        assertTrue(listResp.has("result") || listResp.has("error"));

        if (listResp.has("result")) {
            JsonObject r = listResp.getAsJsonObject("result");
            assertTrue(r.has("libraries"));
            boolean found = false;
            for (var e : r.getAsJsonArray("libraries")) {
                if (e.getAsString().contains("lib")) {
                    found = true;
                    break;
                }
            }
            assertTrue(found, "Expected at least one library path containing 'lib'");
        }

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
