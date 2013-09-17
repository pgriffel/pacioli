/*
 * Copyright (c) 2013 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pacioli.ast.expression;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ast.definition.Definition;
import pacioli.types.PacioliType;
import pacioli.types.matrix.DimensionType;

public class KeyNode extends AbstractExpressionNode {

    private final List<String> indexSets;
    private final List<String> keys;
    private final List<Integer> positions;
    private final List<Integer> sizes;

    public KeyNode(Location location) {
        super(location);
        indexSets = new ArrayList<String>();
        keys = new ArrayList<String>();
        positions = null;
        sizes = null;
    }

    public KeyNode(String indexSet, String key, Location location) {
        super(location);
        indexSets = Arrays.asList(indexSet);
        keys = Arrays.asList(key);
        positions = null;
        sizes = null;
    }

    private KeyNode(Location location, List<String> indexSets, List<String> keys, List<Integer> positions, List<Integer> sizes) {
        super(location);
        this.indexSets = new ArrayList<String>(indexSets);
        this.keys = new ArrayList<String>(keys);
        this.positions = positions == null ? null : new ArrayList<Integer>(positions);
        this.sizes = sizes == null ? null : new ArrayList<Integer>(sizes);
    }

    public KeyNode merge(KeyNode other) {

        List<String> mergedIndexSets = new ArrayList<String>(indexSets);
        List<String> mergedKeys = new ArrayList<String>(keys);
        List<Integer> mergedPositions = null;
        List<Integer> mergedSizes = null;

        Location mergedLocation = getLocation().join(other.getLocation());

        mergedIndexSets.addAll(other.indexSets);
        mergedKeys.addAll(other.keys);

        if (positions != null && other.positions != null) {
            mergedPositions = new ArrayList<Integer>(positions);
            mergedSizes = new ArrayList<Integer>(sizes);

            mergedPositions.addAll(other.positions);
            mergedSizes.addAll(other.sizes);
        }

        return new KeyNode(mergedLocation, mergedIndexSets, mergedKeys, mergedPositions, mergedSizes);
    }

    @Override
    public void printText(PrintWriter out) {
        int size = indexSets.size();
        if (size == 0) {
            out.print("_");
        } else {
            for (int i = 0; i < size; i++) {
                if (0 < i) {
                    out.print(":");
                }
                out.print(indexSets.get(i));
                out.print('@');
                out.print(keys.get(i));
            }
        }
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException {

        List<Integer> positionList = new ArrayList<Integer>();
        List<Integer> sizeList = new ArrayList<Integer>();

        int size = indexSets.size();
        for (int i = 0; i < size; i++) {
            String setName = indexSets.get(i);
            String key = keys.get(i);
            if (!dictionary.containsIndexSetDefinition(setName)) {
                throw new PacioliException(getLocation(), "Index set '%s' unknown", setName);
            } else {
                // todo :: checken. wsa eerst indexOf van indexSets defintion!!!!!!!!!!!!!!!!!!!!!!!!
                int pos = dictionary.getIndexSetDefinition(setName).getIndexSet().ElementPosition(key);
                if (pos < 0) {
                    throw new PacioliException(getLocation(), "Key '%s' not in index set '%s'", key, setName);
                } else {
                    positionList.add(pos);
                    sizeList.add(dictionary.getIndexSetDefinition(setName).getIndexSet().size());
                }
            }
        }

        return new KeyNode(getLocation(), indexSets, keys, positionList, sizeList);
    }

    @Override
    public Typing inferTyping(Dictionary dictionary, Map<String, PacioliType> context) throws PacioliException {
        return new Typing(new DimensionType(indexSets));
    }

    @Override
    public Set<Definition> uses() {
        return new HashSet<Definition>();
    }

    @Override
    public ExpressionNode transformCalls(CallMap map) {
        return this;
    }

    @Override
    public ExpressionNode transformIds(IdMap map) {
        return this;
    }

    @Override
    public ExpressionNode transformSequences(SequenceMap map) {
        return this;
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        return new LinkedHashSet<IdentifierNode>();
    }

    @Override
    public ExpressionNode equivalentFunctionalCode() {
        return this;
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        String code = "key(";
        int size = indexSets.size();
        for (int i = 0; i < size; i++) {
            if (0 < i) {
                code += ", ";
            }
            code += "\"" + indexSets.get(i) + "\"";
            code += ", ";
            code += "\"" + keys.get(i) + "\"";
        }
        code += ")";
        return code;
    }

    @Override
    public String compileToJS() {
        int totalSize = 1;
        int index = 0;
        int size = indexSets.size();
        for (int i = 0; i < size; i++) {
            index += positions.get(i) * totalSize;
            totalSize *= sizes.get(i);
        }
        return String.format("[%s,%s]", index, totalSize);
    }

    @Override
    public String compileToMATLAB() {
        int totalSize = 1;
        int index = 0;
        int size = indexSets.size();
        for (int i = 0; i < size; i++) {
            index += positions.get(i) * totalSize;
            totalSize *= sizes.get(i);
        }
        return String.format("{%s,%s}", index, totalSize);
    }
}
