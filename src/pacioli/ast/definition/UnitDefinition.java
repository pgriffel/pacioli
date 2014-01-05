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
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.Program;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;
import uom.NamedUnit;

public class UnitDefinition extends AbstractDefinition {

    private final IdentifierNode id;
    private final String symbol;
    private final UnitNode body;
    private UnitNode resolvedBody;

    public UnitDefinition(Location location, IdentifierNode id, String symbol) {
        super(location);
        this.id = id;
        this.symbol = symbol;
        this.body = null;
    }
    
    public UnitDefinition(Location location, IdentifierNode id, String symbol, UnitNode body) {
        super(location);
        this.id = id;
        this.symbol = symbol;
        this.body = body;
    }

	@Override
	public void addToProgram(Program program, Module module) {
		setModule(module);
		program.addUnitDefinition(this, module);
	}
	
    // todo: remove
//    public NamedUnit getUnit() {
//    	if (body == null) {
//    		return new NamedUnit(symbol);
//    	} else {
//    		assert resolvedBody != null;
//    		return new NamedUnit(symbol, resolvedBody.eval());
//    	}
//    }

    @Override
    public void printText(PrintWriter out) {
        out.format("unit definition %s = %s", id.toText(), body.toText());
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
    public void resolve(Dictionary dictionary) throws PacioliException {
    	if (body != null) {
    		resolvedBody = body.resolved(dictionary);
    	}
    }

    @Override
    public Set<Definition> uses() {
        return resolvedBody.uses();
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        if (body == null) {
            return String.format("baseunit \"%s\" \"%s\";\n", id.getName(), symbol);
        } else {
            return String.format("unit \"%s\" \"%s\" %s;\n", id.getName(), symbol, body.eval().flat().toText());
        }
    }

    @Override
    public String compileToJS() {
    	if (body == null) {
    		return String.format("function compute_%s () {return {symbol: '%s'}}", 
    				globalName(), symbol);
    	} else {
    		return String.format("function compute_%s () {return {definition: %s, symbol: '%s'}}", 
    				globalName(), body.compileToJS(), symbol);
    	}
    }

    @Override
    public String compileToMATLAB() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

}
