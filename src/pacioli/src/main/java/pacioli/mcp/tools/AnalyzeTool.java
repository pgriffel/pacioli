package pacioli.mcp.tools;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import pacioli.compiler.Bundle;
import pacioli.compiler.PacioliFile;
import pacioli.compiler.Project;
import pacioli.symboltable.info.ValueInfo;
import pacioli.mcp.MCPException;
import pacioli.mcp.MCPResourceManager;

public class AnalyzeTool {
    private final List<File> libs;
    private final MCPResourceManager resourceManager;

    public AnalyzeTool(List<File> libs, MCPResourceManager resourceManager) {
        this.resourceManager = resourceManager;
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
            Project project = Project.load(file, libs);
            Bundle bundle = project.loadBundle();

            JsonArray symbols = new JsonArray();
            for (ValueInfo info : bundle.allValueInfos()) {
                JsonObject s = new JsonObject();
                s.addProperty("name", info.name());
                s.addProperty("module", info.generalInfo().module());
                s.addProperty("isPublic", info.isPublic());
                s.addProperty("isGlobal", info.isGlobal());
                s.addProperty("isUserDefined", info.isUserDefined());
                s.addProperty("hasDefinition", info.definition().isPresent());
                s.addProperty("hasInferredType", info.inferredType().isPresent());
                s.addProperty("type", info.inferredType().isPresent() ? info.inferredType().get().pretty()
                        : (info.declaredType().isPresent() ? info.declaredType().get().pretty() : "unknown"));
                symbols.add(s);
            }

            out.add("symbols", symbols);
            out.addProperty("file", path);
            return out;
        } catch (Exception e) {
            throw new MCPException("analyze failed: " + e.getMessage());
        }
    }
}
