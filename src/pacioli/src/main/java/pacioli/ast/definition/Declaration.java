package pacioli.ast.definition;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.compiler.Location;
import pacioli.types.ast.TypeNode;

public class Declaration extends AbstractNode implements Definition {

    public final IdentifierNode id;
    public final TypeNode typeNode;

    private final List<IdentifierNode> arguments; // can be null

    public Declaration(Location location, IdentifierNode id, TypeNode typeNode) {
        super(location);
        this.id = id;
        this.typeNode = typeNode;
        this.arguments = null;
    }

    public Declaration(Location location, IdentifierNode id, TypeNode typeNode, List<IdentifierNode> arguments) {
        super(location);
        this.id = id;
        this.typeNode = typeNode;
        this.arguments = arguments;
    }

    public Declaration transform(TypeNode node) {
        return new Declaration(location(), id, node, this.arguments);
    }

    @Override
    public String name() {
        return id.name();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public boolean isPrimitive() {
        return this.arguments == null;
    }

    public Optional<List<String>> arguments() {
        return Optional.ofNullable(this.arguments).map(args -> {
            List<String> arguments = new ArrayList<>();
            for (IdentifierNode arg : args) {
                arguments.add(arg.name());
            }
            return arguments;
        });
    }
}
