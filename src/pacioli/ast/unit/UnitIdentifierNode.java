package pacioli.ast.unit;

import java.io.PrintWriter;

import pacioli.Dictionary;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.types.PacioliType;
import pacioli.types.matrix.StringBase;
import uom.Unit;

public class UnitIdentifierNode extends AbstractUnitNode {

	private final String name;
	private final String prefix;

	public UnitIdentifierNode(String name) {
		this.name = name;
		this.prefix = null;
	}

	public UnitIdentifierNode(String prefix, String name) {
		this.prefix = prefix;
		this.name = name;
	}

	@Override
	public Unit eval() {
		if (prefix == null) {
			return new StringBase(name);
		} else {
			return new StringBase(prefix, name);
		}
	}

	@Override
	public void printText(PrintWriter out) {
		if (prefix == null) {
			out.print(name);
		} else {
			out.print(prefix);
			out.print(":");
			out.print(name);
		}
	}

	@Override
	public String compileToJS() {
		if (prefix == null) {
			return "new PowerProduct('" + name + "')"; 
		} else {
			return "new PowerProduct('" + prefix + "$" + name + "')";
		}
	}

}
