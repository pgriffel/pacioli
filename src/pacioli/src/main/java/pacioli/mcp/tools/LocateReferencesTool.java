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

package pacioli.mcp.tools;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import pacioli.ast.Node;
import pacioli.compiler.Bundle;
import pacioli.compiler.PacioliFile;
import pacioli.mcp.MCPException;

public class LocateReferencesTool {
    private final List<File> libs;

    public LocateReferencesTool(List<File> libs) {
        this.libs = new ArrayList<>(libs);
    }

    public String call(JsonObject args) throws Exception {

        if (!args.has("file")) {
            throw new MCPException("missing 'file' argument");
        }

        if (!args.has("name")) {
            throw new MCPException("missing 'name' argument");
        }

        String path = args.get("file").getAsString();
        String name = args.get("name").getAsString();

        // Should be 'value' or 'type'
        String kind = args.has("kind") ? args.get("kind").getAsString() : "value";

        PacioliFile file = PacioliFile.get(path, 0).orElseThrow(() -> new MCPException("file not found: " + path));

        Bundle bundle = Bundle.fromFile(file, libs);

        Map<String, List<Node>> referencesMap = kind.equals("type")
                ? bundle.typeReferencesMap()
                : bundle.valueReferencesMap();

        List<Node> refs = referencesMap.get(name);

        if (refs == null) {
            throw new MCPException(String.format("Name '%s' does not exist in file %s", name, file.module()));
        }

        var res = new com.google.gson.JsonObject();
        var arr = new com.google.gson.JsonArray();

        for (Node ref : refs) {
            JsonObject s = new JsonObject();

            s.addProperty("file", ref.location().file().get().getCanonicalFile().toString());
            s.addProperty("startLine", ref.location().fromLine);
            s.addProperty("startColumn", ref.location().fromColumn);

            arr.add(s);
        }

        res.add("references", arr);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(res);

    }
}
