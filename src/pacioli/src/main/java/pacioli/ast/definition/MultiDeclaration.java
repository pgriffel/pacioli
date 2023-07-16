package pacioli.ast.definition;

import java.util.List;

import pacioli.CompilationSettings;
import pacioli.Location;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.types.ast.TypeNode;

public class MultiDeclaration extends AbstractDefinition {

    public List<IdentifierNode> ids;
    public TypeNode node;
    private boolean isPublic;

    public MultiDeclaration(Location location, List<IdentifierNode> ids, TypeNode node, boolean isPublic) {
        super(location);
        this.ids = ids;
        this.node = node;
        this.isPublic = isPublic;
    }

    @Override
    public String getName() {
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

    public boolean isPublic() {
        return isPublic;
    }
}
