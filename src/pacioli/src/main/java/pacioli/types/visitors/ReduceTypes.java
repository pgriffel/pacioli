package pacioli.types.visitors;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;
import java.util.function.Function;

import pacioli.Pacioli;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.types.TypeVisitor;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.FunctionType;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.OperatorConst;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.ParametricType;
import pacioli.types.type.ScalarUnitVar;
import pacioli.types.type.Schema;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;

public class ReduceTypes implements TypeVisitor {

    private Stack<TypeObject> nodeStack = new Stack<TypeObject>();
    Function<? super ParametricInfo, ? extends Boolean> reduceCallback;

    public ReduceTypes(Function<? super ParametricInfo, ? extends Boolean> reduceCallback) {
        this.reduceCallback = reduceCallback;
    }

    public TypeObject typeNodeAccept(TypeObject child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return nodeStack.pop();
    }

    public void returnTypeNode(TypeObject value) {
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
        returnTypeNode(typeNodeAccept(type.indexSet()));
    }

    @Override
    public void visit(MatrixType type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(IndexSetVar type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(ParametricType type) {
        List<TypeObject> items = new ArrayList<TypeObject>();
        for (TypeObject arg : type.args()) {
            items.add(typeNodeAccept(arg));
        }
        try {
            ParametricType opType = new ParametricType(type.location(), type.definition().orElse(null), type.op(),
                    items); // TODO: check orElse
            boolean reduce = type.definition().isPresent() && reduceCallback.apply(type.op().info().get());
            if (!reduce) {
                returnTypeNode(opType);
            } else {
                TypeObject reduced = type.definition().get().constaint().reduce(opType).reduce(reduceCallback);
                Pacioli.logIf(Pacioli.Options.showTypeReductions, "Reduced %s to %s", type.pretty(), reduced.pretty());
                returnTypeNode(type.definition().get().constaint().reduce(opType).reduce(reduceCallback));
            }
        } catch (PacioliException e) {
            throw new RuntimeException("Type error", e);
        }
    }

    @Override
    public void visit(ScalarUnitVar type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(TypeVar type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(VectorUnitVar type) {
        returnTypeNode(type);
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
