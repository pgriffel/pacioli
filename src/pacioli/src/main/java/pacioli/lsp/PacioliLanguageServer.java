/*
 * Copyright (c) 2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pacioli.lsp;

import java.io.File;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.eclipse.lsp4j.CompletionOptions;
import org.eclipse.lsp4j.DefinitionOptions;
import org.eclipse.lsp4j.HoverOptions;
import org.eclipse.lsp4j.InitializeParams;
import org.eclipse.lsp4j.InitializeResult;
import org.eclipse.lsp4j.MessageParams;
import org.eclipse.lsp4j.MessageType;
import org.eclipse.lsp4j.SemanticTokensWithRegistrationOptions;
import org.eclipse.lsp4j.ServerCapabilities;
import org.eclipse.lsp4j.SignatureHelpOptions;
import org.eclipse.lsp4j.TextDocumentSyncKind;
import org.eclipse.lsp4j.services.LanguageClient;
import org.eclipse.lsp4j.services.LanguageClientAware;
import org.eclipse.lsp4j.services.LanguageServer;
import org.eclipse.lsp4j.services.TextDocumentService;
import org.eclipse.lsp4j.services.WorkspaceService;

public class PacioliLanguageServer implements LanguageServer, LanguageClientAware {

    static List<String> SIGNATURE_HELP_TRIGGER_CHARACTERS = List.of("(");

    private PacioliTextDocumentService textDocumentService;

    private PacioliWorkspaceService workspaceService;

    private LanguageClient languageClient;

    List<File> libs;

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
    public CompletableFuture<InitializeResult> initialize(InitializeParams params) {
        return CompletableFuture.supplyAsync(() -> {

            // Todo: check capabilities
            var clientCapabilities = params.getCapabilities();

            var serverCapabilities = new ServerCapabilities();

            serverCapabilities.setTextDocumentSync(TextDocumentSyncKind.Full);

            serverCapabilities.setDefinitionProvider(new DefinitionOptions());
            serverCapabilities.setCompletionProvider(new CompletionOptions());
            serverCapabilities.setHoverProvider(new HoverOptions());
            serverCapabilities.setSemanticTokensProvider(
                    new SemanticTokensWithRegistrationOptions(DocumentState.SEMANTIC_TOKEN_LEGEND, true));
            serverCapabilities.setSignatureHelpProvider(new SignatureHelpOptions(SIGNATURE_HELP_TRIGGER_CHARACTERS));

            this.logInfo("PacioliLanguageServer initialized, waiting for requests...");

            return new InitializeResult(serverCapabilities);
        });
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
    public void exit() {
        this.logInfo("Exit Pacioli language server");
    }

    @Override
    public CompletableFuture<Object> shutdown() {
        return CompletableFuture.supplyAsync(Object::new);
    }

    private void logInfo(String string, Object... args) {
        this.languageClient.logMessage(new MessageParams(MessageType.Info, String.format(string, args)));
    }
}
