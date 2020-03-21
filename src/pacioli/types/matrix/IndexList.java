package pacioli.types.matrix;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.symboltable.IndexSetInfo;
import pacioli.types.AbstractType;
import pacioli.types.PacioliType;
import pacioli.types.TypeBase;
import pacioli.types.TypeIdentifier;
import pacioli.types.Var;
import pacioli.types.ast.TypeNode;
import uom.Unit;

/*
 *  Not really a type, but otherwise it cannot be put in a substitution. Make a Unifiable interface.
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

    public IndexSetInfo nthIndexSetInfo(int n) {
        return indexSetInfos.get(n);
    }
    
    @Override
    public void printPretty(PrintWriter out) {
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
    public Set<Var> typeVars() {
        Set<Var> vars = new LinkedHashSet<Var>();
        return vars;
    }

    @Override
    public Set<String> unitVecVarCompoundNames() {
        return new LinkedHashSet<String>();
    }

    @Override
    public ConstraintSet unificationConstraints(PacioliType other) throws PacioliException {
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

    IndexList kronecker(IndexList other) {
        List<TypeIdentifier> sets = new ArrayList<TypeIdentifier>();
        sets.addAll(indexSets);
        sets.addAll(other.getIndexSets());
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

    @Override
    public String compileToJS() {

        StringBuilder out = new StringBuilder();

        out.append("new Pacioli.Type('coordinates', [");
        String pre = "";
        for (int i = 0; i < indexSets.size(); i++) {
            out.append(pre);
            out.append("Pacioli.fetchIndex('");
            out.append(indexSets.get(i).home);
            out.append("_");
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
    public List<Unit<TypeBase>> simplificationParts() {
        List<Unit<TypeBase>> parts = new ArrayList<Unit<TypeBase>>();
        return parts;
    }

    @Override
    public String compileToMVM() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public TypeNode deval() {
        throw new RuntimeException("deval of index list should be handled by the matrix type");
    }
}
