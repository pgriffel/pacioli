package pacioli.compiler;

import java.io.File;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import pacioli.ast.Node;
import pacioli.mcp.TestEnvironment;
import pacioli.symboltable.info.ValueInfo;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class BundleIT {

    static final List<File> LIBS = TestEnvironment.LIBS;

    @Test
    void bundleShouldLoadAFile() throws Exception {
        // Given the file bom.pacioli from the samples
        File bomFile = new File("../../samples/bom/bom.pacioli");
        PacioliFile file = PacioliFile.get(bomFile, 0).orElseThrow();

        // When a Bundle is created from the file
        Bundle bundle = Bundle.fromFile(file, LIBS);

        // Then its environment should contain 254 values.
        List<ValueInfo> infos = bundle.allValueInfos();

        assertEquals(254, infos.size());
    }

    @Test
    void bundleUsesValueClosureShouldFindCorrectValues() throws Exception {
        // Given the file bom.pacioli from the samples
        File bomFile = new File("../../samples/bom/bom.pacioli");
        PacioliFile file = PacioliFile.get(bomFile, 0).orElseThrow();

        // When a Bundle is created from the file
        Bundle bundle = Bundle.fromFile(file, LIBS);

        // And the value 'cost_breakdown' is searched
        ValueInfo value = bundle.lookupValue("cost_breakdown");

        // Then its usesValueClosure should contain the correct items.
        List<ValueInfo> closure = Bundle.usesValueClosure(Collections.singletonList(value));

        String usedNames = closure.stream().map(ValueInfo::globalName).sorted().collect(Collectors.joining(","));

        assertEquals(
                "$base_matrix__,$standard_matrix_closure,$standard_matrix_delta,$standard_matrix_inverse,$standard_matrix_kleene,$standard_matrix_right_inverse,bom_BoM,bom_conv,bom_cost_breakdown,bom_ingredient_breakdown,bom_price,bom_trade_BoM",
                usedNames);
    }

    @Test
    void bundleReferencesShouldGiveCorrectValueRefs() throws Exception {
        // Given the file bom.pacioli from the samples
        File bomFile = new File("../../samples/bom/bom.pacioli");
        PacioliFile file = PacioliFile.get(bomFile, 0).orElseThrow();

        // When a Bundle is created from the file
        Bundle bundle = Bundle.fromFile(file, LIBS);

        Map<String, List<Node>> valueReferencesMap = bundle.valueReferencesMap();

        String module = file.moduleName();
        String name = "BoM";

        Boolean allNamesCorrect = valueReferencesMap.get(name).stream()
                .map(x -> x.getInfo().orElseThrow().globalName().equals("bom_BoM"))
                .collect(Collectors.reducing(true, Boolean::logicalAnd));

        assertTrue(allNamesCorrect);

        String usedNames = valueReferencesMap.get(name).stream()
                .map(x -> {
                    return x.location().file().orElseThrow().getName() + ":" +
                            x.location().fromLine;
                })
                .collect(Collectors.joining(","));

        assertEquals("bom.pacioli:103,bom.pacioli:109", usedNames);
    }

    @Test
    void bundleReferencesShouldGiveCorrectTypeRefs() throws Exception {
        // Given the file bom.pacioli from the samples
        File bomFile = new File("../../samples/bom/bom.pacioli");
        PacioliFile file = PacioliFile.get(bomFile, 0).orElseThrow();

        // When a Bundle is created from the file
        Bundle bundle = Bundle.fromFile(file, LIBS);

        Map<String, List<Node>> typeReferencesMap = bundle.typeReferencesMap();

        String module = file.moduleName();
        String name = "Product";

        Boolean allNamesCorrect = typeReferencesMap.get(name).stream()
                .map(x -> x.getInfo().orElseThrow().globalName().equals("index_bom_Product"))
                .collect(Collectors.reducing(true, Boolean::logicalAnd));

        assertTrue(allNamesCorrect);

        String usedNames = typeReferencesMap.get(name).stream()
                .map(x -> {
                    return x.location().file().orElseThrow().getName() + ":" +
                            x.location().fromLine;
                })
                .collect(Collectors.joining(","));

        assertEquals("bom.pacioli:48,bom.pacioli:37,bom.pacioli:59", usedNames);
    }
}