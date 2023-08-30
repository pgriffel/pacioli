package pacioli.types.type;

import java.util.List;

import pacioli.compiler.PacioliException;
import pacioli.types.ConstraintSet;
import pacioli.types.TypeVisitor;
import pacioli.types.ast.TypeIdentifierNode;

public class Quant implements TypeObject {

    public final TypeIdentifierNode.Kind kind;
    public final TypeIdentifier id;
    public final List<TypePredicate> conditions;

    public Quant(TypeIdentifierNode.Kind kind, TypeIdentifier id, List<TypePredicate> conditions) {
        this.kind = kind;
        this.id = id;
        this.conditions = conditions;
    }

    @Override
    public String toString() {
        return "Quant [kind=" + kind + ", id=" + id + ", conditions=" + conditions + "]";
    }

    @Override
    public String description() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'description'");
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'unificationConstraints'");
    }

}
