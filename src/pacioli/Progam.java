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
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.expression.ExpressionNode;
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
import pacioli.visitors.MVMGenerator;
import pacioli.visitors.PrintVisitor;
import pacioli.visitors.ResolveVisitor;
import uom.DimensionedNumber;

public class Progam extends AbstractPrintable {

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
    // Adding symbol table entries
    // -------------------------------------------------------------------------

    public IndexSetInfo ensureIndexSetRecord(String name) {
        if (!indexSets.contains(name)) {
            indexSets.put(name, new IndexSetInfo());
        }
        return indexSets.lookup(name);
    }

    public UnitInfo ensureUnitRecord(String name) {
        if (!units.contains(name)) {
            units.put(name, new UnitInfo());
        }
        return units.lookup(name);
    }

    public TypeInfo ensureTypeRecord(String name) {
        if (!types.contains(name)) {
            types.put(name, new TypeInfo());
        }
        return types.lookup(name);
    }

    public ValueInfo ensureValueRecord(String name) {
        if (!values.contains(name)) {
            values.put(name, new ValueInfo());
        }
        return values.lookup(name);
    }

    public void addToplevel(Toplevel toplevel) {
        toplevels.add(toplevel);
    }

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    String baseName() {
        String name = file.getAbsolutePath();
        assert (name.endsWith(".pacioli"));
        return name.substring(0, name.length() - 8);
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

    public void load() throws Exception {
        program = Parser.parseFile(this.file.getAbsolutePath());

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
            prog.load();
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

    public void compileMVMRec(CompilationSettings settings) throws Exception {

        File dst = new File(baseName() + ".mvm");

        if (dst.lastModified() < file.lastModified()) {

            for (String include : includes()) {
                File file = findIncludeFile(include);
                // Pacioli.logln("Parsing include file: %s", file);
                Progam prog = new Progam(file, libs);
                prog.load();
                prog.compileMVMRec(settings);
            }

            Pacioli.logln("Compiling %s", file);
            desugar();
            //desugarStatements();
            
             
            //out.format("declare %s :: %s;\n", pacioli.Utils.intercalate(",", names), node.toText());
            
            // resolve();
            try {
                resolve();
            } finally {
                //Pacioli.printSymbolTable(values, "value");
            }
            // desugarStatements();
            inferTypes();
            //desugarStatements();
            //Pacioli.logln("Desugared:\n%s\nEND DESUGAR", toText());
            compileMVM(settings);
        }

    }

    // -------------------------------------------------------------------------
    // Resolving
    // -------------------------------------------------------------------------

    public void resolve() throws Exception {

        for (String type : ResolveVisitor.builtinTypes) {
            TypeInfo info = ensureTypeRecord(type);
            GenericInfo generic = new GenericInfo(type, program.module.name, null, false, true);
            info.generic = generic;
        }

        // Fill symbol tables for the default include files
        for (String include : PacioliFile.defaultIncludes) {
            File file = findIncludeFile(include);
            if (!file.equals(this.file)) {
                // Pacioli.logln("Loading default include %s", include);
                Progam prog = new Progam(file, libs);
                prog.load();
                prog.desugar();
                // GenericInfo info = new GenericInfo(prog.program.module.name, file, false,
                // true);
                for (Definition def : prog.program.definitions) {
                    GenericInfo info = new GenericInfo(def.localName(), prog.program.module.name, file, false, true);
                    def.addToProgr(this, info);
                }
            }
        }

        // Fill symbol tables for the included files
        for (String include : includes()) {
            File file = findIncludeFile(include);
            Progam prog = new Progam(file, libs);
            prog.load();
            prog.desugar();
            // GenericInfo info = new GenericInfo(prog.program.module.name, file, false,
            // true);
            for (Definition def : prog.program.definitions) {
                GenericInfo info = new GenericInfo(def.localName(), prog.program.module.name, file, false, true);
                def.addToProgr(this, info);
            }
        }

        // Fill symbol tables for this file
        // GenericInfo info = new GenericInfo(program.module.name, file, true, true);
        for (Definition def : program.definitions) {
            GenericInfo info = new GenericInfo(def.localName(), program.module.name, file, true, true);
            def.addToProgr(this, info);
        }
        // Pacioli.logln("Resolving %s", file);

        // Resolve everything FOUT!!!!
        for (String unit : units.allNames()) {

            UnitInfo nfo = units.lookup(unit);
            // if (nfo.generic.local && nfo.definition != null) {
            assert (nfo.definition != null);
            if (nfo.definition != null) {
                nfo.definition.resolve(this);
            }
        }
        for (String type : types.allNames()) {

            TypeInfo nfo = types.lookup(type);
            // if (nfo.generic.local && nfo.definition != null) {
            // assert(nfo.definition != null);
            // Primitive types have no definition
            if (nfo.definition != null) {
                nfo.definition.resolve(this);
            }
        }
        for (String value : values.allNames()) {
            ValueInfo nfo = values.lookup(value);
            // if (nfo.generic.local && nfo.definition != null) {
            // Primitive values have no definition
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
        // program.resolve2(this);
        /*
         * for (Definition def: program.definitions) { //def.addToProgr(this, info); if
         * (def instanceof ValueDefinition) { ((ValueDefinition)
         * def).body.resolve2(this); } if (def instanceof Toplevel) { ((Toplevel)
         * def).body.resolve2(this); } }
         */
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

    public void checkTypes() throws Exception {
        desugar();
        // resolve();
        try {
            resolve();
        } finally {
            // Pacioli.printSymbolTable(values, "value");
        }
        // desugarStatements();
        inferTypes();
    }

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
            if (info.generic.local && info.getDefinition() != null) {
                inferValueDefinitionType(info, discovered, finished);
                Pacioli.logln("\n%s :: %s;", info.name(), info.inferredType.toText());
            }
        }
        for (Toplevel toplevel : toplevels) {

            inferUsedTypes(toplevel, discovered, finished);
            Typing typing = toplevel.body.inferTyping2(this);
            Pacioli.log3("\n%s", typing.toText());
            /*
             * type = typing.solve().simplify(); return type;
             */
        }
    }

    private void inferUsedTypes(Definition definition, Set<SymbolInfo> discovered, Set<SymbolInfo> finished) {
        for (SymbolInfo pre : definition.uses()) {
            if (pre.generic().global && pre instanceof ValueInfo) {
                if (pre.generic().local && pre.getDefinition() != null) {
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
                    Pacioli.log3("\n\nSolved type of %s is %s", info.name(), solved.toText());
                    Pacioli.log3("\n\nSimple type of %s is %s", info.name(), solved.simplify().toText());
                    Pacioli.log3("\n\nGenerl type of %s is %s", info.name(), solved.simplify().generalize().toText());
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

    // -------------------------------------------------------------------------
    // MVM code generation
    // -------------------------------------------------------------------------

    public void compileMVM(CompilationSettings settings) throws Exception {

        BufferedWriter out = new BufferedWriter(new FileWriter(baseName() + ".mvm"));

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
                if (info.generic.local) {
                    unitsToCompile.add(info.definition);
                    unitsToCompileTmp.add(info);
                }
            }

            unitsToCompileTmp = orderedInfos(unitsToCompileTmp);
            
            List<ValueInfo> valuesToCompile = new ArrayList<ValueInfo>();
            for (String value : values.allNames()) {
                ValueInfo info = values.lookup(value);
                if (info.generic.local) {
                    if (info.definition != null) {
                        valuesToCompile.add(info);
                    }
                }
            }
            
            MVMGenerator gen = new MVMGenerator(writer, settings);

            for (String indexSet : indexSets.allNames()) {
                IndexSetInfo info = indexSets.lookup(indexSet);
                if (info.generic.local) {
                    assert (info.definition != null);
                    info.definition.accept(gen);
                }
            }
            
            for (UnitInfo info : unitsToCompileTmp) {
                compileUnitMVM(info, writer);
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

    private void compileUnitMVM(UnitInfo info, PrintWriter writer) {
        if (info.isVector) {
            IndexSetInfo setInfo = (IndexSetInfo) ((UnitVectorDefinition) info.definition).indexSetNode.info;
            List<String> unitTexts = new ArrayList<String>();
            // for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
            for (UnitDecl entry : info.items) {
                DimensionedNumber number = entry.value.evalUnit();
                unitTexts.add("\"" + entry.key.getName() + "\": " + Utils.compileUnitToMVM(number.unit()));
            }
            writer.print(String.format("unitvector \"%s\" \"%s\" list(%s);\n",
                    // String.format("index_%s_%s", node.getModule().getName(), node.localName()),
                    setInfo.definition.globalName(),
                    // resolvedIndexSet.getDefinition().globalName(),
                    info.name(), Utils.intercalate(", ", unitTexts)));
        } else if (info.baseDefinition == null) {
            writer.format("baseunit \"%s\" \"%s\";\n", info.name(), info.symbol);
        } else {
            DimensionedNumber number = info.baseDefinition.evalUnit();
            number = number.flat();
            writer.format("unit \"%s\" \"%s\" %s %s;\n", info.name(), info.symbol, number.factor(),
                    Utils.compileUnitToMVM(number.unit()));
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
                if (info.generic.local) {
                    unitsToCompile.add(info.definition);
                    unitsToCompileTmp.add(info);
                }
            }

            unitsToCompileTmp = orderedInfos(unitsToCompileTmp);
            
            List<ValueInfo> valuesToCompile = new ArrayList<ValueInfo>();
            for (String value : values.allNames()) {
                ValueInfo info = values.lookup(value);
                if (info.generic.local) {
                    if (info.definition != null) {
                        valuesToCompile.add(info);
                    }
                }
            }
            
            MVMGenerator gen = new MVMGenerator(writer, settings);

            for (String indexSet : indexSets.allNames()) {
                IndexSetInfo info = indexSets.lookup(indexSet);
                if (info.generic.local) {
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
                DimensionedNumber number = entry.value.evalUnit();
                unitTexts.add("\"" + entry.key.getName() + "\": " + Utils.compileUnitToMVM(number.unit()));
            }
            writer.print(String.format("unitvector \"%s\" \"%s\" list(%s);\n",
                    // String.format("index_%s_%s", node.getModule().getName(), node.localName()),
                    setInfo.definition.globalName(),
                    // resolvedIndexSet.getDefinition().globalName(),
                    info.name(), Utils.intercalate(", ", unitTexts)));
        } else if (info.baseDefinition == null) {
            writer.format("baseunit \"%s\" \"%s\";\n", info.name(), info.symbol);
        } else {
            DimensionedNumber number = info.baseDefinition.evalUnit();
            number = number.flat();
            writer.format("unit \"%s\" \"%s\" %s %s;\n", info.name(), info.symbol, number.factor(),
                    Utils.compileUnitToMVM(number.unit()));
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

    @Override
    public void printText(PrintWriter out) {
     
        PrintWriter writer = null;
        try {
            writer = new PrintWriter(out);
            PrintVisitor visitor = new PrintVisitor(writer);
            //this.accept(visitor);
            for (Definition def : program.definitions) {
                def.accept(visitor);
                writer.println();
            }
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
    }
}

/*
 * public void compileHtml(PrintWriter out, CompilationSettings settings) throws
 * PacioliException { out.println("<!DOCTYPE HTML>\n" + "\n" +
 * "<!-- HTML and Javascript code generated from Pacioli module " +
 * main.getName() + " -->\n" + "\n" + "<html lang=\"en\">\n" + "  <head>\n" +
 * "    <title>" + main.getName() + "</title>\n" +
 * "    <meta charset=\"utf-8\">\n" +
 * "    <link rel=\"stylesheet\" type=\"text/css\" href=\"pacioli.css\">\n" +
 * "  </head>\n" + "\n" + "  <body onload=\"onLoad();\">\n" + "\n" +
 * "    <div id=\"main\">\n" + "    </div>\n" + "\n" +
 * "    <script type=\"text/javascript\" src=\"numeric-1.2.6.js\"></script>\n" +
 * "    <script type=\"text/javascript\" src=\"pacioli-0.2.3.js\"></script>\n" +
 * "\n" + "    <script type=\"text/javascript\">\n" + "\n"); compileJS(out,
 * settings); out.println("function onLoad() {"); for (Toplevel definition :
 * toplevelExpressions) { out.print("Pacioli.print(new Pacioli.Box(");
 * out.print(definition.type.compileToJS()); out.print(", ");
 * out.print(definition.compileToJS(false)); out.print("))"); out.println(""); }
 * out.println("}"); out.println("\n" + "\n" + "    </script>\n" + "\n" +
 * "  </body>\n" + "\n" + "</hmtl>\n"); }
 */