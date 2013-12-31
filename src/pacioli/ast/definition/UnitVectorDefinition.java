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

package pacioli.ast.definition;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.Utils;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;
import mvm.values.matrix.IndexSet;
import mvm.values.matrix.UnitVector;
import uom.Unit;

public class UnitVectorDefinition extends AbstractDefinition {

    private final IdentifierNode indexId;
    private final IdentifierNode id;
    private final Map<String, UnitNode> items;
    private Unit[] unitArray;
    private UnitVector vector;

    public UnitVectorDefinition(Module module, Location location, IdentifierNode indexId, IdentifierNode id, Map<String, UnitNode> items) {
        super(module, location);
        this.indexId = indexId;
        this.id = id;
        this.items = items;
        unitArray = null;
        vector = null;
    }

    @Override
    public void printText(PrintWriter out) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String localName() {
        return indexId.getName() + "!" + id.getName();
    }

    @Override
    public void updateDictionary(Dictionary dictionary, boolean reduce) throws PacioliException {
        String indexSetName = indexId.getName();
        String name = id.getName();
        Map<String, UnitNode> def = items;

        if (dictionary.containsIndexSetDefinition(indexSetName)) {
            IndexSet set = dictionary.getCompileTimeIndexSet(indexSetName);

            unitArray = new Unit[set.size()];
            for (int i = 0; i < set.size(); i++) {
                String item = set.ElementAt(i);
                if (def.containsKey(item)) {
                    unitArray[i] = def.get(item).eval();
                } else {
                    unitArray[i] = Unit.ONE;
                }
            }

            Unit[] translatedArray = new Unit[unitArray.length];
            for (int i = 0; i < unitArray.length; i++) {
                translatedArray[i] = dictionary.translateUnit(unitArray[i]);
            }
            vector = new UnitVector(set, name, translatedArray);
        } else {
            throw new PacioliException("Index set '%s' unknown", indexSetName);
        }

        assert (vector != null);
        dictionary.putUnitVector(localName(), vector);
    }

    @Override
    public void resolveNames(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException {
    }

    @Override
    public Set<Definition> uses() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        assert (unitArray != null);
        List<String> unitTexts = new ArrayList<String>();
        for (int i = 0; i < unitArray.length; i++) {
            unitTexts.add(unitArray[i].toText());
        }
        return String.format("\nunitvector \"%s\" \"%s\" list(%s);",
                indexId.getName(),
                id.getName(),
                Utils.intercalate(", ", unitTexts));
    }

    @Override
    public String compileToJS() {
    	StringBuilder builder = new StringBuilder();
    	builder.append("function compute_").append(id.getName()).append(" () {");
    	builder.append("return {units:{");
    	boolean sep = false;
    	for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
    		if (sep) {builder.append(",");} else {sep = true;}
    		builder.append(entry.getKey());
    		builder.append(":");
    		builder.append(entry.getValue().compileToJS());
    		builder.append("");
    	}
    	builder.append("}}}");
        		
        return builder.toString();
    }

    @Override
    public String compileToMATLAB() {
        throw new UnsupportedOperationException("MATLAB and Octave have no units.");
    }
}
