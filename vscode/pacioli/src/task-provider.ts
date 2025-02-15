import path from "path";
import {
  ExtensionContext,
  OutputChannel,
  ShellExecution,
  Task,
  TaskGroup,
  TaskProvider,
  TaskScope,
  window,
} from "vscode";

interface PacioliTask {
  label: string;
  command: string;
  target?: string;
}

const PREDEFINED_TASKS: PacioliTask[] = [
  {
    label: "Run pacioli file",
    command: "run",
  },
  {
    label: "Compile pacioli file to js",
    command: "compile",
    target: "javascript",
  },
  {
    label: "Compile pacioli file to mvm",
    command: "run",
    target: "mvm",
  },
  {
    label: "Types pacioli file",
    command: "types",
  },
];

export class PacioliTaskProvider implements TaskProvider {
  constructor(private context: ExtensionContext, private out: OutputChannel) {}

  private jarFile(): string {
    return path.join(
      String(this.context.extensionPath),
      "pacioli-0.5.0-SNAPSHOT-jar-with-dependencies.jar"
    );
  }

  public async provideTasks(): Promise<Task[]> {
    this.out.appendLine(`provising tasks`);
    return predefinedTasks(this.jarFile());
  }

  public resolveTask(_task: Task): Task | undefined {
    this.out.appendLine(`resolving task ${JSON.stringify(_task)}`);
    const pacioliTask = {
      command: _task.definition.command,
      target: _task.definition.target,
    } as PacioliTask;

    const cmd = shellCommand(pacioliTask, this.jarFile());

    if (cmd === undefined) {
      window.showErrorMessage(
        `Task definition '${_task.name}' is invalid.
         A pacioli task definition is of the form {type: 'pacioli', command: string, target?: string} with property command one of run', 'compile', 'types', 'symbols', 'api', and 'baseapi'. 
         Property target is required for the compile command. Its value is 'mvm' or 'javascript'.`
      );
      return undefined;
    }

    const task = new Task(
      _task.definition,
      TaskScope.Workspace,
      _task.name,
      "pacioli",
      new ShellExecution(cmd),
      []
    );

    task.group = {
      id: TaskGroup.Build.id,
      isDefault: pacioliTask.command === "run",
    };
    return task;
  }
}

function predefinedTasks(jarFile: string) {
  return PREDEFINED_TASKS.map((pacioliTask: PacioliTask) => {
    const cmd = shellCommand(pacioliTask, jarFile);
    if (cmd) {
      const task = new Task(
        {
          type: "pacioli",
          command: pacioliTask.command,
          target: pacioliTask.target,
        },
        TaskScope.Workspace,
        pacioliTask.label,
        "pacioli",
        new ShellExecution(cmd),
        []
      );

      task.group = {
        id: TaskGroup.Build.id,
        isDefault: pacioliTask.command === "run",
      };

      return task;
    } else {
      throw new Error("invalid shell command in predefined task");
    }
  });
}

function shellCommand(task: PacioliTask, jarFile: string): string | undefined {
  switch (task.command) {
    case "run": {
      return `java -jar ${jarFile} run \${file} -debug -lib lib/`;
    }
    case "compile": {
      switch (task.target) {
        case "mvm": {
          return `java -jar ${jarFile} compile \${file} -target mvm -debug -lib lib/`;
        }
        case "javascript": {
          return `java -jar ${jarFile} compile \${file} -target javascript -debug -lib lib/`;
        }
        default: {
          return undefined;
        }
      }
    }
    case "types": {
      return `java -jar ${jarFile} types \${file} -debug -lib lib/`;
    }
    default: {
      return undefined;
    }
  }
}
