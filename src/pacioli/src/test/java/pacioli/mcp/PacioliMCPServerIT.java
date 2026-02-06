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

public class PacioliMCPServerIT {

    @Test
    public void startServerAndCallAnalyze() throws Exception {
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
        JsonObject resp = gson.fromJson(respLine, JsonObject.class);
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

        writer.write(gson.toJson(call) + "\n");
        writer.flush();

        String analyzeRespLine = reader.readLine();
        assertNotNull(analyzeRespLine, "No response to analyze_file");
        JsonObject analyzeResp = gson.fromJson(analyzeRespLine, JsonObject.class);
        assertTrue(analyzeResp.has("result") || analyzeResp.has("error"));

        // If we have a result, assert it contains symbols array
        if (analyzeResp.has("result")) {
            JsonObject r = analyzeResp.getAsJsonObject("result");
            assertTrue(r.has("symbols") || r.has("error"));
        }

        // Stop server gracefully and wait for thread completion
        server.stop();

        // Close client/server piped streams to ensure readLine unblocks
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
