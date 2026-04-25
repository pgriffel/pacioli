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
import com.google.gson.JsonObject;

import pacioli.compiler.PacioliFile;
import pacioli.compiler.Project;
import pacioli.mcp.MCPException;

public class ProjectGraphTool {
    private final List<File> libs;

    public ProjectGraphTool(List<File> libs) {
        this.libs = new ArrayList<>(libs);
    }

    public String call(JsonObject args) throws Exception {

        if (!args.has("file")) {
            throw new MCPException("missing 'file' argument");
        }

        String path = args.get("file").getAsString();

        var opt = PacioliFile.get(path, 0);

        if (opt.isEmpty()) {
            throw new MCPException("file not found: " + path);
        }

        PacioliFile file = opt.get();

        Project proj = Project.fromFile(file, libs);

        // Create a stream to hold the output
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream ps = new PrintStream(baos);
        // IMPORTANT: Save the old System.out!
        PrintStream old = System.out;
        // Tell Java to use your special stream
        System.setOut(ps);
        // Print some output: goes to your special stream

        proj.printInfo();

        // Put things back
        System.out.flush();
        System.setOut(old);

        return baos.toString();
    }
}
