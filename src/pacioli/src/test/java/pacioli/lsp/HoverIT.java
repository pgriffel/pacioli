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

package pacioli.lsp;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

import org.eclipse.lsp4j.Hover;
import org.eclipse.lsp4j.HoverParams;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.TextDocumentIdentifier;
import org.eclipse.lsp4j.jsonrpc.Launcher;
import org.eclipse.lsp4j.launch.LSPLauncher;
import org.eclipse.lsp4j.services.LanguageClient;
import org.junit.jupiter.api.Test;

/**
 * Test for the 'locate_references' LSP command.
 */
class HoverIT {

        static final List<File> LIBS = TestEnvironment.LIBS;

        static Future<Void> launchServer(PacioliLanguageServer server) {

                Launcher<LanguageClient> launcher = LSPLauncher.createServerLauncher(server, System.in, System.out
                // clientSocket.getInputStream(), clientSocket.getOutputStream()
                );

                LanguageClient client = launcher.getRemoteProxy();

                server.connect(client);

                return launcher.startListening();

        }

        @Test
        void hoverForRecordType() throws Exception {

                // Setup
                PacioliLanguageServer server = LSPContainer.fromSystemIO(LIBS).server;
                Future<Void> handle = launchServer(server);

                // Given document shells/model.pacioli
                var path = TestEnvironment.sampleFileURI("shells/model.pacioli").toString();
                var doc = new TextDocumentIdentifier(path);

                // When hover information is requested for line 55 column 25 (the Shell type
                // name)
                CompletableFuture<Hover> res = server.getTextDocumentService()
                                .hover(new HoverParams(doc, new Position(55, 25)));

                org.eclipse.lsp4j.Hover output = res.get();

                // Then the output should have contents
                assertTrue(output.getContents().isRight());

                // And the output should contain the Shell constructor documentation
                String expectedOutput = """
                                ### Type

                                Settings~
                                ~
                                ~Settings for a Shell


                                source: model
                                """.replace("~", " ");

                String actual = output.getContents().getRight().getValue().replace("\r\n", "\n");

                assertEquals(expectedOutput, actual);

                // Teardown
                handle.cancel(true);
                server.shutdown();
        }

        @Test
        void hoverForRecordConstructor() throws Exception {

                // Setup
                PacioliLanguageServer server = LSPContainer.fromSystemIO(LIBS).server;
                Future<Void> handle = launchServer(server);

                // Given document shells/model.pacioli
                var path = TestEnvironment.sampleFileURI("shells/model.pacioli").toString();
                var doc = new TextDocumentIdentifier(path);

                // When hover information is requested for line 55 column 44 (the shell record
                // name)
                CompletableFuture<Hover> res = server.getTextDocumentService()
                                .hover(new HoverParams(doc, new Position(55, 44)));

                org.eclipse.lsp4j.Hover output = res.get();

                // Then the output should have contents
                assertTrue(output.getContents().isRight());

                // And the output should contain the Shell constructor documentation
                String expectedOutput = """
                                ### Function

                                ```pacioli
                                make_settings :: for_unit a: (Curve(a), Curve(a), 1, 1, List(1)) -> Settings(a)
                                ```

                                Constructor for record <code>Settings(a)</code>


                                source: model
                                """;

                String actual = output.getContents().getRight().getValue().replace("\r\n", "\n");

                assertEquals(expectedOutput, actual);

                // Teardown
                handle.cancel(true);
                server.shutdown();
        }

        @Test
        void hoverForGetterSetter() throws Exception {

                // Setup
                PacioliLanguageServer server = LSPContainer.fromSystemIO(LIBS).server;
                Future<Void> handle = launchServer(server);

                // Given document shells/model.pacioli
                var path = TestEnvironment.sampleFileURI("shells/model.pacioli").toString();
                var doc = new TextDocumentIdentifier(path);

                // When hover information is requested for line 55 column 44 (the Shell record
                // name)
                CompletableFuture<Hover> res = server.getTextDocumentService()
                                .hover(new HoverParams(doc, new Position(57, 6)));

                org.eclipse.lsp4j.Hover output = res.get();

                // Then the output should have contents
                assertTrue(output.getContents().isRight());

                // And the output should contain the Shell constructor documentation
                String expectedOutputGetter = """
                                ### Function

                                ```pacioli
                                settings_gvm :: for_unit a: (Settings(a)) -> Curve(a)
                                ```

                                Getter for record <code>Settings(a)</code>


                                source: model
                                """;

                String sepratator = """


                                   ---

                                """;

                String expectedOutputSetter = """
                                ### Function

                                ```pacioli
                                with_settings_gvm :: for_unit a: (Curve(a), Settings(a)) -> Settings(a)
                                ```

                                Setter for record <code>Settings(a)</code>


                                source: model
                                """;

                String actual = output.getContents().getRight().getValue().replace("\r\n", "\n");

                assertTrue(actual.equals(expectedOutputSetter + sepratator + expectedOutputGetter) ||
                                actual.equals(expectedOutputGetter + sepratator + expectedOutputSetter));

                // Teardown
                handle.cancel(true);
                server.shutdown();
        }

        @Test
        void hoverForIndexSetInFieldType() throws Exception {

                // Setup
                PacioliLanguageServer server = LSPContainer.fromSystemIO(LIBS).server;
                Future<Void> handle = launchServer(server);

                // Given document shells/model.pacioli
                var path = TestEnvironment.sampleFileURI("shells/model.pacioli").toString();
                var doc = new TextDocumentIdentifier(path);

                // When hover information is requested for line 48 column 28 (the Geom3 index
                // set in the Shell meshes field name)
                CompletableFuture<Hover> res = server.getTextDocumentService()
                                .hover(new HoverParams(doc, new Position(48, 28)));

                org.eclipse.lsp4j.Hover output = res.get();

                // Then the output should have contents
                assertTrue(output.getContents().isRight());

                // And the output should contain the Shell constructor documentation
                String expectedOutput = """
                                ### Type

                                Geom3~
                                ~
                                ~Index set for a 3D geometric space. Defined as the set `{x, y, z}`.


                                source: geometry
                                 """.replace("~", " ");

                String actual = output.getContents().getRight().getValue().replace("\r\n", "\n");

                assertEquals(expectedOutput, actual);

                // Teardown
                handle.cancel(true);
                server.shutdown();
        }
}
