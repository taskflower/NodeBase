import { Employee } from "../employee";
import { Task } from "../types/task.types";
import { OutputHelper } from "./outputHelper.js";

/**
 * Wyświetla informacje o analizie zadania przez CEO.
 * @param {Employee} employee - Obiekt pracownika.
 * @param {Task} task - Obiekt zadania.
 */
export function logCEOAnalyzesTask(employee: Employee, task: Task): void {
  OutputHelper.info(`CEO ${employee.name} analizuje zadanie ${task.id}`);
}

/**
 * Wyświetla informacje o rozpoczęciu pracy nad zadaniem.
 * @param {Employee} employee - Obiekt pracownika.
 * @param {Task} task - Obiekt zadania.
 */
export function logStartTask(employee: Employee, task: Task): void {
  OutputHelper.info(`${employee.name} rozpoczyna pracę nad zadaniem ${task.id}`);
}

/**
 * Wyświetla informacje o zakończeniu pracy nad zadaniem.
 * @param {Employee} employee - Obiekt pracownika.
 * @param {Task} task - Obiekt zadania.
 */
export function logEndTask(employee: Employee, task: Task): void {
  OutputHelper.info(`${employee.name} zakończył pracę nad zadaniem ${task.id}`);
}

/**
 * Wyświetla informacje o recenzji zadania.
 * @param {Employee} employee - Obiekt pracownika.
 * @param {Task} task - Obiekt zadania.
 */
export function logTaskReview(employee: Employee, task: Task): void {
  OutputHelper.info(`${employee.name} wykonuje recenzję zadania ${task.id}`);
}

/**
 * Wyświetla informacje o zakończeniu recenzji zadania.
 * @param {Employee} employee - Obiekt pracownika.
 * @param {Task} task - Obiekt zadania.
 */
export function logTaskReviewComplete(employee: Employee, task: Task): void {
  OutputHelper.info(`${employee.name} zakończył recenzję zadania ${task.id}`);
}

/**
 * Wyświetla informacje o podtaskach zakończonych dla zadania.
 * @param {Employee} employee - Obiekt pracownika.
 * @param {Task} task - Obiekt zadania.
 */
export function logSubtasksComplete(employee: Employee, task: Task): void {
  OutputHelper.info(`Wszystkie podtaski zakończone dla zadania ${task.id}`);
}

/**
 * Wyświetla błąd związany z przetwarzaniem zadania.
 * @param {Task} task - Obiekt zadania.
 * @param {Error} error - Obiekt błędu.
 */
export function logTaskError(task: Task, error: unknown): void {
  OutputHelper.error(`Error processing task ${task.id}: ` + error);
}
