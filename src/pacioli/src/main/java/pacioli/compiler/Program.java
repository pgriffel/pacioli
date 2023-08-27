package pacioli.compiler;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import pacioli.Pacioli;
import pacioli.ast.ExportNode;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.ClassDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.Documentation;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.InstanceDefinition;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.definition.ValueEquation;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.expression.IdentifierNode.Kind;
import pacioli.ast.visitors.TransformConversions;
import pacioli.parser.Parser;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.info.AliasInfo;
import pacioli.symboltable.info.ClassInfo;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.symboltable.info.InfoBuilder;
import pacioli.symboltable.info.InstanceInfo;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.symboltable.info.ScalarBaseInfo;
import pacioli.symboltable.info.Info;
import pacioli.symboltable.info.TypeInfo;
import pacioli.symboltable.info.UnitInfo;
import pacioli.symboltable.info.ValueInfo;
import pacioli.symboltable.info.VectorBaseInfo;
import pacioli.types.Typing;
import pacioli.types.ast.TypeNode;
import pacioli.types.type.TypeObject;

/**
 * A Program corresponds to a Pacioli file.
 * 
 * A Program contains the AST for the Pacioli code in a file. It can be
 * constructed by loading a PacioliFile.
 * 
 * Once a program has been loaded it can be used to resolve identifiers, infer
 * types, etc. The result is a symbol table with info for all identifiers.
 *
 */
public class Program {

    private final PacioliFile file;

    private final ProgramNode ast;

    private Program(PacioliFile file, ProgramNode ast) {
        assert (file != null);
        this.file = file;
        this.ast = ast;
    }

    // -------------------------------------------------------------------------
    // Getters
    // -------------------------------------------------------------------------

    public PacioliFile file() {
        return file;
    }

    public ProgramNode ast() {
        return ast;
    }

    // -------------------------------------------------------------------------
    // Loading
    // -------------------------------------------------------------------------

    public static Program load(PacioliFile file) throws Exception {
        ProgramNode ast = Parser.parseFile(file.fsFile());
        return new Program(file, ast);
    }

    // -------------------------------------------------------------------------
    // Desugaring
    // -------------------------------------------------------------------------

    public Program desugar() throws PacioliException {
        ProgramNode desugared = (ProgramNode) this.ast.desugar();
        return new Program(this.file, desugared);
    }

    // -------------------------------------------------------------------------
    // Building symbol tables
    // -------------------------------------------------------------------------

    public PacioliTable generateInfos() throws Exception {
        PacioliTable infos = fillTables();
        rewriteClasses(infos);
        return infos;
    }

    public PacioliTable analyze(PacioliTable environment) throws Exception {
        PacioliTable infos = this.generateInfos();
        checkForDuplicates(infos, environment);
        resolve(infos, environment);
        liftStatements(infos, environment);
        resolve(infos, environment);
        transformConversions(infos);
        inferTypes(infos, environment);
        return infos;
    }

    // -------------------------------------------------------------------------
    // Rewriting overloads
    // -------------------------------------------------------------------------

    // public void rewriteOverloads(PacioliTable symbolTable) throws
    // PacioliException {
    // Pacioli.trace("Rewriting overloads for file %s", this.file.getModule());
    // programNode.rewriteOverloads();
    // }

    // -------------------------------------------------------------------------
    // Filling symbol tables
    // -------------------------------------------------------------------------

