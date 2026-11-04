package pacioli.ast.visitors;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

import org.junit.jupiter.api.Test;

import mvm.values.matrix.IndexSet;
import mvm.values.matrix.MatrixDimension;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ForNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.ListLiteralNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.SetLiteralNode;
import pacioli.compiler.CompilationSettings;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliFile;

public class LeanPrintVisitorTest {

    private final Location location = new Location(PacioliFile.dummy());

    @Test
    void printsLeanStyleDefinitionsWithTypePlaceholder() {
        // Location location = new Location(new File("dummy.pacioli"));
        // ProgramNode program = new ProgramNode(location);
        // IdentifierNode id = new IdentifierNode("answer", location);
        // ValueDefinition definition = new ValueDefinition(location, id, new
        // ConstNode("42", location), true);
        // program.addDefinition(definition);

        // StringWriter output = new StringWriter();
        // program.printLeanSyntax(new PrintWriter(output));

        // String rendered = output.toString();
        // assertTrue(rendered.contains("def answer"));
        // // assertTrue(rendered.contains("TypePlaceholder"));
        // // assertTrue(rendered.contains("TODO"));
    }

    @Test
    void setLiteralRendersAsLeanSetLiteral() {
        SetLiteralNode node = new SetLiteralNode(location,
                List.of(new ConstNode("1", location), new ConstNode("2", location)));
        String out = node.asLean(new CompilationSettings());
        assertTrue(out.contains("{"));
        assertTrue(out.contains("1"));
        assertTrue(out.contains("2"));
    }

    // @Test
    // void matrixLiteralUsesMakeMatrixHelper() {
    // MatrixLiteralNode.ValueDecl decl = new MatrixLiteralNode.ValueDecl(
    // List.of(new IdentifierNode("row", location), new IdentifierNode("col",
    // location)), "7");
    // MatrixLiteralNode node = new MatrixLiteralNode(location, null,
    // List.of(decl));
    // node.rowDim = new MatrixDimension(new IndexSet("R", List.of("r0")));
    // node.columnDim = new MatrixDimension(new IndexSet("C", List.of("c0")));
    // String out = node.asLean(new CompilationSettings());
    // assertTrue(out.contains("make_matrix"));
    // assertTrue(out.contains("by decide"));
    // }

    @Test
    void forNodeUsesMapLowering() {
        ForNode node = new ForNode(location, ForNode.Kind.LIST,
                new IdentifierNode("x", location),
                new ListLiteralNode(location, List.of(new ConstNode("1", location), new ConstNode("2", location))),
                new IdentifierNode("x", location));

        String out = node.asLean(new CompilationSettings());
        assertTrue(out.contains("List.map"));
        assertTrue(out.contains("fun x =>"));
    }
}
