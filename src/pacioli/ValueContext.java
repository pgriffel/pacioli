package pacioli;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

public class ValueContext extends AbstractPrintable {

    private final List<String> vars = new ArrayList<String>();
    private final List<String> refVars = new ArrayList<String>();
    private String statementResult;

    public ValueContext() {
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("some value context");
    }

    public List<String> vars() {
        return vars;
    }

    public boolean containsVar(String var) {
        return vars.contains(var);
    }

    public boolean isRefVar(String var) {
        return refVars.contains(var);
    }

    public void addAll(ValueContext context) {
        addVars(context.vars);
        addRefVars(context.refVars);
    }

    public void addVars(List<String> vars) {
        for (String var : vars) {
            addVar(var);
        }
    }

    public void addRefVars(List<String> vars) {
        for (String var : vars) {
            addRefVar(var);
        }
    }

    public void addVar(String var) {
        vars.add(var);
    }

    public void addVar(String var, boolean isRef) {
        vars.add(var);
        if (isRef) {
            refVars.add(var);
        }
    }

    public void addRefVar(String var) {
        vars.add(var);
        refVars.add(var);
    }

    public String getStatementResult() {
        return statementResult;
    }

    public void setStatementResult(String string) {
        statementResult = string;
    }
}
