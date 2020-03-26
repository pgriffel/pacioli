package pacioli.types.visitors;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import pacioli.PacioliException;
import pacioli.types.FunctionType;
import pacioli.types.IndexSetVar;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.ScalarUnitVar;
import pacioli.types.Schema;
import pacioli.types.TypeVar;
import pacioli.types.TypeVisitor;
import pacioli.types.VectorUnitVar;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;

public class ReduceTypes implements TypeVisitor {

    private Stack<PacioliType> nodeStack = new Stack<PacioliType>();
    

    public PacioliType typeNodeAccept(PacioliType child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return nodeStack.pop();
    }
    
    public void returnTypeNode(PacioliType value) {
        // Pacioli.logln("return: %s", value.getClass());
        nodeStack.push(value);
    }
    
    @Override
    public void visit(FunctionType type) {
        PacioliType domainType = typeNodeAccept(type.domain);
        PacioliType rangeType =  typeNodeAccept(type.range);
        returnTypeNode(new FunctionType(domainType, rangeType));
    }

    @Override
    public void visit(Schema type) {
        returnTypeNode(new Schema(type.variables, typeNodeAccept(type.type)));
    }

    @Override
    public void visit(IndexList type) {
        returnTypeNode(type);
    }

    @Override
    public void visit(IndexType type) {       
        returnTypeNode(typeNodeAccept(type.indexSet));
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
        List<PacioliType> items = new ArrayList<PacioliType>();
        for (PacioliType arg : type.args) {
            items.add(typeNodeAccept(arg));
        }
        try {
            ParametricType opType = new ParametricType(type.info, type.definition, items);
            if (!type.definition.isPresent()) {
                returnTypeNode(opType);
            } else {
                returnTypeNode(type.definition.get().constaint(true).reduce(opType));
            }
        } catch (PacioliException e) {
            throw new RuntimeException(e);
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

}
