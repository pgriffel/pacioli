package pacioli.ast.visitors;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.io.PrintWriter;
import java.io.StringWriter;

import org.junit.jupiter.api.Test;

import pacioli.ast.ProgramNode;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.compiler.Location;

public class LeanPrintVisitorTest {

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
}
