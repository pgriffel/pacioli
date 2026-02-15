package pacioli.mcp.tools;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonObject;

import pacioli.Pacioli;
import pacioli.compiler.PacioliFile;
import pacioli.mcp.MCPException;

public class InferTypesTool {
    private final List<File> libs;

    public InferTypesTool(List<File> libs) {
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
            // Project project = Project.load(file, libs);
            // Bundle bundle = project.loadBundle();

            String[] params = { "types", path, "-lib", libs.get(0).getAbsolutePath() };

            // Create a stream to hold the output
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PrintStream ps = new PrintStream(baos);
            // IMPORTANT: Save the old System.out!
            PrintStream old = System.out;
            // Tell Java to use your special stream
            System.setOut(ps);
            // Print some output: goes to your special stream

            Pacioli.main(params);

            // Put things back
            System.out.flush();
            System.setOut(old);
            // Show what happened
            // System.out.println("Here: " + baos.toString());

            out.addProperty("output", baos.toString());
            out.addProperty("file", path);
            return out;
        } catch (Exception e) {
            throw new MCPException("analyze failed: " + e.getMessage());
        }
    }
}
