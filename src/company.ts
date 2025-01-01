import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url"; // Dodano import
import { TaskManager } from "./taskManager.js"; 
import { Employee } from "./employee.js";
import { ModelConnector } from "./modelConnector.js";
import { OutputHelper } from "./output/outputHelper.js";
import { Task } from "./types/task.types.js";
import { EmployeeData } from "./types/employee.types.js";
import { TaskProcessingReporter } from "./output/taskProcessingReporter.js";
import {
  displayEmployees,
  displayProcessingResults,
  displayTasks,
} from "./output/companyReporter.js";

dotenv.config();

// Implementacja __dirname dla ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Company {
  private paths: { [key: string]: string };
  private taskManager: TaskManager;
  private modelConnector: ModelConnector;
  private employees: Employee[];
  private processingReporter: TaskProcessingReporter;

  constructor() {
    this.paths = {
      employees: path.join(__dirname, "../data/employees"),
      tasks: path.join(__dirname, "../data/tasks"),
      conversations: path.join(__dirname, "../data/conversations"),
    };

    Object.values(this.paths).forEach((dir) => fs.ensureDirSync(dir));
    this.taskManager = new TaskManager(this.paths);
    this.modelConnector = new ModelConnector();
    this.employees = [];
    this.processingReporter = new TaskProcessingReporter();
    this.loadEmployees();
  }

  private async loadEmployees(): Promise<void> {
    try {
      const data = await fs.readJson(
        path.join(this.paths.employees, "team.json")
      );
      this.employees = data.employees.map(
        (emp: EmployeeData) =>
          new Employee(emp, this.taskManager, this.modelConnector)
      );
    } catch (error) {
      OutputHelper.error("Error loading employees: " + error);
    }
  }

  private async getSubtasks(parentTaskId: string): Promise<Task[]> {
    const allTasks = await fs.readdir(this.paths.tasks);
    const subtasks = await Promise.all(
      allTasks.map(async (filename) => {
        const task = await fs.readJson(path.join(this.paths.tasks, filename));
        return task.parent_task === parentTaskId ? task : null;
      })
    );
    return subtasks.filter((task): task is Task => task !== null);
  }

  private async updateParentTaskStatus(task: Task): Promise<void> {
    if (!task.parent_task) {
      const subtasks = await this.getSubtasks(task.id.toString());
      if (subtasks.length > 0) {
        const allCompleted = subtasks.every((st) => st.status === "completed");
        if (allCompleted && task.status === "in_progress") {
          const taskPath = path.join(this.paths.tasks, `${task.id}.json`);
          task.status = "completed";
          await fs.writeJson(taskPath, task, { spaces: 2 });

          this.processingReporter.addToReport(
            task,
            "Automatyczne zakończenie (wszystkie podtaski ukończone)",
            "completed"
          );
        }
      }
    }
  }

  public async processAllTasks(): Promise<void> {
    this.processingReporter.clearReport();

    const tasks = await fs.readdir(this.paths.tasks);
    const taskDetails: Task[] = await Promise.all(
      tasks.map(async (taskFile) => {
        const taskPath = path.join(this.paths.tasks, taskFile);
        return await fs.readJson(taskPath);
      })
    );

    for (const task of taskDetails) {
      const taskPath = path.join(this.paths.tasks, `${task.id}.json`);

      if (task.status === "pending" || task.status === "in_progress") {
        const employee = this.employees.find((e) => e.id === task.to);
        if (employee) {
          const updatedTask = await employee.processTask(task);
          if (updatedTask) {
            await fs.writeJson(taskPath, updatedTask, { spaces: 2 });
            this.processingReporter.addToReport(
              updatedTask,
              task.status === "pending"
                ? "Rozpoczęcie pracy"
                : "Kontynuacja pracy",
              updatedTask.status
            );
          }
        }
      }
    }

    for (const task of taskDetails) {
      if (!task.parent_task) {
        await this.updateParentTaskStatus(task);
      }
    }

    displayProcessingResults(this.processingReporter);
  }

  public async createTask(): Promise<void> {
    await this.taskManager.createTask(this.employees, this.modelConnector);
  }

  public async listEmployees(): Promise<void> {
    displayEmployees(this.employees);
  }

  public async viewTasks(): Promise<void> {
    await displayTasks(this.paths.tasks, this.employees);
  }
}
