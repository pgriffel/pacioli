package pacioli.lsp;

import java.io.File;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
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
import org.eclipse.lsp4j.Hover;
import org.eclipse.lsp4j.HoverParams;
import org.eclipse.lsp4j.MarkedString;
import org.eclipse.lsp4j.MarkupContent;
import org.eclipse.lsp4j.MarkupKind;
import org.eclipse.lsp4j.MessageParams;
import org.eclipse.lsp4j.MessageType;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.PublishDiagnosticsParams;
import org.eclipse.lsp4j.Range;
import org.eclipse.lsp4j.RelatedUnchangedDocumentDiagnosticReport;
import org.eclipse.lsp4j.SemanticTokens;
import org.eclipse.lsp4j.SemanticTokensParams;
import org.eclipse.lsp4j.jsonrpc.messages.Either;
import org.eclipse.lsp4j.services.LanguageClient;
import org.eclipse.lsp4j.services.TextDocumentService;

import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.visitors.AllIdentifiersVisitor.IdentifierInfo;
import pacioli.compiler.Bundle;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.compiler.PacioliFile;
import pacioli.compiler.Project;
import pacioli.symboltable.info.Info;
import pacioli.symboltable.info.TypeInfo;
import pacioli.symboltable.info.ValueInfo;
import pacioli.types.ast.TypeIdentifierNode;

public class PacioliTextDocumentService implements TextDocumentService {

    private LanguageClient languageClient;

    List<File> libs;

    Map<Integer, List<IdentifierInfo>> identifierIndex;
    private List<IdentifierInfo> semanticTokenList;

