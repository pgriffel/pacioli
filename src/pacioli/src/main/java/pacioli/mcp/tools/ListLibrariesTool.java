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
