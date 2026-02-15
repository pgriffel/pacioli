package pacioli;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import pacioli.compiler.DocBuilder;

class DocBuilderIT {

  static final String TEST_DOC = """
      This is the first paragraph. There is a <code>code fragment</code> and
      two more <code>abc</code><code>efg</code>.

      **The second paragraph start with two spaces and has three trailing spaces.***


      The third paragraph begins after two newlines.


      Next we have some code
      <pre>
      ****statement1;
      ****statement2;
      </pre>

      and some code with irregular layout

      <pre>
      **statement1;
      ******statement2;
      ****
      ******statement3;**

      **
      </pre>

      *****And finally some text
      ***And finally some text***
      *****And   finally some text
      """.replace("*", " ");

  @Test
  void fluentAPIShouldGiveCorrectMarkdown() {

    // Given a fresh DocBuilder
    DocBuilder docbuilder = new DocBuilder();

    // When the fluent API is used
    docbuilder.header(1).text("My Doc");
    docbuilder.header(2).text("My Section");
    docbuilder.line("Some documentation text");
    docbuilder.startCode();
    docbuilder.line("Some code");
    docbuilder.endCode();
    docbuilder.line("Some documentation text");
    docbuilder.header(2).text("My Section");
    docbuilder.line("Some documentation text");
    docbuilder.startCode();
    docbuilder.line("Some code");
    docbuilder.line(" Some code 2");
    docbuilder.endCode();
    docbuilder.text("Link to ");
    docbuilder.link("my text", "#my_text");
    docbuilder.link("my url", "http://example.com/my_text");
    docbuilder.text(" is here");
    docbuilder.line("Some documentation text");

    // Then markdown should give correct markdown
    assertEquals("""
        # My Doc

        ## My Section

        Some documentation text

            Some code

        Some documentation text

        ## My Section

        Some documentation text

            Some code
             Some code 2

        Link to my text[my url](http://example.com/my_text) is here
        Some documentation text
        """, docbuilder.markdown());
  }

  @Test
  void parseShouldGiveCorrectStructure() {

    // Given a fresh DocBuilder
    DocBuilder builder = new DocBuilder();

    // When the TEST_DOC is parsed
    builder.parse(TEST_DOC);

    // Then the structure should be correct
    String expected = """
        Doc
          TextBlock
            Line
              Text: "This is the first paragraph. There is a "
              Code: "code fragment"
              Text: " and"
            Line
              Text: "two more "
              Code: "abc"
              Text: ""
              Code: "efg"
              Text: "."
          TextBlock
            Line
              Text: "  The second paragraph start with two spaces and has three trailing spaces.   "
          TextBlock
            Line
              Text: "The third paragraph begins after two newlines."
          TextBlock
            Line
              Text: "Next we have some code"
          CodeBlock
            Line
              Text: "    statement1;"
            Line
              Text: "    statement2;"
          TextBlock
            Line
              Text: "and some code with irregular layout"
          CodeBlock
            Line
              Text: "  statement1;"
            Line
              Text: "      statement2;"
            Line
              Text: "    "
            Line
              Text: "      statement3;  "
            Line
              Text: ""
            Line
              Text: "  "
          TextBlock
            Line
              Text: "     And finally some text"
            Line
              Text: "   And finally some text   "
            Line
              Text: "     And   finally some text"
        """;

    String structure = builder.structure();

    assertEquals(expected, structure);
  }

  @Test
  void htmlShouldGiveCorrectHTML() {

    // Given a fresh DocBuilder
    DocBuilder builder = new DocBuilder();

    // When the TEST_DOC is parsed
    builder.parse(TEST_DOC);

    // Then the HTML output should be correct
    String expected = """
        <p>This is the first paragraph. There is a <code>code fragment</code> and
        two more <code>abc</code><code>efg</code>.


        <p>**The second paragraph start with two spaces and has three trailing spaces.***


        <p>The third paragraph begins after two newlines.


        <p>Next we have some code


        <pre>
        ****statement1;
        ****statement2;
        </pre>

        <p>and some code with irregular layout


        <pre>
        **statement1;
        ******statement2;
        ****
        ******statement3;**

        **
        </pre>

        <p>*****And finally some text
        ***And finally some text***
        *****And   finally some text
        """.replace("*", " ");

    String html = builder.html();

    assertEquals(expected, html);
  }
}
