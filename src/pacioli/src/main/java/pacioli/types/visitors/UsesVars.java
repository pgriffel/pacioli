package pacioli.types.visitors;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.Stack;

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
import pacioli.types.type.TypeBase;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypeVar;
import pacioli.types.type.Var;
import pacioli.types.type.VectorUnitVar;
import uom.Unit;

public class UsesVars implements TypeVisitor {

    private Stack<Set<Var>> nodeStack = new Stack<Set<Var>>();

    public Set<Var> varSetAccept(TypeObject child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return nodeStack.pop();
    }

    public void returnTypeNode(Set<Var> value) {
        // Pacioli.logln("return: %s", value.getClass());
        nodeStack.push(value);
    }

    @Override
    public void visit(FunctionType type) {
        Set<Var> all = new LinkedHashSet<Var>();
        all.addAll(varSetAccept(type.domain()));
        all.addAll(varSetAccept(type.range()));
        returnTypeNode(all);
    }

    @Override
    public void visit(Schema type) {
        Set<Var> freeVars = new LinkedHashSet<Var>(type.type().typeVars());
        freeVars.removeAll(type.variables());
        returnTypeNode(freeVars);
    }

    @Override
    public void visit(IndexList type) {
        returnTypeNode(new LinkedHashSet<Var>());
    }

    @Override
    public void visit(IndexType type) {
        Set<Var> vars = new LinkedHashSet<Var>();
        if (type.isVar()) {
            vars.add((Var) type.indexSet());
        }
        returnTypeNode(vars);
    }

    @Override
    public void visit(MatrixType type) {
        Set<Var> all = new LinkedHashSet<Var>();
        all.addAll(unitVars(type.factor()));
        if (type.rowDimension().isVar() || type.rowDimension().width() > 0) {
            all.addAll(unitVars(type.rowUnit()));
        }
        if (type.columnDimension().isVar() || type.columnDimension().width() > 0) {
            all.addAll(unitVars(type.columnUnit()));
        }
        all.addAll(varSetAccept(type.rowDimension()));
        all.addAll(varSetAccept(type.columnDimension()));
        returnTypeNode(all);
    }

    public static Set<Var> unitVars(Unit<TypeBase> unit) {
        Set<Var> all = new LinkedHashSet<Var>();
        for (TypeBase base : unit.bases()) {
            if (base instanceof Var) {
                all.add((Var) base);
            }
        }
        return all;
    }

    @Override
    public void visit(IndexSetVar type) {
        Set<Var> vars = new LinkedHashSet<Var>();
        vars.add(type);
        returnTypeNode(vars);
    }

    @Override
    public void visit(ParametricType type) {
        Set<Var> all = new LinkedHashSet<Var>();
        all.addAll(varSetAccept(type.op()));
        for (TypeObject arg : type.args()) {
            all.addAll(varSetAccept(arg));
        }
        returnTypeNode(all);
    }

    @Override
    public void visit(ScalarUnitVar type) {
        Set<Var> vars = new LinkedHashSet<Var>();
        vars.add(type);
        returnTypeNode(vars);
    }

    @Override
    public void visit(TypeVar type) {
        Set<Var> vars = new LinkedHashSet<Var>();
        vars.add(type);
        returnTypeNode(vars);
    }

    @Override
    public void visit(VectorUnitVar type) {
        Set<Var> vars = new LinkedHashSet<Var>();
        vars.add(type);
        returnTypeNode(vars);
    }

    @Override
    public void visit(OperatorConst type) {
        Set<Var> vars = new LinkedHashSet<Var>();
        returnTypeNode(vars);
    }

    @Override
    public void visit(OperatorVar type) {
        Set<Var> vars = new LinkedHashSet<Var>();
        vars.add(type);
        returnTypeNode(vars);
    }

}
