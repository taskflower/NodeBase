import { Task } from "./task.types";

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