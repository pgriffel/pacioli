package pacioli.mcp;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;

/**
 * Wrapper around MCPTransport. Intended for integration tests.
 * 
 * Usage:
 * 
 * <pre>
 * // Setup
 * TestConnection testConnection = new TestConnection();
 * PacioliMCPServer server = MPCContainer.fromTransport(LIBS, testConnection.transport).server;
 * ExecutorService exec = Executors.newSingleThreadExecutor();
 * var future = exec.submit(() -> {
 *     try {
 *         server.start();
 *     } catch (Exception e) {
 *         e.printStackTrace();
 *     }
 * });
 * 
 * // Tests
 * testConnection.writeln(...);
 * var reply = testConnection.readJson(...);
 * ...
 * 
 * // Teardown
 * server.stop();
 * exec.shutdown();
 * testConnection.close();
 * </pre>
 */
public class TestConnection {
    private final PipedOutputStream clientToServerPos;
    private final PipedInputStream serverIn;

    private final PipedOutputStream serverToClientPos;
    private final PipedInputStream clientIn;

    public final BufferedWriter writer;
    public final BufferedReader reader;

    public final MCPTransport transport;

    private Gson gson = new Gson();

    TestConnection() throws IOException {
        this.clientToServerPos = new PipedOutputStream();
        this.serverIn = new PipedInputStream(clientToServerPos);

        this.serverToClientPos = new PipedOutputStream();
        this.clientIn = new PipedInputStream(serverToClientPos);

        this.writer = new BufferedWriter(new OutputStreamWriter(clientToServerPos));
        this.reader = new BufferedReader(new InputStreamReader(clientIn));

        this.transport = new MCPTransport(serverIn, serverToClientPos);
    }

    void initialize() throws IOException, MCPException {
        JsonObject params = new JsonObject();
        params.addProperty("protocolVersion", "2024-11-05");

        JsonObject response = this.call("initialize", params);

        if (response == null) {
            throw new MCPException("No response to initialize");
        }

        if (response.has("error")) {
            throw new MCPException("Error reponse in initialize: " + response.get("error"));
        }
    }

    void close() throws IOException {
        clientToServerPos.close();
        serverToClientPos.close();

        writer.close();
        reader.close();
    }

    void writeln(String text) throws IOException {
        writer.write(text + "\n");
        writer.flush();
    }

    void writeln(JsonObject json) throws IOException {
        writer.write(gson.toJson(json) + "\n");
        writer.flush();
    }

    String readString() throws IOException {
        return reader.readLine();
    }

    JsonObject readJson() throws JsonSyntaxException, IOException {
        return gson.fromJson(reader.readLine(), JsonObject.class);
    }

    public JsonObject call(String method, JsonObject parameters) throws IOException {
        JsonObject call = new JsonObject();

        call.addProperty("jsonrpc", "2.0");
        call.addProperty("id", 2);
        call.addProperty("method", method);

        call.add("params", parameters);

        this.writeln(call);

        return this.readJson();
    }

    public JsonObject callTool(String tool, JsonObject arguments) throws IOException {

        JsonObject callParams = new JsonObject();

        callParams.addProperty("name", tool);
        callParams.add("arguments", arguments);

        return this.call("tools/call", callParams);
    }
}
