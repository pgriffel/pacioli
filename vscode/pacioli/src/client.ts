import { existsSync } from "fs";
import path from "path";
import { ExtensionContext } from "vscode";
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

  init(): Promise<void> {
    let clientId = "pacioli-vscode-lsclient";
    let clientName = "Pacioli LS Client";

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
      "pacioli-0.5.0-SNAPSHOT-jar-with-dependencies.jar"
    );
    const libDir = path.join(String(this.context?.extensionPath), "lib");

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
      clientOptions
    );

    return this.languageClient.start();
  }
}
