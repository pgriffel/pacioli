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
	private Module main;
	private final Map<String, Module> modules = new HashMap<String, Module>();
	private final Dictionary dictionary = new Dictionary();
	private final List<Toplevel> toplevelExpressions = new ArrayList<Toplevel>();

	public Program(List<File> libDirs) {
		this.libDirs = libDirs;
	}

	/*
	 * All definitions in the loaded file and the included files, including its
	 * included files, etc, are loaded in the maps in this program. The keys for
	 * the maps are the definitions' unique global names.
	 * 
	 * Each included module
	 * 
	 * Each definition has a module field and each module has a program field.
	 */
	public void addValueDefinition(ValueDefinition definition, Module module) {
		dictionary.putValueDefinition(definition.globalName(), definition);
	}

	public void addUnitDefinition(UnitDefinition definition, Module module) {
		dictionary.putUnitDefinition(definition.globalName(), definition);
	}

	public void addAliasDefinition(AliasDefinition definition, Module module) {
		dictionary.putAliasDefinition(definition.globalName(), definition);
	}

	public void addDeclaration(Declaration declaration, Module module) {
		dictionary.putDeclaration(declaration.globalName(), declaration);
	}

	public void addIndexSetDefinition(IndexSetDefinition definition,
			Module module) {
		dictionary.putIndexSetDefinition(definition.globalName(), definition);
	}

	public void addTypeDefinition(TypeDefinition definition, Module module) {
		dictionary.putTypeDefinition(definition.globalName(), definition);
	}

	public void addUnitVectorDefinition(UnitVectorDefinition definition,
			Module module) {
		dictionary.putUnitVectorDefinition(definition.globalName(), definition);
	}

	public void addToplevel(Toplevel toplevel, Module module) {
		toplevelExpressions.add(toplevel);
	}

	/*
	 * Loading
	 */
	public void load(File file) throws PacioliException, IOException {

		main = Reader.loadModule(this, file);
		loadIncludes(main, libDirs);
		desugar();
		resolveNames();
		infertTypes();
	}

	private void desugar() {
		Pacioli.logln3("Desugaring");
		for (ValueDefinition definition : dictionary.valueDefinitions()) {
			// Pacioli.logln3("- %s", definition.globalName());
			if (definition.getModule() == main) {
				definition.desugar();
			} else {
				definition.desugar();
			}
		}
		for (Declaration definition : dictionary.declarations()) {
			definition.desugar();
		}
	}

	public void checkTypes() throws PacioliException {
//		desugar();
//		resolveNames();
//		infertTypes();
		Set<String> printed= new HashSet<String>();
		for (Declaration definition : dictionary.declarations()) {
			if (definition.getModule() == main) {
				Pacioli.logln("%s :: %s", definition.localName(), definition
						.getType().toText());
				printed.add(definition.localName());
			}
		}
		for (ValueDefinition definition : dictionary.valueDefinitions()) {
			if (definition.getModule() == main && !printed.contains(definition.localName())) {
				Pacioli.logln("%s :: %s", definition.localName(), definition
						.getType().toText());
			}
		}
		int i = 0;
		for (Toplevel toplevel : toplevelExpressions) {
			if (toplevel.getModule() == main) {
				Pacioli.logln("toplevel%s :: %s", i++, toplevel.getType().toText());
			}
		}
	}

	List<Definition> orderedDefinitions(
			Collection<? extends Definition> definitions) throws PacioliException {

		Set<Definition> discovered = new HashSet<Definition>();
		Set<Definition> finished = new HashSet<Definition>();

		List<Definition> orderedDefinitions = new ArrayList<Definition>();
		for (Definition definition : definitions) {
			insertDefinition(definition, orderedDefinitions, discovered, finished);
		}
		return orderedDefinitions;
	}

	void insertDefinition(Definition definition, List<Definition> definitions,
			Set<Definition> discovered, Set<Definition> finished) throws PacioliException {

		if (!finished.contains(definition)) {
			if (discovered.contains(definitions)) {
				throw new PacioliException(definition.getLocation(), "Cycle in unit " + definition.localName());	
			}
			discovered.add(definition);
			for (Definition other : definition.uses()) {
				insertDefinition(other, definitions, discovered, finished);
			}
			definitions.add(definition);
			finished.add(definition);
		}
	}

	public void compileJS(PrintWriter out, CompilationSettings settings) throws PacioliException {
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
	}

	public void compileMatlab(PrintWriter printWriter,
			CompilationSettings settings) {
		// TODO Auto-generated method stub

	}

	public void compileHtml(PrintWriter out, CompilationSettings settings) throws PacioliException {
		// TODO Auto-generated method stub
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
				+ "    <script type=\"text/javascript\" src=\"pacioli-primitives.js\"></script>\n"
				+ "\n" + "    <script type=\"text/javascript\">\n" + "\n");
		compileJS(out, settings);
		out.println("function onLoad() {");
		for (Toplevel definition : toplevelExpressions) {
			out.print("global_Primitives_print(");
			out.print(definition.compileToJS());
			out.print(")");
			out.println("");
		}
		out.println("}");
		out.println("\n" + "\n" + "    </script>\n" + "\n" + "  </body>\n"
				+ "\n" + "</hmtl>\n");
	}

	public void compileMVM(PrintWriter out, CompilationSettings settings) throws PacioliException {
		for (Definition definition : dictionary.indexSetDefinitions()) {
			out.println(definition.compileToMVM(settings));
		}
		for (Definition definition : orderedDefinitions(dictionary.unitDefinitions())) {
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
			// out.format("\nprint %s;",
			// definition.transformMutableVarRefs().compileToMVM(settings));
			out.format("\nprint %s;", definition.compileToMVM(settings));
		}
	}

	private void infertTypes() throws PacioliException {

		Set<Definition> discovered = new HashSet<Definition>();
		Set<Definition> finished = new HashSet<Definition>();

		for (ValueDefinition definition : dictionary.valueDefinitions()) {
			// Pacioli.logln("%s :: ", definition.globalName());
			inferValueDefinitionType(definition, discovered, finished);
			// PacioliType infered = definition.inferType(null, new
			// HashMap<String, PacioliType>()).generalize();
		}
		for (Toplevel toplevel : toplevelExpressions) {
			// generalize moet niets opleveren!? voor closures misschien? En
			// dan?
			toplevel.inferType(null, new HashMap<String, PacioliType>())
					.generalize();
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

	Set<String> moduleIncludePaths(Module module) {
		Set<String> paths = new HashSet<String>();
		paths.addAll(Module.defaultIncludes);
		paths.addAll(module.getIncludes());
		return paths;
	}

	Set<Module> accessibleModules(Module module) {
		Set<Module> modules = new HashSet<Module>();
		for (String include : moduleIncludePaths(module)) {
			File includeFile = findIncludeFile(include, module.directory());
			String includeKey = includeFile.getPath();
			modules.add(this.modules.get(includeKey));
		}
		return modules;
	}

	private void loadIncludes(Module module, List<File> libDirs)
			throws PacioliException, IOException {
		for (String include : moduleIncludePaths(module)) {
			File includeFile = findIncludeFile(include, module.directory());
			if (includeFile == null) {
				throw new FileNotFoundException(String.format(
						"No file found for include '%s'", include));
			}
			String includeKey = includeFile.getPath();
			if (!modules.containsKey(includeKey) && !main.getFile().getPath().equals(includeKey)) {
				Pacioli.logln3("Loading include '%s' from file '%s'", include,
						includeFile);
				Module includeModule = Reader.loadModule(this, includeFile);
				modules.put(includeKey, includeModule);
				loadIncludes(includeModule, libDirs);
			}
		}
	}

	private File findIncludeFile(String include, File directory) {

		File libFile = null;
		String includeName = include.toLowerCase() + ".pacioli";

		if (directory != null && !Module.defaultIncludes.contains(include)) {
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

	private Dictionary localDictionary(Module module) throws PacioliException {
		Dictionary dict = new Dictionary();
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

	// MOET PER MODULE!
	private void resolveNames() throws PacioliException {

		// Map<String, Module> globals = new HashMap<String, Module>();
		// Set<Module> modules = new HashSet<Module>();
		//
		// // Collect all accessible modules
		// for (String i : defaultIncludes) {
		// assert (loadedModules.containsKey(i));
		// modules.add(loadedModules.get(i));
		// }
		// for (String i : getIncludes()) {
		// assert (loadedModules.containsKey(i));
		// modules.add(loadedModules.get(i));
		// }
		// modules.add(this);

		// Dictionary dict = new Dictionary();
		Dictionary dict = localDictionary(main);

		for (Module mod : accessibleModules(main)) {
			dict.addAll(localDictionary(mod));
		}

		// Collect all accesable definition names
		// for (Module mod : accessibleModules(main)) {
		// for (ValueDefinition definition:
		// dictionary.valueDefinitions.values()) {
		// if (definition.getModule() == mod) {
		// if (dict.valueDefinitions.containsKey(definition.localName())) {
		// throw new
		// PacioliException("\nName clash for %s between module %s and %s\n",
		// definition.localName(), mod.name, main.name);
		// }
		// dict.putValueDefinition(definition.localName(), definition);
		// }
		// }
		// for (Declaration definition: dictionary.declarations.values()) {
		// if (definition.getModule() == mod) {
		// if (dict.declarations.containsKey(definition.localName())) {
		// throw new
		// PacioliException("\nName clash for %s between module %s and %s\n",
		// definition.localName(), mod.name, main.name);
		// }
		// dict.putDeclaration(definition.localName(), definition);
		// }
		// }
		// }

		// Resolve the bodies of this module's definitions. Units and index sets
		// are resolved first, so that they can be used during resolving of
		// other definitions. For example during evaluation of types.
		for (Definition definition : dictionary.unitDefinitions()) {
			definition.resolve(dict);
		}
		for (IndexSetDefinition definition : dictionary.indexSetDefinitions()) {
			definition.resolve(dict);
		}
		for (UnitVectorDefinition definition : dictionary
				.unitVectorDefinitions()) {
			definition.resolve(dict);
		}
		for (TypeDefinition definition : dictionary.typeDefinitions()) {
			definition.resolve(dict);
		}
		for (AliasDefinition definition : dictionary.aliasDefinitions()) {
			definition.resolve(dict);
		}
		for (Declaration definition : dictionary.declarations()) {
			definition.resolve(dict);
		}
		for (ValueDefinition definition : dictionary.valueDefinitions()) {
			definition.resolve(dict);
		}
		for (Toplevel toplevel : toplevelExpressions) {
			toplevel.resolve(dict);
		}
	}

}
