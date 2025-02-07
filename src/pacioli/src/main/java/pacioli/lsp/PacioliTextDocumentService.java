package pacioli.lsp;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.eclipse.lsp4j.CompletionItem;
import org.eclipse.lsp4j.CompletionList;
import org.eclipse.lsp4j.CompletionParams;
import org.eclipse.lsp4j.Diagnostic;
import org.eclipse.lsp4j.DidChangeTextDocumentParams;
import org.eclipse.lsp4j.DidCloseTextDocumentParams;
import org.eclipse.lsp4j.DidOpenTextDocumentParams;
import org.eclipse.lsp4j.DidSaveTextDocumentParams;
import org.eclipse.lsp4j.DocumentDiagnosticParams;
import org.eclipse.lsp4j.DocumentDiagnosticReport;
import org.eclipse.lsp4j.MessageParams;
import org.eclipse.lsp4j.MessageType;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.PublishDiagnosticsParams;
import org.eclipse.lsp4j.Range;
import org.eclipse.lsp4j.RelatedUnchangedDocumentDiagnosticReport;
import org.eclipse.lsp4j.jsonrpc.messages.Either;
import org.eclipse.lsp4j.services.LanguageClient;
import org.eclipse.lsp4j.services.TextDocumentService;

import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.compiler.PacioliFile;
import pacioli.compiler.Program;

public class PacioliTextDocumentService implements TextDocumentService {

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
    public void didChange(DidChangeTextDocumentParams params) {
        var uri = params.getTextDocument().getUri();
        this.logInfo("Operation 'text/didChange' {fileUri: '%s'} opened", uri);
    }

    @Override
    public void didClose(DidCloseTextDocumentParams params) {
        this.logInfo("Operation 'text/didClose' {fileUri: '%s'} opened", params.getTextDocument().getUri());
    }

    @Override
    public void didOpen(DidOpenTextDocumentParams params) {
        this.logInfo("Operation 'text/didOpen' {fileUri: '%s'} opened", params.getTextDocument().getUri());

    }

    @Override
    public void didSave(DidSaveTextDocumentParams params) {
        this.logInfo("Operation 'text/didSave' {fileUri: '%s'} opened", params.getTextDocument().getUri());

        var uri = params.getTextDocument().getUri();

        var errors = new ArrayList<Diagnostic>();

        try {
            var text = new URI(uri).getPath();
            // var text = params.getContentChanges().get(0).getText();
            // this.logInfo(text);
            var prog = Program.load(PacioliFile.get(text, 0).get());
        } catch (PacioliException e) {
            Location src = e.location();
            Range range = new Range(new Position(src.fromLine, src.fromColumn), new Position(src.toLine, src.toColumn));
            var d = new Diagnostic(range, e.getMessage());

            errors.add(d);

        } catch (Exception e) {
            // todo: fix position. geen diagnostic voor dit geval?!
            Range range = new Range(new Position(0, 0), new Position(0, 0));
            var d = new Diagnostic(range, e.getMessage());

            errors.add(d);
        }

        PublishDiagnosticsParams diagnosticParams = new PublishDiagnosticsParams(uri, errors);
        this.languageClient.publishDiagnostics(diagnosticParams);
    }

    @Override
    public CompletableFuture<Either<List<CompletionItem>, CompletionList>> completion(CompletionParams position) {
        return CompletableFuture.supplyAsync(() -> {
            // Example: Provide completions for AsciiDoc elements

            CompletionItem item1 = new CompletionItem();
            item1.setLabel("image::");

            CompletionItem item2 = new CompletionItem();
            item2.setLabel("include::");
            List<CompletionItem> completionItems = List.of(item1, item2);

            return Either.forLeft(completionItems);
        });
    }

    private void logInfo(String string, Object... args) {
        this.languageClient.logMessage(new MessageParams(MessageType.Info, String.format(string, args)));
    }

    @Override
    public CompletableFuture<DocumentDiagnosticReport> diagnostic(DocumentDiagnosticParams params) {
        return CompletableFuture
                .supplyAsync(() -> new DocumentDiagnosticReport(new RelatedUnchangedDocumentDiagnosticReport("foo")));
    }
}
