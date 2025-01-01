import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import figlet from "figlet"; // Import figlet
import { OutputHelper } from "./outputHelper.js"; // Dodano rozszerzenie .js
import { Employee } from "../employee.js"; // Dodano rozszerzenie .js
import { Task } from "../types/task.types.js"; // Dodano rozszerzenie .js
import { TaskProcessingReporter } from "./taskProcessingReporter.js"; // Dodano rozszerzenie .js

/**
 * Wyświetla nagłówek w stylu ASCII art za pomocą figlet.
 * @param {string} title - Tytuł do wyświetlenia.
 */
function displayHeader(title: string): void {
  const output = figlet.textSync(title, { font: "Pagga" });
  console.log(chalk.gray(output));
}

/**
 * Wyświetla listę pracowników w formie tabeli z kolorowym nagłówkiem i kropkowanym obramowaniem.
 * @param {Employee[]} employees - Lista obiektów pracowników.
 */
export function displayEmployees(employees: Employee[]): void {
  OutputHelper.log("\n");
  displayHeader("Lista Pracownikow"); // Dodano nagłówek

  const tableData = [
    [chalk.blue.bold("ID"), chalk.blue.bold("Imię"), chalk.blue.bold("Rola")], // Kolorowy nagłówek
  ];
  employees.forEach((emp) => {
    tableData.push([emp.id.toString(), emp.name, emp.role]);
  });

  const tableOutput = OutputHelper.createTable(tableData);
  OutputHelper.log("\n" + tableOutput);
}

/**
 * Wyświetla listę zadań w formie tabeli.
 * @param {string} tasksPath - Ścieżka do katalogu z zadaniami.
 * @param {Employee[]} employees - Lista obiektów pracowników.
 * @returns {Promise<void>} - Obietnica zakończenia wyświetlania zadań.
 */
export async function displayTasks(
  tasksPath: string,
  employees: Employee[]
): Promise<void> {
  displayHeader("Lista Zadan"); // Dodano nagłówek

  const tasks = await fs.readdir(tasksPath);

  const tableData = [
    [
      chalk.blue.bold("ID"),
      chalk.blue.bold("Tytuł"),
      chalk.blue.bold("Typ"),
      chalk.blue.bold("Status"),
      chalk.blue.bold("Wykonawca"),
    ],
  ];

  await Promise.all(
    tasks.map(async (taskFile): Promise<void> => {
      const task: Task = await fs.readJson(path.join(tasksPath, taskFile));
      const assignee = employees.find((e) => e.id === task.to);
      tableData.push([
        task.id.toString(),
        task.title,
        task.type,
        task.status,
        assignee ? assignee.name : "Nieznany",
      ]);
    })
  );

  const tableOutput = OutputHelper.createTable(tableData, [{}, { width: 20 }]); // Użycie pakietu "table"
  OutputHelper.log("Lista zadań:\n" + tableOutput);
}

/**
 * Wyświetla raport przetwarzania zadań i podsumowanie.
 * @param {TaskProcessingReporter} processingReporter - Obiekt raportera przetwarzania zadań.
 */
export function displayProcessingResults(
  processingReporter: TaskProcessingReporter
): void {
  displayHeader("Raport Przetwarzania"); // Dodano nagłówek

  // Wyświetlenie pełnego raportu
  OutputHelper.log(processingReporter.generateReport());

  // Wyświetlenie podsumowania
  const processedCount = processingReporter.getProcessedTasksCount();
  OutputHelper.success(
    `Zakończono przetwarzanie wszystkich zadań (${processedCount} zadań).`
  );
}
