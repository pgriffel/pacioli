package pacioli.visitors;

import java.io.PrintWriter;

import pacioli.Pacioli;
import pacioli.ast.Visitor;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
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

	PrintWriter out;
	
	public PrintVisitor(PrintWriter printWriter) {
		out = printWriter;
	}

	@Override
	public void visit(ProgramNode program) {
		Pacioli.log("Prog");
	}
	
	@Override
	public void visit(AliasDefinition aliasDefinition) {
		Pacioli.log("Alias");
	}

	@Override
	public void visit(Declaration declaration) {
		Pacioli.log("Decl");
	}

	@Override
	public void visit(IndexSetDefinition indexSetDefinition) {
		Pacioli.log("Ind");
	}

	@Override
	public void visit(MultiDeclaration multiDeclaration) {
		Pacioli.log("Multidc");
	}

	@Override
	public void visit(Toplevel node) {
		node.body.accept(this);
	}

	@Override
	public void visit(TypeDefinition typeDefinition) {
		Pacioli.log("TYpeD");
	}

	@Override
	public void visit(UnitDefinition unitDefinition) {
		Pacioli.log("Unitdef");
	}

	@Override
	public void visit(UnitVectorDefinition unitVectorDefinition) {
		Pacioli.log("Unitfecog");
	}

	@Override
	public void visit(ValueDefinition node) {
		out.format("define ");
		node.id.accept(this);
		out.format(" = ");
		node.body.accept(this);
		out.format(";\n");
	}

	@Override
	public void visit(ApplicationNode node) {
		 node.function.accept(this);
		 out.write("(");
		 Boolean first = true;
		 for (ExpressionNode argument : node.arguments) {
			 if (!first) out.write(", ");
			 argument.accept(this);
			 first = false;
	     }	
		 out.write(")");
	}
	
	@Override
	public void visit(AssignmentNode assignmentNode) {
		Pacioli.log("asign");	}

	@Override
	public void visit(BranchNode node) {
		out.write("if ");
		node.test.accept(this);
		out.write(" then ");
		node.positive.accept(this);
		out.write(" else ");
		node.negative.accept(this);
		out.write(" end");
	}

	@Override
	public void visit(ConstNode node) {
		out.format("const(\"%s\")", node.valueString());
	}

	@Override
	public void visit(ConversionNode conversionNode) {
		Pacioli.log("conv");	}

	@Override
	public void visit(IdentifierNode identifierNode) {
		out.format("%s", identifierNode.getName());
	}
	
	@Override
	public void visit(IfStatementNode ifStatementNode) {
		Pacioli.log("if");	}

	@Override
	public void visit(KeyNode keyNode) {
		Pacioli.log("key");	}

	@Override
	public void visit(LambdaNode node) {
		out.format("lambda (");
		Boolean first = true;
		for (String arg : node.arguments) {
			if (!first) out.format(", ");
			out.format(arg);
            first = false;
        }
		out.format(") ");
		node.expression.accept(this);
		out.format(" end");
	}

	@Override
	public void visit(MatrixLiteralNode matrixLiteralNode) {
		Pacioli.log("matrix");	}

	@Override
	public void visit(MatrixTypeNode matrixTypeNode) {
		Pacioli.log("mattype");	}

	@Override
	public void visit(ProjectionNode projectionNode) {
		Pacioli.log("projd");	}

	@Override
	public void visit(ReturnNode returnNode) {
		Pacioli.log("ret");	}

	@Override
	public void visit(SequenceNode sequenceNode) {
		Pacioli.log("seq");	}

	@Override
	public void visit(StatementNode statementNode) {
		Pacioli.log("sttat");	}

	@Override
	public void visit(StringNode node) {
		out.format("\"%s\"", node.valueString());	
	}

	@Override
	public void visit(TupleAssignmentNode tupleAssignmentNode) {
		Pacioli.log("tup");	}

	@Override
	public void visit(WhileNode whileNode) {
		Pacioli.log("while");	}

	@Override
	public void visit(BangTypeNode bangTypeNode) {
		Pacioli.log("bang");	}

	@Override
	public void visit(FunctionTypeNode functionTypeNode) {
		Pacioli.log("funty");	}

	@Override
	public void visit(NumberTypeNode numberTypeNode) {
		Pacioli.log("numytpe");	}

	@Override
	public void visit(SchemaNode schemaNode) {
		Pacioli.log("sschema");	}

	@Override
	public void visit(TypeApplicationNode typeApplicationNode) {
		Pacioli.log("typepapp");	}

	@Override
	public void visit(TypeIdentifierNode typeIdentifierNode) {
		Pacioli.log("typeident");	}

	@Override
	public void visit(TypePowerNode typePowerNode) {
		Pacioli.log("typepow");	
	}

	@Override
	public void visit(PrefixUnitTypeNode prefixUnitTypeNode) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void visit(TypeMultiplyNode typeMultiplyNode) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void visit(TypeDivideNode typeDivideNode) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void visit(TypeKroneckerNode typeKroneckerNode) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void visit(TypePerNode typePerNode) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void visit(NumberUnitNode numberUnitNode) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void visit(UnitIdentifierNode unitIdentifierNode) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void visit(UnitOperationNode unitOperationNode) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void visit(UnitPowerNode unitOperationNode) {
		// TODO Auto-generated method stub
		
	}

}
