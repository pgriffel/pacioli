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
import pacioli.ast.expression.ConstNode;
import pacioli.ast.definition.ConversionDefinition;
import pacioli.ast.definition.ProjectionDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.definition.MatrixDefinition;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeNode;
import org.codehaus.jparsec.functors.Pair;
import uom.NamedUnit;
import uom.Unit;

public class Module extends AbstractPrintable {

    public final String name;
    /* 
     * Source Items 
     */
    private final List<String> includes;
    private final Map<String, Unit> aliasDefs;
    private final Map<String, TypeNode> declarations;
    private final List<UnitVectorDefinition> unitVectorDefs;
    private final List<TypeDefinition> typeDefs;
    private final List<IndexSetDefinition> indexDefs;
    private final List<UnitDefinition> unitDefs;
    private final List<ValueDefinition> definitions;
    private final List<ConversionDefinition> conversionDefs;
    private final List<ProjectionDefinition> projectionDefs;
    private final List<MatrixDefinition> matrixDefs;
    private final List<ExpressionNode> expressions;
    /*
     * Internals
     */
    private final List<String> orderedModuleNames;
    private final Map<String, Module> loadedModules;
    private final List<ExpressionNode> resolvedExpressions;
    private final Dictionary dictionary;
    /*
     * Config 
     */
    private static final List<String> defaultIncludes =
            new ArrayList<String>(Arrays.asList("primitives", "list", "matrix", "standard"));
    public static final List<String> debugablePrimitives  =
            new ArrayList<String>(Arrays.asList("primitives", "list", "matrix"));

    public Module(String name) {
        this.name = name;
        this.includes = new ArrayList<String>();
        this.definitions = new ArrayList<ValueDefinition>();
        this.declarations = new HashMap<String, TypeNode>();
        this.unitDefs = new ArrayList<UnitDefinition>();
        this.conversionDefs = new ArrayList<ConversionDefinition>();
        this.projectionDefs = new ArrayList<ProjectionDefinition>();
        this.indexDefs = new ArrayList<IndexSetDefinition>();
        this.unitVectorDefs = new ArrayList<UnitVectorDefinition>();
        this.matrixDefs = new ArrayList<MatrixDefinition>();
        this.typeDefs = new ArrayList<TypeDefinition>();
        this.aliasDefs = new HashMap<String, Unit>();
        this.orderedModuleNames = new ArrayList<String>();
        this.expressions = new ArrayList<ExpressionNode>();
        this.loadedModules = new HashMap<String, Module>();
        this.dictionary = new Dictionary();
        this.resolvedExpressions = new ArrayList<ExpressionNode>();
    }

    public void include(String name) {
        if (includes.contains(name)) {
            Pacioli.warn("Module '%s' is already included", name);
        } else {
            includes.add(name);
        }
    }

    public void define(IdentifierNode id, ExpressionNode body) throws PacioliException {
        String localName = id.getName();
        if (lookupDefinition(localName) != null) {
            throw new PacioliException(id.getLocation(), "Name '%s' is already defined", localName);
        }
        definitions.add(new ValueDefinition(this, id, body));
    }

    public void declare(IdentifierNode id, TypeNode typeNode) throws PacioliException {
        if (declarations.containsKey(id.getName())) {
            throw new PacioliException(id.getLocation(), "Name '%s' is already declared", id.getName());
        }
        declarations.put(id.getName(), typeNode);
    }

    public void addExpression(ExpressionNode expression) {
        expressions.add(expression);
    }

    public void addIndexDef(IdentifierNode id, List<String> items) throws PacioliException {
        indexDefs.add(new IndexSetDefinition(this, id.getLocation(), id, items));
    }

    public void addUnit(IdentifierNode id, NamedUnit unit) throws PacioliException {
        unitDefs.add(new UnitDefinition(this, id.getLocation(), id, unit));
    }

    public void addUnitVectorDef(IdentifierNode indexId, IdentifierNode id, Map<String, Unit> items) throws PacioliException {
        unitVectorDefs.add(new UnitVectorDefinition(this, indexId.getLocation().join(id.getLocation()), indexId, id, items));
    }

