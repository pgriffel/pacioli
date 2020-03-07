package pacioli;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import pacioli.ast.ProgramNode;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.IdentifierNode;
import pacioli.parser.Parser;
import pacioli.symboltable.GenericInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.types.PacioliType;
import pacioli.types.TypeBase;
import pacioli.visitors.CodeGenerator;
import pacioli.visitors.JSGenerator;
import pacioli.visitors.MVMGenerator;
import pacioli.visitors.ResolveVisitor;
import uom.DimensionedNumber;

public class Progam extends AbstractPrintable {

    public enum Phase {
        parsed,
        desugared,
        typed, 
        resolved
    }
    
    public final File file;
    private final List<File> libs;

    public ProgramNode program;

    public SymbolTable<IndexSetInfo> indexSets = new SymbolTable<IndexSetInfo>();
    public SymbolTable<UnitInfo> units = new SymbolTable<UnitInfo>();
    public SymbolTable<TypeInfo> types = new SymbolTable<TypeInfo>();
    public SymbolTable<ValueInfo> values = new SymbolTable<ValueInfo>();
    public List<Toplevel> toplevels = new ArrayList<Toplevel>();

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public Progam(String fileName, List<File> libs) {
        this.file = new File(fileName);
        this.libs = libs;
    }

    public Progam(File file, List<File> libs) {
        this.file = file;
        this.libs = libs;
    }

    // -------------------------------------------------------------------------
    // Pretty printing
    // -------------------------------------------------------------------------

