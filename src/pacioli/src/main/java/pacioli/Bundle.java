package pacioli;

import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import pacioli.CompilationSettings.Target;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.Toplevel;
import pacioli.compilers.JSCompiler;
import pacioli.compilers.MATLABCompiler;
import pacioli.compilers.MVMCompiler;
import pacioli.compilers.PythonCompiler;
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
import pacioli.visitors.CodeGenerator;
import pacioli.visitors.JSGenerator;
import pacioli.visitors.MVMGenerator;
import pacioli.visitors.MatlabGenerator;
import pacioli.visitors.PythonGenerator;
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
public class Bundle {

    // Added during construction
    public final Map<String, PacioliTable> libTables = new HashMap<String, PacioliTable>();
    public final PacioliFile file;
    private final List<File> libs;

    // Added as first step of loading
    // ProgramNode program;

    // Fill during loading
    SymbolTable<ValueInfo> valueTable = new SymbolTable<ValueInfo>();
    SymbolTable<TypeSymbolInfo> typeTable = new SymbolTable<TypeSymbolInfo>();
    public List<Toplevel> toplevels = new ArrayList<Toplevel>();

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    private Bundle(PacioliFile file, List<File> libs) {
        assert (file != null);
        this.file = file;
        this.libs = libs;
    }

    public PacioliTable selectTable(Collection<String> libNames) {
        PacioliTable table = PacioliTable.empty();
        libNames.forEach(name -> {
            table.addAll(libTables.get(name));
        });
        return table;
    }

    public void addPrimitiveTypes() {
        PacioliFile file = PacioliFile.requireLibrary("base", libs);
        for (String type : ResolveVisitor.builtinTypes) {
            // Fixme: null arg for the location. Maybe declare them in a base.pacioli?

            GenericInfo generic = new GenericInfo(type, file, "base_base", true, new Location(),
                    file.isSystemLibrary("base"));
            typeTable.put(type, new TypeInfo(generic));
        }
    }

    static Bundle empty(PacioliFile file, List<File> libs) {
        return new Bundle(file, libs);
    }

    void load(Progam other) throws Exception {
        // See duplicate code in Progam
        valueTable.addAll(other.values);
        typeTable.addAll(other.typess);
        other.toplevels.forEach(topLevel -> {
            this.toplevels.add(topLevel);
        });
    }

    public void generateCode(PrintWriter writer, CompilationSettings settings) {

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
        for (TypeSymbolInfo info : typeTable.allInfos()) {
            if (info instanceof IndexSetInfo) {
                assert (info.getDefinition().isPresent());
                info.accept(compiler);
            }
        }

        // printer.format("\npacioliUnitContext = Pacioli.PacioliContext.si()\n\n");

        // Find all units to compile
        List<UnitInfo> unitsToCompile = new ArrayList<UnitInfo>();
        for (TypeSymbolInfo info : typeTable.allInfos()) {
            if (info instanceof UnitInfo) {
                UnitInfo unitInfo = (UnitInfo) info;
                if (!unitInfo.isAlias()) {
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
        for (ValueInfo info : valueTable.allInfos()) {
            if (externals) {
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
            if (def.getLocation().getFile().equals(file.getFile())) {
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
            }}
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
                if ((all.contains(other.globalName())) && other.getDefinition().isPresent()) {
                    insertInfo((T) other, definitions, discovered, finished, all);
                }
            }
            definitions.add(info);
            finished.add(info);
        }
    }

}
