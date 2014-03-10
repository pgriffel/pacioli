package pacioli;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.Toplevel;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.unit.UnitNode;
import pacioli.types.PacioliType;
import uom.Unit;
import uom.UnitSystem;

public class Program {

	private final List<File> libDirs;
	private PacioliFile main;
	private final Map<String, PacioliFile> files = new HashMap<String, PacioliFile>();
	private final Dictionary dictionary = new Dictionary();
	private final List<Toplevel> toplevelExpressions = new ArrayList<Toplevel>();

	public Program(List<File> libDirs) {
		this.libDirs = libDirs;
	}

	/*
	 * All definitions in the loaded file and the included files, including its
	 * included files, etc, are loaded in this program's dictionary. The keys for
	 * the maps are the definitions' unique global names.
	 * 
	 * Each definition has a module field and each module has a program field.
	 */
	public void addValueDefinition(ValueDefinition definition,
			PacioliFile module) {
		dictionary.putValueDefinition(definition.globalName(), definition);
	}

	public void addUnitDefinition(UnitDefinition definition, PacioliFile module) {
		dictionary.putUnitDefinition(definition.globalName(), definition);
	}

	public void addAliasDefinition(AliasDefinition definition,
			PacioliFile module) {
		dictionary.putAliasDefinition(definition.globalName(), definition);
	}

	public void addDeclaration(Declaration declaration, PacioliFile module) {
		dictionary.putDeclaration(declaration.globalName(), declaration);
	}

	public void addIndexSetDefinition(IndexSetDefinition definition,
			PacioliFile module) {
		dictionary.putIndexSetDefinition(definition.globalName(), definition);
	}

	public void addTypeDefinition(TypeDefinition definition, PacioliFile module) {
		dictionary.putTypeDefinition(definition.globalName(), definition);
	}

	public void addUnitVectorDefinition(UnitVectorDefinition definition,
			PacioliFile module) {
		dictionary.putUnitVectorDefinition(definition.globalName(), definition);
	}

	public void addToplevel(Toplevel toplevel, PacioliFile module) {
		toplevelExpressions.add(toplevel);
	}

	/*
	 * Topological Order of Definitions
	 */
	List<Definition> orderedDefinitions(
			Collection<? extends Definition> definitions)
			throws PacioliException {

		Set<Definition> discovered = new HashSet<Definition>();
		Set<Definition> finished = new HashSet<Definition>();

		List<Definition> orderedDefinitions = new ArrayList<Definition>();
		for (Definition definition : definitions) {
			insertDefinition(definition, orderedDefinitions, discovered,
					finished);
		}
		return orderedDefinitions;
	}

	void insertDefinition(Definition definition, List<Definition> definitions,
			Set<Definition> discovered, Set<Definition> finished)
			throws PacioliException {

		if (!finished.contains(definition)) {
			if (discovered.contains(definitions)) {
				throw new PacioliException(definition.getLocation(),
						"Cycle in definition " + definition.localName());
			}
			discovered.add(definition);
			for (Definition other : definition.uses()) {
				insertDefinition(other, definitions, discovered, finished);
			}
			definitions.add(definition);
			finished.add(definition);
		}
	}

	/*
	 * Loading
	 */
	public void load(File file) throws PacioliException, IOException {

		main = Reader.loadPacioliFile(this, file);
		dictionary.setHome(main);
		for (String include : PacioliFile.defaultIncludes) {
			File includeFile = findIncludeFile(include, null);
			String key = includeFile.getPath();
			if (main.getFile().getPath().equals(key)) {
				main.setDefault();
			}
		}
		loadDefaultIncludes();
		loadIncludes(main);
		desugar();
		resolveNames();
		infertTypes();
	}

	Set<String> moduleIncludePaths(PacioliFile module) {
		Set<String> paths = new HashSet<String>();
		if (!module.isDefault()) {
			paths.addAll(PacioliFile.defaultIncludes);
		}
		paths.addAll(module.getIncludes());
		return paths;
	}

