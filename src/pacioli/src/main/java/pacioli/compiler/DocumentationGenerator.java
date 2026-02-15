/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
 * Creates documentation for a Pacioli module.
 *
 */
public class DocumentationGenerator {

    private static final boolean FLAG_USE_DEFINTIONS = false;
    private static final boolean FLAG_SHOW_TYPE_DEF_BODY = false;

    // Info for the entire module
    private final String module;
    private final String version;

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

    public DocumentationGenerator(String module, String version) {
        this.module = module;
        this.version = version;
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
        return docu == null ? "" : docu.rawText();
    }

    private String getIndexSetDoc(String name) {
        Documentation docu = indexSetDocs.get(name);
        return docu == null ? "" : docu.rawText();
    }

    private String getTypeDoc(String name) {
        Documentation docu = typeDocs.get(name);
        return docu == null ? "" : docu.rawText();
    }

    public String argsString(String name) {
        return String.join(", ", argumentsTable.get(name));
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

    /**
     * Generates a documentation page with documentation for the bundle's module.
     * 
     * @param writer Writer the page is written to
     * @param target One of markdown, structore or html
     * @throws PacioliException
     * @throws IOException
     */
    public void generate(final Writer writer, String target) throws PacioliException, IOException {
        switch (target) {
            case "markdown": {
                this.markdown(writer);
                break;
            }
            case "structure": {
                this.structure(writer);
                break;
            }
            case "", "html": {
                this.html(writer);
                break;
            }
            default: {
                throw new PacioliException("Unknown target: " + target);
            }
        }
    }

    /**
     * Generates a markdown page with documentation for the bundle's module.
     * 
     * @param writer Writer the page is written to
     * @throws PacioliException
     * @throws IOException
     */
    public void markdown(final Writer writer) throws PacioliException, IOException {
        writer.write(this.docBuilder().markdown());
        writer.write(String.format("\nVersion %s, %s", version, ZonedDateTime.now()));
    }

    /**
     * Generates a html page with documentation for the bundle's module.
     * 
     * @param writer Writer the page is written to
     * @throws PacioliException
     * @throws IOException
     */
    public void html(final Writer writer) throws PacioliException, IOException {
        writeHTMLHeader(writer);
        writer.write(this.docBuilder().html());
        writeHTMLFooter(writer);
    }

    public void structure(final Writer writer) throws PacioliException, IOException {
        writer.write(this.docBuilder().structure());
    }

    private void writeHTMLHeader(final Writer writer) throws IOException {
        writer.write("<!DOCTYPE html>\n");
        writer.write("<html>\n");
        writer.write("<head>\n");
        writer.write(String.format("<title>%s</title>\n", module));
    }

    private void writeHTMLFooter(final Writer writer) throws IOException {

        writer.write("<p><small>");
        writer.write(String.format("Version %s, %s", version, ZonedDateTime.now()));
        writer.write("</small>");

        writer.write("</body>\n");
        writer.write("</html>\n");
    }

    private DocBuilder docBuilder() throws PacioliException {

        DocBuilder docbuilder = new DocBuilder();

        List<String> vals = new ArrayList<String>(values);
        Collections.sort(vals);

        List<String> funs = new ArrayList<String>(functions);
        Collections.sort(funs);

        // A general section about the module
        docbuilder
                .header(1)
                .text("The %s library", module)
                .newline();

        if (this.intro != null) {
            docbuilder.parse(intro);
        } else {
            docbuilder.text("Interface for the ");
            docbuilder.code(module);
            docbuilder.text(" library");
        }

        // Print the types for the values and the function in a synopsis section
        docbuilder.header(2).text("Synopsis");

        docbuilder.startCode();

        for (String value : vals) {
            docbuilder.link(value, value);
            docbuilder.text(String.format(" :: %s", typeTable.get(value)));
            docbuilder.newline();
        }
        if (!values.isEmpty()) {
            docbuilder.line("");
        }
        for (String function : funs) {
            docbuilder.link(function, function);
            docbuilder.text(String.format(" :: %s", typeTable.get(function)));
            docbuilder.newline();
        }

        docbuilder.endCode();

        // Print details for the index sets
        if (indexSetDocs.size() > 0) {

            docbuilder.header(2).text("Index sets");

            for (String name : indexSetDocs.keySet()) {

                // Index set name
                if (FLAG_USE_DEFINTIONS) {
                    docbuilder.definition(name);
                    docbuilder.code(name);
                    docbuilder.body();
                } else {
                    docbuilder.header(3, name).text(name).newline();
                }

                // The index set documentation
                docbuilder.parse(getIndexSetDoc(name));

                if (FLAG_USE_DEFINTIONS) {
                    docbuilder.endBody();
                }
            }
        }

        // Print details for the types
        if (typeDocs.size() > 0) {

            docbuilder.header(2).text("Types");

            for (String name : typeDocs.keySet()) {
                // The type name
                if (FLAG_USE_DEFINTIONS) {
                    docbuilder.definition(name);
                    docbuilder.code(name);
                    docbuilder.body();
                } else {
                    docbuilder.header(3, name).text(name).newline();
                }

                // The type definition
                if (FLAG_SHOW_TYPE_DEF_BODY) {
                    docbuilder.startCode();
                    docbuilder.text("%s%s = %s", typeDecl.get(name), typeLHS.get(name), typeRHS.get(name));
                    docbuilder.endCode();
                } else {
                    docbuilder.startCode();
                    docbuilder.text("%s%s", typeDecl.get(name), typeLHS.get(name));
                    docbuilder.endCode();
                }

                // The type documentation
                docbuilder.parse(getTypeDoc(name));

                if (FLAG_USE_DEFINTIONS) {
                    docbuilder.endBody();
                }
            }
        }

        // Print details for the values
        if (!values.isEmpty()) {

            docbuilder.header(2).text("Values");

            for (String name : vals) {

                if (FLAG_USE_DEFINTIONS) {
                    docbuilder.definition(name);
                    docbuilder.code(name);
                    docbuilder.body();
                } else {
                    docbuilder.header(3, name).text(name).newline();
                }

                docbuilder.startCode();
                docbuilder.text(":: %s", lookupType(name));
                docbuilder.endCode();

                if (this.primitives.contains(name)) {
                    docbuilder.text("Primitive value");
                }

                docbuilder.parse(getDoc(name));

                if (FLAG_USE_DEFINTIONS) {
                    docbuilder.endBody();
                }
            }
        }

        // Print details for the functions
        if (!funs.isEmpty()) {

            docbuilder.header(2).text("Functions").newline();

            for (String name : funs) {
                if (FLAG_USE_DEFINTIONS) {
                    docbuilder.definition(name);
                    docbuilder.code(name);
                    docbuilder.body();
                } else {
                    docbuilder.header(3, name).text(name).newline();
                }

                docbuilder.startCode();
                docbuilder.text(":: %s", lookupType(name));
                docbuilder.endCode();

                Documentation docu = documentationTable.get(name);

                docbuilder.parse(docu == null ? "" : docu.rawText());

                if (this.primitives.contains(name)) {
                    docbuilder.text(" Primitive function");
                }

                if (FLAG_USE_DEFINTIONS) {
                    docbuilder.endBody();
                }
            }
        }

        return docbuilder;
    }

}
