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

package pacioli.compiler;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.List;

import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.commonmark.renderer.markdown.MarkdownRenderer;

/**
 * A fluent api to create documentation.
 * 
 * Experiment to improve the documentation generator. At least its better than
 * the old code.
 * 
 * The builder maintains an intermediate form. From this intermediate form
 * HTML and markdown output can be generated.
 * 
 * Parses doc strings from Pacioli code and library doc files with the
 * commonmark-java parser. The 'parse' fluent api adds the parsed node
 * to the builder's intermediate form.
 * 
 * Two dev features:
 * 1. FLAG_SHOW_NEWLINE_DEBUG_TAGS
 * Makes it easy to get the newlines right in markdown
 * 2. Target 'structure'
 * Shows the document structure. Makes it easy to see if an error is
 * caused by incorrect parsing, or by incorrect writing.
 */
public class DocBuilder {

    // Debug flag
    private static final boolean FLAG_SHOW_NEWLINE_DEBUG_TAGS = false;

    private static void newline(StringBuilder builder, String debugTag) {
        if (FLAG_SHOW_NEWLINE_DEBUG_TAGS) {
            builder.append(String.format("<- %s\n", debugTag));
        } else {
            builder.append("\n");
        }
    }

    sealed interface LineElement permits Text, Code, Link {
        void appendMarkdown(StringBuilder builder);

        void appendHTML(StringBuilder builder);

        void appendStructure(StringBuilder builder, int level);
    }

    public record Text(String text) implements LineElement {
        public void appendMarkdown(StringBuilder builder) {
            builder.append(text);
        }

        public void appendHTML(StringBuilder builder) {
            builder.append(text);
        }

        public void appendStructure(StringBuilder builder, int level) {
            builder.append("\n");
            builder.append(" ".repeat(level * 2));
            builder.append("Text: \"");
            builder.append(text);
            builder.append("\"");
        }
    }

    public record Code(String text) implements LineElement {
        public void appendMarkdown(StringBuilder builder) {
            builder.append("`");
            builder.append(text);
            builder.append("`");
        }

        public void appendHTML(StringBuilder builder) {
            builder.append("<code>");
            builder.append(text);
            builder.append("</code>");
        }

        public void appendStructure(StringBuilder builder, int level) {
            builder.append("\n");
            builder.append(" ".repeat(level * 2));
            builder.append("Code: \"");
            builder.append(text);
            builder.append("\"");
        }
    }

    public record Link(String text, String url) implements LineElement {
        public void appendMarkdown(StringBuilder builder) {
            if (url.startsWith("http")) {
                builder.append("[");
                builder.append(text);
                builder.append("](");
                builder.append(url);
                builder.append(")");
            } else {
                builder.append(text);
            }
        }

        public void appendHTML(StringBuilder builder) {
            builder.append("<a href=\"");
            if (!url.startsWith("http")) {
                builder.append("#");
            }
            builder.append(url);
            builder.append("\">");
            builder.append(text);
            builder.append("</a>");
        }

        public void appendStructure(StringBuilder builder, int level) {
            builder.append("\n");
            builder.append(" ".repeat(level * 2));
            builder.append("Link: ");
            builder.append(text);
            builder.append(", ");
            builder.append(url);
        }
    }

    public record Line(List<LineElement> elements) {
        public void appendMarkdown(StringBuilder builder) {
            for (LineElement element : elements) {
                element.appendMarkdown(builder);
            }
        }

        public void appendHTML(StringBuilder builder) {
            for (LineElement element : elements) {
                element.appendHTML(builder);
            }
        }

        public void appendStructure(StringBuilder builder, int level) {
            builder.append("\n");
            builder.append(" ".repeat(level * 2));
            builder.append("Line");
            for (LineElement element : elements) {
                element.appendStructure(builder, level + 1);
            }
        }
    }

    sealed interface Section permits Header, TextBlock, CodeBlock, MarkdownBlock, Definition {
        void appendMarkdown(StringBuilder builder);

        void appendHTML(StringBuilder builder);

        void appendStructure(StringBuilder builder, int level);
    }

    public record Header(int level, Line title, String id) implements Section {

        public Header(int level, Line title) {
            this(level, title, null);
        }

        public void appendMarkdown(StringBuilder builder) {
            builder.append(String.format("%s ", "#".repeat(level)));
            title.appendMarkdown(builder);
            newline(builder, "header");
        }

        public void appendHTML(StringBuilder builder) {
            builder.append("<h");
            builder.append(level);
            if (this.id != null) {
                builder.append(String.format(" id=\"%s\"", this.id));
            }
            builder.append(">");
            title.appendHTML(builder);
            builder.append("</h");
            builder.append(level);
            builder.append(">");
        }

        public void appendStructure(StringBuilder builder, int level) {
            builder.append("\n");
            builder.append(" ".repeat(level * 2));

            builder.append(String.format("Header id='%s'", this.id));
            title.appendStructure(builder, level + 1);
        }
    }

    public record TextBlock(List<Line> text) implements Section {
        public void appendMarkdown(StringBuilder builder) {
            for (Line line : text) {
                line.appendMarkdown(builder);
                newline(builder, "text");
            }
        }

