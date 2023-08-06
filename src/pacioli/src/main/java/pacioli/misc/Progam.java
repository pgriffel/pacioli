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
import pacioli.ast.definition.ValueEquation;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.LetTupleBindingNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.visitors.TransformConversions;
import pacioli.parser.Parser;
import pacioli.symboltable.AliasInfo;
import pacioli.symboltable.ClassInfo;
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.InstanceInfo;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.ParametricInfo;
import pacioli.symboltable.ScalarBaseInfo;
import pacioli.symboltable.TypeSymbolInfo;
import pacioli.symboltable.UnitInfo;
import pacioli.symboltable.ValueInfo;
import pacioli.symboltable.VectorBaseInfo;
import pacioli.types.TypeContext;
import pacioli.types.TypeObject;
import pacioli.types.Typing;
import pacioli.types.ast.ContextNode;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeIdentifierNode;
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

    public final PacioliFile file;

    private static int classInstanceCounter = 0;

    private String genclassInstanceName() {
        return String.format("_inst_%s", classInstanceCounter++);
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public Progam(PacioliFile file) {
        assert (file != null);
        this.file = file;
    }

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    public String getModule() {
        return this.file.getModule();
    }

    public File getFile() {
        return this.file.getFile();
    }

    public Boolean isLibrary() {
        return this.file.isLibrary();
    }

    // -------------------------------------------------------------------------
    // Loading
    // -------------------------------------------------------------------------

    public static PacioliTable load(PacioliFile file) throws Exception {
        Progam program = new Progam(file);
        return program.loadTill();
    }

    /**
     * Loads the program from file.
     * 
     * @return
     * 
     * @throws Exception
     */
    private PacioliTable loadTill() throws Exception {

        Pacioli.logIf(Pacioli.Options.showFileLoads, "Loading file %s", this.file.getFile());

        ProgramNode programNode = Parser.parseFile(this.file.getFile());

        programNode = desugar(programNode);
        PacioliTable env = fillTables(programNode);
        rewriteClasses(env);

        return env;

    }

    public void loadRest(PacioliTable prog, PacioliTable environment) throws Exception {

        // Note that method liftValueInfoStatements requires resolved
        // definitions, but produces non resolved definitions.
        resolve(prog, environment);
        liftStatements(prog, environment);
        resolve(prog, environment); // hier env.parent ?
        transformConversions(prog);
        inferTypes(prog, environment);
        // rewriteOverloads(environment);
    }

    // -------------------------------------------------------------------------
    // Desugaring
    // -------------------------------------------------------------------------

    public ProgramNode desugar(ProgramNode programNode) throws PacioliException {
        Pacioli.trace("Desugaring %s", this.file.getModule());
        return (ProgramNode) programNode.desugar();
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

    private PacioliTable fillTables(ProgramNode programNode) throws Exception {

        Pacioli.trace("Filling tables for %s", this.file.getModule());

        PacioliTable env = PacioliTable.initial();

        Map<String, ClassInfo.Builder> classTable = new HashMap<>();
        Map<String, ValueInfo.Builder> valueTable = new HashMap<>();

        // First pass, don't do class instances and value definitions
        for (Definition def : programNode.definitions) {

            Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding %s to %s from file %s", def.getName(),
                    file.getModule(), file.getFile());

            if (def instanceof ClassDefinition d) {
                ClassInfo.Builder classDef = ClassInfo.builder().file(file).definition(d);
                classTable.put(def.getName(), classDef);
            } else if (def instanceof AliasDefinition alias) {
                AliasInfo info = new AliasInfo(def.getName(), file, def.getLocation());
                info.definition = alias;
                env.addInfo(info);
            } else if (def instanceof IndexSetDefinition indexSet) {
                IndexSetInfo info = new IndexSetInfo(def.getName(), file, true, def.getLocation());
                info.setDefinition(indexSet);
                env.addInfo(info);
            } else if (def instanceof Toplevel top) {
                env.addToplevel(top);
            } else if (def instanceof TypeDefinition typeDef) {
                ParametricInfo info = new ParametricInfo(def.getName(), file, true, def.getLocation());
                info.typeAST = typeDef.rhs;
                info.setDefinition(typeDef);
                env.addInfo(info);
            } else if (def instanceof UnitDefinition unitDef) {
                ScalarBaseInfo info = new ScalarBaseInfo(def.getName(), file, true, def.getLocation());
                info.setDefinition(unitDef);
                info.symbol = unitDef.symbol;
                env.addInfo(info);
            } else if (def instanceof UnitVectorDefinition vecDef) {
                VectorBaseInfo info = new VectorBaseInfo(def.getName(), file, true, def.getLocation());
                info.setDefinition(vecDef);
                info.setItems(vecDef.items);
                env.addInfo(info);
            } else if (def instanceof Declaration decl) {
                ValueInfo.Builder builder = ensureValueInfoBuilder(valueTable, def.getName());
                if (builder.declaredType != null) {
                    throw new PacioliException(def.getLocation(), "Duplicate type declaration for %s",
                            def.getName());
                }
                builder
                        .name(def.getName())
                        .location(def.getLocation())
                        .isMonomorphic(false)
                        .file(this.file)
                        .isGlobal(true)
                        .declaredType(decl.typeNode)
                        .isPublic(decl.isPublic);
            } else if (def instanceof Documentation doc) {
                ValueInfo.Builder builder = ensureValueInfoBuilder(valueTable, def.getName());
                if (builder.docu != null) {
                    throw new PacioliException(def.getLocation(), "Duplicate docu for %s", def.getName());
                }
                builder
                        .name(def.getName())
                        .location(def.getLocation())
                        .isMonomorphic(false)
                        .file(this.file)
                        .isGlobal(true)
                        .docu(((StringNode) doc.body).valueString());
            }
        }

        // Second pass, do class instances and value definitions.
        for (Definition def : programNode.definitions) {
            Pacioli.logIf(Pacioli.Options.showSymbolTableAdditions, "Adding %s to %s from file %s", def.getName(),
                    file.getModule(), file.getFile());
            if (def instanceof InstanceDefinition inst) {
                ClassInfo.Builder builder = classTable.get(def.getName());
                if (builder == null) {
                    throw new PacioliException(def.getLocation(), "No class found for instance %s", def.getName());
                }
                builder.instance(new InstanceInfo(inst, file, genclassInstanceName()));
            } else if (def instanceof ValueDefinition val) {

                ValueInfo.Builder builder = ensureValueInfoBuilder(valueTable, def.getName());

                // Don't overwrite the public/private flag from the declaration above.
                if (builder.isPublic == null) {
                    builder.isPublic(false);
                }

                // This overwrites any properties set by the declaration or documentation above.
                // This is desirable for the location. We prefer the definition location,
                // otherwise we get the declaration or documentation location in messages.
                builder
                        .definition(val)
                        .name(def.getName())
                        .file(this.file)
                        .isGlobal(true)
                        .isMonomorphic(false)
                        .location(def.getLocation());
            }
        }

        for (ClassInfo.Builder builder : classTable.values()) {
            env.addInfo(builder.build());
        }

        for (ValueInfo.Builder builder : valueTable.values()) {
            env.addInfo(builder.build());
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

    // private void addInfo(TypeSymbolInfo info) throws PacioliException {
    // String name = info.name();
    // if (typess.contains(name)) {
    // throw new PacioliException(info.getLocation(), "Duplicate type set name: " +
    // name);
    // } else {
    // typess.put(name, info);
    // }
    // }

    // private void addInfo(ValueInfo info) throws PacioliException {
    // String name = info.name();
    // if (values.contains(name)) {
    // throw new PacioliException(info.getLocation(),
    // "Duplicate name: " + name + values.lookup(name).getLocation().description());
    // } else {
    // values.put(name, info);
    // }
    // }

    // private void addToplevel(Toplevel toplevel) {
    // toplevels.add(toplevel);
    // }

    // -------------------------------------------------------------------------
    // Resolving
    // -------------------------------------------------------------------------

    /**
     * Sets the info field on relevant AST nodes.
     * 
     * This operations modifies the AST.
     * 
     * @param symbolTable
     * @throws Exception
     */
    public void resolve(PacioliTable prog, PacioliTable symbolTable) throws Exception {

        Pacioli.trace("Resolving %s", this.file.getModule());

        // if (values.parent != null) {
        // throw new RuntimeException(String.format("Expected null parent in %s",
        // this.file));
        // }
        // if (typess.parent != null) {
        // throw new RuntimeException(String.format("Expected null parent in %s",
        // this.file));
        // }

        // freshTable.values.parent = symbolTable.values();
        // freshTable.typess.parent = symbolTable.types();

        // PacioliTable env = new PacioliTable(values, typess);

        PacioliTable env = prog; // .pushNew();

        env.setParent(symbolTable);

        List<TypeSymbolInfo> localTypeInfos = env.types.allInfos(info -> info.isFromFile(this.file));

        for (TypeSymbolInfo nfo : localTypeInfos) {
            if (nfo instanceof IndexSetInfo && nfo.getDefinition().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving index set %s", nfo.globalName());
                nfo.getDefinition().get().resolve(this.file, env);
            }
        }
        for (TypeSymbolInfo nfo : localTypeInfos) {
            if (nfo instanceof UnitInfo && nfo.getDefinition().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving unit %s", nfo.globalName());
                nfo.getDefinition().get().resolve(this.file, env);
            }
        }
        for (TypeSymbolInfo nfo : localTypeInfos) {
            if (nfo instanceof ClassInfo classInfo) {

                // Resolve the class definition itself
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving class %s", nfo.globalName());
                nfo.getDefinition().get().resolve(this.file, env);

                // Resolve all class instances
                for (InstanceInfo instanceInfo : classInfo.instances) {
                    for (ValueEquation member : instanceInfo.definition.members) {
                        member.body.resolve(this.file, env);
                    }
                }
            }
        }
        for (TypeSymbolInfo nfo : localTypeInfos) {
            if (nfo instanceof ParametricInfo && nfo.getDefinition().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving type %s", nfo.globalName());
                nfo.getDefinition().get().resolve(this.file, env);
            }
        }

        for (ValueInfo nfo : env.values.allInfos(info -> info.isFromFile(this.file))) {
            if (nfo.getDefinition().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving value or function %s",
                        nfo.globalName());
                nfo.getDefinition().get().resolve(this.file, env);
            }
            if (nfo.getDeclaredType().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving declaration %s", nfo.globalName());
                nfo.getDeclaredType().get().resolve(this.file, env);
            }

        }
        for (Toplevel definition : prog.toplevels) {
            Pacioli.logIf(Pacioli.Options.showResolvingDetails, "Resolving toplevel %s", definition.getName());
            definition.resolve(this.file, env);
        }
        // values.parent = null;
        // typess.parent = null;
        env.popParent();
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
    public void rewriteClasses(PacioliTable env) throws Exception {

        Pacioli.trace("Rewriting classes in file %s", this.file.getModule());

        for (TypeSymbolInfo typeInfo : env.types.allInfos()) {
            if (typeInfo instanceof ClassInfo classInfo) {
                rewriteClass(classInfo);
            }
        }
    }

    /**
     * Creates definitions for the class and its instances and adds them to the
     * symbol table (not to the parsed program node).
     * 
     * @param classInfo
     */
    private PacioliTable rewriteClass(ClassInfo classInfo) {

        Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n\nRewriting class %s in module %s",
                classInfo.globalName(), this.file.getModule());

        PacioliTable env = PacioliTable.initial();

        // Get some class properties
        ClassDefinition classDefinition = classInfo.definition;
        Location classLocation = classDefinition.getLocation();
        String classConstructorName = String.format("make_%s", classInfo.globalName());
        String classTypeName = String.format("%sDictttt", classDefinition.getName());
        IdentifierNode classConstructorId = new IdentifierNode(classConstructorName, classLocation);

        // Rewrite the class definition itself if it is from this program
        if (classInfo.isFromFile(this.file)) {

            // Collect the type and a fresh argument id for each class member
            List<ExpressionNode> args = new ArrayList<>();
            List<String> argNames = new ArrayList<>();
            List<TypeNode> memberTypes = new ArrayList<>();
            for (TypeAssertion member : classInfo.definition.members) {
                IdentifierNode id = new IdentifierNode(SymbolTable.freshVarName(), classLocation);
                argNames.add(id.getName());
                args.add(id);
                memberTypes.add(member.type);
            }

            // Idem for inherited members
            // TODO

            // Create class type definition
            TypeContext typeContext = TypeContext.fromContextNodes(classDefinition.contextNodes);
            ParametricInfo typeInfo = new ParametricInfo(classTypeName, this.file, true, classLocation);
            TypeNode lhs = new TypeApplicationNode(
                    classDefinition.type.getLocation(),
                    new TypeIdentifierNode(classLocation, classTypeName, typeInfo),
                    classDefinition.type.args);
            TypeIdentifierNode tupleId = new TypeIdentifierNode(new Location(), "Tuple");
            TypeNode rhs = new TypeApplicationNode(classLocation, tupleId, memberTypes);
            TypeDefinition typeDefinition = new TypeDefinition(classLocation, typeContext, lhs, rhs);
            typeInfo.setDefinition(typeDefinition);

            // Create class constructor type declaration
            FunctionTypeNode constructorType = new FunctionTypeNode(classLocation, rhs, lhs);
            SchemaNode consructorSchema = new SchemaNode(classLocation, classDefinition.contextNodesWithoutConditions(),
                    constructorType);
            Declaration constructorDeclaration = new Declaration(classLocation, classConstructorId, consructorSchema,
                    true);

            // Create class constructor
            LambdaNode constructor = new LambdaNode(
                    argNames,
                    new ApplicationNode(new IdentifierNode("tuple", classLocation), args, classLocation),
                    classLocation);
            ValueDefinition constructorDefinition = new ValueDefinition(
                    classLocation,
                    classConstructorId,
                    constructor,
                    false);
            ValueInfo constructorInfo = ValueInfo.builder()
                    .name(classConstructorId.getName())
                    .file(classInfo.file)
                    .isGlobal(true)
                    .isMonomorphic(false)
                    .location(classLocation)
                    .isPublic(false)
                    .definition(constructorDefinition)
                    .declaredType(consructorSchema)
                    .build();

            Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n\nGenerated definitions for class %s:",
                    classInfo.name());
            Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", typeDefinition.pretty());
            Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", constructorDeclaration.pretty());
            Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", constructorDefinition.pretty());

            env.addInfo(constructorInfo);
            env.addInfo(typeInfo);

            int counter = 0;

            // Create a function for each member
            for (TypeAssertion member : classInfo.definition.members) {

                Location memberLocation = member.getLocation();

                if (member.type instanceof FunctionTypeNode funType &&
                        funType.domain instanceof TypeApplicationNode domain &&
                        domain.op.getName().equals("Tuple")) {

                    // Create a Declaration for the member
                    // IdentifierNode id = new IdentifierNode(SymbolTable.freshVarName(),
                    // classLocation);

                    List<ExpressionNode> memberArgNames = new ArrayList<>();
                    List<String> memberDictAndArgNames = new ArrayList<>();
                    String dictVar = SymbolTable.freshVarName();
                    memberDictAndArgNames.add(dictVar);
                    for (TypeNode arg : domain.args) {
                        String freshName = SymbolTable.freshVarName();
                        memberArgNames.add(new IdentifierNode(freshName, memberLocation));
                        memberDictAndArgNames.add(freshName);
                    }

                    List<TypeNode> typeArgs = new ArrayList<>();
                    typeArgs.add(lhs);
                    typeArgs.addAll(domain.args);
                    TypeApplicationNode dom = new TypeApplicationNode(domain.getLocation(), domain.op, typeArgs);
                    FunctionTypeNode memberType = new FunctionTypeNode(memberLocation, dom, funType.range);
                    SchemaNode memberSchema = new SchemaNode(
                            memberLocation,
                            classDefinition.contextNodesWithoutConditions(),
                            memberType);
                    Declaration memberDeclaration = new Declaration(
                            memberLocation,
                            member.id,
                            memberSchema,
                            true);

                    // Create a ValueDefinition for the member
                    // ExpressionNode fun = new LambdaNode(args, r, r.getLocation());
                    // RESULT = new ApplicationNode(
                    // new IdentifierNode("apply",
                    // e.getLocation()),
                    // Arrays.asList(fun, e), loc);

                    LambdaNode genFun = new LambdaNode(
                            memberDictAndArgNames,
                            new LetNode(
                                    List.of(new LetTupleBindingNode(memberLocation, argNames,
                                            new IdentifierNode(dictVar, memberLocation))),
                                    new ApplicationNode(new IdentifierNode(argNames.get(counter), memberLocation),
                                            memberArgNames,
                                            memberLocation),
                                    memberLocation),
                            memberLocation);
                    ValueDefinition memberDefinition = new ValueDefinition(
                            memberLocation,
                            member.id,
                            (ExpressionNode) genFun.desugar(),
                            false);
                    ValueInfo memberInfo = ValueInfo.builder()
                            .name(member.id.getName())
                            .file(classInfo.file)
                            .isGlobal(true)
                            .isMonomorphic(false)
                            .location(classLocation)
                            .isPublic(true)
                            .definition(memberDefinition)
                            .declaredType(memberSchema)
                            .build();

                    Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", memberDeclaration.pretty());
                    Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", memberDefinition.pretty());

                    env.addInfo(memberInfo);
                    counter++;

                } else {
                    throw new PacioliException(memberLocation, "Type %s of class %s member %s is not a function type",
                            member.type.pretty(),
                            classInfo.name(),
                            member.id.getName());
                }

            }
        }

        Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n\nGenerated definitions for class %s instances:",
                classInfo.name());

        // Rewrite all class instances if it is from this program
        for (InstanceInfo instanceInfo : classInfo.instances) {
            if (instanceInfo.isFromFile(this.file)) {

                Location instanceLocation = instanceInfo.getLocation();

                // Create a declaration and definition. Both are a tuple with an element for
                // each overloaded function instance
                List<ExpressionNode> bodies = new ArrayList<>();
                for (String name : classInfo.definition.memberNames()) {
                    bodies.add(instanceInfo.definition.memberBody(name));
                }

                // Create tuple

                ApplicationNode tuple = new ApplicationNode(classConstructorId, bodies, instanceLocation);
                List<String> arg = new ArrayList<>();
                for (ContextNode yo : instanceInfo.definition.contextNodes) {
                    for (TypeApplicationNode condition : yo.conditions) {
                        arg.add(condition.getName());
                    }
                }
                LambdaNode instanceBody = new LambdaNode(arg, tuple, instanceInfo.getLocation());

                IdentifierNode instanceId = new IdentifierNode(instanceInfo.globalName(), instanceLocation);

                // Define a helper function for the instance
                ValueDefinition vd = new ValueDefinition(
                        instanceInfo.getLocation(),
                        instanceId,
                        instanceBody,
                        false);
                ValueInfo info = ValueInfo.builder()
                        .name(instanceInfo.globalName())
                        .file(classInfo.file)
                        .isGlobal(true)
                        .isMonomorphic(false)
                        .location(classInfo.getLocation())
                        .isPublic(false)
                        .definition(vd)
                        .build();

                Pacioli.logIf(Pacioli.Options.showClassRewriting, "\n%s", vd.pretty());

                env.addInfo(info);
            }
        }

        return env;
    }

    // -------------------------------------------------------------------------
    // Lifting statements
    // -------------------------------------------------------------------------

    public void liftStatements(PacioliTable program, PacioliTable env) throws Exception {

        Pacioli.trace("Lifting value statements %s", this.file.getModule());

        for (ValueInfo info : program.values.allInfos()) {
            if (info.getDefinition().isPresent() && info.isFromFile(this.file)) {
                ValueDefinition definition = info.getDefinition().get();
                definition.body = definition.body.liftStatements(this.file, program, env, ExpressionNode.class);

            }
        }
    }

    // -------------------------------------------------------------------------
    // Transforming conversions
    // -------------------------------------------------------------------------

    public void transformConversions(PacioliTable pacioliTable) {

        Pacioli.trace("Transforming conversions %s", this.file.getModule());

        for (ValueInfo info : pacioliTable.values.allInfos()) {
            if (info.getDefinition().isPresent() && info.isFromFile(this.file)) {
                ValueDefinition definition = info.getDefinition().get();
                ExpressionNode newBody = new TransformConversions().expAccept(definition.body);
                definition.body = newBody;

            }
        }
    }

    // -------------------------------------------------------------------------
    // Type inference
    // -------------------------------------------------------------------------

    public void inferTypes(PacioliTable prog, PacioliTable env) {

        Pacioli.trace("Infering types in %s", this.file.getModule());

        // values.parent = environment.values();
        // typess.parent = environment.types();

        prog.setParent(env);
        PacioliTable environment = prog;

        Set<SymbolInfo> discovered = new HashSet<SymbolInfo>();
        Set<SymbolInfo> finished = new HashSet<SymbolInfo>();

        List<String> names = environment.values.allNames();
        Collections.sort(names);

        for (String value : names) {
            ValueInfo info = environment.values.lookup(value);

            if (info.isFromFile(this.file) && info.getDefinition().isPresent()) {

                Pacioli.logIf(Pacioli.Options.logTypeInference, "Infering type of %s", value);

                inferValueDefinitionType(info, discovered, finished, Pacioli.Options.logTypeInference, environment);

                Pacioli.logIf(Pacioli.Options.logTypeInference, "%s :: %s;", info.name(),
                        info.inferredType.get().pretty());
            }

            Optional<TypeNode> declared = info.getDeclaredType();

            if (info.isFromFile(this.file) && declared.isPresent() && info.inferredType.isPresent()) {

                TypeObject declaredType = declared.get().evalType().instantiate()
                        .reduce(i -> i.isFromFile(this.file));
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
        for (Toplevel toplevel : environment.toplevels) {

            inferUsedTypes(toplevel, discovered, finished, true, environment);

            Pacioli.logIf(Pacioli.Options.logTypeInference, "Inferring typing of toplevel %s", i);

            Typing typing = toplevel.body.inferTyping(environment, this.file);
            Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails, "Typing of toplevel %s is %s", i, typing.pretty());

            toplevel.type = typing.solve(!isLibrary()).simplify();
            Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails, "Type of toplevel %s is %s", i,
                    toplevel.type.pretty());

            i++;
        }

    }

    private void inferUsedTypes(Definition definition, Set<SymbolInfo> discovered, Set<SymbolInfo> finished,
            Boolean verbose, PacioliTable env) {
        for (SymbolInfo pre : definition.uses()) {
            if (pre.isGlobal() && pre instanceof ValueInfo) {
                if (pre.isFromFile(this.file) && pre.getDefinition().isPresent()) {
                    inferValueDefinitionType((ValueInfo) pre, discovered, finished, verbose, env);
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
     * @param env
     */
    private void inferValueDefinitionType(ValueInfo info, Set<SymbolInfo> discovered, Set<SymbolInfo> finished,
            Boolean verbose, PacioliTable env) {

        if (!finished.contains(info)) {
            if (discovered.contains(info)) {
                // Pacioli.warn("Cycle in definition of %s", info.name());
            } else {
                discovered.add(info);
                inferUsedTypes(info.getDefinition().get(), discovered, finished, verbose, env);

                ValueDefinition def = info.getDefinition().get();

                Pacioli.logIf(Pacioli.Options.logTypeInference, "Infering typing of %s", info.name());

                Typing typing = def.body.inferTyping(env, this.file);

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

    // public void printTypes() throws PacioliException {

    // List<String> names = values.allNames();
    // Collections.sort(names);

    // for (String value : names) {
    // ValueInfo info = values.lookup(value);
    // if (info.isFromFile(this.file) && info.getDefinition().isPresent()) {
    // Pacioli.println("\n%s :: %s;", info.name(), info.inferredType().pretty());
    // }
    // }
    // Integer count = 1;
    // for (Toplevel toplevel : toplevels) {
    // TypeObject type = toplevel.type;
    // Pacioli.println("\nToplevel %s :: %s", count++, type.unfresh().pretty());
    // }
    // }

    // -------------------------------------------------------------------------
    // Pretty printing
    // -------------------------------------------------------------------------

    @Override
    public void printPretty(PrintWriter out) {

        // // Print raw AST variant
        // // program.printPretty(out);

        // // Print parsed code variant
        // for (TypeSymbolInfo info : typess.allInfos()) {
        // out.println();
        // info.getDefinition().get().printPretty(out);
        // out.println();
        // }

        // for (ValueInfo info : values.allInfos()) {
        // if (info.getDefinition().isPresent() && info.isFromFile(this.file)) {
        // out.println();
        // info.getDefinition().get().printPretty(out);
        // out.println();
        // }
        // }

        out.println("FIX printPretty on Program");
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
                    info.generalInfo().getFile() == null ? "" : !info.isFromFile(this.file),
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