    @Override
    public void printPretty(PrintWriter out) {
        program.printPretty(out);
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

    String baseName() {
        return fileBaseName(file);
    }
    
    Boolean isExternal(SymbolInfo info) {
        return !info.generic().file.equals(file);
    }
    
    static String fileBaseName(File file) {
        String name = file.getAbsolutePath();
        assert (name.endsWith(".pacioli"));
        return name.substring(0, name.length() - 8);
    }
    
    static String targetFileExtension(String target) {
        if (target.equals("javascript")) {
            return "js";
        } else if (target.equals("matlab")) {
            return "m";
        } else if (target.equals("html")) {
            return "html";
        } else if (target.equals("mvm")) {
            return "mvm";
        } else {
            throw new RuntimeException("Compilation target " + target + " unknown. Expected javascript, matlab or mvm.");
        }
    }
    
    public List<String> includes() {
        List<String> list = new ArrayList<String>();
        for (IdentifierNode id : program.includes) {
            list.add(id.name);
        }
        return list;
    }

    File findIncludeFile(String include) throws FileNotFoundException {
        return PacioliFile.findIncludeFile(include, libs, file.getParentFile());
    }

    // -------------------------------------------------------------------------
    // Loading
    // -------------------------------------------------------------------------
    
    public void loadTill(Phase phase) throws Exception {
        loadTillHelper(phase, true, true);
    }
    
    public void loadTillHelper(Phase phase, Boolean loadPrimitives, Boolean loadStandard) throws Exception {
        
        program = Parser.parseFile(this.file.getAbsolutePath());
        if (phase.equals(Phase.parsed)) return;
        
        desugar();
        if (phase.equals(Phase.desugared)) return;
        
        fillTables(loadPrimitives, loadStandard);
        resolve();
        if (phase.equals(Phase.resolved)) return;
    
        inferTypes();
    }

    // -------------------------------------------------------------------------
    // Filling symbol tables
    // -------------------------------------------------------------------------

    public void fillTables(Boolean loadPrimitives, Boolean loadStandard) throws Exception {

        for (String type : ResolveVisitor.builtinTypes) {
            GenericInfo generic = new GenericInfo(type, program.module.name, null, GenericInfo.Scope.IMPORTED, null);
            addInfo(new TypeInfo(generic));
        }

        // Fill symbol tables for the default include files
        for (String include : PacioliFile.defaultIncludes) {
            Boolean isStandard = include.equals("standard");
            if ((isStandard && loadStandard) || (!isStandard && loadPrimitives)) {
                File file = findIncludeFile(include);
                Progam prog = new Progam(file, libs);
                prog.loadTillHelper(Progam.Phase.typed, isStandard, false);
                this.includeOther(prog);
            }
        }

        // Fill symbol tables for the included files
        for (String include : includes()) {
            File file = findIncludeFile(include);
            Progam prog = new Progam(file, libs);
            Pacioli.logln("Loading include file %s", include);
            prog.loadTill(Progam.Phase.typed);
            this.includeOther(prog);
        }

        // Fill symbol tables for this file
        for (Definition def : program.definitions) {
            def.addToProgr(this, GenericInfo.Scope.FILE);
        }
    }

    // -------------------------------------------------------------------------
    // Printing symbol tables
    // -------------------------------------------------------------------------
    
    public void printSymbolTables() throws Exception {

        // Include the units from the other program
        Pacioli.logln("Symbol table for %s", file);
        Pacioli.logln("UNITS");
        for (String name: units.allNames()) {
            UnitInfo info = units.lookup(name);
            Pacioli.logln("%s", info.name());
        }
        
        // Include the index sets from the other program
        Pacioli.logln("INDEX SETS");
        for (String name: indexSets.allNames()) {
            IndexSetInfo info = indexSets.lookup(name);
            Pacioli.logln("%s", info.name());
        }
        
        // Include the types from the other program
        Pacioli.logln("TYPES");
        for (String name : types.allNames()) {
            TypeInfo info = types.lookup(name);
            Pacioli.logln("%s", info.name());
        }
        
        // Include the values from the other program
        Pacioli.logln("VALUES");
        for (String name : values.allNames()) {
            ValueInfo info = values.lookup(name);
            Pacioli.logln("%s %s %s",
                    isExternal(info) ? "ext " : "file",
                            info.generic().file,
                    info.name());
        }
        
    }

    // -------------------------------------------------------------------------
    // MVM code generation
    // -------------------------------------------------------------------------
    
    public void includeOther(Progam other) throws Exception {

        // Include the units from the other program
        for (String name: other.units.allNames()) {
            UnitInfo otherInfo = other.units.lookup(name);
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
        for (String name: other.indexSets.allNames()) {
            IndexSetInfo otherInfo = other.indexSets.lookup(name);
            IndexSetInfo info = indexSets.lookup(name);
            if (info == null) {
                indexSets.put(name, otherInfo);
            } else {
                indexSets.put(name, info.includeOther(otherInfo));
            }
        }
        
        // Include the types from the other program
        for (String name : other.types.allNames()) {
            TypeInfo otherInfo = other.types.lookup(name);
            TypeInfo info = types.lookup(name);
            if (info == null) {
                types.put(name, otherInfo);
            } else {
                types.put(name, info.includeOther(otherInfo));
            }
        }
        
        // Include the values from the other program
        for (String name : other.values.allNames()) {
            ValueInfo otherInfo = other.values.lookup(name);
            //if (true || !isExternal(otherInfo)) {
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

        for (String unit : units.allNames()) {
            UnitInfo nfo = units.lookup(unit);
            assert (nfo.definition != null);
            if (nfo.definition != null) {
                nfo.definition.resolve(this);
            }
        }
        for (String type : types.allNames()) {
            TypeInfo nfo = types.lookup(type);
            if (nfo.definition != null) {
                nfo.definition.resolve(this);
            }
        }
        for (String value : values.allNames()) {
            ValueInfo nfo = values.lookup(value);
            if (nfo.definition != null) {
                nfo.definition.resolve(this);
            }
            if (nfo.declaredType != null) {
                nfo.declaredType.resolve(this);
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

        // hack to set the modules
        for (Definition def : program.definitions) {
            def.setModule(new PacioliFile(program.module.getName()));
        }

    }

    // -------------------------------------------------------------------------
    // Type inference
    // -------------------------------------------------------------------------

    private void inferTypes() {

        Set<SymbolInfo> discovered = new HashSet<SymbolInfo>();
        Set<SymbolInfo> finished = new HashSet<SymbolInfo>();

        List<String> names = values.allNames();
        names.sort(new Comparator<String>() {

            @Override
            public int compare(String o1, String o2) {
                return o1.compareTo(o2);
            }
        });
        
        for (String value : names) {
            ValueInfo info = values.lookup(value);
            if (!isExternal(info) && info.getDefinition() != null) {
                inferValueDefinitionType(info, discovered, finished);
                //Pacioli.logln("\n%s :: %s;", info.name(), info.inferredType.toText());
            }
        }
        for (Toplevel toplevel : toplevels) {

            inferUsedTypes(toplevel, discovered, finished);
            Typing typing = toplevel.body.inferTyping2(this);
            //Pacioli.log3("\n%s", typing.toText());
            /*
             * type = typing.solve().simplify(); return type;
             */
        }
    }

    private void inferUsedTypes(Definition definition, Set<SymbolInfo> discovered, Set<SymbolInfo> finished) {
        for (SymbolInfo pre : definition.uses()) {
            if (pre.generic().isGlobal() && pre instanceof ValueInfo) {
                if (!pre.generic().isExternal() && pre.getDefinition() != null) {
                    inferValueDefinitionType(pre, discovered, finished);
                } else {
                    ValueInfo vinfo = (ValueInfo) pre;
                    assert (vinfo.declaredType != null); // should be an exception
                    vinfo.inferredType = vinfo.declaredType.evalType(false);
                }
            }
        }
    }

    private void inferValueDefinitionType(SymbolInfo info, Set<SymbolInfo> discovered, Set<SymbolInfo> finished) {

        if (!finished.contains(info)) {
            if (discovered.contains(info)) {
                Pacioli.warn("Cycle in definition of %s", info.name());
            } else {
                discovered.add(info);
                inferUsedTypes(info.getDefinition(), discovered, finished);

                /*
                 * int oldVerbosity = Pacioli.verbosity; if (info.name().equals("conv_matrix"))
                 * { Pacioli.verbosity = 3; }
                 */

                Pacioli.log3("\n\nInferring type of %s", info.name());
                ValueDefinition def = (ValueDefinition) info.getDefinition();
                Typing typing = def.body.inferTyping2(this);
                try {
                    PacioliType solved = typing.solve();
                    Pacioli.log3("\n\nSolved type of %s is %s", info.name(), solved.pretty());
                    Pacioli.log3("\n\nSimple type of %s is %s", info.name(), solved.simplify().pretty());
                    Pacioli.log3("\n\nGenerl type of %s is %s", info.name(), solved.simplify().generalize().pretty());
                    values.lookup(info.name()).inferredType = solved.simplify().generalize();
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
        names.sort(new Comparator<String>() {

            @Override
            public int compare(String o1, String o2) {
                return o1.compareTo(o2);
            }
        });
        
        for (String value : names) {
            ValueInfo info = values.lookup(value);
            if (!isExternal(info) && info.getDefinition() != null) {
                Pacioli.logln("\n%s :: %s;", info.name(), info.inferredType.pretty());
            }
        }
        for (Toplevel toplevel : toplevels) {

            Typing typing = toplevel.body.inferTyping2(this);
            Pacioli.log3("\n%s", typing.pretty());
            /*
             * type = typing.solve().simplify(); return type;
             */
        }
    }
    
    // -------------------------------------------------------------------------
    // Cleaning MVM files
    // -------------------------------------------------------------------------

    public Boolean cleanMVMFiles(Boolean force) throws Exception {

        File dst = new File(baseName() + ".mvm");
        Boolean srcDirty = false;

        for (String include : includes()) {
            File incl = findIncludeFile(include);
            Progam prog = new Progam(incl, libs);
            prog.loadTill(Phase.parsed);
            srcDirty = srcDirty || prog.cleanMVMFiles(force);
        }

        if (srcDirty || dst.lastModified() < file.lastModified() || force) {
            if (dst.exists()) {
                Pacioli.logln("Deleting MVM file %s %s", dst, includes());
                dst.delete();
            }
            return true;
        } else {
            return srcDirty;
        }

    }

    // -------------------------------------------------------------------------
    // Compilation driver
    // -------------------------------------------------------------------------
    
    public void compileRec(CompilationSettings settings, String target) throws Exception {

        String dstName = baseName() + "." + targetFileExtension(target);
        File dst = new File(dstName);
        
        Pacioli.logln("Loading %s", file);
        loadTill(Phase.typed);
        
        if (dst.lastModified() < file.lastModified() || true) {

            for (String include : includes()) {
                File file = findIncludeFile(include);
                Progam prog = new Progam(file, libs);
                prog.compileRec(settings, target);
            }

            Pacioli.logln("Compiling %s", file);
            BufferedWriter out = new BufferedWriter(new FileWriter(dstName));
            PrintWriter writer = null;
            try {
                writer = new PrintWriter(out);
                generateCode(writer, settings, target);
            } finally {
                if (writer != null) {
                    writer.close();
                }
            }
        }

    }    

    public void generateCode(PrintWriter writer, CompilationSettings settings, String target) throws Exception {

        Boolean externals = true;
        
        List<Definition> unitsToCompile = new ArrayList<Definition>();
        List<UnitInfo> unitsToCompileTmp = new ArrayList<UnitInfo>();
        for (String unit : units.allNames()) {
            UnitInfo info = units.lookup(unit);
            if ((!isExternal(info) || externals) && !info.isAlias()) {
                unitsToCompile.add(info.definition);
                unitsToCompileTmp.add(info);
            }
        }

        unitsToCompileTmp = orderedInfos(unitsToCompileTmp);
        
        List<ValueInfo> valuesToCompile = new ArrayList<ValueInfo>();
        for (String value : values.allNames()) {
            
            ValueInfo info = values.lookup(value);
            if (!isExternal(info) || externals) {
                if (info.definition != null) {
                    valuesToCompile.add(info);
                }
            }
        }
        
        CodeGenerator gen;
        
        if (target.equals("javascript")) {
            gen = new JSGenerator(writer, settings, false);
        } else if (target.equals("matlab")) {
            throw new RuntimeException("Todo: fix matlab compilation");
            // program.compileMatlab(new PrintWriter(outputStream), settings);
        } else if (target.equals("html")) {
            throw new RuntimeException("Todo: fix html compilation");
            // program.compileHtml(new PrintWriter(outputStream), settings);
        } else {
            gen = new MVMGenerator(writer, settings);
        }
        
        for (String indexSet : indexSets.allNames()) {
            IndexSetInfo info = indexSets.lookup(indexSet);
            if (!isExternal(info) || externals) {
                assert (info.definition != null);
                info.definition.accept(gen);
            }
        }
        
        for (UnitInfo info : unitsToCompileTmp) {
            compileUnitMVM(info, writer, target);
            writer.print("\n");
        }

        for (ValueInfo info : valuesToCompile) {
            if (!isExternal(info) || externals) {
            ValueDefinition def = (ValueDefinition) info.getDefinition();
            gen.compileValueDefinition(def, info);
            writer.write("\n");
            }
        }
        
        for (Toplevel def : toplevels) {
            def.accept(gen);
        }
        
    }
    
    // -------------------------------------------------------------------------
    // MVM code generation
    // -------------------------------------------------------------------------

    private void compileUnitMVM(UnitInfo info, PrintWriter writer, String target) {
        if (info.isVector) {
            IndexSetInfo setInfo = (IndexSetInfo) ((UnitVectorDefinition) info.definition).indexSetNode.info;
            List<String> unitTexts = new ArrayList<String>();
            // for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
            for (UnitDecl entry : info.items) {
                DimensionedNumber<TypeBase> number = entry.value.evalUnit();
                // todo: take number.factor() into account!? 
                if (target.equals("mvm")) {
                    unitTexts.add("\"" + entry.key.getName() + "\": " + MVMGenerator.compileUnitToMVM(number.unit()));
                } else if (target.equals("javascript")) {
                    unitTexts.add("'" + entry.key.getName() + "': " + JSGenerator.compileUnitToJS(number.unit()));
                } else {
                    throw new RuntimeException("Unknown target");
                }
            }
            String globalName = setInfo.definition.globalName();
            String name = info.name();
            String args = Utils.intercalate(", ", unitTexts); 
            if (target.equals("mvm")) {
                writer.print(String.format("unitvector \"%s\" \"%s\" list(%s);\n", globalName, name, args));
            } else if (target.equals("javascript")) {
                writer.print(String.format("function compute_%s () { return {units: { %s }}};\n", globalName, name, args));
            } else {
                throw new RuntimeException("Unknown target");
            }
        } else if (info.baseDefinition == null) {
            if (target.equals("mvm")) {
                writer.format("baseunit \"%s\" \"%s\";\n", info.name(), info.symbol);
            } else if (target.equals("javascript")) {
                writer.format("Pacioli.compute_%s = function () { return {symbol: '%s'}};\n", 
                        info.globalName(), info.symbol);
            } else {
                throw new RuntimeException("Unknown target");
            }
        } else {
            DimensionedNumber<TypeBase> number = info.baseDefinition.evalUnit();
            number = number.flat();
            if (target.equals("mvm")) {
                writer.format("unit \"%s\" \"%s\" %s %s;\n", info.name(), info.symbol, number.factor(),
                        MVMGenerator.compileUnitToMVM(number.unit()));
            } else if (target.equals("javascript")) {
                writer.format("Pacioli.compute_%s = function () {\n", info.globalName());
                writer.format("    return {definition: new Pacioli.DimensionedNumber(%s, %s), symbol: '%s'}\n",
                        number.factor(), JSGenerator.compileUnitToJS(number.unit()), info.symbol);   
                writer.format("}\n");
            } else {
                throw new RuntimeException("Unknown target");
            }
        }
    }
    
    // -------------------------------------------------------------------------
    // Matlab code generation
    // -------------------------------------------------------------------------

    public void compileMatlab(CompilationSettings settings) throws Exception {

        BufferedWriter out = new BufferedWriter(new FileWriter(baseName() + ".m"));

        PrintWriter writer = null;
        try {
            writer = new PrintWriter(out);
            for (String include : includes()) {
                writer.format("require %s;\n", include);
            }

            List<Definition> unitsToCompile = new ArrayList<Definition>();
            List<UnitInfo> unitsToCompileTmp = new ArrayList<UnitInfo>();
            for (String unit : units.allNames()) {
                UnitInfo info = units.lookup(unit);
                if (!isExternal(info)) {
                    unitsToCompile.add(info.definition);
                    unitsToCompileTmp.add(info);
                }
            }

            unitsToCompileTmp = orderedInfos(unitsToCompileTmp);
            
            List<ValueInfo> valuesToCompile = new ArrayList<ValueInfo>();
            for (String value : values.allNames()) {
                ValueInfo info = values.lookup(value);
                if (!isExternal(info)) {
                    if (info.definition != null) {
                        valuesToCompile.add(info);
                    }
                }
            }
            
            MVMGenerator gen = new MVMGenerator(writer, settings);

            for (String indexSet : indexSets.allNames()) {
                IndexSetInfo info = indexSets.lookup(indexSet);
                if (!isExternal(info)) {
                    assert (info.definition != null);
                    info.definition.accept(gen);
                }
            }
            
            for (UnitInfo info : unitsToCompileTmp) {
                compileUnitMatlab(info, writer);
            }

            for (ValueInfo info : valuesToCompile) {
                writer.format("store \"%s\" ", info.globalName());
                ValueDefinition def = (ValueDefinition) info.getDefinition();
                def.body.accept(gen);
                writer.write(";\n");
            }

            for (Toplevel def : toplevels) {
                def.accept(gen);
            }

        } finally {
            if (writer != null) {
                writer.close();
            }
        }

    }

    private void compileUnitMatlab(UnitInfo info, PrintWriter writer) {
        if (info.isVector) {
            IndexSetInfo setInfo = (IndexSetInfo) ((UnitVectorDefinition) info.definition).indexSetNode.info;
            List<String> unitTexts = new ArrayList<String>();
            // for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
            for (UnitDecl entry : info.items) {
                DimensionedNumber<TypeBase> number = entry.value.evalUnit();
                unitTexts.add("\"" + entry.key.getName() + "\": " + MVMGenerator.compileUnitToMVM(number.unit()));
            }
            writer.print(String.format("unitvector \"%s\" \"%s\" list(%s);\n",
                    // String.format("index_%s_%s", node.getModule().getName(), node.localName()),
                    setInfo.definition.globalName(),
                    // resolvedIndexSet.getDefinition().globalName(),
                    info.name(), Utils.intercalate(", ", unitTexts)));
        } else if (info.baseDefinition == null) {
            writer.format("baseunit \"%s\" \"%s\";\n", info.name(), info.symbol);
        } else {
            DimensionedNumber<TypeBase> number = info.baseDefinition.evalUnit();
            number = number.flat();
            writer.format("unit \"%s\" \"%s\" %s %s;\n", info.name(), info.symbol, number.factor(),
                    MVMGenerator.compileUnitToMVM(number.unit()));
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

        Definition def = info.getDefinition();
        assert (def != null);

        if (!finished.contains(info)) {

            if (discovered.contains(info)) {
                throw new PacioliException(def.getLocation(), "Cycle in definition " + info.name());
            }
            discovered.add(info);
            for (SymbolInfo other : def.uses()) {
                if (all.contains(other) && other.getDefinition() != null) {
                    insertInfo((T) other, definitions, discovered, finished, all);
                }
            }
            definitions.add(info);
            finished.add(info);
        }
    }

}
