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

public class MCPResourceManager {
    private final List<File> libs;

    public MCPResourceManager(List<File> libs) {
        this.libs = new ArrayList<>(libs);
    }

    public List<Path> listLibraries() throws IOException {
        return collectLibraries(libs);
    }

    static List<Path> collectLibraries(List<File> libs) throws IOException {
        var libraries = new ArrayList<Path>();

        Files.walkFileTree(libs.get(0).toPath(), new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                libraries.add(dir);
                return super.preVisitDirectory(dir, attrs);
            }
        });

        libraries.remove(0);

        return libraries;
    }
}
