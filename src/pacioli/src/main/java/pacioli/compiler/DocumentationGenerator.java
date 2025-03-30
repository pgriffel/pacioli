/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
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

package pacioli.compiler;

import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.nio.file.Files;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.ast.definition.Documentation;
import pacioli.types.type.TypeObject;

/**
 * A Program corresponds to a Pacioli file and is the unit of compilation.
 * 
 * A Program contains the AST and the symboltables for the Pacioli code in
 * a file. It can be constructed by loading a PacioliFile.
 * 
 * Once a program has been loaded it can be used to generate code, display
 * types, etc.
 *
 */
public class DocumentationGenerator {

    // Setting
    boolean showTypeDefBody = false;

    // Info for the entire module
    private final String module;
    private final String version;
    private final Writer writer;

    // Info per value/function
    Map<String, String> typeTable = new HashMap<>();
    Map<String, Documentation> documentationTable = new HashMap<>();
    Map<String, List<String>> argumentsTable = new HashMap<>();

    Set<String> functions = new HashSet<>();
    Set<String> values = new HashSet<>();

    // Is a function or value primitive?
    Set<String> primitives = new HashSet<>();

    // Info for type definitions
    Map<String, Documentation> typeDocs = new HashMap<>();
    Map<String, String> typeLHS = new HashMap<>();
    Map<String, String> typeRHS = new HashMap<>();
    Map<String, String> typeDecl = new HashMap<>();

    // Info for index sets
    Map<String, Documentation> indexSetDocs = new HashMap<>();

    private String intro;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public DocumentationGenerator(Writer writer, String module, String version) {
        this.module = module;
        this.version = version;
        this.writer = writer;
    }

    public void addValue(String name, TypeObject type) {
        if (argumentsTable.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add value %s, it is already added as function", name));
        }
        typeTable.put(name, type.pretty());
        values.add(name);
    }

    public void addPrimitiveValue(String name, String type) {
        this.addValue(name, type);
        this.primitives.add(name);
    }

    public void addPrimitiveValue(String name, TypeObject type) {
        this.addValue(name, type);
        this.primitives.add(name);
    }

    public void addValue(String name, String type) {
        if (argumentsTable.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add value %s, it is already added as function", name));
        }
        typeTable.put(name, type);
        values.add(name);
    }

    public void addFunction(String name, List<String> arguments, TypeObject type) {
        if (argumentsTable.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add function %s, it is already added", name));
        }
        typeTable.put(name, type.pretty());
        argumentsTable.put(name, arguments);
        functions.add(name);
    }

    public void addFunction(String name, List<String> arguments, String type) {
        if (argumentsTable.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add function %s, it is already added", name));
        }
        typeTable.put(name, type);
        argumentsTable.put(name, arguments);
        functions.add(name);
    }

    public void addValueDoc(String name, Documentation documentation) {
        documentationTable.put(name, documentation);
    }

    public void addPrimitiveFunction(String name, List<String> arguments, TypeObject type,
            Documentation documentation) {
        this.addFunction(name, arguments, type);
        this.primitives.add(name);
    }

    public void addPrimitiveFunction(String name, List<String> arguments, String type) {
        this.addFunction(name, arguments, type);
        this.primitives.add(name);
    }

    public void addIndexSet(String name) {
        if (typeDocs.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add type %s, it is already added", name));
        }
    }

    public void addIndexSetDoc(String name, Documentation documentation) {
        indexSetDocs.put(name, documentation);
    }

    public void addType(String name, String vars, String lhs, String rhs) {
        if (typeDocs.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add type %s, it is already added", name));
        }
        typeDecl.put(name, vars);
        typeLHS.put(name, lhs);
        typeRHS.put(name, rhs);
    }

    public void addTypeDoc(String name, Documentation documentation) {
        typeDocs.put(name, documentation);
    }

    private String lookupType(String name) {
        return typeTable.get(name);
    }

    // todo: Parts van naam af.
    private String getDoc(String name) {
        Documentation docu = documentationTable.get(name);
        return docu == null ? "" : docu.asHtml();
    }

    private String getIndexSetDoc(String name) {
        Documentation docu = indexSetDocs.get(name);
        return docu == null ? "" : docu.asHtml();
    }

    private String getTypeDoc(String name) {
        Documentation docu = typeDocs.get(name);
        return docu == null ? "" : docu.asHtml();
    }

    public String argsString(String name) {
        return String.join(", ", argumentsTable.get(name));
    }

    private void println(String string, Object... args) throws IOException {
        writer.write(String.format(string, args));
        writer.write("\n");
    }

    /**
     * Generates a html page with documentation for the bundle's module.
     * 
     * @param includes A filter. Only code in the includes is included.
     * @param version  A description of the module's version that is added to the
     *                 output
     * @throws PacioliException
     * @throws IOException
     */
    // void generateMarkdown() throws PacioliException, IOException {

    // List<String> vals = new ArrayList<String>(values);
    // Collections.sort(vals);

    // List<String> funs = new ArrayList<String>(functions);
    // Collections.sort(funs);

    // // Generate a general section about the module
    // println("# Module %s", module);
    // println("Interface for the %s module", module);
    // println("");
    // println("Version %s, %s", version, ZonedDateTime.now());

