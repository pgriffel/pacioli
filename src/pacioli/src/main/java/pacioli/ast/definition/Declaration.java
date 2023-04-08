package pacioli.ast.definition;

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.symboltable.ValueInfo;
import pacioli.types.ast.TypeNode;

public class Declaration extends AbstractDefinition {

    public final IdentifierNode id;
    public final TypeNode typeNode;

    public Declaration(Location location, IdentifierNode id, TypeNode typeNode) {
        super(location);
        this.id = id;
        this.typeNode = typeNode;
    }

    public Declaration transform(TypeNode node) {
        return new Declaration(getLocation(), id, node);
    }

    @Override
    public String localName() {
        return id.getName();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void addToProgr(Progam program) throws PacioliException {

        String name = localName();
        ValueInfo oldInfo = program.values.lookup(name);

        if (oldInfo != null) {
            // It seems we already found a definition for this name. Check that there is no
            // declaration yet and add this one.
            if (oldInfo.getDeclaredType().isEmpty()) {
                oldInfo.setDeclaredType(typeNode);
            } else {
                throw new PacioliException(typeNode.getLocation(), "Duplicate type declaration for %s", name);
            }
        } else {
            ValueInfo info = new ValueInfo(name, program.file, program.getModule(), true, false, getLocation());
            info.setDeclaredType(typeNode);
            program.values.put(name, info);
        }
    }

}
