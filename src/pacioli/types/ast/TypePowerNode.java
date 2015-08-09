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

package pacioli.types.ast;

import java.io.PrintWriter;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.unit.NumberUnitNode;
import pacioli.ast.unit.UnitNode;
import pacioli.types.PacioliType;
import pacioli.types.matrix.MatrixType;
import uom.Fraction;

public class TypePowerNode extends AbstractTypeNode {

    private final TypeNode base;
    private final Integer power;

    public TypePowerNode(Location location, TypeNode base, NumberUnitNode power) {
        super(location);
        this.base = base;
        this.power = Integer.parseInt(power.toText());
    }

    private TypePowerNode(Location location, TypeNode base, Integer power) {
        super(location);
        this.base = base;
        this.power = power;
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("%s^%s", base, power);
    }

    @Override
    public PacioliType eval(boolean reduce) throws PacioliException {
        PacioliType baseType = base.eval(reduce);
        
        if (!(baseType instanceof MatrixType)) {
            throw new PacioliException(getLocation(), "Matrix type expected for power but got a %s", baseType.description());
        }
        
        MatrixType matrix = (MatrixType) baseType;
        return matrix.raise(new Fraction(power));
    }

    @Override
	public String compileToMVM(CompilationSettings settings) {
		String leftMVM = base.compileToMVM(settings);
		return "shape_expt(" + leftMVM + ", " + power + ")";

	}
	
	@Override
	public String compileToJS(boolean boxed) {
		return base.compileToJS(false) + ".expt(" + power + ")";
	}

	@Override
	public Set<Definition> uses() {
		return base.uses();
	}

	@Override
	public TypeNode resolved(Dictionary dictionary, TypeContext context)
			throws PacioliException {
		return new TypePowerNode(
				getLocation(),
				base.resolved(dictionary, context),
				power);
	}
}
