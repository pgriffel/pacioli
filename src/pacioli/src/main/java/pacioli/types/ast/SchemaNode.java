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

import java.util.List;

import pacioli.Location;
import pacioli.TypeContext;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.TypeSymbolInfo;

public class SchemaNode extends AbstractTypeNode {

    // public final TypeContext context;
    public final List<ContextNode> contextNodes;
    public final TypeNode type;
    public SymbolTable<TypeSymbolInfo> table;

    public SchemaNode(Location location, List<ContextNode> contextNodes, TypeNode type) {
        super(location);
        this.contextNodes = contextNodes;
        this.type = type;
    }

    public SchemaNode transform(TypeNode type) {
        return new SchemaNode(getLocation(), contextNodes, type);
    }

    public TypeContext createContext() {
        TypeContext context = new TypeContext();
        for (ContextNode cn : contextNodes) {
            for (TypeIdentifierNode id : cn.ids) {
                switch (cn.kind) {
                    case TYPE: {
                        context.addTypeVar(id.getName());
                        break;
                    }
                    case INDEX: {
                        context.addIndexVar(id.getName());
                        break;
                    }
                    case UNIT: {
                        context.addUnitVar(id.getName());
                        break;
                    }
                    case OP: {
                        context.addOpVar(id.getName());
                        break;
                    }
                }
            }
        }
        return context;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
