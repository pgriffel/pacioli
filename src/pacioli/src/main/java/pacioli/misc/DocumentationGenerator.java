package pacioli.misc;

import java.io.IOException;
import java.io.Writer;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.types.TypeObject;

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

    // Info for the entire module
    private final String module;
    private final String version;
    private final Writer writer;

    // Info per value/function
    Map<String, String> typeTable = new HashMap<>();
    Map<String, String> documentationTable = new HashMap<>();
    Map<String, List<String>> argumentsTable = new HashMap<>();

    Set<String> functions = new HashSet<>();
    Set<String> values = new HashSet<>();

    // Info for type definitions
    Map<String, String> typeDocs = new HashMap<>();
    Map<String, String> typeLHS = new HashMap<>();
    Map<String, String> typeRHS = new HashMap<>();
    Map<String, String> typeDecl = new HashMap<>();

    // Info for index sets
    Map<String, String> indexSetDocs = new HashMap<>();

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public DocumentationGenerator(Writer writer, String module, String version) {
        this.module = module;
        this.version = version;
        this.writer = writer;
    }

    public void addValue(String name, TypeObject type, String documentation) {
        if (argumentsTable.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add value %s, it is already added as function", name));
        }
        typeTable.put(name, type.pretty());
        documentationTable.put(name, documentation);
        values.add(name);
    }

    public void addValue(String name, String type, String documentation) {
        if (argumentsTable.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add value %s, it is already added as function", name));
        }
        typeTable.put(name, type);
        documentationTable.put(name, documentation);
        values.add(name);
    }

    public void addFunction(String name, List<String> arguments, TypeObject type, String documentation) {
        if (argumentsTable.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add function %s, it is already added", name));
        }
        typeTable.put(name, type.pretty());
        documentationTable.put(name, documentation);
        argumentsTable.put(name, arguments);
        functions.add(name);
    }

    public void addFunction(String name, List<String> arguments, String type, String documentation) {
        if (argumentsTable.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add function %s, it is already added", name));
        }
        typeTable.put(name, type);
        documentationTable.put(name, documentation);
        argumentsTable.put(name, arguments);
        functions.add(name);
    }

    public void addIndexSet(String name, String documentation) {
        if (typeDocs.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add type %s, it is already added", name));
        }
        indexSetDocs.put(name, documentation);
    }

    public void addType(String name, String vars, String lhs, String rhs, String documentation) {
        if (typeDocs.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add type %s, it is already added", name));
        }
        typeDecl.put(name, vars);
        typeLHS.put(name, lhs);
        typeRHS.put(name, rhs);
        typeDocs.put(name, documentation);
    }

    private String lookupType(String name) {
        return typeTable.get(name);
    }

    private List<String> getDocuParts(String name) {
        String docu = documentationTable.get(name);
        String[] parts = docu.split("\\r?\\n\s*\\r?\\n");
        return List.of(parts);
    }

    private static List<String> docuParts(String docu) {
        String[] parts = docu.split("\\r?\\n\s*\\r?\\n");
        return List.of(parts);
    }

    public String argsString(String name) {
        return Utils.intercalate(", ", argumentsTable.get(name));
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
    void generateMarkdown() throws PacioliException, IOException {

        List<String> vals = new ArrayList<String>(values);
        Collections.sort(vals);

        List<String> funs = new ArrayList<String>(functions);
        Collections.sort(funs);

        // Generate a general section about the module
        println("# Module %s", module);
        println("Interface for the %s module", module);
        println("");
        println("Version %s, %s", version, ZonedDateTime.now());

        // Print the types for the values and the function in a synopsis section
        println("## Synopsis");
        println("");
        for (String value : vals) {
            println("%s :: %s", value, typeTable.get(value));
        }
        if (values.size() > 0) {
            println("");
        }
        for (String function : funs) {
            println("%s :: %s", function, typeTable.get(function));
        }
        println("");

        // Print details for the values
        println("## Values");
        if (values.size() == 0) {
            println("n/a");
        } else {
            println("");
            for (String value : vals) {
                println("### %s", value);
                println("");
                println(":: %s", typeTable.get(value));
                for (String part : getDocuParts(value)) {
                    println("\n%s\n", part);
                }
                println("");
            }
            println("");
        }

        // Print details for the functions
        println("## Functions");
        println("");
        for (String function : funs) {
            String args = String.format("(%s)", argsString(function));
            println("### %s%s", function, args);
            println("");
            println(":: %s", lookupType(function));
            for (String part : getDocuParts(function)) {
                println("\n%s\n", part);
            }
            println("");

        }
        println("");

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
        println("<h1>Module %s</h1>", module);
        println("<p>Interface for the %s module</p>", module);
        println("<small>Version %s, %s</small>", version, ZonedDateTime.now());

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
            for (String value : indexSetDocs.keySet()) {
                println("<dt id=\"%s\"><code>%s</code></dt>",
                        value, value);
                println("<dd>");
                for (String part : docuParts(indexSetDocs.get(value))) {
                    println("\n<p>%s</p>\n", part);
                }
                println("</dd>");
            }
            println("</dl>");
        }

        // Print details for the types
        if (typeDocs.size() > 0) {
            println("<h2>Types</h2>");
            println("<dl>");
            for (String value : typeDocs.keySet()) {
                println("<dt id=\"%s\"><code>%s</code></dt>",
                        value, value);
                println("<dd>");
                println("<pre>%s%s = %s</pre>", typeDecl.get(value), typeLHS.get(value), typeRHS.get(value));
                for (String part : docuParts(typeDocs.get(value))) {
                    println("\n<p>%s</p>\n", part);
                }
                println("</dd>");
            }
            println("</dl>");
        }

        // Print details for the values
        if (values.size() > 0) {
            println("<h2>Values</h2>");
            println("<dl>");
            for (String value : vals) {
                println("<dt id=\"%s\"><code>%s</code></dt>", value, value);
                println("<dd>");
                println("<pre>:: %s</pre>", typeTable.get(value));
                for (String part : getDocuParts(value)) {
                    println("\n<p>%s</p>\n", part);
                }
                println("</dd>");
            }
            println("</dl>");
        }

        // Print details for the functions
        if (funs.size() > 0) {
            println("<h2>Functions</h2>");
            println("<dl>");
            for (String function : funs) {
                String args = String.format("(%s)", argsString(function));
                println("<dt id=\"%s\"><code>%s%s</code></dt>", function, function, args);
                println("<dd>");
                println("<pre>:: %s</pre>", lookupType(function));
                for (String part : getDocuParts(function)) {
                    println("\n<p>%s</p>\n", part);
                }
                println("</dd>");

            }
            println("</dl>");
        }

        // Finish the html
        println("</body>");
        println("</html>");
    }

}
