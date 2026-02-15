package pacioli.mcp;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

/**
 * Ad hoc dependency injection for the MCP server.
 */
public class MPCContainer {

    public final MCPTransport transport;
    public final MCPResourceManager resourceManager;
    public final MCPToolHandler toolHandler;
    public final PacioliMCPServer server;

    public static MPCContainer fromSystemIO(List<File> libs) {
        return fromIO(libs, System.in, System.out);
    }

    public static MPCContainer fromIO(List<File> libs, InputStream inStream, OutputStream outStream) {
        return fromTransport(libs, new MCPTransport(inStream, outStream));
    }

    public static MPCContainer fromTransport(List<File> libs, MCPTransport transport) {
        var resourceManager = new MCPResourceManager(libs);
        var toolHandler = new MCPToolHandler(libs);
        var server = new PacioliMCPServer(transport, resourceManager, toolHandler);

        return new MPCContainer(transport, resourceManager, toolHandler, server);
    }

    private MPCContainer(
            MCPTransport transport,
            MCPResourceManager resourceManager,
            MCPToolHandler toolHandler,
            PacioliMCPServer server) {
        this.transport = transport;
        this.resourceManager = resourceManager;
        this.toolHandler = toolHandler;
        this.server = server;
    }

}