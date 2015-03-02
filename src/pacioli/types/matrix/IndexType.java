package pacioli.types.matrix;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.types.AbstractType;
import pacioli.types.PacioliType;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVar;
import uom.Unit;

public class IndexType extends AbstractType {

	private final PacioliType indexSet;

	public IndexType(List<TypeIdentifier> indexSets) {
		this.indexSet = new IndexList(indexSets);
	}

	public IndexType(IndexList indexSet) {
		this.indexSet = indexSet;
	}
	
	public IndexType(TypeIdentifier indexSet) {
		List<TypeIdentifier> indexList = new ArrayList<TypeIdentifier>();
		indexList.add(indexSet);
		this.indexSet = new IndexList(indexList);
	}

	public IndexType() {
		this.indexSet = new IndexList(new ArrayList<TypeIdentifier>());
	}

	public IndexType(TypeVar typeVar) {
		indexSet = typeVar;
	}
	
	private IndexType(PacioliType type) {
		indexSet = type;
	}

	public boolean isVar() {
		return indexSet instanceof TypeVar;
	}
	
	public String varName() {
		return ((TypeVar) indexSet).toText();
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
		return String.format("%s%s", super.toString(), indexSet);
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

	@Override
	public void printText(PrintWriter out) {
		out.print("Index(");
		indexSet.printText(out);
		out.print(")");
	}

	@Override
	public Set<TypeVar> typeVars() {
		Set<TypeVar> vars = new LinkedHashSet<TypeVar>();
		if (isVar()) {
			vars.add((TypeVar) indexSet);
		}
		return vars;
	}

    @Override
    public Set<String> unitVecVarCompoundNames() {
        return new LinkedHashSet<String>();
    }
    
	@Override
	public ConstraintSet unificationConstraints(PacioliType other) throws PacioliException {
		IndexType otherType = (IndexType) other;
		ConstraintSet constraints = new ConstraintSet();
        constraints.addConstraint(indexSet, otherType.indexSet, "Index Set must be equal");
        return constraints;
	}

	@Override
	public PacioliType applySubstitution(Substitution subs) {
		return new IndexType(indexSet.applySubstitution(subs));
	}

	IndexType kronecker(IndexType other) {
		if (isVar()) {
			throw new RuntimeException("Method not available for an index variable");
		} else {
			return new IndexType(indexList().kronecker(other));
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
	public String compileToJS() {
		return indexSet.compileToJS();
	}

	@Override
	public String description() {
		return "index type";
	}

	@Override
	public PacioliType reduce() {
		return indexSet.reduce();
	}

	@Override
	public List<Unit> simplificationParts() {
		return indexSet.simplificationParts();
	}

}