    void addConvDef(IdentifierNode id, TypeNode typeNode) throws PacioliException {
        String localName = id.getName();
        if (lookupDefinition(localName) != null) {
            throw new PacioliException(id.getLocation(), "Name '%s' is already defined", localName);
        }
        conversionDefs.add(new ConversionDefinition(this, id, typeNode));
    }
    
    void addProjDef(IdentifierNode id, TypeNode typeNode) throws PacioliException {
        String localName = id.getName();
        if (lookupDefinition(localName) != null) {
            throw new PacioliException(id.getLocation(), "Name '%s' is already defined", localName);
        }
        projectionDefs.add(new ProjectionDefinition(this, id, typeNode));
    }

    void addTypeDef(Location location, TypeContext context, TypeApplicationNode lhs, TypeNode rhs) throws PacioliException {
        typeDefs.add(new TypeDefinition(this, location, context, lhs, rhs));
    }

    void addAliasDef(IdentifierNode id, Unit unit) throws PacioliException {
        String idName = id.getName();
        Pacioli.logln3("Adding alias %s for %s", idName, unit.toText());
        if (aliasDefs.containsKey(idName)) {
            throw new PacioliException(id.getLocation(), "Alias '%s' already exists", idName);
        }
        aliasDefs.put(idName, unit);
    }

    void addMatrixDef(Location location, IdentifierNode id, TypeNode typeNode, List<Pair<List<String>, ConstNode>> pairs) throws PacioliException {
        String localName = id.getName();
        if (lookupDefinition(localName) != null) {
            throw new PacioliException(id.getLocation(), "Name '%s' is already defined", localName);
        }

        matrixDefs.add(new MatrixDefinition(this, id, typeNode, pairs, location));
    }

    ////////////////////////////////////////////////////////////////////////////////
    // value definitions    
    public Definition lookupDefinition(String localName) {
        for (ValueDefinition def : definitions) {
            if (def.localName().equals(localName)) {
                return def;
            }
        }
        for (Definition def : conversionDefs) {
            if (def.localName().equals(localName)) {
                return def;
            }
        }
        for (Definition def : projectionDefs) {
            if (def.localName().equals(localName)) {
                return def;
            }
        }
        for (Definition def : matrixDefs) {
            if (def.localName().equals(localName)) {
                return def;
            }
        }
        return null;
    }

    public Set<String> definedNames() throws PacioliException {
        Set<String> all = new HashSet<String>();
        all.addAll(declarations.keySet());
        for (ValueDefinition definition : definitions) {
            all.add(definition.localName());
        }
        for (ConversionDefinition definition : conversionDefs) {
            all.add(definition.localName());
        }
        for (ProjectionDefinition definition : projectionDefs) {
            all.add(definition.localName());
        }
        for (Definition definition : matrixDefs) {
            all.add(definition.localName());
        }
        return all;
    }

    public List<Definition> orderedDefinitions() throws PacioliException {
        List<Definition> all = new ArrayList<Definition>();
        Set<Definition> discovered = new HashSet<Definition>();
        for (Definition definition : definitions) {
            orderedDefinitionsHelper(definition, discovered, all);
        }
        for (Definition definition : conversionDefs) {
            orderedDefinitionsHelper(definition, discovered, all);
        }
        for (Definition definition : projectionDefs) {
            orderedDefinitionsHelper(definition, discovered, all);
        }
        for (Definition definition : matrixDefs) {
            orderedDefinitionsHelper(definition, discovered, all);
        }
        return all;
    }

