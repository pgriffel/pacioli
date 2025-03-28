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

import java.io.BufferedReader;
import java.io.File;
import java.io.StringReader;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.eclipse.lsp4j.CompletionItem;
import org.eclipse.lsp4j.CompletionList;
import org.eclipse.lsp4j.CompletionParams;
import org.eclipse.lsp4j.DefinitionParams;
import org.eclipse.lsp4j.Diagnostic;
import org.eclipse.lsp4j.DidChangeTextDocumentParams;
import org.eclipse.lsp4j.DidCloseTextDocumentParams;
import org.eclipse.lsp4j.DidOpenTextDocumentParams;
import org.eclipse.lsp4j.DidSaveTextDocumentParams;
import org.eclipse.lsp4j.Hover;
import org.eclipse.lsp4j.HoverParams;
import org.eclipse.lsp4j.LocationLink;
import org.eclipse.lsp4j.MarkupContent;
import org.eclipse.lsp4j.MarkupKind;
import org.eclipse.lsp4j.MessageParams;
import org.eclipse.lsp4j.MessageType;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.PublishDiagnosticsParams;
import org.eclipse.lsp4j.Range;
import org.eclipse.lsp4j.SemanticTokens;
import org.eclipse.lsp4j.SemanticTokensParams;
import org.eclipse.lsp4j.SignatureHelp;
import org.eclipse.lsp4j.SignatureHelpParams;
import org.eclipse.lsp4j.jsonrpc.messages.Either;
import org.eclipse.lsp4j.services.LanguageClient;
import org.eclipse.lsp4j.services.TextDocumentService;

import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.visitors.AllIdentifiersVisitor.IdentifierInfo;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;

public class PacioliTextDocumentService implements TextDocumentService {

    /**
     * For how many documents is a DocumentState kept in memory?
     */
    int CACHE_SIZE = 5;

    /**
     * Link to the language client
     */
    private LanguageClient languageClient;

    /**
     * The library directories for the pacioli compiler. Is an extension setting.
     */
    List<File> libs;

    /**
     * Contains the state for the open documents. Contains at most CACHE_SIZE items.
     */
    private List<DocumentState> documentStates = new ArrayList<>();

    /**
     * The latest text that was received by the didChange event. Currently not used
     * by the compiler. It is stored for the signature helper. That event refers to
     * unsaved text, so to find the identifier at the cursor we store this text.
     * 
     * Is not stored per document. Only the currently edited is needed. Since
     * didChange is sent before the signature helper event this works okay.
     */
    private String latestText;

    /**
     * Connects the PacioliTextDocumentService, the PacioliWorkspaceService and the
     * LanguageClient.
     * 
     * Must be called before starting listening.
     * 
     * @param client The LanguageClient to connect to. Use getRemoteProxy() on
     *               Launcher<LanguageClient> to get a client.
     */
    public void connect(LanguageClient client, List<File> libs) {
        this.languageClient = client;
        this.libs = libs;
    }

    /**
     * Implementation of the LSP notification.
     */
    @Override
    public void didChange(DidChangeTextDocumentParams params) {
        // Store the latest text for the signature help.
        this.latestText = params.getContentChanges().get(0).getText();
    }

    /**
     * Implementation of the LSP notification.
     */
    @Override
    public void didClose(DidCloseTextDocumentParams params) {
    }

    /**
     * Implementation of the LSP notification.
     */
    @Override
    public void didOpen(DidOpenTextDocumentParams params) {
        // No need for error handling here. Is done in loadBundle.
        this.loadBundle(params.getTextDocument().getUri());
    }

    /**
     * Implementation of the LSP notification.
     */
    @Override
    public void didSave(DidSaveTextDocumentParams params) {
        // No need for error handling here. Is done in loadBundle.
        this.loadBundle(params.getTextDocument().getUri());
        this.languageClient.refreshSemanticTokens();
    }

    /**
     * Implementation of the LSP request.
     */
    @Override
    public CompletableFuture<Either<List<CompletionItem>, CompletionList>> completion(CompletionParams position) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String uri = position.getTextDocument().getUri();

