/*
 * Copyright (c) 2013 - 2014 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pacioli.ast.definition;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.eclipse.lsp4j.jsonrpc.messages.Either;

import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.IdentifierNode.Kind;
import pacioli.ast.expression.StringNode;
import pacioli.compiler.Location;

public class Documentation extends AbstractDefinition {

    public final IdentifierNode id;
    public final StringNode body;

    public Documentation(Location location, IdentifierNode id, StringNode body) {
        super(location);
        this.id = id;
        this.body = body;
    }

    @Override
    public String name() {
        return id.name();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public Node transform(ExpressionNode body) {
        if (body instanceof StringNode node) {
            return new Documentation(location(), id, node);

        } else {
            throw new RuntimeException("StringNode exptected in documentation transform");
        }
    }

    public Optional<Kind> kind() {
        return this.id.kind();
    }

    public String rawText() {
        return this.body.valueString();
    }

    public String asMarkdown() {
        var content = new StringBuilder();

        for (Either<String, String> part : splitCodeBlocks(stripLeftMargin(this.rawText()))) {
            if (part.isLeft()) {
                content.append(part.getLeft());
            } else {
                content.append(String.format("```pacioli%s```", part.getRight()));
            }
        }

        return replaceCodeFragments(content.toString());
    }

    public String asHtml() {
        var content = new StringBuilder();

        for (Either<String, String> part : splitCodeBlocks(stripLeftMargin(this.rawText()))) {
            if (part.isLeft()) {
                String[] parts = part.getLeft().split("\\r?\\n\s*\\r?\\n");
                for (String par : parts) {
                    content.append(String.format("%n<p>%s", par));
                }
            } else {
                content.append(String.format("<pre>%s</pre>", part.getRight()));
            }
        }

        return content.toString();
    }

    static private String stripLeftMargin(String doc) {
        return doc.replaceAll("\\r?\\n[ ][ ][ ][ ]", String.format("%n"));
    }

    static private String replaceCodeFragments(String doc) {
        return doc
                .replaceAll("<code>", String.format("`"))
                .replaceAll("</code>", String.format("`"));
    }

    static private List<Either<String, String>> splitCodeBlocks(String doc) {

        Pattern regex = Pattern.compile("([\\s\\S]*)<pre>([\\s\\S]*)</pre>([\\s\\S]*)");

        List<Either<String, String>> parts = new ArrayList<>();
        String todo = doc;

        Matcher matcher = regex.matcher(todo);

        while (matcher.find()) {
            parts.add(Either.forLeft(matcher.group(1)));
            parts.add(Either.forRight(matcher.group(2)));
            todo = matcher.group(3);
        }

        parts.add(Either.forLeft(todo));

        return parts;
    }
}