        public void appendHTML(StringBuilder builder) {
            builder.append("<p>");
            for (Line line : text) {
                line.appendHTML(builder);
                builder.append("\n");
            }
        }

        public void appendStructure(StringBuilder builder, int level) {
            builder.append("\n");
            builder.append(" ".repeat(level * 2));
            builder.append("TextBlock");
            for (Line element : text) {
                element.appendStructure(builder, level + 1);
            }
        }
    }

    public record MarkdownBlock(Node text) implements Section {
        public void appendMarkdown(StringBuilder builder) {
            MarkdownRenderer renderer = MarkdownRenderer.builder().build();
            builder.append(renderer.render(text));
        }

        public void appendHTML(StringBuilder builder) {
            HtmlRenderer renderer = HtmlRenderer.builder().build();
            builder.append(renderer.render(text));
        }

        public void appendStructure(StringBuilder builder, int level) {
            builder.append("\n");
            builder.append(" ".repeat(level * 2));
            builder.append("MarkdownBlock");
        }
    }

    public record CodeBlock(List<Line> lines) implements Section {
        public void appendMarkdown(StringBuilder builder) {
            for (Line line : lines) {
                builder.append("    ");
                line.appendMarkdown(builder);
                newline(builder, "code");
            }
        }

        public void appendHTML(StringBuilder builder) {
            builder.append("<pre>");
            builder.append("\n");
            for (Line line : lines) {
                line.appendHTML(builder);
                builder.append("\n");
            }
            builder.append("</pre>");
        }

        public void appendStructure(StringBuilder builder, int level) {
            builder.append("\n");
            builder.append(" ".repeat(level * 2));
            builder.append("CodeBlock");
            for (Line element : lines) {
                element.appendStructure(builder, level + 1);
            }
        }
    }

    public record Definition(List<Section> title, List<Section> lines, String id) implements Section {

        Definition(List<Section> title, List<Section> lines) {
            this(title, lines, "");
        }

        public void appendMarkdown(StringBuilder builder) {
            // Sections don't want newlines after, just in between.
            boolean sep = false;
            for (Section line : title) {
                if (sep) {
                    newline(builder, "title");
                }
                line.appendMarkdown(builder);
                sep = true;
            }

            for (Section line : lines) {
                if (sep) {
                    newline(builder, "body");
                }
                line.appendMarkdown(builder);
                sep = true;
            }
        }

        public void appendHTML(StringBuilder builder) {
            builder.append("<dt");
            if (this.id != null) {
                builder.append(String.format(" id=\"%s\"", this.id));
            }
            builder.append(">");
            for (Section line : title) {
                line.appendHTML(builder);
            }
            builder.append("</dt>");

            builder.append("<dd>");
            for (Section line : lines) {
                line.appendHTML(builder);

            }
            builder.append("</dd>");

            builder.append("\n");
        }

        public void appendStructure(StringBuilder builder, int level) {
            builder.append("\n");
            builder.append(" ".repeat(level * 2));
            builder.append("Definition");

            int nextLevel = level + 1;

            builder.append("\n");
            builder.append(" ".repeat(nextLevel * 2));
            builder.append("Title");
            for (Section element : title) {
                element.appendStructure(builder, nextLevel + 1);
            }

            builder.append("\n");
            builder.append(" ".repeat(nextLevel * 2));
            builder.append("Body");
            for (Section element : lines) {
                element.appendStructure(builder, nextLevel + 1);
            }
        }
    }

    Deque<List<Section>> sectionStack = new ArrayDeque<>();

    List<Section> sections = new ArrayList<>();

    List<Line> lines = new ArrayList<>();

    List<LineElement> elements = new ArrayList<>();

    String id = null;

    int headerMode = 0;

    boolean codeMode = false;

    boolean definitionMode = false;

    public static DocBuilder fromDocText(String text) {
        return new DocBuilder().parse(text);
    }

    /**
     * Throws an error. Appends the structure of the doc that has been read so far
     * as indication of the error location for the user.
     * 
     * @param string
     * @param args
     */
    private void throwError(String string, Object... args) {
        String message = args.length == 0 ? string : String.format(string, args);
        throw new PacioliException(this.structure() + "\n\n" + message);
    }

    /**
     * For the id in headers and definitions. In HTML the link can refer to these
     * elements.
     * 
     * @param id DOM id
     */
    private void putId(String id) {
        if (this.id != null) {
            throwError("Ambiguous id, setting %s, but %s is stacked", id, this.id);
        }
        this.id = id;
    }

    /**
     * See putId.
     * 
     * @return The id that was previously put.
     */
    private String useId() {
        if (id == null) {
            throwError("Id is null");
        }
        String currentId = this.id;
        this.id = null;
        return currentId;

    }

    /**
     * For Definition. That element has nested sections.
     */
    private void push() {
        this.endBlock();
        this.sectionStack.push(new ArrayList<>(this.sections));
        this.sections = new ArrayList<>();
    }

