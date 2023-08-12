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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import pacioli.ast.Visitor;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.misc.Location;
import pacioli.misc.PacioliException;
import pacioli.symboltable.info.IndexSetInfo;

public class KeyNode extends AbstractExpressionNode {

    public final List<String> indexSets;
    public final List<String> keys;

    private Optional<List<IndexSetInfo>> infos = Optional.empty();

    public KeyNode(Location location) {
        super(location);
        indexSets = new ArrayList<String>();
        keys = new ArrayList<String>();
    }

    public KeyNode(KeyNode old) {
        super(old.getLocation());
        indexSets = old.indexSets;
        keys = old.keys;
    }

    public KeyNode(String indexSet, String key, Location location) {
        super(location);
        indexSets = Arrays.asList(indexSet);
        keys = Arrays.asList(key);
    }

    public KeyNode(Location location, List<String> indexSets, List<String> keys) {
        super(location);
        this.indexSets = new ArrayList<String>(indexSets);
        this.keys = new ArrayList<String>(keys);
    }

    public KeyNode merge(KeyNode other) {

        assert (!infos.isPresent());
        assert (!other.infos.isPresent());

        List<String> mergedIndexSets = new ArrayList<String>(indexSets);
        List<String> mergedKeys = new ArrayList<String>(keys);

        Location mergedLocation = getLocation().join(other.getLocation());

        mergedIndexSets.addAll(other.indexSets);
        mergedKeys.addAll(other.keys);

        return new KeyNode(mergedLocation, mergedIndexSets, mergedKeys);
    }

    public List<IndexSetInfo> getInfos() {
        if (infos.isPresent()) {
            return infos.get();
        } else {
            throw new RuntimeException("Cannot get infos, key has not been resolved.");
        }
    }

    public IndexSetInfo getInfo(Integer index) {
        return getInfos().get(index);
    }

    public void setInfos(List<IndexSetInfo> infos) {
        this.infos = Optional.of(infos);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public Integer position(Integer index) {

        String key = keys.get(index);

        Optional<IndexSetDefinition> definition = getInfo(index).definition();
        assert (definition.isPresent());
        List<String> items = definition.get().getItems();

        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).equals(key)) {
                return i;
            }
        }
        // throw new RuntimeException("Key not found", new
        // PacioliException(getLocation(), "index = %s", index));
        throw new PacioliException(getLocation(), "Key %s not found", index);
    }

    public Integer size(Integer index) {
        Optional<IndexSetDefinition> definition = getInfo(index).definition();
        assert (definition.isPresent());
        return definition.get().getItems().size();
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
