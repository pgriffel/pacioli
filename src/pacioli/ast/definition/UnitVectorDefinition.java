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

package pacioli.ast.definition;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.PacioliException;
import pacioli.Program;
import pacioli.TypeContext;
import pacioli.Utils;
import pacioli.ast.unit.UnitNode;
import pacioli.types.ast.TypeIdentifierNode;
import uom.DimensionedNumber;

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
    public void addToProgram(Program program, PacioliFile module) {
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
        List<String> unitTexts = new ArrayList<String>();
        for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
            DimensionedNumber number = entry.getValue().eval();
            unitTexts.add("\"" + entry.getKey() + "\": " + Utils.compileUnitToMVM(number.unit()));
        }
        return String.format("\nunitvector \"%s\" \"%s\" list(%s);",
                resolvedIndexSet.getDefinition().globalName(),
                indexSetNode.getName()+"!"+unitNode.getName(),
                Utils.intercalate(", ", unitTexts));
    }

    @Override
    public String compileToJS(boolean boxed) {
    	StringBuilder builder = new StringBuilder();
    	builder.append("function compute_").append(globalName()).append(" () {");
    	builder.append("return {units:{");
    	boolean sep = false;
    	for (Map.Entry<String, UnitNode> entry: items.entrySet()) {
    		if (sep) {builder.append(",");} else {sep = true;}
    		builder.append("'");
    		builder.append(entry.getKey());
    		builder.append("':");
                builder.append(Utils.compileUnitToJS(entry.getValue().eval().unit()));
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
