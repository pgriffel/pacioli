package pacioli.ast.definition;

import java.io.PrintWriter;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.symboltable.GenericInfo;
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
    public String compileToMATLAB() {
        throw new RuntimeException("todo");
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("declare %s :: %s;\n", localName(), typeNode.toText());
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void addToProgr(Progam program, GenericInfo.Scope scope) throws PacioliException {
        
        String name = localName();
        
        GenericInfo generic = new GenericInfo(name, program.program.module.name, 
                program.file, scope, getLocation());       
        ValueInfo info = new ValueInfo(generic);
        info.declaredType = typeNode;
        
        ValueInfo oldInfo = program.values.lookup(name);
        if (oldInfo != null) {
            info = oldInfo.includeOther(info);
        }
            
        program.values.put(name, info);
    }

}
