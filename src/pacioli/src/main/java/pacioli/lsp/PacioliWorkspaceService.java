package pacioli.lsp;

import java.util.concurrent.CompletableFuture;

import org.eclipse.lsp4j.DidChangeConfigurationParams;
import org.eclipse.lsp4j.DidChangeWatchedFilesParams;
import org.eclipse.lsp4j.ExecuteCommandParams;
import org.eclipse.lsp4j.MessageParams;
import org.eclipse.lsp4j.MessageType;
import org.eclipse.lsp4j.SemanticTokens;
import org.eclipse.lsp4j.services.LanguageClient;
import org.eclipse.lsp4j.services.WorkspaceService;

import pacioli.lsp.PacioliTextDocumentService.DocumentState;

public class PacioliWorkspaceService implements WorkspaceService {

    private LanguageClient languageClient;

    /**
     * Connects the PacioliTextDocumentService, the PacioliWorkspaceService and the
     * LanguageClient.
     * 
     * Must be called before starting listening.
     * 
     * @param client The LanguageClient to connect to. Use getRemoteProxy() on
     *               Launcher<LanguageClient> to get a client.
     */
    public void connect(LanguageClient client) {
        this.languageClient = client;
    }

    @Override
    public void didChangeConfiguration(DidChangeConfigurationParams params) {
        this.logInfo("Operation 'workspace/didChangeConfiguration' Ack");
    }

    @Override
    public void didChangeWatchedFiles(DidChangeWatchedFilesParams params) {
        this.logInfo("Operation 'workspace/didChangeWatchedFiles' Ack");
    }

    @Override
    public CompletableFuture<Object> executeCommand(ExecuteCommandParams params) {
        this.logInfo("Operation 'workspace/executeCommand' %s", params);
        return CompletableFuture.supplyAsync(() -> {
            return null;
        });
    }

    private void logInfo(String string, Object... args) {
        this.languageClient.logMessage(new MessageParams(MessageType.Info, String.format(string, args)));

    }
}
