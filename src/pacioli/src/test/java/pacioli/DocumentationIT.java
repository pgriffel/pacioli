package pacioli;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import pacioli.ast.definition.Documentation;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.StringNode;
import pacioli.compiler.Location;

class DocumentationIT {

  @Test
  void documentationShouldStripLeftMargin() {

    // Given some text with a left margin of four spaces, except in the first line
    String testText = """
        The docu <code>foo</code>ff <code>abc</code>
        ****
        *******
        ****
        ****f
        ****
        ****<pre>
        ****yo
        *****yo2
        ****</pre>
        ******tada**
        ****<pre>**
        ****s
        ******yo
        ****</pre>
        """.replace("*", " ");

    // And some irrelevant location
    var fakeLoc = new Location(null, 0, 0, 0);

    // And a Documentation created from the text
    var doc = new Documentation(fakeLoc, new IdentifierNode("foo", fakeLoc),
        new StringNode(testText, fakeLoc));

    // Then method rawText should strip the margin and nothing else
    String expected = """
        The docu <code>foo</code>ff <code>abc</code>

        ***

        f

        <pre>
        yo
        *yo2
        </pre>
        **tada**
        <pre>**
        s
        **yo
        </pre>
        """.replace("*", " ");

    assertEquals(expected, doc.rawText());
  }

}
