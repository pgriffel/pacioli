import { ExtensionContext } from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  State,
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
    try {
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

      let serverOptions: ServerOptions = {
        command: "java",
        args: [
          "-jar",
          "D:\\code\\pacioli\\src\\pacioli\\target\\pacioli-0.5.0-SNAPSHOT-jar-with-dependencies.jar",
          "lsp",
        ],
        options: {},
      };

      this.languageClient = new LanguageClient(
        clientId,
        clientName,
        serverOptions,
        clientOptions
      );

      // Start the client. This will also launch the server
      return this.languageClient.start();
    } catch (exception) {
      return Promise.reject("Extension error!");
    }
  }
}
