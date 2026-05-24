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

package pacioli.lsp;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

/**
 * Ad hoc dependency injection for the LSP server.
 */
public class LSPContainer {

    public final PacioliTextDocumentService textDocumentService;
    public final PacioliWorkspaceService workspaceService;
    public final PacioliLanguageServer server;

    public static LSPContainer fromSystemIO(List<File> libs) {
        return fromIO(libs, System.in, System.out);
    }

    public static LSPContainer fromIO(List<File> libs, InputStream inStream, OutputStream outStream) {
        var textDocumentService = new PacioliTextDocumentService();
        var workspaceService = new PacioliWorkspaceService();

        var lspServer = new PacioliLanguageServer(textDocumentService, workspaceService, libs);

        return new LSPContainer(textDocumentService, workspaceService, lspServer);
    }

    private LSPContainer(
            PacioliTextDocumentService textDocumentService,
            PacioliWorkspaceService workspaceService,
            PacioliLanguageServer pacioliLanguageServer) {
        this.textDocumentService = textDocumentService;
        this.workspaceService = workspaceService;
        this.server = pacioliLanguageServer;
    }

}
