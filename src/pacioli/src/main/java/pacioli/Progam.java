package pacioli;

import java.io.File;
import java.io.PrintWriter;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import pacioli.CompilationSettings.Target;
import pacioli.ast.ImportNode;
import pacioli.ast.IncludeNode;
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
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.TypeInfo;
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
        PARSED,
        DESUGARED,
        TYPED, 
        RESOLVED
    }

    // Added during construction
    public final PacioliFile file;
    private final List<File> libs;

    // Added as first step of loading 
    ProgramNode program;

    // Fill during loading
    public SymbolTable<IndexSetInfo> indexSets = new SymbolTable<IndexSetInfo>();
    public SymbolTable<UnitInfo> units = new SymbolTable<UnitInfo>();
    public SymbolTable<TypeInfo> types = new SymbolTable<TypeInfo>();
    public SymbolTable<ValueInfo> values = new SymbolTable<ValueInfo>();
    public List<Toplevel> toplevels = new ArrayList<Toplevel>();

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public Progam(PacioliFile file, List<File> libs) {
        assert(file != null);
        this.file = file;
        this.libs = libs;
    }
    
    static Progam load(PacioliFile file, List<File> libs, Phase phase) throws Exception {
        Progam program = new Progam(file, libs);
        program.loadTill(phase);
        return program;
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
    // Pretty printing
    // -------------------------------------------------------------------------

    @Override
    public void printPretty(PrintWriter out) {
        
        if (false) {
            program.printPretty(out);
        } else {
        
            for (UnitInfo info : units.allInfos()) {
                out.println();
                info.getDefinition().get().printPretty(out);;
                out.println();
            }
            
            for (IndexSetInfo info: indexSets.allInfos()) {
                out.println();
                info.getDefinition().get().printPretty(out);;
                out.println();
            }
            
            for (TypeInfo info : types.allInfos()) {
                if (info.getDefinition().isPresent()) {
                    out.println();
                    info.getDefinition().get().printPretty(out);
                    out.println();
                }
            }
            
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
        Pacioli.logln("Begin %s table", header);
        for (SymbolInfo info: table.allInfos()) {
            Optional<? extends Definition> def = info.getDefinition();
            Pacioli.logln("  %-25s %-25s %-10s %-10s %-50s", 
                    info.name(),
                    info.generic().getModule(),
                    info.isFromProgram(),//isExternal(info) ? "     " : "local", 
                    info.generic().getFile() == null ? "" : isExternal(info), // "", //info.generic().getFile(), 
                    def.isPresent() ? "has def" : "No definition");
        }
        Pacioli.logln("End table");
    }
    
    // -------------------------------------------------------------------------
    // Adding symbol table entries
    // -------------------------------------------------------------------------

    public void addInfo(IndexSetInfo info) throws PacioliException {
        String name = info.name();
        if (indexSets.contains(name)) {
            throw new PacioliException(info.getLocation(), "Duplicate index set name: " + name);
        } else {
            indexSets.put(name, info);
        }
    }

    public void addInfo(UnitInfo info) throws PacioliException {
        String name = info.name();
        if (units.contains(name)) {
            throw new PacioliException(info.getLocation(), "Duplicate unit name: " + name);
        } else {
            units.put(name, info);
        }
    }
    
    public void addInfo(TypeInfo info) throws PacioliException {
        String name = info.name();
        if (types.contains(name)) {
            throw new PacioliException(info.getLocation(), "Duplicate type name: " + name);
        } else {
            types.put(name, info);
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
    
    // -------------------------------------------------------------------------
    // Loading
    // -------------------------------------------------------------------------
    
    public void loadTill(Phase phase) throws Exception {

        program = Parser.parseFile(this.file.getFile());

        desugar();
        if (phase.equals(Phase.PARSED)) return;

        fillTables();
        if (phase.equals(Phase.DESUGARED)) return;
        
        resolve();
        transformConversions();
        
        if (phase.equals(Phase.RESOLVED)) return;
    
        inferTypes();
    }
    
    // -------------------------------------------------------------------------
    // Filling symbol tables
    // -------------------------------------------------------------------------

    /**
     * Make obsolete by deftypes without body?
     */

     public void addPrimitiveTypes() {
        for (String type : ResolveVisitor.builtinTypes) {
            // Fixme: null arg for the location. Maybe declare them in a base.pacioli?
            GenericInfo generic = new GenericInfo(type, "base", true, new Location(), file.isSystemLibrary("base"));
            addInfo(new TypeInfo(generic));
        }
     }

    /**
     * Used to load base and standard
     * 
     * @param lib One of "base" or "standard"
     * @throws Exception
     */
    public void loadSystemLibrary(String lib) throws Exception {
        PacioliFile file = PacioliFile.requireLibrary(lib, libs);
        Progam prog = new Progam(file, libs);
        prog.loadTill(Progam.Phase.RESOLVED);
        this.includeOther(prog);
    }

    public void fillTables() throws Exception {
        
        this.addPrimitiveTypes();

        if (!file.isSystemLibrary("base")) {
            this.loadSystemLibrary("base");
        }

        if (!file.isSystemLibrary("base") && !file.isSystemLibrary("standard")) {
            this.loadSystemLibrary("standard");
        }

        // Fill symbol tables for the imported libraries
        for (PacioliFile file: findImports(libs)) {
            Progam prog = new Progam(file, libs);
            Pacioli.logln("Loading library file %s", file.getFile());
            prog.loadTill(Progam.Phase.PARSED);
            for (Definition def : prog.program.definitions) {
                if (def instanceof Declaration || def instanceof IndexSetDefinition  || def instanceof UnitDefinition  || def instanceof UnitVectorDefinition
                        || def instanceof TypeDefinition) {
                    def.addToProgr(prog, false);
                }
            }
            includeOther(prog);
        }
        
        // Fill symbol tables for the included files
        for (String include : includes()) {
            Path p = Paths.get(file.getFile().getAbsolutePath());
            PacioliFile file = PacioliFile.findInclude(p.getParent(), this.file, include);
            Progam prog = new Progam(file, libs);
            Pacioli.logln("Loading include file %s", file);
            prog.loadTill(Progam.Phase.PARSED);
            for (Definition def : prog.program.definitions) {
                if (def instanceof Declaration || def instanceof IndexSetDefinition  || def instanceof UnitDefinition  || def instanceof UnitVectorDefinition
                        || def instanceof TypeDefinition) {
                    def.addToProgr(prog, false);
                }
            }
            includeOther(prog);
        }

        // Fill symbol tables for this file
        for (Definition def : program.definitions) {
            def.addToProgr(this, true);
        }
    }

    // -------------------------------------------------------------------------
    // Printing symbol tables
    // -------------------------------------------------------------------------
    
    public void printSymbolTables() throws Exception {

        Pacioli.logln("Symbol table for %s", getFile());
        
        Pacioli.logln("Units:");
        for (UnitInfo info : units.allInfos()) {
            Pacioli.logln("%s", info.name());
        }
        
        // Include the index sets from the other program
        Pacioli.logln("Index sets:");
        for (IndexSetInfo info: indexSets.allInfos()) {
            Pacioli.logln("%s", info.name());
        }
        
        // Include the types from the other program
        Pacioli.logln("Types:");
        for (TypeInfo info : types.allInfos()) {
            Pacioli.logln("%s", info.name());
        }
        
        // Include the values from the other program
        Pacioli.logln("Values:");
        for (ValueInfo info : values.allInfos()) {
            Pacioli.logln("%s %s %s",
                    isExternal(info) ? "ext " : "file",
                    info.generic().getFile(),
                    info.name());
        }
        
    }

    // -------------------------------------------------------------------------
    // Absorbing symbol table entries from other programs 
    // -------------------------------------------------------------------------
    
    public void includeOther(Progam other) throws Exception {

        // Include the units from the other program
        for (UnitInfo otherInfo: other.units.allInfos()) {
            String name = otherInfo.name();
            UnitInfo info = units.lookup(name);
            if (info == null) {
                units.put(name, otherInfo.withFromProgram(false));
            } else {
                units.put(name, info.includeOther(otherInfo));
            }
        }
        
        // Include the index sets from the other program
        for (IndexSetInfo otherInfo: other.indexSets.allInfos()) {
            String name = otherInfo.name();
            IndexSetInfo info = indexSets.lookup(name);
            if (info == null) {
                indexSets.put(name, otherInfo.withFromProgram(false));
            } else {
                indexSets.put(name, info.includeOther(otherInfo));
            }
        }
        
        // Include the types from the other program
        for (TypeInfo otherInfo: other.types.allInfos()) {
            String name = otherInfo.name(); 
            TypeInfo info = types.lookup(name);
            if (info == null) {
                types.put(name, otherInfo.withFromProgram(false));
            } else {
                types.put(name, info.includeOther(otherInfo));
            }
        }
        
        // Include the values from the other program
        for (ValueInfo otherInfo: other.values.allInfos()) {
            String name = otherInfo.name();
            if (!other.isExternal(otherInfo)) {
                ValueInfo info = values.lookup(name);
                if (info == null) {
                    values.put(name, otherInfo.withFromProgram(false));
                } else {
                    values.put(name, info.includeOther(otherInfo));
                }
            }
        }
        
    }
    
    // -------------------------------------------------------------------------
    // Resolving
    // -------------------------------------------------------------------------

    public void resolve() throws Exception {
        for (UnitInfo nfo: units.allInfos()) {
            Optional<? extends Definition> definition = nfo.getDefinition();
            assert (definition.isPresent());
            if (definition.isPresent()) {
                definition.get().resolve(this);
            }
        }
        for (TypeInfo nfo: types.allInfos()) {
            if (nfo.getDefinition().isPresent()) {
                nfo.getDefinition().get().resolve(this);
            }
        }
        for (ValueInfo nfo: values.allInfos()) {
            if (nfo.getDefinition().isPresent()) {
                nfo.getDefinition().get().resolve(this);
            }
            if (nfo.getDeclaredType().isPresent()) {
                nfo.getDeclaredType().get().resolve(this);
            }
        }
        for (Toplevel definition : toplevels) {
            definition.resolve(this);
        }
    }

    // -------------------------------------------------------------------------
    // Desugaring
    // -------------------------------------------------------------------------

    public void desugar() throws PacioliException {
        program = (ProgramNode) program.desugar();
    }
    
    public void liftStatements() throws Exception {
        // Note that method liftValueInfoStatements requires resolved 
        // definitions, but produces non resolved definitions.
        
        
        
        //Pacioli.logln("%s", pretty());
        
        
        
        liftValueInfoStatements();
        resolve();
        inferTypes();
    }
    
    private void liftValueInfoStatements() {
        for (ValueInfo info: values.allInfos()) {
            if (info.getDefinition().isPresent() && !isExternal(info)) {
                ValueDefinition definition = info.getDefinition().get();
                ExpressionNode newBody = new LiftStatements(this).expAccept(definition.body);
                definition.body = newBody;
               
            }
        }
    }
    
    public void transformConversions() {
        for (ValueInfo info: values.allInfos()) {
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

    private void inferTypes() {

        Set<SymbolInfo> discovered = new HashSet<SymbolInfo>();
        Set<SymbolInfo> finished = new HashSet<SymbolInfo>();

        List<String> names = values.allNames();
        Collections.sort(names);
        
        Boolean logAnyway = false;
        
        for (String value : names) {
            Boolean log = value.equals("closure_hack") || false;
            ValueInfo info = values.lookup(value);
            if (!isExternal(info) && info.getDefinition().isPresent()) {
                if (info.isFromProgram() || logAnyway) {
                    Pacioli.logln2("Infering type of %s", value);
                }
                inferValueDefinitionType(info, discovered, finished, info.isFromProgram() || logAnyway);
                if (info.isFromProgram() || logAnyway) {
                    Pacioli.logln2("%s :: %s;", info.name(), info.inferredType.get().pretty());
                }
                
                //Pacioli.logln("\n%s :: %s;", info.name(), info.inferredType.get().deval().pretty());
            }
            Optional<TypeNode> declared = info.getDeclaredType();
            if (!info.inferredType.isPresent()) {
//                Pacioli.warn("Skipping type check for %s", info.name());
            }
            if (declared.isPresent() && info.inferredType.isPresent()) {
                PacioliType declaredType = declared.get().evalType(info.isFromProgram()).instantiate();
                
                PacioliType inferredType = info.inferredType().instantiate();
                
                if (info.isFromProgram() || logAnyway) {
                    Pacioli.logln2("Checking inferred type\n  %s\nagainst declared type\n  %s",
                            inferredType.pretty(), declaredType.pretty());
                }
                if (!declaredType.isInstanceOf(inferredType)) {
                    throw new RuntimeException("Type error",
                            new PacioliException(info.getLocation(), 
                                    String.format("Declared type\n\n  %s\n\ndoes not specialize the inferred type\n\n  %s\nfrom program = %s\n",
                                            declaredType.unfresh().deval().pretty(),
                                            inferredType.unfresh().deval().pretty(),
                                            
                                            info.isFromProgram()
                                            )));
                }
            }
            
        }
        int i = 0;
        for (Toplevel toplevel : toplevels) {

            inferUsedTypes(toplevel, discovered, finished, true);
            
            Pacioli.logln2("Inferring typing of toplevel %s", i);
            
            Typing typing = toplevel.body.inferTyping(this);
            Pacioli.logln3("Typing of toplevel %s is %s", i, typing.pretty());
            
            toplevel.type = typing.solve(!isLibrary()).simplify();
            Pacioli.logln3("Type of toplevel %s is %s", i, toplevel.type.pretty());
            
            i++;
        }
        
    }

    private void inferUsedTypes(Definition definition, Set<SymbolInfo> discovered, Set<SymbolInfo> finished, Boolean verbose) {
        for (SymbolInfo pre : definition.uses()) {
            if (pre.isGlobal() && pre instanceof ValueInfo) {
                if (!isExternal(pre) && pre.getDefinition().isPresent()) {
                    inferValueDefinitionType((ValueInfo) pre, discovered, finished, verbose);
                } else {
                    ValueInfo vinfo = (ValueInfo) pre;
                    if (!vinfo.getDeclaredType().isPresent()) {
                        throw new RuntimeException("Type error", new PacioliException(pre.getLocation(), "No type declared for %s", pre.name()));
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
     * @param verbose Determines whether log calls are made or not, independently
     *                from any global log setting. Allows the caller to filter 
     *                logging per definition.
     */
    private void inferValueDefinitionType(ValueInfo info, Set<SymbolInfo> discovered, Set<SymbolInfo> finished, Boolean verbose) {

        if (!finished.contains(info)) {
            if (discovered.contains(info)) {
                // Pacioli.warn("Cycle in definition of %s", info.name());
            } else {
                discovered.add(info);
                inferUsedTypes(info.getDefinition().get(), discovered, finished, verbose);

                ValueDefinition def = info.getDefinition().get();
                Typing typing = def.body.inferTyping(this);
                
                if (verbose) {
                    Pacioli.logln3("Inferred typing of %s is %s", info.name(), typing.pretty());
                }
                
                try {
                    PacioliType solved = typing.solve(info.isFromProgram()).unfresh();
                    if (verbose) {
                        Pacioli.logln3("\nSolved type of %s is %s", info.name(), solved.pretty());
                        Pacioli.logln3("\nSimple type of %s is %s", info.name(), solved.simplify().pretty());
                        Pacioli.logln3("\nGenerl type of %s is %s", info.name(), solved.simplify().generalize().pretty());
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
                Pacioli.logln("\n%s :: %s;", info.name(), info.inferredType().deval().pretty());
            }
        }
        Integer count = 1;
        for (Toplevel toplevel : toplevels) {
            PacioliType type = toplevel.type;
            Pacioli.logln("\nToplevel %s :: %s", count++, type.unfresh().deval().pretty());
        }
    }
    

    // -------------------------------------------------------------------------
    // Generating code
    // -------------------------------------------------------------------------
    
    public void generateCode(PrintWriter writer, CompilationSettings settings) throws Exception {
        
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
        for (IndexSetInfo info: indexSets.allInfos()) {
            if (!isExternal(info) || externals) {
                assert (info.getDefinition().isPresent());
                info.accept(compiler);
            }
        }
        
        // Find all units to compile
        List<UnitInfo> unitsToCompile = new ArrayList<UnitInfo>();
        for (UnitInfo info: units.allInfos()) {
            if ((!isExternal(info) || externals) && !info.isAlias()) {
                unitsToCompile.add(info);
            }
        }

        // Sort the units according to depency order
        unitsToCompile = orderedInfos(unitsToCompile);

        // Generate code for the units
        for (UnitInfo info : unitsToCompile) {
            info.accept(compiler);
        }
        
        // Find all values to compile (unnecessary step, or do we want to sort alphabetically?)
        List<ValueInfo> valuesToCompile = new ArrayList<ValueInfo>();
        List<ValueInfo> functionsToCompile = new ArrayList<ValueInfo>();
        for (ValueInfo info: values.allInfos()) {
            if (!isExternal(info) || externals) {
                if (info.getDefinition().isPresent()) {
                    if (info.getDefinition().get().isFunction()) {
                        functionsToCompile.add(info);
                        //valuesToCompile.add(info);
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

        List<T> orderedDefinitions = new ArrayList<T>();
        for (T definition : definitions) {
            insertInfo(definition, orderedDefinitions, discovered, finished, definitions);
        }
        return orderedDefinitions;
    }

    static <T extends SymbolInfo> void insertInfo(T info, List<T> definitions, Set<T> discovered, Set<T> finished,
            Collection<T> all) throws PacioliException {

        assert (info.getDefinition().isPresent());
        Definition def = info.getDefinition().get();

        if (!finished.contains(info)) {

            if (discovered.contains(info)) {
                throw new PacioliException(def.getLocation(), "Cycle in definition " + info.name());
            }
            discovered.add(info);
            for (SymbolInfo other : def.uses()) {
                if (all.contains(other) && other.getDefinition().isPresent()) {
                    insertInfo((T) other, definitions, discovered, finished, all);
                }
            }
            definitions.add(info);
            finished.add(info);
        }
    }
}
