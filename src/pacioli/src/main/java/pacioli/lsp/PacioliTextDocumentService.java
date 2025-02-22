package pacioli.lsp;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.eclipse.lsp4j.CompletionItem;
import org.eclipse.lsp4j.CompletionItemLabelDetails;
import org.eclipse.lsp4j.CompletionList;
import org.eclipse.lsp4j.CompletionParams;
import org.eclipse.lsp4j.DefinitionParams;
import org.eclipse.lsp4j.Diagnostic;
import org.eclipse.lsp4j.DidChangeTextDocumentParams;
import org.eclipse.lsp4j.DidCloseTextDocumentParams;
import org.eclipse.lsp4j.DidOpenTextDocumentParams;
import org.eclipse.lsp4j.DidSaveTextDocumentParams;
import org.eclipse.lsp4j.DocumentDiagnosticParams;
import org.eclipse.lsp4j.DocumentDiagnosticReport;
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
import org.eclipse.lsp4j.RelatedUnchangedDocumentDiagnosticReport;
import org.eclipse.lsp4j.SemanticTokens;
import org.eclipse.lsp4j.SemanticTokensParams;
import org.eclipse.lsp4j.SignatureHelp;
import org.eclipse.lsp4j.SignatureHelpParams;
import org.eclipse.lsp4j.SignatureInformation;
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

    /**
     * For how many documents is a DocumentState kept in memory?
     */
    int CACHE_SIZE = 5;

    /**
     * Data stored per open pacioli document
     */
    class DocumentState {
        public final String uri;
        public final Bundle bundle;
        public final Map<Integer, List<IdentifierInfo>> identifierIndex;
        public final List<IdentifierInfo> semanticTokenList;
        public final List<CompletionItem> autoCompleteList;

        public DocumentState(
                String uri,
                Bundle bundle,
                Map<Integer, List<IdentifierInfo>> identifierIndex,
                List<IdentifierInfo> semanticTokenList,
                List<CompletionItem> autoCompleteList) {
            this.uri = uri;
            this.bundle = bundle;
            this.identifierIndex = identifierIndex;
            this.semanticTokenList = semanticTokenList;
            this.autoCompleteList = autoCompleteList;
        }
    }

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
    private List<DocumentState> state = new ArrayList<>();

    /**
     * The latest text that was received by the didChange event. Currently not used
     * by the compiler. It is stored for the signature helper. That event refers to
     * unsaved text, so to find the identifier at the cursor we store this text.
     * 
     * Is not stored per document. Only the currently edited is needed. Since
     * didChange is sent before the signature helper event this works okey.
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

    private DocumentState getUriState(String uri) {
        for (DocumentState uriState : this.state) {
            if (uriState.uri.equals(uri)) {
                return uriState;
            }
        }
        return null;
    }

    private void setUriState(DocumentState state) {
        for (int i = 0; i < this.state.size(); i++) {
            DocumentState uriState = this.state.get(i);
            if (uriState.uri.equals(state.uri)) {
                this.state.set(i, state);
                return;
            }
        }
        this.state.add(state);
        if (this.state.size() > CACHE_SIZE) {
            this.state.remove(0);
        }
    }

    private DocumentState ensureState(String uri) throws Exception {
        var state = this.getUriState(uri);
        if (state == null) {
            var newState = this.buildState(uri);
            this.setUriState(newState);
            return newState;
        }
        return state;
    }

    private DocumentState buildState(String uri) throws Exception {
        var path = new URI(uri).getPath();
        var prog = Project.load(PacioliFile.get(path, 0).get(), this.libs);
        var bundle = prog.loadBundle();
        // this.bundle = bundle;
        var identifierIndex = this.buildIdentifierIndex(bundle);
        var semanticTokenList = this.buildIdentifierInfoList(bundle, identifierIndex);
        var autoCompleteList = this.buildAutoCompleteList(bundle);
        return new DocumentState(uri, bundle, identifierIndex, semanticTokenList, autoCompleteList);
    }

    @Override
    public void didChange(DidChangeTextDocumentParams params) {
        // Store the latest text for the signature help.
        this.latestText = params.getContentChanges().get(0).getText();
    }

    @Override
    public void didClose(DidCloseTextDocumentParams params) {
    }

    @Override
    public void didOpen(DidOpenTextDocumentParams params) {
        // No need for error handling here. Is done in loadBundle.
        this.loadBundle(params.getTextDocument().getUri());
    }

    @Override
    public void didSave(DidSaveTextDocumentParams params) {
        // No need for error handling here. Is done in loadBundle.
        this.loadBundle(params.getTextDocument().getUri());
        this.languageClient.refreshSemanticTokens();
    }

    boolean isOtherFile(Location errorSrc, String vsCodeUri) {
        try {
            return !errorSrc.file().equals(new File(new URI(vsCodeUri)));
        } catch (Exception e) {
            return false;
        }
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

            if (!isOtherFile(src, uri)) {

                Range range = src == null
                        ? new Range(new Position(0, 0), new Position(10000, 100))
                        : new Range(new Position(src.fromLine, src.fromColumn),
                                new Position(src.toLine, src.toColumn));
                var d = new Diagnostic(range, e.getMessage());

                errors.add(d);
            } else {

                Range range = new Range(new Position(0, 0), new Position(10000, 0));
                var d = new Diagnostic(range, String.format("Error in file %s:%n%n%s",
                        src.file().toString(),
                        e.getMessage()));

                errors.add(d);
            }

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
            if (!isOtherFile(src, uri)) {

                Range range = src == null
                        ? new Range(new Position(0, 0), new Position(10000, 100))
                        : new Range(new Position(src.fromLine, src.fromColumn),
                                new Position(src.toLine, src.toColumn));
                var d = new Diagnostic(range, message);

                errors.add(d);
            } else {

                Range range = new Range(new Position(0, 0), new Position(10000, 100));
                var d = new Diagnostic(range, String.format("Error in file %s:%n%n%s",
                        src.file(),
                        message));

                errors.add(d);
            }

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
            DocumentState state;
            try {
                state = this.ensureState(position.getTextDocument().getUri());
                for (CompletionItem item1 : state.autoCompleteList) {
                    completionItems.add(item1);
                }
            } catch (Exception e) {
                this.logInfo("Could not compute completions " + e.getMessage());
            }

            return Either.forLeft(completionItems);
        });
    }

    @Override
    public CompletableFuture<Either<List<? extends org.eclipse.lsp4j.Location>, List<? extends LocationLink>>> definition(
            DefinitionParams params) {

        var pos = params.getPosition();
        DocumentState state;
        try {
            state = this.ensureState(params.getTextDocument().getUri());
        } catch (Exception e) {
            return CompletableFuture.supplyAsync(() -> Either.forLeft(List.of()));
        }
        var info = this.locateInfo(state.identifierIndex, pos.getLine(), pos.getCharacter())
                .map(inf -> {
                    var loc = inf.location();
                    var uri = loc.file().toURI();

                    var range = new Range(new Position(loc.fromLine, loc.fromColumn),
                            new Position(loc.toLine, loc.toColumn));
                    return List.of(new org.eclipse.lsp4j.Location(uri.toString(), range));
                })
                .orElse(List.of());
        return CompletableFuture.supplyAsync(() -> Either.forLeft(info));
    }

    @Override
    public CompletableFuture<SignatureHelp> signatureHelp(SignatureHelpParams params) {
        return CompletableFuture.supplyAsync(() -> {

            var lineNr = params.getPosition().getLine();
            var columnNr = params.getPosition().getCharacter();

            BufferedReader br = new BufferedReader(new StringReader(this.latestText));

            try {
                String line = br.readLine();
                int counter = 0;
                while (counter != lineNr && line != null) {
                    line = br.readLine();
                    counter++;
                }
                if (line != null) {

                    var sub = line.substring(0, columnNr); // includes the ( that triggered this

                    Pattern p = Pattern.compile("([a-zA-Z][a-zA-Z0-9_]*)\\($");
                    Matcher m = p.matcher(sub);

                    if (m.find()) {
                        var id = m.group(1);

                        var state = this.ensureState(params.getTextDocument().getUri());
                        var info = state.bundle.lookupValue(id);

                        if (info != null) {

                            var modulePath = infoModulePath(info);
                            var type = infoType(info);

                            var content = new MarkupContent(MarkupKind.MARKDOWN,
                                    String.format("`%s :: %s`%n%n%s  %nsource: %s",
                                            info.name(),
                                            type,
                                            hoverDoc(info.getDocuParts()),
                                            modulePath));

                            var infos = List.of(new SignatureInformation(id, content, List.of()));

                            System.gc();
                            return new SignatureHelp(infos, 0, 0);
                        }
                    }

                }
            } catch (IOException e) {
                this.logInfo("Error during signature help: %s", e.getMessage());
            } catch (URISyntaxException e) {
                this.logInfo("Error during signature help: %s", e.getMessage());
            } catch (Exception e) {
                this.logInfo("Error during signature help: %s", e.getMessage());
            }

            System.gc();

            return new SignatureHelp();
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

    String infoModulePath(Info vi) {
        var modulePath = vi.generalInfo().file().modulePath();
        modulePath = modulePath.isEmpty()
                ? vi.generalInfo().file().moduleName()
                : modulePath.substring(1);
        return modulePath;
    }

    String infoType(ValueInfo vi) {
        var type = vi.declaredType()
                .map(x -> x.pretty())
                .orElse(vi.inferredType().map(x -> x.pretty()).orElse(""));
        return type;
    }

    @Override
    public CompletableFuture<Hover> hover(HoverParams params) {
        var pos = params.getPosition();
        DocumentState state;
        try {
            state = this.ensureState(params.getTextDocument().getUri());
        } catch (Exception e) {
            return CompletableFuture.supplyAsync(() -> new Hover(Either.forLeft("")));
        }
        var info = this.locateInfo(state.identifierIndex, pos.getLine(), pos.getCharacter())
                .map(inf -> {
                    if (inf instanceof ValueInfo vi && inf.isGlobal()) {
                        var type = infoType(vi);
                        var modulePath = infoModulePath(vi);
                        var content = new MarkupContent(MarkupKind.MARKDOWN,
                                String.format("`%s :: %s`%n%n%s  %nsource: %s",
                                        inf.name(),
                                        type,
                                        hoverDoc(vi.getDocuParts()),
                                        modulePath));

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
            DocumentState state;
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

    List<CompletionItem> buildAutoCompleteList(Bundle bundle) throws Exception {
        Map<String, CompletionItem> completionItems = new HashMap<>();

        // Add all identifiers in the document first. The local identifiers have
        // no info. For global identifiers that have an info the map entry will
        // be overwritten below.
        for (IdentifierInfo idInfo : bundle.allIdentifiers()) {

            var name = idInfo.name();

            if (!name.startsWith("_")) {
                CompletionItem item1 = new CompletionItem();
                item1.setLabel(name);
                completionItems.put(idInfo.name(), item1);
            }
        }

        for (ValueInfo info : bundle.allValueInfos()) {

            var name = info.name();

            if (!name.startsWith("_")) {
                CompletionItem item1 = new CompletionItem();
                item1.setLabel(info.name());

                var details = new CompletionItemLabelDetails();

                details.setDescription(infoModulePath(info));
                details.setDetail(": " + infoType(info));

                item1.setLabelDetails(details);

                completionItems.put(info.name(), item1);
            }
        }

        // At (at least) the keywords that typically appear at the end of a line. It is
        // annoying when an editor suggests something else and that gets chosen when
        // enter is pressed.
        var keywords = List.of("let", "in", "end", "then", "do");

        for (String keyword : keywords) {
            CompletionItem item1 = new CompletionItem();
            item1.setLabel(keyword);

            var details = new CompletionItemLabelDetails();

            details.setDescription("keyword");
            details.setDetail("");

            item1.setLabelDetails(details);

            completionItems.put(keyword, item1);
        }
        return new ArrayList<>(completionItems.values());
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
