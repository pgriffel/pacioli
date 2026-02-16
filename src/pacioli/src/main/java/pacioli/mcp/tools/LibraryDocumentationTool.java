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
