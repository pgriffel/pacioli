package pacioli.mcp;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class MCPResourceManager {
    private final List<File> libs;

    public MCPResourceManager(List<File> libs) {
        this.libs = new ArrayList<>(libs);
    }

    public List<File> listLibraries() {
        return new ArrayList<>(libs);
    }
}
