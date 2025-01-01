import ora from "ora";
import { 
  Task, 
  TaskAnalysis, 
  TaskCreationData, 
  TaskResult, 
  ReviewResult, 
  FinalReviewResult, 
  TaskWithSubordinates 
} from "./types/task.types.js"; // Dodano .js
import { MockAPIService } from "./mockServices.js"; // Dodano .js
import { IModelConnector } from "./types/modelConnector.types.js"; // Dodano .js

export class ModelConnector implements IModelConnector {
  private API_URL: string;
  private API_KEY: string;
  public externalServices: MockAPIService;

  constructor() {
    this.API_URL = "https://api.openai.com/v1/chat/completions";
    this.API_KEY = process.env.OPENAI_API_KEY || "";
    this.externalServices = new MockAPIService();
  }

  async analyzeTask(data: TaskCreationData): Promise<TaskAnalysis> {
    const prompt = `
      Jako ${data.creatorRole}, stwórz zadanie dla ${data.assigneeRole}.
      
      Kontekst organizacyjny:
      - Dostępne uprawnienia wykonawcy: ${data.availablePermissions.join(", ")}
      - Podwładni wykonawcy: ${data.subordinates.map(s => `${s.role} (${s.permissions.join(", ")})`).join("; ") || "brak"}
      
      Utwórz zadanie, które:
      1. Jest odpowiednie dla roli i uprawnień wykonawcy
      2. Jeśli to potrzebne, podziel je na podtaski dla podwładnych
      3. Określ typ zadania
      
      Odpowiedź sformatuj jako JSON:
      {
        "title": "Tytuł zadania",
        "description": "Szczegółowy opis głównego zadania",
        "assignee_id": "${data.assigneeId}",
        "type": "${data.type}",
        "needs_split": true/false,
        "subtasks": [
          {
            "title": "Tytuł podtaska",
            "description": "Szczegółowy opis podtaska",
            "type": "typ podtaska"
          }
        ]
      }`;

    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: prompt }],
      }),
    });

    const responseData = await response.json();
    return JSON.parse(responseData.choices[0].message.content);
  }

  async processTask(
    task: TaskWithSubordinates,
    role: string
  ): Promise<TaskResult | ReviewResult | FinalReviewResult> {
    const spinner = ora(`Przetwarzanie zadania dla roli ${role}...`).start();

    try {
      const service = this.externalServices.getServiceByType(task.type);
      
      if (!service) {
        spinner.warn(`⚠️ Brak odpowiedniej usługi dla typu: ${task.type}`);
        
        return {
          output: JSON.stringify({
            warning: `Brak zdefiniowanej usługi dla typu: ${task.type}`,
            timestamp: new Date().toISOString(),
          }),
          timestamp: new Date().toISOString()
        };
      }

      spinner.text = `Przetwarzanie zadania za pomocą usługi: ${task.type}`;
      const result = await service({ title: task.title, description: task.what });
      
      spinner.succeed("Zadanie przetworzone pomyślnie.");
      return {
        output: typeof result === 'string' ? result : JSON.stringify(result),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      spinner.fail("Błąd podczas przetwarzania zadania.");
      throw error;
    }
  }
}