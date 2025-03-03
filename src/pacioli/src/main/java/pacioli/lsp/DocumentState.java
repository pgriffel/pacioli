package pacioli.lsp;

import java.io.File;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.eclipse.lsp4j.CompletionItem;
import org.eclipse.lsp4j.CompletionItemLabelDetails;
import org.eclipse.lsp4j.Hover;
import org.eclipse.lsp4j.MarkupContent;
import org.eclipse.lsp4j.MarkupKind;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.Range;
import org.eclipse.lsp4j.SemanticTokens;
import org.eclipse.lsp4j.SemanticTokensLegend;
import org.eclipse.lsp4j.SignatureHelp;
import org.eclipse.lsp4j.SignatureInformation;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.visitors.AllIdentifiersVisitor.IdentifierInfo;
import pacioli.compiler.Bundle;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliFile;
import pacioli.compiler.Project;
import pacioli.symboltable.info.Info;
import pacioli.symboltable.info.TypeInfo;
import pacioli.symboltable.info.UnitInfo;
import pacioli.symboltable.info.ValueInfo;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.type.TypeObject;

public class DocumentState {

    static SemanticTokensLegend SEMANTIC_TOKEN_LEGEND = new SemanticTokensLegend(
            List.of("function", "variable", "parameter", "type"),
            List.of("declaration", "definition"));

    static int TOKEN_FUNCTION = 0;
    static int TOKEN_VARIABLE = 1;
    static int TOKEN_PARAMETER = 2;
    static int TOKEN_TYPE = 3;
    static int TOKEN_NONE = 4;

    static int MODIFIER_DECLARATION = 0;
    static int MODIFIER_DEFINITION = 1;
    static int MODIFIER_NONE = 2;

    static List<String> KEYWORDS_IN_AUTOCOMPLETE = List.of("let", "in", "end", "then", "do", "where");

    public final String uri;
    private final Bundle bundle;
    public final Map<Integer, List<IdentifierInfo>> identifierIndex;
    private final SemanticTokens semanticTokenList;
    private final List<CompletionItem> autoCompleteList;

    public DocumentState(
            String uri,
            Bundle bundle,
            Map<Integer, List<IdentifierInfo>> identifierIndex,
            SemanticTokens semanticTokenList,
            List<CompletionItem> autoCompleteList) {
        this.uri = uri;
        this.bundle = bundle;
        this.identifierIndex = identifierIndex;
        this.semanticTokenList = semanticTokenList;
        this.autoCompleteList = autoCompleteList;
    }

    public List<CompletionItem> completionItems() {
        return this.autoCompleteList;
    }

    public List<org.eclipse.lsp4j.Location> definitionLocation(Position position) {
        List<Info> infos = this.locateInfo(position.getLine(), position.getCharacter());
        List<org.eclipse.lsp4j.Location> locations = new ArrayList<>();

        for (Info info : infos) {
            var loc = info.location();
            if (loc.file().isPresent()) {
                var uri = loc.file().get().toURI();

                var range = new Range(new Position(loc.fromLine, loc.fromColumn),
                        new Position(loc.toLine, loc.toColumn));
                locations.add(new org.eclipse.lsp4j.Location(uri.toString(), range));
            }
        }
        return locations;
    }

    public SemanticTokens semanticTokens() {
        return this.semanticTokenList;
    }

    public SignatureHelp signatureHelp(String identifier) {
        var info = this.bundle.lookupValue(identifier);

        if (info != null) {

            // Worst case signature is just the name
            String sig = info.name();

            // Try to extend the signature with parameters
            if (info.isFunction()) {
                if (info.definition().isPresent()) {
                    var def = info.definition().get();
                    if (def.body instanceof LambdaNode lambda) {
                        sig = String.format("%s(%s)", info.name(),
                                String.join(", ", lambda.arguments));
                    }
                }
            }

            // Create markup content
            var content = new MarkupContent(MarkupKind.MARKDOWN, infoMarkup(info));

            // Combine the signature and the markup into a lsp SignatureInformation
            var infos = List.of(new SignatureInformation(sig, content, List.of()));

            return new SignatureHelp(infos, 0, 0);
        }

        return new SignatureHelp();
    }

