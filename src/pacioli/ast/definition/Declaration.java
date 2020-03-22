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
        
        ValueInfo info = new ValueInfo(name, program.getModule(), true, getLocation());
        info.setDeclaredType(typeNode);
        
        ValueInfo oldInfo = program.values.lookup(name);
        if (oldInfo != null) {
            info = oldInfo.includeOther(info);
        }
            
        program.values.put(name, info);
    }

}
