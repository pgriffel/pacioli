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

    class UriState {
        public final String uri;
        public final Map<Integer, List<IdentifierInfo>> identifierIndex;
        public final List<IdentifierInfo> semanticTokenList;

        public final List<String> autoCompleteList;

        public UriState(
                String uri,
                Map<Integer, List<IdentifierInfo>> identifierIndex,
                List<IdentifierInfo> semanticTokenList,
                List<String> autoCompleteList) {
            this.uri = uri;
            this.identifierIndex = identifierIndex;
            this.semanticTokenList = semanticTokenList;
            this.autoCompleteList = autoCompleteList;
        }
    }

    int cacheSize = 5;

    private LanguageClient languageClient;

    List<File> libs;

    private List<UriState> state = new ArrayList<>();

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

    private UriState getUriState(String uri) {
        for (UriState uriState : this.state) {
            if (uriState.uri.equals(uri)) {
                return uriState;
            }
        }
        return null;
    }

    private void setUriState(UriState state) {
        for (int i = 0; i < this.state.size(); i++) {
            UriState uriState = this.state.get(i);
            if (uriState.uri.equals(state.uri)) {
                this.state.set(i, state);
                return;
            }
        }
        this.state.add(state);
        if (this.state.size() > cacheSize) {
            this.state.remove(0);
        }
    }

    private UriState ensureState(String uri) throws Exception {
        var state = this.getUriState(uri);
        if (state == null) {
            var newState = this.buildState(uri);
            this.setUriState(newState);
            return newState;
        }
        return state;
    }

    private UriState buildState(String uri) throws Exception {
        var path = new URI(uri).getPath();
        var prog = Project.load(PacioliFile.get(path, 0).get(), this.libs);
        var bundle = prog.loadBundle();
        // this.bundle = bundle;
        var identifierIndex = this.buildIdentifierIndex(bundle);
        var semanticTokenList = this.buildIdentifierInfoList(bundle, identifierIndex);
        var autoCompleteList = this.buildAutoCompleteList(bundle);
        return new UriState(uri, identifierIndex, semanticTokenList, autoCompleteList);
    }

    @Override
    public void didChange(DidChangeTextDocumentParams params) {
        // var uri = params.getTextDocument().getUri();
        // this.logInfo("Operation 'text/didChange' with uri '%s'", uri);
    }

    @Override
    public void didClose(DidCloseTextDocumentParams params) {
        // this.logInfo("Operation 'text/didClose' with uri '%s'",
        // params.getTextDocument().getUri());
    }

    @Override
    public void didOpen(DidOpenTextDocumentParams params) {
        // this.logInfo("Operation 'text/didOpen' with uri '%s'",
        // params.getTextDocument().getUri());
        this.loadBundle(params.getTextDocument().getUri());
    }

    @Override
    public void didSave(DidSaveTextDocumentParams params) {
        // this.logInfo("Operation 'text/didSave' with uri '%s'",
        // params.getTextDocument().getUri());
        this.loadBundle(params.getTextDocument().getUri());
        this.languageClient.refreshSemanticTokens();
    }

    private void loadBundle(String uri) {

        var errors = new ArrayList<Diagnostic>();

        try {
            this.setUriState(this.buildState(uri));
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
        return CompletableFuture.supplyAsync(() -> {
            List<CompletionItem> completionItems = new ArrayList<>();
            UriState state;
            try {
                state = this.ensureState(position.getTextDocument().getUri());
                for (String name : state.autoCompleteList) {
                    CompletionItem item1 = new CompletionItem();
                    item1.setLabel(name);
                    completionItems.add(item1);
                }
            } catch (Exception e) {
                this.logInfo("Could not compute completions " + e.getMessage());
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

    static String hoverDoc(List<String> docuParts) {
        return String.join(String.format("  %n"), docuParts)
                .replaceAll("<code>", String.format(" `"))
                .replaceAll("</code>", String.format("` "));
    }

    @Override
    public CompletableFuture<Hover> hover(HoverParams params) {
        var pos = params.getPosition();
        UriState state;
        try {
            state = this.ensureState(params.getTextDocument().getUri());
        } catch (Exception e) {
            return CompletableFuture.supplyAsync(() -> new Hover(Either.forLeft("")));
        }
        var info = this.locateInfo(state.identifierIndex, pos.getLine(), pos.getCharacter())
                .map(inf -> {
                    if (inf instanceof ValueInfo vi && inf.isGlobal()) {
                        var type = vi.declaredType()
                                .map(x -> x.pretty())
                                .orElse(vi.inferredType().map(x -> x.pretty()).orElse(""));

                        var content = new MarkupContent(MarkupKind.MARKDOWN,
                                String.format("`%s :: %s`%n%n%s",
                                        inf.name(),
                                        type,
                                        hoverDoc(vi.getDocuParts())));

                        return new Hover(content);
                    }
                    if (inf instanceof TypeInfo vi && inf.isGlobal()) {
                        List<String> docParts = List.of();
                        if (vi.generalInfo().documentation().isPresent()) {
                            String[] parts = vi.generalInfo().documentation().get().split("\\r?\\n\s*\\r?\\n");
                            docParts = List.of(parts);
                        }
                        var content = new MarkupContent(MarkupKind.MARKDOWN, String.format("%s %n %n %s",
                                inf.name(),
                                hoverDoc(docParts)));

                        return new Hover(content);
                    }
                    return new Hover(new MarkupContent(MarkupKind.PLAINTEXT, ""));
                })
                .orElse(new Hover(new MarkupContent(MarkupKind.PLAINTEXT, "")));
        return CompletableFuture.supplyAsync(() -> info);
    }

    @Override
    public CompletableFuture<SemanticTokens> semanticTokensFull(SemanticTokensParams params) {
        return CompletableFuture.supplyAsync(() -> {
            UriState state;
            try {
                state = this.ensureState(params.getTextDocument().getUri());
                if (state.semanticTokenList != null) {
                    return this.buildSemanticTokens(state.semanticTokenList);
                }
            } catch (Exception e) {
                logInfo("token exception" + e.getMessage());
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
    Optional<Info> locateInfo(Map<Integer, List<IdentifierInfo>> identifierIndex, Integer line, Integer column) {
        if (identifierIndex != null) {
            var cands = identifierIndex.get(line);
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

    List<IdentifierInfo> buildIdentifierInfoList(Bundle bundle, Map<Integer, List<IdentifierInfo>> identifierIndex)
            throws Exception {
        List<IdentifierInfo> infos = new ArrayList<>();
        for (List<IdentifierInfo> records : identifierIndex.values()) {
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
