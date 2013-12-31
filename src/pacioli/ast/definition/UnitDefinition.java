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

import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.types.ast.TypeNode;

import java.io.PrintWriter;
import java.util.Map;
import java.util.Set;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import uom.NamedUnit;
import uom.Unit;

public class UnitDefinition extends AbstractDefinition {

    private final IdentifierNode id;
    private final String symbol;
    private final UnitNode definition;

    public UnitDefinition(Module module, Location location, IdentifierNode id, String symbol, UnitNode definition) {
        super(module, location);
        this.id = id;
        this.symbol = symbol;
        this.definition = definition;
    }

    // todo: remove
    public NamedUnit getUnit() {
    	if (definition == null) {
    		return new NamedUnit(symbol);
    	} else {
    		return new NamedUnit(symbol, definition.eval());
    	}
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("unit definition %s = %s", id.toText(), definition.toText());
    }

    @Override
    public String localName() {
        return id.getName();
    }
    
    @Override
    public String globalName() {
        return String.format("unit_%s", localName());
    }
    
    @Override
    public void updateDictionary(Dictionary dictionary, boolean reduce) throws PacioliException {
    	if (definition == null) {
    		dictionary.addUnit(id.getName(), new NamedUnit(symbol));
    	} else {
    		Unit unit = new NamedUnit(symbol, definition.eval());
    		Unit translatedDef = dictionary.translateUnit(unit.flat());
    		NamedUnit translatedUnit = new NamedUnit(symbol, translatedDef);
    		dictionary.addUnit(id.getName(), translatedUnit);
    	}
    }

    @Override
    public void resolveNames(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public Set<Definition> uses() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        if (definition == null) {
            return String.format("baseunit \"%s\" \"%s\";\n", id.getName(), symbol);
        } else {
            return String.format("unit \"%s\" \"%s\" %s;\n", id.getName(), symbol, definition.eval().flat().toText());
        }
    }

    @Override
    public String compileToJS() {
    	if (definition == null) {
    		return String.format("function compute_%s () {return {symbol: '%s'}}", 
    				globalName(), symbol);
    	} else {
    		return String.format("function compute_%s () {return {definition: %s, symbol: '%s'}}", 
    				globalName(), definition.compileToJS(), symbol);
    	}
    }

    @Override
    public String compileToMATLAB() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
