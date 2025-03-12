package pacioli.compiler;

import java.io.PrintWriter;
import java.util.List;
import java.util.Stack;
import java.util.function.Consumer;
import pacioli.ast.Node;
import pacioli.ast.Visitor;

/**
 * Wrapper around a PrintWriter that adds indentation and some convenience
 * methods.
 */
public class Printer {

    private static final Integer DELTA = 4;

    public final PrintWriter out;

    private final boolean useIndentation;

    private final Stack<Integer> indentationStack = new Stack<Integer>();

    private Integer indentation = 0;
    private Integer offset = 0;

    public Printer(PrintWriter printWriter) {
        out = printWriter;
        useIndentation = true;
    }

    public Printer(PrintWriter printWriter, boolean useIndentation) {
        out = printWriter;
        this.useIndentation = useIndentation;
    }

    public void format(String string, Object... args) {
        String text = String.format(string, args);
        out.print(text);
        offset += text.length();
    }

    public void print(String text) {
        out.print(text);
        offset += text.length();
    }

    public void write(String text) {
        out.print(text);
        offset += text.length();
    }

    public void mark() {
        if (useIndentation) {
            indentationStack.push(indentation);
            indentation = offset;
        }
    }

    public void unmark() {
        if (useIndentation) {
            indentation = indentationStack.pop();
        }
    }

    public void newline() {
        out.format("\n");
        for (int i = 0; i < indentation; i++) {
            out.print(" ");
        }
        offset = indentation;
    }

    public void newlineUp() {
        if (useIndentation) {
            indentation += DELTA;
        }
        newline();
    }

    public void newlineDown() {
        if (useIndentation) {
            indentation -= DELTA;
        }
        newline();
    }

    public void writeCommaSeparated(List<? extends Node> nodes, Visitor visitor) {
        Boolean sep = false;
        for (Node node : nodes) {
            if (sep) {
                write(", ");
            } else {
                sep = true;
            }
            node.accept(visitor);
        }
    }

    public <T> void writeCommaSeparated(List<? extends T> nodes,
            Consumer<? super T> callback) {
        Boolean sep = false;
        for (T node : nodes) {
            if (sep) {
                write(", ");
            } else {
                sep = true;
            }
            callback.accept(node);
        }
    }

    public void writeStringsCommaSeparated(List<String> nodes, Visitor visitor) {
        Boolean sep = false;
        for (String node : nodes) {
            if (sep) {
                write(", ");
            } else {
                sep = true;
            }
            write(node);
        }
    }
}
