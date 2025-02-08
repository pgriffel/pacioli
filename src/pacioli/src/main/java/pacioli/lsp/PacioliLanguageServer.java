package pacioli.lsp;

import java.io.File;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.eclipse.lsp4j.CompletionOptions;
import org.eclipse.lsp4j.DiagnosticRegistrationOptions;
import org.eclipse.lsp4j.InitializeParams;
import org.eclipse.lsp4j.InitializeResult;
import org.eclipse.lsp4j.MessageParams;
import org.eclipse.lsp4j.MessageType;
import org.eclipse.lsp4j.ServerCapabilities;
import org.eclipse.lsp4j.TextDocumentSyncKind;
import org.eclipse.lsp4j.services.LanguageClient;
import org.eclipse.lsp4j.services.LanguageClientAware;
import org.eclipse.lsp4j.services.LanguageServer;
import org.eclipse.lsp4j.services.TextDocumentService;
import org.eclipse.lsp4j.services.WorkspaceService;

public class PacioliLanguageServer implements LanguageServer, LanguageClientAware {

    private PacioliTextDocumentService textDocumentService;
    private PacioliWorkspaceService workspaceService;
    private LanguageClient languageClient;

    List<File> libs;

    private int shutdown = 1;

    public PacioliLanguageServer(
            PacioliTextDocumentService textDocumentService,
            PacioliWorkspaceService workspaceService,
            List<File> libs) {
        this.textDocumentService = textDocumentService;
        this.workspaceService = workspaceService;
        this.libs = libs;
    }

    /**
     * Connects the PacioliTextDocumentService, the PacioliWorkspaceService and the
     * LanguageClient.
     * 
     * Must be called before starting listening.
     * 
     * @param client The LanguageClient to connect to. Use getRemoteProxy() on
     *               Launcher<LanguageClient> to get a client.
     */
    @Override
    public void connect(LanguageClient client) {
        this.languageClient = client;
        this.textDocumentService.connect(client, this.libs);
        this.workspaceService.connect(client);
    }

    @Override
    public void exit() {
        this.logInfo("exit language server");
    }

    @Override
    public TextDocumentService getTextDocumentService() {
        return this.textDocumentService;
    }

    @Override
    public WorkspaceService getWorkspaceService() {
        return this.workspaceService;
    }

    @Override
    public CompletableFuture<InitializeResult> initialize(InitializeParams params) {
        this.logInfo("initializing PacioliLanguageServer");

        final InitializeResult response = new InitializeResult(new ServerCapabilities());
        // Set the document synchronization capabilities to full.
        response.getCapabilities().setTextDocumentSync(TextDocumentSyncKind.Full);
        response.getCapabilities().setCompletionProvider(new CompletionOptions());
        response.getCapabilities().setDiagnosticProvider(new DiagnosticRegistrationOptions());

        var clientCapabilities = params.getCapabilities();

        /*
         * Check if dynamic registration of completion capability is allowed by the
         * client. If so we don't register the capability.
         * Else, we register the completion capability.
         */
        // if (!isDynamicCompletionRegistration()) {
        // response.getCapabilities().setCompletionProvider(new CompletionOptions());
        // }

        return CompletableFuture.supplyAsync(() -> response);
    }

    @Override
    public CompletableFuture<Object> shutdown() {
        shutdown = 0;
        return CompletableFuture.supplyAsync(Object::new);
    }

    private void logInfo(String string, Object... args) {
        this.languageClient.logMessage(new MessageParams(MessageType.Info, String.format(string, args)));
    }
}
