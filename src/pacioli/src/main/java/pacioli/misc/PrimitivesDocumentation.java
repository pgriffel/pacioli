package pacioli.misc;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

import pacioli.Pacioli;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.info.ValueInfo;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.SchemaNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeNode;

public class PrimitivesDocumentation {

    private final String dirName;
    private final List<File> libs;

    public PrimitivesDocumentation(String dirName, List<File> libs) {
        this.dirName = dirName;
        this.libs = libs;
    }

    public void generate() throws Exception {

        Pacioli.log("dirName = %s, libs= %s", dirName, libs);

        writeAPIFile("io.html", "dev", "io", true, true);
        writeAPIFile("string.html", "dev", "string", true, true);
        writeAPIFile("list.html", "dev", "list", true, true);
        writeAPIFile("array.html", "dev", "array", true, false);
        writeAPIFile("matrix.html", "dev", "matrix", true, true);
        writeAPIFile("base.html", "dev", "base", true, false);
        writeAPIFile("system.html", "dev", "system", true, false);
        writeAPIFile("standard.html", "dev", "standard", false, true);
    }

    private void writeAPIFile(String name, String version, String module, boolean base, boolean standard)
            throws Exception {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(new File(dirName, name)))) {
            writer.write("<!-- Generated by Pacioli 0.5.0 -->");
            generateBaseAPI(writer, version, module, base, standard);
        }
    }

    private void generateBaseAPI(Writer writer, String version, String module, boolean base, boolean standard)
            throws Exception {

        List<String> paramNames = List.of("x", "y", "z", "u", "v", "w", "a", "b", "c", "d", "e", "f", "g", "h");

        List<ValueInfo> infos = new ArrayList<>();

        if (base) {
            File theFile = new File(libs.get(0), "base/" + module + ".pacioli");
            PacioliFile pacioliFile = PacioliFile.libHack(theFile, "irrelevant", "irrelevant", true);
            PacioliTable program = Program.load(pacioliFile).desugar().generateInfos();
            for (ValueInfo info : program.values.allInfos()) {
                infos.add(info);
            }
        }

        if (standard) {
            File theFile = new File(libs.get(0), "standard/" + module + ".pacioli");
            PacioliFile pacioliFile = PacioliFile.libHack(theFile, "irrelevant", "irrelevant", true);
            PacioliTable program = Program.load(pacioliFile).desugar().generateInfos();
            for (ValueInfo info : program.values.allInfos()) {
                infos.add(info);
            }
        }

        DocumentationGenerator generator = new DocumentationGenerator(writer, module, version);
        for (ValueInfo info : infos) {
            if (info.isPublic() && info.getDeclaredType().isPresent()) {

                TypeNode type = info.getDeclaredType().get();
                if (type instanceof SchemaNode && ((SchemaNode) type).type instanceof FunctionTypeNode) {

                    List<String> args = null;

                    // Get the arguments from the function definition if it exists. This
                    // should work for the standard lib
                    if (info.getDefinition().isPresent()) {
                        ExpressionNode body = info.getDefinition().get().body;
                        if (body instanceof LambdaNode) {
                            LambdaNode lambda = (LambdaNode) body;
                            args = lambda.arguments;
                        }
                    }

                    // If no definition exists it must be a function from the base lib. Just
                    // invent parameter names.
                    if (args == null) {
                        FunctionTypeNode fun = (FunctionTypeNode) ((SchemaNode) type).type;
                        if (fun.domain instanceof TypeApplicationNode) {
                            TypeApplicationNode tuple = (TypeApplicationNode) fun.domain;
                            args = paramNames.subList(0, tuple.args.size());
                        } else {
                            // Must be function 'tuple' or 'format'
                            args = List.of("...");
                        }
                    }

                    generator.addFunction(info.name(), args, type.pretty(),
                            info.generalInfo().getDocumentation().orElse(""));

                } else {

                    generator.addValue(info.name(), type.pretty(), info.generalInfo().getDocumentation().orElse(""));

                }
            }
        }

        generator.generate();
    }
}
