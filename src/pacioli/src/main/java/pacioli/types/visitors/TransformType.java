package pacioli.types.visitors;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import pacioli.types.TypeVisitor;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.FunctionType;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.Operator;
import pacioli.types.type.OperatorConst;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.ParametricType;
import pacioli.types.type.ScalarUnitVar;
import pacioli.types.type.Schema;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;

public class TransformType implements TypeVisitor {

    private Stack<TypeObject> nodeStack = new Stack<TypeObject>();

    public TransformType() {
    }

    public TypeObject typeNodeAccept(TypeObject child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return nodeStack.pop();
    }

    protected void returnTypeNode(TypeObject value) {
        // Pacioli.logln("return: %s", value.getClass());
        nodeStack.push(value);
    }

    @Override
    public void visit(FunctionType type) {
        TypeObject domainType = typeNodeAccept(type.domain());
        TypeObject rangeType = typeNodeAccept(type.range());
        returnTypeNode(new FunctionType(domainType, rangeType));
    }

    @Override
    public void visit(Schema type) {
        returnTypeNode(new Schema(type.variables(), typeNodeAccept(type.type()), type.contextNodes()));
    }

    @Override
    public void visit(IndexList type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(IndexType type) {
        returnTypeNode(new IndexType(typeNodeAccept(type.indexSet())));
    }

    @Override
    public void visit(MatrixType type) {
        returnTypeNode(
                new MatrixType(
                        type.factor(), // typeNodeAccept(type.factor),
                        (IndexType) typeNodeAccept(type.rowDimension()),
                        type.rowUnit(), // typeNodeAccept(type.rowUnit),
                        (IndexType) typeNodeAccept(type.columnDimension()),
                        // typeNodeAccept(type.columnUnit)
                        type.columnUnit()));
    }

    @Override
    public void visit(IndexSetVar type) {
        returnTypeNode(type);
        // return subs.apply((TypeObject) this);
    }

    @Override
    public void visit(ParametricType type) {
        List<TypeObject> items = new ArrayList<>();
        for (TypeObject arg : type.args()) {
            // TODO error on cast error!?
            items.add((TypeObject) typeNodeAccept(arg));
        }
        ParametricType opType = new ParametricType(type.location(),
                type.definition().orElse(null), // TODO: check orElse
                (Operator) typeNodeAccept(type.op()),
                items);
        returnTypeNode(opType);
    }

    @Override
    public void visit(TypeVar type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(ScalarUnitVar type) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

    @Override
    public void visit(VectorUnitVar type) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

    @Override
    public void visit(OperatorConst type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(OperatorVar type) {
        returnTypeNode(type);
    }

}
