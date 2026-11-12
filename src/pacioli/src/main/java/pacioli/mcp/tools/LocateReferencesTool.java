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
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import pacioli.compiler.Bundle;
import pacioli.compiler.ReferencesTable;
import pacioli.compiler.Location;
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

        // Location the file, load it into a Bundle and build a ReferencesTable
        String path = args.get("file").getAsString();
        String name = args.get("name").getAsString();

        PacioliFile file = PacioliFile.get(path, 0).orElseThrow(() -> new MCPException("file not found: " + path));

        Bundle bundle = Bundle.fromFile(file, libs);

        ReferencesTable refTable = bundle.buildReferencesTable();

        // Collect the references into a JsonArray. Can be type or value references
        List<ReferencesTable.Entry> typeRefs = refTable.getTypeReferences(name);
        List<ReferencesTable.Entry> valueRefs = refTable.getValueReferences(name);

        if (typeRefs == null && valueRefs == null) {
            throw new MCPException(String.format("Name '%s' does not exist in file %s", name, file.module()));
        }

        var jsonArray = new com.google.gson.JsonArray();

        if (typeRefs != null) {
            typeRefs.stream()
                    .map(ref -> ref.location())
                    .sorted()
                    .map(loc -> refToJson(loc, "type"))
                    .forEach(json -> jsonArray.add(json));
        }

        if (valueRefs != null) {
            valueRefs.stream()
                    .map(ref -> ref.location())
                    .sorted()
                    .map(loc -> refToJson(loc, "value"))
                    .forEach(json -> jsonArray.add(json));
        }

        var envelope = new com.google.gson.JsonObject();

        envelope.add("references", jsonArray);

        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        return gson.toJson(envelope);

    }

    static JsonObject refToJson(Location loc, String kind) {
        String fileName;

        try {
            fileName = loc.fsFile().get().getCanonicalFile().toString();
        } catch (IOException e) {
            fileName = "unknown";
        }

        JsonObject s = new JsonObject();

        s.addProperty("file", fileName);
        s.addProperty("startLine", loc.fromLine);
        s.addProperty("startColumn", loc.fromColumn);
        s.addProperty("kind", kind);

        return s;
    }
}
