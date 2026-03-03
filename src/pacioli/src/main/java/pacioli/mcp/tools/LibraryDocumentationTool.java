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

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import pacioli.Pacioli;
import pacioli.compiler.PacioliFile;
import pacioli.mcp.CompilerAPI;
import pacioli.mcp.MCPException;

public class LibraryDocumentationTool {
    private final List<File> libs;

    public LibraryDocumentationTool(List<File> libs) {
        this.libs = new ArrayList<>(libs);
    }

    public String call(JsonObject args) throws Exception {
        String path = args.has("name") ? args.get("name").getAsString() : null;

        JsonObject out = new JsonObject();

        if (path == null) {
            throw new MCPException("missing 'name' argument");
        }

        // var opt = PacioliFile.get(path, 0);
        // if (opt.isEmpty()) {
        // throw new MCPException(String.format("Library '%s' not found", path));
        // }

        // PacioliFile file = opt.get();
        // Project project = Project.load(file, libs);
        // Bundle bundle = project.loadBundle();

        List<String> params = new ArrayList<>();
        params.add("man");
        params.add(path);
        params.add("-target");
        params.add("markdown");
        for (File lib : this.libs) {
            params.add("-lib");
            params.add(lib.getAbsolutePath());
        }
        // String[] params = { "api", path, "-lib", libs.get(0).getAbsolutePath() };

        // Create a stream to hold the output
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream ps = new PrintStream(baos);
        // IMPORTANT: Save the old System.out!
        PrintStream old = System.out;
        // Tell Java to use your special stream
        System.setOut(ps);
        // Print some output: goes to your special stream

        Pacioli.main(params.toArray(new String[0]));

        // Put things back
        System.out.flush();
        System.setOut(old);
        // Show what happened
        // System.out.println("Here: " + baos.toString());

        // out.addProperty("output", baos.toString());
        // out.addProperty("file", path);
        return baos.toString();
    }
}
