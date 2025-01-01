import { Task } from "../types/task.types";

interface TaskProcessingEntry {
  task: Task;
  action: string;
  status: string;
}

export class TaskProcessingReporter {
  private processedTasks: TaskProcessingEntry[] = [];

  addToReport(task: Task, action: string, newStatus: string): void {
    this.processedTasks.push({
      task,
      action,
      status: `${task.status} → ${newStatus}`
    });
  }

  generateReport(employeeName?: string): string {
    const reportLines = ["\n🔍 Raport przetwarzania zadań:"];

    this.processedTasks.forEach((entry, index) => {
      const employeeInfo = employeeName ? `Pracownik: ${employeeName}` : '';
      const gray = '\x1b[90m'; // ANSI kod dla szarego koloru
      const reset = '\x1b[0m'; // Resetowanie koloru

      reportLines.push(
        `${gray}${index + 1}. Zadanie #${entry.task.id}:${reset}`,
        `   • Akcja: ${entry.action}`,
        `   • Status: ${entry.status}`,
        `   • Typ: ${entry.task.type}`,
        employeeInfo
      );

      if (entry.task.warnings) {
        reportLines.push(`   ⚠️ Uwagi: ${entry.task.warnings}`);
      }
    });

    return reportLines.join('\n');
  }

  clearReport(): void {
    this.processedTasks = [];
  }

  getProcessedTasksCount(): number {
    return this.processedTasks.length;
  }
}
