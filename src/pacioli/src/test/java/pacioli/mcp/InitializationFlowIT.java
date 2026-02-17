/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.mcp;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.junit.jupiter.api.Test;

import com.google.gson.JsonObject;

/**
 * Tests the correct handling of the initial handshake between an mcp client and
 * the PacioliMCPServer.
 * 
 * Connects with the server and sends the 'tools/list' discovery message to see
 * if the server actually works. Checks that a result is produced, but not the
 * contents of the result.
 * 
 * Does not use the TestConnection 'call' or 'callTool' methods.
 */
class InitializationFlowIT {

    static final List<File> LIBS = TestEnvironment.LIBS;

    @Test
    void completeInitializationHandshake() throws Exception {

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

        // Step 1: Send initialize request
        JsonObject init = new JsonObject();
        init.addProperty("jsonrpc", "2.0");
        init.addProperty("id", 1);
        init.addProperty("method", "initialize");
        JsonObject params = new JsonObject();
        params.addProperty("protocolVersion", "2024-11-05");
        init.add("params", params);

        testConnection.writeln(init);

        // Step 2: Receive initialize response
        JsonObject initResp = testConnection.readJson();
        assertNotNull(initResp, "No response to initialize");
        assertTrue(initResp.has("result"), "Initialize response should have result");

        // Step 3: Send notifications/initialized (client is ready)
        JsonObject initialized = new JsonObject();
        initialized.addProperty("jsonrpc", "2.0");
        initialized.addProperty("method", "notifications/initialized");
        // Note: notifications don't have an id field per MCP spec

        testConnection.writeln(initialized);

        // Step 4: Server should acknowledge initialization silently (no response)
        // and be ready for tools/list or tools/call requests

        // Step 5: Send tools/list request to verify server is ready
        JsonObject listRequest = new JsonObject();
        listRequest.addProperty("jsonrpc", "2.0");
        listRequest.addProperty("id", 2);
        listRequest.addProperty("method", "tools/list");

        testConnection.writeln(listRequest);

        // Step 6: Receive tools/list response
        JsonObject listResp = testConnection.readJson();
        assertNotNull(listResp, "No response to tools/list after initialization");
        assertTrue(listResp.has("result"), "tools/list should have result");
        assertTrue(listResp.getAsJsonObject("result").has("tools"), "Result should have tools");

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