    private List<String> autoCompleteList;

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
        this.logInfo("Operation 'text/didChange' with uri '%s'", uri);
    }

    @Override
    public void didClose(DidCloseTextDocumentParams params) {
        this.logInfo("Operation 'text/didClose' with uri '%s'", params.getTextDocument().getUri());
    }

    @Override
    public void didOpen(DidOpenTextDocumentParams params) {
        this.logInfo("Operation 'text/didOpen' with uri '%s'", params.getTextDocument().getUri());
        this.loadBundle(params.getTextDocument().getUri());
    }

    @Override
    public void didSave(DidSaveTextDocumentParams params) {
        this.logInfo("Operation 'text/didSave' with uri '%s'", params.getTextDocument().getUri());
        this.loadBundle(params.getTextDocument().getUri());
        this.languageClient.refreshSemanticTokens();
    }

    private void loadBundle(String uri) {

        var errors = new ArrayList<Diagnostic>();

        try {
            var path = new URI(uri).getPath();

            var prog = Project.load(PacioliFile.get(path, 0).get(), this.libs);
            var bundle = prog.loadBundle();
            // this.bundle = bundle;
            this.identifierIndex = this.buildIdentifierIndex(bundle);
            this.semanticTokenList = this.buildIdentifierInfoList(bundle);
            this.autoCompleteList = this.buildAutoCompleteList(bundle);

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
            this.logInfo("%s%s", e.getMessage(), e.getCause() == null ? "" : e.getCause().getMessage());
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

    }

    @Override
    public CompletableFuture<Either<List<CompletionItem>, CompletionList>> completion(CompletionParams position) {
        this.logInfo("complete %s", position);
        return CompletableFuture.supplyAsync(() -> {
            List<CompletionItem> completionItems = new ArrayList<>();
            for (String name : this.autoCompleteList) {
                CompletionItem item1 = new CompletionItem();
                item1.setLabel(name);
                completionItems.add(item1);
            }

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

    @Override
    public CompletableFuture<Hover> hover(HoverParams params) {
        var pos = params.getPosition();
        var info = this.locateInfo(pos.getLine(), pos.getCharacter())
                .map(inf -> {
                    if (inf instanceof ValueInfo vi && inf.isGlobal()) {
                        var type = vi.declaredType().map(x -> x.pretty())
                                .orElse(vi.inferredType().map(x -> x.pretty()).orElse(""));

                        // Fixme: trying to get html working
                        var tx = new MarkupContent(MarkupKind.MARKDOWN, String.format("%s :: %s %n %n %s",
                                inf.name(),
                                type,
                                String.join(String.format("%n%n"), vi.getDocuParts())));
                        tx.setKind("html");
                        var txt = new MarkedString("html", String.format("%s :: %s %n %n %s",
                                inf.name(),
                                type,
                                String.join(String.format("%n%n"), vi.getDocuParts())));
                        var h = new Hover();
                        h.setContents(tx);

                        // return h;
                        return new Hover(
                                Either.forRight(txt));
                        // return new Hover(
                        // Either.forLeft(
                        // String.format("%s :: %s %n %n %s",
                        // inf.name(),
                        // type,
                        // String.join(String.format("%n%n"), vi.getDocuParts()))));
                    }
                    if (inf instanceof TypeInfo vi && inf.isGlobal()) {
                        List<String> docParts = List.of();
                        if (vi.generalInfo().documentation().isPresent()) {
                            String[] parts = vi.generalInfo().documentation().get().split("\\r?\\n\s*\\r?\\n");
                            docParts = List.of(parts);
                        }
                        // Fixme: trying to get html working
                        var tx = new MarkupContent(MarkupKind.MARKDOWN, String.format("%s %n %n %s",
                                inf.name(),
                                String.join(String.format("%n%n"), docParts)));
                        tx.setKind("html");

                        var txt = new MarkedString("html", String.format("%s %n %n %s",
                                inf.name(),
                                String.join(String.format("%n%n"), docParts)));
                        var h = new Hover();
                        h.setContents(tx);

                        // return h;
                        return new Hover(
                                Either.forRight(txt));
                        // return new Hover(
                        // Either.forLeft(
                        // String.format("%s :: %s %n %n %s",
                        // inf.name(),
                        // type,
                        // String.join(String.format("%n%n"), vi.getDocuParts()))));
                    }
                    return new Hover(
                            Either.forLeft(""));
                })
                .orElse(new Hover(Either.forLeft("")));
        return CompletableFuture.supplyAsync(() -> info);
    }

    @Override
    public CompletableFuture<SemanticTokens> semanticTokensFull(SemanticTokensParams params) {
        return CompletableFuture.supplyAsync(() -> {
            if (this.semanticTokenList != null) {
                try {
                    return this.buildSemanticTokens(this.semanticTokenList);
                } catch (Exception e) {
                    logInfo("token exception" + e.getMessage());
                }
            }
            return new SemanticTokens();
        });
    }

    /**
     * Builds the identifier index for the hover command.
     * 
     * @param bundle The bundle for the current file. Must be analyzed (types
     *               must have been infered)
     * @return A map from line number to a list of identifier Infos on that
     *         line
     */
    Map<Integer, List<IdentifierInfo>> buildIdentifierIndex(Bundle bundle) {
        Map<Integer, List<IdentifierInfo>> index = new HashMap<>();
        for (IdentifierInfo idInfo : bundle.allIdentifiers()) {
            if (idInfo.identifier instanceof IdentifierNode id) {
                Location loc = id.location();
                List<IdentifierInfo> infos = index.get(loc.fromLine);
                if (infos == null) {
                    infos = new ArrayList<IdentifierInfo>();
                    index.put(loc.fromLine, infos);
                }
                infos.add(idInfo);
            }
            if (idInfo.identifier instanceof TypeIdentifierNode id) {
                Location loc = id.location();
                List<IdentifierInfo> infos = index.get(loc.fromLine);
                if (infos == null) {
                    infos = new ArrayList<IdentifierInfo>();
                    index.put(loc.fromLine, infos);
                }
                infos.add(idInfo);
            }
        }
        return index;
    }

    /**
     * Looks up an identifier for the hover command.
     * 
     * @param line   Line number in the current file
     * @param column Column number in the current file
     * @return The identifier's Info if it exits.
     */
    Optional<Info> locateInfo(Integer line, Integer column) {
        if (this.identifierIndex != null) {
            var cands = this.identifierIndex.get(line);
            if (cands != null) {
                Info info = null;
                Integer minSize = null;
                // Search for the token with the minimum length. This is necessary because the
                // grammar gives wrong locations. Often they are too wide and overlap with
                // other tokens (was e.g. the case for binop). This can be removed if the
                // grammar is fixed.
                for (IdentifierInfo cand : cands) {
                    var loc = cand.location();
                    var size = loc.toColumn - loc.fromColumn;
                    if (loc.fromColumn <= column && column < loc.toColumn && (minSize == null || size < minSize)) {
                        info = cand.info().orElse(null);
                        minSize = size;
                    }
                }
                return Optional.ofNullable(info);
            }
        }
        return Optional.empty();
    }

    List<IdentifierInfo> buildIdentifierInfoList(Bundle bundle) throws Exception {
        List<IdentifierInfo> infos = new ArrayList<>();
        for (List<IdentifierInfo> records : this.identifierIndex.values()) {
            for (IdentifierInfo idInfo : records) {
                infos.add(idInfo);
            }
        }
        var comp = new Location.LocationComparator();
        infos.sort((x, y) -> comp.compare(x.location(), y.location()));
        return infos;
    }

    List<String> buildAutoCompleteList(Bundle bundle) throws Exception {
        Set<String> infos = new HashSet<>();
        for (String name : bundle.allNames()) {
            infos.add(name);
        }
        for (IdentifierInfo info : bundle.allIdentifiers()) {
            infos.add(info.name());
        }
        return new ArrayList<>(infos);
    }

    SemanticTokens buildSemanticTokens(List<IdentifierInfo> semanticTokenList) throws Exception {
        int lastLine = 0;
        int lastColumn = 0;
        List<Integer> nums = new ArrayList<>();

        for (IdentifierInfo idInfo : semanticTokenList) {
            var loc = idInfo.location();
            var line = loc.fromLine;
            var lineDiff = line - lastLine;
            var column = loc.fromColumn;
            var columnDiff = lineDiff == 0 ? column - lastColumn : column;

            nums.add(lineDiff);
            nums.add(columnDiff);
            nums.add(loc.toColumn - loc.fromColumn);
            nums.addAll(tokenType(idInfo));

            lastLine = line;
            lastColumn = column;
        }

        var tokens = new SemanticTokens(nums);
        return tokens;
    }

    List<Integer> tokenType(IdentifierInfo idInfo) {
        var inf = idInfo.info().orElse(null);
        if (idInfo.identifier instanceof TypeIdentifierNode) {
            return List.of(3, 0);
        }
        if (inf != null && inf instanceof ValueInfo vi) {

            boolean isFunction = vi.definition().map(def -> def.isFunction())
                    .orElse(false) || (vi.isGlobal() && vi.isFunction());
            if (isFunction) {
                return List.of(0, 0);
            } else {
                return List.of(vi.isGlobal() ? 2 : 4, 0);
            }
        }
        if (inf == null) {
            return List.of(0, 2);
        }
        return List.of(2, 0);
    }
}
