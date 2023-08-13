package pacioli.types.matrix;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.types.AbstractType;
import pacioli.types.ConstraintSet;
import pacioli.types.TypeObject;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVisitor;

/*
 *  Not really a type, but otherwise it cannot be put in a substitution.
 */
public class IndexList extends AbstractType {

    private final List<TypeIdentifier> indexSets;
    private final List<IndexSetInfo> indexSetInfos;

    public IndexList(List<TypeIdentifier> indexSets, List<IndexSetInfo> indexSetInfos) {
        this.indexSets = indexSets;
        this.indexSetInfos = indexSetInfos;
    }

    public IndexList(TypeIdentifier indexSet, IndexSetInfo indexSetInfo) {
        indexSets = Arrays.asList(indexSet);
        indexSetInfos = Arrays.asList(indexSetInfo);
    }

    public IndexList() {
        this.indexSets = new ArrayList<TypeIdentifier>();
        this.indexSetInfos = new ArrayList<IndexSetInfo>();
    }

    @Override
    public String description() {
        return "index list";
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("<index");
        String pre = " ";
        for (TypeIdentifier id : indexSets) {
            builder.append(pre);
            builder.append("'");
            builder.append(id.name());
            builder.append("'");
            pre = ", ";
        }
        builder.append(">");
        return builder.toString();
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

    public List<TypeIdentifier> indexSets() {
        return indexSets;
    }

    public int width() {
        return indexSets.size();
    }

    public TypeIdentifier nthIndexSet(int n) {
        return indexSets.get(n);
    }

    public IndexSetInfo nthIndexSetInfo(int n) {
        return indexSetInfos.get(n);
    }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        if (!equals(other)) {
            throw new PacioliException("Dimensions not equal.");
        } else {
            return new ConstraintSet();
        }
    }

    IndexList kronecker(IndexList other) {
        List<TypeIdentifier> sets = new ArrayList<TypeIdentifier>();
        sets.addAll(indexSets);
        sets.addAll(other.indexSets());
        List<IndexSetInfo> infos = new ArrayList<IndexSetInfo>();
        infos.addAll(indexSetInfos);
        infos.addAll(other.indexSetInfos);
        return new IndexList(sets, infos);
    }

    public IndexList project(List<Integer> columns) {
        List<TypeIdentifier> sets = new ArrayList<TypeIdentifier>();
        List<IndexSetInfo> infos = new ArrayList<IndexSetInfo>();
        for (Integer column : columns) {
            sets.add(indexSets.get(column.intValue()));
            infos.add(indexSetInfos.get(column.intValue()));
        }
        return new IndexList(sets, infos);
    }

}
