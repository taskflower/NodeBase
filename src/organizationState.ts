import { Task } from './types/task.types.js';

export interface OrganizationProcess {
  id: string;
  name: string;
  description: string;
  requiredPermissions: string[];
  roles: string[];
  metrics: MetricConfig[];
}

export interface MetricConfig {
  name: string;
  threshold: number;
  escalateToRole?: string;
}

export interface AutonomyConfig {
  maxTasksPerDay: number;
  maxBudgetPerTask: number;
  requireApprovalFrom: string[];
  autoEscalateAfterHours: number;
}

export interface OrganizationState {
  processes: OrganizationProcess[];
  autonomyConfig: AutonomyConfig;
  activeProcesses: { [processId: string]: Task[] };
}

export class OrganizationStateManager {
  private state: OrganizationState;
  private configPath: string;

  constructor(configPath: string) {
    this.configPath = configPath;
    this.state = this.loadInitialState();
  }

  private loadInitialState(): OrganizationState {
    // Load from config file
    return {
      processes: [],
      autonomyConfig: {
        maxTasksPerDay: 10,
        maxBudgetPerTask: 1000,
        requireApprovalFrom: ['CEO'],
        autoEscalateAfterHours: 24
      },
      activeProcesses: {}
    };
  }

  public getState(): OrganizationState {
    return this.state;
  }

  public updateConfig(newConfig: Partial<AutonomyConfig>): void {
    this.state.autonomyConfig = { ...this.state.autonomyConfig, ...newConfig };
  }

  public addProcess(process: OrganizationProcess): void {
    this.state.processes.push(process);
  }

  public trackTask(processId: string, task: Task): void {
    if (!this.state.activeProcesses[processId]) {
      this.state.activeProcesses[processId] = [];
    }
    this.state.activeProcesses[processId].push(task);
  }
}