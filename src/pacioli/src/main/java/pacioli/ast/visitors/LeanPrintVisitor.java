/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.ast.visitors;

import pacioli.ast.ExportNode;
import pacioli.ast.ImportNode;
import pacioli.ast.IncludeNode;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.ClassDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Documentation;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.InstanceDefinition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeAssertion;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.definition.ValueEquation;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.DataDefinitionNode;
import pacioli.ast.expression.DataQueryNode;
import pacioli.ast.expression.ForNode;
import pacioli.ast.expression.ForTupleNode;
import pacioli.ast.expression.IdListNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.IfStatementNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.ListLiteralNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.expression.ProjectionNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.ReturnVoidNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.SetLiteralNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.WhileNode;
import pacioli.ast.sugar.ComprehensionNode;
import pacioli.ast.sugar.ComprehensionNode.AssignmentClause;
import pacioli.ast.sugar.ComprehensionNode.FilterClause;
import pacioli.ast.sugar.ComprehensionNode.GeneratorClause;
import pacioli.ast.sugar.ComprehensionNode.TupleAssignmentClause;
import pacioli.ast.sugar.ComprehensionNode.TupleGeneratorClause;
import pacioli.ast.sugar.ExponentNode;
import pacioli.ast.sugar.LetFunctionBindingNode;
import pacioli.ast.sugar.LetTupleBindingNode;
import pacioli.ast.sugar.RecordDefinition;
import pacioli.ast.unit.NumberUnitNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.ast.unit.UnitOperationNode;
import pacioli.ast.unit.UnitPowerNode;
import pacioli.compiler.Printer;
import pacioli.types.ast.BangTypeNode;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.NumberTypeNode;
import pacioli.types.ast.PrefixUnitTypeNode;
import pacioli.types.ast.QuantNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeDivideNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeKroneckerNode;
import pacioli.types.ast.TypeMultiplyNode;
import pacioli.types.ast.TypePerNode;
import pacioli.types.ast.TypePowerNode;
import pacioli.types.ast.TypePredicateNode;

public class LeanPrintVisitor extends PrintVisitor implements CodeGenerator {

    public LeanPrintVisitor(Printer printer) {
        super(printer);
    }

    protected void writeTypePlaceholder() {
        write("TypePlaceholder");
    }

    protected void writeTodo(String feature) {
        out.write("-- TODO: ");
        out.write(feature);
    }

    @Override
    public void visit(ProgramNode node) {
        write("-- Lean syntax scaffold");
        newline();
        for (ImportNode importNode : node.imports()) {
            importNode.accept(this);
            newline();
        }
        for (IncludeNode include : node.includes()) {
            include.accept(this);
            newline();
        }
        for (ExportNode exportNode : node.exports()) {
            exportNode.accept(this);
            newline();
        }
        for (pacioli.ast.definition.Definition def : node.definitions()) {
            def.accept(this);
            newline();
            newline();
        }
    }

    @Override
    public void visit(IncludeNode node) {
        write("-- include ");
        write(node.name.valueString());
    }

    @Override
    public void visit(ImportNode node) {
        write("-- import ");
        write(node.name.valueString());
    }

    @Override
    public void visit(ExportNode node) {
        write("-- export");
        if (!node.identifiers.isEmpty()) {
            write(" ");
            writeCommaSeparated(node.identifiers);
        }
    }

    @Override
    public void visit(AliasDefinition node) {
        write("-- alias ");
        node.id.accept(this);
    }

    @Override
    public void visit(Declaration node) {
        write("def ");
        write(node.name());
        write(" : ");
        writeTypePlaceholder();
        write(" :=");
        newline();
        write("  ");
        writeTodo("declaration body");
    }

    @Override
    public void visit(IndexSetDefinition node) {
        writeTodo("index set definition");
    }

    @Override
    public void visit(MultiDeclaration node) {
        writeTodo("multi declaration");
    }

    @Override
    public void visit(Toplevel node) {
        node.body.accept(this);
    }

    @Override
    public void visit(TypeDefinition node) {
        write("-- type definition ");
        node.lhs.accept(this);
    }

    @Override
    public void visit(UnitDefinition node) {
        writeTodo("unit definition");
    }

    @Override
    public void visit(UnitVectorDefinition node) {
        writeTodo("unit vector definition");
    }

    @Override
    public void visit(ValueDefinition node) {
        write("def ");
        node.id.accept(this);
        write(" : ");
        writeTypePlaceholder();
        write(" := ");
        if (node.body != null) {
            node.body.accept(this);
        } else {
            writeTodo("value body");
        }
    }

    @Override
    public void visit(ApplicationNode node) {
        node.function.accept(this);
        write(" ");
        writeCommaSeparated(node.arguments);
    }

    @Override
    public void visit(AssignmentNode node) {
        node.var.accept(this);
        write(" := ");
        node.value.accept(this);
    }

    @Override
    public void visit(BranchNode node) {
        write("if ");
        node.test.accept(this);
        write(" then ");
        node.positive.accept(this);
        write(" else ");
        node.negative.accept(this);
    }

    @Override
    public void visit(ConstNode node) {
        write(node.valueString());
    }