	Set<PacioliFile> accessibleModules(PacioliFile module) {
		Set<PacioliFile> modules = new HashSet<PacioliFile>();
		for (String include : moduleIncludePaths(module)) {
			File includeFile = findIncludeFile(include, module.directory());
			String key = includeFile.getPath();
			if (main.getFile().getPath().equals(key)) {
				modules.add(main);
			} else {
				assert(this.files.get(key) != null);
			    modules.add(this.files.get(key));
			}
		}
		return modules;
	}

	private void loadDefaultIncludes() throws PacioliException, IOException {
		for (String include : PacioliFile.defaultIncludes) {
			File includeFile = findIncludeFile(include, null);
			if (includeFile == null) {
				throw new FileNotFoundException(String.format(
						"No file found for default include '%s'", include));
			}
			String key = includeFile.getPath();
			if (!files.containsKey(key)
					&& !main.getFile().getPath().equals(key)) {
				Pacioli.logln3("Loading default include '%s' from file '%s'",
						include, includeFile);
				PacioliFile file = Reader.loadPacioliFile(this, includeFile);
				file.setDefault();
				files.put(key, file);
				// loadIncludes(file);
			}
		}
	}

	private void loadIncludes(PacioliFile module) throws PacioliException,
			IOException {
		for (String include : moduleIncludePaths(module)) {
			File includeFile = findIncludeFile(include, module.directory());
			if (includeFile == null) {
				throw new FileNotFoundException(String.format(
						"No file found for include '%s'", include));
			}
			String includeKey = includeFile.getPath();
			if (!files.containsKey(includeKey)
					&& !main.getFile().getPath().equals(includeKey)) {
				Pacioli.logln3("Loading include '%s' from file '%s'", include,
						includeFile);
				PacioliFile includeModule = Reader.loadPacioliFile(this,
						includeFile);
				files.put(includeKey, includeModule);
				loadIncludes(includeModule);
			}
		}
	}

	private File findIncludeFile(String include, File directory) {

		File libFile = null;
		String includeName = include.toLowerCase() + ".pacioli";

		if (directory != null && !PacioliFile.defaultIncludes.contains(include)) {
			File includeFile = new File(directory, includeName);
			if (includeFile.exists()) {
				Pacioli.logln3("Include '%s' found in file '%s'", include,
						includeFile);
				libFile = includeFile;
			} else {
				Pacioli.logln3("Include '%s' not found in directory '%s'",
						include, directory);
			}
		}

		for (File dir : libDirs) {
			File includeFile = new File(dir, includeName);
			if (includeFile.exists()) {
				Pacioli.logln3("Include '%s' found in library file '%s'",
						include, includeFile);
				if (libFile == null) {
					libFile = includeFile;
				} else {
					Pacioli.warn("Shadowed include file '%s' is ignored",
							includeFile);
				}
			} else {
				Pacioli.logln3(
						"Include '%s' not found in library directory '%s'",
						include, dir);
			}
		}
		return libFile;
	}

	/*
	 * Name Resolving
	 */

	private Dictionary localDictionary(PacioliFile module)
			throws PacioliException {
		Dictionary dict = new Dictionary();
		dict.setHome(module);
		
		for (UnitDefinition definition : dictionary.unitDefinitions()) {
			if (definition.getModule() == module) {
				dict.putUnitDefinition(definition.localName(), definition);
			}
		}
		for (IndexSetDefinition definition : dictionary.indexSetDefinitions()) {
			if (definition.getModule() == module) {
				dict.putIndexSetDefinition(definition.localName(), definition);
			}
		}
		for (UnitVectorDefinition definition : dictionary
				.unitVectorDefinitions()) {
			if (definition.getModule() == module) {
				dict.putUnitVectorDefinition(definition.localName(), definition);
			}
		}
		for (TypeDefinition definition : dictionary.typeDefinitions()) {
			if (definition.getModule() == module) {
				dict.putTypeDefinition(definition.localName(), definition);
			}
		}
		for (AliasDefinition definition : dictionary.aliasDefinitions()) {
			if (definition.getModule() == module) {
				dict.putAliasDefinition(definition.localName(), definition);
			}
		}
		for (Declaration definition : dictionary.declarations()) {
			if (definition.getModule() == module) {
				dict.putDeclaration(definition.localName(), definition);
			}
		}
		for (ValueDefinition definition : dictionary.valueDefinitions()) {
			if (definition.getModule() == module) {
				dict.putValueDefinition(definition.localName(), definition);
			}
		}
		return dict;
	}

