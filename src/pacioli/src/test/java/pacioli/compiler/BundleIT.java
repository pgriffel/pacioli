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

                // Then its environment should contain 276 values.
                List<ValueInfo> infos = bundle.allValueInfos();

                assertEquals(288, infos.size());
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

                ReferencesTable referencesTable = bundle.buildReferencesTable();

                String name = "BoM";

                Boolean allNamesCorrect = referencesTable.getValueReferences(name).stream()
                                .map(x -> x.name().equals(name))
                                .collect(Collectors.reducing(true, Boolean::logicalAnd));

                assertTrue(allNamesCorrect);

                String usedNames = referencesTable.getValueReferences(name).stream()
                                .map(x -> {
                                        return x.location().file().orElseThrow().getName() + ":" +
                                                        x.location().fromLine;
                                })
                                .collect(Collectors.joining(","));

                assertEquals("bom.pacioli:103,bom.pacioli:84,bom.pacioli:109,bom.pacioli:132",
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
                                .map(x -> {
                                        return x.location().file().orElseThrow().getName() + ":" +
                                                        x.location().fromLine;
                                })
                                .collect(Collectors.joining(","));

                assertEquals(
                                "bom.pacioli:118,bom.pacioli:118,bom.pacioli:100,bom.pacioli:100,bom.pacioli:71,bom.pacioli:71,bom.pacioli:84,bom.pacioli:84,bom.pacioli:112,bom.pacioli:77,bom.pacioli:106,bom.pacioli:106,bom.pacioli:48,bom.pacioli:37,bom.pacioli:59",
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
                                .map(x -> {
                                        return x.location().file().orElseThrow().getName() + ":" +
                                                        x.location().fromLine;
                                })
                                .collect(Collectors.joining(","));

                assertEquals(
                                "model.pacioli:174,model.pacioli:45,model.pacioli:107,model.pacioli:67,model.pacioli:123,model.pacioli:247,model.pacioli:247,model.pacioli:305,model.pacioli:115,model.pacioli:86,model.pacioli:45",
                                usedNames);
        }
}