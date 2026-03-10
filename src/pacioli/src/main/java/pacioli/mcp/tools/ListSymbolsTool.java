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

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import pacioli.compiler.Bundle;
import pacioli.compiler.PacioliFile;
import pacioli.compiler.Project;
import pacioli.symboltable.info.ValueInfo;
import pacioli.mcp.MCPException;
import pacioli.mcp.MCPResourceManager;

public class ListSymbolsTool {
    private final List<File> libs;

    public ListSymbolsTool(List<File> libs) {
        this.libs = new ArrayList<>(libs);
    }

    public JsonObject call(JsonObject args) throws MCPException {
        try {
            String path = args.has("filepath") ? args.get("filepath").getAsString() : null;

            JsonObject out = new JsonObject();

            if (path == null) {
                out.addProperty("error", "missing 'filepath' argument");
                return out;
            }

            var opt = PacioliFile.get(path, 0);
            if (opt.isEmpty()) {
                out.addProperty("error", "file not found: " + path);
                return out;
            }

            PacioliFile file = opt.get();
            Bundle bundle = Bundle.fromFile(file, libs);

            JsonArray symbols = new JsonArray();
            for (ValueInfo info : bundle.allValueInfos()) {
                if (!info.isPublic())
                    continue;
                JsonObject s = new JsonObject();
                s.addProperty("name", info.name());
                s.addProperty("type", info.inferredType().isPresent() ? info.inferredType().get().pretty() : "unknown");
                s.addProperty("module", info.generalInfo().module());
                symbols.add(s);
            }

            out.add("symbols", symbols);
            out.addProperty("module", file.module());
            return out;
        } catch (Exception e) {
            throw new MCPException("list_symbols failed", e);
        }
    }
}
