/*
 * Copyright (c) 2013 - 2014 Paul Griffioen
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
import java.util.List;
import pacioli.Location;
import pacioli.ast.Visitor;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.symboltable.IndexSetInfo;

public class KeyNode extends AbstractExpressionNode {

    public final List<String> indexSets;
    public final List<String> keys;
    public final List<IndexSetDefinition> indexSetDefinitions;
    public List<IndexSetInfo> info;

    public KeyNode(Location location) {
        super(location);
        indexSets = new ArrayList<String>();
        keys = new ArrayList<String>();
        indexSetDefinitions = null;
    }

    public KeyNode(KeyNode old) {
        super(old.getLocation());
        indexSets = old.indexSets;
        keys = old.keys;
        indexSetDefinitions = old.indexSetDefinitions;
    }

    public KeyNode(String indexSet, String key, Location location) {
        super(location);
        indexSets = Arrays.asList(indexSet);
        keys = Arrays.asList(key);
        indexSetDefinitions = null;
    }

    public KeyNode(Location location, List<String> indexSets, List<String> keys,
            List<IndexSetDefinition> indexSetDefinitions) {
        super(location);
        this.indexSets = new ArrayList<String>(indexSets);
        this.keys = new ArrayList<String>(keys);
        this.indexSetDefinitions = indexSetDefinitions == null ? null
                : new ArrayList<IndexSetDefinition>(indexSetDefinitions);
    }

    public KeyNode merge(KeyNode other) {

        List<String> mergedIndexSets = new ArrayList<String>(indexSets);
        List<String> mergedKeys = new ArrayList<String>(keys);
        List<IndexSetDefinition> mergedDefinitions = null;

        Location mergedLocation = getLocation().join(other.getLocation());

        mergedIndexSets.addAll(other.indexSets);
        mergedKeys.addAll(other.keys);

        if (indexSetDefinitions != null && other.indexSetDefinitions != null) {
            mergedDefinitions = new ArrayList<IndexSetDefinition>(indexSetDefinitions);
            mergedDefinitions.addAll(other.indexSetDefinitions);
        }

        return new KeyNode(mergedLocation, mergedIndexSets, mergedKeys, mergedDefinitions);
    }

    @Override
    public void printText(PrintWriter out) {
        int size = indexSets.size();
        if (size == 0) {
            out.print("_");
        } else {
            for (int i = 0; i < size; i++) {
                if (0 < i) {
                    out.print("%");
                }
                out.print(indexSets.get(i));
                out.print('@');
                out.print(keys.get(i));
            }
        }
    }

    @Override
    public String compileToJS(boolean boxed) {
        StringBuilder builder = new StringBuilder();
        builder.append("Pacioli.createCoordinates([");
        for (int i = 0; i < keys.size(); i++) {
            if (0 < i)
                builder.append(",");
            builder.append("['");
            builder.append(keys.get(i));
            builder.append("','");
            builder.append(indexSetDefinitions.get(i).globalName());
            builder.append("']");
        }
        builder.append("])");
        return builder.toString();
        /*
         * int totalSize = 1; int index = 0; int size = indexSets.size(); for (int i =
         * 0; i < size; i++) { index += positions.get(i) * totalSize; totalSize *=
         * sizes.get(i); } return String.format("[%s,%s]", index, totalSize);
         */
    }

    @Override
    public String compileToMATLAB() {
        int totalSize = 1;
        int index = 0;
        int size = indexSets.size();
        for (int i = 0; i < size; i++) {
            // index += positions.get(i) * totalSize;
            // totalSize *= sizes.get(i);
        }
        return String.format("{%s,%s}", index, totalSize);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
