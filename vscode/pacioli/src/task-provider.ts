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
  workspace,
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
    command: "compile",
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

  private libDir(): string {
    const libdirConfig = workspace.getConfiguration("pacioli").get("libdir") as
      | string
      | null;
    return libdirConfig ?? path.join(String(this.context.extensionPath), "lib");
  }

  public async provideTasks(): Promise<Task[]> {
    return predefinedTasks(this.jarFile(), this.libDir());
  }

  public resolveTask(task: Task): Task | undefined {
    const pacioliTask = {
      command: task.definition.command,
      target: task.definition.target,
    } as PacioliTask;

    const cmd = shellCommand(pacioliTask, this.jarFile(), this.libDir());

    if (cmd === undefined) {
      window.showErrorMessage(
        `Task definition '${task.name}' is invalid.
         A pacioli task definition is of the form {type: 'pacioli', command: string, target?: string} with property command one of run', 'compile', 'types', 'symbols', 'api', and 'baseapi'. 
         Property target is required for the compile command. Its value is 'mvm' or 'javascript'.`
      );
      return undefined;
    }

    const resolved = new Task(
      task.definition,
      TaskScope.Workspace,
      task.name,
      "pacioli",
      new ShellExecution(cmd),
      []
    );

    resolved.group = {
      id: TaskGroup.Build.id,
      isDefault: pacioliTask.command === "run",
    };

    return resolved;
  }
}

function predefinedTasks(jarFile: string, libDir: string) {
  return PREDEFINED_TASKS.map((pacioliTask: PacioliTask) => {
    const cmd = shellCommand(pacioliTask, jarFile, libDir);
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

function shellCommand(
  task: PacioliTask,
  jarFile: string,
  libDir: string
): string | undefined {
  switch (task.command) {
    case "run": {
      return `java -jar ${jarFile} run \${file} -debug -lib ${libDir}`;
    }
    case "compile": {
      switch (task.target) {
        case "mvm": {
          return `java -jar ${jarFile} compile \${file} -target mvm -debug -lib ${libDir}`;
        }
        case "javascript": {
          return `java -jar ${jarFile} compile \${file} -target javascript -debug -lib ${libDir}`;
        }
        default: {
          return undefined;
        }
      }
    }
    case "types": {
      return `java -jar ${jarFile} types \${file} -debug -lib ${libDir}`;
    }
    default: {
      return undefined;
    }
  }
}
