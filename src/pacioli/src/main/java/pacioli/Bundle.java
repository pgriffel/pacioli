package pacioli;

import java.io.File;
import java.io.PrintWriter;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import pacioli.CompilationSettings.Target;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.expression.LambdaNode;
import pacioli.compilers.JSCompiler;
import pacioli.compilers.MATLABCompiler;
import pacioli.compilers.MVMCompiler;
import pacioli.compilers.PythonCompiler;
import pacioli.symboltable.GenericInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.TypeInfo;
import pacioli.symboltable.TypeSymbolInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.types.PacioliType;
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
    public final PacioliFile file;
    private final List<File> libs;

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

    public SymbolTable<ValueInfo> programValueTable(Collection<String> importedModules,
            Collection<String> includedModules) {
        SymbolTable<ValueInfo> table = new SymbolTable<ValueInfo>();
        valueTable.allInfos().forEach(info -> {
            if (info.isPublic() && importedModules.contains(info.generic().getModule())) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Importing %s", info.name());
                table.put(info.name(), info);
            }
            if (includedModules.contains(info.generic().getModule())) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Including %s", info.name());
                table.put(info.name(), info);
            }
            if (!(info.isPublic() && importedModules.contains(info.generic().getModule())) &&
                    !includedModules.contains(info.generic().getModule())) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Skipping %s", info.name());
            }
        });
        return table;
    }

    public SymbolTable<TypeSymbolInfo> programTypeTable(Collection<String> importedModules,
            Collection<String> includedModules) {
        SymbolTable<TypeSymbolInfo> table = new SymbolTable<TypeSymbolInfo>();
        typeTable.allInfos().forEach(info -> {
            String infoModule = info.generic().getModule();
            if (importedModules.contains(infoModule) || includedModules.contains(infoModule)) {
                Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding type %s %s", info.globalName(),
                        info.name());
                table.put(info.name(), info);
            } else {
                Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Skipping type %s %s (%s || %s fails %s)",
                        info.globalName(), info.name(),
                        importedModules.contains(infoModule), includedModules.contains(infoModule), infoModule);
            }
        });
        return table;
    }

    public void addPrimitiveTypes() {
        PacioliFile file = PacioliFile.requireLibrary("base", libs);
        for (String type : ResolveVisitor.builtinTypes) {
            GenericInfo generic = new GenericInfo(type, file, true, new Location());
            typeTable.put(type, new TypeInfo(generic));
        }
        GenericInfo generic = new GenericInfo("nmode", file, true, new Location());
        ValueInfo nmodeInfo = new ValueInfo(generic, false, true);
        valueTable.put("nmode", nmodeInfo);
    }

    static Bundle empty(PacioliFile file, List<File> libs) {
        return new Bundle(file, libs);
    }

    void load(Progam other, boolean includeToplevels) throws Exception {
        // See duplicate code in Progam
        other.values.allInfos().forEach(info -> {
            if (!other.isExternal(info)) {
                Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding value %s",
                        info.globalName());
                if (valueTable.contains(info.globalName())) {
                    throw new PacioliException(info.getLocation(), "Duplicate name: %s, %s %s",
                            info.globalName(),
                            valueTable.lookup(info.globalName()).getLocation().equals(info.getLocation()),
                            valueTable.lookup(info.globalName()).getLocation().description());
                }
                valueTable.put(info.globalName(), info);
            }
        });
        other.typess.allInfos().forEach(info -> {
            if (!other.isExternal(info)) {
                Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding type %s %s",
                        info.globalName(), info.name());
                if (typeTable.contains(info.globalName())) {
                    throw new PacioliException(info.getLocation(), "Duplicate name: %s %s", info.globalName(),
                            typeTable.lookup(info.globalName()).getLocation().description());
                }
                typeTable.put(info.globalName(), info);
            }
        });
        if (includeToplevels) {
            other.toplevels.forEach(topLevel -> {
                this.toplevels.add(topLevel);
            });
        }
    }

    public void generateCode(PrintWriter writer, CompilationSettings settings) {

        Pacioli.trace("Generating code for %s", this.file.getModule());

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

        // Lists of infos we will compile below. Functions are always compiled first.
        List<ValueInfo> functionsToCompile = new ArrayList<>();
        List<SymbolInfo> infosToCompile = new ArrayList<>();

        // Collect the index sets and the units from the type table
        for (TypeSymbolInfo info : typeTable.allInfos()) {

            if (info instanceof IndexSetInfo) {
                assert (info.getDefinition().isPresent());
                infosToCompile.add(info);
            }

            if (info instanceof UnitInfo) {
                UnitInfo unitInfo = (UnitInfo) info;
                if (!unitInfo.isAlias()) {
                    infosToCompile.add(unitInfo);
                }
            }
        }

        // Collect all functions and values from the value table
        for (ValueInfo info : valueTable.allInfos()) {
            if (info.getDefinition().isPresent()) {
                if (info.getDefinition().get().isFunction()) {
                    functionsToCompile.add(info);
                } else {
                    infosToCompile.add(info);
                }
            }
        }

        // Generate code for the functions
        for (ValueInfo info : functionsToCompile) {
            info.accept(compiler);
        }

        // Generate code for the rest. This is done in the proper order
        infosToCompile = orderedInfos(infosToCompile);
        for (SymbolInfo info : infosToCompile) {
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
                }
            }
        }

    }

    void printTypes(boolean rewriteTypes, boolean includePrivate, boolean showDocs) throws PacioliException {

        List<String> names = valueTable.allNames();
        Collections.sort(names);

        for (String value : names) {
            ValueInfo info = valueTable.lookup(value);
            boolean fromProgram = info.generic().getModule().equals(file.getModule());
            if ((includePrivate || info.isPublic()) && fromProgram && info.getDefinition().isPresent()
                    && info.isUserDefined()) {
                Pacioli.println("%s ::", info.name());
                if (rewriteTypes) {
                    Pacioli.print(" %s;", info.inferredType().deval().pretty());
                } else {
                    Pacioli.print(" %s;", info.getType().deval().pretty());
                }
                if (showDocs) {
                    if (info.getDocu().isPresent()) {
                        Pacioli.println("\n    %s\n", info.getDocu().get());
                    } else {
                        Pacioli.print("\n");
                    }
                }
            }
        }

        Integer count = 1;
        Pacioli.print("\n");
        for (Toplevel toplevel : toplevels) {
            PacioliType type = toplevel.type;
            Pacioli.println("Toplevel %s ::", count++);
            Pacioli.print(" %s", type.unfresh().deval().pretty());
        }
    }

    /**
     * Generates a html page with documentation for the bundle's module.
     * 
     * @param includes A filter. Only code in the includes is included.
     * @param version  A description of the module's version that is added to the
     *                 output
     * @throws PacioliException
     */
    void printAPI(List<File> includes, String version) throws PacioliException {

        // Get all infos from the value table and sort them alphbetically
        List<ValueInfo> infos = new ArrayList<>();
        valueTable.allNames().forEach(name -> infos.add(valueTable.lookup(name)));
        Collections.sort(infos, (first, second) -> first.name().compareTo(second.name()));

        // Split the infos to show into values and functions
        List<ValueInfo> valuesToShow = new ArrayList<>();
        List<ValueInfo> functionToShow = new ArrayList<>();
        for (ValueInfo info : infos) {
            if (info.isPublic()
                    && includes.contains(info.getLocation().getFile())
                    && info.getDefinition().isPresent()
                    && info.isUserDefined()) {
                if (info.getDefinition().get().body instanceof LambdaNode) {
                    functionToShow.add(info);
                } else {
                    valuesToShow.add(info);
                }
            }
        }

        // Generate the general HTML headers
        Pacioli.println("<!DOCTYPE html>");
        Pacioli.println("<html>");
        Pacioli.println("<head>");
        Pacioli.println("<title>%s</title>", file.module);
        Pacioli.println("</head>");
        Pacioli.println("<body>");

        // Generate a general section about the module
        Pacioli.println("<h1>Module %s</h1>", file.module);
        Pacioli.println("<p>Interface for the %s module</p>", file.module);
        Pacioli.println("<small>Version %s, %s</small>", version, ZonedDateTime.now());

        // Print the types for the values and the function in a synopsis section
        Pacioli.println("<h2>Synopsis</h2>");
        Pacioli.println("<pre>");
        for (ValueInfo info : valuesToShow) {
            Pacioli.println("%s ::", info.name());
            Pacioli.print(" %s;", info.getType().deval().pretty());
        }
        if (valuesToShow.size() > 0) {
            Pacioli.print("\n");
        }
        for (ValueInfo info : functionToShow) {
            Pacioli.println("%s ::", info.name());
            Pacioli.print(" %s;", info.getType().deval().pretty());
        }
        Pacioli.println("</pre>");

        // Print details for the values
        Pacioli.println("<h2>Values</h2>");
        if (valuesToShow.size() == 0) {
            Pacioli.println("n/a");
        } else {
            Pacioli.println("<dl>");
            for (ValueInfo info : valuesToShow) {
                Pacioli.println("<dt><code>%s</code></dt>", info.name());
                Pacioli.println("<dd>");
                Pacioli.println("<pre>::");
                Pacioli.print(" %s</pre>", info.getType().deval().pretty());
                for (String part : info.getDocuParts()) {
                    Pacioli.println("\n<p>%s</p>\n", part);
                }
                Pacioli.println("</dd>");
            }
            Pacioli.println("</dl>");
        }

        // Print details for the functions
        Pacioli.println("<h2>Functions</h2>");
        Pacioli.println("<dl>");
        for (ValueInfo info : functionToShow) {
            LambdaNode body = (LambdaNode) info.getDefinition().get().body;
            String args = String.format("(%s)", body.argsString(""));
            Pacioli.println("<dt><code>%s%s</code></dt>", info.name(), args);
            Pacioli.println("<dd>");
            Pacioli.println("<pre>::");
            Pacioli.print(" %s</pre>", info.getType().deval().pretty());
            for (String part : info.getDocuParts()) {
                Pacioli.println("\n<p>%s</p>\n", part);
            }
            Pacioli.println("</dd>");

        }
        Pacioli.println("</dl>");

        // Finish the html
        Pacioli.println("</body>");
        Pacioli.println("</html>");
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
            // Pacioli.log("uses %s %s %s", info.globalName(), info.getClass(), def.uses());
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
