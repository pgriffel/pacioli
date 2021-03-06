package pacioli.visitors;

import java.util.List;
import java.util.Optional;

import pacioli.Printer;
import pacioli.ast.ImportNode;
import pacioli.ast.IncludeNode;
import pacioli.ast.Node;
import pacioli.ast.ProgramNode;
import pacioli.ast.Visitor;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.IfStatementNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetFunctionBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.LetTupleBindingNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixLiteralNode.ValueDecl;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.expression.ProjectionNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.WhileNode;
import pacioli.ast.expression.LetNode.BindingNode;
import pacioli.ast.unit.NumberUnitNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.ast.unit.UnitOperationNode;
import pacioli.ast.unit.UnitPowerNode;
import pacioli.symboltable.ValueInfo;
import pacioli.types.PacioliType;
import pacioli.types.ast.BangTypeNode;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.NumberTypeNode;
import pacioli.types.ast.PrefixUnitTypeNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeDivideNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeKroneckerNode;
import pacioli.types.ast.TypeMultiplyNode;
import pacioli.types.ast.TypePerNode;
import pacioli.types.ast.TypePowerNode;

public class PrintVisitor implements Visitor {

    Printer out;
    
    public PrintVisitor(Printer printWriter) {
        //out = new Printer(printWriter);
        out = printWriter;
    }
    
    public void write(String text) {
        out.write(text);
    }

    public void format(String string, Object... args) {
        out.format(string, args);
    }
        
    public void mark() {
        out.mark(); 
    }
    
    public void unmark() {
        out.unmark(); 
    }
    
    public void newline() {
        out.newline(); 
    }
    
    public void newlineUp() {
        out.newlineUp();
    }
    
    public void newlineDown() {
        out.newlineDown();
    }
    /*
    PrintWriter out;
    private Stack<Integer> indentationStack;
    Integer indentation = 0;
    Integer offset = 0;
    final Integer delta = 4;
    
    public void format(String string, Object... args) {
        out.format(string, args);
    }
    
    protected void write(String text) {
        out.print(text);
        offset += text.length();
    }
    */
    protected void writeCommaSeparated(List<? extends Node> nodes) {
        Boolean sep = false;
        for (Node node: nodes) {
            if (sep) {
                write(", ");
            } else {
                sep = true;
            }
            node.accept(this);
        }
    }
    /*
    protected void mark() {
        indentationStack.push(indentation);
        indentation = offset;
        //offset = 
    }
    
    protected void unmark() {
        indentation = indentationStack.pop();
        //offset = 
    }
    
    protected void newline() {
        out.format("\n");
        for (int i = 0; i < indentation; i++) {
            out.print(" ");
        }
        offset = indentation; 
    }
    
    protected void newlineUp() {
        indentation += delta;
        newline();
    }
    
    protected void newlineDown() {
        indentation -= delta;
        newline();
    }

    public PrintVisitor(PrintWriter printWriter) {
        indentationStack = new Stack<Integer>();
        out = printWriter;
    }
*/
    @Override
    public void visit(ProgramNode node) {
        for (IncludeNode include: node.includes) {
            write("include \"");
            include.accept(this);
            write("\";");
            newline();
        }
        newline();
        for (Definition def : node.definitions) {
            def.accept(this);
            newline();
            newline();
        }
    }

    @Override
    public void visit(IncludeNode node) {
        write("include ");
        node.name.accept(this);
        write(";");
    }
    
    @Override
    public void visit(ImportNode node) {
        write("import ");
        node.name.accept(this);
        write(";");
    }
    
    @Override
    public void visit(AliasDefinition node) {
        write("defalias ");
        node.id.accept(this);
        write(" ");
        node.unit.accept(this);
        write(";");
    }

    @Override
    public void visit(Declaration node) {
        out.format("declare %s :: ", node.localName());
        newline();
        write("    ");
        node.typeNode.accept(this);
        write(";");
    }

    @Override
    public void visit(IndexSetDefinition indexSetDefinition) {
        write("defindex ");
        write("TODO!");
        write(";");
    }

    @Override
    public void visit(MultiDeclaration node) {
        write("declare ");
        writeCommaSeparated(node.ids);
        write(" :: ");
        newline();
        write("    ");
        node.node.accept(this);
        write(";");
    }