    private void orderedDefinitionsHelper(Definition definition, Set<Definition> discovered, List<Definition> target) throws PacioliException {
        if (!target.contains(definition)) {
            if (discovered.contains(definition)) {
                //throw new PacioliException("Cycle in definitions %s", definition);
                Pacioli.warn("Cycle in definition of %s", definition.localName());
            } else {
                discovered.add(definition);
                for (Definition pre : definition.uses()) {
                    orderedDefinitionsHelper(pre, discovered, target);
                }
                target.add(definition);
            }
        }
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("module \"%s\";\n", name);
        for (String i : includes) {
            out.format("include \"%s\";\n", i);
        }
        for (ValueDefinition definition : definitions) {
            definition.printText(out);
        }
        for (Map.Entry<String, TypeNode> entry : declarations.entrySet()) {
            TypeNode typeNode = entry.getValue();
            out.format("declare %s :: ", entry.getKey());
            out.format("%s;\n", typeNode.toText());
        }
    }

    void checkTypes(List<File> libDirs) throws PacioliException, IOException {
        loadModules(libDirs);
        checkTypes(true);
    }

    void compile(PrintWriter out, String kind, List<File> libDirs, CompilationSettings settings) throws IOException, PacioliException {
        loadModules(libDirs);
        checkTypes(false);
        generateCode(out, kind, settings);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Loading 
    private void loadModules(List<File> libDirs) throws IOException, PacioliException {

        // Just to be sure
        orderedModuleNames.clear();
        loadedModules.clear();

        Pacioli.logln3(this.toText());

        // todo: clean up this mess
        for (String include : defaultIncludes) {
            if (include.equals(name)) {
                loadedModules.put(include, this);
            } else {
                loadedModules.put(include, loadInclude(include, libDirs));
            }
            orderedModuleNames.add(include);
        }

        loadIncludes(orderedModuleNames, loadedModules, libDirs);

        if (!defaultIncludes.contains(name)) {
            loadedModules.put(name, this);
            orderedModuleNames.add(name);
        }

    }

    private void loadIncludes(List<String> target1, Map<String, Module> target, List<File> libDirs) throws PacioliException, IOException {
        for (String i : includes) {
            if (!target.containsKey(i)) {
                target.put(i, null);
                Module inc = loadInclude(i, libDirs);
                target1.add(i);
                target.put(i, inc);
                inc.loadIncludes(target1, target, libDirs);
            }
        }
    }

    private Module loadInclude(String i, List<File> libDirs) throws IOException, PacioliException {

        File libFile = null;
        String includeName = i.toLowerCase() + ".pacioli";

        for (File dir : libDirs) {
            File tmp = new File(dir, includeName);
            if (tmp.exists()) {
                Pacioli.logln3("Include file '%s' found in directory '%s'", includeName, dir);
                if (libFile == null) {
                    libFile = tmp;
                } else {
                    Pacioli.warn("Include file '%s' in directory '%s' is shadowed by '%s'", includeName, dir, libFile);
                }
            } else {
                Pacioli.logln3("Include file '%s' not found in directory '%s'", includeName, dir);
            }
        }

        if (libFile == null) {
            throw new FileNotFoundException(String.format("No file found for include '%s'", i));
        } else {
            Pacioli.logln2("Loading module '%s'", libFile.getPath());
            Module inc = Reader.loadModule(libFile.getPath());
            Pacioli.logln3(inc.toText());
            return inc;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Collecting Unit Literals
    private void checkTypes(boolean verbose) throws PacioliException {
        for (String i : orderedModuleNames) {
            loadedModules.get(i).fillDictionaries(loadedModules);
            loadedModules.get(i).resolveNames(loadedModules);
            loadedModules.get(i).inferTypes(verbose && i.equals(name));
        }
    }

    public Dictionary publicDictionary() throws PacioliException {

        Dictionary newDictionary = new Dictionary();

        for (IndexSetDefinition definition : indexDefs) {
            newDictionary.putIndexSetDefinition(definition.localName(), definition);
        }
        for (UnitDefinition definition : unitDefs) {
            newDictionary.addUnit(definition.localName(), definition.getUnit());
        }
        for (UnitVectorDefinition definition : unitVectorDefs) {
            newDictionary.putUnitVector(definition.localName(), dictionary.getUnitVector(definition.localName()));
        }
        for (Definition definition : typeDefs) {
            newDictionary.putKnownType(definition.localName());
        }
        for (ConversionDefinition definition : conversionDefs) {
            newDictionary.putType(definition.localName(), definition.getTypeNode().eval(dictionary, new TypeContext(), false));
        }
        for (ProjectionDefinition definition : projectionDefs) {
            newDictionary.putType(definition.localName(), definition.getTypeNode().eval(dictionary, new TypeContext(), false));
        }
        for (MatrixDefinition definition : matrixDefs) {
            newDictionary.putType(definition.localName(), definition.getTypeNode().eval(dictionary, new TypeContext(), false));
        }
        for (ValueDefinition definition : definitions) {
            newDictionary.putType(definition.localName(), dictionary.getType(definition.localName()));
        }
        for (Map.Entry<String, TypeNode> entry : declarations.entrySet()) {
            newDictionary.putType(entry.getKey(), entry.getValue().eval(dictionary, new TypeContext(), false));
        }
        return newDictionary;
    }

    private void fillDictionaries(Map<String, Module> loadedModules) throws PacioliException {

        Pacioli.logln2("Collecting definitions in module '%s'", name);

        // Fill from includes if not a default include
        if (!defaultIncludes.contains(name)) {
            for (String i : defaultIncludes) {
                assert (loadedModules.containsKey(i));
                dictionary.include(loadedModules.get(i).publicDictionary());
            }
        }
        for (String i : includes) {
            Pacioli.logln3("Including '%s'", i);
            assert (loadedModules.containsKey(i));
            dictionary.include(loadedModules.get(i).publicDictionary());
        }

        // Fill from own definitions
        for (Definition definition : indexDefs) {
            definition.updateDictionary(dictionary, true);
        }
        for (String key : aliasDefs.keySet()) {
            dictionary.putAlias(key, aliasDefs.get(key));
        }
        for (Definition definition : unitDefs) {
            definition.updateDictionary(dictionary, true);
        }
        for (Definition definition : unitVectorDefs) {
            definition.updateDictionary(dictionary, true);
        }
        for (Definition definition : typeDefs) {
            definition.updateDictionary(dictionary, true);
        }
        for (Definition definition : conversionDefs) {
        	definition.updateDictionary(dictionary, true);
        }
        for (Definition definition : projectionDefs) {
        	definition.updateDictionary(dictionary, true);
        }
        for (Definition definition : matrixDefs) {
            definition.updateDictionary(dictionary, true);
        }
        for (Map.Entry<String, TypeNode> entry : declarations.entrySet()) {
            dictionary.putType(entry.getKey(), entry.getValue().eval(dictionary, new TypeContext(), true));
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Name Resolving
    private void resolveNames(Map<String, Module> loadedModules) throws PacioliException {

        Map<String, Module> globals = new HashMap<String, Module>();
        Set<Module> modules = new HashSet<Module>();

        // Collect all accesable modules
        for (String i : defaultIncludes) {
            assert (loadedModules.containsKey(i));
            modules.add(loadedModules.get(i));
        }
        for (String i : includes) {
            assert (loadedModules.containsKey(i));
            modules.add(loadedModules.get(i));
        }
        modules.add(this);

        // Collect all accesable definition names
        for (Module mod : modules) {
            for (String defName : mod.definedNames()) {
                if (globals.containsKey(defName)) {
                    throw new PacioliException("\nName clash for %s between module %s and %s\n",
                            defName, mod.name, globals.get(defName).name);
                }
                globals.put(defName, mod);
            }
        }

        // Resolve the bodies of this module's definitions
        for (ValueDefinition definition : definitions) {
            definition.resolveNames(dictionary, globals, new HashSet<String>(), new HashSet<String>());
        }
        for (Definition definition : conversionDefs) {
            definition.resolveNames(dictionary, globals, new HashSet<String>(), new HashSet<String>());
        }
        for (Definition definition : projectionDefs) {
            definition.resolveNames(dictionary, globals, new HashSet<String>(), new HashSet<String>());
        }
        for (Definition definition : matrixDefs) {
            definition.resolveNames(dictionary, globals, new HashSet<String>(), new HashSet<String>());
        }
        // Resolve this module's expressions
        for (ExpressionNode exp : expressions) {
            resolvedExpressions.add(exp.resolved(dictionary, globals, new HashSet<String>(), new HashSet<String>()));
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Type Inference
    private void inferTypes(boolean verbose) throws PacioliException {

        Pacioli.logln2("Infering types in module '%s'", name);

        for (Definition definitionNode : orderedDefinitions()) {

            if (definitionNode.getModule() == this && definitionNode instanceof ValueDefinition) {

                ValueDefinition definition = (ValueDefinition) definitionNode;
                String defName = definition.localName();

                Pacioli.logln3("Infering type of definition '%s'", defName);
                if (verbose) {
                    Pacioli.logln("%s :: ", defName);
                }

                PacioliType infered = definition.inferType(dictionary, new HashMap<String, PacioliType>()).generalize();

                if (declarations.containsKey(defName)) {
                    assert (dictionary.containsType(defName));
                    PacioliType declared = dictionary.getType(defName);

                    PacioliType sub = declared.instantiate();
                    PacioliType sup = infered.instantiate();
                    try {
                        Pacioli.logln3("checking %s <: %s", sub.toText(), sup.toText());
                        if (!sub.isInstanceOf(sup)) {
                            throw new PacioliException("Declared type of '%s' contradicts infered type", defName);
                        }
                    } catch (Exception ex) {
                        throw new PacioliException("%s\n\nDeclared type\n  %s\ndoes not specialize type\n  %s  \n",
                                ex.getLocalizedMessage(),
                                sub.unfresh().toText(),
                                sup.unfresh().toText());
                    }
                    PacioliType publicType = declarations.get(defName).eval(dictionary, new TypeContext(), false);
                    if (verbose) {
                        Pacioli.log("%s", publicType.toText());
                    } else {
                        Pacioli.log3("%s", publicType.toText());
                    }
                } else {
                    dictionary.putType(defName, infered);
                    if (verbose) {
                        Pacioli.log("%s", infered.toText());
                    } else {
                        Pacioli.log3("%s", infered.toText());
                    }

                }
            }
        }

        if (verbose) {
            for (String declared : declarations.keySet()) {
                if (lookupDefinition(declared) == null) {
                    Pacioli.logln("%s :: %s", declared, dictionary.getType(declared).unfresh().toText());
                }
            }
        }
        int i = 1;
        for (ExpressionNode body : resolvedExpressions) {
            String defName = "toplevel " + i++;
            if (verbose) {
                Pacioli.logln("%s :: ", defName);
            } else {
                Pacioli.logln3("%s :: ", defName);
            }
            Typing typing = body.inferTyping(dictionary, new HashMap<String, PacioliType>());
            Pacioli.log3("%s", typing.toText());
            Pacioli.logln3("%s :: ", defName);
            PacioliType solved = typing.solve();
            if (verbose) {
                Pacioli.log("%s", solved.unfresh().toText());
            } else {
                Pacioli.log3("%s", solved.unfresh().toText());
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Code Generation
    private void generateCode(PrintWriter out, String kind, CompilationSettings settings) throws PacioliException {

        // Write prelude
        if (kind.equals("mvm")) {
            writeMVMPrelude(out);
        } else if (kind.equals("javascript")) {
            writeJSPrelude(out);
        } else if (kind.equals("matlab")) {
            writeMATLABPrelude(out);
        }

        // Write MVM code for each module
        for (String i : orderedModuleNames) {
            Pacioli.logln2("Generating code for module '%s'", i);
            Module m = loadedModules.get(i);
            if (kind.equals("mvm")) {
                m.writeMVMCode(out, settings);
            } else if (kind.equals("javascript")) {
                m.writeJSCode(out);
            } else if (kind.equals("matlab")) {
                m.writeMATLABCode(out);
            } else {
                throw new PacioliException("Compilation target '%s' not supported. Must be one of 'mvm' (default), 'javascript', or 'matlab'", kind);
            }
        }

        if (kind.equals("matlab")) {
            out.println("\n\npause");
        }
    }

    private void writeMVMPrelude(PrintWriter out) throws PacioliException {
        out.write(String.format("# Generated code\n"));
    }

    private void writeMVMCode(PrintWriter out, CompilationSettings settings) throws PacioliException {
        out.format("\n# module \"%s\";\n", name);
        for (Definition definition : indexDefs) {
            out.println(definition.compileToMVM(settings));
        }
        for (Definition definition : unitDefs) {
            out.println(definition.compileToMVM(settings));
        }
        for (Definition definition : unitVectorDefs) {
            out.println(definition.compileToMVM(settings));
        }
        for (Definition definition : orderedDefinitions()) {
            if (definition.getModule() == this) {
                out.println(definition.compileToMVM(settings));
            }
        }
        for (ExpressionNode body : resolvedExpressions) {
            out.format("\nprint %s;", body.transformMutableVarRefs().compileToMVM(settings));
        }
    }

    private void writeJSPrelude(PrintWriter out) {
        out.write(String.format("// Generated code for '%s'\n", "Shells"));
    }

    private void writeJSCode(PrintWriter out) throws PacioliException {
        out.format("\n// module \"%s\";\n", name);
        for (Definition definition : conversionDefs) {
            out.println(definition.compileToJS());
        }
        // todo: projections
        for (Definition definition : orderedDefinitions()) {
            if (definition.getModule() == this) {
                out.println(definition.compileToJS());
            }
        }
    }

    private void writeMATLABPrelude(PrintWriter out) {
        out.println("% Octave code generated by Pacioli compiler");
        out.println("\n1; % dummy statement to tell Octave this is not a function file");
        out.println("\nfunction retval = fetch_global (module, name)");
        out.println("  switch (strcat(\"user_\", module, \"_\", name))");
        out.println("    case \"user_matrix__\"");
        out.println("      retval = {0,1};");
        for (String i : orderedModuleNames) {
            Module m = loadedModules.get(i);
            Pacioli.logln3("Writing prelude for module '%s'", i);
            for (ValueDefinition definition : m.definitions) {
                String fullName = definition.globalName().toLowerCase();
                if (definition.isFunction()) {
                    out.format("    case \"%s\"\n", fullName);
                    out.format("      retval = @%s;\n", fullName);

                } else {
                    out.format("    case \"%s\"\n", fullName);
                    out.format("      global %s;\n", fullName);
                    out.format("      retval = %s;\n", fullName);
                }
            }
            for (Definition definition : m.conversionDefs) {
                String fullName = definition.globalName().toLowerCase();
                out.format("    case \"%s\"\n", fullName);
                out.format("      global %s;\n", fullName);
                out.format("      retval = %s;\n", fullName);
            }
            // todo: projections
            for (Definition definition : m.matrixDefs) {
                String fullName = definition.globalName().toLowerCase();
                out.format("    case \"%s\"\n", fullName);
                out.format("      global %s;\n", fullName);
                out.format("      retval = %s;\n", fullName);
            }
        }
        out.println("    otherwise");
        out.println("    error(strcat(\"global '\", name, \"' from module '\", module, \"' unknown\"));");
        out.println("  endswitch;");
        out.println("endfunction;");
    }

    private void writeMATLABCode(PrintWriter out) throws PacioliException {
        out.format("\n%% module \"%s\";\n", name);
        for (Definition definition : conversionDefs) {
            out.println(definition.compileToMATLAB());
        }
        // todo: projections
        for (Definition definition : orderedDefinitions()) {
            if (definition.getModule() == this) {
                out.println(definition.compileToMATLAB());
            }
        }
        for (ExpressionNode body : resolvedExpressions) {
            
            final List<ValueDefinition> blocks = new ArrayList<ValueDefinition>();
            String blocksCode = "";
            ExpressionNode transformed = body.liftStatements(this, blocks);
            for (ValueDefinition def : blocks) {
                blocksCode += def.compileStatementToMATLAB();
            }

            out.print(blocksCode);
            out.format("\ndisp(\"\");disp(%s);", transformed.compileToMATLAB());
        }
    }
}
