import chalk from "chalk";
import { table } from "table";

export class OutputHelper {
  static log(message: string): void {
    console.log(message);
  }

  static success(message: string): void {
    console.log(chalk.green(message));
  }

  static warning(message: string): void {
    console.log(chalk.yellow(message));
  }

  static error(message: string): void {
    console.log(chalk.red(message));
  }

  static info(message: string): void {
    console.log(chalk.blue(message));
  }

  static table(data: any[], columns: string[]): void {
    console.table(data, columns);
  }

  static separator(character: string = "-", length: number = 30): void {
    console.log(character.repeat(length));
  }

  static newLine(): void {
    console.log();
  }

  /**
   * Tworzy tabelę z danymi i niestandardowym obramowaniem.
   * @param {any[][]} tableData - Dane tabeli.
   * @returns {string} - Sformatowana tabela.
   */
  static createTable(tableData: any[][], columns: any[] = []): string {
    const customBorder = {
      topBody: "─",
      topJoin: "┬",
      topLeft: "╭",
      topRight: "╮",
      bottomBody: "─",
      bottomJoin: "┴",
      bottomLeft: "└",
      bottomRight: "┘",
      bodyLeft: "│",
      bodyRight: "│",
      bodyJoin: " ",
      joinBody: "┈",
      joinLeft: "├",
      joinRight: "┤",
      joinJoin: "┈",
    };

    const config = {
      columns: columns,
      border: customBorder,
    };

    return table(tableData, config);
  }
}
