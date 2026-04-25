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
