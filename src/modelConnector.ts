import ora from "ora";
import { 
  Task, 
  TaskAnalysis, 
  TaskCreationData, 
  TaskResult, 
  ReviewResult, 
  FinalReviewResult, 
  TaskWithSubordinates 
} from "./types/task.types.js";
import { MockAPIService } from "./mockServices.js";
import { IModelConnector } from "./types/modelConnector.types.js";
import { OrganizationStateManager } from "./organizationState.js";
import { TaskManager } from "./taskManager.js";

export class ModelConnector implements IModelConnector {
  private API_URL: string;
  private API_KEY: string;
  public externalServices: MockAPIService;
  private orgStateManager: OrganizationStateManager;
  private taskManager: TaskManager;

  constructor(configPath: string, taskManager: TaskManager) {
    this.API_URL = "https://api.openai.com/v1/chat/completions";
    this.API_KEY = process.env.OPENAI_API_KEY || "";
    this.externalServices = new MockAPIService();
    this.orgStateManager = new OrganizationStateManager(configPath);
    this.taskManager = taskManager;
  }

  private async convertSuggestionToTask(suggestion: any): Promise<Task> {
    return {
      id: Date.now(),
      title: suggestion.title,
      what: suggestion.description,
      who: suggestion.who || "SYSTEM",
      to: suggestion.assignee,
      type: suggestion.type,
      status: "pending",
      created: new Date().toISOString()
    };
  }

  async analyzeOrganizationState(): Promise<void> {
    const state = this.orgStateManager.getState();
    const prompt = `
      Przeanalizuj stan organizacji i zaproponuj działania:
      ${JSON.stringify(state, null, 2)}
    `;

    const response = await this.callLLM(prompt);
    const analysis = JSON.parse(response);
    
    if (analysis.shouldCreateTasks) {
      await this.createAutonomousTasks(analysis.suggestedTasks);
    }
  }

  private async callLLM(prompt: string): Promise<string> {
    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "system", content: prompt }],
      }),
    });

    const responseData = await response.json();
    return responseData.choices[0].message.content;
  }

  private async createAutonomousTasks(suggestions: any[]): Promise<void> {
    const state = this.orgStateManager.getState();
    const config = state.autonomyConfig;

    for (const suggestion of suggestions) {
      if (this.validateTaskSuggestion(suggestion, config)) {
        const task = await this.convertSuggestionToTask(suggestion);
        await this.taskManager.updateTask(task);
      }
    }
  }

  private validateTaskSuggestion(suggestion: any, config: any): boolean {
    if (!suggestion.title || !suggestion.description || !suggestion.assignee) {
      return false;
    }
    return true;
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
      3. Określ typ zadania`;

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
    role: string,
    permissions: string[]
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