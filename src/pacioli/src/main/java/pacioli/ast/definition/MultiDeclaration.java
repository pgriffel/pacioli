package pacioli.ast.definition;

import java.util.List;

import pacioli.CompilationSettings;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.types.ast.TypeNode;

public class MultiDeclaration extends AbstractDefinition {

    public List<IdentifierNode> ids;
    public TypeNode node;

    public MultiDeclaration(Location location, List<IdentifierNode> ids, TypeNode node) {
        super(location);
        this.ids = ids;
        this.node = node;
    }

    @Override
    public String localName() {
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

    @Override
    public void addToProgr(Progam program) throws PacioliException {
/*        // obsolete?!
        for (IdentifierNode id : ids) {
            Declaration declaration = new Declaration(getLocation(), id, node);
            declaration.addToProgr(program);
        }*/
        throw new RuntimeException("Cannot add a multi declaration to a program. It should have been desugared into single declarations.");
    }

}
