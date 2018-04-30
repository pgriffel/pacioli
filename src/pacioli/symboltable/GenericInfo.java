package pacioli.symboltable;

import java.io.File;

public class GenericInfo {
	public String name;
	public String module;
	public File file;
	public boolean local = false;
	public boolean global;
	
	public GenericInfo(String name, String module, File file, Boolean local, Boolean global) {
		this.name = name;
		this.module = module;
		this.file = file;
		this.local = local;
		this.global = global;
	}
}
