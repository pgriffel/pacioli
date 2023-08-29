package pacioli.types.type;

import java.util.List;

import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.ClassInfo;
import pacioli.types.ConstraintSet;
import pacioli.types.TypeVisitor;

public class TypePredicate implements TypeObject {

    private final ClassInfo classInfo;
    private final List<TypeObject> args;

    public TypePredicate(ClassInfo classInfo, List<TypeObject> args) {
        this.classInfo = classInfo;
        this.args = args;
    }

    @Override
    public String toString() {
        return "TypePredicate [classInfo=" + classInfo + ", args=" + args + "]";
    }

    @Override
    public String description() {
        return "type predicate";
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

    public String id() {
        return this.classInfo.name();
    }

    public List<TypeObject> arguments() {
        return this.args;
    }

}