	private void resolveNames() throws PacioliException {
		for (PacioliFile module : files.values()) {
			resolveModuleNames(module);
		}
		resolveModuleNames(main);
	}

	private void resolveModuleNames(PacioliFile module) throws PacioliException {

		Dictionary dict = localDictionary(module);

		for (PacioliFile mod : accessibleModules(module)) {
			if (mod != module) {
				dict.addAll(localDictionary(mod));
			}
		}

		// Resolve the bodies of this module's definitions. Units and index sets
		// are resolved first, so that they can be used during resolving of
		// other definitions. For example during evaluation of types.

		for (Definition definition : dictionary.unitDefinitions()) {
			if (definition.getModule() == module) {
				definition.resolve(dict);
			}
		}
		for (IndexSetDefinition definition : dictionary.indexSetDefinitions()) {
			if (definition.getModule() == module) {
				definition.resolve(dict);
			}
		}
		for (UnitVectorDefinition definition : dictionary
				.unitVectorDefinitions()) {
			if (definition.getModule() == module) {
				definition.resolve(dict);
			}
		}
		for (TypeDefinition definition : dictionary.typeDefinitions()) {
			if (definition.getModule() == module) {
				definition.resolve(dict);
			}
		}
		for (AliasDefinition definition : dictionary.aliasDefinitions()) {
			if (definition.getModule() == module) {
				definition.resolve(dict);
			}
		}
		for (Declaration definition : dictionary.declarations()) {
			if (definition.getModule() == module) {
				definition.resolve(dict);
			}
		}
		for (ValueDefinition definition : dictionary.valueDefinitions()) {
			if (definition.getModule() == module) {
				definition.resolve(dict);
			}
		}
		for (Toplevel toplevel : toplevelExpressions) {
			if (toplevel.getModule() == module) {
				toplevel.resolve(dict);
			}
		}
	}

	/*
	 * Desugaring
	 */
	private void desugar() {
		for (ValueDefinition definition : dictionary.valueDefinitions()) {
			definition.desugar();
		}
		for (Declaration definition : dictionary.declarations()) {
			definition.desugar();
		}
	}

	/*
	 * Type Inference
	 */
	public void checkTypes() throws PacioliException {
		Set<String> printed = new HashSet<String>();
		for (Declaration definition : dictionary.declarations()) {
			
			ValueDefinition valueDefinition = dictionary.getValueDefinition(definition.globalName());
			
			if (valueDefinition != null) {
                
				PacioliType sub = definition.getType().instantiate();
                PacioliType sup = valueDefinition.getType().instantiate();
              
                if (!sub.isInstanceOf(sup)) {
                	throw new PacioliException(definition.getLocation(), "declared type\n %s\ndoes not specialize type\n %s \n",
                			sub.unfresh().toText(),
                			sup.unfresh().toText());
                }
			}
			
			if (definition.getModule() == main) {
				Pacioli.logln("%s :: %s", definition.localName(), definition
						.getPublicType().toText());
				printed.add(definition.localName());
			}
		}
		for (ValueDefinition definition : dictionary.valueDefinitions()) {
			if (definition.getModule() == main
					&& !printed.contains(definition.localName())) {
				Pacioli.logln("%s :: %s", definition.localName(), definition
						.getType().toText());
			}
		}
		int i = 0;
		for (Toplevel toplevel : toplevelExpressions) {
			if (toplevel.getModule() == main) {
				Pacioli.logln("toplevel%s :: %s", i++, toplevel.getType()
						.toText());
			}
		}
	}

	private void infertTypes() throws PacioliException {

		Set<Definition> discovered = new HashSet<Definition>();
		Set<Definition> finished = new HashSet<Definition>();

		for (ValueDefinition definition : dictionary.valueDefinitions()) {
			inferValueDefinitionType(definition, discovered, finished);
		}
		for (Toplevel toplevel : toplevelExpressions) {
			toplevel.inferType(null, new HashMap<String, PacioliType>());
		}
	}