    @Override
    public void visit(Toplevel node) {
        node.body.accept(this);
    }

    @Override
    public void visit(TypeDefinition node) {
        write("deftype ");
        node.lhs.accept(this);
        write(" = ");
        newline();
        write("    ");
        node.rhs.accept(this);
        write(";");
    }

    @Override
    public void visit(UnitDefinition node) {
        write("defunit ");
        node.id.accept(this);
        format(" %s", node.symbol);
        if (node.body.isPresent()) {
            write(" = ");
            node.body.get().accept(this);
        }
        write(";");
    }

    @Override
    public void visit(UnitVectorDefinition node) {
        format("defunit %s = {", node.localName());
        newlineUp();
        Boolean sep = false;
        for (UnitDecl entry : node.items) {
            if (sep) {
                write(",");
                newline();
            } else {
                sep = true;
            }
            entry.key.accept(this);
            write(": ");
            entry.value.accept(this);
        }
        newlineDown();
        out.print("};");
    }

    @Override
    public void visit(ValueDefinition node) {
        mark();
        write("define ");
        node.id.accept(this);
        write(" =");
        newlineUp();
        node.body.accept(this);
        write(";");
        unmark();
    }

    @Override
    public void visit(ApplicationNode node) {
        node.function.accept(this);
        write("(");
        mark();
        Boolean first = true;
        for (ExpressionNode argument : node.arguments) {
            if (!first) {
                write(", ");
                newline();
            }
            argument.accept(this);
            first = false;
        }
        write(")");
        unmark();
    }

    @Override
    public void visit(AssignmentNode node) {
        node.var.accept(this);
        write(" := ");
        node.value.accept(this);
    }

    @Override
    public void visit(BranchNode node) {
        mark();
        write("if ");
        node.test.accept(this);
        write(" then");
        newlineUp();
        node.positive.accept(this);
        newlineDown();
        write("else");
        newlineUp();
        node.negative.accept(this);
        newlineDown();
        write(" end");
        unmark();
    }

    @Override
    public void visit(ConstNode node) {
        out.format("const(\"%s\")", node.valueString());
    }

    @Override
    public void visit(ConversionNode node) {
        node.typeNode.accept(this);
    }

    @Override
    public void visit(IdentifierNode identifierNode) {
        write(identifierNode.getName());
    }

    @Override
    public void visit(IfStatementNode node) {
        write("if ");
        node.test.accept(this);
        write(" then");
        newlineUp();
        node.positive.accept(this);
        newlineDown();
        write(" else");
        newlineUp();
        node.negative.accept(this);
        newlineDown();
        write("end");
    }

    @Override
    public void visit(KeyNode node) {
        int size = node.indexSets.size();
        if (size == 0) {
            write("_");
        } else {
            for (int i = 0; i < size; i++) {
                if (0 < i) {
                    write("%");
                }
                format("%s@%s", node.indexSets.get(i), node.keys.get(i));
            }
        }
    }

    @Override
    public void visit(LambdaNode node) {
        write("lambda (");
        Boolean first = true;
        for (String arg : node.arguments) {
            if (!first)
                out.format(", ");
            out.format(arg);
            
            
            if (node.table != null) {
                ValueInfo info = node.table.lookup(arg);
                write(":");
                Optional<PacioliType> type = info.inferredType;
                if (type.isPresent()) {
                    write(type.get().pretty());
                } else {
                    write("?");
                }
            };
            
            
            
            first = false;
        }
        out.format(") ");
        newlineUp();
        node.expression.accept(this);
        newlineDown();
        out.format("end");
    }

    @Override
    public void visit(MatrixLiteralNode node) {
        String sep = "{";
        write(" :: ");
        node.typeNode.accept(this);
        write(" = ");
        for (ValueDecl pair : node.pairs) {
            write(sep);
            write(pair.pretty());
            sep = ", ";
        }
        out.print("}");
    }

    @Override
    public void visit(MatrixTypeNode node) {
        write("|");
        node.typeNode.accept(this);;
        write("|");
    }

    @Override
    public void visit(ProjectionNode node) {
        write("project ");
        write(node.numString());
        write(" from ");
        node.body.accept(this);;
        write(" end");
    }

    @Override
    public void visit(ReturnNode node) {
        write("return ");
        node.value.accept(this);;
        write(";");
    }