    // // Print the types for the values and the function in a synopsis section
    // println("## Synopsis");
    // println("");
    // for (String value : vals) {
    // println("%s :: %s", value, typeTable.get(value));
    // }
    // if (values.size() > 0) {
    // println("");
    // }
    // for (String function : funs) {
    // println("%s :: %s", function, typeTable.get(function));
    // }
    // println("");

    // // Print details for the values
    // println("## Values");
    // if (values.size() == 0) {
    // println("n/a");
    // } else {
    // println("");
    // for (String value : vals) {
    // println("### %s", value);
    // println("");
    // println(":: %s", typeTable.get(value));
    // for (String part : getDocuParts(value)) {
    // println("\n%s\n", part);
    // }
    // println("");
    // }
    // println("");
    // }

    // // Print details for the functions
    // println("## Functions");
    // println("");
    // for (String function : funs) {
    // String args = String.format("(%s)", argsString(function));
    // println("### %s%s", function, args);
    // println("");
    // println(":: %s", lookupType(function));
    // for (String part : getDocuParts(function)) {
    // println("\n%s\n", part);
    // }
    // println("");

    // }
    // println("");

    // }

    /**
     * Generates a html page with documentation for the bundle's module.
     * 
     * @param includes A filter. Only code in the includes is included.
     * @param version  A description of the module's version that is added to the
     *                 output
     * @throws PacioliException
     * @throws IOException
     */
    void generate() throws PacioliException, IOException {

        List<String> vals = new ArrayList<String>(values);
        Collections.sort(vals);

        List<String> funs = new ArrayList<String>(functions);
        Collections.sort(funs);

        // Generate the general HTML headers
        println("<!DOCTYPE html>");
        println("<html>");
        println("<head>");
        println("<title>%s</title>", module);
        println("</head>");
        println("<body>");

        // Generate a general section about the module
        println("<h1>The <code>%s</code> library</h1>", module);
        if (this.intro != null) {
            println(intro);
        } else {
            println("<p>Interface for the <code>%s</code> library</p>", module);
        }

        // Print the types for the values and the function in a synopsis section
        println("<h2>Synopsis</h2>");
        println("<pre>");
        for (String value : vals) {
            println("<a href=\"#%s\">%s</a> :: %s", value, value, typeTable.get(value));
        }
        if (values.size() > 0) {
            println("");
        }
        for (String function : funs) {
            println("<a href=\"#%s\">%s</a> :: %s", function, function, typeTable.get(function));
        }
        println("</pre>");

        // Print details for the index sets
        if (indexSetDocs.size() > 0) {
            println("<h2>Index sets</h2>");
            println("<dl>");
            for (String name : indexSetDocs.keySet()) {
                println("<dt id=\"%s\"><code>%s</code></dt>",
                        name, name);
                println("<dd>");
                println("%s", getIndexSetDoc(name));
                println("</dd>");
            }
            println("</dl>");
        }

        // Print details for the types
        if (typeDocs.size() > 0) {
            println("<h2>Types</h2>");
            println("<dl>");
            for (String name : typeDocs.keySet()) {
                println("<dt id=\"%s\"><code>%s</code></dt>",
                        name, name);
                println("<dd>");
                if (showTypeDefBody) {
                    println("<pre>%s%s = %s</pre>", typeDecl.get(name), typeLHS.get(name), typeRHS.get(name));
                } else {
                    println("<pre>%s%s</pre>", typeDecl.get(name), typeLHS.get(name));
                }
                println("%s", getTypeDoc(name));
                println("</dd>");
            }
            println("</dl>");
        }

        // Print details for the values
        if (values.size() > 0) {
            println("<h2>Values</h2>");
            println("<dl>");
            for (String name : vals) {
                println("<dt id=\"%s\"><code>%s</code></dt>", name, name);
                println("<dd>");
                println("<pre>:: %s</pre>", typeTable.get(name));
                if (this.primitives.contains(name)) {
                    println("Primitive value");
                }
                println("%s", getDoc(name));
                println("</dd>");
            }
            println("</dl>");
        }

        // Print details for the functions
        if (funs.size() > 0) {

            if (false) {
                println("<h2>Functions</h2>");
                println("<dl>");
                for (String name : funs) {
                    String args = String.format("(%s)", argsString(name));
                    println("<dt id=\"%s\"><code>%s%s</code></dt>", name, name, args);
                    println("<dd>");
                    println("<pre>:: %s</pre>", lookupType(name));
                    if (this.primitives.contains(name)) {
                        println("Primitive function");
                    }
                    println(getDoc(name));
                    println("</dd>");

                }
                println("</dl>");
            } else {
                println("<h2>Functions</h2>");

                for (String name : funs) {
                    println("<h3 id=\"%s\">%s</h3>", name, name);
                    println("<p><code>:: %s</code>", lookupType(name));
                    if (this.primitives.contains(name)) {
                        println("<p>Primitive function");
                    }
                    println("%s", getDoc(name));
                }
            }
        }

        println("<p><small>Version %s, %s</small>", version, ZonedDateTime.now());

        // Finish the html
        println("</body>");
        println("</html>");
    }

    public void setIntro(String intro) {
        this.intro = intro;
    }

    public void setIntroFromDocFile(File docFile) throws IOException {
        List<String> read = Files.readAllLines(docFile.toPath());
        String total = "";
        for (String line : read) {
            total += line + "\n";
        }
        this.setIntro(total);
    }
}
