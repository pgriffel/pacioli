package pacioli.mcp;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import pacioli.compiler.Bundle;
import pacioli.compiler.PacioliFile;
import pacioli.compiler.Printable;
import pacioli.compiler.Program;
import pacioli.compiler.Project;
import pacioli.symboltable.info.ValueInfo;

public class MCPResourceManager {
    private final List<File> libs;

    public MCPResourceManager(List<File> libs) {
        this.libs = new ArrayList<>(libs);
    }

    public String fetch(String uri) throws Exception {
        // URIBuilder. builder;

        String path = uriPath(uri);
        Map<String, String> parameters = uriParameters(uri);

        // List<NameValuePair> params = new URIBuilder(uri,
        // StandardCharsets.UTF_8).getQueryParams();

        // // return params.toString();

        switch (path) {
            case "libraries": {

                // List<String> read = Files.readAllLines(docFile.toPath());

                // Optional<PacioliFile> lib = PacioliFile.findLibrary("planets", libs);

                // String docu = libraryDocumentation(lib.get().docFile());

                return "[\"lib1\", \"lib1\"]";
            }
            case "definition": {
                String file = parameters.get("file");
                String lib = parameters.get("library");
                String definition = parameters.get("definition");

                if (definition == null) {
                    throw new MCPException("No 'definition' parameter. This is required for definition lookup.");
                }

                if (lib != null) {
                    return lookupLibDefinition(lib, URLDecoder.decode(definition, StandardCharsets.UTF_8));
                }

                if (file != null) {
                    return lookupDefinition(file, definition);
                }

                throw new MCPException(
                        "No 'file' or 'library' parameter. One of them is required for definition lookup.");
            }
            default: {
                throw new MCPException(String.format("Resource '%s' unknown", path));
            }
        }
        // return uriParameters(uri).toString();
    }

    String libraryDocumentation(File docFile) throws IOException {
        List<String> read = Files.readAllLines(docFile.toPath());
        return String.join("\n", read);
    }

    String lookupLibDefinition(String lib, String definition) {
        return "todo: lookupLibDefinition" + lib + definition;
    }

    String lookupDefinition(String path, String definition) throws Exception {
        var opt = PacioliFile.get(path, 0);

        if (opt.isEmpty()) {
            throw new MCPException("file not found: " + path);
        }

        PacioliFile file = opt.get();
        Program program = Program.load(file);

        var infos = program.generateInfos();

        ValueInfo info = infos.values().lookup(definition);

        if (info == null) {
            throw new MCPException("definition not found: " + definition);
        }

        JsonObject result = valueInfoJson(info);

        return result.toString();
    }

    private JsonObject valueInfoJson(ValueInfo info) {

        Optional<String> type = info.inferredType()
                .map(Printable::pretty)
                .or(() -> info.declaredType().map(Printable::pretty));

        JsonObject json = new JsonObject();

        json.addProperty("name", info.name());
        json.addProperty("module", info.generalInfo().module());
        json.addProperty("isPublic", info.isPublic());
        json.addProperty("isGlobal", info.isGlobal());
        json.addProperty("isUserDefined", info.isUserDefined());
        info.definition().ifPresent(def -> json.addProperty("definition", def.pretty()));
        type.ifPresent(t -> json.addProperty("type", t));

        return json;
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

    // public List<Path> listLibraries() throws IOException {
    // return collectLibraries(libs);
    // }

    // static List<Path> collectLibraries(List<File> libs) throws IOException {
    // var libraries = new ArrayList<Path>();

    // Files.walkFileTree(libs.get(0).toPath(), new SimpleFileVisitor<Path>() {
    // @Override
    // public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs)
    // throws IOException {
    // libraries.add(dir);
    // return super.preVisitDirectory(dir, attrs);
    // }
    // });

    // libraries.remove(0);

    // return libraries;
    // }
}
