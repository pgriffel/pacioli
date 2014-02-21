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
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.Utils;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.TypeDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVar;
import pacioli.types.matrix.DimensionType;
import pacioli.types.matrix.MatrixType;

public class TypeApplicationNode extends AbstractTypeNode {

    private final TypeIdentifierNode op;
    private final List<TypeNode> args;

    public TypeApplicationNode(Location location, TypeIdentifierNode name, List<TypeNode> args) {
        super(location);
        this.op = name;
        this.args = args;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print(op);
        out.print("(");
        out.print(Utils.intercalateText(", ", args));
        out.print(")");
    }

    public TypeIdentifierNode getOperator() {
    	return op;
    }
    
    public String getName() {
    	return op.getName();
    }
    
    public List<TypeNode> getArgs() {
    	return args;
    }

	@Override
	public Set<Definition> uses() {
		Set<Definition> set = new HashSet<Definition>();
        set.addAll(op.uses());
        for (TypeNode arg : args) {
        	set.addAll(arg.uses());
        }
        return set;
	}

	@Override
	public TypeNode resolved(Dictionary dictionary, TypeContext context)
			throws PacioliException {
		List<TypeNode> resolvedArgs = new ArrayList<TypeNode>();
		for (TypeNode arg : args) {
        	resolvedArgs.add(arg.resolved(dictionary, context));
        }
		TypeIdentifierNode resolvedOp = op.resolveAsType(dictionary, context);
		return new TypeApplicationNode(getLocation(), resolvedOp, resolvedArgs);
	}    
    @Override
    public PacioliType eval(boolean reduce) throws PacioliException {

        List<PacioliType> types = new ArrayList<PacioliType>();
        for (TypeNode arg : args) {
            types.add(arg.eval(reduce));
        }

        if (op.getName().equals("Index")) {
            if (types.size() == 1 && types.get(0) instanceof TypeVar) {
                return types.get(0);
            } else {
                List<TypeIdentifier> names = new ArrayList<TypeIdentifier>();
                for (int i = 0; i < types.size(); i++) {
                    PacioliType type = types.get(i);
                    assert (type instanceof TypeVar || type instanceof MatrixType);
                    if (type instanceof MatrixType) {
                        assert (args.get(i) instanceof TypeIdentifierNode);
                        TypeIdentifier id = ((TypeIdentifierNode) args.get(i)).typeIdentifier();
                        names.add(id);
                    } else {
                        throw new RuntimeException(String.format("Index set expected but found '%s'", type.toText()));
                    }
                }
                return new DimensionType(names);
            }
        } else {
        	//if (reduce && op.getDefinition() != null) {
        	if (op.getDefinition() != null) {
        		assert(op.getDefinition() instanceof TypeDefinition);
            	TypeDefinition typeDefinition = (TypeDefinition) op.getDefinition();
                return typeDefinition.constaint(true).reduce(new ParametricType(op.getName(), types));
            } else {
            	return new ParametricType(op.getName(), types);
            }
        }
    }

}
