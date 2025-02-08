// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { PacioliClient } from "./client";

const pacioliClient = new PacioliClient();
const diagnosticCollection =
  vscode.languages.createDiagnosticCollection("pacioli");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  vscode.window.showInformationMessage("Activating Pacioli extension");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "pacioli.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from pacioli!");
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(diagnosticCollection);

  //Set the context of the extension instance
  pacioliClient.setContext(context);
  //Initialize the LS Client extension instance.
  pacioliClient
    .init()
    .then(() => {
      vscode.window.showInformationMessage("Pacioli extension activated");
    })
    .catch((error) => {
      vscode.window.showErrorMessage(
        `Failed to activate pacioli extension: ${error}`
      );
    });
}

// This method is called when your extension is deactivated
export function deactivate() {
  vscode.window.showInformationMessage("Deactivating Pacioli extension");
}