    public Hover hover(Position position) {
        List<Info> infos = this.locateInfo(position.getLine(), position.getCharacter());
        if (infos.size() > 0) {
            List<String> markups = new ArrayList<>();
            for (Info inf : infos) {
                if (inf instanceof ValueInfo vi && inf.isGlobal()) {
                    markups.add(infoMarkup(vi));
                }
                if (inf instanceof TypeInfo vi && inf.isGlobal()) {
                    String markup = String.format("### %s%n%n%s %n %n %s%n%nsource: %s%n",
                            inf instanceof UnitInfo ? "Unit" : "Type",
                            inf.name(),
                            vi.generalInfo().documentation().map(doc -> doc.asMarkdown()).orElse(""),
                            infoModulePath(inf));

                    // We get multiple results here. Remove the return and hover over a record type
                    // to reproduce.
                    // markups.add(markup);

                    var content = new MarkupContent(MarkupKind.MARKDOWN, markup);
                    return new Hover(content);
                }
            }

            return new Hover(
                    new MarkupContent(MarkupKind.MARKDOWN,
                            String.join(String.format("%n%n   ---%n%n"), markups)));
        } else {
            return new Hover(new MarkupContent(MarkupKind.PLAINTEXT, ""));
        }
    }

    private List<Info> locateInfo(Integer line, Integer column) {
        if (this.identifierIndex != null) {
            var candidates = this.identifierIndex.get(line);
            List<Info> infos = new ArrayList<>();
            if (candidates != null) {
                // Info info = null;
                // Integer minSize = null;
                // Search for the token with the minimum length. This is necessary because the
                // grammar gives wrong locations. Often they are too wide and overlap with
                // other tokens (was e.g. the case for binop). This can be removed if the
                // grammar is fixed.
                for (IdentifierInfo candidate : candidates) {
                    var loc = candidate.location();
                    // var size = loc.toColumn - loc.fromColumn;
                    // if (loc.fromColumn <= column && column < loc.toColumn && (minSize == null ||
                    // size < minSize)) {
                    // info = candidate.info().orElse(null);
                    // minSize = size;
                    // }
                    if (loc.fromColumn <= column && column < loc.toColumn && candidate.info().isPresent()) {
                        infos.add(candidate.info().get());
                    }
                }
                return infos;
            }
        }
        return List.of();
    }

    static public DocumentState buildState(String uri, List<File> libs) throws Exception {
        var path = new URI(uri).getPath();
        var pacioliFile = PacioliFile.get(path, 0).get();

        var bundle = Project.load(pacioliFile, libs).loadBundle();

        var identifierIndex = buildIdentifierIndex(bundle);
        var semanticTokenList = buildSemanticTokens(bundle, identifierIndex);
        var autoCompleteList = buildAutoCompleteList(bundle);

        return new DocumentState(uri, bundle, identifierIndex, semanticTokenList, autoCompleteList);
    }

