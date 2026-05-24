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

import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.ReferenceContext;
import org.eclipse.lsp4j.ReferenceParams;
import org.eclipse.lsp4j.TextDocumentIdentifier;
import org.eclipse.lsp4j.jsonrpc.Launcher;
import org.eclipse.lsp4j.launch.LSPLauncher;
import org.eclipse.lsp4j.services.LanguageClient;
import org.junit.jupiter.api.Test;

/**
 * Test for the 'locate_references' LSP command.
 */
class LocateReferencesIT {

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
    void referencesForRecordConstructor() throws Exception {

        // Setup
        PacioliLanguageServer server = LSPContainer.fromSystemIO(LIBS).server;
        Future<Void> handle = launchServer(server);

        // Given document shells/model.pacioli
        var path = TestEnvironment.sampleFileURI("shells/model.pacioli").toString();
        var doc = new TextDocumentIdentifier(path);

        // When hover information is requested for line 55 column 25 (the Shell record
        // name)
        CompletableFuture<List<? extends org.eclipse.lsp4j.Location>> res = server.getTextDocumentService()
                .references(new ReferenceParams(doc, new Position(55, 25), new ReferenceContext()));

        List<? extends org.eclipse.lsp4j.Location> output = res.get();

        // Then the output should have 2 references
        assertEquals(2, output.size());

        // And the locations should be correct
        assertRefEquals(output.get(0), path, 46, 14, 46, 22);
        assertRefEquals(output.get(1), path, 55, 22, 55, 30);

        // Teardown
        handle.cancel(true);
        server.shutdown();
    }

    @Test
    void referencesForUnitVector() throws Exception {

        // Setup
        PacioliLanguageServer server = LSPContainer.fromSystemIO(LIBS).server;
        Future<Void> handle = launchServer(server);

        // Given document shells/model.pacioli
        var path = TestEnvironment.sampleFileURI("bom/bom.pacioli").toString();
        var doc = new TextDocumentIdentifier(path);

        // When hover information is requested for line 84 column 44 (the Pacioli!unit
        // name)
        CompletableFuture<List<? extends org.eclipse.lsp4j.Location>> res = server.getTextDocumentService()
                .references(new ReferenceParams(doc, new Position(84, 44), new ReferenceContext()));

        List<? extends org.eclipse.lsp4j.Location> output = res.get();

        // Then the output should have 12 references
        assertEquals(12, output.size());

        // And the locations should be correct
        assertRefEquals(output.get(0), path, 48, 16, 48, 20);
        assertRefEquals(output.get(1), path, 100, 12, 100, 16);
        assertRefEquals(output.get(2), path, 100, 29, 100, 33);
        assertRefEquals(output.get(3), path, 71, 12, 71, 16);
        assertRefEquals(output.get(4), path, 84, 25, 84, 29);
        assertRefEquals(output.get(5), path, 84, 42, 84, 46);

        // TODO: Why these duplicates?
        assertRefEquals(output.get(6), path, 48, 16, 48, 20);
        assertRefEquals(output.get(7), path, 100, 12, 100, 16);
        assertRefEquals(output.get(8), path, 100, 29, 100, 33);
        assertRefEquals(output.get(9), path, 71, 12, 71, 16);
        assertRefEquals(output.get(10), path, 84, 25, 84, 29);
        assertRefEquals(output.get(11), path, 84, 42, 84, 46);

        // Teardown
        handle.cancel(true);
        server.shutdown();
    }

    void assertRefEquals(org.eclipse.lsp4j.Location ref3, String file,
            int startLine, int startColumn,
            int endLine, int endColumn) {
        assertEquals(file, ref3.getUri());
        assertEquals(startLine, ref3.getRange().getStart().getLine());
        assertEquals(startColumn, ref3.getRange().getStart().getCharacter());
        assertEquals(endLine, ref3.getRange().getEnd().getLine());
        assertEquals(endColumn, ref3.getRange().getEnd().getCharacter());
    }
}
