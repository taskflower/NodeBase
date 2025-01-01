import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import ora from "ora";

import { ModelConnector } from "./modelConnector.js";
import { OutputHelper } from "./output/outputHelper.js";
import { Task } from "./types/task.types.js";
import { EmployeeData } from "./types/employee.types.js";

export class TaskManager {
  private paths: { [key: string]: string };

  constructor(paths: { [key: string]: string }) {
    this.paths = paths;
  }

  public getPath(type: 'tasks' | 'employees' | 'conversations'): string {
    return this.paths[type];
  }

  async createTask(
    employees: EmployeeData[],
    modelConnector: ModelConnector
  ): Promise<void> {
    const creator = await this.selectEmployee(employees, "Kto tworzy zadanie?");
    const possibleAssignees = this.getSubordinates(creator, employees);
  
    if (possibleAssignees.length === 0) {
      OutputHelper.error("Nie masz podwładnych, którym możesz przydzielić zadanie.");
      return;
    }
  
    const assignee = await this.selectEmployee(possibleAssignees, "Dla kogo?");
  
    const { taskType } = await inquirer.prompt([
      {
        type: "list",
        name: "taskType",
        message: "Wybierz typ zadania:",
        choices: [
          'creative_design',
          'content_creation', 
          'media_buying',
          'performance_analysis',
          'ad_copywriting'
        ]
      }
    ]);
  
    const spinner = ora("Generowanie zadania przez model językowy...").start();
  
    try {
      const taskAnalysis = await modelConnector.analyzeTask({
        description: "Zadanie do wygenerowania przez model językowy",
        creatorRole: creator.role,
        creatorId: creator.id,
        assigneeId: assignee.id,
        assigneeRole: assignee.role,
        availablePermissions: assignee.permissions,
        type: taskType,
        subordinates: possibleAssignees.map((emp) => ({
          id: emp.id,
          role: emp.role,
          permissions: emp.permissions,
        })),
      });
  
      spinner.succeed("Zadanie przeanalizowane pomyślnie.");
  
      const mainTask: Task = {
        id: Date.now(),
        title: taskAnalysis.title,
        what: taskAnalysis.description,
        who: creator.id,
        to: assignee.id,
        type: taskType,
        status: "pending",
        created: new Date().toISOString(),
      };
  
      await this.createTaskFile(mainTask);
      OutputHelper.info("Główne zadanie zostało zapisane.");
  
      if (taskAnalysis.needs_split && taskAnalysis.subtasks?.length) {
        OutputHelper.log("\nZadanie zostało podzielone na podtaski:");
        
        for (const subtask of taskAnalysis.subtasks) {
          const eligibleEmployee = employees.find(
            (emp) => this.getSubordinates(assignee, employees).find(sub => sub.id === emp.id)
          );
  
          if (!eligibleEmployee) {
            OutputHelper.error(`Brak odpowiedniego pracownika dla podtasku: ${subtask.title}`);
            continue;
          }
  
          const subTask: Task = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            title: subtask.title,
            what: subtask.description,
            who: assignee.id,
            to: eligibleEmployee.id,
            type: subtask.type,
            status: "pending",
            created: new Date().toISOString(),
            parent_task: mainTask.id.toString(),
          };
  
          await this.createTaskFile(subTask);
          OutputHelper.success(`Podtask "${subtask.title}" przypisany do: ${eligibleEmployee.name}`);
        }
      }
  
    } catch (error) {
      spinner.fail("Nie udało się wygenerować zadania.");
      OutputHelper.error(String(error));
    }
  }

  private getSubordinates(
    employee: EmployeeData,
    allEmployees: EmployeeData[]
  ): EmployeeData[] {
    return allEmployees.filter((e) => e.reports_to === employee.id);
  }

  private async selectEmployee(
    employees: EmployeeData[],
    message: string
  ): Promise<EmployeeData> {
    const { selectedId } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedId",
        message,
        choices: employees.map((e) => ({
          name: `${e.name} (${e.role})`,
          value: e,
        })),
      },
    ]);

    return selectedId;
  }

  private async createTaskFile(task: Task): Promise<void> {
    const taskPath = path.join(this.paths.tasks, `${task.id}.json`);
    await fs.writeJson(taskPath, task, { spaces: 2 });
  }

  async updateTask(task: Task): Promise<void> {
    const taskPath = path.join(this.paths.tasks, `${task.id}.json`);
    if (await fs.pathExists(taskPath)) {
      await fs.writeJson(taskPath, task, { spaces: 2 });
      OutputHelper.success(`Zadanie ${task.id} zostało zaktualizowane.`);
    } else {
      OutputHelper.error(`Zadanie ${task.id} nie istnieje.`);
    }
  }
}