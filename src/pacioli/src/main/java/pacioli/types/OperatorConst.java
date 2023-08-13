package pacioli.types;

import java.util.Optional;

import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.ParametricInfo;

// Const
public final class OperatorConst implements Operator {

    private final TypeIdentifier id;
    private final ParametricInfo info;

    public OperatorConst(TypeIdentifier id, ParametricInfo info) {
        this.id = id;
        this.info = info;
    }

    @Override
    public String description() {
        return "type operator";
    }

    @Override
    public String toString() {
        return String.format("<Op %s>", id);
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String name() {
        return id.name;
    }

    @Override
    public Optional<ParametricInfo> info() {
        return Optional.ofNullable(this.info);
    }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        if (!id.name.equals(((OperatorConst) other).id.name)) {
            throw new PacioliException("Type operators '%s and '%s' differ", this.pretty(),
                    other.pretty());
        }
        ConstraintSet constraints = new ConstraintSet();
        // constraints.addConstraint(id, ((OperatorConst) other).id,
        // String.format("Function range's type must match"));
        return constraints;
    }
}
