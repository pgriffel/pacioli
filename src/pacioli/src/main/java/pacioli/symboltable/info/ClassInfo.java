package pacioli.symboltable.info;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.ast.definition.ClassDefinition;
import pacioli.ast.definition.TypeAssertion;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.LetTupleBindingNode;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.types.TypeContext;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeNode;

public final class ClassInfo extends AbstractInfo implements TypeInfo {

    private final ClassDefinition definition;
    private final List<InstanceInfo> instances;

    public ClassInfo(
            GeneralInfo info,
            ClassDefinition definition,
            List<InstanceInfo> instances) {
        super(info);
        this.definition = definition;
        this.instances = instances;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        return String.format("%s_%s", generalInfo().module(), name());
    }

    @Override
    public Optional<ClassDefinition> definition() {
        return Optional.of(definition);
    }

    public List<InstanceInfo> instances() {
        return this.instances;
    }

    public ParametricInfo generateDictionaryDefinition() {

        Location defLocation = this.definition.location();

        return ParametricInfo.builder()
                .name(this.dictionaryName())
                .file(this.generalInfo().file())
                .isGlobal(true)
                .location(defLocation)
                .definition(new TypeDefinition(
                        defLocation,
                        TypeContext.fromQuantNodes(this.definition.quantNodes),
                        this.dictTypeLHS(),
                        this.dictTypeRHS()))
                .build();
    }

    public ValueInfo generateConstructorDefinition() {

        Location defLocation = this.definition.location();

        // A builder for the ValueInfo we will return
        ValueInfo.Builder builder = ValueInfo.builder()
                .name(this.constructorName())
                .file(this.generalInfo().file())
                .isGlobal(true)
                .isMonomorphic(false)
                .location(defLocation)
                .isPublic(false);

        // Create a definition for the constructor
        builder.definition(
                new ValueDefinition(
                        defLocation,
                        new IdentifierNode(this.constructorName(), defLocation),
                        this.constructorBody(),
                        false));

        // Create a type schema for the constructor
        builder.declaredType(
                new SchemaNode(
                        defLocation,
                        this.definition.quantNodesWithoutConditions(),
                        new FunctionTypeNode(defLocation, this.dictTypeRHS(), this.dictTypeLHS())));

        return builder.build();
    }

    public List<ValueInfo> generateMemberDefinitions() {

        // TODO: inherited members

        int counter = 0;

        // Create fresh identifiers id0, id1, ... for the class members
        List<String> argNames = new ArrayList<>();
        for (int i = 0; i < this.definition.members.size(); i++) {
            argNames.add(SymbolTable.freshVarName());
        }

        List<ValueInfo> definitions = new ArrayList<>();

        // Create a function for each member
        for (TypeAssertion member : this.definition.members) {

            Location memberLocation = member.location();

            if (member.type instanceof FunctionTypeNode funType &&
                    funType.domain instanceof TypeApplicationNode domain &&
                    domain.op.name().equals("Tuple")) {

                ValueInfo.Builder builder = ValueInfo.builder()
                        .name(member.id.name())
                        .file(this.generalInfo().file())
                        .isGlobal(true)
                        .isMonomorphic(false)
                        .location(this.definition.location())
                        .isPublic(true)
                        .declaredType(this.memberType(member))
                        .definition(new ValueDefinition(
                                memberLocation,
                                member.id,
                                (ExpressionNode) this.memberBody(member, argNames, counter).desugar(),
                                false));

                // Skip for now
                builder.definition(null);

                definitions.add(builder.build());
                counter++;

            } else {
                throw new PacioliException(memberLocation, "Type %s of class %s member %s is not a function type",
                        member.type.pretty(),
                        this.name(),
                        member.id.name());
            }

        }

        return definitions;
    }

    private SchemaNode memberType(TypeAssertion member) {

        List<TypeNode> typeArgs = new ArrayList<>();

        FunctionTypeNode funType = (FunctionTypeNode) member.type;
        TypeApplicationNode domain = (TypeApplicationNode) funType.domain;

        // Skip for now
        // typeArgs.add(this.dictTypeLHS());
        typeArgs.addAll(domain.args);
        TypeApplicationNode dom = new TypeApplicationNode(domain.location(), domain.op, typeArgs);
        FunctionTypeNode memberType = new FunctionTypeNode(member.location(), dom, funType.range);

        return new SchemaNode(
                member.location(),
                this.definition.quantNodesWithoutConditions(),
                memberType);
    }

