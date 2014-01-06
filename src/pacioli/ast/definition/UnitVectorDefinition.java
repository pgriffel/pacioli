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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import mvm.values.matrix.UnitVector;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.Program;
import pacioli.TypeContext;
import pacioli.Utils;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.types.ast.TypeIdentifierNode;
import uom.Unit;

public class UnitVectorDefinition extends AbstractDefinition {

    private final TypeIdentifierNode indexSetNode;
    private final TypeIdentifierNode unitNode;
    private final Map<String, UnitNode> items;
    private TypeIdentifierNode resolvedIndexSet;
    private Map<String, UnitNode> resolvedItems;

    public UnitVectorDefinition(Location location, TypeIdentifierNode indexSet, TypeIdentifierNode unit, Map<String, UnitNode> items) {
        super(location);
        this.indexSetNode = indexSet;
        this.unitNode = unit;
        this.items = items;
    }

	@Override
	public void addToProgram(Program program, Module module) {
		setModule(module);
		program.addUnitVectorDefinition(this, module);
	}
    
    @Override
    public void printText(PrintWriter out) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String localName() {
        return indexSetNode.getName() + "!" + unitNode.getName();
    }

    @Override
    public String globalName() {
        return String.format("unitvec_%s_%s_%s", getModule().getName(), indexSetNode.getName(), unitNode.getName());
    }

    @Override
    public void resolve(Dictionary dictionary) throws PacioliException {
    	resolvedIndexSet = (TypeIdentifierNode) indexSetNode.resolved(dictionary, new TypeContext());
    	resolvedItems = new HashMap<String, UnitNode>();
    	for (Entry<String, UnitNode> entry: items.entrySet()) {
    		resolvedItems.put(entry.getKey(), entry.getValue().resolved(dictionary));
    	}
    }

    @Override
    public Set<Definition> uses() {
    	assert resolvedItems != null;
        Set<Definition> set = new HashSet<Definition>();
        for (UnitNode unitNode: resolvedItems.values()) {
    		set.addAll(unitNode.uses());
    	}
        return set;
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        /*assert (unitArray != null);
        List<String> unitTexts = new ArrayList<String>();
        for (int i = 0; i < unitArray.length; i++) {
            unitTexts.add(unitArray[i].toText());
        }
        return String.format("\nunitvector \"%s\" \"%s\" list(%s);",
                indexSetNode.getName(),
                unitNode.getName(),
                Utils.intercalate(", ", unitTexts));*/
//        assert (unitArray != null);
        List<String> unitTexts = new ArrayList<String>();
//        for (int i = 0; i < unitArray.length; i++) {
//            unitTexts.add(unitArray[i].toText());
//        }
        for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
        	unitTexts.add("\"" + entry.getKey() + "\": " + entry.getValue().compileToMVM(settings));
        }
        return String.format("\nunitvector \"%s\" \"%s\" list(%s);",
                //indexSetNode.getName(),
                resolvedIndexSet.getDefinition().globalName(),
                indexSetNode.getName()+"!"+unitNode.getName(),
                Utils.intercalate(", ", unitTexts));
    }

    @Override
    public String compileToJS() {
    	StringBuilder builder = new StringBuilder();
    	builder.append("function compute_").append(globalName()).append(" () {");
    	builder.append("return {units:{");
    	boolean sep = false;
    	for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
    		if (sep) {builder.append(",");} else {sep = true;}
    		builder.append("'");
    		builder.append(entry.getKey());
    		builder.append("':");
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
