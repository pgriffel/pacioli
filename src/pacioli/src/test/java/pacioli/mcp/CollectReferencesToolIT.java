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

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

/**
 * Test for the 'locate_references' MCP tool.
 */
class CollectReferencesToolIT {

    static final List<File> LIBS = TestEnvironment.LIBS;

    @Test
    void collectReferencesTool() throws Exception {

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
        arguments.addProperty("name", "BoM");
        JsonObject listResp = testConnection.callTool("locate_references", arguments);

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

        // When the text is parsed as Json object
        String text = contents0.get("text").getAsString();
        Gson gson = new Gson();
        JsonObject textObject = gson.fromJson(text, JsonObject.class);

        // Then the parsed text element should have property 'references'
        assertTrue(textObject.has("references"));

        // And the references should have 4 elements
        JsonArray refs = textObject.get("references").getAsJsonArray();
        assertEquals(4, refs.size());

        // And the elements should have the correct locations
        assertRefEquals(refs.get(0).getAsJsonObject(), bomFile.getCanonicalPath(), 103, 12);
        assertRefEquals(refs.get(1).getAsJsonObject(), bomFile.getCanonicalPath(), 84, 10);
        assertRefEquals(refs.get(2).getAsJsonObject(), bomFile.getCanonicalPath(), 109, 15);
        assertRefEquals(refs.get(3).getAsJsonObject(), bomFile.getCanonicalPath(), 132, 56);

        // Teardown
        server.stop();
        exec.shutdown();
        testConnection.close();
    }

    void assertRefEquals(JsonObject ref3, String file, int start, int end) {
        assertEquals(file, ref3.get("file").getAsString());
        assertEquals(start, ref3.get("startLine").getAsInt());
        assertEquals(end, ref3.get("startColumn").getAsInt());
    }
}
