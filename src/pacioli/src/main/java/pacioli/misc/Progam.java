package pacioli.misc;

import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import pacioli.Pacioli;
import pacioli.Pacioli.Options;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.ClassDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.Documentation;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.InstanceDefinition;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeAssertion;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.visitors.LiftStatements;
import pacioli.ast.visitors.TransformConversions;
import pacioli.parser.Parser;
import pacioli.symboltable.AliasInfo;
import pacioli.symboltable.ClassInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.ParametricInfo;
import pacioli.symboltable.ScalarBaseInfo;
import pacioli.symboltable.TypeSymbolInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.symboltable.VectorBaseInfo;
import pacioli.types.TypeObject;
import pacioli.types.Typing;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeNode;

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

    public static Progam load(PacioliFile file) throws Exception {
        Progam program = new Progam(file);
        program.loadTill();
        return program;
    }

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    Boolean isExternal(SymbolInfo info) {
        return !info.generalInfo().getFile().equals(getFile());
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
     * Loads the program from file.
     * 
     * @throws Exception
     */
    private void loadTill() throws Exception {

        Pacioli.logIf(Pacioli.Options.showFileLoads, "Loading file %s", file.getFile());

        program = Parser.parseFile(this.file.getFile());

        desugar();
        fillTables();
    }

    public void loadRest(PacioliTable environment) throws Exception {

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

        Map<String, ClassInfo.Builder> classTable = new HashMap<>();
        Map<String, ValueInfo.Builder> valueTable = new HashMap<>();

        // First pass, don't add class instances and ...
        for (Definition def : program.definitions) {
            Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding %s to %s from file %s", def.getName(),
                    file.getModule(), file.getFile());
            if (def instanceof ClassDefinition d) {
                ClassInfo.Builder classDef = ClassInfo.builder().file(file).definition(d);
                classTable.put(def.getName(), classDef);
            } else if (def instanceof AliasDefinition alias) {
                AliasInfo info = new AliasInfo(def.getName(), file, def.getLocation());
                info.definition = alias;
                addInfo(info);
            } else if (def instanceof IndexSetDefinition indexSet) {
                IndexSetInfo info = new IndexSetInfo(def.getName(), file, true, def.getLocation());
                info.setDefinition(indexSet);
                addInfo(info);
            } else if (def instanceof Toplevel top) {
                addToplevel(top);
            } else if (def instanceof TypeDefinition typeDef) {
                ParametricInfo info = new ParametricInfo(def.getName(), file, true, def.getLocation());
                info.typeAST = typeDef.rhs;
                info.setDefinition(typeDef);
                addInfo(info);
            } else if (def instanceof UnitDefinition unitDef) {
                ScalarBaseInfo info = new ScalarBaseInfo(def.getName(), file, true, def.getLocation());
                info.setDefinition(unitDef);
                info.symbol = unitDef.symbol;
                addInfo(info);
            } else if (def instanceof UnitVectorDefinition vecDef) {
                VectorBaseInfo info = new VectorBaseInfo(def.getName(), file, true, def.getLocation());
                info.setDefinition(vecDef);
                info.setItems(vecDef.items);
                addInfo(info);
            } else if (def instanceof Declaration decl) {
                ValueInfo.Builder builder = ensureValueInfoBuilder(valueTable,
                        def.getName());
                if (builder.declaredType != null) {
                    throw new PacioliException(def.getLocation(), "Duplicate type declaration for %s",
                            def.getName());
                }
                builder
                        .name(def.getName())
                        .file(file)
                        .isGlobal(true)
                        .declaredType(decl.typeNode)
                        .isPublic(decl.isPublic);
            } else if (def instanceof Documentation doc) {
                ValueInfo.Builder builder = ensureValueInfoBuilder(valueTable,
                        def.getName());
                if (builder.docu != null) {
                    throw new PacioliException(def.getLocation(), "Duplicate docu for %s", def.getName());
                }
                builder
                        .name(def.getName())
                        .file(file)
                        .isGlobal(true)
                        .docu(((StringNode) doc.body).valueString());
            } else if (def instanceof ValueDefinition val) {
                ValueInfo.Builder builder = ensureValueInfoBuilder(valueTable,
                        def.getName());
                builder
                        .definition(val)
                        .name(def.getName())
                        .file(file)
                        .isGlobal(true)
                        .isMonomorphic(false)
                        .location(def.getLocation());
            }
        }

        // Second pass, add class instances and ...
        for (Definition def : program.definitions) {
            Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding %s to %s from file %s", def.getName(),
                    file.getModule(), file.getFile());
            if (def instanceof InstanceDefinition inst) {
                ClassInfo.Builder builder = classTable.get(def.getName());
                if (builder == null) {
                    throw new PacioliException(def.getLocation(), "No class found for instance %s", def.getName());
                }
                builder.instance(inst);
            }
        }

        for (ClassInfo.Builder builder : classTable.values()) {
            ClassInfo info = builder.build();
            // Pacioli.log("\n%s", info.definition.pretty());
            // Pacioli.log("with %s instances", info.instances.size());
            // for (InstanceDefinition def : info.instances) {
            // Pacioli.log("\n%s", def.pretty());
            // }
            addInfo(info);
            for (TypeAssertion member : info.definition.members) {
                for (IdentifierNode id : member.ids) {

                    ValueInfo valueInfo = new ValueInfo(id.getName(), file, true, false,
                            member.getLocation(), true);
                    SchemaNode schema = new SchemaNode(info.definition.definedClass.getLocation(),
                            info.definition.definedClass.contextNodes, member.body.type);
                    valueInfo.setDeclaredType(schema);
                    Pacioli.log("YO %s :: %s", id.getName(), schema.pretty());
                    addInfo(valueInfo);
                }
            }
        }

        for (ValueInfo.Builder builder : valueTable.values()) {
            ValueInfo info = builder.build();
            addInfo(info);
        }
    }

    private ValueInfo.Builder ensureValueInfoBuilder(Map<String, ValueInfo.Builder> valueTable, String name) {
        ValueInfo.Builder builder = valueTable.get(name);
        if (builder == null) {
            builder = ValueInfo.builder();
            valueTable.put(name, builder);
        }
        return builder;
    }

    private void addInfo(TypeSymbolInfo info) throws PacioliException {
        String name = info.name();
        if (typess.contains(name)) {
            throw new PacioliException(info.getLocation(), "Duplicate type set name: " + name);
        } else {
            typess.put(name, info);
        }
    }

    private void addInfo(ValueInfo info) throws PacioliException {
        String name = info.name();
        if (values.contains(name)) {
            throw new PacioliException(info.getLocation(), "Duplicate name: " + name);
        } else {
            values.put(name, info);
        }
    }

    private void addToplevel(Toplevel toplevel) {
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
            if (nfo instanceof IndexSetInfo) {
                boolean fromProgram = nfo.generalInfo().getModule().equals(file.getModule());
                if (fromProgram && nfo.getDefinition().isPresent()) {
                    Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving index set %s", nfo.globalName());
                    nfo.getDefinition().get().resolve(file, env);
                }
            }
        }
        for (TypeSymbolInfo nfo : typess.allInfos()) {
            boolean fromProgram = nfo.generalInfo().getModule().equals(file.getModule());
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
            if (nfo instanceof ParametricInfo) {
                boolean fromProgram = nfo.generalInfo().getModule().equals(file.getModule());
                if (fromProgram && nfo.getDefinition().isPresent()) {
                    Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving type %s", nfo.globalName());
                    nfo.getDefinition().get().resolve(file, env);
                }
            }
        }

        for (ValueInfo nfo : values.allInfos()) {
            boolean fromProgram = nfo.generalInfo().getModule().equals(file.getModule());
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
            Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving toplevel %s", definition.getName());
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

                TypeObject declaredType = declared.get().evalType().instantiate()
                        .reduce(i -> i.generalInfo().getModule().equals(file.getModule()));
                TypeObject inferredType = info.inferredType().instantiate();

                Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails,
                        "Checking inferred type\n  %s\nagainst declared type\n  %s",
                        inferredType.pretty(), declaredType.pretty());

                if (!declaredType.isInstanceOf(inferredType)) {
                    throw new RuntimeException("Type error",
                            new PacioliException(info.getLocation(),
                                    String.format(
                                            "Declared type\n\n  %s\n\ndoes not specialize the inferred type\n\n  %s\n",
                                            declaredType.unfresh().pretty(),
                                            inferredType.unfresh().pretty())));
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
                    if (!vinfo.getDeclaredType().isPresent() && !vinfo.name().equals("nmode")) {
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
     *                   Determines whether log calls are made or not, independently
     *                   from any global log setting. Allows the caller to filter
     *                   logging per definition.
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
                    TypeObject solved = typing.solve(Pacioli.Options.logTypeInferenceDetails).unfresh();
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

    public void printTypes() throws PacioliException {

        List<String> names = values.allNames();
        Collections.sort(names);

        for (String value : names) {
            ValueInfo info = values.lookup(value);
            if (!isExternal(info) && info.getDefinition().isPresent()) {
                Pacioli.println("\n%s :: %s;", info.name(), info.inferredType().pretty());
            }
        }
        Integer count = 1;
        for (Toplevel toplevel : toplevels) {
            TypeObject type = toplevel.type;
            Pacioli.println("\nToplevel %s :: %s", count++, type.unfresh().pretty());
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

    public void printSymbolTable(SymbolTable<? extends SymbolInfo> table, String header) {
        Pacioli.println("Begin %s table", header);
        List<? extends SymbolInfo> infos = table.allInfos();
        infos.sort((SymbolInfo x, SymbolInfo y) -> x.name().compareTo(y.name()));
        for (SymbolInfo info : infos) {
            Optional<? extends Definition> def = info.getDefinition();
            Pacioli.println("%-25s %-25s %-10s %-10s %-50s",
                    info.name(),
                    info.generalInfo().getModule(),
                    // info.isExternal(info) ? " " : "local",
                    info.isGlobal() ? "glb" : "lcl",
                    info.generalInfo().getFile() == null ? "" : isExternal(info),
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
