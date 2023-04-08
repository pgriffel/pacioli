package pacioli;

import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import pacioli.ast.ImportNode;
import pacioli.ast.IncludeNode;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.parser.Parser;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.TypeSymbolInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;
import pacioli.visitors.LiftStatements;
import pacioli.visitors.TransformConversions;

/**
 * A Program corresponds to a Pacioli file.
 * 
 * A Program contains the AST and the symboltables for the Pacioli code in
 * a file. It can be constructed by loading a PacioliFile.
 * 
 * Once a program has been loaded it can be used to resolve identifiers, infer
 * types, etc.
 *
 */
public class Progam extends AbstractPrintable {

    public enum Phase {
        PARSED, DESUGARED, TYPED, RESOLVED
    }

    // Added during construction
    public final PacioliFile file;

    // Added as first step of loading
    ProgramNode program;

    // Fill during loading
    public SymbolTable<TypeSymbolInfo> typess = new SymbolTable<TypeSymbolInfo>();
    public SymbolTable<ValueInfo> values = new SymbolTable<ValueInfo>();
    public List<Toplevel> toplevels = new ArrayList<Toplevel>();

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    private Progam(PacioliFile file) {
        assert (file != null);
        this.file = file;
    }

    static Progam empty(PacioliFile file) {
        return new Progam(file);
    }

    static Progam load(PacioliFile file, Phase phase) throws Exception {
        Progam program = new Progam(file);
        program.loadTill(phase);
        return program;
    }

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    Boolean isExternal(SymbolInfo info) {
        // Reuse isFromProgram? See symbol table output to check if that is safe.
        return !info.generic().getFile().equals(getFile());
    }

    /**
     * Locates all direct import in the program. Throws an exception if an imported
     * library cannot be found.
     * 
     * @param libs
     *            The directories where libraries are located
     * @return A list of files
     * @throws PacioliException
     */
    public List<PacioliFile> findImports(List<File> libs) throws PacioliException {
        List<PacioliFile> libraries = new ArrayList<PacioliFile>();
        for (ImportNode node : program.imports) {
            String name = node.name.valueString();
            Optional<PacioliFile> library = PacioliFile.findLibrary(name, libs);
            if (!library.isPresent()) {
                throw new PacioliException(node.getLocation(),
                        "Import '%s' for file '%s' not found in directories %s",
                        name, file, libs);
            } else {
                libraries.add(library.get());
            }

        }
        return libraries;
    }

    /**
     * Locates all direct includes in the program. Throws an exception if an
     * included
     * file cannot be found.
     * 
     * @return A list of files
     * @throws PacioliException
     */
    public List<PacioliFile> findIncludes() throws PacioliException {
        List<PacioliFile> includes = new ArrayList<PacioliFile>();
        for (IncludeNode node : program.includes) {
            String name = node.name.valueString();
            Optional<PacioliFile> pacioliFile = file.findInclude(name);
            if (!pacioliFile.isPresent()) {
                throw new PacioliException(node.getLocation(),
                        "Include '%s' for file '%s' not found",
                        name, file);
            } else {
                includes.add(pacioliFile.get());
            }

        }
        return includes;
    }

    public String getModule() {
        return file.getModule();
    }

    public File getFile() {
        return file.getFile();
    }

    public Boolean isLibrary() {
        return file.isLibrary();
    }

    // -------------------------------------------------------------------------
    // Loading
    // -------------------------------------------------------------------------

    /**
     * Loads the program from file. Performs additional actions on the code
     * depending on the given phase.
     * 
     * Use option showFileLoads to enable logging of the loading.
     * 
     * @param phase
     *            Which additional actions are done after loading?
     * @throws Exception
     */
    private void loadTill(Phase phase) throws Exception {

        Pacioli.logIf(Pacioli.Options.showFileLoads, "Loading file %s till %s", file.getFile(), phase);

        program = Parser.parseFile(this.file.getFile());

        if (phase.equals(Phase.PARSED)) {
            return;
        }

        desugar();
        fillTables();

        if (phase.equals(Phase.DESUGARED)) {
            return;
        }

        throw new RuntimeException("Should not get here. Please refactor and use bundle");

    }

