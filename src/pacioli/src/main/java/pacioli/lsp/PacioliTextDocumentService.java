package pacioli.lsp;

import java.io.File;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

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
import org.eclipse.lsp4j.Hover;
import org.eclipse.lsp4j.HoverParams;
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
import pacioli.compiler.Project;

public class PacioliTextDocumentService implements TextDocumentService {

    private LanguageClient languageClient;

    List<File> libs;

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

        // try {
        // CompletableFuture.supplyAsync(() -> {

        var uri = params.getTextDocument().getUri();

        var errors = new ArrayList<Diagnostic>();

        try {
            var text = new URI(uri).getPath();
            // var text = params.getContentChanges().get(0).getText();
            // this.logInfo(text);

            // this.logInfo("loading bundle");

            var prog = Project.load(PacioliFile.get(text, 0).get(), this.libs);
            prog.loadBundle();

            // this.logInfo("loaded bundle");

            // var prog2 = Program.load(PacioliFile.get(text, 0).get());
        } catch (PacioliException e) {
            this.logInfo("%s", e.getMessage());
            for (var x : e.getStackTrace()) {
                this.logInfo(x.toString());
            }

            Location src = e.location();
            Range range = src == null
                    ? new Range(new Position(0, 0), new Position(10000, 100))
                    : new Range(new Position(src.fromLine, src.fromColumn),
                            new Position(src.toLine, src.toColumn));
            var d = new Diagnostic(range, e.getMessage());

            errors.add(d);

        } catch (Exception e) {
            this.logInfo("%s%s", e.getMessage(), e.getCause().getMessage());
            for (var x : e.getStackTrace()) {
                this.logInfo(x.toString());
            }

            Location src = null;
            String message = e.getMessage();

            if (e.getCause() instanceof PacioliException pe) {
                src = pe.location();
                message += ": " + pe.getMessage();
            }

            // todo: fix position. geen diagnostic voor dit geval?!
            Range range = src == null
                    ? new Range(new Position(0, 0), new Position(10000, 100))
                    : new Range(new Position(src.fromLine, src.fromColumn),
                            new Position(src.toLine, src.toColumn));
            var d = new Diagnostic(range, message);

            errors.add(d);
        }

        // Without this call the file gets locked (on Windows)
        System.gc();

        PublishDiagnosticsParams diagnosticParams = new PublishDiagnosticsParams(uri, errors);
        this.languageClient.publishDiagnostics(diagnosticParams);

        // return 1;
        // }).get();
        // } catch (InterruptedException e) {
        // // TODO Auto-generated catch block
        // // e.printStackTrace();
        // System.gc();
        // this.logInfo("interpupted");
        // } catch (ExecutionException e) {
        // // TODO Auto-generated catch block
        // // e.printStackTrace();
        // System.gc();
        // this.logInfo(e.getMessage() + e.getCause().getMessage());
        // for (var x : e.getStackTrace()) {
        // this.logInfo(x.toString());
        // }
        // }

    }

    // @Override
    // public CompletableFuture<Either<List<CompletionItem>, CompletionList>>
    // completion(CompletionParams position) {
    // return CompletableFuture.supplyAsync(() -> {
    // // Example: Provide completions for AsciiDoc elements

    // CompletionItem item1 = new CompletionItem();
    // item1.setLabel("image::");

    // CompletionItem item2 = new CompletionItem();
    // item2.setLabel("include::");
    // List<CompletionItem> completionItems = List.of(item1, item2);

    // return Either.forLeft(completionItems);
    // });
    // }

    private void logInfo(String string, Object... args) {
        this.languageClient.logMessage(new MessageParams(MessageType.Info, String.format(string, args)));
    }

    @Override
    public CompletableFuture<DocumentDiagnosticReport> diagnostic(DocumentDiagnosticParams params) {
        return CompletableFuture
                .supplyAsync(() -> new DocumentDiagnosticReport(new RelatedUnchangedDocumentDiagnosticReport("foo")));
    }

    @Override
    public CompletableFuture<Hover> hover(HoverParams params) {
        this.logInfo("Operation 'text/hover' {fileUri: '%s', pos: %s, token: %s}",
                params.getTextDocument().getUri(),
                params.getPosition(),
                params.getWorkDoneToken());
        return CompletableFuture.supplyAsync(() -> new Hover(Either.forLeft("hi there")));
    }
}
