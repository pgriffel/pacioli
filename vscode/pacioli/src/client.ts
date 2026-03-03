/**
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

import { existsSync } from "fs";
import path from "path";
import { ExtensionContext, workspace } from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

/**
 * Bridge between the vs-code extension and the vs-code LanguageClient.
 *
 * Connects a vs-code LanguageClient to the Pacioli language server.
 */
export class PacioliClient {
  private languageClient?: LanguageClient;
  private context?: ExtensionContext;

  setContext(context: ExtensionContext) {
    this.context = context;
  }

  private libDir(): string {
    const libdirConfig = workspace.getConfiguration("pacioli").get("libdir") as
      | string
      | null;
    return (
      libdirConfig ?? path.join(String(this.context?.extensionPath), "lib")
    );
  }

  init(): Promise<void> {
    let clientId = "pacioli-vscode-lsclient";
    let clientName = "Pacioli Language Server";

    // Options to control the language client
    let clientOptions: LanguageClientOptions = {
      // Register the server for plain text documents
      documentSelector: [{ scheme: "file", language: "pacioli" }],
      // synchronize: {
      //     // Notify the server about file changes to '.clientrc files contained in the workspace
      //     fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
      // }
    };

    // const jarFile =
    //   "D:\\code\\pacioli\\src\\pacioli\\target\\pacioli-0.5.0-SNAPSHOT-jar-with-dependencies.jar";
    // const libDir = "D:\\code\\pacioli\\lib\\";

    const jarFile = path.join(
      String(this.context?.extensionPath),
      "pacioli.jar",
    );
    const libDir = this.libDir();

    let serverOptions: ServerOptions = {
      command: "java",
      args: ["-jar", jarFile, "lsp", "-lib", libDir],
      options: {},
    };

    if (!existsSync(jarFile)) {
      return Promise.reject(`Jar file ${jarFile} does not exist`);
    }

    if (!existsSync(libDir)) {
      return Promise.reject(`Library directory ${libDir} does not exist`);
    }

    this.languageClient = new LanguageClient(
      clientId,
      clientName,
      serverOptions,
      clientOptions,
    );

    return this.languageClient.start();
  }
}