    @Override
    public void visit(SequenceNode node) {
        mark();
        Boolean first = true;
        for (ExpressionNode item : node.items) {
            if (!first) newline();
            first = false;
            item.accept(this);
            
        }
        unmark();
    }

    @Override
    public void visit(StatementNode node) {
        write("begin ");
        newlineUp();
        node.body.accept(this);
        newlineDown();
        write("end");
    }

    @Override
    public void visit(StringNode node) {
        write("\"" + node.valueString() + "\"");
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        write("(");
        Boolean first = true; 
        for (IdentifierNode var: node.vars) {
            if (!first) write(",");
            first = false;
            var.accept(this);
        }
        write(") := ");
        node.tuple.accept(this);
        write(";");
    }

    @Override
    public void visit(WhileNode node) {
        write("while ");
        node.test.accept(this);
        write(" do");
        newlineUp();
        node.body.accept(this);
        newlineDown();
    }

    @Override
    public void visit(BangTypeNode node) {
        out.format("%s!%s", node.indexSet.getName(), node.unitVecName());
    }

    @Override
    public void visit(FunctionTypeNode node) {
        
        if (node.domain instanceof TypeApplicationNode && ((TypeApplicationNode) node.domain).op.getName().equals("Tuple")) {
            out.write("(");
            out.writeCommaSeparated(((TypeApplicationNode) node.domain).args, this);
            out.write(")");
        } else {
            node.domain.accept(this);
        }
        write(" -> ");
        node.range.accept(this);
    }

    @Override
    public void visit(NumberTypeNode node) {
        write(node.number);
    }

    @Override
    public void visit(SchemaNode node) {
        node.context.printPretty(out.out);
        node.type.accept(this);
    }

    @Override
    public void visit(TypeApplicationNode node) {
        node.op.accept(this);
        write("(");
        writeCommaSeparated(node.args);
        write(")");
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        write(node.getName());
    }

    @Override
    public void visit(TypePowerNode node) {
        node.base.accept(this);
        write("^");
        node.power.accept(this);
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        node.prefix.accept(this);
        write(":");
        node.unit.accept(this);
    }

    @Override
    public void visit(TypeMultiplyNode node) {
        node.left.accept(this);
        write("*");
        node.right.accept(this);
    }

    @Override
    public void visit(TypeDivideNode node) {
        node.left.accept(this);
        write("/");
        node.right.accept(this);
    }

    @Override
    public void visit(TypeKroneckerNode node) {
        node.left.accept(this);
        write(" % ");
        node.right.accept(this);
    }

    @Override
    public void visit(TypePerNode node) {
        node.left.accept(this);
        write(" per ");
        node.right.accept(this);
    }

    @Override
    public void visit(NumberUnitNode node) {
        write(node.number);
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        if (!node.getPrefix().isPresent()) {
            write(node.getName());
        } else {
            write(node.getPrefix().get());
            write(":");
            write(node.getName());
        }
    }

    @Override
    public void visit(UnitOperationNode node) {
        node.left.accept(this);
        write(node.operator);
        node.right.accept(this);
    }

    @Override
    public void visit(UnitPowerNode node) {
        node.base.accept(this);
        write("^");
        node.power.accept(this);
    }

    @Override
    public void visit(LetNode node) {
        write("let ");
        boolean first = true;
        for (BindingNode binding : node.binding) {
            if (!first) {
                write(",");
            } else {
                first = false;
            }
            binding.accept(this);
        }
        write("in");
        newlineUp();
        node.body.accept(this);
        newlineDown();
        write("end");        
    }

    @Override
    public void visit(LetBindingNode node) {
        out.write(node.var);
        out.write(" = ");
        node.value.accept(this);
    }

    @Override
    public void visit(LetTupleBindingNode node) {
        write("(");
        Boolean first = true; 
        for (String var: node.vars) {
            if (!first) write(",");
            first = false;
            out.write(var);
        }
        write(") = ");
        node.value.accept(this);
    }

    @Override
    public void visit(LetFunctionBindingNode node) {
        out.write(node.name);
        write("(");
        Boolean first = true; 
        for (String arg: node.args) {
            if (!first) write(",");
            first = false;
            out.write(arg);
        }
        write(") = ");
        node.body.accept(this);        
    }
}
