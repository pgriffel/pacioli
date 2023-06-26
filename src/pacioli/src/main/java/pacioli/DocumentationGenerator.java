package pacioli;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.types.PacioliType;

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
    private String module;
    private String version;

    // Info per value/function
    Map<String, String> typeTable = new HashMap<>();
    Map<String, String> documentationTable = new HashMap<>();
    Map<String, List<String>> argumentsTable = new HashMap<>();

    Set<String> functions = new HashSet<>();
    Set<String> values = new HashSet<>();

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public DocumentationGenerator(String module, String version) {
        this.module = module;
        this.version = version;
    }

    public void addValue(String name, PacioliType type, String documentation) {
        if (argumentsTable.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add value %s, it is already added as function", name));
        }
        typeTable.put(name, type.deval().pretty());
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

    public void addFunction(String name, List<String> arguments, PacioliType type, String documentation) {
        if (argumentsTable.containsKey(name)) {
            throw new RuntimeException(String.format("Cannot add function %s, it is already added", name));
        }
        typeTable.put(name, type.deval().pretty());
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

    private String getType(String name) {
        return typeTable.get(name);
    }

    private List<String> getDocuParts(String name) {
        String docu = documentationTable.get(name);
        String[] parts = docu.split("\\r?\\n\s*\\r?\\n");
        return List.of(parts);
    }

    public String argsString(String name) {
        return Utils.intercalate(", ", argumentsTable.get(name));
    }

    /**
     * Generates a html page with documentation for the bundle's module.
     * 
     * @param includes A filter. Only code in the includes is included.
     * @param version  A description of the module's version that is added to the
     *                 output
     * @throws PacioliException
     */
    void generate() throws PacioliException {

        List<String> vals = new ArrayList<String>(values);
        Collections.sort(vals);

        List<String> funs = new ArrayList<String>(functions);
        Collections.sort(funs);

        // Generate the general HTML headers
        Pacioli.println("<!DOCTYPE html>");
        Pacioli.println("<html>");
        Pacioli.println("<head>");
        Pacioli.println("<title>%s</title>", module);
        Pacioli.println("</head>");
        Pacioli.println("<body>");

        // Generate a general section about the module
        Pacioli.println("<h1>Module %s</h1>", module);
        Pacioli.println("<p>Interface for the %s module</p>", module);
        Pacioli.println("<small>Version %s, %s</small>", version, ZonedDateTime.now());

        // Print the types for the values and the function in a synopsis section
        Pacioli.println("<h2>Synopsis</h2>");
        Pacioli.println("<pre>");
        for (String value : vals) {
            Pacioli.println("%s ::", value);
            Pacioli.print(" %s;", typeTable.get(value));
        }
        if (values.size() > 0) {
            Pacioli.print("\n");
        }
        for (String function : funs) {
            Pacioli.println("%s ::", function);
            Pacioli.print(" %s;", typeTable.get(function));
        }
        Pacioli.println("</pre>");

        // Print details for the values
        Pacioli.println("<h2>Values</h2>");
        if (values.size() == 0) {
            Pacioli.println("n/a");
        } else {
            Pacioli.println("<dl>");
            for (String value : vals) {
                Pacioli.println("<dt><code>%s</code></dt>", value);
                Pacioli.println("<dd>");
                Pacioli.println("<pre>::");
                Pacioli.print(" %s</pre>", typeTable.get(value));
                for (String part : getDocuParts(value)) {
                    Pacioli.println("\n<p>%s</p>\n", part);
                }
                Pacioli.println("</dd>");
            }
            Pacioli.println("</dl>");
        }

        // Print details for the functions
        Pacioli.println("<h2>Functions</h2>");
        Pacioli.println("<dl>");
        for (String function : funs) {
            String args = String.format("(%s)", argsString(function));
            Pacioli.println("<dt><code>%s%s</code></dt>", function, args);
            Pacioli.println("<dd>");
            Pacioli.println("<pre>::");
            Pacioli.print(" %s</pre>", getType(function));
            for (String part : getDocuParts(function)) {
                Pacioli.println("\n<p>%s</p>\n", part);
            }
            Pacioli.println("</dd>");

        }
        Pacioli.println("</dl>");

        // Finish the html
        Pacioli.println("</body>");
        Pacioli.println("</html>");
    }

}
