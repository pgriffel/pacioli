package pacioli.documentation;

import java.io.IOException;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import pacioli.compiler.PacioliFile;
import pacioli.mcp.CompilerAPI;

public class LibCatalog {

    public static String asJson(List<PacioliFile> libs) {
        var res = new com.google.gson.JsonObject();
        var arr = new com.google.gson.JsonArray();

        for (PacioliFile file : libs) {
            var lib = new JsonObject();

            lib.addProperty("name", file.moduleName());
            lib.addProperty("file", file.fsFile().toString());
            try {
                String docu = CompilerAPI.libraryDocumentation(file.docFile());
                lib.addProperty("documentation", docu);
            } catch (IOException e) {
                lib.addProperty("documentation", "No documentation available");
            }

            var entry = new JsonObject();
            entry.addProperty("type", "text");
            entry.addProperty("text", lib.toString());
            arr.add(entry);
        }

        res.add("content", arr);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(res);
    }

    public static String asMarkdown(List<PacioliFile> libs) {
        DocBuilder docBuilder = docBuilder(libs);
        return docBuilder.markdown();
    }

    public static String asHTML(List<PacioliFile> libs) {
        DocBuilder docBuilder = docBuilder(libs);
        return docBuilder.html();
    }

    private static DocBuilder docBuilder(List<PacioliFile> libs) {
        DocBuilder docBuilder = new DocBuilder();

        docBuilder
                .header(1)
                .text("Library catalog")
                .newline();

        docBuilder.line("List of available Pacioli libraries");

        for (PacioliFile file : libs) {
            docBuilder
                    .header(2)
                    .text(file.moduleName())
                    .newline();

            String docu;
            try {
                docu = CompilerAPI.libraryDocumentation(file.docFile());
                docBuilder.line("%s", docu);
            } catch (IOException e) {
                docBuilder.line("No documentation available");
            }
        }

        return docBuilder;
    }
}
