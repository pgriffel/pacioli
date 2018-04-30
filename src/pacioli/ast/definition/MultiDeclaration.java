package pacioli.ast.definition;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import pacioli.CompilationSettings;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.symboltable.GenericInfo;
import pacioli.types.ast.TypeNode;

public class MultiDeclaration extends AbstractDefinition {

    public List<IdentifierNode> ids;
    public TypeNode node;

    public MultiDeclaration(Location location, List<IdentifierNode> ids, TypeNode node) {
        super(location);
        this.ids = ids;
        this.node = node;
    }

    @Override
    public String compileToJS(boolean boxed) {
        throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
    }

    @Override
    public String compileToMATLAB() {
        throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
    }

    @Override
    public void printText(PrintWriter out) {
        List<String> names = new ArrayList<String>();
        for (IdentifierNode id : ids) {
            names.add(id.getName());
        }
        out.format("declare %s :: %s;\n", pacioli.Utils.intercalate(",", names), node.toText());
        // throw new RuntimeException("Cannot do that on a multi declaration. Can only
        // addToProgram");
    }

    @Override
    public String localName() {
        throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
    }

    @Override
    public String globalName() {
        throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
    }

    @Override
    public void setModule(PacioliFile module) {
        throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
    }

    @Override
    public PacioliFile getModule() {
        throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
    }

    @Override
    public void addToProgr(Progam program, GenericInfo generic) {
        // obsolete?!
        for (IdentifierNode id : ids) {
            Declaration declaration = new Declaration(getLocation(), id, node);
            declaration.addToProgr(program, generic);
        }
    }

}
