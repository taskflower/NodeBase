import fs from "fs-extra";
import path from "path";
import { TaskManager } from "./taskManager.js"; // Dodaj .js
import { ModelConnector } from "./modelConnector.js"; // Dodaj .js
import { Task } from "./types/task.types.js"; // Dodaj .js
import { EmployeeData } from "./types/employee.types.js"; // Dodaj .js
import {
  logCEOAnalyzesTask,
  logStartTask,
  logEndTask,
  logTaskReview,
  logTaskReviewComplete,
  logSubtasksComplete,
  logTaskError,
} from "./output/employeeReporter.js"; // Dodaj .js
import { OutputHelper } from "./output/outputHelper.js"; // Dodaj .js


export class Employee implements EmployeeData {
  public readonly id: string;
  public readonly name: string;
  public readonly role: string;
  public readonly permissions: string[];
  public readonly manages?: string[];
  public readonly reports_to?: string;

  private readonly taskManager: TaskManager;
  private readonly modelConnector: ModelConnector;

  constructor(
    employeeData: EmployeeData,
    taskManager: TaskManager,
    modelConnector: ModelConnector
  ) {
    this.id = employeeData.id;
    this.name = employeeData.name;
    this.role = employeeData.role;
    this.permissions = employeeData.permissions;
    this.manages = employeeData.manages;
    this.reports_to = employeeData.reports_to;

    this.taskManager = taskManager;
    this.modelConnector = modelConnector;
  }

  async processTask(task: Task): Promise<Task | void> {
    if (!this.canProcessTask(task)) {
      return;
    }

    let updatedTask = { ...task };

    try {
      if (this.role === "CEO") {
        logCEOAnalyzesTask(this, task);
        await this.processCEOTask(task);
        return updatedTask;
      }

      if (task.to === this.id && task.status === "pending") {
        logStartTask(this, task);
        const workResult = await this.doWork(task);
        updatedTask = {
          ...updatedTask,
          status: "in_progress",
          result: {
            output: workResult.output,
            timestamp: new Date().toISOString(),
          },
        };
        logEndTask(this, task);
      }

      if (task.status === "in_progress") {
        logTaskReview(this, task);
        const reviewResult = await this.reviewTask(task);
        updatedTask = {
          ...updatedTask,
          status: "completed",
          review: {
            reviewer: this.id,
            content: reviewResult.output,
            timestamp: new Date().toISOString(),
          },
        };
        logTaskReviewComplete(this, task);
      }

      if (!task.parent_task) {
        const subtasks = await this.getSubtasks(task.id.toString());
        if (subtasks.length > 0) {
          const allCompleted = subtasks.every(
            (st) => st.status === "completed"
          );
          if (allCompleted && updatedTask.status === "in_progress") {
            logSubtasksComplete(this, task);
            updatedTask.status = "completed";
          }
        }
      }

      return updatedTask;
    } catch (error) {
      logTaskError(task, error); 
      return task;
    }
  }

  private canProcessTask(task: Task): boolean {
    if (task.parent_task) {
      return true;
    }
    return true;
  }

  private async getSubtasks(parentTaskId: string): Promise<Task[]> {
    try {
      const allTasks = await fs.readdir(this.taskManager.getPath("tasks"));
      const subtasks = await Promise.all(
        allTasks.map(async (filename: string) => {
          const task: Task = await fs.readJson(
            path.join(this.taskManager.getPath("tasks"), filename)
          );
          return task.parent_task === parentTaskId ? task : null;
        })
      );
      return subtasks.filter((task): task is Task => task !== null);
    } catch (error) {
      const taskId = parseInt(parentTaskId, 10);
      if (isNaN(taskId)) {
        OutputHelper.error(`Invalid parent task ID: ${parentTaskId}`);
        return [];
      }
      logTaskError({ id: taskId, title: "Unknown" } as Task, error); // Tworzymy pełny obiekt
      return [];
    }
  }

  private async doWork(task: Task): Promise<{ output: string }> {
    const result = await this.modelConnector.processTask(task, this.role);
    return {
      output: typeof result === "string" ? result : JSON.stringify(result),
    };
  }

  private async reviewTask(task: Task): Promise<{ output: string }> {
    const result = await this.modelConnector.processTask(task, this.role);
    return {
      output: typeof result === "string" ? result : JSON.stringify(result),
    };
  }

  private async processCEOTask(task: Task): Promise<void> {
    await this.modelConnector.processTask(task, this.role);
  }
}
