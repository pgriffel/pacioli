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
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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

        // Then its environment should contain 279 values.
        List<ValueInfo> infos = bundle.allValueInfos();

        assertEquals(279, infos.size());
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

        String usedNames = closure.stream().map(ValueInfo::globalName).sorted()
                .collect(Collectors.joining(","));

        assertEquals(
                "_base_matrix__,_standard_matrix_closure,_standard_matrix_delta,_standard_matrix_inverse,_standard_matrix_kleene,_standard_matrix_right_inverse,bom_BoM,bom_conv,bom_cost_breakdown,bom_ingredient_breakdown,bom_price,bom_trade_BoM",
                usedNames);
    }

    @Test
    void bundleReferencesShouldGiveCorrectValueRefs() throws Exception {
        // Given the file bom.pacioli from the samples
        File bomFile = new File("../../samples/bom/bom.pacioli");
        PacioliFile file = PacioliFile.get(bomFile, 0).orElseThrow();

        // When a Bundle is created from the file
        Bundle bundle = Bundle.fromFile(file, LIBS);

        ReferencesTable referencesTable = bundle.buildReferencesTable();

        String name = "BoM";

        Boolean allNamesCorrect = referencesTable.getValueReferences(name).stream()
                .map(x -> x.name().equals(name))
                .collect(Collectors.reducing(true, Boolean::logicalAnd));

        assertTrue(allNamesCorrect);

        String usedNames = referencesTable.getValueReferences(name).stream()
                .map(ReferencesTable.Entry::location)
                .sorted()
                .map(x -> x.fsFile().orElseThrow().getName() + ":" + x.asText())
                .collect(Collectors.joining(","));

        assertEquals(
                "bom.pacioli:l84c10-l84c13,bom.pacioli:l103c12-l103c15,bom.pacioli:l109c15-l109c18,bom.pacioli:l132c56-l132c59",
                usedNames);
    }

    @Test
    void bundleReferencesShouldGiveCorrectTypeRefs() throws Exception {
        // Given the file bom.pacioli from the samples
        File bomFile = new File("../../samples/bom/bom.pacioli");
        PacioliFile file = PacioliFile.get(bomFile, 0).orElseThrow();

        // When a Bundle is created from the file
        Bundle bundle = Bundle.fromFile(file, LIBS);

        ReferencesTable referencesTable = bundle.buildReferencesTable();

        String name = "Product";

        Boolean allNamesCorrect = referencesTable.getTypeReferences(name).stream()
                .map(x -> x.name().equals(name))
                .collect(Collectors.reducing(true, Boolean::logicalAnd));

        assertTrue(allNamesCorrect);

        String usedNames = referencesTable.getTypeReferences(name).stream()
                .map(ReferencesTable.Entry::location)
                .sorted()
                .map(x -> x.fsFile().orElseThrow().getName() + ":" + x.asText())
                .collect(Collectors.joining(","));

        assertEquals(
                "bom.pacioli:l37c9-l37c16,bom.pacioli:l48c8-l48c15,bom.pacioli:l59c8-l59c15,bom.pacioli:l71c4-l71c11,bom.pacioli:l71c21-l71c28,bom.pacioli:l77c26-l77c33,bom.pacioli:l84c17-l84c24,bom.pacioli:l84c34-l84c41,bom.pacioli:l100c4-l100c11,bom.pacioli:l100c21-l100c28,bom.pacioli:l106c4-l106c11,bom.pacioli:l106c27-l106c34,bom.pacioli:l112c11-l112c18,bom.pacioli:l118c34-l118c52,bom.pacioli:l118c57-l118c64",
                usedNames);

    }

    @Test
    void bundleReferencesShouldGiveCorrectTypeRefsShells() throws Exception {
        // Given the file bom.pacioli from the samples
        File bomFile = new File("../../samples/shells/model.pacioli");
        PacioliFile file = PacioliFile.get(bomFile, 0).orElseThrow();

        // When a Bundle is created from the file
        Bundle bundle = Bundle.fromFile(file, LIBS);

        ReferencesTable referencesTable = bundle.buildReferencesTable();

        String name = "Shell";

        Boolean allNamesCorrect = referencesTable.getTypeReferences(name).stream()
                .map(x -> x.name().equals(name))
                .collect(Collectors.reducing(true, Boolean::logicalAnd));

        assertTrue(allNamesCorrect);

        String usedNames = referencesTable.getTypeReferences(name).stream()
                .map(ReferencesTable.Entry::location)
                .sorted()
                .map(x -> x.fsFile().orElseThrow().getName() + ":" + x.asText())
                .collect(Collectors.joining(","));

        assertEquals(
                "model.pacioli:l45c22-l45c22,model.pacioli:l45c22-l45c27,model.pacioli:l67c17-l67c22,model.pacioli:l86c17-l86c22,model.pacioli:l107c17-l107c22,model.pacioli:l115c17-l115c22,model.pacioli:l123c17-l123c22,model.pacioli:l174c91-l174c96,model.pacioli:l247c17-l247c22,model.pacioli:l247c33-l247c38,model.pacioli:l305c17-l305c22",
                usedNames);
    }
}