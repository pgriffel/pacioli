package pacioli.types.ast;

import java.io.PrintWriter;
import pacioli.CompilationSettings;
import pacioli.Location;
import pacioli.ast.Visitor;

public class PrefixUnitTypeNode extends AbstractTypeNode {

    public final TypeIdentifierNode prefix;
    public final TypeIdentifierNode unit;

    public PrefixUnitTypeNode(Location location, TypeIdentifierNode prefix, TypeIdentifierNode unit) {
        super(location);
        this.prefix = prefix;
        this.unit = unit;
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("%s:%s", prefix.toText(), unit.toText());
    }

	@Override
	public String compileToJS(boolean boxed) {
		return "Pacioli.scalarShape(Pacioli.unit('" + prefix + "', '" + unit + "'))";
	}
	
	public String MVMCode(CompilationSettings settings) {
		return "scalar_shape(scaled_unit(\"" + prefix.getName() + "\", \"" + unit.getName() + "\"))";
	}

	@Override
	public void accept(Visitor visitor) {
		visitor.visit(this);
	}
}
