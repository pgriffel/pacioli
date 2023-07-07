package pacioli.types.matrix;

import java.io.PrintWriter;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.symboltable.IndexSetInfo;
import pacioli.types.AbstractType;
import pacioli.types.IndexSetVar;
import pacioli.types.TypeObject;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVisitor;
import pacioli.types.Var;

public class IndexType extends AbstractType {

    public final TypeObject indexSet;

    public IndexType(List<TypeIdentifier> indexSets, List<IndexSetInfo> indexSetInfos) {
        this.indexSet = new IndexList(indexSets, indexSetInfos);
    }

    public IndexType(TypeIdentifier indexSet, IndexSetInfo indexSetInfo) {
        this.indexSet = new IndexList(Arrays.asList(indexSet), Arrays.asList(indexSetInfo));
    }

    public IndexType() {
        this.indexSet = new IndexList();
    }

    public IndexType(IndexSetVar typeVar) {
        indexSet = typeVar;
    }

    public IndexType(TypeObject type) {
        if (!(type instanceof Var || type instanceof IndexList)) {
            throw new RuntimeException(String.format("Expected index list of var"));
        }
        indexSet = type;
    }

    public TypeObject getIndexSet() {
        return indexSet;
    }

    public boolean isVar() {
        return indexSet instanceof Var;
    }

    public IndexSetVar getVar() {
        return (IndexSetVar) indexSet;
    }

    public String varName() {
        return ((Var) indexSet).pretty();
    }

    public IndexList indexList() {
        if (isVar()) {
            throw new RuntimeException("Index list not available for an index variable");
        } else {
            return (IndexList) indexSet;
        }
    }

    @Override
    public int hashCode() {
        return indexSet.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof IndexType)) {
            return false;
        }
        IndexType otherType = (IndexType) other;
        return indexSet.equals(otherType.indexSet);
    }

    @Override
    public String toString() {
        // return String.format("%s%s", super.toString(), indexSet);
        return indexSet.toString();
    }

    public List<TypeIdentifier> getIndexSets() {
        if (isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return indexList().getIndexSets();
        }
    }

    public int width() {
        if (isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return indexList().width();
        }
    }

    public TypeIdentifier nthIndexSet(int n) {
        if (isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return indexList().nthIndexSet(n);
        }
    }

    public IndexSetInfo nthIndexSetInfo(int n) {
        if (isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return indexList().nthIndexSetInfo(n);
        }
    }

    @Override
    public void printPretty(PrintWriter out) {
        out.print("Index(");
        indexSet.printPretty(out);
        out.print(")");
    }

    // @Override
    // public Set<String> unitVecVarCompoundNames() {
    // return new LinkedHashSet<String>();
    // }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        IndexType otherType = (IndexType) other;
        ConstraintSet constraints = new ConstraintSet();
        constraints.addConstraint(indexSet, otherType.indexSet, "Index Set must be equal");
        return constraints;
    }

    IndexType kronecker(IndexType other) {
        if (isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return new IndexType(indexList().kronecker(other.indexList()));
        }
    }

    public IndexType project(List<Integer> columns) {
        if (isVar()) {
            throw new RuntimeException("Method not available for an index variable");
        } else {
            return new IndexType(indexList().project(columns));
        }
    }

    @Override
    public String description() {
        return "index type";
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }
}
