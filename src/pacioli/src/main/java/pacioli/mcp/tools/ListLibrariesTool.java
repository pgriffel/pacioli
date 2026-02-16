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

import pacioli.compiler.PacioliFile;
import pacioli.mcp.CompilerAPI;

public class ListLibrariesTool {
    private final List<File> libs;

    public ListLibrariesTool(List<File> libs) {
        this.libs = new ArrayList<>(libs);
    }

    public String call(JsonObject args) throws IOException {
        // Return list of library directories
        var res = new com.google.gson.JsonObject();
        var arr = new com.google.gson.JsonArray();

        for (PacioliFile file : CompilerAPI.collectLibFiles(libs)) {
            var lib = new JsonObject();

            lib.addProperty("name", file.moduleName());
            lib.addProperty("file", file.fsFile().toString());
            try {
                String docu = CompilerAPI.libraryDocumentation(file.docFile());
                lib.addProperty("documentation", docu);
            } catch (IOException e) {
            }

            var entry = new JsonObject();
            entry.addProperty("type", "text");
            entry.addProperty("text", lib.toString());
            arr.add(entry);
        }

        res.add("content", arr);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(res);

        // return res.toString();
    }
}