    public List<ValueInfo> generateInstanceDefinitions() {
        List<ValueInfo> definitions = new ArrayList<>();
        for (InstanceInfo instance : this.instances()) {
            if (instance.isFromFile(this.generalInfo().file())) {
                definitions.add(instance.generateDefinition(this.constructorName()));
            }
        }
        return definitions;
    }

    private String constructorName() {
        return String.format("makeeeee_%s", this.globalName());
    }

    private String dictionaryName() {
        return String.format("%sDictttt", this.definition.name());
    }

    private TypeApplicationNode dictTypeLHS() {
        return new TypeApplicationNode(
                this.definition.type.location(),
                new TypeIdentifierNode(this.definition.location(), this.dictionaryName()),
                this.definition.type.args);
    }

    private TypeApplicationNode dictTypeRHS() {
        List<TypeNode> memberTypes = new ArrayList<>();
        for (TypeAssertion member : this.definition().get().members) {
            memberTypes.add(member.type);
        }
        TypeIdentifierNode tupleId = new TypeIdentifierNode(new Location(), "Tuple");
        return new TypeApplicationNode(this.definition.location(), tupleId, memberTypes);
    }

    private LambdaNode constructorBody() {

        Location defLocation = this.definition.location();

        // Create fresh identifiers id0, id1, ... for the class members
        List<ExpressionNode> args = new ArrayList<>();
        List<String> argNames = new ArrayList<>();
        for (TypeAssertion member : this.definition().get().members) {
            IdentifierNode id = new IdentifierNode(SymbolTable.freshVarName(), member.location());
            argNames.add(id.name());
            args.add(id);
        }

        // The constructor is a function (id0, id1, ...) -> tuple(id0, id1, ...)
        return new LambdaNode(
                argNames,
                new ApplicationNode(new IdentifierNode("tuple", defLocation), args, defLocation),
                defLocation);
    }

    private LambdaNode memberBody(TypeAssertion member, List<String> argNames, int argIndex) {

        Location memberLocation = member.location();
        FunctionTypeNode funType = (FunctionTypeNode) member.type;
        TypeApplicationNode domain = (TypeApplicationNode) funType.domain;

        List<ExpressionNode> memberArgNames = new ArrayList<>();
        List<String> memberDictAndArgNames = new ArrayList<>();
        String dictVar = SymbolTable.freshVarName();
        memberDictAndArgNames.add(dictVar);
        for (int i = 0; i < domain.args.size(); i++) {
            String freshName = SymbolTable.freshVarName();
            memberArgNames.add(new IdentifierNode(freshName, memberLocation));
            memberDictAndArgNames.add(freshName);
        }

        LambdaNode genFun = new LambdaNode(
                memberDictAndArgNames,
                new LetNode(
                        List.of(new LetTupleBindingNode(memberLocation, argNames,
                                new IdentifierNode(dictVar, memberLocation))),
                        new ApplicationNode(
                                new IdentifierNode(argNames.get(argIndex), memberLocation),
                                memberArgNames,
                                memberLocation),
                        memberLocation),
                memberLocation);

        return genFun;

    }

    public static class Builder extends GeneralBuilder<Builder, ClassInfo> {

        private ClassDefinition definition;
        public List<InstanceInfo> instances = new ArrayList<>();

        @Override
        protected Builder self() {
            return this;
        }

        public Builder definition(ClassDefinition definition) {
            this.definition = definition;
            return this;
        }

        public Builder instance(InstanceInfo def) {
            this.instances.add(def);
            return this;
        }

        @Override
        public Optional<Location> definitionLocation() {
            return Optional.ofNullable(this.definition).map(def -> def.location());
        }

        public ClassInfo build() {
            if (definition == null || instances == null) {
                throw new RuntimeException("Class info incomplete");
            }
            return new ClassInfo(buildGeneralInfo(), definition, instances);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
