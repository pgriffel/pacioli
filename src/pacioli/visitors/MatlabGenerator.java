package pacioli.visitors;

import pacioli.CompilationSettings;
import pacioli.Printer;
import pacioli.Utils;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.definition.IndexSetDefinition;
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
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.expression.ProjectionNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.WhileNode;
import pacioli.ast.unit.NumberUnitNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.ast.unit.UnitOperationNode;
import pacioli.ast.unit.UnitPowerNode;
import pacioli.symboltable.IndexSetInfo;
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

public class MatlabGenerator extends IdentityVisitor implements CodeGenerator {

    Printer out;
    CompilationSettings settings;

    public MatlabGenerator(Printer printWriter, CompilationSettings settings) {
        out = printWriter;
        this.settings = settings;
    }

    @Override
    public void visit(ApplicationNode node) {
        // Is this if necessary?
        if (node.function instanceof IdentifierNode) {
            IdentifierNode id = (IdentifierNode) node.function;
            if (id.isGlobal()) {
                out.write(id.getInfo().globalName().toLowerCase());
            } else {
                node.function.accept(this);
            }
        } else {
            node.function.accept(this);
        }
        out.write("(");
        out.writeCommaSeparated(node.arguments, this);
        out.write(")");
    }

    @Override
    public void visit(AssignmentNode node) {
        out.format("%s = ", node.var.getName());
        node.value.accept(this);
    }

    @Override
    public void visit(BranchNode node) {
        out.write("_if(");
        node.test.accept(this);
        out.write(", @() ");
        node.positive.accept(this);
        out.write(", @() ");
        node.negative.accept(this);
        out.format(")");
    }

    @Override
    public void visit(ConstNode node) {
        out.format("%s", node.valueString());
    }

    @Override
    public void visit(ConversionNode node) {
        out.format("%s", node.getClass());
        //out.format("Pacioli.conversionNumbers(%s)", node.typeNode.evalType(true).compileToMATLAB());
        //out.format("ones(%s, %s)", node.rowDim.size(), node.columnDim.size());
    }

    @Override
    public void visit(IdentifierNode node) {
        if (node.isGlobal()) {
            out.write("fetch_global(\"");
            out.write(node.getInfo().generic().getModule().toLowerCase());
            out.write("\", \"");
            out.write(node.getName().toLowerCase());
            out.write("\")");
        } else {
            out.write(node.getName().toLowerCase());
        }
    }

    @Override
    public void visit(IfStatementNode node) {
        out.write("if (");
        node.test.accept(this);
        out.write(") ");
        out.newlineUp();
        node.positive.accept(this);
        out.write(";");
        out.newlineDown();
        out.write("else");
        out.newlineUp();
        node.negative.accept(this);
        out.write(";");
        out.newlineDown();
        out.write("endif");
    }

    @Override
    public void visit(KeyNode node) {
        out.format("{%s,%s}", node.position(), node.size());
    }

    @Override
    public void visit(LambdaNode node) {
        out.write("(@(");
        out.writeStringsCommaSeparated(node.arguments, this);
        out.write(")");
        node.expression.accept(this);
        out.format(")");
    }

    @Override
    public void visit(MatrixLiteralNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(MatrixTypeNode node) {
        out.format("ones(%s, %s)", node.rowDim.size(), node.columnDim.size());
        //out.format("%s", node.getClass());
    }

    @Override
    public void visit(ProjectionNode node) {
        out.format("%s", node.getClass());
        // old (wrong) code
        //return String.format("(@(%s) %s)", numString(), body.compileToMATLAB());
        
    }

    @Override
    public void visit(ReturnNode node) {
        out.write("result = ");
        node.value.accept(this);
        out.newline();
        out.write("return");
        
    }

    @Override
    public void visit(SequenceNode node) {
        for (ExpressionNode item : node.items) {
            item.accept(this);
            out.write(";");
            out.newline();
        }
    }

    @Override
    public void visit(StatementNode node) {
        node.body.accept(this);
        
    }

    @Override
    public void visit(StringNode node) {
        out.format("\"%s\"", node.valueString());
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        String tmpVar = Utils.freshName();
        out.format("%s = ", tmpVar);
        node.tuple.accept(this);
        int i = 1;
        for (IdentifierNode var : node.vars) {
            out.newline();
            out.format("%s = %s{%s}", var.getName(), tmpVar, i++);
        }
    }

    @Override
    public void visit(WhileNode node) {
        out.write("while (");
        node.test.accept(this);
        out.write(")");
        out.newlineUp();
        node.body.accept(this);
        out.newlineDown();
        out.write("endwhile");
        
    }

    @Override
    public void visit(BangTypeNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(FunctionTypeNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(NumberTypeNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(SchemaNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypeApplicationNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypePowerNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypeMultiplyNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypeDivideNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypeKroneckerNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(TypePerNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(NumberUnitNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(UnitOperationNode node) {
        out.format("%s", node.getClass());
        
    }

    @Override
    public void visit(UnitPowerNode node) {
        out.format("%s", node.getClass());
        
    }

}
