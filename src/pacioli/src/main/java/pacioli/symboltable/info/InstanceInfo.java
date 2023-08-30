package pacioli.symboltable.info;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.ast.definition.InstanceDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.compiler.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.types.ast.QuantNode;
import pacioli.types.ast.TypePredicateNode;

/**
 * Part of ClassInfo.
 */
public final class InstanceInfo extends AbstractInfo {

    private final InstanceDefinition definition;

    public InstanceInfo(
            InstanceDefinition definition,
            PacioliFile file,
            String uniqueSuffix) {
        super(new GeneralInfo(definition.name() + uniqueSuffix, file, true, true, definition.location()));
        this.definition = definition;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        throw new UnsupportedOperationException("ToDO?");
        // visitor.visit(this);
    }

    @Override
    public String globalName() {
        return String.format("%s_%s", generalInfo().module(), name());
    }

    @Override
    public Optional<InstanceDefinition> definition() {
        return Optional.of(definition);
    }

    public ValueInfo generateDefinition(String classConstructor) {

        return ValueInfo.builder()
                .name(this.globalName())
                .file(this.generalInfo().file())
                .isGlobal(true)
                .isMonomorphic(false)
                .location(this.location())
                .isPublic(false)
                .definition(
                        new ValueDefinition(
                                this.location(),
                                new IdentifierNode(this.globalName(), this.location()),
                                this.instanceConstruction(classConstructor),
                                false))
                .build();
    }

    private LambdaNode instanceConstruction(String classConstructor) {

        // Create a declaration and definition. Both are a tuple with an element for
        // each overloaded function instance
        List<ExpressionNode> bodies = new ArrayList<>();
        for (String name : this.definition.memberNames()) {
            bodies.add(this.definition().get().memberBody(name));
        }

        // Create tuple
        ApplicationNode tuple = new ApplicationNode(
                new IdentifierNode(classConstructor, this.location()),
                bodies,
                this.location());
        List<String> arg = new ArrayList<>();
        for (QuantNode yo : this.definition().get().quantNodes) {
            for (TypePredicateNode condition : yo.conditions) {
                arg.add(condition.name());
            }
        }

        return new LambdaNode(arg, tuple, this.location());
    }
}
