package pacioli;

import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.management.RuntimeErrorException;

import pacioli.CompilationSettings.Target;
import pacioli.ast.ImportNode;
import pacioli.ast.IncludeNode;
import pacioli.ast.Node;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.compilers.JSCompiler;
import pacioli.compilers.MATLABCompiler;
import pacioli.compilers.MVMCompiler;
import pacioli.compilers.PythonCompiler;
import pacioli.parser.Parser;
import pacioli.symboltable.GenericInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.TypeSymbolInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;
import pacioli.visitors.CodeGenerator;
import pacioli.visitors.JSGenerator;
import pacioli.visitors.LiftStatements;
import pacioli.visitors.MVMGenerator;
import pacioli.visitors.MatlabGenerator;
import pacioli.visitors.PythonGenerator;
import pacioli.visitors.ResolveVisitor;
import pacioli.visitors.TransformConversions;

/**
 * A Program corresponds to a Pacioli file and is the unit of compilation.
 * 
 * A Program contains the AST and the symboltables for the Pacioli code in
 * a file. It can be constructed by loading a PacioliFile.
 * 
 * Once a program has been loaded it can be used to generate code, display
 * types, etc.
 *
 */
public class Progam extends AbstractPrintable {

    public enum Phase {
        PARSED, DESUGARED, TYPED, RESOLVED
    }

    // Added during construction
    public final PacioliFile file;
    private final List<File> libs;

    // Added as first step of loading
    ProgramNode program;

    // Fill during loading
    // public SymbolTable<IndexSetInfo> indexSets = new SymbolTable<IndexSetInfo>();
    // public SymbolTable<UnitInfo> units = new SymbolTable<UnitInfo>();
    // public SymbolTable<TypeInfo> types = new SymbolTable<TypeInfo>();
    public SymbolTable<TypeSymbolInfo> typess = new SymbolTable<TypeSymbolInfo>();
    public SymbolTable<ValueInfo> values = new SymbolTable<ValueInfo>();
    public List<Toplevel> toplevels = new ArrayList<Toplevel>();

    // Number of nested calls to loadTill. Used to displayed indented log messages.
    private static int depth = 0;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    private Progam(PacioliFile file, List<File> libs) {
        assert (file != null);
        this.file = file;
        this.libs = libs;
    }

    static Progam empty(PacioliFile file, List<File> libs) {
        return new Progam(file, libs);
    }

    static Progam load(PacioliFile file, List<File> libs, Phase phase) throws Exception {
        Progam program = new Progam(file, libs);
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

    public List<String> includes() {
        List<String> list = new ArrayList<String>();
        for (IncludeNode node : program.includes) {
            list.add(node.name.valueString());
        }
        return list;
    }

    public List<String> imports() {
        List<String> list = new ArrayList<String>();
        for (ImportNode node : program.imports) {
            list.add(node.name.valueString());
        }
        return list;
    }

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

        logLoadingStart("Loading file %s till %s", file.getFile(), phase);

        program = Parser.parseFile(this.file.getFile());

        if (phase.equals(Phase.PARSED)) {
            logLoadingEnd("Ready loading file");
            return;
        }

        desugar();
        fillTables();

        if (phase.equals(Phase.DESUGARED)) {
            logLoadingEnd("Ready loading file");
            return;
        }

        // loadDirectDependencies();
        // resolve();
        transformConversions();

        if (phase.equals(Phase.RESOLVED)) {
            logLoadingEnd("Ready loading file");
            return;
        }

        // inferTypes();

        logLoadingEnd("Ready loading file");
    }

    private void logLoadingStart(String string, Object... args) {
        Pacioli.logIf(Pacioli.Options.showFileLoads, "%s> %s", " ".repeat(depth++), String.format(string, args));
    }

    private void logLoadingEnd(String string, Object... args) {
        Pacioli.logIf(Pacioli.Options.showFileLoads, "%s< %s", " ".repeat(--depth), String.format(string, args));
    }

    // -------------------------------------------------------------------------
    // Filling symbol tables
    // -------------------------------------------------------------------------

