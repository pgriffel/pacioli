package pacioli.ast.definition;

import java.util.List;

import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.misc.CompilationSettings;
import pacioli.misc.Location;
import pacioli.types.ast.TypeNode;

public class MultiDeclaration extends AbstractDefinition {

    public final List<IdentifierNode> ids;
    public final TypeNode node;
    public final boolean isPublic;

    public MultiDeclaration(Location location, List<IdentifierNode> ids, TypeNode node, boolean isPublic) {
        super(location);
        this.ids = ids;
        this.node = node;
        this.isPublic = isPublic;
    }

    @Override
    public String name() {
        throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
    }
}