	private void inferValueDefinitionType(ValueDefinition definition,
			Set<Definition> discovered, Set<Definition> finished)
			throws PacioliException {

		if (!finished.contains(definition)) {
			if (discovered.contains(definition)) {
				Pacioli.warn("Cycle in definition of %s",
						definition.localName());
			} else {
				discovered.add(definition);
				for (Definition pre : definition.uses()) {
					if (pre instanceof ValueDefinition) {
						inferValueDefinitionType((ValueDefinition) pre,
								discovered, finished);
					}
				}
				definition.inferType();
				finished.add(definition);
			}
		}
	}

	/*
	 * Compilation
	 */

	public void compileMVM(PrintWriter out, CompilationSettings settings)
			throws PacioliException {
		for (Definition definition : dictionary.indexSetDefinitions()) {
			out.println(definition.compileToMVM(settings));
		}
		for (Definition definition : orderedDefinitions(dictionary
				.unitDefinitions())) {
			out.println(definition.compileToMVM(settings));
		}
		for (Definition definition : dictionary.unitVectorDefinitions()) {
			out.println(definition.compileToMVM(settings));
		}
		for (Definition definition : dictionary.valueDefinitions()) {
			if (definition.getModule() == main) {
				out.println(definition.compileToMVM(settings));
			} else {
				out.println(definition.compileToMVM(settings));
			}
		}
		for (Toplevel definition : toplevelExpressions) {
			out.format("\nprint %s;", definition.compileToMVM(settings));
		}
	}

	public void compileJS(PrintWriter out, CompilationSettings settings)
			throws PacioliException {
		for (Definition definition : dictionary.indexSetDefinitions()) {
			out.println(definition.compileToJS());
		}
		for (Definition definition : orderedDefinitions(dictionary
				.unitDefinitions())) {
			out.println(definition.compileToJS());
		}
		for (Definition definition : dictionary.unitVectorDefinitions()) {
			out.println(definition.compileToJS());
		}
		
		
		
		
		
		
		
		
		for (Definition definition : dictionary.valueDefinitions()) {
			if (definition.getModule() == main) {
				out.println(definition.compileToJS());
			} else {
				out.println(definition.compileToJS());
			}
		}
		
		for (Declaration definition : dictionary.declarations()) {
			if (definition.getModule() != main) {
				out.println(definition.compileToJS());
			}
		}
	}

	public void compileMatlab(PrintWriter printWriter,
			CompilationSettings settings) {
		// TODO Auto-generated method stub

	}

	public void compileHtml(PrintWriter out, CompilationSettings settings)
			throws PacioliException {
		out.println("<!DOCTYPE HTML>\n"
				+ "\n"
				+ "<!-- HTML and Javascript code generated from Pacioli module "
				+ main.getName()
				+ " -->\n"
				+ "\n"
				+ "<html lang=\"en\">\n"
				+ "  <head>\n"
				+ "    <title>"
				+ main.getName()
				+ "</title>\n"
				+ "    <meta charset=\"utf-8\">\n"
				+ "    <link rel=\"stylesheet\" type=\"text/css\" href=\"pacioli.css\">\n"
				+ "  </head>\n"
				+ "\n"
				+ "  <body onload=\"onLoad();\">\n"
				+ "\n"
				+ "    <div id=\"main\">\n"
				+ "    </div>\n"
				+ "\n"
				+ "    <script type=\"text/javascript\" src=\"numeric-1.2.6.js\"></script>\n"
				+ "    <script type=\"text/javascript\" src=\"pacioli-0.2.0.min.js\"></script>\n"
				+ "\n" + "    <script type=\"text/javascript\">\n" + "\n");
		compileJS(out, settings);
		out.println("function onLoad() {");
		for (Toplevel definition : toplevelExpressions) {
			out.print("Pacioli.print(new Pacioli.Box(");
			//out.print(definition.compileToJSShape());
			out.print(definition.type.compileToJS());
			out.print(", ");
			out.print(definition.compileToJS());
			out.print("))");
			out.println("");
		}
		out.println("}");
		out.println("\n" + "\n" + "    </script>\n" + "\n" + "  </body>\n"
				+ "\n" + "</hmtl>\n");
	}

}
