// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from "vscode";
import { commands, ExtensionContext, languages, tasks, window } from "vscode";
import { PacioliClient } from "./client";
import { PacioliTaskProvider } from "./task-provider";

/**
 * These commands are used by the menus to call the required tasks. Directly
 * coupling the tasks with the menu declarations in package.json does not
 * seem possible.
 *
 * Must match the "commands" section in package.json.
 */
const MENU_COMMANDS = [
  { id: "pacioli.run", task: "pacioli: Run pacioli file" },
  { id: "pacioli.types", task: "pacioli: Types pacioli file" },
  { id: "pacioli.compilemvm", task: "pacioli: Compile pacioli file to mvm" },
  { id: "pacioli.compilejs", task: "pacioli: Compile pacioli file to js" },
];

const pacioliClient = new PacioliClient();

const diagnosticCollection = languages.createDiagnosticCollection("pacioli");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // vscode.window.showInformationMessage("Activating Pacioli extension");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  for (let command of MENU_COMMANDS) {
    const disposable = commands.registerCommand(command.id, (args) => {
      commands.executeCommand("workbench.action.tasks.runTask", command.task);
    });
    context.subscriptions.push(disposable);
  }

  let channel = window.createOutputChannel("Pacioli Language Client");

  const disposable = tasks.registerTaskProvider(
    "pacioli",
    new PacioliTaskProvider(context!, channel)
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(diagnosticCollection);

  //Set the context of the extension instance
  pacioliClient.setContext(context);

  //Initialize the LS Client extension instance.
  pacioliClient
    .init()
    .then(() => {
      window.showInformationMessage("Pacioli extension activated");
    })
    .catch((error) => {
      window.showErrorMessage(`Failed to activate pacioli extension: ${error}`);
    });
}

// This method is called when your extension is deactivated
export function deactivate() {
  window.showInformationMessage("Deactivating Pacioli extension");
}
