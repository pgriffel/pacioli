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
import pacioli.ast.expression.LambdaNode;
import pacioli.compilers.JSCompiler;
import pacioli.compilers.MATLABCompiler;
import pacioli.compilers.MVMCompiler;
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
import pacioli.visitors.CodeGenerator;
import pacioli.visitors.JSGenerator;
import pacioli.visitors.LiftStatements;
import pacioli.visitors.MVMGenerator;
import pacioli.visitors.MatlabGenerator;
import pacioli.visitors.ResolveVisitor;

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
    public ProgramNode program;

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
    
    // -------------------------------------------------------------------------
    // Pretty printing
    // -------------------------------------------------------------------------

    @Override
    public void printPretty(PrintWriter out) {
        
        if (false) {
            program.printPretty(out);
        } else {
        
            for (UnitInfo info : units.allInfos()) {
                info.getDefinition().get().printPretty(out);;
            }
            
            for (IndexSetInfo info: indexSets.allInfos()) {
                info.getDefinition().get().printPretty(out);;
            }
            
            for (TypeInfo info : types.allInfos()) {
                if (info.getDefinition().isPresent()) {
                    info.getDefinition().get().printPretty(out);
                }
            }
            
            for (ValueInfo info : values.allInfos()) {
                if (info.getDefinition().isPresent() && !isExternal(info)) {
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
            Pacioli.logln("  %-25s %-15s %s %-50s %s", 
                    info.name(),
                    info.generic().getModule(),
                    isExternal(info) ? "     " : "local", 
                    info.generic().getFile(), 
                    def.isPresent() ? def.get() : "No definition");
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
        loadTillHelper(phase, true, true);
    }
    
    public void loadTillHelper(Phase phase, Boolean loadPrimitives, Boolean loadStandard) throws Exception {
        
        program = Parser.parseFile(this.file.getFile());
        desugar();
        if (phase.equals(Phase.PARSED)) return;
        
        fillTables(loadPrimitives, loadStandard);
        if (phase.equals(Phase.DESUGARED)) return;
        
        resolve();
        liftStatements();  // Requires resolved defintions, produces non resolved definitions!
        resolve();
        
        if (phase.equals(Phase.RESOLVED)) return;
    
        inferTypes();
    }
    
    // -------------------------------------------------------------------------
    // Filling symbol tables
    // -------------------------------------------------------------------------

    public void fillTables(Boolean loadPrimitives, Boolean loadStandard) throws Exception {

        for (String type : ResolveVisitor.builtinTypes) {
            // Fixme: null arg for the location. Maybe declare them in a base.pacioli?
            GenericInfo generic = new GenericInfo(type, "base", true, null);
            addInfo(new TypeInfo(generic));
        }

        // Fill symbol tables for the default include files
        for (String lib : PacioliFile.defaultIncludes) {
            Boolean isStandard = lib.equals("standard");
            if ((isStandard && loadStandard) || (!isStandard && loadPrimitives)) {
                PacioliFile file = PacioliFile.requireLibrary(lib, libs);
                Progam prog = new Progam(file, libs);
                prog.loadTillHelper(Progam.Phase.TYPED, isStandard, false);
                this.includeOther(prog);
            }
        }

        // Fill symbol tables for the imported libraries
        for (PacioliFile file: findImports(libs)) {
            Progam prog = new Progam(file, libs);
            Pacioli.logln("Loading library file %s", file.getFile());
            prog.loadTill(Progam.Phase.PARSED);
            for (Definition def : prog.program.definitions) {
                if (def instanceof Declaration || def instanceof IndexSetDefinition  || def instanceof UnitDefinition  || def instanceof UnitVectorDefinition
                        || def instanceof TypeDefinition) {
                    def.addToProgr(prog);
                }
            }
            includeOther(prog);
        }
        
        // Fill symbol tables for the included files
        for (String include : includes()) {
            Path p = Paths.get(file.getFile().getAbsolutePath());
            PacioliFile file = PacioliFile.findInclude(p.getParent(), this.file, include);
            Progam prog = new Progam(file, libs);
            Pacioli.logln("Loading include file %s", include);
            prog.loadTill(Progam.Phase.PARSED);
            for (Definition def : prog.program.definitions) {
                if (def instanceof Declaration || def instanceof IndexSetDefinition  || def instanceof UnitDefinition  || def instanceof UnitVectorDefinition
                        || def instanceof TypeDefinition) {
                    def.addToProgr(prog);
                }
            }
            includeOther(prog);
        }

        // Fill symbol tables for this file
        for (Definition def : program.definitions) {
            def.addToProgr(this);
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
            if (!other.isExternal(otherInfo)) {
                UnitInfo info = units.lookup(name);
                if (info == null) {
                    units.put(name, otherInfo);
                } else {
                    units.put(name, info.includeOther(otherInfo));
                }
            }
        }
        
        // Include the index sets from the other program
        for (IndexSetInfo otherInfo: other.indexSets.allInfos()) {
            String name = otherInfo.name();
            IndexSetInfo info = indexSets.lookup(name);
            if (info == null) {
                indexSets.put(name, otherInfo);
            } else {
                indexSets.put(name, info.includeOther(otherInfo));
            }
        }
        
        // Include the types from the other program
        for (TypeInfo otherInfo: other.types.allInfos()) {
             String name = otherInfo.name(); 
            TypeInfo info = types.lookup(name);
            if (info == null) {
                types.put(name, otherInfo);
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
                    values.put(name, otherInfo);
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
    
    public void liftStatements() {
        for (ValueInfo info: values.allInfos()) {
            if (info.getDefinition().isPresent() && !isExternal(info)) {
                ValueDefinition definition = info.getDefinition().get();
                ExpressionNode newBody = new LiftStatements(this).expAccept(definition.body);
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
        
        for (String value : names) {
            ValueInfo info = values.lookup(value);
            if (!isExternal(info) && info.getDefinition().isPresent()) {
                inferValueDefinitionType(info, discovered, finished);
                Pacioli.logln3("\n%s :: %s;", info.name(), info.inferredType.get().pretty());
            }
        }
        for (Toplevel toplevel : toplevels) {

            inferUsedTypes(toplevel, discovered, finished);
            Typing typing = toplevel.body.inferTyping(this);
            //Pacioli.log3("\n%s", typing.toText());
            /*
             * type = typing.solve().simplify(); return type;
             */
        }
    }

    private void inferUsedTypes(Definition definition, Set<SymbolInfo> discovered, Set<SymbolInfo> finished) {
        for (SymbolInfo pre : definition.uses()) {
            if (pre.isGlobal() && pre instanceof ValueInfo) {
                if (!isExternal(pre) && pre.getDefinition().isPresent()) {
                    inferValueDefinitionType((ValueInfo) pre, discovered, finished);
                } else {
                    ValueInfo vinfo = (ValueInfo) pre;
                    if (!vinfo.getDeclaredType().isPresent()) {
                        throw new RuntimeException(new PacioliException(pre.getLocation(), "No type declared for %s", pre.name()));
                    }
                    vinfo.setinferredType(vinfo.getDeclaredType().get().evalType(false));
                }
            }
        }
    }

    private void inferValueDefinitionType(ValueInfo info, Set<SymbolInfo> discovered, Set<SymbolInfo> finished) {

        if (!finished.contains(info)) {
            if (discovered.contains(info)) {
                Pacioli.warn("Cycle in definition of %s", info.name());
            } else {
                discovered.add(info);
                inferUsedTypes(info.getDefinition().get(), discovered, finished);

                /*
                 * int oldVerbosity = Pacioli.verbosity; if (info.name().equals("conv_matrix"))
                 * { Pacioli.verbosity = 3; }
                 */

                Pacioli.log3("\n\nInferring type of %s", info.name());
                ValueDefinition def = info.getDefinition().get();
                Typing typing = def.body.inferTyping(this);
                try {
                    PacioliType solved = typing.solve();
                    Pacioli.log3("\n\nSolved type of %s is %s", info.name(), solved.pretty());
                    Pacioli.log3("\n\nSimple type of %s is %s", info.name(), solved.simplify().pretty());
                    Pacioli.log3("\n\nGenerl type of %s is %s", info.name(), solved.simplify().generalize().pretty());
                    values.lookup(info.name()).setinferredType(solved.simplify().generalize());
                } catch (PacioliException e) {
                    throw new RuntimeException(e);
                }

                /*
                 * if (info.name().equals("conv_matrix")) { Pacioli.verbosity = oldVerbosity; }
                 */
                finished.add(info);
            }
        }
    }
    
    void printTypes() {

        List<String> names = values.allNames();
        Collections.sort(names);
        
        for (String value : names) {
            ValueInfo info = values.lookup(value);
            if (!isExternal(info) && info.getDefinition().isPresent()) {
                Pacioli.logln("\n%s :: %s;", info.name(), info.inferredType().pretty());
            }
        }
        for (Toplevel toplevel : toplevels) {

            Typing typing = toplevel.body.inferTyping(this);
            Pacioli.log3("\n%s", typing.pretty());
            /*
             * type = typing.solve().simplify(); return type;
             */
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
            
            writeMATLABPrelude(printer);
            
            
            break;
        case MVM:
            gen = new MVMGenerator(printer, settings);
            compiler = new MVMCompiler(printer, settings);
            break;
        default:
            compiler = null;
            gen = null;
            break;
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
        for (ValueInfo info: values.allInfos()) {
            if (!isExternal(info) || externals) {
                if (info.getDefinition().isPresent()) {
                    valuesToCompile.add(info);
                }
            }
        }
        
        // Generate code for the values
        for (ValueInfo info : valuesToCompile) {
            info.accept(compiler);
        }
        
        // Generate code for the toplevels
        for (Toplevel def : toplevels) {
            if (settings.getTarget() == Target.MVM || settings.getTarget() == Target.MATLAB) {
                def.accept(gen);    
            }
        }
        
    }
    private void writeMATLABPrelude(Printer out) {
        
        
        out.write("% Octave code generated by Pacioli compiler");
        out.newline();
        out.newline();
        out.write("1; % dummy statement to tell Octave this is not a function file");
        out.write(mc);
        out.newline();
        out.newline();
        out.write("function retval = fetch_global (module, name)");
        out.newline();
        out.write("  switch (strcat(\"global_\", module, \"_\", name))");
        out.newline();
        out.write("    case \"global_base__\"");
        out.newline();
        out.write("      retval = {0,1};");
        out.newline();
        for (ValueInfo info: values.allInfos()) {
            if (info.getDefinition().isPresent()) {
                ValueDefinition definition = info.getDefinition().get();
                String fullName = info.globalName();
                if (definition.body instanceof LambdaNode) {
                    out.format("    case \"%s\"\n", fullName);
                    out.format("      retval = @%s;\n", fullName);

                } else {
                    out.format("    case \"%s\"\n", fullName);
                    out.format("      global %s;\n", fullName);
                    out.format("      retval = %s;\n", fullName);
                }
            }
        }
        out.write("    otherwise");
        out.newline();
        out.write("    error(strcat(\"global '\", name, \"' from module '\", module, \"' unknown\"));");
        out.newline();
        out.write("  endswitch;");
        out.newline();
        out.write("endfunction;");
        out.newline();
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
   
    // -------------------------------------------------------------------------
    // Matlab primitives
    // -------------------------------------------------------------------------
    
/*        
    for (final File file: new File("E:/code/private/pacioli-samples/shells/new-matlab-primitives/").listFiles()) {
        out.newline();
        out.newline();
        try {
            String matlabPrimitive = FileUtils.readFileToString(file, Charset.defaultCharset());
            out.print(matlabPrimitive);
        } catch (IOException e) {
            e.printStackTrace();

        }   
    }        
*/
    
    static final String mc = "\n" + 
            "function result = global_base_add_mut(list, item)\n" + 
            "  result = global_base_append(list, global_base_singleton_list(item));\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function list = global_base_append(x,y)\n" + 
            " list = {x{:} y{:}};\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_apply(fun,args)\n" + 
            " result = fun(args{:});\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function domain = global_base_column_domain(x)\n" + 
            "  n = size(x)(2);\n" + 
            "  domain = cell(1, n);\n" + 
            "  for i = 1:n\n" + 
            "    key = {i-1,n};\n" + 
            "    domain{1,i} = key;\n" + 
            "  endfor;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function units = global_base_column_unit(x)\n" + 
            "  n = size(x)(2);\n" + 
            "  units = cell(1, n);\n" + 
            "  for i = 1:n\n" + 
            "      units{1,i} = 1;\n" + 
            "  endfor\n" + 
            "  units = ones(1,n);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_cons(item, list)\n" + 
            "  result = global_base_append(global_base_singleton_list(item), list);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_cos(angle)\n" + 
            "  result = cos(angle);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_divide(x,y)\n" + 
            "  num = global_base_multiply(x, global_base_reciprocal(y));\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function list = global_base_empty_list()\n" + 
            "  %list = {};\n" + 
            "list = {1}(1,2:end);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_equal(x,y)\n" + 
            "%  result = logical(x == y);\n" + 
            "  result = isequal(x, y);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_exp(x)\n" + 
            "  num = exp(x);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_expt(x,y)\n" + 
            "  num = x^y;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_fold_list(fun, items)\n" + 
            "  if (numel(items) == 0)\n" + 
            "      error(\"fold list called on empty list\");\n" + 
            "  endif\n" + 
            "  result = items{1, 1};\n" + 
            "  for i=2:numel(items)\n" + 
            "    result = fun(result, items{1, i});\n" + 
            "  end\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_get(x, i, j)\n" + 
            "  num = x(i{1} + 1, j{1} + 1);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function item = global_base_head(l)\n" + 
            "  item = l{1,1};\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_left_identity(mat)\n" + 
            "\n" + 
            "  result = eye(size(mat)(1));\n" + 
            "\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_less(x,y)\n" + 
            "  result = x < y;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function length = global_base_list_size(list)\n" + 
            "  length = numel(list);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_ln(x)\n" + 
            "  result = log(x);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_loop_list(init, fun, items)\n" + 
            "  result = init;\n" + 
            "  for i=1:numel(items)\n" + 
            "    result = fun(result, items{i});\n" + 
            "  end\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_magnitude(x)\n" + 
            "  num = x;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_make_matrix(items)\n" + 
            "  if (numel(items) == 0)\n" + 
            "    error(\"matrix_from_tuples called on empty list\");\n" + 
            "  endif\n" + 
            " rowkey = items{1, 1}{1, 1};\n" + 
            " columnkey = items{1, 1}{1, 2};\n" + 
            " result = zeros(rowkey{1, 2}, columnkey{1, 2});\n" + 
            " for i=1:numel(items)\n" + 
            "   result(items{1, i}{1, 1}{1, 1} + 1, items{1, i}{1, 2}{1, 1} + 1) = items{1, i}{1, 3};\n" + 
            " end\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_minus(x,y)\n" + 
            "  num = global_base_sum(x, global_base_negative(y));\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_mmult(x,y)\n" + 
            "  num = x*y;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_mod(a, m)\n" + 
            "  result = mod(a, m);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_multiply(x,y)\n" + 
            "  num = x.*y;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function list = global_base_naturals(n)\n" + 
            " list = num2cell(0:n-1);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_negative(x)\n" + 
            "  num = -x;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_not(x)\n" + 
            "  num = not(x);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_not_equal(x,y)\n" + 
            "  result = not(global_base_equal(x, y));\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function item = global_base_nth(n, l)\n" + 
            "  item = l{1,n+1};\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_print(value)\n" + 
            "  value\n" + 
            "  result = value;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_reciprocal(x)\n" + 
            "  num = arrayfun(@(x) one_reciprocal(x), x);\n" + 
            "endfunction\n" + 
            "\n" + 
            "function num = one_reciprocal(x) \n" + 
            "  if x == 0\n" + 
            "    num = 0;\n" + 
            "  else\n" + 
            "    num = 1/x;\n" + 
            "  endif\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "function domain = global_base_row_domain(x)\n" + 
            "  n = size(x)(1);\n" + 
            "  domain = cell(1, n);\n" + 
            "  for i = 1:n\n" + 
            "    key = {i-1,n};\n" + 
            "    domain{1,i} = key;\n" + 
            "  endfor;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function units = global_base_row_unit(x)\n" + 
            "  n = size(x)(1);\n" + 
            "  units = cell(1, n);\n" + 
            "  for i=1:n\n" + 
            "    units{1,i} = 1;\n" + 
            "  endfor\n" + 
            "  units = ones(n,1);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_scale(x,y)\n" + 
            "  num = x*y;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_scale_down(x,y)\n" + 
            "  num = x/y;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_sin(angle)\n" + 
            "  result = sin(angle);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function list = global_base_singleton_list(x)\n" + 
            "  list = {x};\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_solve(lhs, rhs)\n" + 
            "  num = lhs \\ rhs;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_sqrt(x)\n" + 
            "  num = sqrt(x);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_sum(x,y)\n" + 
            "  num = x+y;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function item = global_base_tail(l)\n" + 
            "  item = l(1,2:end);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_transpose(x)\n" + 
            "  num = x';\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_tuple(varargin)\n" + 
            "  result = varargin;\n" + 
            "end\n" + 
            "\n" + 
            "\n" + 
            "function num = global_base_unit_factor(x)\n" + 
            "  num = 1;\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = global_base_zip(x,y)\n" + 
            " result = cellfun(@(a,b) {a b}, x, y, \"UniformOutput\", false);\n" + 
            "endfunction\n" + 
            "\n" + 
            "\n" + 
            "\n" + 
            "function result = _if(x,y,z)\n" + 
            "  if x \n" + 
            "    result = y();\n" + 
            "  else\n" + 
            "    result = z();\n" + 
            "  endif\n" + 
            "endfunction\n" + 
            "\n" + 
            "";
}
