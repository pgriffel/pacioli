package pacioli.types;

import pacioli.misc.PacioliException;
import pacioli.symboltable.info.ParametricInfo;

// Const
public record OperatorConst(TypeIdentifier id, ParametricInfo info) implements Operator {

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
    public String getName() {
        return id.name;
    }

    @Override
    public ParametricInfo getInfo() {
        return info;
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