    public void loadRest(PacioliFile current, PacioliTable environment) throws Exception {

        // Note that method liftValueInfoStatements requires resolved
        // definitions, but produces non resolved definitions.
        resolve(environment);
        liftStatements(environment);
        resolve(environment);
        transformConversions();
        inferTypes(environment);
    }

    // -------------------------------------------------------------------------
    // Desugaring
    // -------------------------------------------------------------------------

    public void desugar() throws PacioliException {
        Pacioli.trace("Desugaring %s", this.file.getModule());
        program = (ProgramNode) program.desugar();
    }

    // -------------------------------------------------------------------------
    // Filling symbol tables
    // -------------------------------------------------------------------------

    private void fillTables() throws Exception {

        Pacioli.trace("Filling tables for %s", this.file.getModule());

        for (Definition def : program.definitions) {
            Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding %s to %s from file %s", def.localName(),
                    file.getModule(), file.getFile());
            def.addToProgr(this);
        }
    }

    public void addInfo(TypeSymbolInfo info) throws PacioliException {
        String name = info.name();
        if (typess.contains(name)) {
            throw new PacioliException(info.getLocation(), "Duplicate type set name: " + name);
        } else {
            typess.put(name, info);
        }
    }

    public void addInfo(ValueInfo info) throws PacioliException {
        String name = info.name();
        if (values.contains(name)) {
            throw new PacioliException(info.getLocation(), "Duplicate name: " + name);
        } else {
            values.put(name, info);
        }
    }

    public void addToplevel(Toplevel toplevel) {
        toplevels.add(toplevel);
    }

    // -------------------------------------------------------------------------
    // Resolving
    // -------------------------------------------------------------------------

    public void resolve(PacioliTable symbolTable) throws Exception {

        Pacioli.trace("Resolving %s", this.file.getModule());

        if (values.parent != null) {
            throw new RuntimeException(String.format("Expected null parent in %s", this.file));
        }
        if (typess.parent != null) {
            throw new RuntimeException(String.format("Expected null parent in %s", this.file));
        }

        values.parent = symbolTable.values();
        typess.parent = symbolTable.types();
        PacioliTable env = new PacioliTable(values, typess);
        for (TypeSymbolInfo nfo : typess.allInfos()) {
            boolean fromProgram = nfo.generic().getModule().equals(file.getModule());
            if (nfo instanceof UnitInfo) {
                Optional<? extends Definition> definition = nfo.getDefinition();
                assert (definition.isPresent());
                if (fromProgram && definition.isPresent()) {
                    Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving unit %s", nfo.globalName());
                    definition.get().resolve(file, env);
                }
            }
        }
        for (TypeSymbolInfo nfo : typess.allInfos()) {
            if (nfo instanceof TypeInfo) {
                boolean fromProgram = nfo.generic().getModule().equals(file.getModule());
                if (fromProgram && nfo.getDefinition().isPresent()) {
                    Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving type %s", nfo.globalName());
                    nfo.getDefinition().get().resolve(file, env);
                }
            }
        }

        for (ValueInfo nfo : values.allInfos()) {
            boolean fromProgram = nfo.generic().getModule().equals(file.getModule());
            if (fromProgram) {
                if (nfo.getDefinition().isPresent()) {
                    Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving value or function %s",
                            nfo.globalName());
                    nfo.getDefinition().get().resolve(file, env);
                }
                if (nfo.getDeclaredType().isPresent()) {
                    Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving declaration %s", nfo.globalName());
                    nfo.getDeclaredType().get().resolve(file, env);
                }
            }
        }
        for (Toplevel definition : toplevels) {
            Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving toplevel %s", definition.localName());
            definition.resolve(file, env);
        }
        values.parent = null;
        typess.parent = null;
    }

    // -------------------------------------------------------------------------
    // Lifting statements
    // -------------------------------------------------------------------------

    public void liftStatements(PacioliTable pacioliTable) throws Exception {

        Pacioli.trace("Lifting value statements %s", this.file.getModule());

        for (ValueInfo info : values.allInfos()) {
            if (info.getDefinition().isPresent() && !isExternal(info)) {
                ValueDefinition definition = info.getDefinition().get();
                ExpressionNode newBody = new LiftStatements(this, pacioliTable).expAccept(definition.body);
                definition.body = newBody;

            }
        }
    }

    // -------------------------------------------------------------------------
    // Transforming conversions
    // -------------------------------------------------------------------------

    public void transformConversions() {

        Pacioli.trace("Transforming conversions %s", this.file.getModule());

        for (ValueInfo info : values.allInfos()) {
            if (info.getDefinition().isPresent() && !isExternal(info)) {
                ValueDefinition definition = info.getDefinition().get();
                ExpressionNode newBody = new TransformConversions().expAccept(definition.body);
                definition.body = newBody;

            }
        }
    }

    // -------------------------------------------------------------------------
    // Type inference
    // -------------------------------------------------------------------------

    public void inferTypes(PacioliTable environment) {

        Pacioli.trace("Infering types in %s", this.file.getModule());

        values.parent = environment.values();
        typess.parent = environment.types();

        Set<SymbolInfo> discovered = new HashSet<SymbolInfo>();
        Set<SymbolInfo> finished = new HashSet<SymbolInfo>();

        List<String> names = values.allNames();
        Collections.sort(names);

        for (String value : names) {
            ValueInfo info = values.lookup(value);

            if (!isExternal(info) && info.getDefinition().isPresent()) {

                Pacioli.logIf(Pacioli.Options.logTypeInference, "Infering type of %s", value);

                inferValueDefinitionType(info, discovered, finished, Pacioli.Options.logTypeInference);

                Pacioli.logIf(Pacioli.Options.logTypeInference, "%s :: %s;", info.name(),
                        info.inferredType.get().pretty());
            }

            Optional<TypeNode> declared = info.getDeclaredType();

            if (!isExternal(info) && declared.isPresent() && info.inferredType.isPresent()) {

                PacioliType declaredType = declared.get().evalType().instantiate()
                        .reduce(i -> i.generic().getModule().equals(file.getModule()));
                PacioliType inferredType = info.inferredType().instantiate();

                Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails,
                        "Checking inferred type\n  %s\nagainst declared type\n  %s",
                        inferredType.pretty(), declaredType.pretty());

                if (!declaredType.isInstanceOf(inferredType)) {
                    throw new RuntimeException("Type error",
                            new PacioliException(info.getLocation(),
                                    String.format(
                                            "Declared type\n\n  %s\n\ndoes not specialize the inferred type\n\n  %s\n",
                                            declaredType.unfresh().deval().pretty(),
                                            inferredType.unfresh().deval().pretty())));
                }
            }

        }
        int i = 0;
        for (Toplevel toplevel : toplevels) {

            inferUsedTypes(toplevel, discovered, finished, true);

            Pacioli.logIf(Pacioli.Options.logTypeInference, "Inferring typing of toplevel %s", i);

            Typing typing = toplevel.body.inferTyping(this);
            Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails, "Typing of toplevel %s is %s", i, typing.pretty());

            toplevel.type = typing.solve(!isLibrary()).simplify();
            Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails, "Type of toplevel %s is %s", i,
                    toplevel.type.pretty());

            i++;
        }

    }

    private void inferUsedTypes(Definition definition, Set<SymbolInfo> discovered, Set<SymbolInfo> finished,
            Boolean verbose) {
        for (SymbolInfo pre : definition.uses()) {
            if (pre.isGlobal() && pre instanceof ValueInfo) {
                if (!isExternal(pre) && pre.getDefinition().isPresent()) {
                    inferValueDefinitionType((ValueInfo) pre, discovered, finished, verbose);
                } else {
                    ValueInfo vinfo = (ValueInfo) pre;
                    if (!vinfo.getDeclaredType().isPresent()) {
                        throw new RuntimeException("Type error",
                                new PacioliException(pre.getLocation(), "No type declared for %s", pre.name()));
                    }
                }
            }
        }
    }

    /**
     * @param info
     * @param discovered
     * @param finished
     * @param verbose
     *            Determines whether log calls are made or not, independently
     *            from any global log setting. Allows the caller to filter
     *            logging per definition.
     */
    private void inferValueDefinitionType(ValueInfo info, Set<SymbolInfo> discovered, Set<SymbolInfo> finished,
            Boolean verbose) {

        if (!finished.contains(info)) {
            if (discovered.contains(info)) {
                // Pacioli.warn("Cycle in definition of %s", info.name());
            } else {
                discovered.add(info);
                inferUsedTypes(info.getDefinition().get(), discovered, finished, verbose);

                ValueDefinition def = info.getDefinition().get();

                Pacioli.logIf(Pacioli.Options.logTypeInference, "Infering typing of %s", info.name());

                Typing typing = def.body.inferTyping(this);

                Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails, "Inferred typing of %s is %s", info.name(),
                        typing.pretty());

                try {
                    PacioliType solved = typing.solve(Pacioli.Options.logTypeInferenceDetails).unfresh();
                    if (verbose) {
                        Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails, "\nSolved type of %s is %s", info.name(),
                                solved.pretty());
                        Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails, "\nSimple type of %s is %s", info.name(),
                                solved.simplify().pretty());
                        Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails, "\nGenerl type of %s is %s", info.name(),
                                solved.simplify().generalize().pretty());
                    }
                    info.setinferredType(solved.simplify().generalize());
                } catch (PacioliException e) {
                    throw new RuntimeException("Type error", e);
                }

                finished.add(info);
            }
        }
    }

    void printTypes() throws PacioliException {

        List<String> names = values.allNames();
        Collections.sort(names);

        for (String value : names) {
            ValueInfo info = values.lookup(value);
            if (!isExternal(info) && info.getDefinition().isPresent()) {
                Pacioli.println("\n%s :: %s;", info.name(), info.inferredType().deval().pretty());
            }
        }
        Integer count = 1;
        for (Toplevel toplevel : toplevels) {
            PacioliType type = toplevel.type;
            Pacioli.println("\nToplevel %s :: %s", count++, type.unfresh().deval().pretty());
        }
    }

    // -------------------------------------------------------------------------
    // Pretty printing
    // -------------------------------------------------------------------------

    @Override
    public void printPretty(PrintWriter out) {

        // Print raw AST variant
        // program.printPretty(out);

        // Print parsed code variant
        for (TypeSymbolInfo info : typess.allInfos()) {
            out.println();
            info.getDefinition().get().printPretty(out);
            out.println();
        }

        for (ValueInfo info : values.allInfos()) {
            if (info.getDefinition().isPresent() && !isExternal(info)) {
                out.println();
                info.getDefinition().get().printPretty(out);
                out.println();
            }
        }
    }

    void printSymbolTable(SymbolTable<? extends SymbolInfo> table, String header) {
        Pacioli.println("Begin %s table", header);
        List<? extends SymbolInfo> infos = table.allInfos();
        infos.sort((SymbolInfo x, SymbolInfo y) -> x.name().compareTo(y.name()));
        for (SymbolInfo info : infos) {
            Optional<? extends Definition> def = info.getDefinition();
            Pacioli.println("%-25s %-25s %-10s %-10s %-50s",
                    info.name(),
                    info.generic().getModule(),
                    // info.isExternal(info) ? " " : "local",
                    info.isGlobal() ? "glb" : "lcl",
                    info.generic().getFile() == null ? "" : isExternal(info), // "", //info.generic().getFile(),
                    def.isPresent() ? "has def" : "No definition");
        }
        Pacioli.println("End table");
    }

    // public void printSymbolTables() throws Exception {

    // Pacioli.println("Symbol table for %s", getFile());

    // Pacioli.println("Units:");
    // for (UnitInfo info : units.allInfos()) {
    // Pacioli.println("%s", info.name());
    // }

    // // Include the index sets from the other program
    // Pacioli.println("Index sets:");
    // for (IndexSetInfo info : indexSets.allInfos()) {
    // Pacioli.println("%s", info.name());
    // }

    // // Include the types from the other program
    // Pacioli.println("Types:");
    // for (TypeInfo info : types.allInfos()) {
    // Pacioli.println("%s", info.name());
    // }

    // // Include the values from the other program
    // Pacioli.println("Values:");
    // for (ValueInfo info : values.allInfos()) {
    // Pacioli.println("%s %s %s",
    // isExternal(info) ? "ext " : "file",
    // info.generic().getFile(),
    // info.name());
    // }

    // }

}
