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

import java.io.File;
import java.io.IOException;
import java.util.List;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import pacioli.mcp.tools.AnalyzeTool;
import pacioli.mcp.tools.InferTypesTool;
import pacioli.mcp.tools.LibraryDocumentationTool;
import pacioli.mcp.tools.ListLibrariesTool;
import pacioli.mcp.tools.ListSymbolsTool;

public class MCPToolHandler {

    private final AnalyzeTool analyzeTool;
    private final ListSymbolsTool listSymbolsTool;
    private final InferTypesTool inferTypesTool;
    private final ListLibrariesTool listLibrariesTool;
    private final LibraryDocumentationTool libraryDocumentationTool;

    public MCPToolHandler(List<File> libs) {
        this.analyzeTool = new AnalyzeTool(libs);
        this.listSymbolsTool = new ListSymbolsTool(libs);
        this.inferTypesTool = new InferTypesTool(libs);
        this.listLibrariesTool = new ListLibrariesTool(libs);
        this.libraryDocumentationTool = new LibraryDocumentationTool(libs);
    }

    public JsonObject callTool(JsonObject params) throws Exception {
        return mpcCallToolResult(dispatch(params));
    }

    JsonObject mpcCallToolResult(String text) {
        JsonArray contentArray = new JsonArray();

        var entry = new JsonObject();
        entry.addProperty("type", "text");
        entry.addProperty("text", text);

        contentArray.add(entry);

        var result = new JsonObject();

        result.add("content", contentArray);
        // result.add("structuredContent", toolResult);

        return result;
    }

    public String dispatch(JsonObject params) throws Exception {
        String name = params.has("name") ? params.get("name").getAsString() : null;
        JsonObject args = params.has("arguments") ? params.getAsJsonObject("arguments") : new JsonObject();
        if ("analyze_file".equals(name)) {
            return analyzeTool.call(args).toString();
        } else if ("list_symbols".equals(name)) {
            return listSymbolsTool.call(args).toString();
        } else if ("infer_types".equals(name)) {
            return inferTypesTool.call(args).toString();
        } else if ("list_libraries".equals(name)) {
            return listLibrariesTool.call(args);
        } else if ("library_documentation".equals(name)) {
            return libraryDocumentationTool.call(args);
        } else {
            throw new MCPException("Unknown tool: " + name);
        }
    }
}