                return Either.forLeft(this.getState(uri).completionItems());

            } catch (Exception e) {
                return Either.forLeft(List.of());
            }
        });
    }

    /**
     * Implementation of the LSP request.
     */
    @Override
    public CompletableFuture<Either<List<? extends org.eclipse.lsp4j.Location>, List<? extends LocationLink>>> definition(
            DefinitionParams params) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                var uri = params.getTextDocument().getUri();
                var pos = params.getPosition();

                return Either.forLeft(this.getState(uri).definitionLocation(pos));

            } catch (Exception e) {
                return Either.forLeft(List.of());
            }
        });
    }

    /**
     * Implementation of the LSP request.
     */
    @Override
    public CompletableFuture<SignatureHelp> signatureHelp(SignatureHelpParams params) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                var uri = params.getTextDocument().getUri();
                var position = params.getPosition();

                Optional<String> identifier = identifierTriggeringSignatureHelp(uri, position);

                if (identifier.isEmpty()) {
                    return new SignatureHelp();
                }

                return this.getState(uri).signatureHelp(identifier.get());

            } catch (Exception e) {
                return new SignatureHelp();
            }
        });
    }

    /**
     * Implementation of the LSP request.
     */
    @Override
    public CompletableFuture<Hover> hover(HoverParams params) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Position pos = params.getPosition();
                String uri = params.getTextDocument().getUri();

                return this.getState(uri).hover(pos);
            } catch (Exception e) {
                return new Hover(new MarkupContent(MarkupKind.PLAINTEXT, ""));
            }
        });
    }

    /**
     * Implementation of the LSP request.
     */
    @Override
    public CompletableFuture<SemanticTokens> semanticTokensFull(SemanticTokensParams params) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String uri = params.getTextDocument().getUri();
                return this.getState(uri).semanticTokens();
            } catch (Exception e) {
                return new SemanticTokens();
            }
        });
    }

    /**
     * Loads the bundle, computes the DocumentState for it, and stores it in
     * the state cache.
     * 
     * If a compilation error is thrown it is published as a diagnostic. This
     * method handles all errors.
     * 
     * @param uri The uri of the bundle to load.
     */
    private void loadBundle(String uri) {

        var errors = new ArrayList<Diagnostic>();

        try {
            boolean debugLocations = false; // dev feature

            var state = this.storeState(uri);

            if (debugLocations) {
                for (Entry<Integer, List<IdentifierInfo>> entry : state.identifierIndex.entrySet()) {
                    for (IdentifierInfo idInfo : entry.getValue()) {
                        if (true || !(idInfo.identifier instanceof IdentifierNode)) {
                            this.logInfo("%s ->%s %s", entry.getKey(), idInfo.name(), idInfo.location().description());
                        }
                    }
                }
            }
        } catch (Exception e) {

            Location src = null;
            String message = e.getMessage();

            if (e instanceof PacioliException pe) {
                src = pe.location();
            }

            if (e.getCause() instanceof PacioliException pe) {
                src = pe.location();
                message += ": " + pe.getMessage();
            }

            if (differentFile(src, uri)) {

                // An error in an imported or included file. Just mark this entire file.
                // A fancier solution would be to see which import or include causes
                // the error.
                Range range = new Range(new Position(0, 0), new Position(10000, 100));
                var d = new Diagnostic(range, String.format("Error in file %s:%n%n%s",
                        src.file().orElse(null),
                        message));

                errors.add(d);

            } else {

                // Location information should be available. Mark the whole file
                // as fallback.
                Range range = src == null
                        ? new Range(new Position(0, 0), new Position(10000, 100))
                        : new Range(new Position(src.fromLine, src.fromColumn),
                                new Position(src.toLine, src.toColumn));
                var d = new Diagnostic(range, message);

                errors.add(d);
            }

        }

        PublishDiagnosticsParams diagnosticParams = new PublishDiagnosticsParams(uri, errors);
        this.languageClient.publishDiagnostics(diagnosticParams);

    }

    private boolean differentFile(Location errorSrc, String vsCodeUri) {
        try {
            return !errorSrc.file().get().equals(new File(new URI(vsCodeUri)));
        } catch (Exception e) {
            return false;
        }
    }

    private Optional<String> identifierTriggeringSignatureHelp(String uri, Position position) throws Exception {

        var lineNr = position.getLine();
        var columnNr = position.getCharacter();

        try (BufferedReader br = new BufferedReader(new StringReader(this.latestText))) {

            // Find the line in the latest text where the user cursor is located
            String line = br.readLine();
            int counter = 0;
            while (counter != lineNr && line != null) {
                line = br.readLine();
                counter++;
            }

            if (line != null) {

                // Get the string from the beginning of the line to the cursor position.
                // This includes the ( that triggered this request.
                var sub = line.substring(0, columnNr);

                // Look for an identifier just before the ( that triggered this request
                Pattern p = Pattern.compile("([a-zA-Z][a-zA-Z0-9_]*)\\($");
                Matcher m = p.matcher(sub);

                if (m.find()) {
                    return Optional.of(m.group(1));
                }

            }
        }

        return Optional.empty();
    }

    /**
     * Loads the file, builds the state for it and stores it.
     * 
     * This method generates the compiler errors for the diagonstics.
     * 
     * @param uri The pacioli file to load
     * @return The created state
     * @throws Exception Compilation errors
     */
    private DocumentState storeState(String uri) throws Exception {

        var state = DocumentState.buildState(uri, this.libs);

        for (int i = 0; i < this.documentStates.size(); i++) {
            DocumentState uriState = this.documentStates.get(i);
            if (uriState.uri.equals(uri)) {
                this.documentStates.set(i, state);
                return state;
            }
        }

        this.documentStates.add(state);

        if (this.documentStates.size() > CACHE_SIZE) {
            this.documentStates.remove(0);
        }

        return state;
    }

    /**
     * Checks if a state is stored for the uri. If so it is returned, otherwise the
     * bundle for the uri is loaded and the newly build state is returned.
     * 
     * This method generates compiler errors, since it calls storeState.
     * 
     * @param uri A pacioli file
     * @return The state for the uri
     * @throws Exception Compilation errors
     */
    private DocumentState getState(String uri) throws Exception {

        for (DocumentState uriState : this.documentStates) {
            if (uriState.uri.equals(uri)) {
                return uriState;
            }
        }

        return this.storeState(uri);
    }

    private void logInfo(String string, Object... args) {
        this.languageClient.logMessage(new MessageParams(MessageType.Info, String.format(string, args)));
    }
}
