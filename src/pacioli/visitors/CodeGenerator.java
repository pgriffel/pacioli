package pacioli.visitors;

import pacioli.ast.Visitor;
import pacioli.ast.definition.ValueDefinition;
import pacioli.symboltable.ValueInfo;

public interface CodeGenerator extends Visitor {

    void compileValueDefinition(ValueDefinition def, ValueInfo info);
}