    /**
     * Builds the identifier index for the hover command.
     * 
     * @param bundle The bundle for the current file. Must be analyzed (types
     *               must have been infered)
     * @return A map from line number to a list of identifier Infos on that
     *         line
     */
    static private Map<Integer, List<IdentifierInfo>> buildIdentifierIndex(Bundle bundle) {
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

    static private SemanticTokens buildSemanticTokens(Bundle bundle,
            Map<Integer, List<IdentifierInfo>> identifierIndex) {
        List<IdentifierInfo> infos = new ArrayList<>();
        for (List<IdentifierInfo> records : identifierIndex.values()) {
            for (IdentifierInfo idInfo : records) {
                infos.add(idInfo);
            }
        }
        var comp = new Location.LocationComparator();
        infos.sort((x, y) -> comp.compare(x.location(), y.location()));
        // return infos;

        int lastLine = 0;
        int lastColumn = 0;
        List<Integer> encodingQuintuples = new ArrayList<>();

        for (IdentifierInfo idInfo : infos) {
            var loc = idInfo.location();
            var line = loc.fromLine;
            var lineDiff = line - lastLine;
            var column = loc.fromColumn;
            var columnDiff = lineDiff == 0 ? column - lastColumn : column;

            encodingQuintuples.add(lineDiff);
            encodingQuintuples.add(columnDiff);
            encodingQuintuples.add(loc.toColumn - loc.fromColumn);
            encodingQuintuples.addAll(tokenType(idInfo));

            lastLine = line;
            lastColumn = column;
        }

        return new SemanticTokens(encodingQuintuples);
    }

    static private List<CompletionItem> buildAutoCompleteList(Bundle bundle) {
        Map<String, CompletionItem> completionItems = new HashMap<>();

        // Add all identifiers in the document first. The local identifiers have
        // no info. For global identifiers that have an info the map entry will
        // be overwritten below.
        for (IdentifierInfo idInfo : bundle.allIdentifiers()) {

            var name = idInfo.name();

            if (!name.startsWith("_")) {
                CompletionItem item = new CompletionItem();
                item.setLabel(name);
                completionItems.put(idInfo.name(), item);
            }
        }

        for (ValueInfo info : bundle.allValueInfos()) {

            var name = info.name();

            if (!name.startsWith("_")) {
                CompletionItem item = new CompletionItem();
                item.setLabel(info.name());

                var details = new CompletionItemLabelDetails();

                details.setDescription(infoModulePath(info));
                details.setDetail(": " + infoType(info));

                item.setLabelDetails(details);

                completionItems.put(info.name(), item);
            }
        }

        // Add (at least) the keywords that typically appear at the end of a line. It is
        // annoying when an editor suggests something else and that gets chosen when
        // enter is pressed.

        for (String keyword : KEYWORDS_IN_AUTOCOMPLETE) {
            CompletionItem item = new CompletionItem();
            item.setLabel(keyword);

            var details = new CompletionItemLabelDetails();

            details.setDescription("keyword");
            details.setDetail("");

            item.setLabelDetails(details);

            completionItems.put(keyword, item);
        }
        return new ArrayList<>(completionItems.values());
    }

    static private List<Integer> tokenType(IdentifierInfo idInfo) {
        var inf = idInfo.info().orElse(null);

        if (idInfo.identifier instanceof TypeIdentifierNode) {
            return List.of(TOKEN_TYPE, MODIFIER_DECLARATION);
        }

        if (inf != null && inf instanceof ValueInfo vi) {

            boolean isFunction = vi.definition().map(def -> def.isFunction())
                    .orElse(false) || (vi.isGlobal() && vi.isFunction());

            if (isFunction) {
                return List.of(TOKEN_FUNCTION, MODIFIER_DECLARATION);
            } else {
                return List.of(
                        vi.isGlobal() ? TOKEN_PARAMETER : TOKEN_NONE,
                        MODIFIER_DECLARATION);
            }
        }

        if (inf == null) {
            return List.of(TOKEN_FUNCTION, MODIFIER_NONE);
        }

        return List.of(TOKEN_PARAMETER, MODIFIER_DECLARATION);
    }

    static String infoModulePath(Info vi) {
        var modulePath = vi.generalInfo().file().modulePath();
        modulePath = modulePath.isEmpty()
                ? vi.generalInfo().file().moduleName()
                : modulePath.substring(1);
        return modulePath;
    }

    static String infoType(ValueInfo info) {
        Optional<TypeObject> type = info
                .declaredType()
                .map(declared -> Optional.of(declared.evalType()))
                .orElse(info.inferredType());

        return type.map(t -> t.pretty()).orElse("");
    }

    static String infoMarkup(ValueInfo info) {
        return String.format(
                "### %s%n%n```pacioli%n%s :: %s%n```%n%n%s%n%nsource: %s%n",
                info.isFunction() ? "Function" : "Value",
                info.name(),
                infoType(info),
                info.generalInfo().documentation().map(x -> x.asMarkdown()).orElse(""),
                infoModulePath(info));
    }
}
