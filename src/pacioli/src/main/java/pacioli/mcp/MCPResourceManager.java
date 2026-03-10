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
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.JsonObject;

import pacioli.compiler.PacioliFile;
import pacioli.documentation.LibCatalog;

public class MCPResourceManager {

    private final List<File> libs;

    public MCPResourceManager(List<File> libs) {
        this.libs = new ArrayList<>(libs);
    }

    public String fetch(String uri) throws Exception {

        String path = uriPath(uri);

        Map<String, String> parameters = uriParameters(uri);

        switch (path) {
            case "pacioli:///libraries": {

                return handleLibraries();

                // return handleLibrariesTEXT();

            }
            case "pacioli:///definition": {
                String file = parameters.get("file");
                String lib = parameters.get("library");
                String definition = parameters.get("definition");

                if (definition == null) {
                    throw new MCPException("No 'definition' parameter. This is required for definition lookup.");
                }

                if (lib != null) {
                    return handleLibraryDefinition(lib, definition);
                }

                if (file != null) {
                    return handleDefinition(file, definition);
                }

                throw new MCPException(
                        "No 'file' or 'library' parameter. One of them is required for definition lookup.");
            }
            default: {
                throw new MCPException(String.format("Resource '%s' unknown", path));
            }
        }
    }

    String handleLibraries() throws IOException {
        var arr = new com.google.gson.JsonArray();

        for (PacioliFile file : LibCatalog.collectLibFiles(libs)) {

            var lib = new JsonObject();

            lib.addProperty("name", file.moduleName());
            lib.addProperty("file", file.fsFile().toString());
            try {
                String docu = CompilerAPI.libraryDocumentation(file.docFile());
                lib.addProperty("documentation", docu);
            } catch (IOException e) {
            }

            arr.add(lib);

            // arr.add(CompilerAPI.pacioliFileJson(file));

        }

        return arr.toString();
    }

    String handleLibrariesTEXT() throws IOException {
        var out = new StringBuilder();

        for (PacioliFile file : LibCatalog.collectLibFiles(libs)) {

            out.append(file.moduleName());

            out.append("\n\n");

            try {
                String docu = CompilerAPI.libraryDocumentation(file.docFile());
                out.append(docu);
            } catch (IOException e) {
            }
        }

        return out.toString();
    }

    String handleDefinition(String file, String definition) throws Exception {
        return CompilerAPI.lookupDefinition(file, definition);
    }

    String handleLibraryDefinition(String lib, String definition) {
        return lookupDefinitionFromLib(lib, definition);
    }

    String lookupDefinitionFromLib(String lib, String definition) {
        return "todo: lookupLibDefinition" + lib + definition;
    }

    private String uriPath(String uri) {
        return uri.split("\\?")[0];
    }

    private Map<String, String> uriParameters(String uri) {
        var map = new HashMap<String, String>();

        var split = uri.split("\\?");

        if (split.length > 1) {

            for (String pair : split[1].split("&")) {
                var split2 = pair.split("=");

                if (split2.length > 1) {
                    map.put(split2[0], URLDecoder.decode(split2[1], StandardCharsets.UTF_8));
                }

            }
        }

        return map;
    }
}