    private PacioliTable fillTables() throws Exception {

        Pacioli.trace("Filling tables for module '%s'", this.file.module());

        // Make a map from identifiers to symbol info builders for the value
        // namespace and for the type namespace.
        Map<String, ValueInfo.Builder> valueBuilders = new HashMap<>();
        Map<String, InfoBuilder<?, ? extends TypeInfo>> typeBuilders = new HashMap<>();

        // First pass, don't do class instances and value definitions
        for (Definition definition : this.ast.definitions()) {

            if (definition instanceof ClassDefinition def) {
                ClassInfo.Builder builder = ClassInfo.builder();
                builder.name(def.name())
                        .file(file)
                        .definition(def)
                        .isGlobal(true)
                        .location(def.location());
                putTypeBuilder(typeBuilders, def.name(), builder);
            } else if (definition instanceof AliasDefinition def) {
                AliasInfo.Builder builder = AliasInfo.builder();
                builder.name(def.name())
                        .definition(def)
                        .file(file)
                        .isGlobal(true)
                        .location(def.location());
                putTypeBuilder(typeBuilders, def.name(), builder);
            } else if (definition instanceof IndexSetDefinition def) {
                IndexSetInfo.Builder builder = IndexSetInfo.builder();
                builder.name(def.name())
                        .file(file)
                        .isGlobal(true)
                        .location(def.location())
                        .definition(def);
                putTypeBuilder(typeBuilders, def.name(), builder);
            } else if (definition instanceof TypeDefinition def) {
                ParametricInfo.Builder builder = ParametricInfo.builder();
                builder.name(def.name())
                        .file(file)
                        .isGlobal(true)
                        .location(def.location())
                        .definition(def);
                putTypeBuilder(typeBuilders, def.name(), builder);
            } else if (definition instanceof UnitDefinition def) {
                ScalarBaseInfo.Builder builder = ScalarBaseInfo.builder();
                builder.name(def.name())
                        .file(file)
                        .isGlobal(true)
                        .location(def.location())
                        .symbol(def.symbol)
                        .definition(def);
                putTypeBuilder(typeBuilders, def.name(), builder);
            } else if (definition instanceof UnitVectorDefinition def) {
                VectorBaseInfo.Builder builder = VectorBaseInfo.builder();
                builder.name(def.name())
                        .file(file)
                        .isGlobal(true)
                        .location(def.location())
                        .items(def.items)
                        .definition(def);
                putTypeBuilder(typeBuilders, def.name(), builder);
            } else if (definition instanceof Declaration def) {
                ValueInfo.Builder builder = ensureValueInfoBuilder(valueBuilders, def.name());
                if (builder.declaredType != null) {
                    throw new PacioliException(def.location(),
                            "Duplicate type declaration for '%s'. It is already defined in %s.",
                            def.name(),
                            builder.declaredType.location().description());
                }
                builder
                        .name(def.name())
                        .location(def.location())
                        .isMonomorphic(false)
                        .file(this.file)
                        .isGlobal(true)
                        .declaredType(def.typeNode)
                        .isPublic(false);
            }
        }

        // Second pass, do class instances and value definitions.
        for (Definition definition : this.ast.definitions()) {
            if (definition instanceof InstanceDefinition def) {
                ClassInfo.Builder builder = (ClassInfo.Builder) typeBuilders.get(def.name());
                if (builder == null) {
                    throw new PacioliException(def.location(), "No class found for instance %s", def.name());
                }
                builder.instance(new InstanceInfo(def, file, genclassInstanceName()));
            } else if (definition instanceof ValueDefinition def) {
                // This overwrites any properties set by the declaration above. This is
                // desirable for the location. We prefer the definition location, otherwise we
                // get the declaration location in messages.
                ValueInfo.Builder builder = ensureValueInfoBuilder(valueBuilders, def.name());
                if (builder.definition != null) {
                    throw new PacioliException(def.location(),
                            "Duplicate definition for '%s'. It is already defined in %s.",
                            def.name(),
                            builder.definition.location().description());
                }
                builder
                        .definition(def)
                        .name(def.name())
                        .file(this.file)
                        .isGlobal(true)
                        .isMonomorphic(false)
                        .isPublic(false)
                        .location(def.location());
            }
        }

        // Set the isPublic flag for exported identifiers
        for (ExportNode exportNode : this.ast.exports()) {

            for (IdentifierNode id : exportNode.identifiers) {

                String name = id.name();

                // Determine the identifier kind. Resolve possible ambiguities
                boolean valueExists = valueBuilders.containsKey(name);
                boolean typeExists = typeBuilders.containsKey(name);
                IdentifierNode.Kind kind = id.determineKind(valueExists, typeExists);

                // Find the proper info and set the documentation
                if (kind.equals(IdentifierNode.Kind.VALUE)) {
                    valueBuilders.get(name).isPublic(true);
                } else {
                    typeBuilders.get(name).isPublic(true);
                }
            }

        }

        // Add documentation
        for (Definition definition : this.ast.definitions()) {

            if (definition instanceof Documentation doc) {

                String name = doc.name();

                // Determine the doc kind. Resolve possible ambiguities
                boolean valueExists = valueBuilders.containsKey(name);
                boolean typeExists = typeBuilders.containsKey(name);
                Kind kind = doc.id.determineKind(valueExists, typeExists);

                // Find the proper info and set the documentation
                String docu = ((StringNode) doc.body).valueString();
                if (kind.equals(IdentifierNode.Kind.VALUE)) {
                    valueBuilders.get(name).documentation(docu);
                } else {
                    typeBuilders.get(name).documentation(docu);
                }
            }
        }

        // Create a new table to fill
        PacioliTable env = PacioliTable.empty();

        // Build the value infos and add them to the table
        for (ValueInfo.Builder builder : valueBuilders.values()) {
            ValueInfo info = builder.build();
            Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding type %s to %s from file %s",
                    info.name(), file.module(), file.fsFile());

            env.addInfo(info);
        }

