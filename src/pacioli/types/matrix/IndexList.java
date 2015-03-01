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

/*
 *  Not really a type, but otherwise it cannot be put in a substitution. Make a Unifiable interface.
 */
public class IndexList extends AbstractType {

	private final List<TypeIdentifier> indexSets;

	public IndexList(List<TypeIdentifier> indexSets) {
		this.indexSets = indexSets;
	}

	public IndexList(TypeIdentifier indexSet) {
		indexSets = new ArrayList<TypeIdentifier>();
		indexSets.add(indexSet);
	}

	public IndexList() {
		this.indexSets = new ArrayList<TypeIdentifier>();
	}

	@Override
	public int hashCode() {
		return indexSets.hashCode();
	}

	@Override
	public boolean equals(Object other) {
		if (other == this) {
			return true;
		}
		if (!(other instanceof IndexList)) {
			return false;
		}
		IndexList otherDimension = (IndexList) other;
		return indexSets.equals(otherDimension.indexSets);
	}

	@Override
	public String toString() {
		return String.format("%s%s", super.toString(), indexSets);
	}

	public List<TypeIdentifier> getIndexSets() {
		return indexSets;
	}

	public int width() {
		return indexSets.size();
	}

	public TypeIdentifier nthIndexSet(int n) {
		return indexSets.get(n);
	}

	@Override
	public void printText(PrintWriter out) {
		out.print("[");
		String sep = "";
		for (TypeIdentifier id : indexSets) {
			out.print(sep);
			out.print(id.name);
			sep = ", ";
		}
		out.print("]");
	}

	@Override
	public Set<TypeVar> typeVars() {
		Set<TypeVar> vars = new LinkedHashSet<TypeVar>();
		return vars;
	}

	@Override
	public ConstraintSet unificationConstraints(PacioliType other)
			throws PacioliException {
		if (!equals(other)) {
			throw new PacioliException("Dimensions not equal.");
		} else {
			return new ConstraintSet();
		}
	}

	@Override
	public PacioliType applySubstitution(Substitution subs) {
		return this;
	}

	IndexList kronecker(IndexType other) {
		List<TypeIdentifier> sets = new ArrayList<TypeIdentifier>();
		sets.addAll(indexSets);
		sets.addAll(other.getIndexSets());
		return new IndexList(sets);
	}

	public IndexList project(List<Integer> columns) {
		List<TypeIdentifier> sets = new ArrayList<TypeIdentifier>();
		for (Integer column : columns) {
			sets.add(indexSets.get(column.intValue()));
		}
		return new IndexList(sets);
	}

	@Override
	public String compileToJS() {

		StringBuilder out = new StringBuilder();

		out.append("new Pacioli.Type('coordinates', [");
		String pre = "";
		for (int i = 0; i < indexSets.size(); i++) {
			out.append(pre);
			out.append("Pacioli.fetchIndex('");
			out.append(indexSets.get(i).home);
			out.append("', '");
			out.append(indexSets.get(i).name);
			out.append("')");
			pre = ", ";
		}
		out.append("])");

		return out.toString();
	}

	@Override
	public String description() {
		return "index list";
	}

	@Override
	public PacioliType reduce() {
		return this;
	}

	@Override
	public List<Unit> simplificationParts() {
		List<Unit> parts = new ArrayList<Unit>();
		return parts;
	}

}
