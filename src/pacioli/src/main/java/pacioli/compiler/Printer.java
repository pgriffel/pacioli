package pacioli.compiler;

import java.io.PrintWriter;
import java.util.List;
import java.util.Stack;
import java.util.function.Consumer;
import pacioli.ast.Node;
import pacioli.ast.Visitor;

public class Printer {

    public PrintWriter out;
    private Stack<Integer> indentationStack;
    Integer indentation = 0;
    Integer offset = 0;
    final Integer delta = 4;

    public Printer(PrintWriter printWriter) {
        indentationStack = new Stack<Integer>();
        out = printWriter;
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
        indentationStack.push(indentation);
        indentation = offset;
        // offset =
    }

    public void unmark() {
        indentation = indentationStack.pop();
        // offset =
    }

    public void newline() {
        out.format("\n");
        for (int i = 0; i < indentation; i++) {
            out.print(" ");
        }
        offset = indentation;
    }

    public void newlineUp() {
        indentation += delta;
        newline();
    }

    public void newlineDown() {
        indentation -= delta;
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