        // Build the types infos and add them to the table
        for (InfoBuilder<?, ? extends TypeInfo> builder : typeBuilders.values()) {
            TypeInfo info = builder.build();
            Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding value %s to %s from file %s",
                    info.name(), file.module(), file.fsFile());
            env.addInfo(info);
        }

        // Add toplevels
        for (Definition def : this.ast.definitions()) {
            if (def instanceof Toplevel top) {
                env.addToplevel(top);
            }
        }

        return env;
    }

    private ValueInfo.Builder ensureValueInfoBuilder(Map<String, ValueInfo.Builder> valueTable, String name) {
        ValueInfo.Builder builder = valueTable.get(name);
        if (builder == null) {
            builder = ValueInfo.builder();
            valueTable.put(name, builder);
        }
        return builder;
    }

    private void putTypeBuilder(Map<String, InfoBuilder<?, ? extends TypeInfo>> typeBuilders, String name,
            InfoBuilder<?, ? extends TypeInfo> builder) {
        if (typeBuilders.containsKey(name)) {
            throw new PacioliException(builder.definitionLocation().orElse(new Location()),
                    "Duplicate definition for '%s'. It is already defined in %s.",
                    name,
                    typeBuilders.get(name).definitionLocation().orElse(new Location()).description());
        }
        typeBuilders.put(name, builder);
    }
    // -------------------------------------------------------------------------
    // Resolving
    // -------------------------------------------------------------------------

    private void checkForDuplicates(PacioliTable prog, PacioliTable environment) throws Exception {

        for (ValueInfo info : prog.values().allInfos()) {
            if (environment.values().contains(info.name())) {
                throw new PacioliException(info.location(),
                        "Definition of '%s' clashes with import from library '%s'",
                        info.name(), environment.values().lookup(info.name()).generalInfo().file().module());
            }

        }

        for (TypeInfo info : prog.types().allInfos()) {
            if (environment.types().contains(info.name())) {
                throw new PacioliException(info.location(),
                        "Definition of '%s' clashes with import from library '%s'",
                        info.name(), environment.types().lookup(info.name()).generalInfo().file().module());
            }

        }
    }

    // -------------------------------------------------------------------------
    // Resolving
    // -------------------------------------------------------------------------

    /**
     * Sets the info field on relevant AST nodes.
     * 
     * This operations modifies the AST.
     * 
     * @param environment
     * @throws Exception
     */
    private void resolve(PacioliTable prog, PacioliTable environment) throws Exception {

        Pacioli.trace("Resolving module '%s'", this.file.module());

        prog.setParent(environment);

        List<TypeInfo> localTypeInfos = prog.types().allInfos(info -> info.isFromFile(this.file));

        for (TypeInfo nfo : localTypeInfos) {
            if (nfo instanceof IndexSetInfo && nfo.definition().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving index set %s", nfo.globalName());
                nfo.definition().get().resolve(this.file, prog);
            }
        }
        for (TypeInfo nfo : localTypeInfos) {
            if (nfo instanceof UnitInfo && nfo.definition().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving unit %s", nfo.globalName());
                nfo.definition().get().resolve(this.file, prog);
            }
        }
        for (TypeInfo nfo : localTypeInfos) {
            if (nfo instanceof ClassInfo classInfo) {

                // Resolve the class definition itself
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving class %s", nfo.globalName());
                nfo.definition().get().resolve(this.file, prog);

                // Resolve all class instances
                for (InstanceInfo instanceInfo : classInfo.instances()) {
                    for (ValueEquation member : instanceInfo.definition().get().members) {
                        member.body.resolve(this.file, prog);
                    }
                }
            }
        }
        for (TypeInfo nfo : localTypeInfos) {
            if (nfo instanceof ParametricInfo && nfo.definition().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving type %s", nfo.globalName());
                nfo.definition().get().resolve(this.file, prog);
            }
        }

        for (ValueInfo nfo : prog.values().allInfos(info -> info.isFromFile(this.file))) {
            if (nfo.definition().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving value or function %s",
                        nfo.globalName());
                nfo.definition().get().resolve(this.file, prog);
            }
            if (nfo.declaredType().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving declaration %s", nfo.globalName());
                nfo.declaredType().get().resolve(this.file, prog);
            }

        }
        for (Toplevel definition : prog.toplevels()) {
            Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving toplevel %s", definition.name());
            definition.resolve(this.file, prog);
        }

        prog.popParent();
    }

    // -------------------------------------------------------------------------
    // Rewriting classes
    // -------------------------------------------------------------------------

    /**
     * Desugars the type classes. Creates types and functions for the type class
     * and instance definitions. These are added to the symbol table directly
     * and not to the program's AST.
     * 
     * The program must have been resolved.
     * 
     * @param pacioliTable
     * @throws Exception
     */
    private void rewriteClasses(PacioliTable env) throws Exception {

        Pacioli.trace("Rewriting classes in in module '%s'", this.file.module());

        for (TypeInfo typeInfo : env.types().allInfos()) {
            if (typeInfo instanceof ClassInfo classInfo) {
                rewriteClass(env, classInfo);
            }
        }
    }

    /**
     * Creates definitions for the class and its instances and adds them to the
     * symbol table (not to the parsed program node).
     * 
     * @param classInfo
     */
    private void rewriteClass(PacioliTable env, ClassInfo classInfo) {

        Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n\nRewriting class %s in module '%s'",
                classInfo.globalName(), this.file.module());

        // Rewrite the class definition itself if it is from this program
        if (classInfo.isFromFile(this.file)) {

            // Create class constructor
            ParametricInfo typeInfo = classInfo.generateDictionaryDefinition();
            ValueInfo constructorInfo = classInfo.generateConstructorDefinition();

            Declaration constructorDeclaration = new Declaration(
                    classInfo.location(),
                    constructorInfo.definition().get().id,
                    constructorInfo.declaredType().get(),
                    true);

            Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n\nGenerated definitions for class %s:",
                    classInfo.name());

            Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", typeInfo.definition().get().pretty());
            Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", constructorDeclaration.pretty());
            Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", constructorInfo.definition().get().pretty());

            env.addInfo(constructorInfo);
            env.addInfo(typeInfo);

            for (ValueInfo memberInfo : classInfo.generateMemberDefinitions()) {
                Declaration memberDeclaration = new Declaration(
                        memberInfo.location(),
                        new IdentifierNode(memberInfo.name(), memberInfo.location()),
                        memberInfo.declaredType().get(),
                        true);
                Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", memberDeclaration.pretty());
                if (memberInfo.definition().isPresent()) {
                    Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", memberInfo.definition().get().pretty());
                }
                env.addInfo(memberInfo);
            }

        }

        Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n\nGenerated definitions for class %s instances:",
                classInfo.name());

        for (ValueInfo info : classInfo.generateInstanceDefinitions()) {
            Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", info.definition().get().pretty());
            env.addInfo(info);
        }
    }

    // -------------------------------------------------------------------------
    // Lifting statements
    // -------------------------------------------------------------------------

    private void liftStatements(PacioliTable program, PacioliTable env) throws Exception {

        Pacioli.trace("Lifting value statements in module '%s'", this.file.module());

        for (ValueInfo info : program.values().allInfos()) {
            if (info.definition().isPresent() && info.isFromFile(this.file)) {
                ValueDefinition definition = info.definition().get();
                definition.body = definition.body.liftStatements(this.file, program, env, ExpressionNode.class);

            }
        }
    }

    // -------------------------------------------------------------------------
    // Transforming conversions
    // -------------------------------------------------------------------------

    private void transformConversions(PacioliTable pacioliTable) {

        Pacioli.trace("Transforming conversions in module '%s'", this.file.module());

        for (ValueInfo info : pacioliTable.values().allInfos()) {
            if (info.definition().isPresent() && info.isFromFile(this.file)) {
                ValueDefinition definition = info.definition().get();
                ExpressionNode newBody = new TransformConversions().expAccept(definition.body);
                definition.body = newBody;

            }
        }
    }

    // -------------------------------------------------------------------------
    // Type inference
    // -------------------------------------------------------------------------

    private void inferTypes(PacioliTable prog, PacioliTable env) {

        Pacioli.trace("Infering types in module '%s'", this.file.module());

        // values.parent = environment.values();
        // typess.parent = environment.types();

        prog.setParent(env);
        PacioliTable environment = prog;

        Set<Info> discovered = new HashSet<Info>();
        Set<Info> finished = new HashSet<Info>();

        List<String> names = environment.values().allNames();
        Collections.sort(names);

        for (String value : names) {
            ValueInfo info = environment.values().lookup(value);

            if (info.isFromFile(this.file) && info.definition().isPresent()) {

                Pacioli.logIf(Pacioli.Options.showTypeInference, "Infering type of %s", value);

                inferValueDefinitionType(info, discovered, finished, Pacioli.Options.showTypeInference, environment);

                Pacioli.logIf(Pacioli.Options.showTypeInference, "%s :: %s;", info.name(),
                        info.inferredType().get().pretty());
            }

            Optional<TypeNode> declared = info.declaredType();

            if (info.isFromFile(this.file) && declared.isPresent() && info.inferredType().isPresent()) {

                TypeObject declaredType = declared.get().evalType().instantiate()
                        .reduce(i -> i.isFromFile(this.file));
                TypeObject inferredType = info.localType().instantiate();

                Pacioli.logIf(Pacioli.Options.showTypeInferenceDetails,
                        "Checking inferred type\n  %s\nagainst declared type\n  %s",
                        inferredType.pretty(), declaredType.pretty());

                if (!declaredType.isInstanceOf(inferredType)) {
                    throw new RuntimeException("Type error",
                            new PacioliException(info.location(),
                                    String.format(
                                            "Declared type\n\n  %s\n\ndoes not specialize the inferred type\n\n  %s\n",
                                            declaredType.unfresh().pretty(),
                                            inferredType.unfresh().pretty())));
                }
            }

        }
        int i = 0;
        for (Toplevel toplevel : environment.toplevels()) {

            inferUsedTypes(toplevel, discovered, finished, true, environment);

            Pacioli.logIf(Pacioli.Options.showTypeInference, "Inferring typing of toplevel %s", i);

            Typing typing = toplevel.body.inferTyping(environment, this.file);
            Pacioli.logIf(Pacioli.Options.showTypeInferenceDetails, "Typing of toplevel %s is %s", i, typing.pretty());

            toplevel.type = typing.solve(!this.file.isLibrary()).simplify();
            Pacioli.logIf(Pacioli.Options.showTypeInferenceDetails, "Type of toplevel %s is %s", i,
                    toplevel.type.pretty());

            i++;
        }

    }

    private void inferUsedTypes(Definition definition, Set<Info> discovered, Set<Info> finished,
            Boolean verbose, PacioliTable env) {
        for (Info pre : definition.uses()) {
            if (pre.isGlobal() && pre instanceof ValueInfo) {
                if (pre.isFromFile(this.file) && pre.definition().isPresent()) {
                    inferValueDefinitionType((ValueInfo) pre, discovered, finished, verbose, env);
                } else {
                    ValueInfo vinfo = (ValueInfo) pre;
                    if (!vinfo.declaredType().isPresent() && !vinfo.name().equals("nmode")) {
                        throw new RuntimeException("Type error",
                                new PacioliException(pre.location(), "No type declared for %s", pre.name()));
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
     * @param env
     */
    private void inferValueDefinitionType(ValueInfo info, Set<Info> discovered, Set<Info> finished,
            Boolean verbose, PacioliTable env) {

        if (!finished.contains(info)) {
            if (discovered.contains(info)) {
                // Pacioli.warn("Cycle in definition of %s", info.name());
            } else {
                discovered.add(info);
                inferUsedTypes(info.definition().get(), discovered, finished, verbose, env);

                ValueDefinition def = info.definition().get();

                Pacioli.logIf(Pacioli.Options.showTypeInference, "Infering typing of %s", info.name());

                Typing typing = def.body.inferTyping(env, this.file);

                Pacioli.logIf(Pacioli.Options.showTypeInferenceDetails, "Inferred typing of %s is %s", info.name(),
                        typing.pretty());

                try {
                    TypeObject solved = typing.solve(Pacioli.Options.showTypeInferenceDetails).unfresh();
                    if (verbose) {
                        Pacioli.logIf(Pacioli.Options.showTypeInferenceDetails, "\nSolved type of %s is %s",
                                info.name(),
                                solved.pretty());
                        Pacioli.logIf(Pacioli.Options.showTypeInferenceDetails, "\nSimple type of %s is %s",
                                info.name(),
                                solved.simplify().pretty());
                        Pacioli.logIf(Pacioli.Options.showTypeInferenceDetails, "\nGenerl type of %s is %s",
                                info.name(),
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

    // -------------------------------------------------------------------------
    // Fresh class instance names
    // -------------------------------------------------------------------------

    private static int classInstanceCounter = 0;

    private String genclassInstanceName() {
        return String.format("_inst_%s", classInstanceCounter++);
    }
}
