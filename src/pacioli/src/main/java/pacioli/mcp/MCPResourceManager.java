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

public class MCPResourceManager {

    private final List<File> libs;

    public MCPResourceManager(List<File> libs) {
        this.libs = new ArrayList<>(libs);
    }

    public String fetch(String uri) throws Exception {

        String path = uriPath(uri);

        Map<String, String> parameters = uriParameters(uri);

        switch (path) {
            case "libraries": {

                return handleLibraries();

                // return handleLibrariesTEXT();

            }
            case "definition": {
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

        for (PacioliFile file : CompilerAPI.collectLibFiles(libs)) {

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

        for (PacioliFile file : CompilerAPI.collectLibFiles(libs)) {

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