    @Override
    public void visit(ConversionNode node) {
        writeTodo("conversion");
    }

    @Override
    public void visit(IdentifierNode node) {
        write(node.name());
    }

    @Override
    public void visit(IfStatementNode node) {
        writeTodo("if statement");
    }

    @Override
    public void visit(KeyNode node) {
        writeTodo("key");
    }

    @Override
    public void visit(LambdaNode node) {
        write("fun");
        if (!node.arguments.isEmpty()) {
            write(" ");
            for (int i = 0; i < node.arguments.size(); i++) {
                if (i > 0) {
                    write(", ");
                }
                write(node.arguments.get(i));
            }
        }
        write(" => ");
        node.expression.accept(this);
    }

    @Override
    public void visit(MatrixLiteralNode node) {
        writeTodo("matrix literal");
    }

    @Override
    public void visit(MatrixTypeNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(ProjectionNode node) {
        writeTodo("projection");
    }

    @Override
    public void visit(ReturnNode node) {
        write("return ");
        node.value.accept(this);
    }

    @Override
    public void visit(SequenceNode node) {
        boolean first = true;
        for (pacioli.ast.Node item : node.items) {
            if (!first) {
                newline();
            }
            first = false;
            item.accept(this);
        }
    }

    @Override
    public void visit(StatementNode node) {
        writeTodo("statement block");
    }

    @Override
    public void visit(StringNode node) {
        write('"' + node.valueString() + '"');
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        writeTodo("tuple assignment");
    }

    @Override
    public void visit(WhileNode node) {
        writeTodo("while loop");
    }

    @Override
    public void visit(ForNode node) {
        writeTodo("for loop");
    }

    @Override
    public void visit(ForTupleNode node) {
        writeTodo("for tuple loop");
    }

    @Override
    public void visit(BangTypeNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(FunctionTypeNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(NumberTypeNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(SchemaNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(TypeApplicationNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(TypePowerNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(PrefixUnitTypeNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(TypeMultiplyNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(TypeDivideNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(TypeKroneckerNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(TypePerNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(NumberUnitNode node) {
        writeTypePlaceholder();
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        write(node.name());
    }

    @Override
    public void visit(UnitOperationNode node) {
        writeTodo("unit operation");
    }

    @Override
    public void visit(UnitPowerNode node) {
        writeTodo("unit power");
    }

    @Override
    public void visit(LetNode node) {
        write("let ");
        if (node.binding instanceof LetBindingNode binding) {
            write(binding.var);
            write(" := ");
            binding.value.accept(this);
        } else {
            node.binding.accept(this);
        }
        write("; ");
        writeTodo("let body");
    }

    @Override
    public void visit(LetBindingNode node) {
        write(node.var);
        write(" := ");
        node.value.accept(this);
    }

    @Override
    public void visit(LetTupleBindingNode node) {
        writeTodo("tuple binding");
    }

    @Override
    public void visit(LetFunctionBindingNode node) {
        writeTodo("function binding");
    }

    @Override
    public void visit(IdListNode node) {
        writeTodo("identifier list");
    }

    @Override
    public void visit(Documentation node) {
        writeTodo("documentation");
    }

    @Override
    public void visit(ClassDefinition node) {
        writeTodo("class definition");
    }

    @Override
    public void accept(ValueEquation node) {
        node.id.accept(this);
        write(" := ");
        node.body.accept(this);
    }

    @Override
    public void visit(InstanceDefinition node) {
        writeTodo("instance definition");
    }

    @Override
    public void accept(TypeAssertion node) {
        writeTodo("type assertion");
    }

    @Override
    public void accept(QuantNode node) {
        writeTodo("quantifier");
    }

    @Override
    public void visit(TypePredicateNode node) {
        writeTodo("type predicate");
    }

    @Override
    public void visit(DataDefinitionNode node) {
        writeTodo("data definition");
    }

    @Override
    public void visit(DataQueryNode node) {
        writeTodo("data query");
    }

    @Override
    public void visit(RecordDefinition node) {
        writeTodo("record definition");
    }

    @Override
    public void visit(ExponentNode exponentNode) {
        writeTodo("exponent");
    }

    @Override
    public void visit(ComprehensionNode comprehensionNode) {
        writeTodo("comprehension");
    }

    @Override
    public void visit(GeneratorClause generatorClause) {
        writeTodo("generator clause");
    }

    @Override
    public void visit(FilterClause filterClause) {
        writeTodo("filter clause");
    }

    @Override
    public void visit(TupleGeneratorClause tupleGeneratorClause) {
        writeTodo("tuple generator clause");
    }

    @Override
    public void visit(AssignmentClause assignmentClause) {
        writeTodo("assignment clause");
    }

    @Override
    public void visit(TupleAssignmentClause tupleAssignmentClause) {
        writeTodo("tuple assignment clause");
    }

    @Override
    public void visit(ReturnVoidNode returnVoidNode) {
        write("return ()");
    }

    @Override
    public void visit(ListLiteralNode node) {
        writeTodo("list literal");
    }

    @Override
    public void visit(SetLiteralNode node) {
        writeTodo("set literal");
    }
}
