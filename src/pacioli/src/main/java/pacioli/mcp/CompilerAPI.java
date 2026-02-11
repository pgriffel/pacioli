package pacioli.mcp;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.google.gson.JsonObject;

import pacioli.compiler.PacioliFile;
import pacioli.compiler.Printable;
import pacioli.compiler.Program;
import pacioli.symboltable.info.ValueInfo;

/**
 * Where to put this code?
 */
public class CompilerAPI {

    public static String lookupDefinition(String path, String definition) throws Exception {
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

    public static String libraryDocumentation(File docFile) throws IOException {
        List<String> read = Files.readAllLines(docFile.toPath());
        return String.join("\n", read);
    }

    public static List<PacioliFile> collectLibFiles(List<File> libs) throws IOException {
        var libraries = new ArrayList<PacioliFile>();

        for (File lib : libs) {
            libraries.addAll(scanLibDirectory(lib));
        }

        return libraries;
    }

    public static List<PacioliFile> scanLibDirectory(File path) throws IOException {
        var libraries = new ArrayList<PacioliFile>();

        Files.walkFileTree(path.toPath(), new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                PacioliFile
                        .findLibrary(dir.getFileName().toString(), List.of(path))
                        .ifPresent(libraries::add);

                return super.preVisitDirectory(dir, attrs);
            }
        });

        return libraries;
    }

    public static JsonObject valueInfoJson(ValueInfo info) {

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

    public static JsonObject pacioliFileJson(PacioliFile info) {

        JsonObject json = new JsonObject();

        json.addProperty("modulePath", info.modulePath());
        json.addProperty("moduleName", info.moduleName());
        json.addProperty("version", info.version());
        json.addProperty("isInclude", info.isInclude());
        json.addProperty("isLibrary", info.isLibrary());
        json.addProperty("fsFile", info.fsFile().toString());

        return json;
    }
}
