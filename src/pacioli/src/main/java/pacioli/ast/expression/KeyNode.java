/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.ast.expression;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.IndexSetInfo;
import pacioli.types.ast.TypeIdentifierNode;

public class KeyNode extends AbstractNode implements ExpressionNode {

    public final List<TypeIdentifierNode> indexSets;

    // The keys are not resolved. Could also be List<String>, but
    // the IdentifierNode carries location info.
    public final List<IdentifierNode> keys;

    public KeyNode(Location location) {
        super(location);
        indexSets = new ArrayList<TypeIdentifierNode>();
        keys = new ArrayList<IdentifierNode>();
    }

    public KeyNode(KeyNode old) {
        super(old.location());
        indexSets = old.indexSets;
        keys = old.keys;
    }

    public KeyNode(TypeIdentifierNode indexSet, IdentifierNode key, Location location) {
        super(location);
        indexSets = Arrays.asList(indexSet);
        keys = Arrays.asList(key);
    }

    public KeyNode(Location location, List<TypeIdentifierNode> indexSets, List<IdentifierNode> keys) {
        super(location);
        this.indexSets = new ArrayList<TypeIdentifierNode>(indexSets);
        this.keys = new ArrayList<IdentifierNode>(keys);
    }

    public KeyNode merge(KeyNode other) {

        List<TypeIdentifierNode> mergedIndexSets = new ArrayList<>(indexSets);
        List<IdentifierNode> mergedKeys = new ArrayList<IdentifierNode>(keys);

        Location mergedLocation = location().join(other.location());

        mergedIndexSets.addAll(other.indexSets);
        mergedKeys.addAll(other.keys);

        return new KeyNode(mergedLocation, mergedIndexSets, mergedKeys);
    }

    public IndexSetInfo getInfo(Integer index) {
        return (IndexSetInfo) this.indexSets.get(index).info;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public Integer position(Integer index) {

        String key = keys.get(index).name();

        Optional<IndexSetDefinition> definition = getInfo(index).definition();
        assert (definition.isPresent());
        List<String> items = definition.get().items();

        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).equals(key)) {
                return i;
            }
        }

        throw new PacioliException(location(), "Key %s not found", index);
    }

    public Integer width() {
        return this.indexSets.size();
    }

    public Integer size(Integer index) {
        Optional<IndexSetDefinition> definition = getInfo(index).definition();
        assert (definition.isPresent());
        return definition.get().items().size();
    }

    public Integer position() {
        int totalSize = 1;
        int index = 0;
        for (int i = 0; i < keys.size(); i++) {
            index += position(i) * totalSize;
            totalSize *= size(i);
        }
        return index;
    }

    public Integer size() {
        int totalSize = 1;
        for (int i = 0; i < keys.size(); i++) {
            totalSize *= size(i);
        }
        return totalSize;
    }
}