    /**
     * See push.
     * 
     * @return
     */
    private List<Section> pop() {
        var currentSections = new ArrayList<>(this.sections);
        this.sections = this.sectionStack.pop();
        return currentSections;
    }

    private void flushLines() {
        this.flushLine();

        if (this.codeMode) {
            this.sections.add(new CodeBlock(this.lines));
        } else {
            if (!lines.isEmpty()) {
                this.sections.add(new TextBlock(this.lines));
            }
        }

        this.codeMode = false;

        this.lines = new ArrayList<>();
    }

    private void flushLine() {
        if (!this.elements.isEmpty()) {
            this.lines.add(new Line(this.elements));
            this.elements = new ArrayList<>();
        }

        if (this.headerMode > 0) {
            this.sections.add(new Header(this.headerMode, this.lines.get(0), this.id == null ? null : this.useId()));
            this.lines = new ArrayList<>();
            this.headerMode = 0;
        }
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder endLine() {
        this.flushLine();
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder endBlock() {
        this.flushLines();
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder startCode() {
        this.endBlock();
        this.codeMode = true;
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder endCode() {
        if (!codeMode) {
            throwError("Not in code mode when closing code mode.");
        }

        this.endBlock();
        this.codeMode = false;

        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder header(int level) {
        this.endBlock();
        headerMode = level;
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder header(int level, String id) {
        this.endBlock();
        this.putId(id);
        headerMode = level;
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder text(String string, Object... args) {
        this.elements.add(new Text(args.length == 0 ? string : String.format(string, args)));
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder code(String string, Object... args) {
        this.elements.add(new Code(args.length == 0 ? string : String.format(string, args)));
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder link(String text, String url) {
        this.elements.add(new Link(text, url));
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder line(String string, Object... args) {
        this.endLine();
        this.lines.add(new Line(Arrays.asList(new Text(args.length == 0 ? string : String.format(string, args)))));
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder definition() {
        this.endBlock();
        this.push();
        this.definitionMode = true;
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder definition(String id) {
        this.endBlock();
        this.push();
        this.id = id;
        this.definitionMode = true;
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder body() {
        this.endLine();
        if (!this.definitionMode) {
            throwError("No definition before body");
        }
        if (this.lines.size() != 1) {
            throwError("More than one definition before body");
        }
        this.push();

        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public void endBody() {
        if (this.codeMode) {
            throwError("Unclosed code block when closing definition");
        }

        if (!this.definitionMode) {
            throwError("Not in definition when closing body.");
        }

        this.endBlock();

        var bodySections = this.pop();
        var defSections = this.pop();

        if (bodySections.isEmpty()) {
            throwError("No lines for definition body");
        }

        if (defSections.isEmpty()) {
            throwError("No lines for definition title");
        }

        this.sections.add(new Definition(defSections, bodySections, this.id));

        this.definitionMode = false;
        this.codeMode = false;

        this.lines = new ArrayList<>();
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder newline() {
        this.endLine();
        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder parse(String text) {
        this.flushLines();

        Parser parser = Parser.builder().build();
        Node document = parser.parse(text);
        this.sections.add(new MarkdownBlock(document));

        return this;
    }

    /**
     * Fluent API
     * 
     * Splits the text into lines and adds each line as text. Does not parse
     * the lines. Use builder.parse(text) instead of builder.inject(text)
     * if the lines must be parsed.
     * 
     * @param text A (multi-line) text.
     * @return The builder for fluent chaining
     */
    public DocBuilder inject(String text) {
        this.endLine();

        List<Line> ls = new ArrayList<>();

        String[] slines = text.split("\\r?\\n");
        for (String line : slines) {
            ls.add(new Line(Arrays.asList(new Text(line))));
        }

        this.lines.addAll(ls);

        return this;
    }

    /**
     * Fluent API
     * 
     * @return
     */
    public DocBuilder merge(DocBuilder other) {
        this.endBlock();
        other.endBlock();

        if (other.codeMode || other.definitionMode) {
            throwError("merged docbuilder not closed.");
        }

        this.sections.addAll(other.sections);
        return this;
    }

    /**
     * Generate markdown documentation.
     * 
     * @return
     */
    public String markdown() {
        this.endBlock();
        var content = new StringBuilder();

        int i = 0;

        for (Section section : this.sections) {
            if (i > 0) {
                content.append(FLAG_SHOW_NEWLINE_DEBUG_TAGS ? "|\n" : "\n");
            }

            section.appendMarkdown(content);

            i++;
        }

        return content.toString();

    }

    /**
     * Generate HTML documentation.
     * 
     * @return
     */
    public String html() {
        this.endBlock();
        var content = new StringBuilder();

        int i = 0;

        for (Section section : this.sections) {

            if (i > 0) {
                content.append("\n\n");
            }

            section.appendHTML(content);

            i++;

        }

        return content.toString();

    }

    /**
     * Dev tool
     */
    public String structure() {
        this.endBlock();

        var content = new StringBuilder();

        content.append("Doc");

        for (Section section : this.sections) {
            section.appendStructure(content, 1);
        }

        content.append("\n");

        return content.toString();
    }
}
