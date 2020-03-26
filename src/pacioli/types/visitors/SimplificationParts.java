package pacioli.types.visitors;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import pacioli.types.FunctionType;
import pacioli.types.IndexSetVar;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.ScalarUnitVar;
import pacioli.types.Schema;
import pacioli.types.TypeBase;
import pacioli.types.TypeVar;
import pacioli.types.TypeVisitor;
import pacioli.types.Var;
import pacioli.types.VectorUnitVar;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import uom.Unit;

public class SimplificationParts implements TypeVisitor {

    private Stack<List<Unit<TypeBase>>> nodeStack = new Stack<List<Unit<TypeBase>>>();
    

    public List<Unit<TypeBase>> partsAccept(PacioliType child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return nodeStack.pop();
    }
    
    public void returnParts(List<Unit<TypeBase>> value) {
        // Pacioli.logln("return: %s", value.getClass());
        nodeStack.push(value);
    }
    
    @Override
    public void visit(FunctionType type) {
        List<Unit<TypeBase>> all = new ArrayList<Unit<TypeBase>>();
        all.addAll(partsAccept(type.domain));
        all.addAll(partsAccept(type.range));
        returnParts(all);
    }

    @Override
    public void visit(Schema type) {
        List<Unit<TypeBase>> freeVars = new ArrayList<Unit<TypeBase>>(type.type.typeVars());
        freeVars.removeAll(type.variables);
        returnParts(freeVars);
    }

    @Override
    public void visit(IndexList type) {
        returnParts(new ArrayList<Unit<TypeBase>>());
    }

    @Override
    public void visit(IndexType type) {       
        List<Unit<TypeBase>> vars = new ArrayList<Unit<TypeBase>>();
        if (type.isVar()) {
            vars.add((Var) type.indexSet);
        }
        returnParts(vars);
    }

    @Override
    public void visit(MatrixType type) {
        List<Unit<TypeBase>> parts = new ArrayList<Unit<TypeBase>>();
        parts.add(type.factor);
        if (type.rowDimension.isVar() || type.rowDimension.width() > 0) {
            parts.add(type.rowUnit);
        }
        if (type.columnDimension.isVar() || type.columnDimension.width() > 0) {
            parts.add(type.columnUnit);
        }
        returnParts(parts);
    }
    
    public static List<Unit<TypeBase>> unitVars(Unit<TypeBase> unit) {
        List<Unit<TypeBase>> all = new ArrayList<Unit<TypeBase>>();
        for (TypeBase base : unit.bases()) {
            if (base instanceof Var) {
                all.add((Var) base);
            }
        }
        return all;
    }

    @Override
    public void visit(IndexSetVar type) {
        returnParts(new ArrayList<Unit<TypeBase>>());
    }

    @Override
    public void visit(ParametricType type) {
        List<Unit<TypeBase>> all = new ArrayList<Unit<TypeBase>>();
        for (PacioliType arg : type.args) {
            all.addAll(partsAccept(arg));
        }
        returnParts(all);
    }

    @Override
    public void visit(ScalarUnitVar type) {
        returnParts(new ArrayList<Unit<TypeBase>>());
    }

    @Override
    public void visit(TypeVar type) {
        returnParts(new ArrayList<Unit<TypeBase>>());
    }

    @Override
    public void visit(VectorUnitVar type) {
        returnParts(new ArrayList<Unit<TypeBase>>());
    }

}
