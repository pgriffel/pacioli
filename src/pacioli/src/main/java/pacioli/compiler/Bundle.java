package pacioli.compiler;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import pacioli.Pacioli;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.visitors.CodeGenerator;
import pacioli.ast.visitors.JSGenerator;
import pacioli.ast.visitors.MVMGenerator;
import pacioli.ast.visitors.MatlabGenerator;
import pacioli.ast.visitors.PythonGenerator;
import pacioli.compiler.CompilationSettings.Target;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.symboltable.info.ClassInfo;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.symboltable.info.Info;
import pacioli.symboltable.info.TypeInfo;
import pacioli.symboltable.info.UnitInfo;
import pacioli.symboltable.info.ValueInfo;
import pacioli.transpilers.JSTranspiler;
import pacioli.transpilers.MATLABTranspiler;
import pacioli.transpilers.MVMTranspiler;
import pacioli.transpilers.PythonTranspiler;
import pacioli.types.type.TypeObject;

/**
 * A bundle aggregates the definitions from all Pacioli files in a project. It
 * keeps symboltables for values and types collected from all project files.
 */
public class Bundle {

    public static final List<String> PRIMITIVE_TYPES = List.of(
            "Tuple",
            "List",
            "Index",
            "Boole",
            "Void",
            "Ref",
            "String",
            "Report",
            "Identifier",
            "Maybe",
            "Array",
            "File");

    private final PacioliFile file;
    private final List<File> libs;
    private final PacioliTable environment = PacioliTable.empty();

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    private Bundle(PacioliFile file, List<File> libs) {
        this.file = file;
        this.libs = libs;
    }

    public PacioliTable visibleInfos(List<String> importedModules, List<String> includedModules) {
        return PacioliTable.initial(
                visibleValueInfos(importedModules, includedModules),
                visibleTypeInfos(importedModules, includedModules));
    }

