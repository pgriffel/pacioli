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

package pacioli;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import pacioli.compiler.DocBuilder;

class DocBuilderIT {

    private static DocBuilder docBuilderWithFluentCalls() {
        DocBuilder docbuilder = new DocBuilder();

        // Test calls
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

        return docbuilder;
    }

    private static final String TEST_DOC = """
            This is the first paragraph. There is a `code fragment` and
            two more `abc`<code>efg</code>.

            ~~The second paragraph start with two spaces and has three trailing spaces.~~~

            The third paragraph begins after two newlines.


            Next we have some code

            ~~~~statement1;
            ~~~~statement2;


            and some code with irregular layout

            ```
            ~~statement1;
            ~~~~~~statement2;
            ~~~~
            ~~~~~~statement3;~~

            ~~
            ```

            A list

            * foo
            * bar
            * baz

            And another list

            - foo
            - bar
            - baz

            + foo
            + bar
            + baz

            1. foo
            2. bar
            3. baz

            A [link](https://example.com) to somewhere.

            ~~~~~And finally some text
            ~~~And finally some text~~~
            ~~~~~And   finally some text
            """.replace("~", " ");

    @Test
    void fluentAPIShouldGiveCorrectStructure() {

        // Given builder docBuilderWithFluentCalls
        DocBuilder docbuilder = docBuilderWithFluentCalls();

        // Then markdown should give the correct structure
        assertEquals("""
                Doc
                  Header id='null'
                    Line
                      Text: "My Doc"
                  Header id='null'
                    Line
                      Text: "My Section"
                  TextBlock
                    Line
                      Text: "Some documentation text"
                  CodeBlock
                    Line
                      Text: "Some code"
                  TextBlock
                    Line
                      Text: "Some documentation text"
                  Header id='null'
                    Line
                      Text: "My Section"
                  TextBlock
                    Line
                      Text: "Some documentation text"
                  CodeBlock
                    Line
                      Text: "Some code"
                    Line
                      Text: " Some code 2"
                  TextBlock
                    Line
                      Text: "Link to "
                      Link: my text, #my_text
                      Link: my url, http://example.com/my_text
                      Text: " is here"
                    Line
                      Text: "Some documentation text"
                  """, docbuilder.structure());
    }

    @Test
    void fluentAPIShouldGiveCorrectMarkdown() {

        // Given builder docBuilderWithFluentCalls
        DocBuilder docbuilder = docBuilderWithFluentCalls();

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
                  MarkdownBlock
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
                two more <code>abc</code><code>efg</code>.</p>
                <p>The second paragraph start with two spaces and has three trailing spaces.</p>
                <p>The third paragraph begins after two newlines.</p>
                <p>Next we have some code</p>
                <pre><code>statement1;
                statement2;
                </code></pre>
                <p>and some code with irregular layout</p>
                <pre><code>  statement1;
                      statement2;
                ~~~~
                ~~~~~~statement3;~~

                ~~
                </code></pre>
                <p>A list</p>
                <ul>
                <li>foo</li>
                <li>bar</li>
                <li>baz</li>
                </ul>
                <p>And another list</p>
                <ul>
                <li>foo</li>
                <li>bar</li>
                <li>baz</li>
                </ul>
                <ul>
                <li>foo</li>
                <li>bar</li>
                <li>baz</li>
                </ul>
                <ol>
                <li>foo</li>
                <li>bar</li>
                <li>baz</li>
                </ol>
                <p>A <a href="https://example.com">link</a> to somewhere.</p>
                <pre><code> And finally some text
                </code></pre>
                <p>And finally some text<br />
                And   finally some text</p>
                """.replace("~", " ");

        String html = builder.html();

        for (int i = 0; i < Math.min(expected.length(), html.length()); i++) {
            if (expected.charAt(i) != html.charAt(i)) {
                System.out.println(expected.substring(0, i));
                System.out.println(String.format("'%s' != '%s'", expected.charAt(i), html.charAt(i)));
                throw new RuntimeException("yo");
            }
        }

        assertEquals(expected, html);
    }
}