    private void fillTables() throws Exception {

        Pacioli.trace("Filling tables for %s", this.file.getModule());

        // Fill symbol tables for this file
        for (Definition def : program.definitions) {
            Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding %s to %s from file %s", def.localName(),
                    file.getModule(), file.getFile());
            def.addToProgr(this, true);
        }
    }

    // private void loadDirectDependencies() throws Exception {

    // this.addPrimitiveTypes();

    // if (!file.isSystemLibrary("base")) {
    // this.loadSystemLibrary("base");
    // }

    // if (!file.isSystemLibrary("base") && !file.isSystemLibrary("standard")) {
    // this.loadSystemLibrary("standard");
    // }

    // // Fill symbol tables for the imported libraries
    // for (PacioliFile file : findImports(libs)) {
    // Progam prog = new Progam(file, libs);
    // prog.loadTill(Progam.Phase.RESOLVED);
    // // for (Definition def : prog.program.definitions) {
    // // if (def instanceof Declaration || def instanceof IndexSetDefinition || def
    // // instanceof UnitDefinition
    // // || def instanceof UnitVectorDefinition
    // // || def instanceof TypeDefinition) {
    // // def.addToProgr(prog, false);
    // // }
    // // }
    // includeOther(prog);
    // }

    // // Fill symbol tables for the included files
    // for (String include : includes()) {
    // PacioliFile file = this.file.findInclude2("p.getParent()", include);
    // Progam prog = new Progam(file, libs);
    // prog.loadTill(Progam.Phase.RESOLVED);
    // // for (Definition def : prog.program.definitions) {
    // // if (def instanceof Declaration || def instanceof IndexSetDefinition || def
    // // instanceof UnitDefinition
    // // || def instanceof UnitVectorDefinition
    // // || def instanceof TypeDefinition) {
    // // def.addToProgr(prog, false);
    // // }
    // // }
    // includeOther(prog);
    // }

    // }

    /**
     * Make obsolete by deftypes without body?
     */

    private void addPrimitiveTypes() {
        PacioliFile file = PacioliFile.requireLibrary("base", libs);
        for (String type : ResolveVisitor.builtinTypes) {
            // Fixme: null arg for the location. Maybe declare them in a base.pacioli?

            GenericInfo generic = new GenericInfo(type, file, "base_base", true, new Location(),
                    file.isSystemLibrary("base"));
            addInfo(new TypeInfo(generic));
        }
    }

    /**
     * Used to load base and standard
     * 
     * @param lib
     *            One of "base" or "standard"
     * @throws Exception
     */
    // public void loadSystemLibrary(String lib) throws Exception {
    // PacioliFile file = PacioliFile.requireLibrary(lib, libs);
    // Progam prog = new Progam(file, libs);
    // prog.loadTill(Progam.Phase.RESOLVED);
    // this.includeOther(prog);
    // }

    public void addInfo(TypeSymbolInfo info) throws PacioliException {
        String name = info.name();
        if (typess.contains(name)) {
            throw new PacioliException(info.getLocation(), "Duplicate type set name: " + name);
        } else {
            typess.put(name, info);
        }
    }

    // public void addInfo(IndexSetInfo info) throws PacioliException {
    // String name = info.name();
    // if (indexSets.contains(name)) {
    // throw new PacioliException(info.getLocation(), "Duplicate index set name: " +
    // name);
    // } else {
    // indexSets.put(name, info);
    // }
    // }

    // public void addInfo(UnitInfo info) throws PacioliException {
    // String name = info.name();
    // if (units.contains(name)) {
    // throw new PacioliException(info.getLocation(), "Duplicate unit name: " +
    // name);
    // } else {
    // units.put(name, info);
    // }
    // }

    // public void addInfo(TypeInfo info) throws PacioliException {
    // String name = info.name();
    // if (types.contains(name)) {
    // throw new PacioliException(info.getLocation(), "Duplicate type name: " +
    // name);
    // } else {
    // types.put(name, info);
    // }
    // }

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

    // public void includeOther(Progam other) throws Exception {

    // // Include the units from the other program
    // for (UnitInfo otherInfo : other.units.allInfos()) {
    // if (otherInfo.isFromProgram()) {
    // String name = otherInfo.name();
    // UnitInfo info = units.lookup(name);
    // if (info == null) {
    // units.put(name, otherInfo.withFromProgram(false));
    // } else {
    // throw new PacioliException(info.getLocation(), "Duplicate of unit %s found",
    // info.generic().name);
    // // units.put(name, info.includeOther(otherInfo));
    // }
    // }
    // }

    // // Include the index sets from the other program
    // for (IndexSetInfo otherInfo : other.indexSets.allInfos()) {
    // if (otherInfo.isFromProgram()) {
    // String name = otherInfo.name();
    // IndexSetInfo info = indexSets.lookup(name);
    // if (info == null) {
    // indexSets.put(name, otherInfo.withFromProgram(false));
    // } else {
    // throw new PacioliException(info.getLocation(), "Duplicate of index set %s
    // found",
    // info.generic().name);
    // // indexSets.put(name, info.includeOther(otherInfo));
    // }
    // }
    // }

    // // Include the types from the other program
    // for (TypeInfo otherInfo : other.types.allInfos()) {
    // if (otherInfo.isFromProgram()) {
    // String name = otherInfo.name();
    // TypeInfo info = types.lookup(name);
    // if (info == null) {
    // types.put(name, otherInfo.withFromProgram(false));
    // } else {
    // throw new PacioliException(info.getLocation(), "Duplicate of type %s found",
    // info.generic().name);
    // // types.put(name, info.includeOther(otherInfo));
    // }
    // }
    // }

    // // Include the values from the other program
    // for (ValueInfo otherInfo : other.values.allInfos()) {
    // if (otherInfo.isFromProgram()) {
    // String name = otherInfo.name();
    // if (true || !other.isExternal(otherInfo)) {
    // ValueInfo info = values.lookup(name);
    // if (info == null) {
    // values.put(name, otherInfo.withFromProgram(false));
    // } else {
    // throw new PacioliException(info.getLocation(), "Duplicate of value %s found",
    // info.generic().name);
    // //values.put(name, info.includeOther(otherInfo));
    // }
    // }
    // }
    // }

    // }

    // -------------------------------------------------------------------------
    // Resolving
    // -------------------------------------------------------------------------

    // public void resolve() throws Exception {

    // Pacioli.trace("Resolving %s", this.file.getModule());

    // for (UnitInfo nfo : units.allInfos()) {
    // Optional<? extends Definition> definition = nfo.getDefinition();
    // assert (definition.isPresent());
    // if (nfo.isFromProgram() && definition.isPresent()) {
    // Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving unit %s",
    // nfo.globalName());
    // definition.get().resolve(this);
    // }
    // }
    // for (TypeInfo nfo : types.allInfos()) {
    // if (nfo.isFromProgram() && nfo.getDefinition().isPresent()) {
    // Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving type %s",
    // nfo.globalName());
    // nfo.getDefinition().get().resolve(this);
    // }
    // }
    // for (ValueInfo nfo : values.allInfos()) {
    // if (nfo.isFromProgram()) {
    // if (nfo.getDefinition().isPresent()) {
    // Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving value or
    // function %s",
    // nfo.globalName());
    // nfo.getDefinition().get().resolve(this);
    // }
    // if (nfo.getDeclaredType().isPresent()) {
    // Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving declaration
    // %s", nfo.globalName());
    // nfo.getDeclaredType().get().resolve(this);
    // }
    // }
    // }
    // for (Toplevel definition : toplevels) {
    // Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving toplevel %s",
    // definition.localName());
    // definition.resolve(this);
    // }
    // }

    public void resolve2(PacioliTable symbolTable) throws Exception {

        Pacioli.trace("Resolving2 %s", this.file.getModule());

        if (values.parent != null) {
            throw new RuntimeException(String.format("Expected null parent in %s", this.file));
        }
        if (typess.parent != null) {
            throw new RuntimeException(String.format("Expected null parent in %s", this.file));
        }

        // SymbolTable<TypeSymbolInfo> typeTable = new
        // SymbolTable<TypeSymbolInfo>(symbolTable.types());
        // SymbolTable<? extends SymbolInfo> it = indexSets;
        // SymbolTable<? extends SymbolInfo> ty = types;
        // SymbolTable<? extends SymbolInfo> un = units;
        // typeTable.addAll((SymbolTable<TypeSymbolInfo>) it);
        // typeTable.addAll((SymbolTable<TypeSymbolInfo>) ty);
        // typeTable.addAll((SymbolTable<TypeSymbolInfo>) un);

        values.parent = symbolTable.values();
        typess.parent = symbolTable.types();
        PacioliTable env = new PacioliTable(values, typess);
        for (TypeSymbolInfo nfo : typess.allInfos()) {
            if (nfo instanceof UnitInfo) {
                Optional<? extends Definition> definition = nfo.getDefinition();
                assert (definition.isPresent());
                if (nfo.isFromProgram() && definition.isPresent()) {
                    Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving unit %s", nfo.globalName());
                    definition.get().resolve2(file, env);
                }
            }
        }
        for (TypeSymbolInfo nfo : typess.allInfos()) {
            if (nfo instanceof TypeInfo) {
                if (nfo.isFromProgram() && nfo.getDefinition().isPresent()) {
                    Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving type %s", nfo.globalName());
                    nfo.getDefinition().get().resolve2(file, env);
                }
            }
        }
        // for (UnitInfo nfo : units.allInfos()) {
        // Optional<? extends Definition> definition = nfo.getDefinition();
        // assert (definition.isPresent());
        // if (nfo.isFromProgram() && definition.isPresent()) {
        // Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving unit %s",
        // nfo.globalName());
        // definition.get().resolve2(file, env);
        // }
        // }
        // for (TypeInfo nfo : types.allInfos()) {
        // if (nfo.isFromProgram() && nfo.getDefinition().isPresent()) {
        // Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving type %s",
        // nfo.globalName());
        // nfo.getDefinition().get().resolve2(file, env);
        // }
        // }
        for (ValueInfo nfo : values.allInfos()) {
            if (nfo.isFromProgram()) {
                if (nfo.getDefinition().isPresent()) {
                    Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving value or function %s",
                            nfo.globalName());
                    nfo.getDefinition().get().resolve2(file, env);
                }
                if (nfo.getDeclaredType().isPresent()) {
                    Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving declaration %s", nfo.globalName());
                    nfo.getDeclaredType().get().resolve2(file, env);
                }
            }
        }
        for (Toplevel definition : toplevels) {
            Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving toplevel %s", definition.localName());
            definition.resolve(this);
        }
        values.parent = null;
        typess.parent = null;
    }

    // -------------------------------------------------------------------------
    // Desugaring
    // -------------------------------------------------------------------------

    public void desugar() throws PacioliException {
        Pacioli.trace("Desugaring %s", this.file.getModule());
        program = (ProgramNode) program.desugar();
    }

    public void liftStatements() throws Exception {
        // Note that method liftValueInfoStatements requires resolved
        // definitions, but produces non resolved definitions.

        // Pacioli.logln("%s", pretty());

        liftValueInfoStatements();
        // resolve();
        // inferTypes();
    }

    private void liftValueInfoStatements() {

        Pacioli.trace("Lifting value statements %s", this.file.getModule());

        for (ValueInfo info : values.allInfos()) {
            if (info.getDefinition().isPresent() && !isExternal(info)) {
                ValueDefinition definition = info.getDefinition().get();
                ExpressionNode newBody = new LiftStatements(this).expAccept(definition.body);
                definition.body = newBody;

            }
        }
    }

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

        Boolean logAnyway = true;

        for (String value : names) {
            ValueInfo info = values.lookup(value);
            // ValueInfo info = environment.values().lookup(value);

            if (!isExternal(info) && info.getDefinition().isPresent()) {
                boolean showLog = Pacioli.Options.logTypeInference && (info.isFromProgram() || logAnyway);
                Pacioli.logIf(showLog, "Infering type of %s", value);
                inferValueDefinitionType(info, discovered, finished, showLog);
                Pacioli.logIf(showLog, "%s :: %s;", info.name(), info.inferredType.get().pretty());
            }
            Optional<TypeNode> declared = info.getDeclaredType();
            if (!info.inferredType.isPresent()) {
                // Pacioli.warn("Skipping type check for %s", info.name());
            }
            if (declared.isPresent() && info.inferredType.isPresent()) {
                PacioliType declaredType = declared.get().evalType(info.isFromProgram()).instantiate();

                PacioliType inferredType = info.inferredType().instantiate();

                if (info.isFromProgram() || logAnyway) {
                    Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails,
                            "Checking inferred type\n  %s\nagainst declared type\n  %s",
                            inferredType.pretty(), declaredType.pretty());
                }
                if (!declaredType.isInstanceOf(inferredType)) {
                    throw new RuntimeException("Type error",
                            new PacioliException(info.getLocation(),
                                    String.format(
                                            "Declared type\n\n  %s\n\ndoes not specialize the inferred type\n\n  %s\norigin = %s\n",
                                            declaredType.unfresh().deval().pretty(),
                                            inferredType.unfresh().deval().pretty(),
                                            info.isFromProgram())));
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
                    vinfo.setinferredType(vinfo.getDeclaredType().get().evalType(false));
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
                Typing typing = def.body.inferTyping(this);

                Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails, "Inferred typing of %s is %s", info.name(),
                        typing.pretty());

                try {
                    PacioliType solved = typing.solve(info.isFromProgram()).unfresh();
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
    // Generating code
    // -------------------------------------------------------------------------

    public void generateCode(PrintWriter writer, CompilationSettings settings) throws Exception {

        Pacioli.trace("Generating code for %s", this.file.getModule());

        // Dev switch
        Boolean externals = true;

        // Declare a compiler (symbol table visitor) instance
        Printer printer = new Printer(writer);
        SymbolTableVisitor compiler;
        CodeGenerator gen;

        switch (settings.getTarget()) {
            case JS:
                gen = new JSGenerator(new Printer(writer), settings, false);
                compiler = new JSCompiler(printer, settings);
                break;
            case MATLAB:
                gen = new MatlabGenerator(printer, settings);
                compiler = new MATLABCompiler(printer, settings);

                MATLABCompiler.writePrelude(printer);

                break;
            case MVM:
                gen = new MVMGenerator(printer, settings);
                compiler = new MVMCompiler(printer, settings);

                break;
            case PYTHON:

                PythonCompiler.writePrelude(printer);

                gen = new PythonGenerator(printer, settings);
                compiler = new PythonCompiler(printer, settings);
                break;
            default:
                throw new RuntimeException("Unknown target");
        }

        // Generate code for the index sets
        for (TypeSymbolInfo info : typess.allInfos()) {
            if (info instanceof IndexSetInfo && !isExternal(info) || externals) {
                assert (info.getDefinition().isPresent());
                info.accept(compiler);
            }
        }

        // printer.format("\npacioliUnitContext = Pacioli.PacioliContext.si()\n\n");

        // Find all units to compile
        List<UnitInfo> unitsToCompile = new ArrayList<UnitInfo>();
        for (TypeSymbolInfo info : typess.allInfos()) {
            if (info instanceof IndexSetInfo) {
                UnitInfo unitInfo = (UnitInfo) info;
                if ((!isExternal(info) || externals) && !unitInfo.isAlias()) {
                    unitsToCompile.add(unitInfo);
                }
            }
        }

        // Sort the units according to depency order
        unitsToCompile = orderedInfos(unitsToCompile);

        // for (UnitInfo info : unitsToCompile) {
        // if (info instanceof ScalarUnitInfo) {
        // ScalarUnitInfo scalarInfo = (ScalarUnitInfo) info;
        // Optional<UnitNode> unitNode = scalarInfo.getDefinition().flatMap(d-> d.body);
        // if (unitNode.isPresent()){
        // String body = TypeBase.compileUnitToJSON(unitNode.get().evalUnit().unit());
        // printer.format("\nPacioli2.%s = () => { return %s; }\n",
        // scalarInfo.globalName(), body);
        // printer.format("\nconsole.log(Pacioli2.%s())\n", scalarInfo.globalName());
        // //printer.format("\n//Pacioli2.define_unit(\"%s\", \"%s\", %s)\n",
        // scalarInfo.globalName(), scalarInfo.symbol, body);
        // } else {
        // printer.format("\n//Pacioli2.define_unit(\"%s\", \"%s\")\n",
        // scalarInfo.globalName(), scalarInfo.symbol);
        // }
        // }
        // }

        // Generate code for the units
        for (UnitInfo info : unitsToCompile) {
            info.accept(compiler);
        }

        // Find all values to compile (unnecessary step, or do we want to sort
        // alphabetically?)
        List<ValueInfo> valuesToCompile = new ArrayList<ValueInfo>();
        List<ValueInfo> functionsToCompile = new ArrayList<ValueInfo>();
        for (ValueInfo info : values.allInfos()) {
            if (!isExternal(info) || externals) {
                if (info.getDefinition().isPresent()) {
                    if (info.getDefinition().get().isFunction()) {
                        functionsToCompile.add(info);
                        // valuesToCompile.add(info);
                    } else {
                        valuesToCompile.add(info);
                    }
                }
            }
        }

        // Generate code for the values
        for (ValueInfo info : functionsToCompile) {
            info.accept(compiler);
        }
        Pacioli.trace("Ordering values");
        valuesToCompile = orderedInfos(valuesToCompile);
        for (ValueInfo info : valuesToCompile) {
            info.accept(compiler);
        }

        // Generate code for the toplevels
        for (Toplevel def : toplevels) {
            if (settings.getTarget() == Target.MVM ||
                    settings.getTarget() == Target.MATLAB) {
                printer.newline();
                def.accept(gen);
                printer.newline();
            }
            if (settings.getTarget() == Target.PYTHON) {
                printer.newline();
                printer.write("glbl_base_print(");
                def.accept(gen);
                printer.write(")");
                printer.newline();
            }
        }

    }

    // -------------------------------------------------------------------------
    // Topological Order of Definitions
    // -------------------------------------------------------------------------

    static <T extends SymbolInfo> List<T> orderedInfos(Collection<T> definitions) throws PacioliException {

        Set<T> discovered = new HashSet<T>();
        Set<T> finished = new HashSet<T>();
        Set<String> names = definitions.stream().map(def -> def.globalName()).collect(Collectors.toSet());

        List<T> orderedDefinitions = new ArrayList<T>();
        for (T definition : definitions) {
            insertInfo(definition, orderedDefinitions, discovered, finished, names);
        }
        return orderedDefinitions;
    }

    static <T extends SymbolInfo> void insertInfo(T info, List<T> definitions, Set<T> discovered, Set<T> finished,
            Collection<String> all) throws PacioliException {

        assert (info.getDefinition().isPresent());
        Definition def = info.getDefinition().get();

        if (!finished.contains(info)) {

            if (discovered.contains(info)) {
                throw new PacioliException(def.getLocation(), "Cycle in definition " + info.name());
            }
            discovered.add(info);
            for (SymbolInfo other : def.uses()) {
                Pacioli.log("check %s-20s %s-20s %s-20s", info.globalName(), other.globalName(),
                        all.contains(other.globalName()));
                if ((all.contains(other.globalName())) && other.getDefinition().isPresent()) {
                    insertInfo((T) other, definitions, discovered, finished, all);
                }
            }
            definitions.add(info);
            finished.add(info);
        }
    }

    // -------------------------------------------------------------------------
    // Pretty printing
    // -------------------------------------------------------------------------

    @Override
    public void printPretty(PrintWriter out) {

        if (false) {
            program.printPretty(out);
        } else {

            for (TypeSymbolInfo info : typess.allInfos()) {
                out.println();
                info.getDefinition().get().printPretty(out);
                ;
                out.println();
            }

            // for (IndexSetInfo info : indexSets.allInfos()) {
            //     out.println();
            //     info.getDefinition().get().printPretty(out);
            //     ;
            //     out.println();
            // }

            // for (TypeInfo info : types.allInfos()) {
            //     if (info.getDefinition().isPresent()) {
            //         out.println();
            //         info.getDefinition().get().printPretty(out);
            //         out.println();
            //     }
            // }

            for (ValueInfo info : values.allInfos()) {
                if (info.getDefinition().isPresent() && !isExternal(info)) {
                    out.println();
                    info.getDefinition().get().printPretty(out);
                    out.println();
                }
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

    //     Pacioli.println("Symbol table for %s", getFile());

    //     Pacioli.println("Units:");
    //     for (UnitInfo info : units.allInfos()) {
    //         Pacioli.println("%s", info.name());
    //     }

    //     // Include the index sets from the other program
    //     Pacioli.println("Index sets:");
    //     for (IndexSetInfo info : indexSets.allInfos()) {
    //         Pacioli.println("%s", info.name());
    //     }

    //     // Include the types from the other program
    //     Pacioli.println("Types:");
    //     for (TypeInfo info : types.allInfos()) {
    //         Pacioli.println("%s", info.name());
    //     }

    //     // Include the values from the other program
    //     Pacioli.println("Values:");
    //     for (ValueInfo info : values.allInfos()) {
    //         Pacioli.println("%s %s %s",
    //                 isExternal(info) ? "ext " : "file",
    //                 info.generic().getFile(),
    //                 info.name());
    //     }

    // }

}
