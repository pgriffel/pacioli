package pacioli.types.visitors;

import java.util.Collection;
import java.util.Stack;

import pacioli.types.TypeObject;

public class Collector<T> extends VisitType {

    protected Stack<Collection<T>> nodeStack = new Stack<>();

    protected Collection<T> empty;

    Collector(Collection<T> empty) {
        this.empty = empty;
    }

    protected void addItem(T item) {
        nodeStack.peek().add(item);
    }

    public Collection<T> acceptTypeObject(TypeObject child) {
        nodeStack.push(empty);
        child.accept(this);
        return nodeStack.pop();
    }

}
