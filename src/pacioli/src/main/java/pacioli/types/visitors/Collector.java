package pacioli.types.visitors;

import java.util.Collection;
import java.util.Stack;

import pacioli.types.FunctionType;
import pacioli.types.IndexSetVar;
import pacioli.types.OperatorConst;
import pacioli.types.OperatorVar;
import pacioli.types.TypeObject;
import pacioli.types.ParametricType;
import pacioli.types.ScalarUnitVar;
import pacioli.types.Schema;
import pacioli.types.TypeVar;
import pacioli.types.TypeVisitor;
import pacioli.types.VectorUnitVar;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;

public class Collector<T> implements TypeVisitor {

    protected Stack<Collection<T>> nodeStack = new Stack<>();

    protected Collection<T> empty;

    Collector(Collection<T> empty) {
        this.empty = empty;
    }

    public Collection<T> acceptTypeObject(TypeObject child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return nodeStack.pop();
    }

    // public Collection<T> acceptScalarUnit(TypeBase child) {
    // child.accept(this);
    // return nodeStack.pop();
    // }

    public void returnParts(Collection<T> value) {
        // Pacioli.logln("return: %s", value.getClass());
        nodeStack.push(value);
    }

    @Override
    public void visit(FunctionType type) {
        Collection<T> all = empty;
        all.addAll(acceptTypeObject(type.domain));
        all.addAll(acceptTypeObject(type.range));
        returnParts(all);
    }

    @Override
    public void visit(Schema type) {
        returnParts(acceptTypeObject(type.type));
    }

    @Override
    public void visit(IndexList type) {
        returnParts(empty);
    }

    @Override
    public void visit(IndexType type) {
        returnParts(acceptTypeObject(type.indexSet));
    }

    @Override
    public void visit(MatrixType type) {
        Collection<T> all = empty;
        // for (TypeBase base : type.factor.bases()) {
        // all.addAll(acceptTypeObject(base));
        // }
        all.addAll(acceptTypeObject(type.rowDimension));
        // all.addAll(partsAccept(type.rowUnit));
        // for (VectorUnitBase base : type.rowUnit.bases()) {
        // all.addAll(acceptTypeObject(base));
        // }
        all.addAll(acceptTypeObject(type.columnDimension));
        // all.addAll(partsAccept(type.columnUnit));
        // for (VectorUnitBase base : type.columnUnit.bases()) {
        // all.addAll(acceptTypeObject(base));
        // }
        returnParts(all);
    }

    @Override
    public void visit(IndexSetVar type) {
        returnParts(empty);
    }

    @Override
    public void visit(ParametricType type) {
        Collection<T> all = empty;
        for (TypeObject arg : type.args) {
            all.addAll(acceptTypeObject(arg));
        }
        returnParts(all);
    }

    @Override
    public void visit(ScalarUnitVar type) {
        returnParts(empty);
    }

    @Override
    public void visit(TypeVar type) {
        returnParts(empty);
    }

    @Override
    public void visit(VectorUnitVar type) {
        returnParts(empty);
    }

    @Override
    public void visit(OperatorConst operatorConst) {
        returnParts(empty);
    }

    @Override
    public void visit(OperatorVar operatorVar) {
        returnParts(empty);
    }

}
