import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { Company } from "./company.js";
import { OutputHelper } from "./output/outputHelper.js";
import figlet from "figlet";
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const company = new Company();

async function resetApp() {
  const { default: inquirer } = await import("inquirer"); // Dynamiczny import
  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      default: false,
      message:
        "Czy na pewno chcesz zresetować aplikację? Zostaną usunięte wszystkie zadania i konwersacje.",
    },
  ]);

  if (confirmed) {
    await fs.emptyDir(path.join(__dirname, "../data/tasks"));
    await fs.emptyDir(path.join(__dirname, "../data/conversations"));
    OutputHelper.success("Aplikacja została zresetowana.");
  }
}

async function main() {
  const output = figlet.textSync("TaskFlow", { font: "Univers" });
  console.log(chalk.yellow(output));
  const { default: inquirer } = await import("inquirer"); // Dynamiczny import
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Menu:",
        pageSize: 7,
        choices: [
          "- Run tasks",
          "- Create task",
          "- View tasks",
          "- List employees",
          new inquirer.Separator(),
          "- Exit",
          new inquirer.Separator(),
          "- Reset app",
          new inquirer.Separator(),
        ],
      },
    ]);

    switch (action) {
      case "- List employees":
        await company.listEmployees();
        break;
      case "- Run tasks":
        await company.processAllTasks();
        break;
      case "- Create task":
        await company.createTask();
        break;
      case "- View tasks":
        await company.viewTasks();
        break;
      case "- Reset app":
        await resetApp();
        break;
      case "- Exit":
        OutputHelper.info("Zamykanie aplikacji.");
        process.exit(0);
    }
  }
}

main().catch((err) => OutputHelper.error(err));
