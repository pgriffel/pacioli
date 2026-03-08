package pacioli.documentation;

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

import org.apache.commons.io.FilenameUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import pacioli.compiler.PacioliException;
import pacioli.compiler.PacioliFile;

/**
 * Generates documentation for the available libraries.
 */
public class LibCatalog {

    public final List<File> libs;

    /**
     * Constructor
     * 
     * @param libs A list of lib paths. A lib path is where Pacioli libraries are
     *             located.
     */
    public LibCatalog(List<File> libs) {
        this.libs = libs;
    }

    /**
     * Generates documentation
     * 
     * @param target One of 'markdown', 'html', or 'structure'
     * @return Documentation for all available libraries
     * @throws IOException
     */
    public String generate(String target) throws IOException {
        return this.generate(new ArrayList<>(), target);
    }

    /**
     * Generates documentation for a selection of the available libraries.
     * 
     * If the selection is empty then it is ignored and documentation for
     * all available libraries is generated.
     * 
     * @param args   A list of library names, e.g. 'geometry'
     * @param target One of 'markdown', 'html', or 'structure'
     * @return Documentation for the selected libraries
     * @throws IOException
     */
    public String generate(List<String> args, String target) throws IOException {
        List<PacioliFile> libFiles;

        if (args.isEmpty()) {
            libFiles = LibCatalog.collectLibFiles(libs);
        } else {
            libFiles = new ArrayList<>();

            for (String fileName : args) {
                Optional<PacioliFile> optionalFile = PacioliFile
                        .findLibrary(FilenameUtils.removeExtension(new File(fileName).getName()), libs);

                if (optionalFile.isPresent()) {
                    libFiles.add(optionalFile.get());
                } else {
                    throw new PacioliException("Error: library '%s' does not exist.", fileName);
                }
            }
        }

        switch (target) {
            case "", "markdown": {
                return LibCatalog.asMarkdown(libFiles);
            }
            case "structure": {
                return LibCatalog.asJson(libFiles);
            }
            case "html": {
                return LibCatalog.asHTML(libFiles);
            }
            default: {
                throw new PacioliException("Unknown target for library catalog: " + target
                        + ". Expected on of 'markdown', 'html', or 'structure'.");
            }
        }
    }

    private static String asJson(List<PacioliFile> libs) {
        var res = new com.google.gson.JsonObject();
        var arr = new com.google.gson.JsonArray();

        for (PacioliFile file : libs) {
            var lib = new JsonObject();

            lib.addProperty("name", file.moduleName());
            lib.addProperty("file", file.fsFile().toString());
            lib.addProperty("documentation", file.documentation().orElse("No documentation available"));

            var entry = new JsonObject();
            entry.addProperty("type", "text");
            entry.addProperty("text", lib.toString());
            arr.add(entry);
        }

        res.add("content", arr);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(res);
    }

    private static String asMarkdown(List<PacioliFile> libs) {
        DocBuilder docBuilder = docBuilder(libs);
        return docBuilder.markdown();
    }

    private static String asHTML(List<PacioliFile> libs) {
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

            docBuilder.line("%s", file.documentation().orElse("No documentation available"));

        }

        return docBuilder;
    }

    /**
     * Find the PacioliFile for all libraries in a list of lib directories. A lib
     * directory is a directory where Pacioli libraries are located. Multiple lib
     * directories can be passed to the compiler via the command line.
     * 
     * TODO: make private when mcp is removed!?
     * 
     * @param libs
     * @return
     * @throws IOException
     */
    public static List<PacioliFile> collectLibFiles(List<File> libs) throws IOException {
        var libraries = new ArrayList<PacioliFile>();

        for (File lib : libs) {
            libraries.addAll(scanLibDirectory(lib));
        }

        return libraries;
    }

    /**
     * Find the PacioliFile for all libraries in a 'libs' directory. Helper for
     * collectLibFiles.
     * 
     * @param path The library path
     * @return
     * @throws IOException
     */
    private static List<PacioliFile> scanLibDirectory(File path) throws IOException {
        var libraries = new ArrayList<PacioliFile>();

        Files.walkFileTree(Path.of(path.getAbsolutePath()), new SimpleFileVisitor<Path>() {
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
}