    private SymbolTable<ValueInfo> visibleValueInfos(
            Collection<String> importedModules,
            Collection<String> includedModules) {
        SymbolTable<ValueInfo> table = new SymbolTable<ValueInfo>();
        environment.values().allInfos().forEach(info -> {
            if (info.isPublic() && importedModules.contains(info.generalInfo().module())) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Importing %s", info.name());
                table.put(info.name(), info);
            }
            if (includedModules.contains(info.generalInfo().module())) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Including %s", info.name());
                table.put(info.name(), info);
            }
            if (!(info.isPublic() && importedModules.contains(info.generalInfo().module())) &&
                    !includedModules.contains(info.generalInfo().module())) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Skipping %s", info.name());
            }
        });
        return table;
    }

    private SymbolTable<TypeInfo> visibleTypeInfos(
            Collection<String> importedModules,
            Collection<String> includedModules) {
        SymbolTable<TypeInfo> table = new SymbolTable<TypeInfo>();
        environment.types().allInfos().forEach(info -> {
            String infoModule = info.generalInfo().module();
            if ((info.isPublic() || info instanceof UnitInfo) && importedModules.contains(infoModule)
                    || includedModules.contains(infoModule)) {
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
        for (String type : PRIMITIVE_TYPES) {
            // GeneralInfo info = new GeneralInfo(type, file, true, new Location());
            // environment.types.put(type, new ParametricInfo(info));
            environment.types().put(type, new ParametricInfo(type, file, true, true, new Location()));
        }
        ValueInfo nmodeInfo = ValueInfo.builder()
                .name("nmode")
                .file(file)
                .isGlobal(true)
                .isMonomorphic(false)
                .location(new Location())
                .isPublic(true)
                .build();
        environment.values().put("nmode", nmodeInfo);
    }

    static Bundle empty(PacioliFile file, List<File> libs) {
        return new Bundle(file, libs);
    }

    void load(PacioliTable other, boolean includeToplevels) throws Exception {
        // See duplicate code in Progam
        other.values().localInfos().forEach(info -> {
            Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding value %s",
                    info.globalName());
            if (environment.values().contains(info.globalName())) {
                throw new PacioliException(info.location(), "Duplicate name: %s, %s %s",
                        info.globalName(),
                        environment.values().lookup(info.globalName()).location().equals(info.location()),
                        environment.values().lookup(info.globalName()).location().description());
            }
            environment.values().put(info.globalName(), info);

        });
        other.types().localInfos().forEach(info -> {
            Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding type %s %s",
                    info.globalName(), info.name());
            if (environment.types().contains(info.globalName())) {
                throw new PacioliException(info.location(), "Duplicate name: %s %s", info.globalName(),
                        environment.types().lookup(info.globalName()).location().description());
            }
            environment.types().put(info.globalName(), info);

        });
        if (includeToplevels) {
            other.toplevels().forEach(topLevel -> {
                environment.toplevels().add(topLevel);
            });
        }
    }

    public void generateCode(PrintWriter writer, CompilationSettings settings) {

        Pacioli.trace("Generating code for %s", this.file.module());

        // Declare a compiler (symbol table visitor) instance
        Printer printer = new Printer(writer);
        SymbolTableVisitor compiler;
        CodeGenerator gen;

        switch (settings.target()) {
            case JS:
                gen = new JSGenerator(new Printer(writer), settings, false);
                compiler = new JSTranspiler(printer, settings);
                break;
            case MATLAB:
                gen = new MatlabGenerator(printer, settings);
                compiler = new MATLABTranspiler(printer, settings);

                MATLABTranspiler.writePrelude(printer);

                break;
            case MVM:
                gen = new MVMGenerator(printer, settings);
                compiler = new MVMTranspiler(printer, settings);

                break;
            case PYTHON:

                PythonTranspiler.writePrelude(printer);

                gen = new PythonGenerator(printer, settings);
                compiler = new PythonTranspiler(printer, settings);
                break;
            default:
                throw new RuntimeException("Unknown target");
        }

        // Lists of infos we will compile below. Functions are always compiled first.
        List<ValueInfo> functionsToCompile = new ArrayList<>();
        List<Info> infosToCompile = new ArrayList<>();

        // Collect the index sets and the units from the type table
        for (TypeInfo info : environment.types().allInfos()) {

            if (info instanceof IndexSetInfo) {
                assert (info.definition().isPresent());
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
        for (ValueInfo info : environment.values().allInfos()) {
            if (info.definition().isPresent()) {
                if (info.definition().get().isFunction()) {
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
        for (Info info : infosToCompile) {
            info.accept(compiler);
        }

        // Generate code for the toplevels
        for (Toplevel def : environment.toplevels()) {
            if (def.location().file().equals(file.fsFile())) {
                if (settings.target() == Target.MVM ||
                        settings.target() == Target.MATLAB) {
                    printer.newline();
                    def.accept(gen);
                    printer.newline();
                }
                if (settings.target() == Target.PYTHON) {
                    printer.newline();
                    printer.write("glbl_base_print(");
                    def.accept(gen);
                    printer.write(")");
                    printer.newline();
                }
            }
        }

    }

    public void printCode(boolean rewriteTypes, boolean includePrivate, boolean showDocs) throws PacioliException {

        List<String> names = environment.values().allNames();
        Collections.sort(names);

        for (String value : names) {
            ValueInfo info = environment.values().lookup(value);
            boolean fromProgram = info.generalInfo().module().equals(file.module());
            if (fromProgram && info.definition().isPresent() && (true || info.isUserDefined())) {
                // Pacioli.println("%s =", info.name());
                Pacioli.println("%s;\n", info.definition().get().pretty());
            }
        }

        Pacioli.println("");
        for (Toplevel toplevel : environment.toplevels()) {
            Pacioli.println("%s;\n", toplevel.body.pretty());
        }
    }

    public void printTypes(boolean rewriteTypes, boolean includePrivate, boolean showDocs) throws PacioliException {

        List<String> names = environment.values().allNames();
        Collections.sort(names);

        for (String value : names) {
            ValueInfo info = environment.values().lookup(value);
            boolean fromProgram = info.generalInfo().module().equals(file.module());
            if ((includePrivate || info.isPublic()) && fromProgram && info.definition().isPresent()
                    && info.isUserDefined()) {
                TypeObject type = rewriteTypes ? info.localType() : info.publicType();
                String text = Pacioli.Options.printTypesAsString ? type.toString() : type.pretty();
                Pacioli.println("%s :: %s", info.name(), text);
                if (showDocs) {
                    if (info.generalInfo().documentation().isPresent()) {
                        Pacioli.println("\n    %s\n", info.generalInfo().documentation().get());
                    }
                }
            }
        }

        Integer count = 1;
        Pacioli.println("");
        for (Toplevel toplevel : environment.toplevels()) {
            TypeObject type = toplevel.type;
            Pacioli.println("Toplevel %s :: %s", count++, type.unfresh().pretty());
        }
    }

    /**
     * Generates a html page with documentation for the bundle's module.
     * 
     * @param includes A filter. Only code in the includes is included.
     * @param version  A description of the module's version that is added to the
     *                 output
     * @throws PacioliException
     * @throws IOException
     */
    public void printAPI(List<File> includes, String version) throws PacioliException, IOException {

        PrintWriter writer = new PrintWriter(System.out);
        DocumentationGenerator generator = new DocumentationGenerator(writer, file.moduleName(), version);

        for (String name : environment.values().allNames()) {
            ValueInfo info = environment.values().lookup(name);
            if (info.isPublic()
                    && includes.contains(info.location().file())
                    && info.definition().isPresent()
                    && info.isUserDefined()) {
                ExpressionNode body = info.definition().get().body;
                if (body instanceof LambdaNode) {
                    LambdaNode lambda = (LambdaNode) body;
                    generator.addFunction(info.name(), lambda.arguments, info.publicType(),
                            info.generalInfo().documentation().orElse(""));
                } else {
                    generator.addValue(info.name(), info.publicType(), info.generalInfo().documentation().orElse(""));
                }
            }
        }

        for (String name : environment.types().allNames()) {
            TypeInfo info = environment.types().lookup(name);
            if (includes.contains(info.location().file())
                    && info.definition().isPresent() && info.isPublic()) {
                if (info instanceof ParametricInfo def) {
                    generator.addType(info.name(),
                            def.definition().get().context.pretty(),
                            def.definition().get().lhs.pretty(),
                            def.definition().get().rhs.pretty(),
                            info.generalInfo().documentation().orElse("n/a"));
                }
                if (info instanceof IndexSetInfo def) {
                    generator.addIndexSet(info.name(), info.generalInfo().documentation().orElse("n/a"));
                }
            }
        }

        generator.generate();
        writer.close();
    }

    public void printSymbolTables() {

        List<String> allTypeNames = environment.types().allNames();
        allTypeNames.sort((a, b) -> a.compareToIgnoreCase(b));

        // Print the parametric types
        Pacioli.println("\n%-25s %-25s", "Type", "Module");
        for (String name : allTypeNames) {
            TypeInfo typeInfo = environment.types().lookup(name);
            if (typeInfo instanceof ParametricInfo info) {
                Pacioli.println("%-25s %-25s", info.name(), info.generalInfo().module());
            }
        }

        // Print the type classes
        Pacioli.println("\n%-25s %-25s %-25s", "Class", "Module", "Instances");
        for (String name : allTypeNames) {
            TypeInfo typeInfo = environment.types().lookup(name);
            if (typeInfo instanceof ClassInfo info) {
                Pacioli.println("%-25s %-25s %-25s", info.name(), info.generalInfo().module(),
                        info.instances().size());
            }
        }

        // Print the values
        Pacioli.println("\n%-25s %-25s %-10s %-10s %-10s %-10s %-10s %-10s %-30s",
                "Value",
                "Module",
                "Scope",
                "Visibility",
                "Overloaded",
                "Def",
                "Declared",
                "Inferred",
                "Type");

        List<String> allNames = environment.values().allNames();
        allNames.sort((a, b) -> a.compareToIgnoreCase(b));

        for (String name : allNames) {

            ValueInfo info = environment.values().lookup(name);
            Optional<? extends Definition> def = info.definition();

            Pacioli.println("%-25s %-25s %-10s %-10s %-10s %-10s %-10s %-10s %-30s",
                    info.name(),
                    info.generalInfo().module(),
                    info.isGlobal() ? "global" : "local",
                    info.isPublic() ? "public" : "private",
                    info.typeClass().isPresent() ? "overload" : "single",
                    def.isPresent() ? "has def" : "no def",
                    info.declaredType().isPresent() ? "decl" : "no decl",
                    info.inferredType().isPresent() ? "inferred" : "no type",
                    info.inferredType().map(x -> x.pretty()).orElse("N/A"));
        }

    }

    // -------------------------------------------------------------------------
    // Topological Order of Definitions
    // -------------------------------------------------------------------------

    static <T extends Info> List<T> orderedInfos(Collection<T> definitions) throws PacioliException {

        Set<T> discovered = new HashSet<T>();
        Set<T> finished = new HashSet<T>();
        Set<String> names = definitions.stream().map(def -> def.globalName()).collect(Collectors.toSet());

        List<T> orderedDefinitions = new ArrayList<T>();
        for (T definition : definitions) {
            insertInfo(definition, orderedDefinitions, discovered, finished, names);
        }
        return orderedDefinitions;
    }

    static <T extends Info> void insertInfo(T info, List<T> definitions, Set<T> discovered, Set<T> finished,
            Collection<String> all) throws PacioliException {

        assert (info.definition().isPresent());
        Definition def = info.definition().get();

        if (!finished.contains(info)) {

            if (discovered.contains(info)) {
                throw new PacioliException(def.location(), "Cycle in definition " + info.name());
            }
            discovered.add(info);
            // Pacioli.log("uses %s %s %s", info.globalName(), info.getClass(), def.uses());
            for (Info other : def.uses()) {

                if ((all.contains(other.globalName())) && other.definition().isPresent()) {
                    insertInfo((T) other, definitions, discovered, finished, all);
                }
            }
            definitions.add(info);
            finished.add(info);
        }
    }

}
