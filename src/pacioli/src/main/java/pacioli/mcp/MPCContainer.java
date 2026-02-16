/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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