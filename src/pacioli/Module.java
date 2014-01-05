/*
 * Copyright (c) 2013 Paul Griffioen
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

package pacioli;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.ast.definition.Definition;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.unit.UnitNode;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;

public class Module extends AbstractPrintable {

    private final String name;
    private final List<String> includes;
    private File file = null;
    
    public static final List<String> defaultIncludes =
            new ArrayList<String>(Arrays.asList("primitives", "list", "matrix", "standard"));
    public static final List<String> debugablePrimitives  =
            new ArrayList<String>(Arrays.asList("primitives", "list", "matrix"));

    public Module(String name) {
        this.name = name;
        this.includes = new ArrayList<String>();
    }

	public String getName() {
		return name;
	}
	
	public List<String> getIncludes() {
		return includes;
	}

	public void setFile(File file) {
		this.file = file;
	}
	
	public File directory() {
		return file.getParentFile();
	}
	
    public void include(String name) {
        if (getIncludes().contains(name)) {
            Pacioli.warn("Module '%s' is already included", name);
        } else {
            getIncludes().add(name);
        }
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("module \"%s\";\n", name);
        for (String i : getIncludes()) {
            out.format("include \"%s\";\n", i);
        }
    }

}
