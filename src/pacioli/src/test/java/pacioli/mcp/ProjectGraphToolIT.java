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

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

/**
 * Test for the 'list_libraries' tool. Should be a resource?!
 */
class ProjectGraphToolIT {

    static final List<File> LIBS = TestEnvironment.LIBS;

    @Test
    void projectGraphTool() throws Exception {

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

        // Given the file bom.pacioli from the samples
        File bomFile = new File("../../samples/bom/bom.pacioli");

        // When the 'locate_references' tool is called with name 'BoM'
        JsonObject arguments = new JsonObject();
        arguments.addProperty("file", bomFile.getAbsolutePath());

        JsonObject listResp = testConnection.callTool("project_graph", arguments);

        // Then the call should succeed and the reply should contain property 'result'
        assertTrue(listResp.has("result"));

        // And the result should have property 'content'
        JsonObject r = listResp.getAsJsonObject("result");
        assertTrue(r.has("content"));

        // And the content should have size one
        JsonArray contents = r.getAsJsonArray("content");
        assertEquals(1, contents.size());

        // And the content element should have property 'text'
        JsonObject contents0 = contents.get(0).getAsJsonObject();
        assertTrue(contents0.has("text"));

        // Then the text should be correct
        String text = contents0.get("text").getAsString();
        assertEquals(-112523194, text.hashCode());

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }
}
